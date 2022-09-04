import { match, compile } from "path-to-regexp";

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
};

// Role menu button

export function roleMenuButtonCompile(roleId: string): string {
  return customIds.roleMenuButton.compile({ roleId });
}

// Role menu select

export function roleMenuSelectCompile(): string {
  return customIds.roleMenuSelect.compile();
}
