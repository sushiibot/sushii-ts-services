import { Insertable, Selectable, Updateable } from "kysely";
import { AppPublicTempBans } from "../../infrastructure/database/dbTypes";

export type TempBanRow = Selectable<AppPublicTempBans>;
export type InsertableTempBanRow = Insertable<AppPublicTempBans>;
export type UpdateableTempBanRow = Updateable<AppPublicTempBans>;
