import { EmbedBuilder } from "@discordjs/builders";

import { isGuildInteraction } from "discord-api-types/utils/v10";
import {
  APIMessageComponentSelectMenuInteraction,
  MessageFlags,
} from "discord-api-types/v10";
import Context from "../../model/context";
import Color from "../../utils/colors";
import customIds from "../customIds";
import { SelectMenuHandler } from "../handlers";
import { getRoleMenuMessageSelectRoles, getRoleMenuRequiredRole } from "./ids";

export default class RoleMenuSelectMenuHandler extends SelectMenuHandler {
  customIDMatch = customIds.roleMenuSelect.match;

  // eslint-disable-next-line class-methods-use-this
  async handleInteraction(
    ctx: Context,
    interaction: APIMessageComponentSelectMenuInteraction
  ): Promise<void> {
    if (!isGuildInteraction(interaction)) {
      throw new Error("Not a guild interaction");
    }

    const requiredRole = getRoleMenuRequiredRole(interaction.message);
    if (requiredRole && !interaction.member.roles.includes(requiredRole)) {
      await ctx.REST.interactionReply(interaction, {
        embeds: [
          new EmbedBuilder()
            .setColor(Color.Error)
            .setTitle("Failed to update your roles")
            .setDescription(
              `You need to have the <@&${requiredRole}> role to use this menu.`
            )
            .toJSON(),
        ],
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    const menuRoles = getRoleMenuMessageSelectRoles(interaction.message);

    // Select menu roles -- this can be 0 when clearing all roles
    const selectedRolesSet = new Set(interaction.data.values);

    // Updated total member roles
    const memberNewRoles = new Set(interaction.member.roles);

    // Keep track of which ones are added and removed to show user
    const addedRoles = [];
    const removedRoles = [];

    // Add new selected roles
    for (const addRoleId of interaction.data.values) {
      // Only add if member doesn't already have it, add to addedRoles before
      // adding to memberNewRoles otherwise this is always false
      if (!memberNewRoles.has(addRoleId)) {
        addedRoles.push(addRoleId);
      }

      memberNewRoles.add(addRoleId);
    }

    // Remove roles that were *not* selected
    for (const role of menuRoles) {
      // If role is available in menu AND is NOT selected AND member has it -> remove it
      if (
        !selectedRolesSet.has(role.roleId) &&
        memberNewRoles.has(role.roleId)
      ) {
        memberNewRoles.delete(role.roleId);
        removedRoles.push(role.roleId);
      }
    }

    let description = "";
    if (addedRoles.length > 0) {
      const addedRolesMentions = addedRoles.map((r) => `<@&${r}>`).join(", ");
      description += `Added roles ${addedRolesMentions}\n`;
    }

    if (removedRoles.length > 0) {
      const removedRolesMentions = removedRoles
        .map((r) => `<@&${r}>`)
        .join(", ");
      description += `Removed roles ${removedRolesMentions}`;
    }

    if (addedRoles.length === 0 && removedRoles.length === 0) {
      description = "No roles were added or removed";
    }

    const res = await ctx.REST.setMemberRoles(
      interaction.guild_id,
      interaction.member.user.id,
      Array.from(memberNewRoles)
    );

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
