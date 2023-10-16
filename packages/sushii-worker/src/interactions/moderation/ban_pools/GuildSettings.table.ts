import { Insertable, Selectable, Updateable } from "kysely";
import { AppPublicBanPoolGuildSettings } from "../../../model/dbTypes";

export type BanPoolGuildSettingsRow = Selectable<AppPublicBanPoolGuildSettings>;
export type InsertableBanPoolGuildSettings =
  Insertable<AppPublicBanPoolGuildSettings>;
export type UpdateableBanPoolGuildSettings =
  Updateable<AppPublicBanPoolGuildSettings>;
