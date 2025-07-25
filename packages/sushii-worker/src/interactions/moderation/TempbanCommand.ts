import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  PermissionsBitField,
  InteractionContextType,
} from "discord.js";

import { SlashCommandHandler } from "../handlers";
import { getErrorMessage } from "../responses/error";
import { ActionType } from "./ActionType";
import executeAction from "./executeAction";
import ModActionData from "./ModActionData";
import {
  ModerationOption,
  reasonOption,
  sendDMReasonOption,
  usersOption,
} from "./options";

export default class TempbanCommand extends SlashCommandHandler {
  requiredBotPermissions = new PermissionsBitField().add("BanMembers");

  command = new SlashCommandBuilder()
    .setName("tempban")
    .setDescription(
      "Temporarily ban members. Run this again to change existing tempban durations.",
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setContexts(InteractionContextType.Guild)
    .addStringOption(usersOption(ActionType.TempBan))
    .addStringOption((o) =>
      o
        .setName(ModerationOption.Duration)
        .setDescription("How long to ban the user for.")
        .setRequired(true),
    )
    .addStringOption(reasonOption(ActionType.TempBan))
    // .addAttachmentOption(attachmentOption)
    .addStringOption(sendDMReasonOption)
    .toJSON();

  async handler(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Not in cached guild");
    }

    const data = new ModActionData(interaction, ActionType.TempBan);
    const validateRes = data.validate();
    if (validateRes.err) {
      const { flags, ...editMsg } = getErrorMessage("Error", validateRes.val);
      await interaction.reply(editMsg);

      return;
    }

    await interaction.deferReply();

    const fetchTargetsRes = await data.fetchTargets(interaction);
    if (fetchTargetsRes.err) {
      const { flags, ...editMsg } = getErrorMessage(
        "Error",
        fetchTargetsRes.val,
      );
      await interaction.editReply(editMsg);

      return;
    }

    const res = await executeAction(interaction, data, ActionType.TempBan);
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
