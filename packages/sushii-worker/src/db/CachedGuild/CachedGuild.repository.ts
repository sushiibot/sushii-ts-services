import { Kysely } from "kysely";
import { DB } from "../../infrastructure/database/dbTypes";
import { InsertableCachedGuildRow } from "./CachedGuild.table";

export async function upsertCachedGuild(
  db: Kysely<DB>,
  guild: InsertableCachedGuildRow,
): Promise<void> {
  await db
    .insertInto("app_public.cached_guilds")
    .values(guild)
    .onConflict((oc) => oc.columns(["id"]).doUpdateSet(guild))
    .execute();
}
