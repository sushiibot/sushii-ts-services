import {
  SlashCommandAttachmentOption,
  SlashCommandIntegerOption,
  SlashCommandStringOption,
} from "@discordjs/builders";
import { ActionType } from "./ActionType";

export enum ModerationOption {
  Users = "users",
  Reason = "reason",
  Attachment = "attachment",
  DMReason = "dm_reason",
  DaysToDelete = "days_to_delete",
  Duration = "duration",
  Note = "note",
}

export enum DMReasonChoiceValue {
  Yes = "yes_dm",
  No = "no_dm",
}

export const usersOption = (action: ActionType): SlashCommandStringOption =>
  new SlashCommandStringOption()
    .setName(ModerationOption.Users)
    .setDescription(
      `Which users to ${action}. This can be multiple users with IDs or mentions.`
    )
    .setRequired(true);

export const sendDMReasonOption = new SlashCommandStringOption()
  .setName(ModerationOption.DMReason)
  .setDescription("Do you want to DM the user the reason?")
  .setChoices(
    {
      name: "Yes: DM the user the reason",
      value: DMReasonChoiceValue.Yes,
    },
    {
      name: "No: Do not DM the user the reason",
      value: DMReasonChoiceValue.No,
    }
  )
  .setRequired(false);

export const reasonOption = (
  action: ActionType,
  required: boolean = false
): SlashCommandStringOption =>
  new SlashCommandStringOption()
    .setName(ModerationOption.Reason)
    .setDescription(
      `Reason for ${ActionType.toPresentTense(action)} this user.`
    )
    .setRequired(required);

export const attachmentOption = new SlashCommandAttachmentOption()
  .setName(ModerationOption.Attachment)
  .setDescription("Additional media to attach to the case.")
  .setRequired(false);

export const daysToDeleteOption = new SlashCommandIntegerOption()
  .setName(ModerationOption.DaysToDelete)
  .setDescription("Number of days to delete messages for")
  .setMaxValue(7)
  .setMinValue(0)
  .setRequired(false);

export const noteOption = new SlashCommandStringOption()
  .setName(ModerationOption.Note)
  .setDescription("Note to add to the user.")
  .setRequired(true);
