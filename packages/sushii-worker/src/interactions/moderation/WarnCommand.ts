import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
} from "discord.js";
import Context from "../../model/context";
import { SlashCommandHandler } from "../handlers";
import { getErrorMessage } from "../responses/error";
import { ActionType } from "./ActionType";
import executeAction from "./executeAction";
import ModActionData from "./ModActionData";
import { reasonOption, usersOption } from "./options";

export default class WarnCommand extends SlashCommandHandler {
  serverOnly = true;

  command = new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn members.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false)
    .addStringOption(usersOption(ActionType.Warn))
    .addStringOption(reasonOption(ActionType.Warn, true))
    // .addAttachmentOption(attachmentOption)
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Not in cached guild");
    }

    await interaction.deferReply();

    const data = new ModActionData(interaction);
    const validateRes = data.validate();
    if (validateRes.err) {
      await interaction.editReply(getErrorMessage("Error", validateRes.val));

      return;
    }

    const fetchTargetsRes = await data.fetchTargets(ctx, interaction);
    if (fetchTargetsRes.err) {
      await interaction.editReply(
        getErrorMessage("Error", fetchTargetsRes.val),
      );

      return;
    }

    const res = await executeAction(ctx, interaction, data, ActionType.Warn);
    if (res.err) {
      await interaction.editReply(getErrorMessage("Error", res.val.message));

      return;
    }

    await interaction.editReply({
      embeds: [res.val],
    });
  }
}
