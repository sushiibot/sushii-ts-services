import { Insertable, Selectable, Updateable } from "kysely";
import { AppPublicBanPoolMembers } from "../../../model/dbTypes";

export type BanPoolMemberRow = Selectable<AppPublicBanPoolMembers>;
export type InsertableBanPoolMemberRow = Insertable<AppPublicBanPoolMembers>;
export type UpdateableBanPoolMemberRow = Updateable<AppPublicBanPoolMembers>;
