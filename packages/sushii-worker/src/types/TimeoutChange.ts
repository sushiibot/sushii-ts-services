import dayjs, { Dayjs } from "dayjs";
import { Duration } from "dayjs/plugin/duration";
import { GatewayGuildAuditLogEntryCreateDispatchData } from "discord-api-types/v10";
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
  event: GatewayGuildAuditLogEntryCreateDispatchData
): TimeoutChange | undefined {
  const timeoutChange = findTimeoutChange(event.changes);
  if (!timeoutChange) {
    return;
  }

  const now = dayjs.utc();

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
    // Check if old_value is in the past. Timeout timestamps persist in the
    // member object even after the timeout has expired. If the old_value is
    // in the past, it's a new timeout.
    const old = dayjs.utc(timeoutChange.old_value);
    const newDate = dayjs(timeoutChange.new_value);
    const duration = dayjs.duration(newDate.diff(old));

    if (old.isBefore(now)) {
      return {
        actionType: ActionType.Timeout,
        old: undefined,
        new: newDate,
        duration,
      };
    }

    return {
      actionType: ActionType.TimeoutAdjust,
      new: dayjs.utc(timeoutChange.new_value),
      old,
      duration,
    };
  }
}
