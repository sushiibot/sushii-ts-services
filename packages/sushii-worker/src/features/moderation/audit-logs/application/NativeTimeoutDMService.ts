import { DiscordAPIError, Guild, User } from "discord.js";
import { Logger } from "pino";
import { Err, Ok, Result } from "ts-results";

import { buildDMEmbed } from "@/interactions/moderation/sendDm";
import { GuildConfig } from "@/shared/domain/entities/GuildConfig";

import { AuditLogEvent } from "../domain/entities";

/**
 * Application service for sending DM notifications for native Discord timeouts.
 * Handles the business logic for when and how to send timeout DMs.
 */
export class NativeTimeoutDMService {
  constructor(private readonly logger: Logger) {}

  /**
   * Determines if a DM should be sent for this audit log event.
   */
  shouldSendDM(
    auditLogEvent: AuditLogEvent,
    hasPendingCase: boolean,
    guildConfig?: GuildConfig,
  ): boolean {
    // Was invoked via command, so there was already a DM sent.
    if (hasPendingCase) {
      return false;
    }

    // Only timeout and timeout removal actions
    if (!auditLogEvent.shouldSendNativeTimeoutDM()) {
      return false;
    }

    // Don't DM for timeout adjustments (only bots can do this)
    if (auditLogEvent.isTimeoutAdjustment()) {
      return false;
    }

    // Check guild settings preference for native timeout DMs
    if (guildConfig) {
      return guildConfig.moderationSettings.timeoutNativeDmEnabled;
    }

    // Default to not sending if no guild config
    return false;
  }

  /**
   * Sends a timeout DM to the target user.
   */
  async sendTimeoutDM(
    auditLogEvent: AuditLogEvent,
    targetUser: User,
    guild: Guild,
    guildConfig?: GuildConfig,
  ): Promise<Result<DMSentResult, string>> {
    try {
      if (!auditLogEvent.timeoutChange) {
        return Err("No timeout change data available");
      }

      this.logger.info(
        {
          actionType: auditLogEvent.actionType,
          timeoutChange: auditLogEvent.timeoutChange,
          targetUserId: targetUser.id,
          guildId: guild.id,
        },
        "Sending timeout DM to user",
      );

      // Get custom timeout DM text if available
      const customText = guildConfig?.moderationSettings.timeoutDmText || null;

      const dmEmbed = await buildDMEmbed(
        guild,
        auditLogEvent.actionType,
        true, // should dm reason
        auditLogEvent.reason || null,
        auditLogEvent.timeoutChange.newTimestamp || null,
        customText,
      );

      const dmMessage = await targetUser.send({
        embeds: [dmEmbed],
      });

      this.logger.debug(
        {
          targetUserId: targetUser.id,
          guildId: guild.id,
          dmChannelId: dmMessage.channel.id,
          dmMessageId: dmMessage.id,
        },
        "Successfully sent timeout DM",
      );

      return Ok({
        channelId: dmMessage.channel.id,
        messageId: dmMessage.id,
        error: null,
      });
    } catch (error) {
      this.logger.debug(
        {
          err: error,
          actionType: auditLogEvent.actionType,
          timeoutChange: auditLogEvent.timeoutChange,
          targetUserId: targetUser.id,
          guildId: guild.id,
        },
        "Failed to send timeout DM to user",
      );

      const errorMessage =
        error instanceof DiscordAPIError ? error.message : String(error);

      return Ok({
        channelId: null,
        messageId: null,
        error: errorMessage,
      });
    }
  }
}

/**
 * Result of attempting to send a DM.
 */
export interface DMSentResult {
  channelId: string | null;
  messageId: string | null;
  error: string | null;
}
