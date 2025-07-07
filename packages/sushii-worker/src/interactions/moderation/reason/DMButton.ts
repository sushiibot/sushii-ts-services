import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
} from "discord.js";
import { sleep } from "bun";
import Context from "../../../model/context";
import customIds from "../../customIds";
import { ButtonHandler } from "../../handlers";
import Color from "../../../utils/colors";
import { getModLog } from "../../../db/ModLog/ModLog.repository";
import db from "../../../infrastructure/database/db";
import { newModuleLogger } from "@/shared/infrastructure/logger";
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

    // Ask for confirmation
    const confirmationEmbed = new EmbedBuilder()
      .setTitle("Are you sure?")
      .setDescription(
        "This will delete the DM sent to the user containing the reason.",
      )
      .setColor(Color.Warning);

    const confirmationCancelButton = new ButtonBuilder()
      .setCustomId("cancel")
      .setLabel("Cancel")

      .setStyle(ButtonStyle.Secondary);
    const confirmationYesButton = new ButtonBuilder()
      .setCustomId("yes")
      .setLabel("Yes")
      .setStyle(ButtonStyle.Danger);

    const confirmationRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      confirmationCancelButton,
      confirmationYesButton,
    );

    const confirmReplyMsg = await interaction.reply({
      embeds: [confirmationEmbed],
      components: [confirmationRow],
      ephemeral: true,
      // Required to await message component due to bug:
      // https://github.com/discordjs/discord.js/issues/7992
      // fetchReply: true,
    });

    const confirmMsg = await confirmReplyMsg.fetch();

    let confirmButtonInteraction;
    try {
      confirmButtonInteraction = await confirmMsg.awaitMessageComponent({
        // Only accept from user who initiated the interaction
        // filter: (i) => i.user.id === interaction.user.id,
        time: 1000 * 60 * 2, // 2 minutes
        componentType: ComponentType.Button,
      });

      if (confirmButtonInteraction.customId === "cancel") {
        await confirmButtonInteraction.update({
          content: "Cancelled!",
          components: [],
          embeds: [],
        });

        // Wait for 5 seconds before deleting the message
        await sleep(2 * 1000);

        await confirmButtonInteraction.deleteReply();

        return;
      }

      await confirmButtonInteraction.deferUpdate();
      await confirmReplyMsg.delete();
    } catch (err) {
      // Timed out
      await confirmReplyMsg.delete();
      return;
    }

    const { caseId, channelId, messageId } = customIDMatch.params;

    const dmChannel = await interaction.client.channels.fetch(channelId);

    if (!dmChannel || !dmChannel.isDMBased() || !dmChannel.isTextBased()) {
      const embed = new EmbedBuilder()
        .setTitle("Failed to delete DM")
        .setDescription("Hmm... couldn't find the channel.")
        .setColor(Color.Error);

      await confirmButtonInteraction.update({
        embeds: [embed.toJSON()],
        components: [],
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

      await confirmButtonInteraction.update({
        embeds: [embed.toJSON()],
        components: [],
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

      await confirmButtonInteraction.update({
        embeds: [embed],
        components: [],
      });

      return;
    }

    const components = buildModLogComponents(
      ActionType.fromString(modCase.action),
      modCase,
      true,
    );

    await interaction.message.edit({
      embeds: interaction.message.embeds,
      components,
    });
  }
}
