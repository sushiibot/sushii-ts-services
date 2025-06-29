import { DeleteResult, Kysely } from "kysely";
import { DB } from "../../infrastructure/database/dbTypes";
import { InsertableTagRow, TagRow } from "./Tag.table";

export async function upsertTag(
  db: Kysely<DB>,
  tag: InsertableTagRow,
): Promise<void> {
  await db
    .insertInto("app_public.tags")
    .values({
      ...tag,
      tag_name: tag.tag_name.toLowerCase().trim(),
    })
    .onConflict((oc) => oc.columns(["guild_id", "tag_name"]).doUpdateSet(tag))
    .execute();
}

export async function incrementTagUseCount(
  db: Kysely<DB>,
  guildId: string,
  tagName: string,
): Promise<void> {
  await db
    .updateTable("app_public.tags")
    .set((eb) => ({
      use_count: eb("use_count", "+", "1"),
    }))
    .where("guild_id", "=", guildId)
    .where("tag_name", "=", tagName)
    .execute();
}

export function getTag(
  db: Kysely<DB>,
  guildId: string,
  tagName: string,
): Promise<TagRow | undefined> {
  return db
    .selectFrom("app_public.tags")
    .selectAll()
    .where("guild_id", "=", guildId)
    .where("tag_name", "=", tagName)
    .executeTakeFirst();
}

export function getRandomTag(
  db: Kysely<DB>,
  guildId: string,
  startsWith: string | null,
  contains: string | null,
  ownerId: string | null,
): Promise<TagRow | undefined> {
  const query = db
    .selectFrom("app_public.tags")
    .selectAll()
    .where("guild_id", "=", guildId)
    .orderBy((eb) => eb.fn("random", []));

  if (startsWith) {
    return query
      .where("tag_name", "ilike", `${startsWith}%`)
      .executeTakeFirst();
  }

  if (contains) {
    return query.where("tag_name", "ilike", `%${contains}%`).executeTakeFirst();
  }

  if (ownerId) {
    return query.where("owner_id", "=", ownerId).executeTakeFirst();
  }

  // Pure random
  return query.executeTakeFirst();
}

export function listTags(db: Kysely<DB>, guildId: string): Promise<TagRow[]> {
  return db
    .selectFrom("app_public.tags")
    .selectAll()
    .where("guild_id", "=", guildId)
    .orderBy("tag_name", "asc")
    .execute();
}

export function searchTagsStartsWith(
  db: Kysely<DB>,
  guildId: string,
  query: string,
): Promise<TagRow[]> {
  return db
    .selectFrom("app_public.tags")
    .selectAll()
    .where("guild_id", "=", guildId)
    .where("tag_name", "ilike", `%${query}%`)
    .limit(25)
    .execute();
}

export function searchTags(
  db: Kysely<DB>,
  guildId: string,
  startsWith: string | null,
  contains: string | null,
  ownerId: string | null,
): Promise<InsertableTagRow[]> {
  const query = db
    .selectFrom("app_public.tags")
    .selectAll()
    .where("guild_id", "=", guildId)
    .orderBy((eb) => eb.fn("random", []));

  if (startsWith) {
    return query.where("tag_name", "ilike", `${startsWith}%`).execute();
  }

  if (contains) {
    return query.where("tag_name", "ilike", `%${contains}%`).execute();
  }

  if (ownerId) {
    return query.where("owner_id", "=", ownerId).execute();
  }

  throw new Error("Invalid search options");
}

export function deleteTag(
  db: Kysely<DB>,
  guildId: string,
  tagName: string,
): Promise<TagRow | undefined> {
  return db
    .deleteFrom("app_public.tags")
    .where("guild_id", "=", guildId)
    .where("tag_name", "=", tagName)
    .returningAll()
    .executeTakeFirst();
}

export function deleteOwnerTags(
  db: Kysely<DB>,
  guildId: string,
  ownerId: string,
): Promise<DeleteResult> {
  return db
    .deleteFrom("app_public.tags")
    .where("guild_id", "=", guildId)
    .where("owner_id", "=", ownerId)
    .executeTakeFirst();
}
