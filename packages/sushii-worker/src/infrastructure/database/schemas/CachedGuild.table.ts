import { Insertable, Selectable, Updateable } from "kysely";
import { AppPublicCachedGuilds } from "../../infrastructure/database/config/dbTypes";

export type CachedGuildRow = Selectable<AppPublicCachedGuilds>;
export type InsertableCachedGuildRow = Insertable<AppPublicCachedGuilds>;
export type UpdateableCachedGuildRow = Updateable<AppPublicCachedGuilds>;
