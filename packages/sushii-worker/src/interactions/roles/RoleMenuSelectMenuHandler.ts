import { EmbedBuilder } from "@discordjs/builders";

import { isGuildInteraction } from "discord-api-types/utils/v10";
import {
  APIMessageComponentSelectMenuInteraction,
  MessageFlags,
} from "discord-api-types/v10";
import logger from "../../logger";

import Context from "../../model/context";
import Color from "../../utils/colors";
import { SelectMenuHandler } from "../handlers";
import { getRoleMenuMessageSelectRoles, roleMenuCustomIDPrefix } from "./ids";

export default class RoleMenuSelectMenuHandler extends SelectMenuHandler {
  customIDPrefix = roleMenuCustomIDPrefix;

  // eslint-disable-next-line class-methods-use-this
  async handleInteraction(
    ctx: Context,
    interaction: APIMessageComponentSelectMenuInteraction
  ): Promise<void> {
    if (!isGuildInteraction(interaction)) {
      throw new Error("Not a guild interaction");
    }

    const menuRoles = getRoleMenuMessageSelectRoles(interaction.message);

    if (interaction.data.values.length === 0) {
      throw new Error("No role to add or remove");
    }

    // Select menu roles
    const selectedRolesSet = new Set(interaction.data.values);

    // Updated total member roles
    const memberNewRoles = new Set(interaction.member.roles);

    logger.debug("selected roles: %o", interaction.data.values);
    logger.debug("member roles: %o", interaction.member.roles);
    logger.debug("menu roles: %o", menuRoles);

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

    logger.debug(
      "Added roles: %o, Removed roles: %o",
      addedRoles,
      removedRoles
    );
    logger.debug("memberNewRoles: %o", Array.from(memberNewRoles));

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
