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
import {
  daysToDeleteOption,
  reasonOption,
  sendDMReasonOption,
  usersOption,
} from "./options";

export default class BanCommand extends SlashCommandHandler {
  serverOnly = true;

  requiredBotPermissions = new PermissionsBitField().add("BanMembers");

  command = new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban users.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setContexts(InteractionContextType.Guild)
    .addStringOption(usersOption(ActionType.Ban))
    .addIntegerOption(daysToDeleteOption)
    .addStringOption(reasonOption(ActionType.Ban))
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

    const data = new ModActionData(interaction, ActionType.Ban);
    const validateRes = data.validate();
    if (validateRes.err) {
      await interaction.reply(getErrorMessage("Error", validateRes.val));

      return;
    }

    // Defer before doing anything, fetching targets can take a while
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

    const res = await executeAction(ctx, interaction, data, ActionType.Ban);
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
