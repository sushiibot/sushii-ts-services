import { EmbedBuilder } from "discord.js";
import dayjs from "dayjs";
import { randomBytes } from "crypto";
import base32 from "hi-base32";
import Color from "../../../utils/colors";
import {
  BanPoolError,
  notFoundBasic,
} from "./errors"
import { getPoolByNameAndGuildId } from "./BanPool.repository";
import { deleteBanPoolInvite, getBanPoolInviteByCode, insertBanPoolInvite } from "./BanPoolInvite.repository";

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
  expireAfter: string
): Promise<string> {
  const pool = await getPoolByNameAndGuildId(poolName, guildId);
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

  await insertBanPoolInvite({
    owner_guild_id: guildId,
    pool_name: poolName,
    invite_code: inviteCode,
    expires_at: expireDate?.toDate(),
  })

  return inviteCode;
}

export async function checkAndDeleteInvite(
  currentGuildId: string,
  inviteCode: string,
  ): Promise<void> {
  const invite = await getBanPoolInviteByCode(inviteCode);

  // Not found OR expired
  if (!invite || (invite.expires_at && dayjs.utc(invite.expires_at).isBefore(dayjs.utc()))) {
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
  await deleteBanPoolInvite(inviteCode);
}
