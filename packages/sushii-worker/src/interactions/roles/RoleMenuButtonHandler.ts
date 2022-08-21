import { EmbedBuilder } from "@discordjs/builders";

import { isGuildInteraction } from "discord-api-types/utils/v10";
import {
  APIButtonComponentWithCustomId,
  APIMessageComponentButtonInteraction,
  ComponentType,
  MessageFlags,
} from "discord-api-types/v10";

import Context from "../../model/context";
import Color from "../../utils/colors";
import { ButtonHandler } from "../handlers";

export const roleMenuButtonCustomIDPrefix = "roleMenu:";

export interface RoleMenuButton {
  roleId: string;
}

export function parseCustomID(customID: string): string | undefined {
  if (!customID.startsWith(roleMenuButtonCustomIDPrefix)) {
    return;
  }

  return customID.split(":").at(1);
}

export function buildCustomID(roleId: string): string {
  return `${roleMenuButtonCustomIDPrefix}${roleId}`;
}

interface ButtonRoleData {
  roleId: string;
  label: string;
}

/**
 * Parse a message to get all the roles contained in buttons.
 */
function getRoleMenuMessageRoles(
  msg: APIMessageComponentButtonInteraction["message"]
): ButtonRoleData[] {
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
        .filter((button): button is ButtonRoleData => !!button.roleId)
    )
    .flat();
}

export default class RoleMenuButtonHandler extends ButtonHandler {
  customIDPrefix = roleMenuButtonCustomIDPrefix;

  // eslint-disable-next-line class-methods-use-this
  async handleInteraction(
    ctx: Context,
    interaction: APIMessageComponentButtonInteraction
  ): Promise<void> {
    if (!isGuildInteraction(interaction)) {
      throw new Error("Not a guild interaction");
    }

    const roleToAddOrRemove = parseCustomID(interaction.data.custom_id);
    if (!roleToAddOrRemove) {
      throw new Error("No role to add or remove");
    }

    const isRemovingRole = interaction.member.roles.includes(roleToAddOrRemove);

    let res;
    let description;
    if (isRemovingRole) {
      res = await ctx.REST.removeMemberRole(
        interaction.guild_id,
        interaction.member.user.id,
        roleToAddOrRemove
      );

      description = `Removed role <@&${roleToAddOrRemove}>`;
    } else {
      res = await ctx.REST.addMemberRole(
        interaction.guild_id,
        interaction.member.user.id,
        roleToAddOrRemove
      );

      description = `Added role <@&${roleToAddOrRemove}>`;
    }

    if (res.err) {
      await ctx.REST.interactionReply(interaction, {
        embeds: [
          new EmbedBuilder()
            .setColor(Color.Error)
            .setTitle("Failed to update your roles")
            .setDescription(res.val.message)
            .toJSON(),
        ],
        flags: MessageFlags.Ephemeral,
      });
    }

    await ctx.REST.interactionReply(interaction, {
      embeds: [
        new EmbedBuilder()
          .setColor(Color.Success)
          .setTitle("Your roles have been updated")
          .setDescription(description)
          .toJSON(),
      ],
      flags: MessageFlags.Ephemeral,
    });
  }
}
