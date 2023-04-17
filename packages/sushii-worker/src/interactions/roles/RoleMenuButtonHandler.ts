import { EmbedBuilder, ButtonInteraction, DiscordAPIError } from "discord.js";
import { MessageFlags } from "discord-api-types/v10";
import Context from "../../model/context";
import Color from "../../utils/colors";
import customIds from "../customIds";
import { ButtonHandler } from "../handlers";
import {
  getRoleMenuMaxRoles,
  getRoleMenuMessageButtonRoles,
  getRoleMenuRequiredRole,
} from "./ids";
import sleep from "../../utils/sleep";

export default class RoleMenuButtonHandler extends ButtonHandler {
  customIDMatch = customIds.roleMenuButton.match;

  // eslint-disable-next-line class-methods-use-this
  async handleInteraction(
    ctx: Context,
    interaction: ButtonInteraction
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Not a guild interaction");
    }

    // -------------------------------------------------------------------------
    // Check if member has required role

    const requiredRole = getRoleMenuRequiredRole(interaction.message);
    if (requiredRole && !interaction.member.roles.cache.has(requiredRole)) {
      await interaction.reply({
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

    // -------------------------------------------------------------------------
    // Check if removing or adding role

    const customIDMatch = customIds.roleMenuButton.match(interaction.customId);
    if (!customIDMatch) {
      throw new Error("No role to add or remove");
    }

    const roleToAddOrRemove = customIDMatch.params.roleId;

    // If user already has role -> remove it
    // If user doesn't have role -> add it
    const isRemovingRole =
      interaction.member.roles.cache.has(roleToAddOrRemove);

    // -------------------------------------------------------------------------
    // Check max roles

    const maxRoles = getRoleMenuMaxRoles(interaction.message);

    const menuRoles = getRoleMenuMessageButtonRoles(interaction.message);
    const menuRolesSet = new Set(menuRoles.map((r) => r.roleId));

    // Check number of roles the member already has selected from this menu
    const memberAlreadySelectedRoles = new Set(
      interaction.member.roles.cache.filter((role) => menuRolesSet.has(role.id))
    );

    // Only check for max roles if user is adding a role, not removing
    if (
      !isRemovingRole &&
      maxRoles &&
      memberAlreadySelectedRoles.size >= maxRoles
    ) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Color.Error)
            .setTitle("Failed to update your roles")
            .setDescription(
              `You can only have a max of ${maxRoles} roles from this menu. You will need to remove one of your roles before you can add another.`
            )
            .toJSON(),
        ],
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    // -------------------------------------------------------------------------
    // Add role or remove role

    let description;
    try {
      if (isRemovingRole) {
        await interaction.member.roles.remove(roleToAddOrRemove);

        description = `Removed role <@&${roleToAddOrRemove}>`;
      } else {
        await interaction.member.roles.add(roleToAddOrRemove);

        description = `Added role <@&${roleToAddOrRemove}>`;
      }
    } catch (err) {
      if (err instanceof DiscordAPIError) {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(Color.Error)
              .setTitle("Failed to update your roles")
              .setDescription(err.message)
              .toJSON(),
          ],
          flags: MessageFlags.Ephemeral,
        });
      }

      throw err;
    }

    const reply = await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(Color.Success)
          .setTitle("Your roles have been updated")
          .setDescription(description)
          .toJSON(),
      ],
      flags: MessageFlags.Ephemeral,
    });

    // Delete reply after 5 seconds
    await sleep(5000);
    await reply.delete();
  }
}
