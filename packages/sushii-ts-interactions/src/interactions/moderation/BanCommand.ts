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
import hasPermissionTargetingMember from "./hasPermission";
import ModActionData from "./ModActionData";

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
    .addStringOption((o) =>
      o
        .setName("reason")
        .setDescription("Reason for banning this user.")
        .setRequired(false)
    )
    .addAttachmentOption((o) =>
      o
        .setName("attachment")
        .setDescription("Additional media to attach to the case.")
        .setRequired(false)
    )
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
      data.targetMember
    );

    if (!hasPermsTargetingMember) {
      // Has ban perms, but can't ban the target since they have a higher role
      await interactionReplyErrorUnauthorized(
        ctx,
        interaction,
        "User has a higher role than you."
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

    await ctx.sushiiAPI.sdk.createModLog({
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

    const res = await ctx.REST.banUser(
      interaction.guild_id,
      data.targetUser.id,
      data.reason,
      data.deleteMessageDays
    );

    if (res.err) {
      // If ban failed
      await interactionReplyErrorMessage(
        ctx,
        interaction,
        `Failed to ban user: ${res.val.message}`
      );

      return;
    }

    await ctx.REST.interactionReply(interaction, {
      embeds: [userEmbed.toJSON()],
    });
  }
}
