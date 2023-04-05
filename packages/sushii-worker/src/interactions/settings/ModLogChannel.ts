import {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import { PermissionFlagsBits } from "discord-api-types/v10";
import Context from "../../model/context";
import Color from "../../utils/colors";
import { SlashCommandHandler } from "../handlers";

export default class ModLogCommand extends SlashCommandHandler {
  serverOnly = true;

  command = new SlashCommandBuilder()
    .setName("modlog")
    .setDescription("Change modlog settings.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addSubcommand((c) =>
      c.setName("get").setDescription("Get the current moderation log channel.")
    )
    .addSubcommand((c) =>
      c
        .setName("set")
        .setDescription("Set a channel for moderation logs.")
        .addChannelOption((o) =>
          o
            .setName("channel")
            .setDescription("Channel to send mod logs to.")
            .setRequired(true)
        )
    )
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Guild not cached.");
    }

    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case "get":
        return this.getHandler(ctx, interaction);
      case "set":
        return this.setHandler(ctx, interaction);
      default:
        throw new Error("Invalid subcommand.");
    }
  }

  async getHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">
  ): Promise<void> {
    const { guildConfigById } = await ctx.sushiiAPI.sdk.guildConfigByID({
      guildId: interaction.guildId,
    });

    const channelId = guildConfigById?.logMod;
    const modLogSetCmd = ctx.getCommandMention("modlog set");

    const description = channelId
      ? `The mod log is currently set to <#${channelId}>`
      : `There is no mod log set. Use ${modLogSetCmd} to set one.`;

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Mod log")
          .setDescription(description)
          .setColor(Color.Success)
          .toJSON(),
      ],
    });
  }

  async setHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">
  ): Promise<void> {
    const channel = interaction.options.getChannel("channel", true);

    await ctx.sushiiAPI.sdk.updateGuildConfig({
      id: interaction.guildId,
      patch: {
        logMod: channel.id,
        logModEnabled: true,
      },
    });

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Mod log updated")
          .setDescription(`<#${channel.id}>`)
          .setColor(Color.Success)
          .toJSON(),
      ],
    });
  }
}
