import {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  InteractionContextType,
  PermissionFlagsBits,
} from "discord.js";
import { Logger } from "pino";
import { t } from "i18next";
import Color from "@/utils/colors";
import { SlashCommandHandler } from "@/interactions/handlers";
import { TagService } from "../application/TagService";
import { TagSearchService } from "../application/TagSearchService";
import {
  createTagInfoEmbed,
  createTagSuccessEmbed,
  createTagDeleteSuccessEmbed,
  createTagErrorEmbed,
  createTagNotFoundEmbed,
  processTagAttachment,
} from "./views/TagEmbedBuilder";
import { interactionReplyErrorMessage } from "@/interactions/responses/error";
import Paginator from "@/shared/presentation/Paginator";

const NAME_STARTS_WITH = "name_starts_with";
const NAME_CONTAINS = "name_contains";

export class TagCommand extends SlashCommandHandler {
  serverOnly = true;

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

  constructor(
    private readonly tagService: TagService,
    private readonly tagSearchService: TagSearchService,
    private readonly logger: Logger,
  ) {
    super();
  }

  async handler(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("This command can only be used in a guild.");
    }

    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case "add":
        return this.addHandler(interaction);
      case "random":
        return this.randomHandler(interaction);
      case "info":
        return this.infoHandler(interaction);
      case "list":
        return this.listHandler(interaction);
      case "search":
        return this.searchHandler(interaction);
      case "edit":
        return this.editHandler(interaction);
      case "rename":
        return this.renameHandler(interaction);
      case "delete":
        return this.deleteHandler(interaction);

      default:
        throw new Error("Invalid subcommand.");
    }
  }

  private async addHandler(
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const tagName = interaction.options.getString("name")?.toLowerCase();
    if (!tagName) {
      throw new Error("Missing tag name");
    }

    const tagContent = interaction.options.getString("content") || null;
    const tagAttachment = interaction.options.getAttachment("attachment");

    if (!tagContent && !tagAttachment) {
      await interaction.reply({
        embeds: [
          createTagErrorEmbed(
            "Missing Content",
            t("tag.add.error.missing_content_and_attachment", {
              ns: "commands",
            }),
          ).toJSON(),
        ],
      });
      return;
    }

    const embedDataRes = await processTagAttachment(tagContent, tagAttachment);
    if (!embedDataRes.success) {
      await interactionReplyErrorMessage(interaction, embedDataRes.error);
      return;
    }

    const { fields, files } = embedDataRes.data;

    const embed = createTagSuccessEmbed(
      t("tag.add.success.title", { ns: "commands", tagName }),
      fields,
      tagAttachment?.url,
    );

    await interaction.reply({
      embeds: [embed.toJSON()],
      files,
    });

    let attachmentUrl;
    if (tagAttachment) {
      try {
        const replyMsg = await interaction.fetchReply();
        attachmentUrl = replyMsg.attachments.at(0)?.url;
      } catch {
        await interaction.editReply({
          embeds: [
            createTagErrorEmbed(
              t("tag.add.error.failed_title", { ns: "commands" }),
              t("tag.add.error.failed_get_original_message", {
                ns: "commands",
              }),
            ).toJSON(),
          ],
        });
        return;
      }
    }

    const result = await this.tagService.createTag({
      name: tagName,
      content: tagContent,
      attachment: attachmentUrl || null,
      guildId: interaction.guildId,
      ownerId: interaction.user.id,
    });

    if (result.err) {
      await interaction.editReply({
        embeds: [
          createTagErrorEmbed(
            t("tag.add.error.failed_title", { ns: "commands" }),
            result.val,
          ).toJSON(),
        ],
      });
    }
  }

  private async randomHandler(
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const startsWith = interaction.options.getString(NAME_STARTS_WITH);
    const contains = interaction.options.getString(NAME_CONTAINS);
    const owner = interaction.options.getUser("owner");

    if (startsWith && contains) {
      await interaction.reply({
        embeds: [
          createTagErrorEmbed(
            t("tag.random.error.title", { ns: "commands" }),
            t("tag.random.error.starts_with_contains_xor", { ns: "commands" }),
          ).toJSON(),
        ],
      });
      return;
    }

    try {
      const tag = await this.tagSearchService.getRandomTag({
        guildId: interaction.guildId,
        startsWith: startsWith || undefined,
        contains: contains || undefined,
        ownerId: owner?.id,
      });

      if (!tag) {
        await interaction.reply({
          embeds: [
            createTagErrorEmbed(
              t("tag.random.error.title", { ns: "commands" }),
              "No tags found.",
            ).toJSON(),
          ],
        });
        return;
      }

      const content = `${tag.getName().getValue()}: ${tag.getDisplayContent()}`;
      await interaction.reply({
        content,
        allowedMentions: {
          parse: [],
        },
      });
    } catch (err) {
      this.logger.error({ err }, "Error in random tag handler");
      await interactionReplyErrorMessage(
        interaction,
        "Failed to get random tag",
      );
    }
  }

  private async infoHandler(
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const tagName = interaction.options.getString("name");
    if (!tagName) {
      throw new Error("Missing tag name");
    }

    const tag = await this.tagService.getTag(tagName, interaction.guildId);

    if (!tag) {
      await interaction.reply({
        embeds: [createTagNotFoundEmbed(tagName).toJSON()],
      });
      return;
    }

    const embed = createTagInfoEmbed(tag);
    await interaction.reply({
      embeds: [embed],
    });
  }

  private async listHandler(
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const tagCount = await this.tagSearchService.getTagCount(
      interaction.guildId,
    );

    if (tagCount === 0) {
      const embed = new EmbedBuilder()
        .setTitle("Server Tags")
        .setDescription("There are no tags, add some first!")
        .setColor(Color.Info);

      await interaction.reply({
        embeds: [embed],
      });
      return;
    }

    const addEmbedOptions = (embed: EmbedBuilder): EmbedBuilder =>
      embed.setTitle("Server Tags").setColor(Color.Info);

    const paginator = new Paginator({
      interaction,
      getPageFn: async (pageNum, pageSize) => {
        const tagNames = await this.tagSearchService.getPaginatedTags(
          interaction.guildId,
          pageNum,
          pageSize,
        );
        return tagNames.join("\n");
      },
      getTotalEntriesFn: async () => tagCount,
      pageSize: 25,
      embedModifierFn: addEmbedOptions,
    });

    await paginator.paginate();
  }

  private async searchHandler(
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const startsWith = interaction.options.getString(NAME_STARTS_WITH);
    const contains = interaction.options.getString(NAME_CONTAINS);
    const owner = interaction.options.getUser("owner");

    if (!startsWith && !contains && !owner) {
      await interaction.reply({
        embeds: [
          createTagErrorEmbed(
            t("tag.search.error.title", { ns: "commands" }),
            t("tag.search.error.no_options", { ns: "commands" }),
          ).toJSON(),
        ],
      });
      return;
    }

    if (startsWith && contains) {
      await interaction.reply({
        embeds: [
          createTagErrorEmbed(
            t("tag.search.error.title", { ns: "commands" }),
            t("tag.search.error.starts_with_contains_xor", { ns: "commands" }),
          ).toJSON(),
        ],
      });
      return;
    }

    try {
      const tags = await this.tagSearchService.searchTags({
        guildId: interaction.guildId,
        startsWith: startsWith || undefined,
        contains: contains || undefined,
        ownerId: owner?.id,
      });

      if (tags.length === 0) {
        const embed = new EmbedBuilder()
          .setTitle("Server Tags")
          .setDescription("No tags found matching your criteria!")
          .setColor(Color.Info);

        await interaction.reply({
          embeds: [embed],
        });
        return;
      }

      const tagNames = tags.map((tag) => tag.getName().getValue());

      let title = owner !== null ? `Created by ${owner.username}` : "";

      if (title === "" && contains !== null) {
        title = `Containing ${contains}`;
      } else if (title !== "" && contains !== null) {
        title += ` and containing ${contains}`;
      }

      if (title === "" && startsWith !== null) {
        title = `Starting with ${startsWith}`;
      } else if (title !== "" && startsWith !== null) {
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
          tagNames
            .slice(pageNum * pageSize, (pageNum + 1) * pageSize)
            .join("\n"),
        getTotalEntriesFn: async () => tagNames.length,
        pageSize: 25,
        embedModifierFn: addEmbedOptions,
      });

      await paginator.paginate();
    } catch (err) {
      this.logger.error({ err }, "Error in search tag handler");
      await interactionReplyErrorMessage(interaction, "Failed to search tags");
    }
  }

  private async editHandler(
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const tagName = interaction.options.getString("name");
    if (!tagName) {
      throw new Error("Missing tag name.");
    }

    const newContent = interaction.options.getString("content");
    const newAttachment = interaction.options.getAttachment("attachment");

    if (!newContent && !newAttachment) {
      await interaction.reply({
        embeds: [
          createTagErrorEmbed(
            t("tag.edit.error.title", { ns: "commands" }),
            t("tag.edit.error.no_options", { ns: "commands" }),
          ).toJSON(),
        ],
      });
      return;
    }

    const embedDataRes = await processTagAttachment(newContent, newAttachment);
    if (!embedDataRes.success) {
      await interactionReplyErrorMessage(interaction, embedDataRes.error);
      return;
    }

    const { fields, files } = embedDataRes.data;

    const embed = createTagSuccessEmbed(
      t("tag.edit.success.title", { ns: "commands", tagName }),
      fields,
      newAttachment?.url,
    );

    if (newAttachment) {
      embed.setFooter({
        text: t("tag.edit.success.footer", { ns: "commands" }),
      });
    }

    await interaction.reply({
      embeds: [embed.toJSON()],
      files,
    });

    let attachmentUrl;
    if (newAttachment) {
      try {
        const replyMsg = await interaction.fetchReply();
        attachmentUrl = replyMsg.attachments.at(0)?.url;
      } catch {
        await interaction.editReply({
          embeds: [
            createTagErrorEmbed(
              t("tag.edit.error.failed_title", { ns: "commands" }),
              t("tag.edit.error.failed_get_original_message", {
                ns: "commands",
              }),
            ).toJSON(),
          ],
        });
        return;
      }
    }

    const result = await this.tagService.updateTag({
      name: tagName,
      guildId: interaction.guildId,
      userId: interaction.user.id,
      hasManageGuildPermission: interaction.member.permissions.has(
        PermissionFlagsBits.ManageGuild,
      ),
      newContent,
      newAttachment: attachmentUrl,
    });

    if (result.err) {
      await interaction.editReply({
        embeds: [
          createTagErrorEmbed(
            t("tag.edit.error.failed_title", { ns: "commands" }),
            result.val,
          ).toJSON(),
        ],
      });
    }
  }

  private async renameHandler(
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const tagName = interaction.options.getString("name");
    const newName = interaction.options.getString("new_name");
    if (!tagName || !newName) {
      throw new Error("Missing tag name or new name.");
    }

    const result = await this.tagService.renameTag({
      currentName: tagName,
      newName: newName,
      guildId: interaction.guildId,
      userId: interaction.user.id,
      hasManageGuildPermission: interaction.member.permissions.has(
        PermissionFlagsBits.ManageGuild,
      ),
    });

    if (result.err) {
      await interaction.reply({
        embeds: [
          createTagErrorEmbed(
            t("tag.rename.error.failed_title", { ns: "commands" }),
            result.val,
          ).toJSON(),
        ],
      });
      return;
    }

    const embed = createTagSuccessEmbed(
      t("tag.rename.success.title", { ns: "commands", tagName }),
      [
        {
          name: t("tag.rename.success.new_name", { ns: "commands" }),
          value: newName,
        },
      ],
    );

    await interaction.reply({
      embeds: [embed],
    });
  }

  private async deleteHandler(
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const tagName = interaction.options.getString("name");
    if (!tagName) {
      throw new Error("Missing tag name.");
    }

    const result = await this.tagService.deleteTag({
      name: tagName,
      guildId: interaction.guildId,
      userId: interaction.user.id,
      hasManageGuildPermission: interaction.member.permissions.has(
        PermissionFlagsBits.ManageGuild,
      ),
    });

    if (result.err) {
      await interaction.reply({
        content: result.val,
      });
      return;
    }

    const tag = result.val;
    const embed = createTagDeleteSuccessEmbed(tag);

    await interaction.reply({
      embeds: [embed],
    });
  }
}
