import { DeleteResult, Kysely } from "kysely";
import { DB } from "../../infrastructure/database/config/dbTypes";
import { LevelRoleRow } from "./LevelRole.table";

export async function upsertLevelRole(
  db: Kysely<DB>,
  guildId: string,
  roleId: string,
  addLevel: number | undefined,
  removeLevel: number | undefined,
): Promise<void> {
  await db
    .insertInto("app_public.level_roles")
    .values({
      guild_id: guildId,
      role_id: roleId,
      add_level: addLevel,
      remove_level: removeLevel,
    })
    .onConflict((oc) =>
      oc.columns(["guild_id", "role_id"]).doUpdateSet({
        add_level: addLevel,
        remove_level: removeLevel,
      }),
    )
    .execute();
}

export async function getLevelRole(
  db: Kysely<DB>,
  guildId: string,
  roleId: string,
): Promise<LevelRoleRow | undefined> {
  return db
    .selectFrom("app_public.level_roles")
    .selectAll()
    .where("guild_id", "=", guildId)
    .where("role_id", "=", roleId)
    .executeTakeFirst();
}

export async function getAllLevelRoles(
  db: Kysely<DB>,
  guildId: string,
): Promise<LevelRoleRow[]> {
  return db
    .selectFrom("app_public.level_roles")
    .selectAll()
    .where("guild_id", "=", guildId)
    .execute();
}

export function deleteLevelRole(
  db: Kysely<DB>,
  guildId: string,
  roleId: string,
): Promise<DeleteResult> {
  return db
    .deleteFrom("app_public.level_roles")
    .where("guild_id", "=", guildId)
    .where("role_id", "=", roleId)
    .executeTakeFirstOrThrow();
}
