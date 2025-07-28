import dayjs, { Dayjs } from "dayjs";
import { Duration } from "dayjs/plugin/duration";
import { GuildAuditLogsEntry } from "discord.js";

import { findTimeoutChange } from "@/types/ModLogEventData";
import logger from "@/shared/infrastructure/logger";

import { ActionType } from "@/features/moderation/shared/domain/value-objects/ActionType";

/**
 * Value object representing a timeout change from Discord audit logs.
 * Encapsulates the logic for determining timeout action types and durations.
 */
export class TimeoutChange {
  private constructor(
    public readonly actionType: ActionType,
    public readonly oldTimestamp?: Dayjs,
    public readonly newTimestamp?: Dayjs,
    public readonly duration?: Duration,
  ) {}

  /**
   * Creates a TimeoutChange from a Discord audit log entry.
   * Returns undefined if the entry is not timeout-related.
   */
  static fromAuditLogEntry(entry: GuildAuditLogsEntry): TimeoutChange | undefined {
    const timeoutChangeData = findTimeoutChange(entry.changes);
    if (!timeoutChangeData) {
      return undefined;
    }

    // Validate that the timeout change data has the expected string format
    if (
      (timeoutChangeData.new !== undefined && typeof timeoutChangeData.new !== "string") ||
      (timeoutChangeData.old !== undefined && typeof timeoutChangeData.old !== "string")
    ) {
      logger.error(
        { timeoutChange: timeoutChangeData },
        "Mismatch audit log change type",
      );
      return undefined;
    }

    const now = dayjs.utc();

    // Check if old_value is in the past. Timeout timestamps persist in the
    // member object even after the timeout has expired. If the old_value is
    // in the past, it's a new timeout. Reset old_value to reflect accurate change
    let oldValue = timeoutChangeData.old;
    if (oldValue && dayjs(oldValue).isBefore(now)) {
      oldValue = undefined;
    }

    // New Timeout - null -> timeout
    if (!oldValue && timeoutChangeData.new) {
      const newDate = dayjs(timeoutChangeData.new);
      return new TimeoutChange(
        ActionType.Timeout,
        undefined,
        newDate,
        dayjs.duration(newDate.diff(now)),
      );
    }

    // Timeout Removed - timeout -> null
    if (oldValue && !timeoutChangeData.new) {
      return new TimeoutChange(
        ActionType.TimeoutRemove,
        dayjs.utc(oldValue),
        undefined,
      );
    }

    // Timeout changed - old and new should exist and be different
    if (oldValue && timeoutChangeData.new && oldValue !== timeoutChangeData.new) {
      const oldDate = dayjs.utc(oldValue);
      const newDate = dayjs(timeoutChangeData.new);
      return new TimeoutChange(
        ActionType.TimeoutAdjust,
        oldDate,
        newDate,
        dayjs.duration(newDate.diff(oldDate)),
      );
    }

    return undefined;
  }

  /**
   * Gets the timeout duration as a human-readable string.
   */
  getDurationString(): string | undefined {
    if (!this.duration) {
      return undefined;
    }

    const days = this.duration.days();
    const hours = this.duration.hours();
    const minutes = this.duration.minutes();

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);

    return parts.length > 0 ? parts.join(" ") : "0m";
  }

  /**
   * Checks if this timeout change represents a new timeout being applied.
   */
  isNewTimeout(): boolean {
    return this.actionType === ActionType.Timeout;
  }

  /**
   * Checks if this timeout change represents a timeout being removed.
   */
  isTimeoutRemoval(): boolean {
    return this.actionType === ActionType.TimeoutRemove;
  }

  /**
   * Checks if this timeout change represents an adjustment to an existing timeout.
   */
  isTimeoutAdjustment(): boolean {
    return this.actionType === ActionType.TimeoutAdjust;
  }

}