import {
  ActionRowBuilder,
  TextInputBuilder,
  ButtonInteraction,
} from "discord.js";
import { TextInputStyle } from "discord.js";
import customIds from "../../customIds";
import { ButtonHandler } from "../../handlers";

// Button on mod log opens a modal
export default class ModLogReasonButtonHandler extends ButtonHandler {
  customIDMatch = customIds.modLogReason.match;

  async handleInteraction(interaction: ButtonInteraction): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Not a guild interaction");
    }

    const customIDMatch = customIds.modLogReason.match(interaction.customId);
    if (!customIDMatch) {
      throw new Error("No mod log reason match");
    }

    const { caseId } = customIDMatch.params;

    const textInput = new TextInputBuilder()
      .setLabel("Reason")
      .setRequired(true)
      .setPlaceholder("Enter a reason. This will be saved in the mod log.")
      .setStyle(TextInputStyle.Paragraph)
      .setCustomId("reason");
    const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
      textInput,
    );

    await interaction.showModal({
      title: `Case #${caseId}`,
      custom_id: interaction.customId,
      components: [row.toJSON()],
    });
  }
}
