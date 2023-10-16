import { EmbedBuilder } from "discord.js";
import dayjs from "dayjs";
import { randomBytes } from "crypto";
import base32 from "hi-base32";
import Color from "../../../utils/colors";
import { BanPoolError, inviteLimitReachedEmbed, notFoundBasic } from "./errors";
import { getPoolByNameAndGuildId } from "./BanPool.repository";
import {
  deleteAllBanPoolInvites,
  deleteBanPoolInvite,
  getBanPoolInviteByCode,
  getBanPoolInviteCount,
  insertBanPoolInvite,
} from "./BanPoolInvite.repository";
import db from "../../../model/db";

/**
 *  Create a randomized base64 string without special characters
 *
 * @returns randomized clean base64 string
 */
export function generateInvite(): string {
  return base32.encode(randomBytes(6)).toLowerCase().replace(/=/g, "");
}

export async function createInvite(
  poolName: string,
  guildId: string,
  expireDate: dayjs.Dayjs | null,
  maxUses: number | null,
): Promise<string> {
  const pool = await getPoolByNameAndGuildId(db, poolName, guildId);
  if (!pool) {
    throw new BanPoolError(
      "POOL_NOT_FOUND",
      "Ban pool not found",
      notFoundBasic,
    );
  }

  // Check how many invites this pool already has
  const inviteCount = await getBanPoolInviteCount(db, poolName, guildId);
  if (inviteCount >= 20) {
    throw new BanPoolError(
      "INVITE_LIMIT_REACHED",
      "Invite limit reached",
      inviteLimitReachedEmbed,
    );
  }

  // Create invite
  const inviteCode = generateInvite();

  await insertBanPoolInvite(db, {
    owner_guild_id: guildId,
    pool_name: poolName,
    invite_code: inviteCode,
    expires_at: expireDate?.toDate(),
    max_uses: maxUses,
    // Default is 0
    // uses: 0,
  });

  return inviteCode;
}

export async function checkAndDeleteInvite(
  inviteCode: string,
  currentGuildId: string,
): Promise<void> {
  const invite = await getBanPoolInviteByCode(db, inviteCode);

  // Not found OR expired
  if (
    !invite ||
    (invite.expires_at && dayjs.utc(invite.expires_at).isBefore(dayjs.utc()))
  ) {
    const embed = new EmbedBuilder()
      .setTitle("Invite not found")
      .setDescription("The invite code you provided is invalid or has expired.")
      .setColor(Color.Error);

    throw new BanPoolError("INVITE_NOT_FOUND", "Invite not found", embed);
  }

  // Check if this server owns the invite
  if (invite.owner_guild_id !== currentGuildId) {
    const embed = new EmbedBuilder()
      .setTitle("Invite not found")
      .setDescription("The invite code you provided is invalid or has expired.")
      .setColor(Color.Error);

    throw new BanPoolError("INVITE_NOT_FOUND", "Invite not found", embed);
  }

  // Delete invite
  await deleteBanPoolInvite(db, inviteCode);
}

/**
 * Clears all invites for a ban pool
 *
 * @param poolName pool name to clear invites for
 * @param guildId guild ID to clear invites for
 */
export async function clearBanPoolInvites(
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

  await deleteAllBanPoolInvites(db, poolName, guildId);
}
