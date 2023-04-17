import {
  SlashCommandBuilder,
  EmbedBuilder,
  MessageFlags,
  ChatInputCommandInteraction,
} from "discord.js";
import { t } from "i18next";
import Context from "../../model/context";
import Color from "../../utils/colors";
import {
  isNoValuesDeletedError,
  isUniqueViolation,
} from "../../utils/graphqlError";
import { SlashCommandHandler } from "../handlers";

export default class NotificationCommand extends SlashCommandHandler {
  serverOnly = true;

  command = new SlashCommandBuilder()
    .setName("notification")
    .setDescription("Get notifications when someone says something.")
    .setDMPermission(false)
    .addSubcommand((c) =>
      c
        .setName("add")
        .setDescription("Set a new notification.")
        .addStringOption((o) =>
          o
            .setName("keyword")
            .setDescription("The keyword to notify you when mentioned.")
            .setRequired(true)
        )
    )
    .addSubcommand((c) =>
      c
        .setName("list")
        .setDescription("List all of your current notifications.")
    )
    .addSubcommand((c) =>
      c
        .setName("delete")
        .setDescription("Delete a notification.")
        .addStringOption((o) =>
          o
            .setName("keyword")
            .setDescription("The keyword to delete.")
            .setRequired(true)
            .setAutocomplete(true)
        )
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

    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case "add":
        return NotificationCommand.addHandler(ctx, interaction);
      case "list":
        return NotificationCommand.listHandler(ctx, interaction);
      case "delete":
        return NotificationCommand.deleteHandler(ctx, interaction);

      default:
        throw new Error("Invalid subcommand.");
    }
  }

  static async addHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">
  ): Promise<void> {
    const keyword = interaction.options.getString("keyword", true);

    try {
      await ctx.sushiiAPI.sdk.createNotification({
        notification: {
          guildId: interaction.guildId,
          userId: interaction.user.id,
          keyword,
        },
      });
    } catch (err) {
      if (!isUniqueViolation(err)) {
        throw err;
      }

      await interaction.reply({
        content: t("notification.add.error.duplicate", {
          ns: "commands",
          keyword,
        }),
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("Added notification.")
      .setFields([{ name: "Keyword", value: keyword }])
      .setColor(Color.Success);

    await interaction.reply({
      embeds: [embed.toJSON()],
      flags: MessageFlags.Ephemeral,
    });
  }

  static async listHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">
  ): Promise<void> {
    const notifications = await ctx.sushiiAPI.sdk.getUserNotifications({
      guildId: interaction.guildId,
      userId: interaction.user.id,
    });

    const keywords = notifications.allNotifications?.nodes.map(
      (n) => n.keyword
    );

    if (!keywords || keywords.length === 0) {
      await interaction.reply({
        content: t("notification.list.empty", {
          ns: "commands",
        }),
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(t("notification.list.title", { ns: "commands" }))
      .setDescription(keywords.join("\n"))
      .setColor(Color.Info);

    await interaction.reply({
      embeds: [embed.toJSON()],
      flags: MessageFlags.Ephemeral,
    });
  }

  static async deleteHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">
  ): Promise<void> {
    const keyword = interaction.options.getString("keyword", true);

    try {
      await ctx.sushiiAPI.sdk.deleteNotification({
        guildId: interaction.guildId,
        userId: interaction.user.id,
        keyword,
      });
    } catch (err) {
      if (!isNoValuesDeletedError(err)) {
        throw err;
      }

      // Returns correct error
      await interaction.reply({
        content: t("notification.delete.not_found", {
          ns: "commands",
          keyword,
        }),
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(t("notification.delete.title", { ns: "commands" }))
      .setFields([
        {
          name: t("notification.delete.field_title", { ns: "commands" }),
          value: keyword,
        },
      ])
      .setColor(Color.Success);

    await interaction.reply({
      embeds: [embed.toJSON()],
      flags: MessageFlags.Ephemeral,
    });
  }
}
