import { EmbedBuilder, SlashCommandBuilder } from "@discordjs/builders";
import {
  APIChatInputApplicationCommandGuildInteraction,
  PermissionFlagsBits,
} from "discord-api-types/v10";
import Context from "../../../model/context";
import Color from "../../../utils/colors";
import { SlashCommandHandler } from "../../handlers";
import CommandInteractionOptionResolver from "../../resolver";
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
    interaction: APIChatInputApplicationCommandGuildInteraction
  ): Promise<void> {
    const options = new CommandInteractionOptionResolver(
      interaction.data.options,
      interaction.data.resolved
    );

    const caseRangeStr = options.getString("case");
    if (!caseRangeStr) {
      throw new Error("no case number provided");
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

    const caseSpec = parseCaseId(caseRangeStr);

    if (!caseSpec) {
      await ctx.REST.interactionReply(interaction, {
        embeds: [invalidCaseRangeEmbed],
      });

      return;
    }

    const affectedCaseCount = caseSpecCount(caseSpec);
    if (!affectedCaseCount) {
      // Only occurs if the endCaseId is not provided
      await ctx.REST.interactionReply(interaction, {
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
      await ctx.REST.interactionReply(interaction, {
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

    const caseRange = await getCaseRange(ctx, interaction.guild_id, caseSpec);

    if (!caseRange) {
      await ctx.REST.interactionReply(interaction, {
        embeds: [invalidCaseRangeEmbed],
      });

      return;
    }

    const [startCaseId, endCaseId] = caseRange;

    const { bulkDeleteModLog } = await ctx.sushiiAPI.sdk.bulkDeleteModLog({
      guildId: interaction.guild_id,
      startCaseId: startCaseId.toString(),
      endCaseId: endCaseId.toString(),
    });

    if (!bulkDeleteModLog?.modLogs) {
      await ctx.REST.interactionReply(interaction, {
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
    const ackRes = await ctx.REST.interactionReplyDeferred(interaction);
    ackRes.unwrap();

    for (const modLog of bulkDeleteModLog.modLogs) {
      if (!modLog.msgId) {
        continue;
      }

      // eslint-disable-next-line no-await-in-loop
      await ctx.REST.deleteChannelMessage(guildConfigById.logMod, modLog.msgId);
    }

    await ctx.REST.interactionEditOriginal(interaction, {
      embeds: [
        new EmbedBuilder()
          .setTitle(`Deleted ${affectedCaseCount} cases`)
          .setDescription("")
          .setColor(Color.Success)
          .toJSON(),
      ],
    });
  }
}
