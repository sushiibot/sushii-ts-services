import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  PermissionsBitField,
} from "discord.js";
import Context from "../../model/context";
import { getCreatedTimestampSeconds } from "../../utils/snowflake";
import { SlashCommandHandler } from "../handlers";
import buildUserHistoryEmbed from "./formatters/history";

export default class HistoryCommand extends SlashCommandHandler {
  serverOnly = true;

  requiredBotPermissions = new PermissionsBitField();

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
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Guild not cached");
    }

    const user = interaction.options.getUser("user");
    if (!user) {
      throw new Error("no user provided");
    }

    const cases = await ctx.sushiiAPI.sdk.getUserModLogHistory({
      guildId: interaction.guildId,
      userId: user.id,
    });

    const userFaceURL = user.displayAvatarURL();

    const createdTimestamp = getCreatedTimestampSeconds(user.id);
    const fields = [
      {
        name: "Account Created",
        value: `<t:${createdTimestamp}:F> (<t:${createdTimestamp}:R>)`,
      },
    ];

    let member;
    try {
      // Can fail if user not in guild
      member = await interaction.guild.members.fetch(user.id);
    } catch (err) {
      // Ignore
    }

    if (member?.joinedTimestamp) {
      fields.push({
        name: "Joined Server",
        value: `<t:${member.joinedTimestamp}:F> (<t:${member.joinedTimestamp}:R>)`,
      });
    }

    const userEmbed = buildUserHistoryEmbed(cases, "command")
      .setAuthor({
        name: `${user.username}#${user.discriminator} - ${user.id}`,
        iconURL: userFaceURL,
      })
      .addFields(fields);

    await interaction.reply({
      embeds: [userEmbed.toJSON()],
    });
  }
}
