import {
  Client,
  ClientEvents,
  Events,
  GatewayDispatchEvents,
  GatewayDispatchPayload,
} from "discord.js";
import * as Sentry from "@sentry/node";
import opentelemetry, { Span } from "@opentelemetry/api";
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
import { banPoolOnBanHandler } from "./events/ban_pool/BanPoolHandler";
import config from "./model/config";
import { isCurrentDeploymentActive } from "./db/Deployment/Deployment.repository";
import {
  memberLogJoinHandler,
  memberLogLeaveHandler,
} from "./events/MemberLog";
import { notificationHandler } from "./events/Notifications";
import {
  memberJoinMessageHandler,
  memberLeaveMessageHandler,
} from "./events/JoinLeaveMessage";
import { deployToggleHandler } from "./events/Deployment";
import { updateGatewayDispatchEventMetrics } from "./metrics/gatewayMetrics";
import { cacheUserHandler } from "./events/cache/cacheUser";
import {
  cacheGuildCreateHandler,
  cacheGuildUpdateHandler,
} from "./events/cache/cacheGuild";
import startTasks from "./tasks/startTasks";
// import { mentionTagHandler } from "./events/TagsMention";

const tracerName = "event-handler";
const tracer = opentelemetry.trace.getTracer(tracerName);
const prefixSpanName = (name: string): string => `${tracerName}.${name}`;

let lastLogTime = 0;

async function isActive(): Promise<boolean> {
  const active = await isCurrentDeploymentActive();
  if (!active) {
    const currentTime = Date.now();

    // Log max one time every 10 seconds
    if (currentTime - lastLogTime >= 10000) {
      logger.info(
        {
          processDeploymentName: config.DEPLOYMENT_NAME,
        },
        "Not active deployment, ignoring events",
      );
      lastLogTime = currentTime;
    }
  }

  return active;
}

async function handleEvent<K extends keyof ClientEvents>(
  ctx: Context,
  eventType: K,
  handlers: Record<string, EventHandlerFn<K>>,
  ...args: ClientEvents[K]
): Promise<void> {
  // Use handlerNames for iteration to preserve order
  const handlerNames = Object.keys(handlers);

  // Same order as handlerNames
  const results = await Promise.allSettled(
    handlerNames.map((name) => handlers[name](ctx, ...args)),
  );

  for (let i = 0; i < results.length; i += 1) {
    const result = results[i];
    const handlerName = handlerNames[i];

    if (result.status === "rejected") {
      Sentry.captureException(result.reason, {
        tags: {
          type: "event",
          event: eventType,
          // Track which handler failed
          handlerName,
        },
      });

      logger.error(
        {
          err: result.reason,
          handlerName,
        },
        "error handling event %s",
        eventType,
      );
    }
  }
}

async function runParallel(
  eventType: string,
  promises: Promise<void>[],
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
        eventType,
      );
    }
  }
}

export default function registerEventHandlers(
  ctx: Context,
  client: Client,
  interactionHandler: InteractionClient,
): void {
  client.once(Events.ClientReady, async (c) => {
    logger.info(
      {
        botUser: c.user.tag,
        deployment: config.DEPLOYMENT_NAME,
      },
      "Ready!",
    );

    await webhookLog("Ready", `Logged in as ${c.user.tag}`, Color.Success);

    // After after client is ready to ensure guilds are cached
    await startTasks(ctx);

    await tracer.startActiveSpan(
      prefixSpanName(Events.ClientReady),
      async (span: Span) => {
        // Check to make Client<true> instead of Client<bool>
        if (client.isReady()) {
          await handleEvent(
            ctx,
            Events.ClientReady,
            {
              banReady: banReadyHandler,
              emojiAndStickerStatsReady: emojiAndStickerStatsReadyHandler,
            },
            client,
          );
        }

        span.end();
      },
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
      "Shard ready",
    );

    await webhookLog(
      `[Shard ${shardId}] Ready`,
      `unavailable guilds: \`${unavailableGuilds || "none"}\``,
      Color.Success,
    );
  });

  client.on(Events.ShardDisconnect, async (closeEvent, shardId) => {
    logger.info(
      {
        shardId,
        event: closeEvent,
      },
      "Shard disconnected",
    );

    await webhookLog(`[Shard ${shardId}] Disconnected`, "", Color.Warning);
  });

  client.on(Events.ShardError, async (error, shardId) => {
    logger.error(
      {
        shardId,
        error,
      },
      "Shard error",
    );

    await webhookLog(`[Shard ${shardId}] Error`, error.message, Color.Error);
  });

  client.on(Events.ShardReconnecting, async (shardId) => {
    logger.info(
      {
        shardId,
      },
      "Shard reconnecting",
    );
  });

  client.on(Events.ShardResume, async (shardId, replayedEvents) => {
    logger.info(
      {
        shardId,
        replayedEvents,
      },
      "Shard resumed",
    );
  });

  client.on(Events.GuildCreate, async (guild) => {
    logger.info(
      {
        guildId: guild.id,
      },
      "Joined guild %s",
      guild.name,
    );

    await webhookLog(
      "Joined guild",
      `${guild.name} (${guild.id}) - ${guild.memberCount} members`,
      Color.Info,
    );

    if (!(await isActive())) {
      return;
    }

    await tracer.startActiveSpan(
      prefixSpanName(Events.GuildCreate),
      async (span: Span) => {
        await handleEvent(
          ctx,
          Events.GuildCreate,
          {
            cacheGuildCreate: cacheGuildCreateHandler,
          },
          guild,
        );

        span.end();
      },
    );
  });

  client.on(Events.GuildUpdate, async (oldGuild, newGuild) => {
    if (!(await isActive())) {
      return;
    }

    await tracer.startActiveSpan(
      prefixSpanName(Events.GuildUpdate),
      async (span: Span) => {
        await handleEvent(
          ctx,
          Events.GuildUpdate,
          {
            cacheGuildUpdate: cacheGuildUpdateHandler,
          },
          oldGuild,
          newGuild,
        );

        span.end();
      },
    );
  });

  client.on(Events.GuildDelete, async (guild) => {
    logger.info(
      {
        guildId: guild.id,
      },
      "Removed guild %s",
      guild.name,
    );

    await webhookLog(
      "Left guild",
      `${guild.name} (${guild.id}) - ${guild.memberCount} members`,
      Color.Error,
    );
  });

  client.on(Events.GuildMemberAdd, async (member) => {
    if (!(await isActive())) {
      return;
    }

    await tracer.startActiveSpan(
      prefixSpanName(Events.GuildMemberAdd),
      async (span: Span) => {
        await handleEvent(
          ctx,
          Events.GuildMemberAdd,
          {
            memberLogJoin: memberLogJoinHandler,
            memberjoinMsg: memberJoinMessageHandler,
          },
          member,
        );

        span.end();
      },
    );
  });

  client.on(Events.GuildMemberRemove, async (member) => {
    if (!(await isActive())) {
      return;
    }

    await tracer.startActiveSpan(
      prefixSpanName(Events.GuildMemberRemove),
      async (span: Span) => {
        await handleEvent(
          ctx,
          Events.GuildMemberRemove,
          {
            memberLogLeave: memberLogLeaveHandler,
            memberLeaveMsg: memberLeaveMessageHandler,
          },
          member,
        );

        span.end();
      },
    );
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!(await isActive())) {
      return;
    }

    await tracer.startActiveSpan(
      prefixSpanName(Events.InteractionCreate),
      async (span: Span) => {
        await interactionHandler.handleAPIInteraction(interaction);
        await updateStat(StatName.CommandCount, 1, "add");

        span.end();
      },
    );
  });

  client.on(Events.GuildAuditLogEntryCreate, async (entry, guild) => {
    if (!(await isActive())) {
      return;
    }

    await tracer.startActiveSpan(
      prefixSpanName(Events.GuildAuditLogEntryCreate),
      async (span: Span) => {
        await handleEvent(
          ctx,
          Events.GuildAuditLogEntryCreate,
          { modLog: modLogHandler },
          entry,
          guild,
        );

        span.end();
      },
    );
  });

  client.on(Events.GuildBanAdd, async (guildBan) => {
    if (!(await isActive())) {
      return;
    }

    await tracer.startActiveSpan(
      prefixSpanName(Events.GuildBanAdd),
      async (span: Span) => {
        const handlers: Record<string, EventHandlerFn<Events.GuildBanAdd>> = {
          legacyModLogNotifier: legacyModLogNotifierHandler,
          banCache: banCacheBanHandler,
        };

        // Only handle ban pool events if the flag is enabled
        if (config.BAN_POOL_ENABLED) {
          handlers.banPoolOnBan = banPoolOnBanHandler;
        }

        await handleEvent(ctx, Events.GuildBanAdd, handlers, guildBan);

        span.end();
      },
    );
  });

  client.on(Events.GuildBanRemove, async (guildBan) => {
    if (!(await isActive())) {
      return;
    }

    await tracer.startActiveSpan(
      prefixSpanName(Events.GuildBanRemove),
      async (span: Span) => {
        await handleEvent(
          ctx,
          Events.GuildBanRemove,
          { banCacheUnban: banCacheUnbanHandler },
          guildBan,
        );

        span.end();
      },
    );
  });

  client.on(Events.MessageCreate, async (msg) => {
    if (!(await isActive())) {
      return;
    }

    await tracer.startActiveSpan(
      prefixSpanName(Events.MessageCreate),
      async (span: Span) => {
        await handleEvent(
          ctx,
          Events.MessageCreate,
          {
            level: levelHandler,
            emojiStats: emojiStatsMsgHandler,
            notification: notificationHandler,
            deployToggle: deployToggleHandler,
            cacheUser: cacheUserHandler,
            // TODO: Enable only after removed from sushii-2
            // mentionTag: mentionTagHandler,
          },
          msg,
        );

        span.end();
      },
    );
  });

  client.on(Events.MessageReactionAdd, async (reaction, user) => {
    if (!(await isActive())) {
      return;
    }

    await tracer.startActiveSpan(
      prefixSpanName(Events.MessageReactionAdd),
      async (span: Span) => {
        await handleEvent(
          ctx,
          Events.MessageReactionAdd,
          { emojiStatsReact: emojiStatsReactHandler },
          reaction,
          user,
        );

        span.end();
      },
    );
  });

  client.on(Events.Raw, async (event: GatewayDispatchPayload) => {
    updateGatewayDispatchEventMetrics(event.t);

    if (!(await isActive())) {
      return;
    }

    await tracer.startActiveSpan(
      prefixSpanName(Events.Raw),
      async (span: Span) => {
        if (event.t === GatewayDispatchEvents.MessageDelete) {
          await runParallel(event.t, [msgLogHandler(ctx, event.t, event.d)]);
        }

        if (event.t === GatewayDispatchEvents.MessageDeleteBulk) {
          await runParallel(event.t, [msgLogHandler(ctx, event.t, event.d)]);
        }

        if (event.t === GatewayDispatchEvents.MessageUpdate) {
          try {
            // Log first to keep old message, then cache after for new update.
            // Fine to await since each event is a specific type, no other types that
            // this blocks.
            await msgLogHandler(ctx, event.t, event.d);
            await msgLogCacheHandler(ctx, event.t, event.d);
          } catch (err) {
            Sentry.captureException(err, {
              tags: {
                event: "MessageUpdate",
              },
            });

            logger.error(
              {
                err,
                event,
              },
              "error handling event %s",
              event.t,
            );
          }
        }

        if (event.t === GatewayDispatchEvents.MessageCreate) {
          await runParallel(event.t, [
            msgLogCacheHandler(ctx, event.t, event.d),
          ]);
        }

        span.end();
      },
    );
  });

  logger.info("Registered Discord.js event handlers");
}
