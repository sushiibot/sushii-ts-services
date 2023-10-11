import { EmbedBuilder, Guild } from "discord.js";
import dayjs from "dayjs";
import { randomBytes } from "crypto";
import base32 from "hi-base32";
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

// Create a randomized base64 string without special characters and starting with lg-
function generateInvite(): string {
  return base32.encode(randomBytes(6)).toLowerCase().replace(/=/g, "");
}

export async function createPool(
  poolName: string,
  guildId: string,
  creatorId: string,
  description: string | null
): Promise<{
  pool: AllSelection<DB, "app_public.ban_pools">,
  inviteCode: string
}> {
  const existingPool = await db
    .selectFrom("app_public.ban_pools")
    .selectAll()
    .where("pool_name", "=", poolName)
    .where("guild_id", "=", guildId)
    .executeTakeFirst();

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

  const pool = await db
    .insertInto("app_public.ban_pools")
    .values({
      pool_name: poolName,
      description,
      guild_id: guildId,
      creator_id: creatorId,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  const inviteCode = generateInvite();

  // Create 1d invite code
  await db
    .insertInto("app_public.ban_pool_invites")
    .values({
      owner_guild_id: guildId,
      pool_name: poolName,
      invite_code: inviteCode,
      expires_at: dayjs.utc().add(1, "day").toDate(),
    })
    .returningAll()
    .executeTakeFirstOrThrow();

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
  const invite = await db
    .selectFrom("app_public.ban_pool_invites")
    .selectAll()
    .where("invite_code", "=", inviteCode)
    .executeTakeFirst();

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

  const pool = await db
    .selectFrom("app_public.ban_pools")
    .selectAll()
    .where("pool_name", "=", invite.pool_name)
    // Invite's guild id, not current guild id
    .where("guild_id", "=", invite.owner_guild_id)
    .executeTakeFirst();

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
  const existingMember = await db
    .selectFrom("app_public.ban_pool_members")
    .selectAll()
    .where("member_guild_id", "=", guildId)
    .where("owner_guild_id", "=", pool.guild_id)
    .where("pool_name", "=", pool.pool_name)
    .executeTakeFirst();

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
  await db
    .insertInto("app_public.ban_pool_members")
    .values({
      member_guild_id: guildId,
      owner_guild_id: pool.guild_id,
      pool_name: pool.pool_name,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return {
    pool,
    guild: ownerGuild,
  };
}

export async function showPool(
  nameOrID: string,
  guildId: string
): Promise<{
  pool: AllSelection<DB, "app_public.ban_pools">;
  members: AllSelection<DB, "app_public.ban_pool_members">[];
}> {
  const poolID = parseInt(nameOrID, 10);

  let poolQuery = db.selectFrom("app_public.ban_pools").selectAll();

  if (Number.isNaN(poolID)) {
    poolQuery = poolQuery
      .where("pool_name", "=", nameOrID)
      .where("guild_id", "=", guildId);
  } else {
    poolQuery = poolQuery.where((eb) =>
      eb.or([
        // Could be a number as the name
        eb.and([eb("pool_name", "=", nameOrID), eb("guild_id", "=", guildId)]),

        // Could be a number ID
        eb("id", "=", poolID),
      ])
    );
  }

  const pool = await poolQuery.executeTakeFirst();
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
  if (!canView) {
    const member = await db
      .selectFrom("app_public.ban_pool_members")
      .selectAll()
      .where("member_guild_id", "=", guildId)
      .where("pool_name", "=", pool.pool_name)
      .executeTakeFirst();

    // If member was found
    canView = !!member;
  }

  if (!canView) {
    throw new BanPoolError(
      "POOL_NOT_FOUND",
      "Ban pool not found",
      notFoundWithIDEmbed
    );
  }

  const members = await db
    .selectFrom("app_public.ban_pool_members")
    .selectAll()
    .where("owner_guild_id", "=", pool.guild_id)
    .where("pool_name", "=", pool.pool_name)
    .execute();

  return {
    pool,
    members,
  };
}

export async function deletePool(
  poolName: string,
  guildId: string
): Promise<void> {
  const pool = await db
    .selectFrom("app_public.ban_pools")
    .selectAll()
    .where("pool_name", "=", poolName)
    .where("guild_id", "=", guildId)
    .executeTakeFirst();

  if (!pool) {
    throw new BanPoolError(
      "POOL_NOT_FOUND",
      "Ban pool not found",
      notFoundBasic
    );
  }

  // Delete pool
  await db
    .deleteFrom("app_public.ban_pools")
    .where("pool_name", "=", poolName)
    .where("guild_id", "=", guildId)
    .execute();
}

export async function createInvite(
  poolName: string,
  guildId: string,
  expireAfter: string
): Promise<string> {
  const pool = await db
    .selectFrom("app_public.ban_pools")
    .selectAll()
    .where("pool_name", "=", poolName)
    .where("guild_id", "=", guildId)
    .executeTakeFirst();

  if (!pool) {
    throw new BanPoolError(
      "POOL_NOT_FOUND",
      "Ban pool not found",
      notFoundBasic
    );
  }

  // Create invite
  const inviteCode = generateInvite();

  const expireDate =
    expireAfter === "never"
      ? null
      : dayjs.utc().add(parseInt(expireAfter, 10), "seconds");

  await db
    .insertInto("app_public.ban_pool_invites")
    .values({
      owner_guild_id: guildId,
      pool_name: poolName,
      invite_code: inviteCode,
      expires_at: expireDate?.toDate(),
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return inviteCode;
}

export async function deleteInvite(inviteCode: string): Promise<void> {
  const invite = await db
    .selectFrom("app_public.ban_pool_invites")
    .selectAll()
    .where("invite_code", "=", inviteCode)
    .where((eb) =>
      eb.or([
        // Either null expiry
        eb("expires_at", "is", null),

        // Or not expired yet
        eb("expires_at", ">", dayjs.utc().toDate()),
      ])
    )
    .executeTakeFirst();

  if (!invite) {
    const embed = new EmbedBuilder()
      .setTitle("Invite not found")
      .setDescription("The invite code you provided is invalid or has expired.")
      .setColor(Color.Error);

    throw new BanPoolError("INVITE_NOT_FOUND", "Invite not found", embed);
  }

  // Delete invite
  await db
    .deleteFrom("app_public.ban_pool_invites")
    .where("invite_code", "=", inviteCode)
    .execute();
}
