import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  PermissionsBitField,
  User,
} from "discord.js";
import Context from "../../model/context";
import db from "../../model/db";
import { SlashCommandHandler } from "../handlers";
import buildUserLookupEmbed, { UserLookupBan } from "./formatters/lookup";

export async function getUserLookupData(
  ctx: Context,
  user: User
): Promise<UserLookupBan[]> {
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
      "app_public.guild_bans.guild_id as guild_id",
      "reason",
      "action_time",
      "lookup_details_opt_in",
    ])
    .where(({ cmpr, and, or }) =>
      and([
        cmpr("app_public.guild_bans.user_id", "=", user.id),
        or([cmpr("action", "is", null), cmpr("action", "=", "ban")]),
      ])
    )
    .execute();

  const bansWithGuild = await Promise.all(
    bans.map(async (ban): Promise<Partial<UserLookupBan>> => {
      if (!ban.guild_id) {
        return {
          reason: ban.reason,
          guild_name: null,
        };
      }

      try {
        const guild = await ctx.client.guilds.fetch(ban.guild_id);
        return {
          ...ban,
          guild_name: guild.name,
          guild_features: guild.features,
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

  const filteredBans = bansWithGuild.filter(
    (ban): ban is UserLookupBan =>
      ban.guild_name !== null && ban.guild_id !== null
  );

  return filteredBans;
}

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

    const currentGuildConfig = await db.getGuildConfig(interaction.guildId);

    let member;
    try {
      member = await interaction.guild.members.fetch(user.id);
    } catch (err) {
      // Ignore, could be a user not in the server
    }

    const bans = await getUserLookupData(ctx, user);

    const userEmbed = await buildUserLookupEmbed(
      user,
      member,
      bans,
      currentGuildConfig.lookup_details_opt_in
    );

    await interaction.reply({
      embeds: [userEmbed],
    });
  }
}
