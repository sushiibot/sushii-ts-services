import { Insertable, Selectable, Updateable } from "kysely";
import { AppPublicGuildBans } from "../../model/dbTypes";

export type GuildBanRow = Selectable<AppPublicGuildBans>;
export type InsertableGuildBanRow = Insertable<AppPublicGuildBans>;
export type UpdateableGuildBanRow = Updateable<AppPublicGuildBans>;
