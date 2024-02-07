import { DeleteResult, Kysely, sql } from "kysely";
import { DB } from "../../model/dbTypes";
import { InsertableModLogRow, ModLogRow } from "./ModLog.table";

export function upsertModLog(
  db: Kysely<DB>,
  modLog: InsertableModLogRow,
): Promise<ModLogRow | undefined> {
  return db
    .insertInto("app_public.mod_logs")
    .values(modLog)
    .onConflict((oc) => oc.columns(["guild_id", "case_id"]).doUpdateSet(modLog))
    .returningAll()
    .executeTakeFirst();
}

export function getModLog(
  db: Kysely<DB>,
  guildId: string,
  caseId: string,
): Promise<ModLogRow | undefined> {
  return db
    .selectFrom("app_public.mod_logs")
    .selectAll()
    .where("guild_id", "=", guildId)
    .where("case_id", "=", caseId)
    .executeTakeFirst();
}

export function deleteModLog(
  db: Kysely<DB>,
  guildId: string,
  caseId: string,
): Promise<DeleteResult> {
  return db
    .deleteFrom("app_public.mod_logs")
    .where("guild_id", "=", guildId)
    .where("case_id", "=", caseId)
    .executeTakeFirst();
}

export function getModLogsRange(
  db: Kysely<DB>,
  guildId: string,
  startCaseId: string,
  endCaseId: string,
): Promise<ModLogRow[]> {
  return db
    .selectFrom("app_public.mod_logs")
    .selectAll()
    .where("guild_id", "=", guildId)
    .where("case_id", ">=", startCaseId)
    .where("case_id", "<=", endCaseId)
    .orderBy("case_id", "asc")
    .execute();
}

export function getPendingModLog(
  db: Kysely<DB>,
  guildId: string,
  userId: string,
): Promise<ModLogRow | undefined> {
  return (
    db
      .selectFrom("app_public.mod_logs")
      .selectAll()
      .where("guild_id", "=", guildId)
      .where("user_id", "=", userId)
      .where("pending", "=", true)
      // Latest first
      .orderBy("action_time desc")
      .executeTakeFirst()
  );
}

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
  return (
    db
      .selectFrom("app_public.mod_logs")
      .selectAll()
      .where("guild_id", "=", guildId)
      .where("user_id", "=", userId)
      // Oldest first
      .orderBy("case_id", "asc")
      .execute()
  );
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
  return (
    db
      .selectFrom("app_public.mod_logs")
      .selectAll()
      .where("guild_id", "=", guildId)
      .where(
        (eb) => sql<string>`cast(${eb.ref("case_id")} as text)`,
        "like",
        `${searchCaseId}%`,
      )
      // Newest first - top newest in autocomplete
      .orderBy("case_id", "desc")
      .limit(maxResults)
      .execute()
  );
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
  return (
    db
      .selectFrom("app_public.mod_logs")
      .selectAll()
      .where("guild_id", "=", guildId)
      // Newest first - top newest in autocomplete
      .orderBy("case_id", "desc")
      .limit(maxResults)
      .execute()
  );
}

export function deleteModLogsRange(
  db: Kysely<DB>,
  guildId: string,
  startCaseId: string,
  endCaseId: string,
): Promise<ModLogRow[]> {
  return db
    .deleteFrom("app_public.mod_logs")
    .where("guild_id", "=", guildId)
    .where("case_id", ">=", startCaseId)
    .where("case_id", "<=", endCaseId)
    .returningAll()
    .execute();
}

export function updateModLogReasonRange(
  db: Kysely<DB>,
  guildId: string,
  executorId: string,
  startCaseId: string,
  endCaseId: string,
  reason: string,
  onlyEmptyReason: boolean,
): Promise<ModLogRow[]> {
  const query = db
    .updateTable("app_public.mod_logs")
    .set({
      reason,
      executor_id: executorId,
    })
    .returningAll()
    .where("guild_id", "=", guildId)
    .where("case_id", ">=", startCaseId)
    .where("case_id", "<=", endCaseId);

  if (onlyEmptyReason) {
    query.where("reason", "is", null);
  }

  return query.execute();
}

export async function getNextCaseId(
  db: Kysely<DB>,
  guildId: string,
): Promise<number> {
  const lastCaseId = await db
    .selectFrom("app_public.mod_logs")
    .select((eb) => eb.fn.max("case_id").as("last_case_id"))
    .where("guild_id", "=", guildId)
    .executeTakeFirst();

  if (!lastCaseId?.last_case_id) {
    return 1;
  }

  return parseInt(lastCaseId.last_case_id, 10) + 1;
}
