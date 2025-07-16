import {
  SlashCommandBuilder,
  EmbedBuilder,
  Attachment,
  AttachmentBuilder,
  ChatInputCommandInteraction,
  GuildMember,
  InteractionContextType,
} from "discord.js";
import dayjs from "@/shared/domain/dayjs";
import { APIEmbedField, MessageFlags, PermissionFlagsBits } from "discord.js";
import { t } from "i18next";
import { Err, Ok, Result } from "ts-results";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import Context from "../../model/context";
import Color from "../../utils/colors";
import { SlashCommandHandler } from "../handlers";
import {
  interactionReplyError,
  interactionReplyErrorMessage,
} from "../responses/error";
import db from "../../infrastructure/database/db";
import {
  deleteTag,
  getRandomTag,
  getTag,
  incrementTagUseCount,
  listTags,
  searchTags,
  upsertTag,
} from "../../db/Tag/Tab.repository";
import { TagRow } from "../../db/Tag/Tag.table";
import Paginator from "@/shared/presentation/Paginator";

const NAME_STARTS_WITH = "name_starts_with";
const NAME_CONTAINS = "name_contains";

const VALID_TAG_NAME_REGEX = /^[a-z0-9_-]+$/i;

interface TagUpdateData {
  fields: APIEmbedField[];
  files: AttachmentBuilder[];
}

const tagNameSchema = z
  .string()
  .trim()
  .min(1, {
    message: "Tag name is too short. Tag names must be 1 character or more.",
  })
  .max(32, {
    message: "Tag name is too long. Tag names must be 32 characters or less.",
  })
  .regex(VALID_TAG_NAME_REGEX, {
    message:
      "Tag name contains invalid characters. Only lowercase letters, numbers, and symbols _ and -",
  });

function verifyTagName(tagName: string): Result<string, string> {
  const res = tagNameSchema.safeParse(tagName);

  if (!res.success) {
    const err = fromZodError(res.error, {
      prefix: null,
    });

    return Err(err.message);
  }

  return Ok(res.data);
}

async function getFieldsAndFiles(
  newContent: string | null,
  newAttachment: Attachment | null,
): Promise<Result<TagUpdateData, string>> {
  const fields = [];
  const files: AttachmentBuilder[] = [];

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
      const file = await fetch(newAttachment.url);
      const buf = await file.arrayBuffer();

      const attachment = new AttachmentBuilder(Buffer.from(buf)).setName(
        newAttachment.name,
      );

      files.push(attachment);
    } catch (err) {
      return Err("Failed to fetch attachment from Discord.");
    }
  }

  return Ok({ fields, files });
}

async function deniedTagPermission(
  ctx: Context,
  interaction: ChatInputCommandInteraction,
  tag: TagRow,
  userID: string,
  member: GuildMember,
): Promise<boolean> {
  const denied =
    tag.owner_id !== userID &&
    !member.permissions.has(PermissionFlagsBits.ManageGuild);

  if (denied) {
    await interaction.reply({
      content: t("tag.delete.not_owner", {
        ns: "commands",
        tagName: tag.tag_name,
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
    .setContexts(InteractionContextType.Guild)
    .addSubcommand((c) =>
      c
        .setName("add")
        .setDescription("Create a new tag.")
        .addStringOption((o) =>
          o
            .setName("name")
            .setDescription("The tag name.")
            .setRequired(true)
            .setMinLength(1)
            .setMaxLength(32),
        )
        // Content / attachment optional, but requires at least one
        .addStringOption((o) =>
          o
            .setName("content")
            .setDescription("The content of the tag.")
            .setRequired(false),
        )
        .addAttachmentOption((o) =>
          o
            .setName("attachment")
            .setDescription("Optional tag attachment.")
            .setRequired(false),
        ),
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
            .setAutocomplete(true),
        ),
    )
    .addSubcommand((c) =>
      c
        .setName("random")
        .setDescription("Get a random tag.")
        .addStringOption((o) =>
          o
            .setName(NAME_STARTS_WITH)
            .setDescription("Filter tags name starting with this text.")
            .setRequired(false),
        )
        .addStringOption((o) =>
          o
            .setName(NAME_CONTAINS)
            .setDescription("Filter tags name containing this text.")
            .setRequired(false),
        )
        .addUserOption((o) =>
          o
            .setName("owner")
            .setDescription("Filter tags created by this user.")
            .setRequired(false),
        ),
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
            .setAutocomplete(true),
        ),
    )
    .addSubcommand((c) =>
      c.setName("list").setDescription("Get all server tags."),
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
            .setRequired(false),
        )
        .addStringOption((o) =>
          o
            .setName(NAME_CONTAINS)
            .setDescription("Filter tags containing this text.")
            .setRequired(false),
        )
        .addUserOption((o) =>
          o
            .setName("owner")
            .setDescription("Filter tags created by this user.")
            .setRequired(false),
        ),
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
            .setAutocomplete(true),
        )
        // Requires at least one
        .addStringOption((o) =>
          o
            .setName("content")
            .setDescription("The new content of the tag.")
            .setRequired(false),
        )
        .addAttachmentOption((o) =>
          o
            .setName("attachment")
            .setDescription("Optional tag attachment.")
            .setRequired(false),
        ),
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
            .setAutocomplete(true),
        )
        .addStringOption((o) =>
          o
            .setName("new_name")
            .setDescription("The new name of the tag.")
            .setRequired(true),
        ),
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
            .setAutocomplete(true),
        ),
    )
    .toJSON();

  async handler(
    ctx: Context,
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("This command can only be used in a guild.");
    }

    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case "add":
        return TagCommand.addHandler(ctx, interaction);
      case "get":
        return TagCommand.getHandler(ctx, interaction);
      case "random":
        return TagCommand.randomHandler(ctx, interaction);
      case "info":
        return TagCommand.infoHandler(ctx, interaction);
      case "list":
        return TagCommand.fulllistHandler(ctx, interaction);
      case "search":
        return TagCommand.searchHandler(ctx, interaction);
      case "edit":
        return TagCommand.editHandler(ctx, interaction);
      case "rename":
        return TagCommand.renameHandler(ctx, interaction);
      case "delete":
        return TagCommand.deleteHandler(ctx, interaction);

      default:
        throw new Error("Invalid subcommand.");
    }
  }

  static async addHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    // Make new tags case insensitive - always lowercase
    const tagNameRaw = interaction.options.getString("name")?.toLowerCase();
    if (!tagNameRaw) {
      throw new Error("Missing tag name");
    }

    const tagContent = interaction.options.getString("content") || "";
    const tagAttachment = interaction.options.getAttachment("attachment");

    // Verify format and length
    const tagNameRes = verifyTagName(tagNameRaw);
    if (tagNameRes.err) {
      await interactionReplyError(
        ctx,
        interaction,
        "Invalid tag name",
        tagNameRes.val,
      );

      return;
    }

    const tagName = tagNameRes.safeUnwrap();

    if (!tagContent && !tagAttachment) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              t("tag.add.error.missing_content_and_attachment", {
                ns: "commands",
              }),
            )
            .setColor(Color.Error)
            .toJSON(),
        ],
      });

      return;
    }

    // Check if the tag name exists already
    const existingTag = await getTag(db, interaction.guildId, tagName);
    if (existingTag) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(t("tag.add.error.failed_title", { ns: "commands" }))
            .setDescription(
              t("tag.add.error.already_exists_description", {
                ns: "commands",
                tagName,
              }),
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

    await interaction.reply({
      embeds: [embed.toJSON()],
      files,
    });

    let attachmentUrl;
    if (tagAttachment) {
      try {
        const replyMsg = await interaction.fetchReply();
        attachmentUrl = replyMsg.attachments.at(0)?.url;
      } catch (err) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(Color.Error)
              .setTitle(
                t("tag.add.error.failed_title", {
                  ns: "commands",
                }),
              )
              .setDescription(
                t("tag.add.error.failed_get_original_message", {
                  ns: "commands",
                }),
              )
              .toJSON(),
          ],
        });

        return;
      }
    }

    await upsertTag(db, {
      tag_name: tagName,
      content: tagContent,
      attachment: attachmentUrl,
      created: new Date(),
      guild_id: interaction.guildId,
      owner_id: interaction.user.id,
      use_count: "0",
    });
  }

  static async getHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const tagName = interaction.options.getString("name");
    if (!tagName) {
      throw new Error("Missing tag name");
    }

    const tag = await getTag(db, interaction.guildId, tagName);

    if (!tag) {
      await interaction.reply({
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

    let { content } = tag;

    if (tag.attachment) {
      content += tag.attachment;
    }

    // const embed = new EmbedBuilder()
    //   .setTitle(tag.tagByGuildIdAndTagName.tagName)
    //   .setDescription(content)
    //   .setColor(Color.Info)
    //   .setImage(tag.tagByGuildIdAndTagName.attachment || null);

    await interaction.reply({
      // embeds: [embed.toJSON()],
      content,
      // Allowedmentions not required, no pings in embed
      allowedMentions: {
        parse: [],
      },
    });

    await incrementTagUseCount(db, interaction.guildId, tag.tag_name);
  }

  static async randomHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const startsWith = interaction.options.getString(NAME_STARTS_WITH);
    const contains = interaction.options.getString(NAME_CONTAINS);
    const owner = interaction.options.getUser("owner");

    // startsWith xor contains
    if (startsWith && contains) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(t("tag.random.error.title", { ns: "commands" }))
            .setDescription(
              t("tag.random.error.starts_with_contains_xor", {
                ns: "commands",
              }),
            )
            .setColor(Color.Error)
            .toJSON(),
        ],
      });

      return;
    }

    const tag = await getRandomTag(
      db,
      interaction.guildId,
      startsWith,
      contains,
      owner?.id || null,
    );

    if (!tag) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(t("tag.random.error.title", { ns: "commands" }))
            .setDescription("No tags found.")
            .setColor(Color.Error)
            .toJSON(),
        ],
      });

      return;
    }

    let content = `${tag.tag_name}: ${tag.content}`;

    if (tag.attachment) {
      content += tag.attachment;
    }

    await interaction.reply({
      content,
      // No pings in tags
      allowedMentions: {
        parse: [],
      },
    });
  }

  static async infoHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const tagName = interaction.options.getString("name");
    if (!tagName) {
      throw new Error("Missing tag name");
    }

    const tag = await getTag(db, interaction.guildId, tagName);

    if (!tag) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              t("tag.get.error.not_found", { ns: "commands", tagName }),
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
          value: tag.content || "No content",
        },
        {
          name: t("tag.info.success.attachment", { ns: "commands" }),
          value: tag.attachment || "No attachment",
        },
        {
          name: t("tag.info.success.owner", { ns: "commands" }),
          value: `<@${tag.owner_id}>`,
        },
        {
          name: t("tag.info.success.use_count", { ns: "commands" }),
          value: tag.use_count.toString(),
        },
      ])
      .setImage(tag.attachment || null)
      .setTimestamp(dayjs.utc(tag.created).toDate());

    await interaction.reply({
      embeds: [embed],
    });
  }

  static async fulllistHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const tags = await listTags(db, interaction.guildId);

    if (!tags) {
      const embed = new EmbedBuilder()
        .setTitle("Server Tags")
        .setDescription("There are no tags, add some first!")
        .setColor(Color.Info);

      await interaction.reply({
        embeds: [embed],
      });

      return;
    }

    const tagNames = tags.map((tag) => tag.tag_name);

    const addEmbedOptions = (embed: EmbedBuilder): EmbedBuilder =>
      embed.setTitle("Server Tags").setColor(Color.Info);

    const paginator = new Paginator({
      interaction,
      getPageFn: async (pageNum, pageSize) =>
        tagNames.slice(pageNum * pageSize, (pageNum + 1) * pageSize).join("\n"),
      getTotalEntriesFn: async () => tagNames.length,
      pageSize: 25,
      embedModifierFn: addEmbedOptions,
    });

    await paginator.paginate();
  }

  static async searchHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const startsWith = interaction.options.getString(NAME_STARTS_WITH);
    const contains = interaction.options.getString(NAME_CONTAINS);
    const owner = interaction.options.getUser("owner");

    if (!startsWith && !contains && !owner) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(t("tag.search.error.title", { ns: "commands" }))
            .setDescription(
              t("tag.search.error.no_options", { ns: "commands" }),
            )
            .setColor(Color.Error)
            .toJSON(),
        ],
      });

      return;
    }

    // startsWith xor contains
    if (startsWith && contains) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(t("tag.search.error.title", { ns: "commands" }))
            .setDescription(
              t("tag.search.error.starts_with_contains_xor", {
                ns: "commands",
              }),
            )
            .setColor(Color.Error)
            .toJSON(),
        ],
      });

      return;
    }

    const tags = await searchTags(
      db,
      interaction.guildId,
      startsWith,
      contains,
      owner?.id || null,
    );

    if (tags.length === 0) {
      const embed = new EmbedBuilder()
        .setTitle("Server Tags")
        .setDescription("There are no tags, add some first!")
        .setColor(Color.Info);

      await interaction.reply({
        embeds: [embed],
      });

      return;
    }

    const tagNames = tags.map((tag) => tag.tag_name);

    let title = owner !== null ? `Created by ${owner.username}` : "";

    if (title === null && contains !== null) {
      title = `Containing ${contains}`;
    } else if (title !== null && contains !== null) {
      title += ` and containing ${contains}`;
    }

    if (title === null && startsWith !== null) {
      title = `Starting with ${startsWith}`;
    } else if (title !== null && startsWith !== null) {
      title += ` and starting with ${startsWith}`;
    }

    const addEmbedOptions = (embed: EmbedBuilder): EmbedBuilder =>
      embed
        .setTitle(title)
        .setAuthor({
          name: "Server Tags",
        })
        .setColor(Color.Info);

    const paginator = new Paginator({
      interaction,
      getPageFn: async (pageNum, pageSize) =>
        tagNames.slice(pageNum * pageSize, (pageNum + 1) * pageSize).join("\n"),
      getTotalEntriesFn: async () => tagNames.length,
      pageSize: 25,
      embedModifierFn: addEmbedOptions,
    });

    await paginator.paginate();
  }

  static async editHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const tagName = interaction.options.getString("name");
    if (!tagName) {
      throw new Error("Missing tag name.");
    }

    const tag = await getTag(db, interaction.guildId, tagName);

    // Check if tag exists
    if (!tag) {
      await interaction.reply({
        content: t("tag.edit.error.not_found", {
          ns: "commands",
          tagName,
        }),
      });

      return;
    }

    // Check if owner or manage guild perms
    if (
      await deniedTagPermission(
        ctx,
        interaction,
        tag,
        interaction.user.id,
        interaction.member,
      )
    ) {
      return;
    }

    const newContent = interaction.options.getString("content");
    const newAttachment = interaction.options.getAttachment("attachment");

    if (!newContent && !newAttachment) {
      await interaction.reply({
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
          : null,
      );

    await interaction.reply({
      embeds: [embed.toJSON()],
      files,
    });

    let attachmentUrl;
    if (newAttachment) {
      try {
        const replyMsg = await interaction.fetchReply();
        attachmentUrl = replyMsg.attachments.at(0)?.url;
      } catch (err) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(Color.Error)
              .setTitle(
                t("tag.edit.error.failed_title", {
                  ns: "commands",
                }),
              )
              .setDescription(
                t("tag.edit.error.failed_get_original_message", {
                  ns: "commands",
                }),
              )
              .toJSON(),
          ],
        });

        return;
      }
    }

    // Save the attachment url of the reply message, not the interaction
    // attachment. Interaction attachment is ephemeral
    await upsertTag(db, {
      content: newContent || tag.content,
      attachment: attachmentUrl,

      // Unchanged
      tag_name: tagName,
      created: tag.created,
      guild_id: interaction.guildId,
      owner_id: interaction.user.id,
      use_count: tag.use_count,
    });
  }

  static async renameHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const tagName = interaction.options.getString("name");
    if (!tagName) {
      throw new Error("Missing tag name.");
    }

    const tag = await getTag(db, interaction.guildId, tagName);

    // Check if tag exists
    if (!tag) {
      await interaction.reply({
        content: t("tag.edit.error.not_found", {
          ns: "commands",
          tagName,
        }),
      });

      return;
    }

    // Check if owner or manage guild perms
    if (
      await deniedTagPermission(
        ctx,
        interaction,
        tag,
        interaction.user.id,
        interaction.member,
      )
    ) {
      return;
    }

    const newNameRaw = interaction.options.getString("new_name");
    if (!newNameRaw) {
      throw new Error("Missing new tag name.");
    }

    // Verify format and length
    const newNameRes = verifyTagName(newNameRaw);
    if (newNameRes.err) {
      await interactionReplyError(
        ctx,
        interaction,
        "Invalid tag name",
        newNameRes.val,
      );

      return;
    }

    const newName = newNameRes.safeUnwrap();

    // Check if new name tag already exists
    const tagExists = await getTag(
      db,
      interaction.guildId,
      newName.toLowerCase(),
    );

    if (tagExists) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(t("tag.rename.error.failed_title", { ns: "commands" }))
            .setDescription(
              t("tag.rename.error.already_exists_description", {
                ns: "commands",
                tagName,
              }),
            )
            .setColor(Color.Error)
            .toJSON(),
        ],
      });

      return;
    }

    // Rename tag, possible failure if tag name already exists, but rare enough
    // race condition to ignore -- should error anyways.
    await upsertTag(db, {
      tag_name: newName,
      content: tag.content,
      attachment: tag.attachment,
      created: tag.created,
      guild_id: interaction.guildId,
      owner_id: interaction.user.id,
      use_count: tag.use_count,
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

    await interaction.reply({
      embeds: [embed],
    });
  }

  static async deleteHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const tagName = interaction.options.getString("name");
    if (!tagName) {
      throw new Error("Missing tag name.");
    }

    const tag = await getTag(db, interaction.guildId, tagName);

    // Check if tag exists
    if (!tag) {
      await interaction.reply({
        content: t("tag.delete.error.not_found", {
          ns: "commands",
          tagName,
        }),
      });

      return;
    }

    // Check if owner or manage guild perms
    if (
      await deniedTagPermission(
        ctx,
        interaction,
        tag,
        interaction.user.id,
        interaction.member,
      )
    ) {
      return;
    }

    await deleteTag(db, interaction.guildId, tagName);

    const embed = new EmbedBuilder()
      .setTitle(t("tag.delete.success.title", { ns: "commands", tagName }))
      .setFields([
        {
          name: t("tag.delete.success.content", { ns: "commands" }),
          value: tag.content || "No content",
        },
        {
          name: t("tag.delete.success.owner", { ns: "commands" }),
          value: `<@${tag.owner_id}>`,
        },
        {
          name: t("tag.delete.success.use_count", { ns: "commands" }),
          value: tag.use_count.toString(),
        },
      ])
      .setTimestamp(dayjs(tag.created).toDate())
      .setColor(Color.Success);

    await interaction.reply({
      embeds: [embed],
    });
  }
}
