import { Insertable, Selectable, Updateable } from "kysely";
import { AppPublicReminders } from "../../model/dbTypes";

export type ReminderRow = Selectable<AppPublicReminders>;
export type InsertableReminderRow = Insertable<AppPublicReminders>;
export type UpdateableReminderRow = Updateable<AppPublicReminders>;
