import {
  APIButtonComponentWithCustomId,
  APIMessageComponentButtonInteraction,
  APIStringSelectComponent,
  ComponentType,
} from "discord-api-types/v10";
import customIds from "../customIds";

interface MenuRoleData {
  roleId: string;
  label: string;
}

export function getRoleMenuRequiredRole(
  msg: APIMessageComponentButtonInteraction["message"]
): string | null {
  if (!msg.embeds) {
    return null;
  }

  const embed = msg.embeds.at(0);
  if (!embed) {
    return null;
  }

  return (
    embed.fields?.find((field) => field.name === "Required role")?.value || null
  );
}

export function getRoleMenuMaxRoles(
  msg: APIMessageComponentButtonInteraction["message"]
): number | null {
  if (!msg.embeds) {
    return null;
  }

  const embed = msg.embeds.at(0);
  if (!embed) {
    return null;
  }

  const maxRoles = embed.fields?.find(
    (field) => field.name === "Maximum roles you can pick"
  )?.value;
  if (!maxRoles) {
    return null;
  }

  // NaN if invalid, which is falsy
  return parseInt(maxRoles, 10) || null;
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
        .map((button) => {
          const match = customIds.roleMenuButton.matchParams(button.custom_id);

          return {
            roleId: match ? match.roleId : null,
            label: button.label!,
          };
        })
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
          (component): component is APIStringSelectComponent =>
            component.type === ComponentType.StringSelect
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
