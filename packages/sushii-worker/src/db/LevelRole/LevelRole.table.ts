import { Insertable, Selectable, Updateable } from "kysely";
import { AppPublicLevelRoles } from "../../infrastructure/database/dbTypes";

export type LevelRoleRow = Selectable<AppPublicLevelRoles>;
export type InsertableLevelRoleRow = Insertable<AppPublicLevelRoles>;
export type UpdateableLevelRoleRow = Updateable<AppPublicLevelRoles>;
