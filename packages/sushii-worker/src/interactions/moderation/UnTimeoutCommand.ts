import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionsBitField,
  PermissionFlagsBits,
  InteractionContextType,
} from "discord.js";
import Context from "../../model/context";
import { SlashCommandHandler } from "../handlers";
import { getErrorMessage } from "../responses/error";
import { ActionType } from "./ActionType";
import executeAction from "./executeAction";
import ModActionData from "./ModActionData";
import { reasonOption, sendDMReasonOption, usersOption } from "./options";

export default class UnTimeoutCommand extends SlashCommandHandler {
  serverOnly = true;

  requiredBotPermissions = new PermissionsBitField().add("ModerateMembers");

  command = new SlashCommandBuilder()
    .setName("untimeout")
    .setDescription("Remove the timeout for members.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setContexts(InteractionContextType.Guild)
    .addStringOption(usersOption(ActionType.TimeoutRemove))
    .addStringOption(reasonOption(ActionType.TimeoutRemove))
    .addStringOption(sendDMReasonOption)
    .toJSON();

  async handler(
    ctx: Context,
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Not in cached guild");
    }

    const data = new ModActionData(interaction, ActionType.TimeoutRemove);
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

    const res = await executeAction(
      ctx,
      interaction,
      data,
      ActionType.TimeoutRemove,
    );
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
