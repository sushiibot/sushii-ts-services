import { DiscordAPIError, EmbedBuilder, Guild, RESTJSONErrorCodes, TimestampStyles, User } from "discord.js";
import { Err, Ok, Result } from "ts-results";
import { Logger } from "pino";

import { MODERATION_DM_DEFAULTS } from "@/features/guild-settings/domain/constants/ModerationDefaults";
import dayjs from "@/shared/domain/dayjs";
import { GuildConfig } from "@/shared/domain/entities/GuildConfig";
import Color from "@/utils/colors";
import toTimestamp from "@/utils/toTimestamp";

import { ActionType, actionTypeSupportsDM } from "../domain/value-objects/ActionType";
import { Reason } from "../domain/value-objects/Reason";

/**
 * Application service for building and sending DM notifications for moderation actions.
 * Handles the business logic for when and how to send moderation DMs.
 */
export class DMNotificationService {
  constructor(private readonly logger: Logger) {}

  /**
   * Builds a DM embed for moderation actions.
   */
  buildDMEmbed(
    guild: Guild,
    action: ActionType,
    shouldDMReason: boolean,
    reason: Reason | null,
    durationEnd: dayjs.Dayjs | null,
    customText?: string | null,
  ): EmbedBuilder {
    const fields = [];

    if (shouldDMReason && reason) {
      fields.push({
        name: "Reason",
        value: reason.value,
      });
    }

    // Timeout or tempban
    if (durationEnd) {
      const actionName = this.getActionDisplayName(action);
      fields.push({
        name: "Duration",
        value: `Your ${actionName} will expire ${toTimestamp(
          durationEnd,
          TimestampStyles.RelativeTime,
        )}`,
      });
    }

    // Use custom text if provided, otherwise fall back to defaults
    let title: string;
    if (customText) {
      title = customText;
    } else {
      title = this.getDefaultDMTitle(action);
    }

    return new EmbedBuilder()
      .setTitle(title)
      .setAuthor({
        name: guild.name,
        iconURL: guild.iconURL() || undefined,
      })
      .setFields(fields)
      .setColor(Color.Warning);
  }

  /**
   * Sends a moderation DM to the target user.
   */
  async sendModerationDM(
    targetUser: User,
    guild: Guild,
    action: ActionType,
    shouldDMReason: boolean,
    reason: Reason | null,
    durationEnd: dayjs.Dayjs | null,
    guildConfig?: GuildConfig,
    customText?: string | null,
  ): Promise<Result<DMSentResult, string>> {
    // Check if this action type supports DMs
    if (!actionTypeSupportsDM(action)) {
      return Err(`Action type ${action} does not support DM notifications`);
    }

    try {
      // Get custom text from guild config if not provided directly
      let dmText = customText;
      if (!dmText && guildConfig) {
        dmText = this.getGuildCustomDMText(action, guildConfig);
      }

      const embed = this.buildDMEmbed(
        guild,
        action,
        shouldDMReason,
        reason,
        durationEnd,
        dmText,
      );

      this.logger.info(
        {
          actionType: action,
          targetUserId: targetUser.id,
          guildId: guild.id,
          hasCustomText: !!dmText,
          shouldDMReason,
        },
        "Sending moderation DM to user",
      );

      const dmMessage = await targetUser.send({
        embeds: [embed],
      });

      this.logger.debug(
        {
          targetUserId: targetUser.id,
          guildId: guild.id,
          dmChannelId: dmMessage.channel.id,
          dmMessageId: dmMessage.id,
        },
        "Successfully sent moderation DM",
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
          actionType: action,
          targetUserId: targetUser.id,
          guildId: guild.id,
        },
        "Failed to send moderation DM to user",
      );

      if (error instanceof DiscordAPIError) {
        if (error.code === RESTJSONErrorCodes.CannotSendMessagesToThisUser) {
          return Ok({
            channelId: null,
            messageId: null,
            error: "User has DMs disabled or bot is blocked.",
          });
        }
      }

      const errorMessage = error instanceof Error ? error.message : String(error);
      return Ok({
        channelId: null,
        messageId: null,
        error: errorMessage,
      });
    }
  }

  /**
   * Gets the default DM title for an action type.
   */
  private getDefaultDMTitle(action: ActionType): string {
    switch (action) {
      case ActionType.Timeout:
        return MODERATION_DM_DEFAULTS.TIMEOUT_DM_TEXT;
      case ActionType.Warn:
        return MODERATION_DM_DEFAULTS.WARN_DM_TEXT;
      case ActionType.Ban:
        return MODERATION_DM_DEFAULTS.BAN_DM_TEXT;
      case ActionType.TimeoutRemove:
        return "Your timeout was removed";
      case ActionType.TempBan:
        return "You have been temporarily banned";
      case ActionType.Kick:
        return "You have been kicked";
      default:
        return `You have been ${this.getActionDisplayName(action)}`;
    }
  }

  /**
   * Gets the display name for an action type.
   */
  private getActionDisplayName(action: ActionType): string {
    switch (action) {
      case ActionType.Ban:
        return "banned";
      case ActionType.TempBan:
        return "temporarily banned";
      case ActionType.Kick:
        return "kicked";
      case ActionType.Timeout:
        return "timeout";
      case ActionType.TimeoutRemove:
        return "timeout removal";
      case ActionType.Warn:
        return "warned";
      default:
        return action;
    }
  }

  /**
   * Gets custom DM text from guild configuration.
   */
  private getGuildCustomDMText(action: ActionType, guildConfig: GuildConfig): string | null {
    switch (action) {
      case ActionType.Timeout:
        return guildConfig.moderationSettings.timeoutDmText;
      case ActionType.Warn:
        return guildConfig.moderationSettings.warnDmText;
      case ActionType.Ban:
      case ActionType.TempBan:
        return guildConfig.moderationSettings.banDmText;
      default:
        return null;
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