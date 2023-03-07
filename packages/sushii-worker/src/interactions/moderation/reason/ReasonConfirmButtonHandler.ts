import { EmbedBuilder } from "@discordjs/builders";

import { isGuildInteraction } from "discord-api-types/utils/v10";
import {
  APIMessageComponentButtonInteraction,
  MessageFlags,
} from "discord-api-types/v10";
import Context from "../../../model/context";
import Color from "../../../utils/colors";
import customIds from "../../customIds";
import { ButtonHandler } from "../../handlers";
import { updateModLogReasons } from "./ReasonCommand";

// Button on mod log opens a modal
export default class ReasonConfirmButtonHandler extends ButtonHandler {
  customIDMatch = customIds.reasonConfirmButton.match;

  // eslint-disable-next-line class-methods-use-this
  async handleInteraction(
    ctx: Context,
    interaction: APIMessageComponentButtonInteraction
  ): Promise<void> {
    if (!isGuildInteraction(interaction)) {
      throw new Error("Not a guild interaction");
    }

    const customIDMatch = customIds.reasonConfirmButton.match(
      interaction.data.custom_id
    );
    if (!customIDMatch) {
      throw new Error("No pending reason match");
    }

    const { userId, buttonId, action } = customIDMatch.params;

    if (userId !== interaction.member.user.id) {
      const embed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription("You can only confirm your own reason command :(");

      await ctx.REST.interactionReply(interaction, {
        embeds: [embed.toJSON()],
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    if (action === "cancel") {
      ctx.memoryStore.pendingReasonConfirmations.delete(buttonId);

      const embed = new EmbedBuilder()
        .setTitle("Cancelled")
        .setDescription("Cancelled reason update, no cases were modified.")
        .setColor(Color.Success);

      // Edit the message the comment is attached to
      await ctx.REST.interactionEdit(interaction, {
        embeds: [embed.toJSON()],
        components: [],
      });

      return;
    }

    const pendingConfirmation =
      ctx.memoryStore.pendingReasonConfirmations.get(buttonId);

    if (!pendingConfirmation) {
      const embed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription(
          "No pending reason confirmation found, please try the reason command again"
        )
        .setColor(Color.Error);

      // Edit the message the comment is attached to
      await ctx.REST.interactionEdit(interaction, {
        embeds: [embed.toJSON()],
        components: [],
      });

      return;
    }

    // Delete pending confirmation in memory
    ctx.memoryStore.pendingReasonConfirmations.delete(buttonId);

    const { caseStartId, caseEndId, reason } = pendingConfirmation;

    const { guildConfigById } = await ctx.sushiiAPI.sdk.guildConfigByID({
      guildId: interaction.guild_id,
    });

    if (!guildConfigById?.logMod) {
      const embed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription("Mod log channel not set")
        .setColor(Color.Error);

      await ctx.REST.interactionEdit(interaction, {
        embeds: [embed.toJSON()],
        components: [],
      });

      return;
    }

    const responseEmbed = await updateModLogReasons(
      ctx,
      interaction,
      interaction.guild_id,
      guildConfigById.logMod,
      interaction.member.user.id,
      [caseStartId, caseEndId],
      reason,
      // onlyEmptyReason
      action === "empty"
    );

    if (!responseEmbed) {
      return;
    }

    // Edit the message the button is attached to with the update result
    await ctx.REST.interactionEdit(interaction, {
      embeds: [responseEmbed.toJSON()],
      components: [],
    });
  }
}
