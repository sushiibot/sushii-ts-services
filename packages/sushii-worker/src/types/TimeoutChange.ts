import dayjs, { Dayjs } from "dayjs";
import { Duration } from "dayjs/plugin/duration";
import { GuildAuditLogsEntry } from "discord.js";
import { ActionType } from "../interactions/moderation/ActionType";
import { findTimeoutChange } from "./ModLogEventData";

export type TimeoutChange =
  | {
      actionType: ActionType.TimeoutRemove;
      old: Dayjs;
      new: undefined;
    }
  | {
      actionType: ActionType.Timeout;
      old: undefined;
      new: Dayjs;
      duration: Duration;
    }
  | {
      actionType: ActionType.TimeoutAdjust;
      old: Dayjs;
      new: Dayjs;
      duration: Duration;
    };

export function getTimeoutChangeData(
  event: GuildAuditLogsEntry
): TimeoutChange | undefined {
  const timeoutChange = findTimeoutChange(event.changes);
  if (!timeoutChange) {
    return;
  }

  const now = dayjs.utc();

  // Check if old_value is in the past. Timeout timestamps persist in the
  // member object even after the timeout has expired. If the old_value is
  // in the past, it's a new timeout.
  // Reset old_value to reflect accurate change
  if (dayjs(timeoutChange.old_value).isBefore(now)) {
    timeoutChange.old_value = undefined;
  }

  // New Timeout - null -> timeout
  // "changes": [
  //   {
  //     "key": "communication_disabled_until",
  //     "new_value": "2023-01-21T21:33:52.129000+00:00"
  //   }
  // ]
  if (!timeoutChange.old_value && timeoutChange.new_value) {
    const newDate = dayjs(timeoutChange.new_value);

    return {
      actionType: ActionType.Timeout,
      old: undefined,
      new: newDate,
      duration: dayjs.duration(newDate.diff(now)),
    };
  }

  // Timeout Removed - timeout -> null
  // "changes": [
  //   {
  //     "key": "communication_disabled_until",
  //     "old_value": "2023-01-21T21:33:52.129000+00:00"
  //   }
  // ]
  if (timeoutChange.old_value && !timeoutChange.new_value) {
    return {
      actionType: ActionType.TimeoutRemove,
      old: dayjs.utc(timeoutChange.old_value),
      new: undefined,
    };
  }

  // Timeout changed - old and new should exist and be different
  if (
    timeoutChange.old_value &&
    timeoutChange.new_value &&
    timeoutChange.old_value !== timeoutChange.new_value
  ) {
    // Old is not in the past, it's an adjustment. old_value is checked
    // earlier in the function to ensure this is a new timeout adjustment.
    const old = dayjs.utc(timeoutChange.old_value);
    const newDate = dayjs(timeoutChange.new_value);
    const duration = dayjs.duration(newDate.diff(old));

    return {
      actionType: ActionType.TimeoutAdjust,
      new: dayjs.utc(timeoutChange.new_value),
      old,
      duration,
    };
  }
}
