import { EmbedBuilder, Guild } from "discord.js";
import dayjs from "dayjs";
import { AllSelection } from "kysely/dist/cjs/parser/select-parser";
import db from "../../../model/db";
import Color from "../../../utils/colors";
import { DB } from "../../../model/dbTypes";
import {
  BanPoolError,
  guildUnavailableEmbed,
  inviteExpiredEmbed,
  inviteNotFoundEmbed,
  joinOwnPoolEmbed,
  joinPoolAlreadyMemberEmbed,
  notFoundBasic,
  notFoundWithIDEmbed,
} from "./errors"
import { getPoolByNameAndGuildId, getPoolByNameOrIdAndGuildId, insertPool } from "./BanPool.repository";
import { getBanPoolInviteByCode, insertBanPoolInvite } from "./BanPoolInvite.repository";
import { getBanPoolMember, getBanPoolMembers, insertBanPoolMember } from "./BanPoolMember.repository";
import { BanPoolRow } from "./BanPool.table";
import { BanPoolMemberRow } from "./BanPoolMember.table";
import { generateInvite } from "./BanPoolInvite.service";

export async function createPool(
  poolName: string,
  guildId: string,
  creatorId: string,
  description: string | null
): Promise<{
  pool: AllSelection<DB, "app_public.ban_pools">,
  inviteCode: string
}> {
  const existingPool = await getPoolByNameAndGuildId(poolName, guildId);

  if (existingPool) {
    const embed = new EmbedBuilder()
      .setTitle("Ban pool already exists")
      .setDescription("Use a different name for your ban pool.")
      .setColor(Color.Error);

    throw new BanPoolError(
      "POOL_ALREADY_EXISTS",
      "Ban pool already exists",
      embed
    );
  }

  const pool = await insertPool({
      pool_name: poolName,
      description,
      guild_id: guildId,
      creator_id: creatorId,
    });

  const inviteCode = generateInvite();

  // Create 1d invite code
  await insertBanPoolInvite({
    owner_guild_id: guildId,
    pool_name: poolName,
    invite_code: inviteCode,
    expires_at: dayjs.utc().add(1, "day").toDate(),
  })

  return {
    pool,
    inviteCode,
  };
}

export async function joinPool(
  inviteCode: string,
  guildId: string,
  getOwnerGuild: (guildId: string) => Guild | undefined
): Promise<{
  pool: AllSelection<DB, "app_public.ban_pools">;
  guild: Guild;
}> {
  const invite = await getBanPoolInviteByCode(inviteCode)

  if (!invite) {
    throw new BanPoolError(
      "INVITE_NOT_FOUND",
      "Invite not found",
      inviteNotFoundEmbed
    );
  }

  // Check if invite is expired
  if (dayjs.utc(invite.expires_at).isBefore(dayjs.utc())) {
    // Delete the expired invite
    await db
      .deleteFrom("app_public.ban_pool_invites")
      .where("invite_code", "=", inviteCode)
      .execute();

    throw new BanPoolError(
      "INVITE_EXPIRED",
      "Invite expired",
      inviteExpiredEmbed
    );
  }

  // Invite's guild id, not current guild id
  const pool = await getPoolByNameAndGuildId(invite.pool_name, invite.owner_guild_id);

  // This shouldn't really happen since invite will be deleted if pool is also deleted
  if (!pool) {
    throw new BanPoolError("POOL_NOT_FOUND", "Pool not found", notFoundBasic);
  }

  // Check if it's the server's own pool
  if (pool.guild_id === guildId) {
    throw new BanPoolError(
      "CANNOT_JOIN_OWN_POOL",
      "Can't join your own pool",
      joinOwnPoolEmbed
    );
  }

  // Check if this guild is already a member of the pool
  const existingMember = await getBanPoolMember(
    guildId,
    pool,
  )

  if (existingMember) {
    throw new BanPoolError(
      "POOL_ALREADY_MEMBER",
      "Already in pool",
      joinPoolAlreadyMemberEmbed
    );
  }

  // Get guild info of pool owner
  const ownerGuild = getOwnerGuild(pool.guild_id);
  if (!ownerGuild) {
    throw new BanPoolError(
      "GUILD_UNAVAILABLE",
      "Guild unavailable",
      guildUnavailableEmbed
    );
  }

  // Join pool
  await insertBanPoolMember({
    member_guild_id: guildId,
    owner_guild_id: pool.guild_id,
    pool_name: pool.pool_name,
  })

  return {
    pool,
    guild: ownerGuild,
  };
}

export async function showPool(
  nameOrID: string,
  guildId: string
): Promise<{
  pool: BanPoolRow;
  poolMember?: BanPoolMemberRow;
  members: BanPoolMemberRow[];
}> {
  const pool = await getPoolByNameOrIdAndGuildId(nameOrID, guildId);
  if (!pool) {
    throw new BanPoolError(
      "POOL_NOT_FOUND",
      "Ban pool not found",
      notFoundWithIDEmbed
    );
  }

  // Make sure this server is allowed to view it, either owner or member
  let canView = pool.guild_id === guildId;

  // Not owner, check if member
  let poolMember
  if (!canView) {
    poolMember = await getBanPoolMember(guildId, pool)

    // If member was found
    canView = poolMember !== undefined;
  }

  if (!canView) {
    throw new BanPoolError(
      "POOL_NOT_FOUND",
      "Ban pool not found",
      notFoundWithIDEmbed
    );
  }

  const members = await getBanPoolMembers(pool.guild_id, pool.pool_name)

  return {
    pool,
    poolMember,
    members,
  };
}

export async function deletePool(
  poolName: string,
  guildId: string
): Promise<void> {
  const pool = await getPoolByNameAndGuildId(poolName, guildId);
  if (!pool) {
    throw new BanPoolError(
      "POOL_NOT_FOUND",
      "Ban pool not found",
      notFoundBasic
    );
  }

  // Delete pool
  await deletePool(poolName, guildId);
}
