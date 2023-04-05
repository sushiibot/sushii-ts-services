import { MessageFlags, ModalSubmitInteraction, EmbedBuilder } from "discord.js";
import Context from "../../../model/context";
import customIds from "../../customIds";
import { ModalHandler } from "../../handlers";
import Color from "../../../utils/colors";
import { interactionReplyErrorPlainMessage } from "../../responses/error";
import buildModLogEmbed from "../../../builders/buildModLogEmbed";
import { ActionType } from "../ActionType";

// When modal submitted, update mod log message and save the reason
export default class ModLogReasonModalHandler extends ModalHandler {
  customIDMatch = customIds.modLogReason.match;

  // eslint-disable-next-line class-methods-use-this
  async handleModalSubmit(
    ctx: Context,
    interaction: ModalSubmitInteraction
  ): Promise<void> {
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

    const modCase = await ctx.sushiiAPI.sdk.getModLog({
      guildId: interaction.guildId,
      caseId,
    });

    if (!modCase.modLogByGuildIdAndCaseId) {
      await interactionReplyErrorPlainMessage(
        ctx,
        interaction,
        `Case #${caseId} was not found, it may have been deleted.`
      );

      return;
    }

    // Save db reason and executor
    const updatedModCase = await ctx.sushiiAPI.sdk.updateModLog({
      guildId: interaction.guildId,
      caseId,
      modLogPatch: {
        reason,
        executorId: interaction.member.user.id,
      },
    });

    if (!updatedModCase.updateModLogByGuildIdAndCaseId?.modLog) {
      await interactionReplyErrorPlainMessage(
        ctx,
        interaction,
        `Failed to update case #${caseId}`
      );

      return;
    }

    if (!interaction.channelId) {
      throw new Error("No channel id in reason modal interaction");
    }

    if (!modCase.modLogByGuildIdAndCaseId.msgId) {
      throw new Error("No message id in mod log case");
    }

    const targetUser = await ctx.REST.getUser(
      modCase.modLogByGuildIdAndCaseId.userId
    );

    if (targetUser.err) {
      await interactionReplyErrorPlainMessage(
        ctx,
        interaction,
        "Failed to get user"
      );

      return;
    }

    // Rebuild embed with new mod case with included reason and executor
    const newEmbed = await buildModLogEmbed(
      ctx,
      ActionType.fromString(modCase.modLogByGuildIdAndCaseId.action),
      targetUser.val,
      updatedModCase.updateModLogByGuildIdAndCaseId.modLog
    );

    // Edit message to show reason and remove button
    await interaction.channel?.messages.edit(
      modCase.modLogByGuildIdAndCaseId.msgId,
      {
        embeds: [newEmbed.toJSON()],
        components: [],
      }
    );

    const embed = new EmbedBuilder()
      .setTitle(`Updated reason for case #${caseId}`)
      .setColor(Color.Success);

    await interaction.reply({
      embeds: [embed.toJSON()],
      flags: MessageFlags.Ephemeral,
    });
  }
}
