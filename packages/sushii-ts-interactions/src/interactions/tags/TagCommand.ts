import { SlashCommandBuilder, EmbedBuilder } from "@discordjs/builders";
import dayjs, { Dayjs } from "dayjs";
import {
  APIChatInputApplicationCommandGuildInteraction,
  MessageFlags,
  PermissionFlagsBits,
} from "discord-api-types/v10";
import { t } from "i18next";
import { Tag } from "../../generated/graphql";
import Context from "../../model/context";
import Color from "../../utils/colors";
import { isNoValuesDeletedError } from "../../utils/graphqlError";
import getInvokerUser from "../../utils/interactions";
import { hasPermission } from "../../utils/permissions";
import { SlashCommandHandler } from "../handlers";
import CommandInteractionOptionResolver from "../resolver";

async function deniedTagPermission(
  ctx: Context,
  interaction: APIChatInputApplicationCommandGuildInteraction,
  tag: Omit<Tag, "nodeId">,
  userID: string,
  memberPermissions: string
): Promise<boolean> {
  const denied =
    tag.ownerId !== userID &&
    !hasPermission(memberPermissions, PermissionFlagsBits.ManageGuild);

  if (denied) {
    await ctx.REST.interactionReply(interaction, {
      content: t("tag.delete.not_owner", {
        ns: "commands",
        tagName: tag.tagName,
      }),
    });
  }

  return denied;
}

export default class TagCommand extends SlashCommandHandler {
  serverOnly = true;

  // /tag add :name :content :attachment?
  // /tag get :name  --autocomplete list startsWith(name)
  // /tag random
  // /tag info :name
  //
  // /tag list     -- paginated embed
  // /tag fulllist -- full option sends a file with all tag names
  //
  // /tag search :contains (autocomplete?) :author -- paginated embed (same as tag list)
  // /tag edit :name :newcontent :newattachment?
  // /tag rename :name :newname
  // /tag delete :name
  command = new SlashCommandBuilder()
    .setName("tag")
    .setDescription("Create and use custom commands with custom responses.")
    .addSubcommand((c) =>
      c
        .setName("add")
        .setDescription("Create a new tag.")
        .addStringOption((o) =>
          o.setName("name").setDescription("The tag name.").setRequired(true)
        )
        // Content / attachment optional, but requires at least one
        .addStringOption((o) =>
          o
            .setName("content")
            .setDescription("The content of the tag.")
            .setRequired(false)
        )
        .addAttachmentOption((o) =>
          o
            .setName("attachment")
            .setDescription("Optional tag attachment.")
            .setRequired(false)
        )
    )
    .addSubcommand((c) =>
      c
        .setName("get")
        .setDescription("Use a tag.")
        .addStringOption((o) =>
          o
            .setName("name")
            .setDescription("The tag name.")
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand((c) =>
      c
        .setName("random")
        .setDescription("Get a random tag.")
        .addStringOption((o) =>
          o
            .setName("name starts with")
            .setDescription("Filter tags name starting with this text.")
            .setRequired(false)
        )
        .addStringOption((o) =>
          o
            .setName("name contains")
            .setDescription("Filter tags name containg this text.")
            .setRequired(false)
        )
        .addUserOption((o) =>
          o
            .setName("author")
            .setDescription("Filter tags created by this user.")
            .setRequired(false)
        )
    )
    .addSubcommand((c) =>
      c
        .setName("info")
        .setDescription("Get information about a tag.")
        .addStringOption((o) =>
          o
            .setName("name")
            .setDescription("The tag name.")
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand((c) => c.setName("list").setDescription("List server tags."))
    .addSubcommand((c) =>
      c
        .setName("fulllist")
        .setDescription("Get a file containing all server tags.")
    )
    .addSubcommand((c) =>
      c
        .setName("search")
        .setDescription("Search for tags.")
        // Both optional
        .addStringOption((o) =>
          o
            .setName("name contains")
            .setDescription("Filter tags containing this text.")
            .setRequired(false)
        )
        .addUserOption((o) =>
          o
            .setName("author")
            .setDescription("Filter tags created by this user.")
            .setRequired(false)
        )
    )
    .addSubcommand((c) =>
      c
        .setName("edit")
        .setDescription("Edit a tag's content.")
        .addStringOption((o) =>
          o
            .setName("name")
            .setDescription("The tag name.")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption((o) =>
          o
            .setName("content")
            .setDescription("The new content of the tag.")
            .setRequired(true)
        )
        .addAttachmentOption((o) =>
          o
            .setName("attachment")
            .setDescription("Optional tag attachment.")
            .setRequired(false)
        )
    )
    .addSubcommand((c) =>
      c
        .setName("rename")
        .setDescription("Rename a tag.")
        .addStringOption((o) =>
          o
            .setName("name")
            .setDescription("The tag name.")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption((o) =>
          o
            .setName("new_name")
            .setDescription("The new name of the tag.")
            .setRequired(true)
        )
    )
    .addSubcommand((c) =>
      c
        .setName("delete")
        .setDescription("Delete a tag.")
        .addStringOption((o) =>
          o
            .setName("name")
            .setDescription("The tag name.")
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
        return TagCommand.addHandler(ctx, interaction, options);
      case "get":
        return TagCommand.getHandler(ctx, interaction, options);
      case "random":
        return TagCommand.randomHandler(ctx, interaction, options);
      case "info":
        return TagCommand.infoHandler(ctx, interaction, options);
      case "list":
        return TagCommand.listHandler(ctx, interaction);
      case "fulllist":
        return TagCommand.fulllistHandler(ctx, interaction);
      case "search":
        return TagCommand.searchHandler(ctx, interaction, options);
      case "edit":
        return TagCommand.editHandler(ctx, interaction, options);
      case "rename":
        return TagCommand.renameHandler(ctx, interaction, options);
      case "delete":
        return TagCommand.deleteHandler(ctx, interaction, options);

      default:
        throw new Error("Invalid subcommand.");
    }
  }

  static async addHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    const tagName = options.getString("name");
    if (!tagName) {
      throw new Error("Missing tag name");
    }

    const tagContent = options.getString("content");
    const tagAttachment = options.getAttachment("attachment");

    if (!tagContent && !tagAttachment) {
      return ctx.REST.interactionReply(interaction, {
        embeds: [
          new EmbedBuilder()
            .setDescription(
              t("tag.add.missing_content_and_attachment", { ns: "commands" })
            )
            .setColor(Color.Error)
            .toJSON(),
        ],
      });
    }

    const content = tagContent || tagAttachment?.url;
    if (!content) {
      throw new Error("Missing tag content or attachment, should not happen.");
    }

    const invoker = getInvokerUser(interaction);

    await ctx.sushiiAPI.sdk.createTag({
      tag: {
        tagName,
        content,
        created: dayjs().toISOString(),
        guildId: interaction.guild_id,
        ownerId: invoker.id,
        useCount: "0",
      },
    });

    const embed = new EmbedBuilder()
      .setTitle(t("tag.add.success_title", { ns: "commands", tagName }))
      .setDescription(content)
      .setColor(Color.Success);

    await ctx.REST.interactionReply(interaction, {
      embeds: [embed.toJSON()],
    });
  }

  static async getHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    const tagName = options.getString("name");
    if (!tagName) {
      throw new Error("Missing tag name");
    }

    const tag = await ctx.sushiiAPI.sdk.getTag({
      guildId: interaction.guild_id,
      tagName,
    });

    if (!tag.tagByGuildIdAndTagName) {
      return ctx.REST.interactionReply(interaction, {
        embeds: [
          new EmbedBuilder()
            .setDescription(t("tag.get.not_found", { ns: "commands", tagName }))
            .setColor(Color.Error)
            .toJSON(),
        ],
      });
    }

    await ctx.REST.interactionReply(interaction, {
      content: tag.tagByGuildIdAndTagName.content,
      // No pings in tags
      allowed_mentions: {
        parse: [],
      },
    });
  }

  static async infoHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    const tagName = options.getString("name");
    if (!tagName) {
      throw new Error("Missing tag name");
    }

    const tag = await ctx.sushiiAPI.sdk.getTag({
      guildId: interaction.guild_id,
      tagName,
    });

    if (!tag.tagByGuildIdAndTagName) {
      return ctx.REST.interactionReply(interaction, {
        embeds: [
          new EmbedBuilder()
            .setDescription(
              t("tag.get.error.not_found", { ns: "commands", tagName })
            )
            .setColor(Color.Error)
            .toJSON(),
        ],
      });
    }

    const embed = new EmbedBuilder()
      .setTitle(t("tag.info.success.title", { ns: "commands", tagName }))
      .setColor(Color.Info)
      .setFields(
        {
          name: t("tag.info.success.content", { ns: "commands" }),
          value: tag.tagByGuildIdAndTagName.content,
        },
        {
          name: t("tag.info.success.owner", { ns: "commands" }),
          value: tag.tagByGuildIdAndTagName.ownerId,
        },
        {
          name: t("tag.info.success.use_count", { ns: "commands" }),
          value: tag.tagByGuildIdAndTagName.useCount,
        }
      )
      .setTimestamp(dayjs(tag.tagByGuildIdAndTagName.created).toDate());

    await ctx.REST.interactionReply(interaction, {
      embeds: [embed.toJSON()],
    });
  }

  static async fulllistHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction
  ): Promise<void> {
    const tags = await ctx.sushiiAPI.sdk.listGuildTags({
      guildId: interaction.guild_id,
    });

    if (!tags.allTags) {
      // Empty tags should still return empty array
      throw new Error("Failed to fetch tags.");
    }

    const { edges, totalCount } = tags.allTags;

    const tagNames = edges.map((edge) => edge.node.tagName);

    await ctx.REST.interactionReply(
      interaction,
      {
        content: t("tag.fulllist.message_content", {
          ns: "commands",
          count: totalCount,
        }),
        attachments: [
          {
            id: "0",
            description: t("tag.fulllist.file_description", {
              ns: "commands",
            }),
            filename: t("tag.fulllist.file_name", { ns: "commands" }),
          },
        ],
      },
      [
        {
          fileName: t("tag.fulllist.file_name", { ns: "commands" }),
          fileData: tagNames.join("\n"),
        },
      ]
    );
  }

  static async deleteHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    const tagName = options.getString("name");
    if (!tagName) {
      throw new Error("Missing tag name.");
    }

    const tag = await ctx.sushiiAPI.sdk.getTag({
      guildId: interaction.guild_id,
      tagName,
    });

    // Check if tag exists
    if (!tag.tagByGuildIdAndTagName) {
      return ctx.REST.interactionReply(interaction, {
        content: t("tag.delete.not_found", {
          ns: "commands",
          tagName,
        }),
      });
    }

    const invoker = getInvokerUser(interaction);

    // Check if owner or manage guild perms
    if (
      await deniedTagPermission(
        ctx,
        interaction,
        tag.tagByGuildIdAndTagName,
        invoker.id,
        interaction.member.permissions
      )
    ) {
      return;
    }

    await ctx.sushiiAPI.sdk.deleteTag({
      guildId: interaction.guild_id,
      tagName,
    });

    const embed = new EmbedBuilder()
      .setTitle(t("tag.delete.title", { ns: "commands", tagName }))
      .setFields(
        {
          name: t("tag.info.success.content", { ns: "commands" }),
          value: tag.tagByGuildIdAndTagName.content,
        },
        {
          name: t("tag.info.success.owner", { ns: "commands" }),
          value: tag.tagByGuildIdAndTagName.ownerId,
        },
        {
          name: t("tag.info.success.use_count", { ns: "commands" }),
          value: tag.tagByGuildIdAndTagName.useCount,
        }
      )
      .setColor(Color.Success);

    await ctx.REST.interactionReply(interaction, {
      embeds: [embed.toJSON()],
      flags: MessageFlags.Ephemeral,
    });
  }
}
