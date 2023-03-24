import { EmbedBuilder, SlashCommandBuilder } from "@discordjs/builders";
import { PermissionFlagsBits } from "discord-api-types/v10";
import { ChatInputCommandInteraction } from "discord.js";
import Context from "../../../model/context";
import Color from "../../../utils/colors";
import { SlashCommandHandler } from "../../handlers";
import { caseSpecCount, getCaseRange, parseCaseId } from "./caseId";
import { invalidCaseRangeEmbed } from "./Messages";

export default class UncaseCommand extends SlashCommandHandler {
  serverOnly = true;

  command = new SlashCommandBuilder()
    .setName("uncase")
    .setDescription("Delete mod cases.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false)
    .addStringOption((o) =>
      o
        .setName("case")
        .setDescription("Case numbers you want to set the reason for.")
        .setAutocomplete(true)
        .setRequired(true)
    )
    .addBooleanOption((o) =>
      o
        .setName("keep_log_messages")
        .setDescription(
          "Prevent deletion of messages in the mod log for the deleted cases. By default, messages are deleted."
        )
        .setRequired(false)
    )
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Guild not cached");
    }

    const caseRangeStr = interaction.options.getString("case", true);

    const { guildConfigById } = await ctx.sushiiAPI.sdk.guildConfigByID({
      guildId: interaction.guildId,
    });

    // No guild config found, ignore
    if (
      !guildConfigById || // Config not found
      !guildConfigById.logMod || // No mod log set
      !guildConfigById.logModEnabled // Mod log disabled
    ) {
      return;
    }

    const caseSpec = parseCaseId(caseRangeStr);

    if (!caseSpec) {
      await interaction.reply({
        embeds: [invalidCaseRangeEmbed],
      });

      return;
    }

    const affectedCaseCount = caseSpecCount(caseSpec);
    if (!affectedCaseCount) {
      // Only occurs if the endCaseId is not provided
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Invalid case range")
            .setDescription("Please specify the end case ID.")
            .setColor(Color.Error)
            .toJSON(),
        ],
      });

      return;
    }

    if (affectedCaseCount > 25) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Too many cases")
            .setDescription(
              "You can only delete up to 25 cases at a time. Please try again with a smaller range."
            )
            .setColor(Color.Error)
            .toJSON(),
        ],
      });
    }

    const caseRange = await getCaseRange(ctx, interaction.guildId, caseSpec);

    if (!caseRange) {
      await interaction.reply({
        embeds: [invalidCaseRangeEmbed],
      });

      return;
    }

    const [startCaseId, endCaseId] = caseRange;

    const { bulkDeleteModLog } = await ctx.sushiiAPI.sdk.bulkDeleteModLog({
      guildId: interaction.guildId,
      startCaseId: startCaseId.toString(),
      endCaseId: endCaseId.toString(),
    });

    if (!bulkDeleteModLog?.modLogs) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Failed to delete cases")
            .setDescription("There weren't any cases deleted.")
            .setColor(Color.Error)
            .toJSON(),
        ],
      });
      return;
    }

    // Defer reply for deleting messages
    await interaction.deferReply();

    for (const modLog of bulkDeleteModLog.modLogs) {
      if (!modLog.msgId) {
        continue;
      }

      // eslint-disable-next-line no-await-in-loop
      await ctx.REST.deleteChannelMessage(guildConfigById.logMod, modLog.msgId);
    }

    const desc = bulkDeleteModLog.modLogs
      .map((m) => `#${m.caseId} - ${m.action} <@${m.userId}>`)
      .join("\n");

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Deleted ${affectedCaseCount} cases`)
          .setDescription(desc)
          .setColor(Color.Success)
          .toJSON(),
      ],
    });
  }
}
