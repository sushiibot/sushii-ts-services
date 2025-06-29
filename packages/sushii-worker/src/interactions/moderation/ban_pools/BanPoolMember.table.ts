import { Insertable, Selectable, Updateable } from "kysely";
import { AppPublicBanPoolMembers } from "../../../infrastructure/database/dbTypes";
import { BanPoolRow } from "./BanPool.table";

export type BanPoolMemberRow = Selectable<AppPublicBanPoolMembers>;
export type InsertableBanPoolMemberRow = Insertable<AppPublicBanPoolMembers>;
export type UpdateableBanPoolMemberRow = Updateable<AppPublicBanPoolMembers>;

/**
 * Ban pool member row with the base pool information
 */
export type BanPoolMemberRowWithPool = BanPoolMemberRow & {
  id: BanPoolRow["id"];
  creator_id: BanPoolRow["creator_id"];
  description: BanPoolRow["description"];
};
