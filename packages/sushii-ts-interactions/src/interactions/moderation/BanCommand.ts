import { SlashCommandBuilder, EmbedBuilder } from "@discordjs/builders";
import dayjs from "dayjs";
import {
  APIChatInputApplicationCommandGuildInteraction,
  PermissionFlagsBits,
} from "discord-api-types/v10";
import { t } from "i18next";
import Context from "../../model/context";
import Color from "../../utils/colors";
import { hasPermission } from "../../utils/permissions";
import { SlashCommandHandler } from "../handlers";
import {
  interactionReplyErrorMessage,
  interactionReplyErrorPermission,
  interactionReplyErrorUnauthorized,
} from "../responses/error";
import { ActionType } from "./ActionType";
import hasPermissionTargetingMember from "./hasPermission";
import ModActionData from "./ModActionData";
import { attachmentOption, reasonOption, skipDMOption } from "./options";
import sendModActionDM from "./sendDm";

export default class BanCommand extends SlashCommandHandler {
  serverOnly = true;

  requiredBotPermissions = PermissionFlagsBits.BanMembers.toString();

  command = new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a member.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false)
    .addUserOption((o) =>
      o.setName("user").setDescription("Who to ban.").setRequired(true)
    )
    .addIntegerOption((o) =>
      o
        .setName("days_to_delete")
        .setDescription("Number of days to delete messages for")
        .setMaxValue(7)
        .setMinValue(0)
        .setRequired(false)
    )
    .addStringOption(reasonOption(ActionType.Ban))
    .addAttachmentOption(attachmentOption)
    .addBooleanOption(skipDMOption)
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

    const hasPermsTargetingMember = await hasPermissionTargetingMember(
      ctx,
      interaction,
      data.targetUser,
      data.targetMember
    );

    if (hasPermsTargetingMember.err) {
      await interactionReplyErrorUnauthorized(
        ctx,
        interaction,
        hasPermsTargetingMember.val
      );

      return;
    }

    // User av
    const userFaceURL = ctx.CDN.userFaceURL(data.targetUser);
    const userEmbed = new EmbedBuilder()
      .setTitle(
        t("ban.success", {
          ns: "commands",
          id: data.targetUser.id,
        })
      )
      .setAuthor({
        name: `${data.targetUser.username}#${data.targetUser.discriminator}`,
        iconURL: userFaceURL,
      })
      .setColor(Color.Success);

    const { nextCaseId } = await ctx.sushiiAPI.sdk.getNextCaseID({
      guildId: interaction.guild_id,
    });

    if (!nextCaseId) {
      throw new Error(
        `Failed to get next case id for guild ${interaction.guild_id}`
      );
    }

    const { createModLog } = await ctx.sushiiAPI.sdk.createModLog({
      modLog: {
        guildId: interaction.guild_id,
        caseId: nextCaseId,
        action: "mute",
        pending: true,
        userId: data.targetUser.id,
        userTag: data.targetUser.discriminator,
        executorId: data.invoker.id,
        actionTime: dayjs().toISOString(),
        reason: data.reason,
        attachments: [data.attachment?.url || null],
        // This is set in the mod logger
        msgId: undefined,
      },
    });

    // Need to DM before banning

    const dmRes = await sendModActionDM(ctx, interaction, data, ActionType.Ban);

    const res = await ctx.REST.banUser(
      interaction.guild_id,
      data.targetUser.id,
      data.reason,
      data.deleteMessageDays
    );

    if (res.err && dmRes.ok) {
      await Promise.allSettled([
        // If we sent the DM but the ban failed, we need to delete the DM
        ctx.REST.deleteChannelMessage(dmRes.val.channel_id, dmRes.val.id),
        // If ban failed
        interactionReplyErrorMessage(
          ctx,
          interaction,
          `Failed to ban user: ${res.val.message}`
        ),
      ]);

      return;
    }

    await ctx.REST.interactionReply(interaction, {
      embeds: [userEmbed.toJSON()],
    });
  }
}
