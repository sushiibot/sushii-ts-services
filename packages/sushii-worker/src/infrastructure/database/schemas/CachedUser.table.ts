import { Insertable, Selectable, Updateable } from "kysely";
import { AppPublicCachedUsers } from "../../infrastructure/database/config/dbTypes";

export type CachedUserRow = Selectable<AppPublicCachedUsers>;
export type InsertableCachedUserRow = Insertable<AppPublicCachedUsers>;
export type UpdateableCachedUserRow = Updateable<AppPublicCachedUsers>;
