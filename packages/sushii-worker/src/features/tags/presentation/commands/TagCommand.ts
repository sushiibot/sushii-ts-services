import {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  InteractionContextType,
  PermissionFlagsBits,
  MessageFlags,
} from "discord.js";
import { Logger } from "pino";
import { t } from "i18next";
import Color from "@/utils/colors";
import { SlashCommandHandler } from "@/interactions/handlers";
import { TagService } from "../../application/TagService";
import { TagSearchService } from "../../application/TagSearchService";
import { TagEditInteractionHandler } from "./TagEditInteractionHandler";
import {
  createTagInfoEmbed,
  createTagSuccessEmbed,
  createTagDeleteSuccessMessage,
  createTagErrorEmbed,
  createTagNotFoundEmbed,
} from "../views/TagEmbedBuilder";
import { interactionReplyErrorMessage } from "@/interactions/responses/error";
import Paginator from "@/shared/presentation/Paginator";
import { NAME_STARTS_WITH, NAME_CONTAINS } from "../TagConstants";

export class TagCommand extends SlashCommandHandler {
  command = new SlashCommandBuilder()
    .setName("tag")
    .setDescription("Create and use custom commands with custom responses.")
    .setContexts(InteractionContextType.Guild)
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
        .setDescription("Edit a tag's name, content, or delete it.")
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
    private readonly editInteractionHandler: TagEditInteractionHandler,
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

    const tag = await this.tagService.getTag(tagName, interaction.guildId);

    if (!tag) {
      await interaction.reply({
        embeds: [createTagNotFoundEmbed(tagName).toJSON()],
      });
      return;
    }

    const hasManageGuildPermission = interaction.member.permissions.has(
      PermissionFlagsBits.ManageGuild,
    );

    if (!tag.canBeModifiedBy(interaction.user.id, hasManageGuildPermission)) {
      await interaction.reply({
        embeds: [
          createTagErrorEmbed(
            "Permission Denied",
            "You don't have permission to edit this tag",
          ).toJSON(),
        ],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    // Delegate to the edit interaction handler
    await this.editInteractionHandler.handleEditInterface(interaction, tag);
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
    const message = createTagDeleteSuccessMessage(tag);

    await interaction.reply(message);
  }
}
