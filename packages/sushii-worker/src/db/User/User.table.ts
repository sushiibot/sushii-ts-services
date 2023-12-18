import { Insertable, Selectable, Updateable } from "kysely";
import { AppPublicUsers } from "../../model/dbTypes";

export type UserRow = Selectable<AppPublicUsers>;
export type InsertableUserRow = Insertable<AppPublicUsers>;
export type UpdateableUserRow = Updateable<AppPublicUsers>;
