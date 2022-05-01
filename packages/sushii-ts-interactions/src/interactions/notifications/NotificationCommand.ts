import { SlashCommandBuilder, EmbedBuilder } from "@discordjs/builders";
import {
  APIChatInputApplicationCommandGuildInteraction,
  MessageFlags,
} from "discord-api-types/v10";
import { t } from "i18next";
import Context from "../../context";
import getInvokerUser from "../../utils/interactions";
import { SlashCommandHandler } from "../handlers";
import CommandInteractionOptionResolver from "../resolver";

export default class NotificationCommand extends SlashCommandHandler {
  serverOnly = true;

  command = new SlashCommandBuilder()
    .setName("notification")
    .setDescription("Get notifications when someone says something.")
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
    interaction: APIChatInputApplicationCommandGuildInteraction
  ): Promise<void> {
    const options = new CommandInteractionOptionResolver(
      interaction.data.options,
      interaction.data.resolved
    );

    const subcommand = options.getSubcommand();
    switch (subcommand) {
      case "add":
        return NotificationCommand.addHandler(ctx, interaction, options);
      case "list":
        return NotificationCommand.listHandler(ctx, interaction);
      case "delete":
        return NotificationCommand.deleteHandler(ctx, interaction, options);

      default:
        throw new Error("Invalid subcommand.");
    }
  }

  static async addHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    const keyword = options.getString("keyword");
    if (!keyword) {
      throw new Error("Missing keyword.");
    }

    const invoker = getInvokerUser(interaction);

    await ctx.sushiiAPI.sdk.createNotification({
      notification: {
        guildId: interaction.guild_id,
        userId: invoker.id,
        keyword,
      },
    });

    const embed = new EmbedBuilder()
      .setTitle("Added notification.")
      .setFields({ name: "Keyword", value: keyword })
      .setColor(0xb5e8e0);

    await ctx.REST.interactionReply(interaction, {
      embeds: [embed.toJSON()],
      flags: MessageFlags.Ephemeral,
    });
  }

  static async listHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction
  ): Promise<void> {
    const invoker = getInvokerUser(interaction);

    const notifications = await ctx.sushiiAPI.sdk.getUserNotifications({
      userId: invoker.id,
    });

    const keywords = notifications.allNotifications?.nodes.map(
      (n) => n.keyword
    );

    if (!keywords || keywords.length === 0) {
      await ctx.REST.interactionReply(interaction, {
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
      .setColor(0xb5e8e0);

    await ctx.REST.interactionReply(interaction, {
      embeds: [embed.toJSON()],
      flags: MessageFlags.Ephemeral,
    });
  }

  static async deleteHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    const keyword = options.getString("keyword");
    if (!keyword) {
      throw new Error("Missing keyword.");
    }

    const invoker = getInvokerUser(interaction);

    const deletedRes = await ctx.sushiiAPI.sdk.deleteNotification({
      guildId: interaction.guild_id,
      userId: invoker.id,
      keyword,
    });

    if (deletedRes.deleteNotificationByUserIdAndGuildIdAndKeyword === null) {
      await ctx.REST.interactionReply(interaction, {
        content: t("notification.delete.not_found", {
          ns: "commands",
          username: keyword,
        }),
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    await ctx.REST.interactionReply(interaction, {
      content: t("notification.delete.success", {
        ns: "commands",
        username: keyword,
      }),
      flags: MessageFlags.Ephemeral,
    });
  }
}
