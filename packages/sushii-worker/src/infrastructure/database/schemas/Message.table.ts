import { Insertable, Selectable, Updateable } from "kysely";
import { AppPublicMessages } from "../../infrastructure/database/config/dbTypes";

export type MessageRow = Selectable<AppPublicMessages>;
export type InsertableMessageRow = Insertable<AppPublicMessages>;
export type UpdateableMessageRow = Updateable<AppPublicMessages>;
