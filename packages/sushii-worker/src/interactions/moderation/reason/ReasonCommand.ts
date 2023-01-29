import { EmbedBuilder, SlashCommandBuilder } from "@discordjs/builders";
import {
  APIChatInputApplicationCommandGuildInteraction,
  PermissionFlagsBits,
} from "discord-api-types/v10";
import Context from "../../../model/context";
import Color from "../../../utils/colors";
import { SlashCommandHandler } from "../../handlers";
import CommandInteractionOptionResolver from "../../resolver";
import {
  getErrorMessage,
  interactionReplyErrorPlainMessage,
} from "../../responses/error";
import { caseSpecCount, parseCaseId } from "./caseId";

export default class ReasonCommand extends SlashCommandHandler {
  serverOnly = true;

  command = new SlashCommandBuilder()
    .setName("reason")
    .setDescription("Set the reason for a mod case.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false)
    .addStringOption((o) =>
      o
        .setName("case")
        .setDescription("Case number you want to set the reason for.")
        .setAutocomplete(true)
        .setRequired(true)
    )
    .addStringOption((o) =>
      o
        .setName("reason")
        .setDescription("Reason for the mod case.")
        .setRequired(true)
    )
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction
  ): Promise<void> {
    const options = new CommandInteractionOptionResolver(
      interaction.data.options,
      interaction.data.resolved
    );

    const caseRange = options.getString("case");
    if (!caseRange) {
      throw new Error("no case number provided");
    }

    const reason = options.getString("reason");
    if (!reason) {
      throw new Error("no reason provided");
    }

    const { guildConfigById } = await ctx.sushiiAPI.sdk.guildConfigByID({
      guildId: interaction.guild_id,
    });

    // No guild config found, ignore
    if (
      !guildConfigById || // Config not found
      !guildConfigById.logMod || // No mod log set
      !guildConfigById.logModEnabled // Mod log disabled
    ) {
      return;
    }

    const caseSpec = parseCaseId(caseRange);
    if (!caseSpec) {
      await interactionReplyErrorPlainMessage(
        ctx,
        interaction,
        "Invalid case range, examples: 123 or 123-150 or latest or latest~3"
      );

      return;
    }

    const affectedCaseCount = caseSpecCount(caseSpec);
    if (affectedCaseCount && affectedCaseCount > 25) {
      await interactionReplyErrorPlainMessage(
        ctx,
        interaction,
        `You can only modify up to 25 cases at a time (${affectedCaseCount} > 25)`
      );

      return;
    }

    const modCaseRes = await ctx.sushiiAPI.sdk.getModLog({
      guildId: interaction.guild_id,
      caseId: caseId.toString(),
    });

    const modCase = modCaseRes.modLogByGuildIdAndCaseId;

    if (!modCase) {
      await interactionReplyErrorPlainMessage(
        ctx,
        interaction,
        `Case \`#${caseId}\` not found. Make sure you have the correct case number.`
      );

      return;
    }

    // -------------------------------------------------------------------------
    // Update mod log in DB

    const ackRes = await ctx.REST.interactionReplyDeferred(interaction);
    ackRes.unwrap();

    await ctx.sushiiAPI.sdk.updateModLog({
      guildId: interaction.guild_id,
      caseId: modCase.caseId,
      modLogPatch: {
        reason,
        executorId: interaction.member.user.id,
      },
    });

    // -------------------------------------------------------------------------
    // Fetch the target user

    const targetUser = await ctx.REST.getUser(modCase.userId);
    if (targetUser.err) {
      const errMsg = getErrorMessage(
        "Failed to update reason",
        `I couldn't fetch the user for case \`#${modCase.caseId}\`, but I still updated the reason in the user's history.`
      );

      // Stop any further processing
      await ctx.REST.interactionEditOriginal(interaction, errMsg);

      return;
    }

    // -------------------------------------------------------------------------
    // Create interaction reply embed

    const responseEmbed = new EmbedBuilder()
      .setTitle(`Reason updated for case #${modCase.caseId}`)
      .addFields([
        {
          name: "User",
          value: `<@${modCase.userId}> (${targetUser.val.username}#${targetUser.val.discriminator})`,
        },
        {
          name: "Reason",
          value: reason,
        },
      ])
      .setColor(Color.Success);

    if (!modCase.msgId) {
      const responseEmbedMsgMissing = responseEmbed.setDescription(
        "The mod log message wasn't found for this case, but I still updated the reason in the user's history."
      );

      await ctx.REST.interactionEditOriginal(interaction, {
        embeds: [responseEmbedMsgMissing.toJSON()],
      });

      return;
    }

    // -------------------------------------------------------------------------
    // Edit the mod log message

    // Fetch the message so we can selectively edit the embed
    const modLogMsg = await ctx.REST.getChannelMessage(
      guildConfigById.logMod,
      modCase.msgId
    );
    if (modLogMsg.err) {
      const errMsg = getErrorMessage(
        "Failed to update reason",
        `I couldn't fetch the mod log message for case, but I still updated the reason in the user's history. This could be due to the mod log channel being changed, or I don't have permission to view the mod log channel (<#${guildConfigById.logMod}>).`
      );

      // Stop any further processing
      await ctx.REST.interactionEditOriginal(interaction, errMsg);

      return;
    }

    const oldFields = modLogMsg.val.embeds[0].fields || [];
    const indexOfReasonField = oldFields.findIndex((f) => f.name === "Reason");

    const newEmbed = new EmbedBuilder(modLogMsg.val.embeds[0])
      .setAuthor({
        name: `${interaction.member.user.username}#${interaction.member.user.discriminator}`,
        iconURL: ctx.CDN.userFaceURL(interaction.member.user),
      })
      // Replaces 1 element at index `indexOfReasonField`
      .spliceFields(indexOfReasonField, 1, {
        name: "Reason",
        value: reason,
        inline: false,
      });

    // Edit the original message to show the updated reason
    await ctx.REST.editChannelMessage(guildConfigById.logMod, modCase.msgId, {
      embeds: [newEmbed.toJSON()],
    });

    await ctx.REST.interactionEditOriginal(interaction, {
      embeds: [responseEmbed.toJSON()],
    });
  }
}
