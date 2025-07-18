import {
  EmbedBuilder,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  InteractionContextType,
} from "discord.js";
import { PermissionFlagsBits } from "discord.js";
import Color from "../../../utils/colors";
import { SlashCommandHandler } from "../../handlers";
import { caseSpecCount, getCaseRange, parseCaseId } from "./caseId";
import { invalidCaseRangeEmbed } from "./Messages";
import db from "../../../infrastructure/database/db";
import { getGuildConfig } from "../../../db/GuildConfig/GuildConfig.repository";
import { deleteModLogsRange } from "../../../db/ModLog/ModLog.repository";

export default class UncaseCommand extends SlashCommandHandler {
  serverOnly = true;

  command = new SlashCommandBuilder()
    .setName("uncase")
    .setDescription("Delete mod cases.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setContexts(InteractionContextType.Guild)
    .addStringOption((o) =>
      o
        .setName("case")
        .setDescription("Case numbers you want to set the reason for.")
        .setAutocomplete(true)
        .setRequired(true),
    )
    .addBooleanOption((o) =>
      o
        .setName("keep_log_messages")
        .setDescription(
          "Prevent deletion of messages in the mod log for the deleted cases. By default, messages are deleted.",
        )
        .setRequired(false),
    )
    .toJSON();

  async handler(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Guild not cached");
    }

    if (!interaction.channel) {
      throw new Error("No channel");
    }

    const caseRangeStr = interaction.options.getString("case", true);

    const config = await getGuildConfig(db, interaction.guildId);

    // No guild config found, ignore
    if (
      !config || // Config not found
      !config.log_mod || // No mod log set
      !config.log_mod_enabled // Mod log disabled
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
              "You can only delete up to 25 cases at a time. Please try again with a smaller range.",
            )
            .setColor(Color.Error)
            .toJSON(),
        ],
      });
    }

    const caseRange = await getCaseRange(interaction.guildId, caseSpec);

    if (!caseRange) {
      await interaction.reply({
        embeds: [invalidCaseRangeEmbed],
      });

      return;
    }

    const [startCaseId, endCaseId] = caseRange;

    const deletedMogLogs = await deleteModLogsRange(
      db,
      interaction.guildId,
      startCaseId.toString(),
      endCaseId.toString(),
    );

    if (deletedMogLogs.length === 0) {
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

    const deleteIds = deletedMogLogs
      .filter((l) => l.msg_id)
      .map((l) => l.msg_id!);

    const modLogChannel = await interaction.guild.channels.fetch(
      config.log_mod,
    );

    if (!modLogChannel || !modLogChannel.isTextBased()) {
      throw new Error("Mod log channel not found or is not text channel");
    }

    try {
      await modLogChannel.bulkDelete(deleteIds);
    } catch (err) {
      // Whatever
    }

    const desc = deletedMogLogs
      .map((m) => `#${m.case_id} - ${m.action} <@${m.user_id}>`)
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
