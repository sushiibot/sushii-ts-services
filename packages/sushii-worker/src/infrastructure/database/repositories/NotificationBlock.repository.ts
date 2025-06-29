import { InsertResult, Kysely } from "kysely";
import { AppPublicNotificationBlockType, DB } from "../../infrastructure/database/config/dbTypes";
import { NotificationBlockRow } from "./NotificationBlock.table";

export function insertNotificationBlock(
  db: Kysely<DB>,
  userId: string,
  blockId: string,
  blockType: AppPublicNotificationBlockType,
): Promise<InsertResult> {
  return db
    .insertInto("app_public.notification_blocks")
    .values({
      user_id: userId,
      block_id: blockId,
      block_type: blockType,
    })
    .onConflict((oc) => oc.columns(["user_id", "block_id"]).doNothing())
    .executeTakeFirst();
}

export function getNotificationBlocks(
  db: Kysely<DB>,
  userId: string,
): Promise<NotificationBlockRow[]> {
  return db
    .selectFrom("app_public.notification_blocks")
    .selectAll()
    .where("user_id", "=", userId)
    .execute();
}

export function deleteNotificationBlock(
  db: Kysely<DB>,
  userId: string,
  blockId: string,
): Promise<NotificationBlockRow | undefined> {
  return db
    .deleteFrom("app_public.notification_blocks")
    .where("user_id", "=", userId)
    .where("block_id", "=", blockId)
    .returningAll()
    .executeTakeFirst();
}
