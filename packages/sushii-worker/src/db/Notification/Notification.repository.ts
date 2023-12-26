import { DeleteResult, InsertResult, Kysely } from "kysely";
import opentelemetry, { SpanStatusCode } from "@opentelemetry/api";
import { DB } from "../../model/dbTypes";
import { NotificationRow } from "./Notification.table";

const tracer = opentelemetry.trace.getTracer("notification-repository");

function cleanKeyword(keyword: string): string {
  return keyword.toLowerCase().trim();
}

export function getNotification(
  db: Kysely<DB>,
  guildId: string,
  userId: string,
  keyword: string,
): Promise<NotificationRow | undefined> {
  return db
    .selectFrom("app_public.notifications")
    .selectAll()
    .where("guild_id", "=", guildId)
    .where("user_id", "=", userId)
    .where("keyword", "=", cleanKeyword(keyword))
    .executeTakeFirst();
}

export function insertNotification(
  db: Kysely<DB>,
  guildId: string,
  userId: string,
  keyword: string,
): Promise<InsertResult> {
  return db
    .insertInto("app_public.notifications")
    .values({
      guild_id: guildId,
      user_id: userId,
      keyword: cleanKeyword(keyword),
    })
    .executeTakeFirst();
}

export function listNotifications(
  db: Kysely<DB>,
  guildId: string,
  userId: string,
): Promise<NotificationRow[]> {
  return db
    .selectFrom("app_public.notifications")
    .selectAll()
    .where("guild_id", "=", guildId)
    .where("user_id", "=", userId)
    .execute();
}

export function searchNotifications(
  db: Kysely<DB>,
  guildId: string,
  userId: string,
  query: string,
): Promise<NotificationRow[]> {
  const escaped = query.replace(/[%_]/g, "\\$&");

  return (
    db
      .selectFrom("app_public.notifications")
      .selectAll()
      .where("guild_id", "=", guildId)
      .where("user_id", "=", userId)
      .where("keyword", "like", `${escaped}%`)
      // Max in autocomplete
      .limit(25)
      .execute()
  );
}

export function deleteNotification(
  db: Kysely<DB>,
  guildId: string,
  userId: string,
  keyword: string,
): Promise<DeleteResult> {
  return db
    .deleteFrom("app_public.notifications")
    .where("guild_id", "=", guildId)
    .where("user_id", "=", userId)
    .where("keyword", "=", cleanKeyword(keyword))
    .executeTakeFirst();
}

export function stringToKeywords(str: string): string[] {
  return str
    .toLowerCase()
    .split(/\b(\w+)\b/g)
    .map((w) => w.trim())
    .filter(Boolean);
}

export function getMatchingNotifications(
  db: Kysely<DB>,
  guildId: string,
  authorId: string,
  messageContent: string,
): Promise<NotificationRow[]> {
  const span = tracer.startSpan("getMatchingNotifications");

  // Split up message content into words and match against keywords
  // in the database.
  const words = stringToKeywords(messageContent);

  try {
    return (
      db
        .selectFrom("app_public.notifications")
        .selectAll()
        // Limit to currenct guild
        .where("guild_id", "=", guildId)
        // Exclude author keywords
        .where("user_id", "!=", authorId)
        // Any that has words in the message content
        .where("keyword", "in", words)
        .execute()
    );
  } catch (err) {
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: err instanceof Error ? err.message : `${err}`,
    });

    throw err;
  } finally {
    span.end();
  }
}
