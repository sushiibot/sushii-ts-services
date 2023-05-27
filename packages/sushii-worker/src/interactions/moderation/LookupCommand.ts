import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  PermissionsBitField,
} from "discord.js";
import Context from "../../model/context";
import db from "../../model/db";
import { getCreatedTimestampSeconds } from "../../utils/snowflake";
import timestampToUnixTime from "../../utils/timestampToUnixTime";
import { SlashCommandHandler } from "../handlers";
import buildUserLookupEmbed from "./formatters/lookup";

export default class LookupCommand extends SlashCommandHandler {
  serverOnly = true;

  requiredBotPermissions = new PermissionsBitField();

  command = new SlashCommandBuilder()
    .setName("lookup")
    .setDescription("Look up cross-server bans for a user.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false)
    .addUserOption((o) =>
      o
        .setName("user")
        .setDescription("The user to show server bans for.")
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

    const bans = await db
      .selectFrom("app_public.guild_bans")
      .leftJoin("app_public.mod_logs as logs", (join) =>
        join
          .onRef("logs.user_id", "=", "app_public.guild_bans.user_id")
          .onRef("logs.guild_id", "=", "app_public.guild_bans.guild_id")
      )
      .leftJoin("app_public.guild_configs as config", (join) =>
        join.onRef("config.id", "=", "app_public.guild_bans.guild_id")
      )
      .select([
        "user_id",
        "guild_id",
        // TODO: lookup_details_opt_in after moved to own column.
      ])
      .where(({ cmpr, and, or }) =>
        and([
          cmpr("user_id", "=", user.id),
          or([cmpr("action", "is", "null"), cmpr("action", "=", "ban")]),
        ])
      )
      .execute();

    const bansWithGuild = await Promise.all(
      bans.map(async (ban) => {
        if (!ban.guild_id) {
          return {
            ...ban,
            guild_name: null,
          };
        }

        try {
          const guild = await ctx.client.guilds.fetch(ban.guild_id);
          return {
            ...ban,
            guild_name: guild.name,
          };
        } catch (err) {
          return {
            ...ban,
            // Maybe sushii not in the server anymore, we can ignore these
            guild_name: null,
          };
        }
      })
    );

    const filteredBans = bansWithGuild.filter((ban) => ban.guild_name !== null);

    const userFaceURL = user.displayAvatarURL();

    const createdTimestamp = getCreatedTimestampSeconds(user.id);
    const fields = [
      {
        name: "Account Created",
        value: `<t:${createdTimestamp}:F> (<t:${createdTimestamp}:R>)`,
      },
    ];

    const member = await interaction.guild.members.fetch(user.id);

    if (member.joinedTimestamp) {
      const ts = timestampToUnixTime(member.joinedTimestamp);

      fields.push({
        name: "Joined Server",
        value: `<t:${ts}:F> (<t:${ts}:R>)`,
      });
    }

    const userEmbed = buildUserLookupEmbed(filteredBans)
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
