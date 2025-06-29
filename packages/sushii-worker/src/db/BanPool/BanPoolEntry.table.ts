import { Insertable, Selectable, Updateable } from "kysely";
import { AppPublicBanPoolEntries } from "../../infrastructure/database/dbTypes";

export type BanPoolEntryRow = Selectable<AppPublicBanPoolEntries>;
export type InsertableBanPoolEntryRow = Insertable<AppPublicBanPoolEntries>;
export type UpdateableBanPoolEntryRow = Updateable<AppPublicBanPoolEntries>;
