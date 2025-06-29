import { Insertable, Selectable, Updateable } from "kysely";
import { AppPublicNotifications } from "../../infrastructure/database/dbTypes";

export type NotificationRow = Selectable<AppPublicNotifications>;
export type InsertableNotificationRow = Insertable<AppPublicNotifications>;
export type UpdateableNotificationRow = Updateable<AppPublicNotifications>;
