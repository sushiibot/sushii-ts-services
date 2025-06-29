import { Insertable, Selectable, Updateable } from "kysely";
import { AppPublicGuildBans } from "../../infrastructure/database/config/dbTypes";

export type GuildBanRow = Selectable<AppPublicGuildBans>;
export type InsertableGuildBanRow = Insertable<AppPublicGuildBans>;
export type UpdateableGuildBanRow = Updateable<AppPublicGuildBans>;
