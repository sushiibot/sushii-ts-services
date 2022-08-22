import { SlashCommandBuilder } from "@discordjs/builders";
import dayjs from "dayjs";
import {
  APIChatInputApplicationCommandGuildInteraction,
  PermissionFlagsBits,
} from "discord-api-types/v10";
import Context from "../../model/context";
import { hasPermission } from "../../utils/permissions";
import { getCreatedTimestampSeconds } from "../../utils/snowflake";
import { SlashCommandHandler } from "../handlers";
import CommandInteractionOptionResolver from "../resolver";
import { interactionReplyErrorPermission } from "../responses/error";
import buildUserHistoryEmbed from "./formatters/history";

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
      await interactionReplyErrorPermission(ctx, interaction, "Ban Members");

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

    const userEmbed = buildUserHistoryEmbed(cases, "command")
      .setAuthor({
        name: `${user.username}#${user.discriminator}`,
        iconURL: userFaceURL,
      })
      .addFields(fields);

    await ctx.REST.interactionReply(interaction, {
      embeds: [userEmbed.toJSON()],
    });
  }
}
