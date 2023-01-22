import { APIAuditLogChange } from "discord-api-types/v10";
import { APIAuditLogChangeKeyCommunicationDisabledUntil } from "discord.js";

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

export function findTimeoutChange(
  changes?: APIAuditLogChange[]
): APIAuditLogChangeKeyCommunicationDisabledUntil | undefined {
  return changes?.find(isAPIAuditLogChange("communication_disabled_until"));
}
