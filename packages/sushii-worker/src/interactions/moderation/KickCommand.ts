import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionsBitField,
  InteractionContextType,
} from "discord.js";
import { PermissionFlagsBits } from "discord-api-types/v10";
import Context from "../../model/context";
import { SlashCommandHandler } from "../handlers";
import { getErrorMessage } from "../responses/error";
import { ActionType } from "./ActionType";
import executeAction from "./executeAction";
import ModActionData from "./ModActionData";
import { reasonOption, sendDMReasonOption, usersOption } from "./options";

export default class KickCommand extends SlashCommandHandler {
  serverOnly = true;

  requiredBotPermissions = new PermissionsBitField().add("KickMembers");

  command = new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick members.")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setContexts(InteractionContextType.Guild)
    .addStringOption(usersOption(ActionType.Kick))
    .addStringOption(reasonOption(ActionType.Kick))
    // .addAttachmentOption(attachmentOption)
    .addStringOption(sendDMReasonOption)
    .toJSON();

  async handler(
    ctx: Context,
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Not in cached guild");
    }

    const data = new ModActionData(interaction, ActionType.Kick);
    const validateRes = data.validate();
    if (validateRes.err) {
      await interaction.reply(getErrorMessage("Error", validateRes.val));

      return;
    }

    await interaction.deferReply();

    const fetchTargetsRes = await data.fetchTargets(ctx, interaction);
    if (fetchTargetsRes.err) {
      const { flags, ...editMsg } = getErrorMessage(
        "Error",
        fetchTargetsRes.val,
      );
      await interaction.editReply(editMsg);

      return;
    }

    const res = await executeAction(ctx, interaction, data, ActionType.Kick);
    if (res.err) {
      const { flags, ...editMsg } = getErrorMessage("Error", res.val.message);
      await interaction.editReply(editMsg);

      return;
    }

    await interaction.editReply({
      embeds: [res.val],
    });
  }
}
