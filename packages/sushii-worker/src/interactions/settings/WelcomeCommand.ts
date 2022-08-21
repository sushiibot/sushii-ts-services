import { SlashCommandBuilder, EmbedBuilder } from "@discordjs/builders";
import {
  APIChatInputApplicationCommandGuildInteraction,
  MessageFlags,
  PermissionFlagsBits,
} from "discord-api-types/v10";
import { t } from "i18next";
import Context from "../../model/context";
import Color from "../../utils/colors";
import { hasPermission } from "../../utils/permissions";
import { SlashCommandHandler } from "../handlers";
import CommandInteractionOptionResolver from "../resolver";

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
    interaction: APIChatInputApplicationCommandGuildInteraction
  ): Promise<void> {
    const options = new CommandInteractionOptionResolver(
      interaction.data.options,
      interaction.data.resolved
    );

    const message = options.getString("message");
    if (!message) {
      throw new Error("missing message");
    }

    const hasManageGuild = hasPermission(
      interaction.member.permissions,
      PermissionFlagsBits.ManageGuild
    );

    if (!hasManageGuild) {
      await ctx.REST.interactionReply(interaction, {
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
      id: interaction.guild_id,
      patch: {
        joinMsg: message,
      },
    });

    await ctx.REST.interactionReply(interaction, {
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
