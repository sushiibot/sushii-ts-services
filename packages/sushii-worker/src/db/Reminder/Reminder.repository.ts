import { Kysely } from "kysely";
import { DB } from "../../model/dbTypes";
import { ReminderRow } from "./Reminder.table";

export function insertReminder(
  db: Kysely<DB>,
  userId: string,
  expireAt: Date,
  description: string,
): Promise<ReminderRow | undefined> {
  return db
    .insertInto("app_public.reminders")
    .values({
      user_id: userId,
      set_at: new Date(),
      expire_at: expireAt,
      description,
    })
    .returningAll()
    .executeTakeFirst();
}

export function listReminders(
  db: Kysely<DB>,
  userId: string,
): Promise<ReminderRow[]> {
  return db
    .selectFrom("app_public.reminders")
    .selectAll()
    .where("user_id", "=", userId)
    .execute();
}

export function deleteReminder(
  db: Kysely<DB>,
  userId: string,
  setAt: Date,
): Promise<ReminderRow | undefined> {
  return db
    .deleteFrom("app_public.reminders")
    .returningAll()
    .where("user_id", "=", userId)
    .where("set_at", "=", setAt)
    .executeTakeFirst();
}

export function getAllExpiredReminders(db: Kysely<DB>): Promise<ReminderRow[]> {
  return db
    .selectFrom("app_public.reminders")
    .selectAll()
    .where("expire_at", "<=", new Date())
    .execute();
}

export function getAndDeleteExpiredReminders(
  db: Kysely<DB>,
): Promise<ReminderRow[]> {
  return db
    .deleteFrom("app_public.reminders")
    .returningAll()
    .where("expire_at", "<=", new Date())
    .execute();
}
