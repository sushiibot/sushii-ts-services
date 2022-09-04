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
import {
  attachmentOption,
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
    .addAttachmentOption(attachmentOption)
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
    const fetchTargetsRes = await data.fetchTargets(ctx, interaction);
    if (fetchTargetsRes.err) {
      await interactionReplyErrorMessage(ctx, interaction, fetchTargetsRes.val);

      return;
    }

    const res = await executeAction(ctx, interaction, data, ActionType.Timeout);
    if (res.err) {
      await interactionReplyErrorMessage(ctx, interaction, res.val.message);

      return;
    }

    await ctx.REST.interactionReply(interaction, {
      embeds: [res.val.toJSON()],
    });
  }
}
