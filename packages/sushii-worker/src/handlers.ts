import {
  Client,
  ClientEvents,
  Events,
  GatewayDispatchEvents,
  GatewayDispatchPayload,
} from "discord.js";
import * as Sentry from "@sentry/node";
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
import {
  banCacheBanHandler,
  banCacheUnbanHandler,
  banReadyHandler,
} from "./events/BanCache";
import {
  emojiStatsMsgHandler,
  emojiStatsReactHandler,
  emojiAndStickerStatsReadyHandler,
} from "./events/EmojiStatsHandler";

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

    await handleEvent(
      ctx,
      Events.ClientReady,
      [banReadyHandler, emojiAndStickerStatsReadyHandler],
      client
    );
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
      `unavailable guilds: \`${unavailableGuilds || "none"}\``,
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
  });

  client.on(Events.ShardResume, async (shardId, replayedEvents) => {
    logger.info(
      {
        shardId,
        replayedEvents,
      },
      "Shard resumed"
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
    try {
      await handleEvent(
        ctx,
        Events.GuildAuditLogEntryCreate,
        [modLogHandler],
        entry,
        guild
      );
    } catch (err) {
      logger.error(
        {
          err,
          entryId: entry.id,
          guildId: guild.id,
        },
        "error handling guild audit log entry create, this should be caught"
      );
    }
  });

  client.on(Events.GuildBanAdd, async (guildBan) => {
    try {
      await handleEvent(
        ctx,
        Events.GuildBanAdd,
        [legacyModLogNotifierHandler, banCacheBanHandler],
        guildBan
      );
    } catch (err) {
      logger.error(
        {
          err,
          guildId: guildBan.guild.id,
        },
        "error handling guild ban add, this should be caught"
      );
    }
  });

  client.on(Events.GuildBanRemove, async (guildBan) => {
    try {
      await handleEvent(
        ctx,
        Events.GuildBanRemove,
        [banCacheUnbanHandler],
        guildBan
      );
    } catch (err) {
      logger.error(
        {
          err,
          guildId: guildBan.guild.id,
        },
        "error handling guild ban remove, this should be caught"
      );
    }
  });

  client.on(Events.MessageCreate, async (msg) => {
    try {
      const startTime = process.hrtime.bigint();

      await handleEvent(
        ctx,
        Events.MessageCreate,
        [levelHandler, emojiStatsMsgHandler],
        msg
      );

      const endTime = process.hrtime.bigint();
      const durationMs = Number(endTime - startTime) / 1000000;

      if (durationMs > 1000) {
        logger.debug(
          {
            id: msg.id,
            duration: `${Number(endTime - startTime) / 1000000} ms`,
          },
          "slow msg handler"
        );
      }
    } catch (err) {
      logger.error(err, "error handling message create, this should be caught");
    }
  });

  client.on(Events.MessageReactionAdd, async (reaction, user) => {
    try {
      await handleEvent(
        ctx,
        Events.MessageReactionAdd,
        [emojiStatsReactHandler],
        reaction,
        user
      );
    } catch (err) {
      logger.error(
        err,
        "error handling message reaction add, this should be caught"
      );
    }
  });

  client.on(Events.Raw, async (event: GatewayDispatchPayload) => {
    try {
      const startTime = process.hrtime.bigint();

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

      const endTime = process.hrtime.bigint();
      const durationMs = Number(endTime - startTime) / 1000000;

      if (durationMs > 1000) {
        logger.warn(
          {
            type: event.t,
            seq: event.s,
            duration: `${durationMs} ms`,
          },
          "slow raw event"
        );
      }
    } catch (err) {
      logger.error(err, "error handling raw event, this should be caught");
    }
  });

  logger.info("Registered Discord.js event handlers");
}
