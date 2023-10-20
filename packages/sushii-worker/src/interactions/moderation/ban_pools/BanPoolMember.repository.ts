import { Kysely, SelectQueryBuilder } from "kysely";
import { BanPoolRow } from "./BanPool.table";
import {
  BanPoolMemberRow,
  BanPoolMemberRowWithPool,
  InsertableBanPoolMemberRow,
  UpdateableBanPoolMemberRow,
} from "./BanPoolMember.table";
import { DB } from "../../../model/dbTypes";

export function getBanPoolMember(
  db: Kysely<DB>,
  guildId: string,
  pool: BanPoolRow,
): Promise<BanPoolMemberRow | undefined> {
  return db
    .selectFrom("app_public.ban_pool_members")
    .selectAll()
    .where("member_guild_id", "=", guildId)
    .where("owner_guild_id", "=", pool.guild_id)
    .where("pool_name", "=", pool.pool_name)
    .executeTakeFirst();
}

function getAllBanPoolMembershipsQuery(
  db: Kysely<DB>,
  guildId: string,
): SelectQueryBuilder<
  DB,
  "app_public.ban_pools" | "app_public.ban_pool_members",
  BanPoolMemberRowWithPool
> {
  return (
    db
      .selectFrom("app_public.ban_pool_members")
      .innerJoin("app_public.ban_pools", (join) =>
        join
          .onRef(
            "app_public.ban_pool_members.owner_guild_id",
            "=",
            "app_public.ban_pools.guild_id",
          )
          .onRef(
            "app_public.ban_pool_members.pool_name",
            "=",
            "app_public.ban_pools.pool_name",
          ),
      )
      // Only select the ban pool member rows
      .selectAll("app_public.ban_pool_members")
      .select(["id", "creator_id", "description"])
      .where("member_guild_id", "=", guildId)
      .orderBy([
        "app_public.ban_pools.guild_id",
        "app_public.ban_pools.pool_name desc",
      ])
  );
}

/**
 * Get all ban pool memberships for a guild. Does not include owned pools.
 *
 * @param guildId guild ID of the ban pool members
 * @returns all ban pool memberships for a guild
 */
export function getAllBanPoolMemberships(
  db: Kysely<DB>,
  guildId: string,
): Promise<BanPoolMemberRowWithPool[]> {
  return getAllBanPoolMembershipsQuery(db, guildId).execute();
}

/**
 * Search for ban pool memberships by pool name
 *
 * @param guildId guild ID of the ban pool members
 * @param search  search string to search for
 * @returns ban pool memberships that start with the search string
 */
export function searchBanPoolMemberships(
  db: Kysely<DB>,
  guildId: string,
  search: string,
): Promise<BanPoolMemberRowWithPool[]> {
  return (
    getAllBanPoolMembershipsQuery(db, guildId)
      // Additional search criteria
      .where("app_public.ban_pools.pool_name", "like", `${search}%`)
      .execute()
  );
}

export function insertBanPoolMember(
  db: Kysely<DB>,
  member: InsertableBanPoolMemberRow,
): Promise<BanPoolMemberRow> {
  return db
    .insertInto("app_public.ban_pool_members")
    .values(member)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export function updateBanPoolMember(
  db: Kysely<DB>,
  member: UpdateableBanPoolMemberRow,
): Promise<BanPoolMemberRow> {
  return db
    .updateTable("app_public.ban_pool_members")
    .set(member)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export function getBanPoolAllMembers(
  db: Kysely<DB>,
  poolName: string,
  guildId: string,
): Promise<BanPoolMemberRow[]> {
  return db
    .selectFrom("app_public.ban_pool_members")
    .selectAll()
    .where("owner_guild_id", "=", guildId)
    .where("pool_name", "=", poolName)
    .execute();
}

/**
 * Gets the number of members in a ban pool, excluding the owner
 *
 * @param db
 * @param guildId
 * @param poolName
 * @returns
 */
export async function getBanPoolMemberCount(
  db: Kysely<DB>,
  poolName: string,
  guildId: string,
): Promise<number> {
  const { count } = await db
    .selectFrom("app_public.ban_pool_members")
    .select((eb) => eb.fn.countAll<number>().as("count"))
    .where("owner_guild_id", "=", guildId)
    .where("pool_name", "=", poolName)
    .executeTakeFirstOrThrow();

  return count;
}
