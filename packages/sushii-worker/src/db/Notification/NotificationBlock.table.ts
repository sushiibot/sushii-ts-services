import { Insertable, Selectable, Updateable } from "kysely";
import { AppPublicNotificationBlocks } from "../../infrastructure/database/dbTypes";

export type NotificationBlockRow = Selectable<AppPublicNotificationBlocks>;
export type InsertableNotificationBlockRow =
  Insertable<AppPublicNotificationBlocks>;
export type UpdateableNotificationBlockRow =
  Updateable<AppPublicNotificationBlocks>;
