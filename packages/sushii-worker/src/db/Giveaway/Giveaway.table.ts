import { Insertable, Selectable, Updateable } from "kysely";
import {
  AppPublicGiveawayEntries,
  AppPublicGiveaways,
} from "../../model/dbTypes";

export type GiveawayRow = Selectable<AppPublicGiveaways>;
export type InsertableGiveawayRow = Insertable<AppPublicGiveaways>;
export type UpdateableGiveawayRow = Updateable<AppPublicGiveaways>;

export type GiveawayEntryRow = Selectable<AppPublicGiveawayEntries>;
export type InsertableGiveawayEntryRow = Insertable<AppPublicGiveawayEntries>;
export type UpdateableGiveawayEntryRow = Updateable<AppPublicGiveawayEntries>;
