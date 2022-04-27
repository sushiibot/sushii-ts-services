const prefix = "rolemenu:";

export function getRoleMenuID(requiredRoleID?: string): string {
  return requiredRoleID ? `${prefix}${requiredRoleID}` : prefix;
}

interface RoleMenuIDData {
  requiredRoleID?: string;
}

/**
 * Parses a role menu custom ID
 *
 * @param menuID
 * @returns
 */
export function parseRoleMenuID(menuID: string): RoleMenuIDData {
  const s = menuID.split(":").filter(Boolean);

  return {
    requiredRoleID: s.at(1),
  };
}
