import { ModalSubmitInteraction } from "discord.js";

import { getModLog, upsertModLog } from "../../../db/ModLog/ModLog.repository";
import buildModLogEmbed from "@/features/moderation/shared/presentation/buildModLogEmbed";
import db from "../../../infrastructure/database/db";
import customIds from "../../customIds";
import { ModalHandler } from "../../handlers";
import { interactionReplyErrorPlainMessage } from "../../responses/error";
import { ActionType, actionTypeFromString } from "@/features/moderation/shared/domain/value-objects/ActionType";

// When modal submitted, update mod log message and save the reason
export default class ModLogReasonModalHandler extends ModalHandler {
  customIDMatch = customIds.modLogReason.match;

  async handleModalSubmit(interaction: ModalSubmitInteraction): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Not a guild interaction");
    }

    const customIDMatch = customIds.modLogReason.match(interaction.customId);
    if (!customIDMatch) {
      throw new Error("No mod log reason match");
    }

    const { caseId } = customIDMatch.params;

    // Only 1 row and 1 component in this modal
    const reason = interaction.fields.getTextInputValue("reason");
    if (!reason) {
      throw new Error("No reason was set in the modal somehow");
    }

    const modCase = await getModLog(db, interaction.guildId, caseId);

    if (!modCase) {
      await interactionReplyErrorPlainMessage(
        interaction,
        `Case #${caseId} was not found, it may have been deleted.`,
      );

      return;
    }

    // Save db reason and executor
    const updatedModCase = await upsertModLog(db, {
      ...modCase,
      reason,
      executor_id: interaction.member.user.id,
    });

    if (!updatedModCase) {
      await interactionReplyErrorPlainMessage(
        interaction,
        `Failed to update case #${caseId}`,
      );

      return;
    }

    if (!interaction.channelId) {
      throw new Error("No channel id in reason modal interaction");
    }

    if (!modCase.msg_id) {
      throw new Error("No message id in mod log case");
    }

    let targetUser;
    try {
      targetUser = await interaction.client.users.fetch(modCase.user_id);
    } catch (err) {
      await interactionReplyErrorPlainMessage(
        interaction,
        "Failed to get user",
      );

      return;
    }

    // Rebuild embed with new mod case with included reason and executor
    const newEmbed = await buildModLogEmbed(
      interaction.client,
      actionTypeFromString(modCase.action),
      targetUser,
      updatedModCase,
    );

    if (!interaction.isFromMessage()) {
      throw new Error("Reason modal should be from a button on a message");
    }

    // Edit message to show reason and remove button
    await interaction.update({
      embeds: [newEmbed.toJSON()],
      components: [],
    });
  }
}
