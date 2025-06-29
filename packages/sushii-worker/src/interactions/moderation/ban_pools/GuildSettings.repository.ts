import { Kysely } from "kysely";
import {
  BanPoolGuildSettingsRow,
  InsertableBanPoolGuildSettings,
} from "./GuildSettings.table";
import { DB } from "../../../infrastructure/database/config/dbTypes";

export async function getGuildSettings(
  db: Kysely<DB>,
  guildId: string,
): Promise<BanPoolGuildSettingsRow | null> {
  const settings = await db
    .selectFrom("app_public.ban_pool_guild_settings")
    .selectAll()
    .where("guild_id", "=", guildId)
    .executeTakeFirst();

  return settings || null;
}

export function upsertGuildSettings(
  db: Kysely<DB>,
  settings: InsertableBanPoolGuildSettings,
): Promise<BanPoolGuildSettingsRow> {
  return db
    .insertInto("app_public.ban_pool_guild_settings")
    .values(settings)
    .onConflict((oc) => oc.column("guild_id").doUpdateSet(settings))
    .returningAll()
    .executeTakeFirstOrThrow();
}
