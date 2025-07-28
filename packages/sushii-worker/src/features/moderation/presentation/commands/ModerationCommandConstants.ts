import {
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";

import { ActionType } from "../../domain/value-objects/ActionType";
import { ModerationCommandConfig } from "./ModerationCommand";
import {
  addAttachmentOption,
  addDaysToDeleteOption,
  addDmReasonOption,
  addDurationOption,
  addReasonOption,
  addUsersOption,
} from "./ModerationCommandOptions";

export const OPTION_NAMES = {
  USERS: "users",
  REASON: "reason",
  ATTACHMENT: "attachment",
  DM_REASON: "dm_reason",
  DAYS_TO_DELETE: "days_to_delete",
  DURATION: "duration",
  CHANNEL: "channel",
} as const;

export const COMMAND_METADATA = {
  BAN: {
    name: "ban",
    description: "Ban users from the server",
  },
  WARN: {
    name: "warn",
    description: "Warn members for rule violations",
  },
  TEMPBAN: {
    name: "tempban",
    description: "Temporarily ban users",
  },
  KICK: {
    name: "kick",
    description: "Kick users from the server",
  },
  TIMEOUT: {
    name: "timeout",
    description: "Timeout users",
  },
} as const;

export const COMMAND_CONFIGS: Record<string, ModerationCommandConfig> = {
  BAN: {
    actionType: ActionType.Ban,
    name: COMMAND_METADATA.BAN.name,
    description: COMMAND_METADATA.BAN.description,
    permissions: PermissionFlagsBits.BanMembers,
    options: (builder: SlashCommandBuilder) =>
      builder
        .addStringOption(addUsersOption)
        .addStringOption(addReasonOption)
        .addIntegerOption(addDaysToDeleteOption)
        .addAttachmentOption(addAttachmentOption)
        .addStringOption(addDmReasonOption),
  },
  WARN: {
    actionType: ActionType.Warn,
    name: COMMAND_METADATA.WARN.name,
    description: COMMAND_METADATA.WARN.description,
    permissions: PermissionFlagsBits.BanMembers,
    requiresReason: true,
    options: (builder: SlashCommandBuilder) =>
      builder
        .addStringOption(addUsersOption)
        // Required for warn commands
        .addStringOption((o) => addReasonOption(o, true))
        // No DM option for warn command, as doesn't make sense to not DM warning
        .addAttachmentOption(addAttachmentOption),
  },
  TEMPBAN: {
    actionType: ActionType.TempBan,
    name: COMMAND_METADATA.TEMPBAN.name,
    description: COMMAND_METADATA.TEMPBAN.description,
    permissions: PermissionFlagsBits.BanMembers,
    options: (builder: SlashCommandBuilder) =>
      builder
        .addStringOption(addUsersOption)
        .addStringOption(addDurationOption)
        .addStringOption(addReasonOption)
        .addAttachmentOption(addAttachmentOption)
        .addStringOption(addDmReasonOption),
  },
  KICK: {
    actionType: ActionType.Kick,
    name: COMMAND_METADATA.KICK.name,
    description: COMMAND_METADATA.KICK.description,
    permissions: PermissionFlagsBits.KickMembers,
    options: (builder: SlashCommandBuilder) =>
      builder
        .addStringOption(addUsersOption)
        .addStringOption(addReasonOption)
        .addAttachmentOption(addAttachmentOption)
        .addStringOption(addDmReasonOption),
  },
  TIMEOUT: {
    actionType: ActionType.Timeout,
    name: COMMAND_METADATA.TIMEOUT.name,
    description: COMMAND_METADATA.TIMEOUT.description,
    permissions: PermissionFlagsBits.ModerateMembers,
    options: (builder: SlashCommandBuilder) =>
      builder
        .addStringOption(addUsersOption)
        .addStringOption(addDurationOption)
        .addStringOption(addReasonOption)
        .addAttachmentOption(addAttachmentOption)
        .addStringOption(addDmReasonOption),
  },
};
