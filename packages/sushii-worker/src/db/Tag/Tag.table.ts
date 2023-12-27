import { Insertable, Selectable, Updateable } from "kysely";
import { AppPublicTags } from "../../model/dbTypes";

export type TagRow = Selectable<AppPublicTags>;
export type InsertableTagRow = Insertable<AppPublicTags>;
export type UpdateableTagRow = Updateable<AppPublicTags>;
