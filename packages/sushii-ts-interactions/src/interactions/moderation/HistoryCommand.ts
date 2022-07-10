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
import { getCreatedTimestampSeconds } from "../../utils/snowflake";
import { SlashCommandHandler } from "../handlers";
import CommandInteractionOptionResolver from "../resolver";
import { interactionReplyErrorPerrmision } from "../responses/error";

export default class HistoryCommand extends SlashCommandHandler {
  serverOnly = true;

  requiredBotPermissions = PermissionFlagsBits.BanMembers.toString();

  command = new SlashCommandBuilder()
    .setName("history")
    .setDescription("Show the moderation case history for a user.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false)
    .addUserOption((o) =>
      o
        .setName("user")
        .setDescription("The user to show moderation case history for.")
        .setRequired(true)
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

    const options = new CommandInteractionOptionResolver(
      interaction.data.options,
      interaction.data.resolved
    );

    const user = options.getUser("user");
    if (!user) {
      throw new Error("no user provided");
    }

    const cases = await ctx.sushiiAPI.sdk.getUserModLogHistory({
      guildId: interaction.guild_id,
      userId: user.id,
    });

    // User av
    const userFaceURL = ctx.CDN.userFaceURL(user);

    const createdTimestamp = getCreatedTimestampSeconds(user.id);
    const fields = [
      {
        name: "Account Created",
        value: `<t:${createdTimestamp}:F> (<t:${createdTimestamp}:R>)`,
      },
    ];

    const member = await ctx.REST.getMember(interaction.guild_id, user.id);

    const joinedTimestamp = member
      .map((m) => dayjs(m.joined_at))
      .unwrapOr(undefined);
    if (joinedTimestamp) {
      fields.push({
        name: "Joined Server",
        value: `<t:${joinedTimestamp.unix()}:F> (<t:${joinedTimestamp.unix()}:R>)`,
      });
    }

    if (!cases.allModLogs || cases.allModLogs.nodes.length === 0) {
      await ctx.REST.interactionReply(interaction, {
        embeds: [
          new EmbedBuilder()
            .setTitle(
              t("history.title", {
                ns: "commands",
                count: 0,
              })
            )
            .setAuthor({
              name: `${user.username}#${user.discriminator}`,
              iconURL: userFaceURL,
            })
            .setFields(fields)
            .setColor(Color.Success)
            .toJSON(),
        ],
      });

      return;
    }

    const casesStrs = cases.allModLogs.nodes.map((c) => {
      let str = `\`#${c.caseId}\` <t:${dayjs.utc(c.actionTime).unix()}:R> - **${
        c.action
      }**`;

      if (c.executorId) {
        str += ` by <@${c.executorId}>`;
      }

      str += ` for ${c.reason}`;

      return str;
    });

    const userEmbed = new EmbedBuilder()
      .setTitle(
        t("history.title", {
          ns: "commands",
          count: casesStrs.length,
        })
      )
      .setAuthor({
        name: `${user.username}#${user.discriminator}`,
        iconURL: userFaceURL,
      })
      .setDescription(casesStrs.join("\n"))
      .setFields(fields)
      .setColor(Color.Success);

    await ctx.REST.interactionReply(interaction, {
      embeds: [userEmbed.toJSON()],
    });
  }
}
