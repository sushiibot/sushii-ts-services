import {
  SlashCommandAttachmentOption,
  SlashCommandBooleanOption,
  SlashCommandStringOption,
} from "@discordjs/builders";
import { ActionType } from "./ActionType";

export const skipDMOption = new SlashCommandBooleanOption()
  .setName("skip_dm")
  .setDescription("If true, don't send a DM with the reason to the user.")
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
