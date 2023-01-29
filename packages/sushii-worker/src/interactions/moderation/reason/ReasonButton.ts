import { ActionRowBuilder, TextInputBuilder } from "@discordjs/builders";

import { isGuildInteraction } from "discord-api-types/utils/v10";
import {
  APIMessageComponentButtonInteraction,
  TextInputStyle,
} from "discord-api-types/v10";
import Context from "../../../model/context";
import customIds from "../../customIds";
import { ButtonHandler } from "../../handlers";

// Button on mod log opens a modal
export default class ModLogReasonButtonHandler extends ButtonHandler {
  customIDMatch = customIds.modLogReason.match;

  // eslint-disable-next-line class-methods-use-this
  async handleInteraction(
    ctx: Context,
    interaction: APIMessageComponentButtonInteraction
  ): Promise<void> {
    if (!isGuildInteraction(interaction)) {
      throw new Error("Not a guild interaction");
    }

    const customIDMatch = customIds.modLogReason.match(
      interaction.data.custom_id
    );
    if (!customIDMatch) {
      throw new Error("No mod log reason match");
    }

    const { caseId } = customIDMatch.params;

    const textInput = new TextInputBuilder()
      .setLabel("Reason")
      .setRequired(true)
      .setPlaceholder("Rule 1")
      .setStyle(TextInputStyle.Paragraph)
      .setCustomId("reason");
    const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
      textInput
    );

    await ctx.REST.interactionReplyModal(interaction, {
      title: `Case #${caseId}`,
      custom_id: interaction.data.custom_id,
      components: [row.toJSON()],
    });
  }
}
