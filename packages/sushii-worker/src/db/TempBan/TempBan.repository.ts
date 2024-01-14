import { Kysely } from "kysely";
import dayjs from "dayjs";
import { DB } from "../../model/dbTypes";
import { InsertableTempBanRow, TempBanRow } from "./TempBan.table";

export async function upsertTempBan(
  db: Kysely<DB>,
  tempBan: InsertableTempBanRow,
): Promise<void> {
  await db
    .insertInto("app_public.temp_bans")
    .values(tempBan)
    .onConflict((oc) =>
      oc.columns(["guild_id", "user_id"]).doUpdateSet((eb) => ({
        expires_at: eb.ref("excluded.expires_at"),
      })),
    )
    .execute();
}

export async function getTempBans(
  db: Kysely<DB>,
  guildId: string,
): Promise<TempBanRow[]> {
  return db
    .selectFrom("app_public.temp_bans")
    .selectAll()
    .where("guild_id", "=", guildId)
    .execute();
}

export async function getAndDeleteExpiredTempBans(
  db: Kysely<DB>,
): Promise<TempBanRow[]> {
  return db
    .deleteFrom("app_public.temp_bans")
    .where("expires_at", "<=", dayjs.utc().toDate())
    .returningAll()
    .execute();
}
