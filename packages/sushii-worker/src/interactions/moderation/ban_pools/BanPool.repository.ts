import { DeleteResult, Kysely } from "kysely";
import { BanPoolRow, InsertableBanPoolRow } from "./BanPool.table";
import { DB } from "../../../model/dbTypes";

/**
 * Get a ban pool by pool name and guild ID
 * 
 * @param poolName name of the ban pool
 * @param guildId guild ID of the ban pool
 * @returns ban pool
 */
export function getPoolByNameAndGuildId(
  db: Kysely<DB>,
  poolName: string,
  guildId: string,
): Promise<BanPoolRow | undefined>  {
  return db
    .selectFrom("app_public.ban_pools")
    .selectAll()
    .where("pool_name", "=", poolName)
    .where("guild_id", "=", guildId)
    .executeTakeFirst();
}

/**
 * Get all ban pools for a guild
 * 
 * @param guildId guild ID of the ban pools
 * @returns ban pools
 */
export function getAllGuildBanPools(
  db: Kysely<DB>,
  guildId: string,
): Promise<BanPoolRow[]> {
  return db
      .selectFrom("app_public.ban_pools")
      .selectAll()
      .where("guild_id", "=", guildId)
      .execute();
}

/**
 * Search for ban pools by name
 * 
 * @param guildId guild ID of the ban pools
 * @param search  search string to search for
 * @returns ban pools that start with the search string
 */
export function searchGuildBanPools(
  db: Kysely<DB>,
  guildId: string,
  search: string,
): Promise<BanPoolRow[]> {
  return db
      .selectFrom("app_public.ban_pools")
      .selectAll()
      .where("guild_id", "=", guildId)
      .where("pool_name", "like", `${search}%`)
      .execute();
}

/**
 * Gets a ban pool by name or ID. If by ID, it will NOt check the guild_id.
 * 
 * @param nameOrID name of pool or the unique ID of the pool
 * @param guildId  guild id of the pool to search for
 * @returns ban pool or undefined if not found
 */
export function getPoolByNameOrIdAndGuildId(
  db: Kysely<DB>,
  nameOrID: string,
  guildId: string
): Promise<BanPoolRow | undefined> {
  const poolID = parseInt(nameOrID, 10);

  let poolQuery = db.selectFrom("app_public.ban_pools").selectAll();

  if (Number.isNaN(poolID)) {
    poolQuery = poolQuery
      .where("pool_name", "=", nameOrID)
      .where("guild_id", "=", guildId);
  } else {
    poolQuery = poolQuery.where((eb) =>
      eb.or([
        // Could be a number as the name
        eb.and([
          eb("pool_name", "=", nameOrID),
          eb("guild_id", "=", guildId),
        ]),

        // Could be a number ID
        // DOES NOT CHECK GUILD ID
        eb("id", "=", poolID),
      ])
    );
  }

  return poolQuery.executeTakeFirst();
}

/**
 * Insert a new ban pool
 * 
 * @param pool ban pool to insert
 * @returns inserted ban pool
 */
export function insertPool(
  db: Kysely<DB>,
  pool: InsertableBanPoolRow
): Promise<BanPoolRow> {
   return db
    .insertInto("app_public.ban_pools")
    .values(pool)
    .returningAll()
    .executeTakeFirstOrThrow();
}

/**
 * Delete a ban pool
 * 
 * @param poolName pool name to delete
 * @param guildId  guild ID of the pool
 * @returns 
 */
export function deletePool(
  db: Kysely<DB>,
  poolName: string,
  guildId: string
): Promise<DeleteResult> {
  return db
    .deleteFrom("app_public.ban_pools")
    .where("pool_name", "=", poolName)
    .where("guild_id", "=", guildId)
    .executeTakeFirstOrThrow();
}