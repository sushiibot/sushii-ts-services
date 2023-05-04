import {
  Client,
  ClientEvents,
  Events,
  GatewayDispatchEvents,
  GatewayDispatchPayload,
} from "discord.js";
import * as Sentry from "@sentry/node";
import fs from "fs";
import v8 from "v8";
import logger from "./logger";
import InteractionClient from "./client";
import { EventHandlerFn } from "./events/EventHandler";
import Context from "./model/context";
import legacyModLogNotifierHandler from "./events/GuildBanAdd/LegacyModLogNotifier";
import modLogHandler from "./events/ModLogHandler";
import { msgLogHandler } from "./events/msglog/MsgLogHandler";
import msgLogCacheHandler from "./events/msglog/MessageCacheHandler";
import levelHandler from "./events/LevelHandler";
import webhookLog from "./webhookLogger";
import Color from "./utils/colors";
import { StatName, updateStat } from "./tasks/StatsTask";

async function handleEvent<K extends keyof ClientEvents>(
  ctx: Context,
  eventType: K,
  handlers: EventHandlerFn<K>[],
  ...args: ClientEvents[K]
): Promise<void> {
  const results = await Promise.allSettled(
    handlers.map((h) => h(ctx, ...args))
  );

  for (const result of results) {
    if (result.status === "rejected") {
      Sentry.captureException(result.reason, {
        tags: {
          type: "event",
          event: eventType,
        },
      });

      logger.error(
        { err: result.reason },
        "error handling event %s",
        eventType
      );
    }
  }
}

async function runParallel(
  eventType: string,
  promises: Promise<void>[]
): Promise<void> {
  const results = await Promise.allSettled(promises);

  for (const result of results) {
    if (result.status === "rejected") {
      Sentry.captureException(result.reason, {
        tags: {
          type: "event",
          event: eventType,
        },
      });

      logger.error(
        { err: result.reason },
        "error handling event %s",
        eventType
      );
    }
  }
}

export default function registerEventHandlers(
  ctx: Context,
  client: Client,
  interactionHandler: InteractionClient
): void {
  client.once(Events.ClientReady, async (c) => {
    logger.info(`Ready! Logged in as ${c.user.tag}`);

    await webhookLog("Ready", `Logged in as ${c.user.tag}`, Color.Success);
  });

  client.on(Events.Debug, async (msg) => {
    logger.debug(msg);
  });

  client.on(Events.ShardReady, async (shardId, unavailableGuilds) => {
    logger.info(
      {
        shardId,
        unavailableGuilds,
      },
      "Shard ready"
    );

    await webhookLog(
      `[Shard ${shardId}] Ready`,
      `${unavailableGuilds} unavailable guilds`,
      Color.Success
    );
  });

  client.on(Events.ShardDisconnect, async (closeEvent, shardId) => {
    logger.info(
      {
        shardId,
        event: closeEvent,
      },
      "Shard disconnected"
    );

    await webhookLog(`[Shard ${shardId}] Disconnected`, "", Color.Warning);
  });

  client.on(Events.ShardError, async (error, shardId) => {
    logger.error(
      {
        shardId,
        error,
      },
      "Shard error"
    );

    await webhookLog(`[Shard ${shardId}] Error`, error.message, Color.Error);
  });

  client.on(Events.ShardReconnecting, async (shardId) => {
    logger.info(
      {
        shardId,
      },
      "Shard reconnecting"
    );

    await webhookLog(`[Shard ${shardId}] Reconnecting`, "", Color.Warning);
  });

  client.on(Events.ShardResume, async (shardId, replayedEvents) => {
    logger.info(
      {
        shardId,
        replayedEvents,
      },
      "Shard resumed"
    );

    await webhookLog(
      `[Shard ${shardId}] Resume`,
      `replayed ${replayedEvents} events`,
      Color.Success
    );
  });

  client.on(Events.GuildCreate, async (guild) => {
    logger.info(
      {
        guildId: guild.id,
      },
      "Joined guild %s",
      guild.name
    );

    await webhookLog(
      "Joined guild",
      `${guild.name} (${guild.id}) - ${guild.memberCount} members`,
      Color.Info
    );
  });

  client.on(Events.GuildDelete, async (guild) => {
    logger.info(
      {
        guildId: guild.id,
      },
      "Removed guild %s",
      guild.name
    );

    await webhookLog(
      "Left guild",
      `${guild.name} (${guild.id}) - ${guild.memberCount} members`,
      Color.Error
    );
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    try {
      await interactionHandler.handleAPIInteraction(interaction);

      await updateStat(StatName.CommandCount, 1, "add");
    } catch (err) {
      logger.error(
        {
          err,
          interaction,
        },
        "Error handling interaction"
      );
    }
  });

  client.on(Events.GuildAuditLogEntryCreate, async (entry, guild) => {
    await handleEvent(
      ctx,
      Events.GuildAuditLogEntryCreate,
      [modLogHandler],
      entry,
      guild
    );
  });

  client.on(Events.GuildBanAdd, async (guildBan) => {
    await handleEvent(
      ctx,
      Events.GuildBanAdd,
      [legacyModLogNotifierHandler],
      guildBan
    );
  });

  client.on(Events.MessageCreate, async (msg) => {
    if (msg.author.id === "150443906511667200" && msg.content === "heapdump") {
      logger.info("Generating heapdump");

      const snapshotStream = v8.getHeapSnapshot();
      // It's important that the filename end with `.heapsnapshot`,
      // otherwise Chrome DevTools won't open it.
      const fileName = `${Date.now()}.heapsnapshot`;
      const fileStream = fs.createWriteStream(fileName);
      snapshotStream.pipe(fileStream);

      logger.info("heapdump done");
    }

    await handleEvent(ctx, Events.MessageCreate, [levelHandler], msg);
  });

  client.on(Events.Raw, async (event: GatewayDispatchPayload) => {
    if (event.t === GatewayDispatchEvents.MessageDelete) {
      await runParallel(event.t, [msgLogHandler(ctx, event.t, event.d)]);
    }

    if (event.t === GatewayDispatchEvents.MessageDeleteBulk) {
      await runParallel(event.t, [msgLogHandler(ctx, event.t, event.d)]);
    }

    if (event.t === GatewayDispatchEvents.MessageUpdate) {
      // Log first to keep old message, then cache after for new update.
      // Fine to await since each event is a specific type, no other types that
      // this blocks.
      await msgLogHandler(ctx, event.t, event.d);
      await msgLogCacheHandler(ctx, event.t, event.d);
    }

    if (event.t === GatewayDispatchEvents.MessageCreate) {
      await runParallel(event.t, [msgLogCacheHandler(ctx, event.t, event.d)]);
    }
  });

  logger.info("Registered Discord.js event handlers");
}
