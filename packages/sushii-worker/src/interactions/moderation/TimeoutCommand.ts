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
  dmMessageOption,
  reasonOption,
  sendDMOption,
  usersOption,
} from "./options";

export default class TimeoutCommand extends SlashCommandHandler {
  serverOnly = true;

  requiredBotPermissions = PermissionFlagsBits.ModerateMembers.toString();

  command = new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout members.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addStringOption(usersOption(ActionType.Timeout))
    .addStringOption((o) =>
      o
        .setName("duration")
        .setDescription("How long to timeout the user.")
        .setRequired(true)
    )
    .addStringOption(reasonOption(ActionType.Timeout))
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
      PermissionFlagsBits.ModerateMembers
    );
    if (!hasBanPerms) {
      await interactionReplyErrorPermission(ctx, interaction, "Ban Members");

      return;
    }

    const data = new ModActionData(interaction);
    if (data.communicationDisabledUntil().err) {
      await interactionReplyErrorMessage(
        ctx,
        interaction,
        "Invalid duration! Please use a valid duration such as 1d, 6h, etc."
      );

      return;
    }

    const fetchTargetsRes = await data.fetchTargets(ctx, interaction);
    if (fetchTargetsRes.err) {
      await interactionReplyErrorMessage(ctx, interaction, fetchTargetsRes.val);

      return;
    }

    const ackRes = await ctx.REST.interactionReplyDeferred(interaction);
    ackRes.unwrap();

    const res = await executeAction(ctx, interaction, data, ActionType.Timeout);
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
