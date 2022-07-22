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

export default class TimeoutCommand extends SlashCommandHandler {
  serverOnly = true;

  requiredBotPermissions = PermissionFlagsBits.ModerateMembers.toString();

  command = new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a member.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addUserOption((o) =>
      o.setName("user").setDescription("Who to timeout.").setRequired(true)
    )
    .addStringOption((o) =>
      o
        .setName("duration")
        .setDescription("How long to timeout the user.")
        .setRequired(true)
    )
    .addStringOption((o) =>
      o
        .setName("reason")
        .setDescription("Reason for timing out this user.")
        .setRequired(false)
    )
    .addAttachmentOption((o) =>
      o
        .setName("attachment")
        .setDescription("Additional media to attach to the case.")
        .setRequired(false)
    )
    .addBooleanOption((o) =>
      o
        .setName("skip_dm")
        .setDescription(
          "Set to false if you do not want to DM the reason to the user."
        )
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
      PermissionFlagsBits.ModerateMembers
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

    const comDisabledUntil = data.communicationDisabledUntil();

    if (comDisabledUntil.err) {
      await ctx.REST.interactionReply(interaction, {
        embeds: [
          new EmbedBuilder()
            .setTitle(
              t("timeout.error.invalid_duration_title", { ns: "commands" })
            )
            .setDescription(
              t("timeout.error.invalid_duration_description", {
                ns: "commands",
              })
            )
            .setColor(Color.Error)
            .toJSON(),
        ],
      });

      return;
    }

    // User av
    const userFaceURL = ctx.CDN.userFaceURL(data.targetUser);
    const userEmbed = new EmbedBuilder()
      .setTitle(
        t("timeout.success", {
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
        action: "ban",
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

    const res = await ctx.REST.timeoutMember(
      interaction.guild_id,
      data.targetUser.id,
      comDisabledUntil.safeUnwrap(),
      data.reason
    );

    if (res.err) {
      await interactionReplyErrorMessage(
        ctx,
        interaction,
        `Failed to time out user: ${res.val.message}`
      );

      return;
    }

    // TODO: DM user

    await ctx.REST.interactionReply(interaction, {
      embeds: [userEmbed.toJSON()],
    });
  }
}
