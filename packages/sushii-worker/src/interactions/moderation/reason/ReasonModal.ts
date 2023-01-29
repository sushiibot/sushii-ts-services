import { APIModalSubmitInteraction, MessageFlags } from "discord-api-types/v10";
import { isGuildInteraction } from "discord-api-types/utils/v10";
import { EmbedBuilder } from "@discordjs/builders";
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
    interaction: APIModalSubmitInteraction
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

    // Only 1 row and 1 component in this modal
    const reason = interaction.data.components?.at(0)?.components?.at(0)?.value;
    if (!reason) {
      throw new Error("No reason was set in the modal somehow");
    }

    const modCase = await ctx.sushiiAPI.sdk.getModLog({
      guildId: interaction.guild_id,
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
      guildId: interaction.guild_id,
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

    if (!interaction.channel_id) {
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
    await ctx.REST.editChannelMessage(
      interaction.channel_id,
      modCase.modLogByGuildIdAndCaseId.msgId,
      {
        embeds: [newEmbed.toJSON()],
        components: [],
      }
    );

    const embed = new EmbedBuilder()
      .setTitle(`Updated reason for case #${caseId}`)
      .setColor(Color.Success);

    await ctx.REST.interactionReply(interaction, {
      embeds: [embed.toJSON()],
      flags: MessageFlags.Ephemeral,
    });
  }
}
