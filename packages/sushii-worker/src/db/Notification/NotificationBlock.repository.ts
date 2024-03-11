import { InsertResult, Kysely } from "kysely";
import { AppPublicNotificationBlockType, DB } from "../../model/dbTypes";

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
