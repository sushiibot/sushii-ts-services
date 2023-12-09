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

/**
 * Fetch all mod logs that start with the provided case id digits
 */
export function searchModLogsByIDPrefix(
  db: Kysely<DB>,
  {
    guildId,
    searchCaseId,
    maxResults = 25,
  }: {
    guildId: string;
    searchCaseId: number;
    maxResults?: number;
  },
): Promise<ModLogRow[]> {
  return db
    .selectFrom("app_public.mod_logs")
    .selectAll()
    .where("guild_id", "=", guildId)
    .where("case_id", "like", `${searchCaseId}%`)
    .orderBy("case_id", "desc")
    .limit(maxResults)
    .execute();
}

/**
 * Fetch mod logs with highest case id
 *
 * @param db
 * @param param1
 * @returns
 */
export function getRecentModLogs(
  db: Kysely<DB>,
  { guildId, maxResults = 25 }: { guildId: string; maxResults?: number },
): Promise<ModLogRow[]> {
  return db
    .selectFrom("app_public.mod_logs")
    .selectAll()
    .where("guild_id", "=", guildId)
    .orderBy("case_id", "desc")
    .limit(maxResults)
    .execute();
}
