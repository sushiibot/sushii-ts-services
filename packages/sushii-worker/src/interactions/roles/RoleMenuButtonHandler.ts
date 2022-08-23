import { EmbedBuilder } from "@discordjs/builders";

import { isGuildInteraction } from "discord-api-types/utils/v10";
import {
  APIMessageComponentButtonInteraction,
  MessageFlags,
} from "discord-api-types/v10";

import Context from "../../model/context";
import Color from "../../utils/colors";
import { ButtonHandler } from "../handlers";
import { parseCustomID, roleMenuCustomIDPrefix } from "./ids";

export default class RoleMenuButtonHandler extends ButtonHandler {
  customIDPrefix = roleMenuCustomIDPrefix;

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

    // If user already has role -> remove it
    // If user doesn't have role -> add it
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
