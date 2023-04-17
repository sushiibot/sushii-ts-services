import {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import { MessageFlags, PermissionFlagsBits } from "discord-api-types/v10";
import { t } from "i18next";
import Context from "../../model/context";
import Color from "../../utils/colors";
import { SlashCommandHandler } from "../handlers";

export default class WelcomeCommand extends SlashCommandHandler {
  serverOnly = true;

  command = new SlashCommandBuilder()
    .setName("welcome")
    .setDescription("Set a welcome message when a member joins.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addStringOption((o) =>
      o
        .setName("message")
        .setDescription(
          "Message to send, you can use <username>, <mention>, <server>, <member_number>"
        )
        .setRequired(true)
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

    const message = interaction.options.getString("message", true);

    const hasManageGuild = interaction.member.permissions.has(
      PermissionFlagsBits.ManageGuild
    );

    if (!hasManageGuild) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(
              t("generic.error.no_permissions", {
                ns: "commands",
                permissions: "Manage Guild",
              })
            )
            .setDescription(message)
            .setColor(Color.Error)
            .toJSON(),
        ],
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    await ctx.sushiiAPI.sdk.updateGuildConfig({
      id: interaction.guildId,
      patch: {
        joinMsg: message,
      },
    });

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(t("welcome.success.title", { ns: "commands" }))
          .setDescription(message)
          .setColor(Color.Success)
          .toJSON(),
      ],
    });
  }
}
