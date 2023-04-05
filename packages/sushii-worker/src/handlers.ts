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
  client.once(Events.ClientReady, (c) => {
    logger.info(`Ready! Logged in as ${c.user.tag}`);
  });

  client.on(Events.ShardDisconnect, (closeEvent, shardId) => {
    logger.info(
      {
        shardId,
        event: closeEvent,
      },
      "Shard disconnected"
    );
  });

  client.on(Events.ShardError, (error, shardId) => {
    logger.error(
      {
        shardId,
        error,
      },
      "Shard error"
    );
  });

  client.on(Events.ShardReconnecting, (shardId) => {
    logger.info(
      {
        shardId,
      },
      "Shard reconnecting"
    );
  });

  client.on(Events.ShardResume, (shardId, replayedEvents) => {
    logger.info(
      {
        shardId,
        replayedEvents,
      },
      "Shard resumed"
    );
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    interactionHandler.handleAPIInteraction(interaction);
  });

  client.on(Events.GuildAuditLogEntryCreate, async (entry, guild) => {
    handleEvent(
      ctx,
      Events.GuildAuditLogEntryCreate,
      [modLogHandler],
      entry,
      guild
    );
  });

  client.on(Events.GuildBanAdd, async (guildBan) => {
    handleEvent(
      ctx,
      Events.GuildBanAdd,
      [legacyModLogNotifierHandler],
      guildBan
    );
  });

  client.on(Events.MessageCreate, async (msg) => {
    handleEvent(ctx, Events.MessageCreate, [levelHandler], msg);
  });

  client.on(Events.Raw, async (event: GatewayDispatchPayload) => {
    if (event.t === GatewayDispatchEvents.MessageDelete) {
      runParallel(event.t, [msgLogHandler(ctx, event.t, event.d)]);
    }

    if (event.t === GatewayDispatchEvents.MessageDeleteBulk) {
      runParallel(event.t, [msgLogHandler(ctx, event.t, event.d)]);
    }

    if (event.t === GatewayDispatchEvents.MessageUpdate) {
      runParallel(event.t, [
        msgLogHandler(ctx, event.t, event.d),
        msgLogCacheHandler(ctx, event.t, event.d),
      ]);
    }

    if (event.t === GatewayDispatchEvents.MessageCreate) {
      runParallel(event.t, [msgLogCacheHandler(ctx, event.t, event.d)]);
    }
  });
}
