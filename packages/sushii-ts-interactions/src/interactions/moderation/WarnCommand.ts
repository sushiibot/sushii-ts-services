import { SlashCommandBuilder, EmbedBuilder } from "@discordjs/builders";
import dayjs from "dayjs";
import {
  APIChatInputApplicationCommandGuildInteraction,
  PermissionFlagsBits,
} from "discord-api-types/v10";
import { t } from "i18next";
import logger from "../../logger";
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

export default class WarnCommand extends SlashCommandHandler {
  serverOnly = true;

  requiredBotPermissions = PermissionFlagsBits.BanMembers.toString();

  command = new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a member.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false)
    .addUserOption((o) =>
      o.setName("user").setDescription("Who to warn.").setRequired(true)
    )
    .addStringOption((o) =>
      o
        .setName("reason")
        .setDescription("Reason for warning this user. This will DM the user.")
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
        t("warn.success", {
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
        action: "warn",
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

    // Cached from redis
    const cachedGuild = await ctx.sushiiAPI.sdk.getRedisGuild({
      guild_id: interaction.guild_id,
    });

    if (!cachedGuild.redisGuildByGuildId) {
      logger.warn(
        { guildId: interaction.guild_id },
        "Failed to fetch guild from redis cache"
      );
    }

    const guildName =
      cachedGuild.redisGuildByGuildId?.name || interaction.guild_id.toString();

    const guildIcon =
      cachedGuild.redisGuildByGuildId?.icon &&
      ctx.CDN.cdn.icon(
        interaction.guild_id,
        cachedGuild.redisGuildByGuildId.icon
      );

    const embed = new EmbedBuilder()
      .setTitle(t("warn.dm_title", { ns: "commands" }))
      .setAuthor({
        name: guildName,
        iconURL: guildIcon || undefined,
      })
      .setFields(
        data.reason
          ? [
              {
                name: t("warn.dm_reason", { ns: "commands" }),
                value: data.reason,
              },
            ]
          : []
      )
      .setColor(Color.Warning);

    const res = await ctx.REST.dmUser(data.targetUser.id, {
      embeds: [embed.toJSON()],
    });

    if (res.err) {
      await interactionReplyErrorMessage(ctx, interaction, res.val.message);

      return;
    }

    await ctx.REST.interactionReply(interaction, {
      embeds: [userEmbed.toJSON()],
    });
  }
}
