import { Insertable, Selectable, Updateable } from "kysely";
import { AppPublicModLogs } from "../../model/dbTypes";

export type ModLogRow = Selectable<AppPublicModLogs>;
export type InsertableModLogRow = Insertable<AppPublicModLogs>;
export type UpdateableModLogRow = Updateable<AppPublicModLogs>;
