import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  PermissionsBitField,
} from "discord.js";

import Context from "../../model/context";
import { SlashCommandHandler } from "../handlers";
import {
  getErrorMessage,
  interactionReplyErrorMessage,
} from "../responses/error";
import { ActionType } from "./ActionType";
import executeAction from "./executeAction";
import ModActionData from "./ModActionData";
import { reasonOption, usersOption } from "./options";

export default class UnbanCommand extends SlashCommandHandler {
  serverOnly = true;

  requiredBotPermissions = new PermissionsBitField().add("BanMembers");

  command = new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban users.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false)
    .addStringOption(usersOption(ActionType.BanRemove))
    .addStringOption(reasonOption(ActionType.BanRemove))
    // .addAttachmentOption(attachmentOption)
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Not in cached guild");
    }

    const data = new ModActionData(interaction);
    const fetchTargetsRes = await data.fetchTargets(
      ctx,
      interaction,
      true // skipMember fetch
    );
    if (fetchTargetsRes.err) {
      await interactionReplyErrorMessage(ctx, interaction, fetchTargetsRes.val);

      return;
    }

    await interaction.deferReply();

    let res;
    try {
      res = await executeAction(ctx, interaction, data, ActionType.BanRemove);
    } catch (err) {
      await interaction.editReply(
        getErrorMessage("Error", "hmm something failed")
      );

      return;
    }

    if (res.err) {
      await interaction.editReply(getErrorMessage("Error", res.val.message));

      return;
    }

    await interaction.editReply({
      embeds: [res.val],
    });
  }
}
