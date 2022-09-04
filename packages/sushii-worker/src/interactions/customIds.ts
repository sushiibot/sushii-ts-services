import { match, compile } from "path-to-regexp";
import { ActionType } from "./moderation/ActionType";

interface CustomIDPath {
  path: string;
  match: ReturnType<typeof match>;
  compile: ReturnType<typeof compile>;
}

function createCustomID(path: string): CustomIDPath {
  return {
    path,
    match: match(path),
    compile: compile(path),
  };
}

export const customIds = {
  roleMenuButton: createCustomID("/rolemenu/button/:roleId"),
  roleMenuSelect: createCustomID("/rolemenu/select"),
  lookupButton: createCustomID("/lookup/button/:action/:userId/:reason?"),
};

// Role menu button

export function roleMenuButtonCompile(roleId: string): string {
  return customIds.roleMenuButton.compile({ roleId });
}

// Role menu select

export function roleMenuSelectCompile(): string {
  return customIds.roleMenuSelect.compile();
}

export function lookupButtonCompile(
  action: ActionType,
  userId: string,
  reason?: string
): string {
  return customIds.lookupButton.compile({
    action,
    userId,
    reason,
  });
}
