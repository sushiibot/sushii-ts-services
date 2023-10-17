import { Kysely } from "kysely";
import { DB } from "../dbTypes";
import { GuildConfigRow } from "./guildConfig.table";

export function getGuildConfigById(
  db: Kysely<DB>,
  guildId: string,
): Promise<GuildConfigRow | undefined> {
  return db
    .selectFrom("app_public.guild_configs")
    .selectAll()
    .where("id", "=", guildId)
    .executeTakeFirst();
}
