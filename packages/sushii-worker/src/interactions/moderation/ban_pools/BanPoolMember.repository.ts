import db from "../../../model/db";
import { BanPoolRow } from "./BanPool.table";
import { BanPoolMemberRow, InsertableBanPoolMemberRow } from "./BanPoolMember.table";

export function getBanPoolMember(
  guildId: string,
  pool: BanPoolRow
): Promise<BanPoolMemberRow | undefined> {
  return db
    .selectFrom("app_public.ban_pool_members")
    .selectAll()
    .where("member_guild_id", "=", guildId)
    .where("owner_guild_id", "=", pool.guild_id)
    .where("pool_name", "=", pool.pool_name)
    .executeTakeFirst();
}

export function insertBanPoolMember(
  member: InsertableBanPoolMemberRow
): Promise<BanPoolMemberRow> {
  return db
    .insertInto("app_public.ban_pool_members")
    .values(member)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export function getBanPoolMembers(
  guildId: string,
  poolName: string
): Promise<BanPoolMemberRow[]> {
  return db
    .selectFrom("app_public.ban_pool_members")
    .selectAll()
    .where("owner_guild_id", "=", guildId)
    .where("pool_name", "=", poolName)
    .execute();
}