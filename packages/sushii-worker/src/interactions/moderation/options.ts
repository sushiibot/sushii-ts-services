import {
  SlashCommandAttachmentOption,
  SlashCommandBooleanOption,
  SlashCommandStringOption,
} from "@discordjs/builders";
import { ActionType } from "./ActionType";

export const usersOption = (action: ActionType): SlashCommandStringOption =>
  new SlashCommandStringOption()
    .setName("users")
    .setDescription(
      `Which users to ${ActionType.toString(
        action
      )} . This can be multiple users with IDs or mentions.`
    )
    .setRequired(true);

export const sendDMOption = new SlashCommandBooleanOption()
  .setName("send_dm")
  .setDescription("If true, send a DM with the reason to the user.")
  .setRequired(false);

export const reasonOption = (action: ActionType): SlashCommandStringOption =>
  new SlashCommandStringOption()
    .setName("reason")
    .setDescription(
      `Reason for ${ActionType.toPresentTense(action)} this user.`
    )
    .setRequired(false);

export const attachmentOption = new SlashCommandAttachmentOption()
  .setName("attachment")
  .setDescription("Additional media to attach to the case.")
  .setRequired(false);
