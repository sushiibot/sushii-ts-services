import { SlashCommandBuilder } from "@discordjs/builders";
import {
  APIChatInputApplicationCommandGuildInteraction,
  PermissionFlagsBits,
} from "discord-api-types/v10";
import Context from "../../model/context";
import { hasPermission } from "../../utils/permissions";
import { SlashCommandHandler } from "../handlers";
import {
  interactionReplyErrorMessage,
  interactionReplyErrorPermission,
} from "../responses/error";
import { ActionType } from "./ActionType";
import executeAction from "./executeAction";
import ModActionData from "./ModActionData";
import { reasonOption, usersOption } from "./options";

export default class UnbanCommand extends SlashCommandHandler {
  serverOnly = true;

  requiredBotPermissions = PermissionFlagsBits.BanMembers.toString();

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
    const fetchTargetsRes = await data.fetchTargets(
      ctx,
      interaction,
      true // skipMember fetch
    );
    if (fetchTargetsRes.err) {
      await interactionReplyErrorMessage(ctx, interaction, fetchTargetsRes.val);

      return;
    }

    const ackRes = await ctx.REST.interactionReplyDeferred(interaction);
    if (ackRes.err) {
      await interactionReplyErrorMessage(ctx, interaction, ackRes.val.message);

      return;
    }

    const res = await executeAction(
      ctx,
      interaction,
      data,
      ActionType.BanRemove
    );
    if (res.err) {
      await interactionReplyErrorMessage(ctx, interaction, res.val.message);

      return;
    }

    await ctx.REST.interactionEditOriginal(interaction, {
      embeds: [res.val.toJSON()],
    });
  }
}
