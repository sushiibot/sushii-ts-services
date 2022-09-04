import {
  SlashCommandAttachmentOption,
  SlashCommandBooleanOption,
  SlashCommandIntegerOption,
  SlashCommandStringOption,
} from "@discordjs/builders";
import { ActionType } from "./ActionType";

export enum ModerationOption {
  Users = "users",
  Reason = "reason",
  Attachment = "attachment",
  DMReason = "dm_reason",
  DMMessage = "dm_message",
  DaysToDelete = "days_to_delete",
  Duration = "duration",
}

export const usersOption = (action: ActionType): SlashCommandStringOption =>
  new SlashCommandStringOption()
    .setName(ModerationOption.Users)
    .setDescription(
      `Which users to ${action}. This can be multiple users with IDs or mentions.`
    )
    .setRequired(true);

export const sendDMOption = new SlashCommandBooleanOption()
  .setName(ModerationOption.DMReason)
  .setDescription("DM the reason to the user.")
  .setRequired(false);

export const reasonOption = (action: ActionType): SlashCommandStringOption =>
  new SlashCommandStringOption()
    .setName(ModerationOption.Reason)
    .setDescription(
      `Reason for ${ActionType.toPresentTense(action)} this user.`
    )
    .setRequired(false);

export const attachmentOption = new SlashCommandAttachmentOption()
  .setName(ModerationOption.Attachment)
  .setDescription("Additional media to attach to the case.")
  .setRequired(false);

export const dmMessageOption = new SlashCommandStringOption()
  .setName(ModerationOption.DMMessage)
  .setDescription(
    "A message to DM to the user, if you want to send a message different from the reason."
  )
  .setRequired(false);

export const daysToDeleteOption = new SlashCommandIntegerOption()
  .setName(ModerationOption.DaysToDelete)
  .setDescription("Number of days to delete messages for")
  .setMaxValue(7)
  .setMinValue(0)
  .setRequired(false);
