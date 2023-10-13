import { Insertable, Selectable, Updateable } from "kysely";
import { AppPublicBanPools } from "../../../model/dbTypes";

export type BanPoolRow = Selectable<AppPublicBanPools>;
export type InsertableBanPoolRow = Insertable<AppPublicBanPools>;
export type UpdateableBanPoolRow = Updateable<AppPublicBanPools>;
