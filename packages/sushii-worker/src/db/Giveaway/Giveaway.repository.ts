import { DeleteResult, InsertResult, Kysely, UpdateResult, sql } from "kysely";
import dayjs from "dayjs";
import { DB } from "../../infrastructure/database/dbTypes";
import {
  GiveawayEntryRow,
  GiveawayRow,
  InsertableGiveawayRow,
  UpdateableGiveawayRow,
} from "./Giveaway.table";

export function createGiveaway(
  db: Kysely<DB>,
  giveaway: InsertableGiveawayRow,
): Promise<GiveawayRow> {
  return db
    .insertInto("app_public.giveaways")
    .values(giveaway)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export function getGiveaway(
  db: Kysely<DB>,
  guildId: string,
  giveawayId: string,
): Promise<GiveawayRow | undefined> {
  return db
    .selectFrom("app_public.giveaways")
    .selectAll()
    .where("guild_id", "=", guildId)
    .where("id", "=", giveawayId)
    .executeTakeFirst();
}

export function getAllActiveGiveaways(
  db: Kysely<DB>,
  guildId: string,
  limit: number | null = 25,
): Promise<GiveawayRow[]> {
  const query = db
    .selectFrom("app_public.giveaways")
    .selectAll()
    .where("guild_id", "=", guildId)
    // Not ended - no need to check end_at since this flag will be flipped
    .where("is_ended", "=", false)
    // Soonest ending first
    .orderBy("end_at", "asc");

  if (limit) {
    return query.limit(limit).execute();
  }

  return query.execute();
}

export async function countAllActiveGiveaways(db: Kysely<DB>): Promise<number> {
  const { count } = await db
    .selectFrom("app_public.giveaways")
    .select((eb) => eb.fn.countAll().as("count"))
    .where("is_ended", "=", false)
    .executeTakeFirstOrThrow();

  return Number(count);
}

export function getAllCompletedGiveaways(
  db: Kysely<DB>,
  guildId: string,
  limit: number | null = 25,
): Promise<GiveawayRow[]> {
  const query = db
    .selectFrom("app_public.giveaways")
    .selectAll()
    .where("guild_id", "=", guildId)
    .where("is_ended", "=", true)
    // Most recently ended first
    .orderBy("end_at", "desc");

  if (limit) {
    return query.limit(limit).execute();
  }

  return query.execute();
}

/**
 * Update all giveaways that are past the end_at date to be ended, and return
 * them.
 */
export function getAndEndPendingGiveaways(
  db: Kysely<DB>,
): Promise<GiveawayRow[]> {
  return (
    db
      .updateTable("app_public.giveaways")
      .set({
        is_ended: true,
      })
      .where("end_at", "<=", dayjs.utc().toDate())
      // Ignore giveaways that have been already ended
      .where("is_ended", "=", false)
      .returningAll()
      .execute()
  );
}

export function updateGiveaway(
  db: Kysely<DB>,
  giveawayId: string,
  giveaway: UpdateableGiveawayRow,
): Promise<GiveawayRow | undefined> {
  return db
    .updateTable("app_public.giveaways")
    .set(giveaway)
    .returningAll()
    .where("id", "=", giveawayId)
    .executeTakeFirst();
}

export function markGiveawayAsEnded(
  db: Kysely<DB>,
  giveawayId: string,
): Promise<GiveawayRow | undefined> {
  return updateGiveaway(db, giveawayId, {
    is_ended: true,
  });
}

export function deleteGiveaway(
  db: Kysely<DB>,
  guildId: string,
  giveawayId: string,
): Promise<GiveawayRow | undefined> {
  return db
    .deleteFrom("app_public.giveaways")
    .where("guild_id", "=", guildId)
    .where("id", "=", giveawayId)
    .returningAll()
    .executeTakeFirst();
}

export function getGiveawayEntry(
  db: Kysely<DB>,
  giveawayId: string,
  userId: string,
): Promise<GiveawayEntryRow | undefined> {
  return db
    .selectFrom("app_public.giveaway_entries")
    .selectAll()
    .where("giveaway_id", "=", giveawayId)
    .where("user_id", "=", userId)
    .executeTakeFirst();
}

export function createGiveawayEntries(
  db: Kysely<DB>,
  entries: {
    giveaway_id: string;
    user_id: string;
  }[],
): Promise<InsertResult> {
  return db
    .insertInto("app_public.giveaway_entries")
    .values(entries)
    .onConflict((oc) => oc.columns(["giveaway_id", "user_id"]).doNothing())
    .executeTakeFirst();
}

export function getGiveawayEntryCount(
  db: Kysely<DB>,
  giveawayId: string,
): Promise<number> {
  return db
    .selectFrom("app_public.giveaway_entries")
    .select((eb) => eb.fn.countAll<number>().as("count"))
    .where("giveaway_id", "=", giveawayId)
    .executeTakeFirstOrThrow()
    .then((row) => row.count);
}

export function deleteGiveawayEntry(
  db: Kysely<DB>,
  giveawayId: string,
  userId: string,
): Promise<DeleteResult> {
  return db
    .deleteFrom("app_public.giveaway_entries")
    .where("giveaway_id", "=", giveawayId)
    .where("user_id", "=", userId)
    .executeTakeFirstOrThrow();
}

export function getRandomGiveawayEntries(
  db: Kysely<DB>,
  giveawayId: string,
  allowRepeatWinners: boolean,
  count: number,
): Promise<GiveawayEntryRow[]> {
  const query = db
    .selectFrom("app_public.giveaway_entries")
    .selectAll()
    .where("giveaway_id", "=", giveawayId)
    .orderBy(sql`RANDOM()`)
    .limit(count);

  if (!allowRepeatWinners) {
    // Do not pick entries that have already been picked before
    return query.where("is_picked", "=", false).execute();
  }

  return query.execute();
}

export function markGiveawayEntriesAsPicked(
  db: Kysely<DB>,
  giveawayId: string,
  userIds: string[],
): Promise<UpdateResult> {
  return db
    .updateTable("app_public.giveaway_entries")
    .set({
      is_picked: true,
    })
    .where("giveaway_id", "=", giveawayId)
    .where("user_id", "in", userIds)
    .executeTakeFirstOrThrow();
}
