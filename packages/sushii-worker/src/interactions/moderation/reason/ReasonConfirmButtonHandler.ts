import { EmbedBuilder, ButtonInteraction, MessageFlags } from "discord.js";
import Context from "../../../model/context";
import Color from "../../../utils/colors";
import customIds from "../../customIds";
import { ButtonHandler } from "../../handlers";
import { updateModLogReasons } from "./ReasonCommand";
import { getGuildConfigById } from "../../../model/guild/guildConfig.repository";
import db from "../../../model/db";

// Button on mod log opens a modal
export default class ReasonConfirmButtonHandler extends ButtonHandler {
  customIDMatch = customIds.reasonConfirmButton.match;

  // eslint-disable-next-line class-methods-use-this
  async handleInteraction(
    ctx: Context,
    interaction: ButtonInteraction,
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Guild not cached");
    }

    const customIDMatch = customIds.reasonConfirmButton.match(
      interaction.customId,
    );
    if (!customIDMatch) {
      throw new Error("No pending reason match");
    }

    const { userId, buttonId, action } = customIDMatch.params;

    if (userId !== interaction.member.user.id) {
      const embed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription("You can only confirm your own reason command :(");

      await interaction.reply({
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
      await interaction.update({
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
          "No pending reason confirmation found, please try the reason command again",
        )
        .setColor(Color.Error);

      // Edit the message the comment is attached to
      await interaction.update({
        embeds: [embed.toJSON()],
        components: [],
      });

      return;
    }

    // Delete pending confirmation in memory
    ctx.memoryStore.pendingReasonConfirmations.delete(buttonId);

    const { caseStartId, caseEndId, reason } = pendingConfirmation;

    const config = await getGuildConfigById(db, interaction.guildId);

    if (!config?.log_mod) {
      const embed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription("Mod log channel not set")
        .setColor(Color.Error);

      await interaction.reply({
        embeds: [embed.toJSON()],
        components: [],
      });

      return;
    }

    const responseEmbed = await updateModLogReasons(
      ctx,
      interaction,
      interaction.guildId,
      config.log_mod,
      interaction.member.user.id,
      [caseStartId, caseEndId],
      reason,
      // onlyEmptyReason
      action === "empty",
    );

    if (!responseEmbed) {
      return;
    }

    // Edit the message the button is attached to with the update result
    await interaction.update({
      embeds: [responseEmbed.toJSON()],
      components: [],
    });
  }
}
