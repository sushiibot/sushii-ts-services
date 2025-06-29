import { Insertable, Selectable, Updateable } from "kysely";
import { AppPublicXpBlocks } from "../../infrastructure/database/dbTypes";

export type XpBlockRow = Selectable<AppPublicXpBlocks>;
export type InsertableXpBlockRow = Insertable<AppPublicXpBlocks>;
export type UpdateableXpBlockRow = Updateable<AppPublicXpBlocks>;
