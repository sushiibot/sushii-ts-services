import { Insertable, Selectable, Updateable } from "kysely";
import { AppPublicUserLevels } from "../../infrastructure/database/dbTypes";

export type UserLevelRow = Selectable<AppPublicUserLevels>;
export type InsertableUserLevelRow = Insertable<AppPublicUserLevels>;
export type UpdateableUserLevelRow = Updateable<AppPublicUserLevels>;

export type UserLevelRowWithRank = UserLevelRow & { rank: number };
