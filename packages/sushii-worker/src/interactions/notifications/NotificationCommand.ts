import {
  SlashCommandBuilder,
  EmbedBuilder,
  MessageFlags,
  ChatInputCommandInteraction,
  ChannelType,
} from "discord.js";
import { t } from "i18next";
import Context from "../../model/context";
import Color from "../../utils/colors";
import { SlashCommandHandler } from "../handlers";
import db from "../../model/db";
import {
  deleteNotification,
  insertNotification,
  listNotifications,
} from "../../db/Notification/Notification.repository";
import {
  deleteNotificationBlock,
  getNotificationBlocks,
  insertNotificationBlock,
} from "../../db/Notification/NotificationBlock.repository";
import { NotificationBlockRow } from "../../db/Notification/NotificationBlock.table";

const ID_REGEX = /\d{17,20}/g;

enum NotificationCommandName {
  Add = "add",
  List = "list",
  Delete = "delete",
  Block = "block",
  BlockChannel = "channel",
  BlockUser = "user",
  Blocklist = "blocklist",
  Unblock = "unblock",
}

export default class NotificationCommand extends SlashCommandHandler {
  serverOnly = true;

  command = new SlashCommandBuilder()
    .setName("notification")
    .setDescription("Get notifications when someone says something.")
    .setDMPermission(false)
    .addSubcommand((c) =>
      c
        .setName(NotificationCommandName.Add)
        .setDescription("Set a new notification.")
        .addStringOption((o) =>
          o
            .setName("keyword")
            .setDescription("The keyword to notify you when mentioned.")
            .setRequired(true)
            .setMinLength(3)
            .setMaxLength(100),
        ),
    )
    .addSubcommand((c) =>
      c
        .setName(NotificationCommandName.List)
        .setDescription("List all of your current notifications."),
    )
    .addSubcommand((c) =>
      c
        .setName(NotificationCommandName.Delete)
        .setDescription("Delete a notification.")
        .addStringOption((o) =>
          o
            .setName("keyword")
            .setDescription("The keyword to delete.")
            .setRequired(true)
            .setAutocomplete(true),
        ),
    )
    .addSubcommandGroup((g) =>
      g
        .setName(NotificationCommandName.Block)
        .setDescription("Block notifications from a channel or user.")
        .addSubcommand((c) =>
          c
            .setName(NotificationCommandName.BlockChannel)
            .setDescription("Block a channel from triggering notifications.")
            .addChannelOption((o) =>
              o
                .setName("channel")
                .setDescription(
                  "The channel to block, either a specific one or an entire category.",
                )
                .setRequired(true),
            ),
        )
        .addSubcommand((c) =>
          c
            .setName(NotificationCommandName.BlockUser)
            .setDescription("Block a user from triggering your notifications.")
            .addUserOption((o) =>
              o
                .setName("user")
                .setDescription("The user to block.")
                .setRequired(true),
            ),
        ),
    )
    .addSubcommand((c) =>
      c
        .setName(NotificationCommandName.Blocklist)
        .setDescription("List all blocked channels and users."),
    )
    .addSubcommand((c) =>
      c
        .setName(NotificationCommandName.Unblock)
        .setDescription("Unblock a channel or user from sending notifications.")
        .addStringOption((o) =>
          o
            .setName("block_id")
            .setDescription(
              "Block ID to remove, copied from /notification blocklist",
            )
            .setRequired(true),
        ),
    )
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Guild not cached");
    }

    const subgroup = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();

    switch (subgroup) {
      case NotificationCommandName.Block:
        switch (subcommand) {
          case NotificationCommandName.BlockChannel:
            return NotificationCommand.blockChannelHandler(ctx, interaction);
          case NotificationCommandName.BlockUser:
            return NotificationCommand.blockUserHandler(ctx, interaction);
          default:
            throw new Error("Invalid subcommand.");
        }
      default:
      // No group - base commands below
    }

    switch (subcommand) {
      case NotificationCommandName.Add:
        return NotificationCommand.addHandler(ctx, interaction);
      case NotificationCommandName.List:
        return NotificationCommand.listHandler(ctx, interaction);
      case NotificationCommandName.Delete:
        return NotificationCommand.deleteHandler(ctx, interaction);

      // Blocks
      case NotificationCommandName.Blocklist:
        return NotificationCommand.blocklistHandler(ctx, interaction);
      case NotificationCommandName.Unblock:
        return NotificationCommand.unblockHandler(ctx, interaction);

      default:
        throw new Error("Invalid subcommand.");
    }
  }

  static async addHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const keyword = interaction.options.getString("keyword", true);

    const res = await insertNotification(
      db,
      interaction.guildId,
      interaction.user.id,
      keyword,
    );

    if (Number(res.numInsertedOrUpdatedRows) === 0) {
      const embed = new EmbedBuilder()
        .setTitle("Failed to add notification")
        .setDescription(
          `You already have a notification set for \`${keyword}\``,
        )
        .setColor(Color.Error);

      await interaction.reply({
        embeds: [embed],
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
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const notifications = await listNotifications(
      db,
      interaction.guildId,
      interaction.user.id,
    );

    const keywords = notifications.map((n) => n.keyword);

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
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const keyword = interaction.options.getString("keyword", true);

    const deleted = await deleteNotification(
      db,
      interaction.guildId,
      interaction.user.id,
      keyword,
    );

    if (deleted.numDeletedRows === BigInt(0)) {
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

  static async blockChannelHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const channel = interaction.options.getChannel("channel", true);

    const isCategory = channel.type === ChannelType.GuildCategory;

    const { numInsertedOrUpdatedRows } = await insertNotificationBlock(
      db,
      interaction.user.id,
      channel.id,
      isCategory ? "category" : "channel",
    );

    if (Number(numInsertedOrUpdatedRows) === 0) {
      const embed = new EmbedBuilder()
        .setTitle("Failed to block channel")
        .setDescription("You already have this channel  blocked.")
        .setColor(Color.Error);

      await interaction.reply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral,
      });
    }

    let desc = `You will no longer receive notifications from ${channel.toString()}`;

    if (isCategory) {
      desc +=
        "\n\n**Note:** This is a category and all channels in it will be blocked.";
    }

    const embed = new EmbedBuilder()
      .setTitle("Blocked channel")
      .setDescription(desc)
      .setColor(Color.Success);

    await interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral,
    });
  }

  static async blockUserHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const user = interaction.options.getUser("user", true);

    const { numInsertedOrUpdatedRows } = await insertNotificationBlock(
      db,
      interaction.user.id,
      user.id,
      "user",
    );

    if (Number(numInsertedOrUpdatedRows) === 0) {
      const embed = new EmbedBuilder()
        .setTitle("Failed to block user")
        .setDescription("You already have this user blocked.")
        .setColor(Color.Error);

      await interaction.reply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral,
      });
    }

    const embed = new EmbedBuilder()
      .setTitle("Blocked user")
      .setDescription(
        `You will no longer receive notifications from ${user.toString()}`,
      )
      .setColor(Color.Success);

    await interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral,
    });
  }

  static async blocklistHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const blocks = await getNotificationBlocks(db, interaction.user.id);

    if (!blocks || blocks.length === 0) {
      const embed = new EmbedBuilder()
        .setTitle("No blocked channels or users")
        .setDescription("You have no channels or users blocked.")
        .setColor(Color.Info);

      await interaction.reply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    const blocksGrouped = Map.groupBy(blocks, (block) => block.block_type);

    const blockedUsers = blocksGrouped.get("user");
    const blockedChannels = blocksGrouped.get("channel");
    const blockedCategories = blocksGrouped.get("category");

    const fmtBlock = (block: NotificationBlockRow): string => {
      if (block.block_type === "user") {
        return `ID: \`${block.block_id}\` - <@${block.block_id}>`;
      }

      return `ID: \`${block.block_id}\` - <#${block.block_id}>`;
    };

    const blockedUsersStr = blockedUsers?.map(fmtBlock);
    const blockedChannelsStr = blockedChannels?.map(fmtBlock);
    let blockedCategoriesStr = blockedCategories?.map(fmtBlock);

    if (blockedCategoriesStr) {
      blockedCategoriesStr.push(
        "\n**Note:** All channels within these categories are blocked.",
      );
    } else {
      blockedCategoriesStr = [
        "**Note:** All channels in categories are blocked.",
      ];
    }

    const fields = [
      {
        name: "Blocked users",
        value: blockedUsersStr?.join("\n") || "No users are blocked",
      },
      {
        name: "Blocked channels",
        value: blockedChannelsStr?.join("\n") || "No channels are blocked",
      },
      {
        name: "Blocked categories",
        value: blockedCategoriesStr?.join("\n") || "No categories are blocked",
      },
    ];

    const embed = new EmbedBuilder()
      .setTitle("Notification Block List")
      .setFields(fields)
      .setColor(Color.Info);

    await interaction.reply({
      embeds: [embed.toJSON()],
      flags: MessageFlags.Ephemeral,
    });
  }

  static async unblockHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const blockStr = interaction.options.getString("block_id", true);
    const match = blockStr.match(ID_REGEX);

    if (!match) {
      const embed = new EmbedBuilder()
        .setTitle("Failed to unblock")
        .setDescription(
          "Invalid block. Please paste the block ID from /notification blocklist, or mention a user or channel.",
        )
        .setColor(Color.Error);

      await interaction.reply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    const matchId = match[0];

    const deletedBlock = await deleteNotificationBlock(
      db,
      interaction.user.id,
      matchId,
    );

    if (!deletedBlock) {
      const embed = new EmbedBuilder()
        .setTitle("Failed to unblock")
        .setDescription(
          "You don't have this channel or user blocked. Please paste the block ID from /notification blocklist.",
        )
        .setColor(Color.Error);

      await interaction.reply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    let blockMention;
    if (deletedBlock.block_type === "user") {
      blockMention = `<@${deletedBlock.block_id}>`;
    } else {
      blockMention = `<#${deletedBlock.block_id}>`;
    }

    const embed = new EmbedBuilder()
      .setTitle("Unblocked")
      .setDescription(`You will now receive notifications from ${blockMention}`)
      .setColor(Color.Success);

    await interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral,
    });
  }
}
