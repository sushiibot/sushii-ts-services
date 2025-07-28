import { Events, Guild, GuildAuditLogsEntry } from "discord.js";
import { Logger } from "pino";

import { EventHandlerFn } from "@/events/EventHandler";
import { GuildSettingsService } from "@/features/guild-settings/application/GuildSettingsService";

import { DiscordAuditLogService } from "../../infrastructure";

/**
 * Presentation layer event handler for Discord audit log entries.
 * Adapts Discord.js events to the moderation DDD architecture.
 */
export class AuditLogEventHandler {
  constructor(
    private readonly discordAuditLogService: DiscordAuditLogService,
    private readonly logger: Logger,
  ) {}

  /**
   * Creates an event handler function for Discord.js event registration.
   */
  createHandler(): EventHandlerFn<Events.GuildAuditLogEntryCreate> {
    return async (entry: GuildAuditLogsEntry, guild: Guild): Promise<void> => {
      try {
        const result = await this.discordAuditLogService.handleAuditLogEntry(
          entry,
          guild,
        );

        if (result.err) {
          this.logger.error(
            {
              err: result.val,
              guildId: guild.id,
              action: entry.action,
              targetId: entry.targetId,
            },
            "Failed to handle audit log entry",
          );
        }
      } catch (error) {
        this.logger.error(
          {
            err: error,
            guildId: guild.id,
            action: entry.action,
            targetId: entry.targetId,
          },
          "Unexpected error in audit log event handler",
        );
      }
    };
  }
}

/**
 * Factory function to create an AuditLogEventHandler with dependencies.
 * Maintains compatibility with existing event handler registration pattern.
 */
export function createAuditLogEventHandler(
  discordAuditLogService: DiscordAuditLogService,
  logger: Logger,
): EventHandlerFn<Events.GuildAuditLogEntryCreate> {
  const handler = new AuditLogEventHandler(discordAuditLogService, logger);
  return handler.createHandler();
}