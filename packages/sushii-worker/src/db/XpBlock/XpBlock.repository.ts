import { Kysely } from "kysely";
import { AppPublicBlockType, DB } from "../../infrastructure/database/dbTypes";
import { XpBlockRow } from "./XpBlock.table";

export function upsertXpBlock(
  db: Kysely<DB>,
  guildId: string,
  blockId: string,
  blockType: AppPublicBlockType,
): Promise<XpBlockRow | undefined> {
  return db
    .insertInto("app_public.xp_blocks")
    .values({
      guild_id: guildId,
      block_id: blockId,
      block_type: blockType,
    })
    .onConflict((oc) =>
      oc.columns(["guild_id", "block_id"]).doUpdateSet({
        block_type: blockType,
      }),
    )
    .returningAll()
    .executeTakeFirst();
}

export function getXpBlocks(
  db: Kysely<DB>,
  guildId: string,
): Promise<XpBlockRow[]> {
  return db
    .selectFrom("app_public.xp_blocks")
    .selectAll()
    .where("guild_id", "=", guildId)
    .execute();
}

export function deleteXpBlock(
  db: Kysely<DB>,
  guildId: string,
  blockId: string,
): Promise<XpBlockRow | undefined> {
  return db
    .deleteFrom("app_public.xp_blocks")
    .where("guild_id", "=", guildId)
    .where("block_id", "=", blockId)
    .returningAll()
    .executeTakeFirst();
}
