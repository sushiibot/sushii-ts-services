import { Kysely } from "kysely";
import { DB } from "../../model/dbTypes";
import { InsertableCachedUserRow } from "./CachedUser.table";

export async function upsertCachedUser(
  db: Kysely<DB>,
  user: InsertableCachedUserRow,
): Promise<void> {
  await db
    .insertInto("app_public.cached_users")
    .values(user)
    .onConflict((oc) => oc.columns(["id"]).doUpdateSet(user))
    .execute();
}
