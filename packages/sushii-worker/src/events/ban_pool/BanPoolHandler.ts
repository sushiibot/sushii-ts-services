/**
 * Handlers for ban pools.
 *
 * Discord events:
 * - Ban create -> check pools -> action
 * - Ban remove -> check pools -> action
 *
 * Sushii events:
 * - User added to ban pool -> check all pool members -> action
 * - User removed from ban pool -> check all pool members -> action
 */

import {
  ActionRowBuilder,
  AuditLogEvent,
  Events,
  Guild,
  GuildAuditLogsEntry,
  GuildBan,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import db from "../../model/db";
import { getAllBanPoolMemberships } from "../../interactions/moderation/ban_pools/BanPoolMember.repository";
import { BanPoolMemberRow } from "../../interactions/moderation/ban_pools/BanPoolMember.table";
import logger from "../../logger";
import { banPoolEmitter } from "./BanPoolEmitter";
import { getGuildSettings } from "../../interactions/moderation/ban_pools/GuildSettings.repository";
import { insertBanPoolEntry } from "../../db/BanPool/BanPoolEntry.repository";
import { InsertableBanPoolEntryRow } from "../../db/BanPool/BanPoolEntry.table";
import { EventHandlerFn } from "../EventHandler";
import Context from "../../model/context";

const log = logger.child({ module: "BanPoolDiscordEventHandler" });

type SeparatePoolActions<T> = {
  add: T[];
  manual: T[];
  nothing: T[];
};

function categorizePoolDataActions(
  pool: BanPoolMemberRow[],
): SeparatePoolActions<BanPoolMemberRow> {
  const res = {
    add: [] as BanPoolMemberRow[],
    manual: [] as BanPoolMemberRow[],
    nothing: [] as BanPoolMemberRow[],
  };

  for (const p of pool) {
    switch (p.add_mode) {
      case "all_bans":
        res.add.push(p);
        break;
      case "manual":
        res.manual.push(p);
        break;
      case "nothing":
        res.nothing.push(p);
        break;
    }
  }

  return res;
}

function poolToSelectMenuOption(
  member: BanPoolMemberRow,
): StringSelectMenuOptionBuilder {
  return new StringSelectMenuOptionBuilder()
    .setLabel(member.pool_name)
    .setDescription(member.pool_name)
    .setValue(`${member.owner_guild_id}.${member.pool_name}`);
}

export const banPoolBanHandler: EventHandlerFn<
  Events.GuildAuditLogEntryCreate
> = async (ctx: Context, event: GuildAuditLogsEntry, guild: Guild) => {
  // Not a ban, ignore
  if (event.action !== AuditLogEvent.MemberBanAdd) {
    return;
  }

  // TODO: Ignore if sushii banned because of another pool, otherwise this leads
  // to a chain reaction of bans
  if (event.executor?.id === ctx.client.user?.id) {
    log.debug("Ignoring ban event because it was done by sushii");
  }
};

/**
 * When a user is banned from a server, emit any pool add events.
 *
 * @param ban
 */
export const banPoolOnBanHandler: EventHandlerFn<Events.GuildBanAdd> = async (
  ctx: Context,
  ban: GuildBan,
): Promise<void> => {
  // TODO: Ignore if sushii banned because of another pool, otherwise this leads
  // to a chain reaction of bans

  // Get all pool memberships from the adder guild - this includes owned pools!
  const settings = await getGuildSettings(db, ban.guild.id);
  const memberships = await getAllBanPoolMemberships(db, ban.guild.id);
  const poolDataCategories = categorizePoolDataActions(memberships);

  const poolEntries: InsertableBanPoolEntryRow[] = poolDataCategories.add.map(
    (poolData) => ({
      owner_guild_id: poolData.owner_guild_id,
      pool_name: poolData.pool_name,
      source_guild_id: ban.guild.id,
      user_id: ban.user.id,
      reason: ban.reason,
    }),
  );

  if (poolEntries.length > 0) {
    // Batch insert all entries
    await insertBanPoolEntry(db, poolEntries);
    log.debug(
      {
        poolEntriesCount: poolEntries.length,
        banSourceGuildId: ban.guild.id,
        banUserId: ban.user.id,
      },
      "Inserted ban pool entries",
    );

    /* eslint-disable no-await-in-loop */
    log.debug(
      {
        poolEntriesCount: poolEntries.length,
        banSourceGuildId: ban.guild.id,
        banUserId: ban.user.id,
      },
      "Emitting ban pool add events",
    );
    for (const poolData of poolDataCategories.add) {
      banPoolEmitter.emit("poolAdd", {
        ownerGuildId: poolData.owner_guild_id,
        poolName: poolData.pool_name,
        sourceGuildId: ban.guild.id,
        user: ban.user,
      });
    }
    /* eslint-enable */
  }

  if (!settings?.alert_channel_id) {
    return;
  }

  const channel = ban.guild.channels.cache.get(settings.alert_channel_id);
  if (!channel || !channel.isTextBased()) {
    return;
  }

  // Send prompt for manual adds
  const selectOptions = poolDataCategories.manual.map(poolToSelectMenuOption);
  const selectMenu = new StringSelectMenuBuilder()
    .addOptions(selectOptions)
    .setCustomId("ban_pool_manual_add_prompt")
    .setPlaceholder("Add to a ban pools");

  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    selectMenu,
  );

  await channel.send({
    components: [row],
  });

  // TODO: Component handler, emit poolAdd for selected
};
