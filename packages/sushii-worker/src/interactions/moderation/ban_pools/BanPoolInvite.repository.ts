import { DeleteResult } from "kysely";
import db from "../../../model/db";
import { BanPoolInviteRow, InsertableBanPoolInviteRow } from "./BanPoolInvite.table";


export function insertBanPoolInvite(
  invite: InsertableBanPoolInviteRow
): Promise<BanPoolInviteRow> {
  return db
    .insertInto("app_public.ban_pool_invites")
    .values(invite)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export function getBanPoolInviteByCode(
  inviteCode: string
): Promise<BanPoolInviteRow | undefined> {
  return db
    .selectFrom("app_public.ban_pool_invites")
    .selectAll()
    .where("invite_code", "=", inviteCode)
    .executeTakeFirst();
}

/**
 * Deletes a ban pool invite
 * 
 * @param inviteCode the invite code to delete
 * @returns 
 */
export function deleteBanPoolInvite(
  inviteCode: string
): Promise<DeleteResult> {
  return db
    .deleteFrom("app_public.ban_pool_invites")
    .where("invite_code", "=", inviteCode)
    .executeTakeFirstOrThrow();
}