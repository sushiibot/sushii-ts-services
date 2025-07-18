import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  InteractionContextType,
} from "discord.js";
import { PermissionFlagsBits } from "discord.js";
import { SlashCommandHandler } from "../handlers";
import { getErrorMessage, getErrorMessageEdit } from "../responses/error";
import { ActionType } from "./ActionType";
import executeAction from "./executeAction";
import ModActionData from "./ModActionData";
import { attachmentOption, noteOption, usersOption } from "./options";

export default class NoteCommand extends SlashCommandHandler {
  command = new SlashCommandBuilder()
    .setName("note")
    .setDescription("Add a note to members.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setContexts(InteractionContextType.Guild)
    .addStringOption(usersOption(ActionType.Note))
    .addStringOption(noteOption)
    .addAttachmentOption(attachmentOption)
    .toJSON();

  async handler(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Not in cached guild");
    }

    const data = new ModActionData(interaction, ActionType.Note);
    const validateRes = data.validate();
    if (validateRes.err) {
      await interaction.reply(getErrorMessage("Error", validateRes.val));

      return;
    }

    await interaction.deferReply();

    const fetchTargetsRes = await data.fetchTargets(interaction);
    if (fetchTargetsRes.err) {
      const msg = getErrorMessageEdit("Error", fetchTargetsRes.val);
      await interaction.editReply(msg);

      return;
    }

    const res = await executeAction(interaction, data, ActionType.Note);
    if (res.err) {
      const msg = getErrorMessageEdit("Error", res.val.message);
      await interaction.editReply(msg);

      return;
    }

    await interaction.editReply({
      embeds: [res.val],
    });
  }
}
