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
import { interactionReplyErrorPerrmision } from "../responses/error";
import ModActionData from "./ModActionData";

export default class BanCommand extends SlashCommandHandler {
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
      await interactionReplyErrorPerrmision(ctx, interaction, "Ban Members");

      return;
    }

    const data = new ModActionData(interaction);

    // User av
    const userFaceURL = ctx.CDN.userFaceURL(data.target);
    const userEmbed = new EmbedBuilder()
      .setTitle(
        t("warn.success", {
          ns: "commands",
          id: data.target.id,
        })
      )
      .setAuthor({
        name: `${data.target.username}#${data.target.discriminator}`,
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
        userId: data.target.id,
        userTag: data.target.discriminator,
        executorId: data.invoker.id,
        actionTime: dayjs().toISOString(),
        reason: data.reason,
        attachments: [data.attachment?.url || null],
        // This is set in the mod logger
        msgId: undefined,
      },
    });

    await ctx.REST.banUser(
      interaction.guild_id,
      data.target.id,
      data.reason,
      data.deleteMessageDays
    );

    await ctx.REST.interactionReply(interaction, {
      embeds: [userEmbed.toJSON()],
    });
  }
}