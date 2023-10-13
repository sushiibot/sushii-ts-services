import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionsBitField,
  PermissionFlagsBits,
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
    .setDMPermission(false)
    .addStringOption(usersOption(ActionType.TimeoutRemove))
    .addStringOption(reasonOption(ActionType.TimeoutRemove))
    .addStringOption(sendDMReasonOption)
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

    const fetchTargetsRes = await data.fetchTargets(ctx, interaction);
    if (fetchTargetsRes.err) {
      await interaction.editReply(
        getErrorMessage("Error", fetchTargetsRes.val),
      );

      return;
    }

    const res = await executeAction(
      ctx,
      interaction,
      data,
      ActionType.TimeoutRemove,
    );
    if (res.err) {
      await interaction.editReply(getErrorMessage("Error", res.val.message));

      return;
    }

    await interaction.editReply({
      embeds: [res.val],
    });
  }
}
