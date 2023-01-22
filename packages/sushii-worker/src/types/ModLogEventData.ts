import {
  APIAuditLogChange,
  APIUser,
  AuditLogEvent,
  GatewayGuildAuditLogEntryCreateDispatchData,
  GatewayGuildBanAddDispatchData,
  GatewayGuildBanRemoveDispatchData,
} from "discord-api-types/v10";
import { APIAuditLogChangeKeyCommunicationDisabledUntil } from "discord.js";
import Context from "../model/context";

export type EventData =
  | GatewayGuildBanAddDispatchData
  | GatewayGuildAuditLogEntryCreateDispatchData
  | GatewayGuildBanRemoveDispatchData;

export function isAuditLogEntryCreate(
  event: EventData
): event is GatewayGuildAuditLogEntryCreateDispatchData {
  return "target_id" in event && "action_type" in event;
}

/**
 * This is a type guard to check if the APIAuditLogChange is of a specific type.
 * Used for iteration over the changes array in the audit log entry and returns
 * the actual matching discriminated type.
 *
 * @param val
 * @returns
 */
export function isAPIAuditLogChange<V extends APIAuditLogChange["key"]>(
  val: V
) {
  return (
    obj: APIAuditLogChange
  ): obj is Extract<APIAuditLogChange, { key: V }> => obj.key === val;
}

export function getUserIDFromEventData(event: EventData): string | null {
  if (isAuditLogEntryCreate(event)) {
    // Ignore non member update events
    if (event.action_type !== AuditLogEvent.MemberUpdate) {
      return null;
    }

    // Can be null if this doesn't affect a user
    return event.target_id;
  }

  return event.user.id;
}

export async function getUserFromEventData(
  ctx: Context,
  event: EventData
): Promise<APIUser | null> {
  if (isAuditLogEntryCreate(event)) {
    if (event.action_type !== AuditLogEvent.MemberUpdate) {
      return null;
    }

    if (!event.target_id) {
      return null;
    }

    const user = await ctx.REST.getUser(event.target_id);

    return user.unwrap();
  }

  return event.user;
}

export function findTimeoutChange(
  changes?: APIAuditLogChange[]
): APIAuditLogChangeKeyCommunicationDisabledUntil | undefined {
  return changes?.find(isAPIAuditLogChange("communication_disabled_until"));
}
