import {
  APIButtonComponentWithCustomId,
  APIMessageComponentButtonInteraction,
  APISelectMenuComponent,
  ComponentType,
} from "discord-api-types/v10";

export const roleMenuCustomIDPrefix = "rolemenu:";

export function parseCustomID(customID: string): string | undefined {
  if (!customID.startsWith(roleMenuCustomIDPrefix)) {
    return;
  }

  return customID.split(":").at(1);
}

export function buildCustomID(roleId: string): string {
  return `${roleMenuCustomIDPrefix}${roleId}`;
}

interface MenuRoleData {
  roleId: string;
  label: string;
}

/**
 * Parse a message to get all the roles contained in buttons.
 */
export function getRoleMenuMessageButtonRoles(
  msg: APIMessageComponentButtonInteraction["message"]
): MenuRoleData[] {
  if (!msg.components) {
    return [];
  }

  return msg.components
    .map((row) =>
      row.components
        .filter(
          (component): component is APIButtonComponentWithCustomId =>
            component.type === ComponentType.Button
        )
        .map((button) => ({
          roleId: parseCustomID(button.custom_id),
          label: button.label!,
        }))
        .filter((button): button is MenuRoleData => !!button.roleId)
    )
    .flat();
}

export function getRoleMenuMessageSelectRoles(
  msg: APIMessageComponentButtonInteraction["message"]
): MenuRoleData[] {
  if (!msg.components) {
    return [];
  }

  return msg.components
    .map((row) =>
      row.components
        .filter(
          (component): component is APISelectMenuComponent =>
            component.type === ComponentType.SelectMenu
        )
        .flatMap((selectMenu) =>
          selectMenu.options.map((option) => ({
            roleId: option.value,
            label: option.label,
          }))
        )
        .filter((option): option is MenuRoleData => !!option.roleId)
    )
    .flat();
}
