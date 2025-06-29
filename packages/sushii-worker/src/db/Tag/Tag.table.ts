import { Insertable, Selectable, Updateable } from "kysely";
import { AppPublicTags } from "../../infrastructure/database/dbTypes";

export type TagRow = Selectable<AppPublicTags>;
export type InsertableTagRow = Insertable<AppPublicTags>;
export type UpdateableTagRow = Updateable<AppPublicTags>;
