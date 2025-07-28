import {
  AuditLogEvent as DiscordAuditLogEvent,
  GuildAuditLogsEntry,
} from "discord.js";

import { ActionType } from "@/features/moderation/shared/domain/value-objects/ActionType";

import { TimeoutChange } from "../value-objects/TimeoutChange";

/**
 * Domain entity representing a Discord audit log event with moderation relevance.
 * Encapsulates the business logic for determining moderation action types from audit logs.
 */
export class AuditLogEvent {
  constructor(
    public readonly guildId: string,
    public readonly actionType: ActionType,
    public readonly targetId: string,
    public readonly executorId?: string,
    public readonly reason?: string,
    public readonly timeoutChange?: TimeoutChange,
  ) {}

  /**
   * Creates an AuditLogEvent from a Discord audit log entry.
   * Returns undefined if the event is not moderation-related.
   */
  static fromDiscordEntry(
    guildId: string,
    entry: GuildAuditLogsEntry,
  ): AuditLogEvent | undefined {
    if (!entry.targetId) {
      return undefined;
    }

    const base = {
      guildId,
      targetId: entry.targetId,
      executorId: entry.executorId || undefined,
      reason: entry.reason || undefined,
    };

    // Map Discord audit log actions to our ActionType enum
    switch (entry.action) {
      case DiscordAuditLogEvent.MemberBanAdd: {
        return new AuditLogEvent(
          base.guildId,
          ActionType.Ban,
          base.targetId,
          base.executorId,
          base.reason,
        );
      }
      case DiscordAuditLogEvent.MemberBanRemove: {
        return new AuditLogEvent(
          base.guildId,
          ActionType.BanRemove,
          base.targetId,
          base.executorId,
          base.reason,
        );
      }
      case DiscordAuditLogEvent.MemberKick: {
        return new AuditLogEvent(
          base.guildId,
          ActionType.Kick,
          base.targetId,
          base.executorId,
          base.reason,
        );
      }
      case DiscordAuditLogEvent.MemberUpdate: {
        const timeoutChange = TimeoutChange.fromAuditLogEntry(entry);

        // Not a timeout-related update
        if (!timeoutChange) {
          return undefined;
        }

        return new AuditLogEvent(
          base.guildId,
          timeoutChange.actionType,
          base.targetId,
          base.executorId,
          base.reason,
          timeoutChange,
        );
      }
      default:
        return undefined;
    }
  }

  /**
   * Checks if this audit log event is for a manual timeout/timeout removal
   * that should trigger a DM to the user with the reason.
   */
  shouldSendNativeTimeoutDM(): boolean {
    return (
      this.actionType === ActionType.Timeout ||
      this.actionType === ActionType.TimeoutRemove
    );
  }

  /**
   * Checks if this audit log event represents a timeout adjustment
   * (users cannot make adjustments, only add/remove timeouts).
   */
  isTimeoutAdjustment(): boolean {
    return this.actionType === ActionType.TimeoutAdjust;
  }
}
