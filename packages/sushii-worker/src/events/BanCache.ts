import { Events, Guild, GuildBan } from "discord.js";
import Context from "../model/context";
import { EventHandlerFn } from "./EventHandler";
import db from "../infrastructure/database/config/db";
import { newModuleLogger } from "../logger";
import config from "../model/config";
import {
  clearGuildBans,
  insertGuildBans,
} from "../infrastructure/database/repositories/GuildBan.repository";

const log = newModuleLogger("BanCacheHandler");

async function getGuildBans(guild: Guild): Promise<string[]> {
  const guildAllBans: string[] = [];
  let after: string | undefined;

  // -------------------------------------------------------------------------
  // Page through bans for this guild
  while (true) {
    let page;
    try {
      page = await guild.bans.fetch({
        limit: 1000,
        after,
        cache: false,
      });
    } catch (err) {
      log.debug(
        {
          guildId: guild.id,
          guildName: guild.name,
          err,
        },
        "Failed to fetch server bans page",
      );

      // If we failed to fetch a page, just return what we have so far
      return guildAllBans;
    }

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
    await new Promise((resolve) => {
      setTimeout(resolve, 1 * 1000);
    });
  }

  return guildAllBans;
}

export const banReadyHandler: EventHandlerFn<Events.ClientReady> = async (
  ctx: Context,
): Promise<void> => {
  if (config.DISABLE_BAN_FETCH_ON_READY) {
    log.info("Skipping ban fetch on ready");
    return;
  }

  // Fetch all bans for all guilds the bot is in.
  for (const [, guild] of ctx.client.guilds.cache) {
    // Ignore if guild is less than 10k members for now
    if (guild.memberCount < 10000) {
      continue;
    }

    const guildBans = await getGuildBans(guild);

    // -------------------------------------------------------------------------
    // Update database bans for this guild

    log.debug(
      {
        guildId: guild.id,
        guildName: guild.name,
        banCount: guildBans.length,
      },
      "Updating server bans in database",
    );

    // First clear the bans for this guild, so we can remove bans that were removed
    await clearGuildBans(db, guild.id);

    if (guildBans.length === 0) {
      // No bans, skip insertion
      log.debug(
        {
          guildId: guild.id,
          guildName: guild.name,
        },
        "No bans to insert, skipping",
      );

      continue;
    }

    await insertGuildBans(db, guild.id, guildBans);

    // Sleep for 5 seconds
    await new Promise((resolve) => {
      setTimeout(resolve, 5 * 1000);
    });
  }
};

export const banCacheBanHandler: EventHandlerFn<Events.GuildBanAdd> = async (
  ctx: Context,
  ban: GuildBan,
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
  let guildBans;
  try {
    guildBans = await getGuildBans(guild);
  } catch (err) {
    log.debug(
      {
        guildId: guild.id,
        guildName: guild.name,
        err,
      },
      "Failed to fetch server bans",
    );

    return;
  }

  // Clear bans first, in case it's a rejoin
  await db
    .deleteFrom("app_public.guild_bans")
    .where("guild_id", "=", guild.id)
    .execute();

  if (guildBans.length === 0) {
    // No bans, skip insertion
    return;
  }

  await db
    .insertInto("app_public.guild_bans")
    .values(
      guildBans.map((userId) => ({
        guild_id: guild.id,
        user_id: userId,
      })),
    )
    // Ignore conflicts, there shouldn't be any cuz we just cleared them but
    // who knows
    .onConflict((oc) => oc.doNothing())
    .execute();
};
