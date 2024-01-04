import { DeleteResult, InsertResult, Kysely, UpdateResult, sql } from "kysely";
import dayjs from "dayjs";
import { DB } from "../../model/dbTypes";
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
    // Not manually ended
    .where("manually_ended", "=", false)
    // Not expired
    .where("end_at", ">", dayjs.utc().toDate());

  if (limit) {
    return query.limit(limit).execute();
  }

  return query.execute();
}

export function getExpiredGiveaways(db: Kysely<DB>): Promise<GiveawayRow[]> {
  return (
    db
      .selectFrom("app_public.giveaways")
      .selectAll()
      .where("end_at", "<=", dayjs.utc().toDate())
      // Ignore giveaways that have been manually ended
      .where("manually_ended", "=", false)
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

export function deleteGiveaway(
  db: Kysely<DB>,
  guildId: string,
  giveawayId: string,
): Promise<DeleteResult> {
  return db
    .deleteFrom("app_public.giveaways")
    .where("guild_id", "=", guildId)
    .where("id", "=", giveawayId)
    .executeTakeFirstOrThrow();
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
