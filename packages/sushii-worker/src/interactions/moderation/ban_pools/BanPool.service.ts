import { EmbedBuilder, Guild } from "discord.js";
import dayjs from "dayjs";
import db from "../../../infrastructure/database/config/db";
import Color from "../../../utils/colors";
import {
  BanPoolError,
  guildUnavailableEmbed,
  inviteExpiredEmbed,
  inviteMaxUseReachedEmbed,
  inviteNotFoundEmbed,
  joinOwnPoolEmbed,
  joinPoolAlreadyMemberEmbed,
  notFoundBasic,
  notFoundWithIDEmbed,
  ownedPoolLimitReachedEmbed,
} from "./errors";
import {
  getGuildBanPoolCount,
  getPoolByNameAndGuildId,
  getPoolByNameOrIdAndGuildId,
  insertPool,
} from "./BanPool.repository";
import {
  deleteBanPoolInvite,
  getBanPoolInviteByCode,
  getBanPoolInviteCount,
  incrementBanPoolInviteUse,
  insertBanPoolInvite,
} from "./BanPoolInvite.repository";
import {
  getBanPoolMember,
  getBanPoolMemberCount,
  insertBanPoolMember,
} from "./BanPoolMember.repository";
import { BanPoolRow } from "./BanPool.table";
import { BanPoolMemberRow } from "./BanPoolMember.table";
import { generateInvite } from "./BanPoolInvite.service";

const GUILD_MAX_OWNED_POOLS = 10;

export async function createPool(
  poolName: string,
  guildId: string,
  creatorId: string,
  description: string | null,
): Promise<{
  pool: BanPoolRow;
  member: BanPoolMemberRow;
  inviteCode: string;
}> {
  const guildPoolCount = await getGuildBanPoolCount(db, guildId);
  if (guildPoolCount >= GUILD_MAX_OWNED_POOLS) {
    throw new BanPoolError(
      "POOL_OWN_COUNT_LIMIT_REACHED",
      "Too many ban pools",
      ownedPoolLimitReachedEmbed,
    );
  }

  const existingPool = await getPoolByNameAndGuildId(db, poolName, guildId);

  if (existingPool) {
    const embed = new EmbedBuilder()
      .setTitle("Ban pool already exists")
      .setDescription("Use a different name for your ban pool.")
      .setColor(Color.Error);

    throw new BanPoolError(
      "POOL_ALREADY_EXISTS",
      "Ban pool already exists",
      embed,
    );
  }

  // Insert BOTH pool and pool member
  let pool: BanPoolRow | undefined;
  let member: BanPoolMemberRow | undefined;
  await db.transaction().execute(async (tx) => {
    pool = await insertPool(tx, {
      pool_name: poolName,
      description,
      guild_id: guildId,
      creator_id: creatorId,
    });

    member = await insertBanPoolMember(tx, {
      member_guild_id: guildId,
      owner_guild_id: guildId,
      pool_name: poolName,
      permission: "owner",
    });
  });

  // Tx awaited so it should be set
  if (!pool || !member) {
    throw new Error("this shouldn't happen but it probably will lol");
  }

  const inviteCode = generateInvite();

  // Create 1d invite code
  await insertBanPoolInvite(db, {
    owner_guild_id: guildId,
    pool_name: poolName,
    invite_code: inviteCode,
    expires_at: dayjs.utc().add(1, "day").toDate(),
  });

  return {
    pool,
    member,
    inviteCode,
  };
}

export async function joinPool(
  inviteCode: string,
  guildId: string,
  getOwnerGuild: (guildId: string) => Guild | undefined,
): Promise<{
  pool: BanPoolRow;
  guild: Guild;
}> {
  const invite = await getBanPoolInviteByCode(db, inviteCode);

  if (!invite) {
    throw new BanPoolError(
      "INVITE_NOT_FOUND",
      "Invite not found",
      inviteNotFoundEmbed,
    );
  }

  // Check if max uses is reached
  if (invite.max_uses && invite.uses >= invite.max_uses) {
    // Don't delete to keep track of how many times it was used

    throw new BanPoolError(
      "INVITE_MAX_USES_REACHED",
      "Invite max uses reached",
      inviteMaxUseReachedEmbed,
    );
  }

  // Check if invite is expired
  if (dayjs.utc(invite.expires_at).isBefore(dayjs.utc())) {
    // Delete the expired invite
    await deleteBanPoolInvite(db, inviteCode);

    throw new BanPoolError(
      "INVITE_EXPIRED",
      "Invite expired",
      inviteExpiredEmbed,
    );
  }

  // Invite's guild id, not current guild id
  const pool = await getPoolByNameAndGuildId(
    db,
    invite.pool_name,
    invite.owner_guild_id,
  );

  // This shouldn't really happen since invite will be deleted if pool is also deleted
  if (!pool) {
    throw new BanPoolError("POOL_NOT_FOUND", "Pool not found", notFoundBasic);
  }

  // Check if it's the server's own pool
  if (pool.guild_id === guildId) {
    throw new BanPoolError(
      "CANNOT_JOIN_OWN_POOL",
      "Can't join your own pool",
      joinOwnPoolEmbed,
    );
  }

  // Check if this guild is already a member of the pool
  const existingMember = await getBanPoolMember(db, guildId, pool);

  if (existingMember) {
    throw new BanPoolError(
      "POOL_ALREADY_MEMBER",
      "Already in pool",
      joinPoolAlreadyMemberEmbed,
    );
  }

  // Get guild info of pool owner
  const ownerGuild = getOwnerGuild(pool.guild_id);
  if (!ownerGuild) {
    throw new BanPoolError(
      "GUILD_UNAVAILABLE",
      "Guild unavailable",
      guildUnavailableEmbed,
    );
  }

  // Join pool
  await insertBanPoolMember(db, {
    member_guild_id: guildId,
    owner_guild_id: pool.guild_id,
    pool_name: pool.pool_name,
  });

  await db.transaction().execute(async (tx) => {
    // Always increment
    await incrementBanPoolInviteUse(tx, inviteCode);
  });

  return {
    pool,
    guild: ownerGuild,
  };
}

export async function showPool(
  nameOrID: string,
  guildId: string,
): Promise<{
  pool: BanPoolRow;
  poolMember: BanPoolMemberRow;
  memberCount: number;
  inviteCount: number;
}> {
  const pool = await getPoolByNameOrIdAndGuildId(db, nameOrID, guildId);
  if (!pool) {
    throw new BanPoolError(
      "POOL_NOT_FOUND",
      "Ban pool not found",
      notFoundWithIDEmbed,
    );
  }

  // Owner is still a member - only null if not owner OR not member
  const poolMember = await getBanPoolMember(db, guildId, pool);

  // No member, not allowed to view
  // TODO: Probably separate blocked to a different table ?
  if (!poolMember || poolMember.permission === "blocked") {
    throw new BanPoolError(
      "POOL_NOT_FOUND",
      "Ban pool not found",
      notFoundWithIDEmbed,
    );
  }

  const memberCount = await getBanPoolMemberCount(
    db,
    pool.pool_name,
    pool.guild_id,
  );

  let inviteCount = 0;
  // Only fetch invite count if owner
  if (!poolMember) {
    inviteCount = await getBanPoolInviteCount(
      db,
      pool.pool_name,
      pool.guild_id,
    );
  }

  return {
    pool,
    poolMember,
    memberCount,
    inviteCount,
  };
}

export async function deletePool(
  poolName: string,
  guildId: string,
): Promise<void> {
  const pool = await getPoolByNameAndGuildId(db, poolName, guildId);
  if (!pool) {
    throw new BanPoolError(
      "POOL_NOT_FOUND",
      "Ban pool not found",
      notFoundBasic,
    );
  }

  // Delete pool
  await deletePool(poolName, guildId);
}
