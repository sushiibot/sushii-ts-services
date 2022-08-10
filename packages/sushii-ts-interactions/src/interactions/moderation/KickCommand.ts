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

export default class KickCommand extends SlashCommandHandler {
  serverOnly = true;

  requiredBotPermissions = PermissionFlagsBits.KickMembers.toString();

  command = new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member.")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDMPermission(false)
    .addUserOption((o) =>
      o.setName("user").setDescription("Who to kick.").setRequired(true)
    )
    .addStringOption(reasonOption(ActionType.Kick))
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
      PermissionFlagsBits.KickMembers
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
        t("kick.success", {
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
        action: "kick",
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

    const res = await ctx.REST.kickMember(
      interaction.guild_id,
      data.targetUser.id,
      data.reason
    );

    if (res.err) {
      await interactionReplyErrorMessage(
        ctx,
        interaction,
        `Failed to kick user: ${res.val.message}`
      );

      return;
    }

    await ctx.REST.interactionReply(interaction, {
      embeds: [userEmbed.toJSON()],
    });
  }
}
