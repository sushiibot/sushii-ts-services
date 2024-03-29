import { Insertable, Selectable, Updateable } from "kysely";
import { AppPublicTempBans } from "../../model/dbTypes";

export type TempBanRow = Selectable<AppPublicTempBans>;
export type InsertableTempBanRow = Insertable<AppPublicTempBans>;
export type UpdateableTempBanRow = Updateable<AppPublicTempBans>;
