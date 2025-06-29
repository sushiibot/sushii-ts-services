import { DeleteResult, InsertResult, Kysely } from "kysely";
import opentelemetry, { SpanStatusCode } from "@opentelemetry/api";
import { DB } from "../../infrastructure/database/config/dbTypes";
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
    .onConflict((oc) =>
      oc.columns(["guild_id", "user_id", "keyword"]).doNothing(),
    )
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

export async function getTotalNotificationCount(
  db: Kysely<DB>,
): Promise<number> {
  const { count } = await db
    .selectFrom("app_public.notifications")
    .select((eb) => eb.fn.countAll().as("count"))
    .executeTakeFirstOrThrow();

  return Number(count);
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
  channelCategoryId: string | null,
  channelId: string,
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
        // Limit to current guild
        .where("guild_id", "=", guildId)
        // Exclude author keywords
        .where("user_id", "!=", authorId)
        // Any that has words in the message content
        .where("keyword", "in", words)
        // Not blocked
        .where(({ not, exists, selectFrom }) =>
          // Exclude keywords that are blocked for this channelId + authorId
          not(
            exists(
              selectFrom("app_public.notification_blocks")
                // Matching block for this user keyword
                .whereRef(
                  "app_public.notifications.user_id",
                  "=",
                  "app_public.notification_blocks.user_id",
                )
                // Either block_id is the user_id or the channel_id
                .where((eb) =>
                  eb.or([
                    // user_id blocked author
                    eb("block_id", "=", authorId),
                    // or user_id blocked channel
                    eb("block_id", "=", channelId),
                    // or user_id blocked category
                    eb("block_id", "=", channelCategoryId),
                  ]),
                ),
            ),
          ),
        )
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
