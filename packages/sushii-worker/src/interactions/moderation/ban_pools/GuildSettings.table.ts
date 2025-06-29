import { Insertable, Selectable, Updateable } from "kysely";
import { AppPublicBanPoolGuildSettings } from "../../../infrastructure/database/dbTypes";

export type BanPoolGuildSettingsRow = Selectable<AppPublicBanPoolGuildSettings>;
export type InsertableBanPoolGuildSettings =
  Insertable<AppPublicBanPoolGuildSettings>;
export type UpdateableBanPoolGuildSettings =
  Updateable<AppPublicBanPoolGuildSettings>;
