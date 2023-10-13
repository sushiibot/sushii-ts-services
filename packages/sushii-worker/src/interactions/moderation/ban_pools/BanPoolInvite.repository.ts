import { DeleteResult, Kysely, UpdateResult } from "kysely";
import dayjs from "dayjs";
import { BanPoolInviteRow, InsertableBanPoolInviteRow } from "./BanPoolInvite.table";
import { DB } from "../../../model/dbTypes";

export function insertBanPoolInvite(
  db: Kysely<DB>,
  invite: InsertableBanPoolInviteRow
): Promise<BanPoolInviteRow> {
  return db
    .insertInto("app_public.ban_pool_invites")
    .values(invite)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export function getBanPoolInviteByCode(
  db: Kysely<DB>,
  inviteCode: string
): Promise<BanPoolInviteRow | undefined> {
  return db
    .selectFrom("app_public.ban_pool_invites")
    .selectAll()
    .where("invite_code", "=", inviteCode)
    .executeTakeFirst();
}

export function incrementBanPoolInviteUse(
  db: Kysely<DB>,
  inviteCode: string
): Promise<UpdateResult> {
  return db
    .updateTable("app_public.ban_pool_invites")
    .set((eb) => ({
      uses: eb("uses", "+", 1),
    }))
    .where("invite_code", "=", inviteCode)
    .executeTakeFirst();
}

export function getAllBanPoolInvites(
  db: Kysely<DB>,
  poolName: string,
  guildId: string
): Promise<BanPoolInviteRow[]> {
  return db
      .selectFrom("app_public.ban_pool_invites")
      .selectAll()
      .where("owner_guild_id", "=", guildId)
      .where("pool_name", "=", poolName)
      // Ignore expired invites - only include expires_at in future
      .where("expires_at", ">", dayjs.utc().toDate())
      .execute();
}

/**
 * Deletes a ban pool invite
 * 
 * @param inviteCode the invite code to delete
 * @returns 
 */
export function deleteBanPoolInvite(
  db: Kysely<DB>,
  inviteCode: string
): Promise<DeleteResult> {
  return db
    .deleteFrom("app_public.ban_pool_invites")
    .where("invite_code", "=", inviteCode)
    .executeTakeFirstOrThrow();
}

/**
 * Deletes all invites for a ban pool
 * 
 * @param inviteCode the invite code to delete
 * @returns 
 */
export function deleteAllBanPoolInvites(
  db: Kysely<DB>,
  poolName: string,
  guildId: string,
): Promise<DeleteResult> {
  return db
    .deleteFrom("app_public.ban_pool_invites")
    .where("pool_name", "=", poolName)
    .where("owner_guild_id", "=", guildId)
    .executeTakeFirstOrThrow();
}