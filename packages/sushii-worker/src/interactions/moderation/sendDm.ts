import {
  DiscordAPIError,
  EmbedBuilder,
  Guild,
  Interaction,
  Message,
  RESTJSONErrorCodes,
  TimestampStyles,
  User,
} from "discord.js";
import { Err, Ok, Result } from "ts-results";

import { MODERATION_DM_DEFAULTS } from "@/features/guild-settings/domain/constants/ModerationDefaults";
import { GuildConfig } from "@/features/guild-settings/domain/entities/GuildConfig";
import dayjs from "@/shared/domain/dayjs";

import Color from "../../utils/colors";
import toTimestamp from "../../utils/toTimestamp";
import { ActionType } from "./ActionType";
import ModActionData from "./ModActionData";

export async function buildDMEmbed(
  guild: Guild,
  action: ActionType,
  shouldDMReason: boolean,
  reason: string | null,
  durationEnd: dayjs.Dayjs | null,
  customText?: string | null,
): Promise<EmbedBuilder> {
  const fields = [];

  if (shouldDMReason && reason) {
    fields.push({
      name: "Reason",
      value: reason,
    });
  }

  // Timeout or tempban
  if (durationEnd) {
    fields.push({
      name: "Duration",
      value: `Your ${ActionType.toString(action)} will expire ${toTimestamp(
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
    // Use defaults or fallback to original logic
    switch (action) {
      case ActionType.Timeout:
        title = MODERATION_DM_DEFAULTS.TIMEOUT_DM_TEXT;
        break;
      case ActionType.Warn:
        title = MODERATION_DM_DEFAULTS.WARN_DM_TEXT;
        break;
      case ActionType.Ban:
        title = MODERATION_DM_DEFAULTS.BAN_DM_TEXT;
        break;
      case ActionType.TimeoutRemove:
        title = "Your timeout was removed";
        break;
      default:
        title = `You have been ${ActionType.toPastTense(action)}`;
    }
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

export default async function sendModActionDM(
  interaction: Interaction<"cached">,
  data: ModActionData,
  target: User,
  action: ActionType,
  guildConfig?: GuildConfig,
  customText?: string | null,
): Promise<Result<Message, string>> {
  // Get custom text from guild config if not provided directly
  let dmText = customText;
  if (!dmText && guildConfig) {
    switch (action) {
      case ActionType.Timeout:
        dmText = guildConfig.moderationSettings.timeoutDmText;
        break;
      case ActionType.Warn:
        dmText = guildConfig.moderationSettings.warnDmText;
        break;
      case ActionType.Ban:
        dmText = guildConfig.moderationSettings.banDmText;
        break;
    }
  }

  const embed = await buildDMEmbed(
    interaction.guild,
    action,
    data.shouldDMReason(action, guildConfig),
    data.reason,
    data.durationEnd(),
    dmText,
  );

  try {
    const dmMessage = await interaction.client.users.send(target.id, {
      embeds: [embed],
    });

    return Ok(dmMessage);
  } catch (err) {
    if (err instanceof DiscordAPIError) {
      if (err.code === RESTJSONErrorCodes.CannotSendMessagesToThisUser) {
        return Err("User has DMs disabled or bot is blocked.");
      }
    }

    throw err;
  }
}
