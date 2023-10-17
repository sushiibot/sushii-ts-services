import { Insertable, Selectable, Updateable } from "kysely";
import { AppPublicGuildConfigs } from "../dbTypes";

export type GuildConfigRow = Selectable<AppPublicGuildConfigs>;
export type InsertableGuildConfigRow = Insertable<AppPublicGuildConfigs>;
export type UpdateableGuildConfigRow = Updateable<AppPublicGuildConfigs>;
