import { AuditLogChange } from "discord.js";

/**
 * This is a type guard to check if the APIAuditLogChange is of a specific type.
 * Used for iteration over the changes array in the audit log entry and returns
 * the actual matching discriminated type.
 *
 * @param val
 * @returns
 */
export function isAPIAuditLogChange<V extends AuditLogChange["key"]>(val: V) {
  return (obj: AuditLogChange): obj is Extract<AuditLogChange, { key: V }> =>
    obj.key === val;
}

export function findTimeoutChange(
  changes?: AuditLogChange[],
): AuditLogChange | undefined {
  return changes?.find(isAPIAuditLogChange("communication_disabled_until"));
}
