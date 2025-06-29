import { Insertable, Selectable, Updateable } from "kysely";
import { AppPublicModLogs } from "../../infrastructure/database/config/dbTypes";

export type ModLogRow = Selectable<AppPublicModLogs>;
export type InsertableModLogRow = Insertable<AppPublicModLogs>;
export type UpdateableModLogRow = Updateable<AppPublicModLogs>;

export interface ModLog extends ModLogRow {}
export class ModLog {
  constructor(row: ModLogRow) {
    Object.assign(this, row);
  }

  get DMFailed(): boolean {
    return this.dm_message_error !== null;
  }

  get DMSuccess(): boolean {
    return this.dm_message_id !== null;
  }

  // returns true if a DM was attempted, regardless of success
  get DMAttempted(): boolean {
    return this.dm_message_id !== null || this.dm_message_error !== null;
  }
}
