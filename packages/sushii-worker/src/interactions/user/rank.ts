import {
  SlashCommandBuilder,
  AttachmentBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import logger from "../../logger";
import Context from "../../model/context";
import { SlashCommandHandler } from "../handlers";
import { getErrorMessage } from "../responses/error";
import { getUserRank } from "./rank.service";

export default class RankCommand extends SlashCommandHandler {
  serverOnly = true;

  command = new SlashCommandBuilder()
    .setName("rank")
    .setDescription("View your or another user's rank.")
    .setDMPermission(false)
    .addUserOption((o) =>
      o
        .setName("user")
        .setDescription("Whose rank to view.")
        .setRequired(false),
    )
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Guild missing");
    }

    await interaction.deferReply();

    const target = interaction.options.getUser("user") || interaction.user;

    const res = await getUserRank(ctx, target, interaction.guildId);

    if (res.err) {
      logger.error({ err: res.val }, "Failed to get user rank");
      await interaction.editReply(
        getErrorMessage("Failed to get user rank", res.val),
      );

      return;
    }

    const attachment = new AttachmentBuilder(
      Buffer.from(res.safeUnwrap().rankBuffer),
    ).setName("rank.png");

    await interaction.editReply({
      files: [attachment],
    });
  }
}
