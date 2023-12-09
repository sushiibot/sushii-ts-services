import { Kysely } from "kysely";
import { DB } from "../../model/dbTypes";
import { ModLogRow } from "./ModLog.table";

/**
 * Fetch all mod log entries for a user in a guild
 *
 * @param db database
 * @param guildId the guild to search
 * @param userId the user to search
 * @returns
 */
export function getUserModLogHistory(
  db: Kysely<DB>,
  {
    guildId,
    userId,
  }: {
    guildId: string;
    userId: string;
  },
): Promise<ModLogRow[]> {
  return db
    .selectFrom("app_public.mod_logs")
    .selectAll()
    .where("guild_id", "=", guildId)
    .where("user_id", "=", userId)
    .execute();
}
