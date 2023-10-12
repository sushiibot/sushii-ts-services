import { Insertable, Selectable, Updateable } from "kysely";
import { AppPublicBanPoolInvites } from "../../../model/dbTypes";


export type BanPoolInviteRow = Selectable<AppPublicBanPoolInvites>;
export type InsertableBanPoolInviteRow = Insertable<AppPublicBanPoolInvites>;
export type UpdateableBanPoolInviteRow = Updateable<AppPublicBanPoolInvites>;

