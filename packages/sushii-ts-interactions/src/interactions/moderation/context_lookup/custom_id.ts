import { Action } from "./LookupComponentHandler";

const lookupIdBase = "lookup";
export const lookupAction = "actionButton";
export const lookupReason = "reasonSelect";

export function getActionButtonCustomID(
  action: Action,
  userId: string
): string {
  return [lookupIdBase, action, userId].join(":");
}

export function getReasonSelectCustomID(
  action: Action,
  userId: string,
  reason: string
): string {
  return [lookupIdBase, action, userId, reason].join(":");
}
