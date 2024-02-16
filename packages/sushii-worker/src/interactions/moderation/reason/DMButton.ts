import { ButtonInteraction, EmbedBuilder } from "discord.js";
import Context from "../../../model/context";
import customIds from "../../customIds";
import { ButtonHandler } from "../../handlers";
import Color from "../../../utils/colors";
import { getModLog } from "../../../db/ModLog/ModLog.repository";
import db from "../../../model/db";
import { newModuleLogger } from "../../../logger";
import { buildModLogComponents } from "../../../events/ModLogHandler";
import { ActionType } from "../ActionType";

const logger = newModuleLogger("ModLog-DeleteDM-Button");

export default class DeleteModLogDMButtonHandler extends ButtonHandler {
  customIDMatch = customIds.modLogDeleteReasonDM.match;

  // eslint-disable-next-line class-methods-use-this
  async handleInteraction(
    ctx: Context,
    interaction: ButtonInteraction,
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Not a guild interaction");
    }

    const customIDMatch = customIds.modLogDeleteReasonDM.match(
      interaction.customId,
    );
    if (!customIDMatch) {
      throw new Error(
        `No match for mod log delete reason DM button with custom Id: ${interaction.customId}`,
      );
    }

    const { caseId, channelId, messageId } = customIDMatch.params;

    const dmChannel = await interaction.client.channels.fetch(channelId);

    if (!dmChannel || !dmChannel.isDMBased() || !dmChannel.isTextBased()) {
      const embed = new EmbedBuilder()
        .setTitle("Failed to delete DM")
        .setDescription("Hmm... couldn't find the channel.")
        .setColor(Color.Error);

      await interaction.reply({
        embeds: [embed.toJSON()],
        ephemeral: true,
      });

      return;
    }

    try {
      await dmChannel.messages.delete(messageId);
    } catch (err) {
      const embed = new EmbedBuilder()
        .setTitle("Failed to delete DM")
        .setDescription("Hmm... the message is probably already deleted.")
        .setColor(Color.Error);

      await interaction.reply({
        embeds: [embed.toJSON()],
        ephemeral: true,
      });

      return;
    }

    const modCase = await getModLog(db, interaction.guildId, caseId);
    if (!modCase) {
      logger.warn(
        {
          caseId,
          interactionId: interaction.id,
        },
        "Failed to find mod case to delete DM",
      );

      const embed = new EmbedBuilder()
        .setTitle("Deleted DM")
        .setDescription("Deleted the DM message")
        .setColor(Color.Success);

      await interaction.reply({
        embeds: [embed.toJSON()],
        ephemeral: true,
      });

      return;
    }

    const components = buildModLogComponents(
      ActionType.fromString(modCase.action),
      modCase,
      true,
    );

    await interaction.update({
      embeds: interaction.message.embeds,
      components,
    });
  }
}
