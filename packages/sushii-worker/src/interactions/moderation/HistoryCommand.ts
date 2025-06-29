import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  PermissionsBitField,
  InteractionContextType,
} from "discord.js";
import Context from "../../model/context";
import timestampToUnixTime from "../../utils/timestampToUnixTime";
import { SlashCommandHandler } from "../handlers";
import buildUserHistoryEmbeds from "./formatters/history";
import { getUserModLogHistory } from "../../db/ModLog/ModLog.repository";
import db from "../../infrastructure/database/db";
import { getUserString } from "../../utils/userString";

export default class HistoryCommand extends SlashCommandHandler {
  serverOnly = true;

  requiredBotPermissions = new PermissionsBitField();

  command = new SlashCommandBuilder()
    .setName("history")
    .setDescription("Show the moderation case history for a user.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setContexts(InteractionContextType.Guild)
    .addUserOption((o) =>
      o
        .setName("user")
        .setDescription("The user to show moderation case history for.")
        .setRequired(true),
    )
    .toJSON();

  async handler(
    ctx: Context,
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Guild not cached");
    }

    const user = interaction.options.getUser("user");
    if (!user) {
      throw new Error("no user provided");
    }

    const cases = await getUserModLogHistory(db, {
      guildId: interaction.guild.id,
      userId: user.id,
    });

    const userFaceURL = user.displayAvatarURL();

    const createdTimestamp = timestampToUnixTime(user.createdTimestamp);
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
      const ts = timestampToUnixTime(member.joinedTimestamp);

      fields.push({
        name: "Joined Server",
        value: `<t:${ts}:F> (<t:${ts}:R>)`,
      });
    }

    const historyEmbeds = buildUserHistoryEmbeds(cases, "command");

    // First embed gets user info
    historyEmbeds[0].setAuthor({
      name: getUserString(member || user),
      iconURL: userFaceURL,
    });

    // Last embed gets footer and fields
    historyEmbeds[historyEmbeds.length - 1]
      .setFooter({
        text: `User ID: ${user.id}`,
      })
      .addFields(fields);

    await interaction.reply({
      embeds: [historyEmbeds[0]],
    });

    // Additional embeds
    if (historyEmbeds.length > 1) {
      for (let i = 1; i < historyEmbeds.length; i += 1) {
        await interaction.followUp({
          embeds: [historyEmbeds[i]],
        });
      }
    }
  }
}
