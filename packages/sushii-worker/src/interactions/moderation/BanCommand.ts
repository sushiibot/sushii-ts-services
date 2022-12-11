import { SlashCommandBuilder } from "@discordjs/builders";
import {
  APIChatInputApplicationCommandGuildInteraction,
  PermissionFlagsBits,
} from "discord-api-types/v10";
import Context from "../../model/context";
import { hasPermission } from "../../utils/permissions";
import { SlashCommandHandler } from "../handlers";
import {
  getErrorMessage,
  interactionReplyErrorMessage,
  interactionReplyErrorPermission,
} from "../responses/error";
import { ActionType } from "./ActionType";
import executeAction from "./executeAction";
import ModActionData from "./ModActionData";
import {
  daysToDeleteOption,
  dmMessageOption,
  reasonOption,
  sendDMOption,
  usersOption,
} from "./options";

export default class BanCommand extends SlashCommandHandler {
  serverOnly = true;

  requiredBotPermissions = PermissionFlagsBits.BanMembers.toString();

  command = new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban users.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false)
    .addStringOption(usersOption(ActionType.Ban))
    .addIntegerOption(daysToDeleteOption)
    .addStringOption(reasonOption(ActionType.Ban))
    // .addAttachmentOption(attachmentOption)
    .addBooleanOption(sendDMOption)
    .addStringOption(dmMessageOption)
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction
  ): Promise<void> {
    const hasBanPerms = hasPermission(
      interaction.member.permissions,
      PermissionFlagsBits.BanMembers
    );
    if (!hasBanPerms) {
      await interactionReplyErrorPermission(ctx, interaction, "Ban Members");

      return;
    }

    const data = new ModActionData(interaction);
    const fetchTargetsRes = await data.fetchTargets(ctx, interaction);
    if (fetchTargetsRes.err) {
      await interactionReplyErrorMessage(ctx, interaction, fetchTargetsRes.val);

      return;
    }

    const ackRes = await ctx.REST.interactionReplyDeferred(interaction);
    ackRes.unwrap();

    const res = await executeAction(ctx, interaction, data, ActionType.Ban);
    if (res.err) {
      await ctx.REST.interactionEditOriginal(
        interaction,
        getErrorMessage("Error", res.val.message)
      );

      return;
    }

    await ctx.REST.interactionEditOriginal(interaction, {
      embeds: [res.val.toJSON()],
    });
  }
}
