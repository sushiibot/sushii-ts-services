import { SlashCommandBuilder, EmbedBuilder } from "@discordjs/builders";
import {
  APIChatInputApplicationCommandGuildInteraction,
  PermissionFlagsBits,
} from "discord-api-types/v10";
import Context from "../../model/context";
import Color from "../../utils/colors";
import { SlashCommandHandler } from "../handlers";
import CommandInteractionOptionResolver from "../resolver";

export default class ModLogCommand extends SlashCommandHandler {
  serverOnly = true;

  command = new SlashCommandBuilder()
    .setName("modlog")
    .setDescription("Change modlog settings.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
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
    interaction: APIChatInputApplicationCommandGuildInteraction
  ): Promise<void> {
    const options = new CommandInteractionOptionResolver(
      interaction.data.options,
      interaction.data.resolved
    );

    const subcommand = options.getSubcommand();
    switch (subcommand) {
      case "set":
        return this.setHandler(ctx, interaction, options);
      default:
        throw new Error("Invalid subcommand.");
    }
  }

  async setHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    const channel = options.getChannel("channel");
    if (!channel) {
      throw new Error("missing channel");
    }

    await ctx.sushiiAPI.sdk.updateGuildConfig({
      id: interaction.guild_id,
      patch: {
        logMod: channel.id,
        logModEnabled: true,
      },
    });

    await ctx.REST.interactionReply(interaction, {
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
