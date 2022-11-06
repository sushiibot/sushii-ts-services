import { SlashCommandBuilder, EmbedBuilder } from "@discordjs/builders";
import { RawFile } from "@discordjs/rest";
import dayjs from "dayjs";
import {
  APIAttachment,
  APIChatInputApplicationCommandGuildInteraction,
  APIEmbedField,
  MessageFlags,
  PermissionFlagsBits,
} from "discord-api-types/v10";
import { t } from "i18next";
import fetch from "node-fetch";
import { Err, Ok, Result } from "ts-results";
import { Tag, TagFilter } from "../../generated/graphql";
import Context from "../../model/context";
import Color from "../../utils/colors";
import getInvokerUser from "../../utils/interactions";
import { hasPermission } from "../../utils/permissions";
import { SlashCommandHandler } from "../handlers";
import CommandInteractionOptionResolver from "../resolver";
import { interactionReplyErrorMessage } from "../responses/error";

const NAME_STARTS_WITH = "name_starts_with";
const NAME_CONTAINS = "name_contains";

interface TagUpdateData {
  fields: APIEmbedField[];
  files: RawFile[];
}

async function getFieldsAndFiles(
  newContent: string | undefined,
  newAttachment: APIAttachment | undefined
): Promise<Result<TagUpdateData, string>> {
  const fields = [];
  const files: RawFile[] = [];

  if (newContent) {
    fields.push({
      name: t("tag.edit.success.content", { ns: "commands" }),
      value: newContent,
    });
  }

  if (newAttachment) {
    fields.push({
      name: t("tag.edit.success.attachment", { ns: "commands" }),
      value: newAttachment.url,
    });

    try {
      const fileData = await fetch(newAttachment.url).then((res) =>
        res.buffer()
      );

      files.push({
        fileData,
        fileName: newAttachment.filename,
      });
    } catch (err) {
      return Err(t("tag.edit.error.attachment_fetch", { ns: "commands" }));
    }
  }

  return Ok({ fields, files });
}

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
  // /tag search :contains (autocomplete?) :owner -- paginated embed (same as tag list)
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
            .setName(NAME_STARTS_WITH)
            .setDescription("Filter tags name starting with this text.")
            .setRequired(false)
        )
        .addStringOption((o) =>
          o
            .setName(NAME_CONTAINS)
            .setDescription("Filter tags name containing this text.")
            .setRequired(false)
        )
        .addUserOption((o) =>
          o
            .setName("owner")
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
    .addSubcommand((c) =>
      c.setName("list").setDescription("Get all server tags.")
    )
    .addSubcommand((c) =>
      c
        .setName("search")
        .setDescription("Search for tags.")
        // All optional but requires at least one
        .addStringOption((o) =>
          o
            .setName(NAME_STARTS_WITH)
            .setDescription("Filter tags name starting with this text.")
            .setRequired(false)
        )
        .addStringOption((o) =>
          o
            .setName(NAME_CONTAINS)
            .setDescription("Filter tags containing this text.")
            .setRequired(false)
        )
        .addUserOption((o) =>
          o
            .setName("owner")
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
        // Requires at least one
        .addStringOption((o) =>
          o
            .setName("content")
            .setDescription("The new content of the tag.")
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

    const tagContent = options.getString("content") || "";
    const tagAttachment = options.getAttachment("attachment");

    if (!tagContent && !tagAttachment) {
      await ctx.REST.interactionReply(interaction, {
        embeds: [
          new EmbedBuilder()
            .setDescription(
              t("tag.add.error.missing_content_and_attachment", {
                ns: "commands",
              })
            )
            .setColor(Color.Error)
            .toJSON(),
        ],
      });

      return;
    }

    const invoker = getInvokerUser(interaction);

    const tagExistsRes = await ctx.sushiiAPI.sdk.getTag({
      guildId: interaction.guild_id,
      tagName,
    });

    if (tagExistsRes.tagByGuildIdAndTagName) {
      await ctx.REST.interactionReply(interaction, {
        embeds: [
          new EmbedBuilder()
            .setTitle(t("tag.add.error.failed_title", { ns: "commands" }))
            .setDescription(
              t("tag.add.error.already_exists_description", {
                ns: "commands",
                tagName,
              })
            )
            .setColor(Color.Error)
            .toJSON(),
        ],
      });

      return;
    }

    const embedDataRes = await getFieldsAndFiles(tagContent, tagAttachment);
    if (embedDataRes.err) {
      await interactionReplyErrorMessage(ctx, interaction, embedDataRes.val);

      return;
    }

    const { fields, files } = embedDataRes.val;

    const embed = new EmbedBuilder()
      .setTitle(t("tag.add.success.title", { ns: "commands", tagName }))
      .setFields(fields)
      .setColor(Color.Success);

    await ctx.REST.interactionReply(
      interaction,
      {
        embeds: [embed.toJSON()],
      },
      files
    );

    let attachmentUrl;
    if (tagAttachment) {
      const replyMsg = await ctx.REST.interactionGetOriginal(interaction);

      if (replyMsg.ok) {
        attachmentUrl = replyMsg.val.attachments.at(0)?.url;
      } else {
        // Return err

        await ctx.REST.interactionEdit(interaction, {
          embeds: [
            new EmbedBuilder()
              .setColor(Color.Error)
              .setTitle(
                t("tag.add.error.failed_title", {
                  ns: "commands",
                })
              )
              .setDescription(
                t("tag.add.error.failed_get_original_message", {
                  ns: "commands",
                })
              )
              .toJSON(),
          ],
        });

        return;
      }
    }

    await ctx.sushiiAPI.sdk.createTag({
      tag: {
        tagName,
        content: tagContent,
        attachment: attachmentUrl,
        created: dayjs().toISOString(),
        guildId: interaction.guild_id,
        ownerId: invoker.id,
        useCount: "0",
      },
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
      await ctx.REST.interactionReply(interaction, {
        embeds: [
          new EmbedBuilder()
            .setDescription(t("tag.get.not_found", { ns: "commands", tagName }))
            .setColor(Color.Error)
            .toJSON(),
        ],
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    let { content } = tag.tagByGuildIdAndTagName;

    if (tag.tagByGuildIdAndTagName.attachment) {
      content += tag.tagByGuildIdAndTagName.attachment;
    }

    // const embed = new EmbedBuilder()
    //   .setTitle(tag.tagByGuildIdAndTagName.tagName)
    //   .setDescription(content)
    //   .setColor(Color.Info)
    //   .setImage(tag.tagByGuildIdAndTagName.attachment || null);

    await ctx.REST.interactionReply(interaction, {
      // embeds: [embed.toJSON()],
      content,
      // Allowedmentions not required, no pings in embed
      allowed_mentions: {
        parse: [],
      },
    });
  }

  static async randomHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    const startsWith = options.getString(NAME_STARTS_WITH);
    const contains = options.getString(NAME_CONTAINS);
    const owner = options.getUser("owner");

    // startsWith xor contains
    if (startsWith && contains) {
      await ctx.REST.interactionReply(interaction, {
        embeds: [
          new EmbedBuilder()
            .setTitle(t("tag.random.error.title", { ns: "commands" }))
            .setDescription(
              t("tag.random.error.starts_with_contains_xor", { ns: "commands" })
            )
            .setColor(Color.Error)
            .toJSON(),
        ],
      });

      return;
    }

    const tag = await ctx.sushiiAPI.sdk.getRandomTag({
      guildId: interaction.guild_id,
      ownerId: owner?.id,
      startsWith: !!startsWith,
      query: startsWith || contains,
    });

    if (!tag.randomTag) {
      await ctx.REST.interactionReply(interaction, {
        embeds: [
          new EmbedBuilder()
            .setTitle(t("tag.random.error.title", { ns: "commands" }))
            .setDescription(t("tag.random.error.not_found", { ns: "commands" }))
            .setColor(Color.Error)
            .toJSON(),
        ],
      });

      return;
    }

    let content;
    const { content: tagContent, attachment, tagName } = tag.randomTag;

    content = `${tagName}: ${tagContent}`;

    if (attachment) {
      content += attachment;
    }

    await ctx.REST.interactionReply(interaction, {
      content,
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
      await ctx.REST.interactionReply(interaction, {
        embeds: [
          new EmbedBuilder()
            .setDescription(
              t("tag.get.error.not_found", { ns: "commands", tagName })
            )
            .setColor(Color.Error)
            .toJSON(),
        ],
      });

      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(t("tag.info.success.title", { ns: "commands", tagName }))
      .setColor(Color.Info)
      .setFields([
        {
          name: t("tag.info.success.content", { ns: "commands" }),
          value: tag.tagByGuildIdAndTagName.content,
        },
        {
          name: t("tag.info.success.owner", { ns: "commands" }),
          value: `<@${tag.tagByGuildIdAndTagName.ownerId}>`,
        },
        {
          name: t("tag.info.success.use_count", { ns: "commands" }),
          value: tag.tagByGuildIdAndTagName.useCount,
        },
      ])
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
        content: t("tag.fulllist.success.message_content", {
          ns: "commands",
          count: totalCount,
        }),
        attachments: [
          {
            id: "0",
            description: t("tag.fulllist.success.file_description", {
              ns: "commands",
            }),
            filename: t("tag.fulllist.success.file_name", { ns: "commands" }),
          },
        ],
      },
      [
        {
          fileName: t("tag.fulllist.success.file_name", { ns: "commands" }),
          fileData: tagNames.join("\n"),
        },
      ]
    );
  }

  static async searchHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    const startsWith = options.getString(NAME_STARTS_WITH);
    const contains = options.getString(NAME_CONTAINS);
    const owner = options.getUser("owner");

    if (!startsWith && !contains && !owner) {
      await ctx.REST.interactionReply(interaction, {
        embeds: [
          new EmbedBuilder()
            .setTitle(t("tag.search.error.title", { ns: "commands" }))
            .setDescription(
              t("tag.search.error.no_options", { ns: "commands" })
            )
            .setColor(Color.Error)
            .toJSON(),
        ],
      });

      return;
    }

    // startsWith xor contains
    if (startsWith && contains) {
      await ctx.REST.interactionReply(interaction, {
        embeds: [
          new EmbedBuilder()
            .setTitle(t("tag.search.error.title", { ns: "commands" }))
            .setDescription(
              t("tag.search.error.starts_with_contains_xor", { ns: "commands" })
            )
            .setColor(Color.Error)
            .toJSON(),
        ],
      });

      return;
    }

    let filter: TagFilter | undefined;

    if (startsWith || contains) {
      filter = {
        tagName: {
          includesInsensitive: contains,
          startsWithInsensitive: startsWith,
        },
      };
    }

    const tags = await ctx.sushiiAPI.sdk.searchTags({
      guildId: interaction.guild_id,
      ownerId: owner?.id,
      filter,
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
        content: t("tag.search.success.message_content", {
          ns: "commands",
          count: totalCount,
        }),
        attachments: [
          {
            id: "0",
            description: t("tag.search.success.file_description", {
              ns: "commands",
            }),
            filename: t("tag.search.success.file_name", { ns: "commands" }),
          },
        ],
      },
      [
        {
          fileName: t("tag.search.success.file_name", { ns: "commands" }),
          fileData: tagNames.join("\n"),
        },
      ]
    );
  }

  static async editHandler(
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
      await ctx.REST.interactionReply(interaction, {
        content: t("tag.edit.error.not_found", {
          ns: "commands",
          tagName,
        }),
      });

      return;
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

    const newContent = options.getString("content");
    const newAttachment = options.getAttachment("attachment");

    if (!newContent && !newAttachment) {
      await ctx.REST.interactionReply(interaction, {
        embeds: [
          new EmbedBuilder()
            .setTitle(t("tag.edit.error.title", { ns: "commands" }))
            .setDescription(t("tag.edit.error.no_options", { ns: "commands" }))
            .setColor(Color.Error)
            .toJSON(),
        ],
      });

      return;
    }

    const embedDataRes = await getFieldsAndFiles(newContent, newAttachment);
    if (embedDataRes.err) {
      await interactionReplyErrorMessage(ctx, interaction, embedDataRes.val);

      return;
    }

    const { fields, files } = embedDataRes.val;

    const embed = new EmbedBuilder()
      .setTitle(t("tag.edit.success.title", { ns: "commands", tagName }))
      .setFields(fields)
      .setImage(newAttachment?.url || null)
      .setColor(Color.Success)
      .setFooter(
        newAttachment
          ? {
              text: t("tag.edit.success.footer", { ns: "commands" }),
            }
          : null
      );

    await ctx.REST.interactionReply(
      interaction,
      {
        embeds: [embed.toJSON()],
      },
      files
    );

    let attachmentUrl;
    if (newAttachment) {
      const replyMsg = await ctx.REST.interactionGetOriginal(interaction);

      if (replyMsg.ok) {
        attachmentUrl = replyMsg.val.attachments.at(0)?.url;
      } else {
        // Return err

        await ctx.REST.interactionEdit(interaction, {
          embeds: [
            new EmbedBuilder()
              .setColor(Color.Error)
              .setTitle(
                t("tag.edit.error.failed_title", {
                  ns: "commands",
                })
              )
              .setDescription(
                t("tag.edit.error.failed_get_original_message", {
                  ns: "commands",
                })
              )
              .toJSON(),
          ],
        });

        return;
      }
    }

    // Save the attachment url of the reply message, not the interaction
    // attachment. Interaction attachment is ephemeral
    await ctx.sushiiAPI.sdk.updateTag({
      tagPatch: {
        content: newContent,
        attachment: attachmentUrl,
      },
      guildId: interaction.guild_id,
      tagName,
    });
  }

  static async renameHandler(
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
      await ctx.REST.interactionReply(interaction, {
        content: t("tag.edit.error.not_found", {
          ns: "commands",
          tagName,
        }),
      });

      return;
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

    const newName = options.getString("new_name");
    if (!newName) {
      throw new Error("Missing new tag name.");
    }

    // Check if new name tag already exists
    const tagExists = await ctx.sushiiAPI.sdk.getTag({
      guildId: interaction.guild_id,
      tagName: newName,
    });

    if (tagExists.tagByGuildIdAndTagName) {
      await ctx.REST.interactionReply(interaction, {
        embeds: [
          new EmbedBuilder()
            .setTitle(t("tag.rename.error.failed_title", { ns: "commands" }))
            .setDescription(
              t("tag.rename.error.already_exists_description", {
                ns: "commands",
                tagName,
              })
            )
            .setColor(Color.Error)
            .toJSON(),
        ],
      });

      return;
    }

    // Rename tag, possible failure if tag name already exists, but rare enough
    // race condition to ignore -- should error anyways.
    await ctx.sushiiAPI.sdk.updateTag({
      tagPatch: {
        tagName: newName,
      },
      guildId: interaction.guild_id,
      tagName,
    });

    const embed = new EmbedBuilder()
      .setTitle(t("tag.rename.success.title", { ns: "commands", tagName }))
      .setFields([
        {
          name: t("tag.rename.success.new_name", { ns: "commands" }),
          value: newName,
        },
      ])
      .setColor(Color.Success);

    await ctx.REST.interactionReply(interaction, {
      embeds: [embed.toJSON()],
    });
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
      await ctx.REST.interactionReply(interaction, {
        content: t("tag.delete.error.not_found", {
          ns: "commands",
          tagName,
        }),
      });

      return;
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
      .setTitle(t("tag.delete.success.title", { ns: "commands", tagName }))
      .setFields([
        {
          name: t("tag.delete.success.content", { ns: "commands" }),
          value: tag.tagByGuildIdAndTagName.content || "No content",
        },
        {
          name: t("tag.delete.success.owner", { ns: "commands" }),
          value: `<@${tag.tagByGuildIdAndTagName.ownerId}>`,
        },
        {
          name: t("tag.delete.success.use_count", { ns: "commands" }),
          value: tag.tagByGuildIdAndTagName.useCount,
        },
      ])
      .setTimestamp(dayjs(tag.tagByGuildIdAndTagName.created).toDate())
      .setColor(Color.Success);

    await ctx.REST.interactionReply(interaction, {
      embeds: [embed.toJSON()],
    });
  }
}
