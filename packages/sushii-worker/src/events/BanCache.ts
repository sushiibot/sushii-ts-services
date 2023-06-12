import { Events, Guild, GuildBan } from "discord.js";
import Context from "../model/context";
import { EventHandlerFn } from "./EventHandler";
import db from "../model/db";
import logger from "../logger";

async function getGuildBans(guild: Guild): Promise<string[]> {
  const guildAllBans: string[] = [];
  let after: string | undefined;
  let pageNumber = 0;

  // -------------------------------------------------------------------------
  // Page through bans for this guild
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const page = await guild.bans.fetch({
      limit: 1000,
      after,
      cache: false,
    });

    logger.debug(
      {
        guildId: guild.id,
        guildName: guild.name,
        pageNumber,
        pageSize: page.size,
        after,
      },
      "Fetched server bans page"
    );

    // Just for logging
    pageNumber += 1;

    // Add all the ban user ids in this page to the array
    guildAllBans.push(...Array.from(page.keys()).map((userId) => userId));

    if (page.size < 1000) {
      // Current page is the last page
      break;
    }

    // Get the last user ID in the page. IDs are always ascending order
    after = page.lastKey();
    if (!after) {
      // Empty page, no more bans. This shouldn't really happen because we
      // check if we're on the last page, but it could happen if there's an
      // exact multiple of 1000
      break;
    }

    // Wait for a second for next page
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => {
      setTimeout(resolve, 1 * 1000);
    });
  }

  // -------------------------------------------------------------------------
  // Update database bans for this guild

  logger.debug(
    {
      guildId: guild.id,
      guildName: guild.name,
      banCount: guildAllBans.length,
    },
    "Updating server bans in database"
  );

  return guildAllBans;
}

export const banReadyHandler: EventHandlerFn<Events.ClientReady> = async (
  ctx: Context
): Promise<void> => {
  // Fetch all bans for all guilds the bot is in.

  for (const [, guild] of ctx.client.guilds.cache) {
    // eslint-disable-next-line no-await-in-loop
    const guildBans = await getGuildBans(guild);

    // First clear the bans for this guild, so we can remove bans that were removed
    // eslint-disable-next-line no-await-in-loop
    await db
      .deleteFrom("app_public.guild_bans")
      .where("guild_id", "=", guild.id)
      .execute();

    // eslint-disable-next-line no-await-in-loop
    await db
      .insertInto("app_public.guild_bans")
      .values(
        guildBans.map((userId) => ({
          guild_id: guild.id,
          user_id: userId,
        }))
      )
      // Ignore conflicts, there shouldn't be any cuz we just cleared them but
      // who knows
      .onConflict((oc) => oc.doNothing())
      .execute();

    // Sleep for 5 seconds

    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => {
      setTimeout(resolve, 5 * 1000);
    });
  }
};

export const banCacheBanHandler: EventHandlerFn<Events.GuildBanAdd> = async (
  ctx: Context,
  ban: GuildBan
): Promise<void> => {
  // Add the ban to the database
  await db
    .insertInto("app_public.guild_bans")
    .values({
      guild_id: ban.guild.id,
      user_id: ban.user.id,
    })
    .onConflict((oc) => oc.doNothing())
    .execute();
};

export const banCacheUnbanHandler: EventHandlerFn<
  Events.GuildBanRemove
> = async (ctx: Context, ban: GuildBan): Promise<void> => {
  // Remove the ban from the database
  await db
    .deleteFrom("app_public.guild_bans")
    .where("guild_id", "=", ban.guild.id)
    .where("user_id", "=", ban.user.id)
    .execute();
};

export const banCacheGuildCreateHandler: EventHandlerFn<
  Events.GuildCreate
> = async (ctx: Context, guild: Guild): Promise<void> => {
  const guildBans = await getGuildBans(guild);

  // Clear bans first, in case it's a rejoin
  await db
    .deleteFrom("app_public.guild_bans")
    .where("guild_id", "=", guild.id)
    .execute();

  await db
    .insertInto("app_public.guild_bans")
    .values(
      guildBans.map((userId) => ({
        guild_id: guild.id,
        user_id: userId,
      }))
    )
    // Ignore conflicts, there shouldn't be any cuz we just cleared them but
    // who knows
    .onConflict((oc) => oc.doNothing())
    .execute();
};
