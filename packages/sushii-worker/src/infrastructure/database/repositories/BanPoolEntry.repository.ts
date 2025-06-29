import { DeleteResult, Kysely } from "kysely";
import { DB } from "../../infrastructure/database/config/dbTypes";
import {
  BanPoolEntryRow,
  InsertableBanPoolEntryRow,
} from "./BanPoolEntry.table";

/**
 * Insert a new ban pool entry
 *
 * @param db database
 * @param entry ban pool entry to insert
 * @returns
 */
export function insertBanPoolEntry(
  db: Kysely<DB>,
  entry: InsertableBanPoolEntryRow | InsertableBanPoolEntryRow[],
): Promise<BanPoolEntryRow> {
  return db
    .insertInto("app_public.ban_pool_entries")
    .values(entry)
    .returningAll()
    .executeTakeFirstOrThrow();
}

/**
 *
 * @param db database
 * @param poolName pool name
 * @param ownerGuildId guild id of the pool owner
 * @param userId user id of the entry
 * @returns
 */
export function deleteBanPoolEntry(
  db: Kysely<DB>,
  poolName: string,
  ownerGuildId: string,
  userId: string,
): Promise<DeleteResult> {
  return db
    .deleteFrom("app_public.ban_pool_entries")
    .where("pool_name", "=", poolName)
    .where("owner_guild_id", "=", ownerGuildId)
    .where("user_id", "=", userId)
    .executeTakeFirstOrThrow();
}
