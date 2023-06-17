import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  ComponentType,
  EmbedBuilder,
} from "discord.js";
import logger from "../logger";

// Function to get the actual page content
type GetPageFn = (pageNum: number, pageSize: number) => Promise<string>;

// Function get the total number of items
type GetTotalEntriesFn = () => Promise<number>;

// Embed modifier function, for adding title, color, fields, etc
type EmbedModifierFn = (embed: EmbedBuilder) => EmbedBuilder;

enum ButtonId {
  Back5 = "back5",
  Back = "back",
  Current = "current",
  Forward = "forward",
  Forward5 = "forward5",
}

type PaginationOptions = {
  interaction: ChatInputCommandInteraction<"cached">;
  getPageFn: GetPageFn;
  getTotalEntriesFn: GetTotalEntriesFn;
  pageSize: number;
  embedModifierFn: EmbedModifierFn;
};

export default class Paginator {
  interaction: ChatInputCommandInteraction<"cached">;

  getPageDescriptionFn: GetPageFn;

  embedModifierFn: EmbedModifierFn;

  getTotalEntriesFn: GetTotalEntriesFn;

  currentPageIndex: number;

  totalPages: number | null;

  pageSize: number;

  constructor({
    interaction,
    getPageFn,
    getTotalEntriesFn,
    pageSize,
    embedModifierFn,
  }: PaginationOptions) {
    this.interaction = interaction;
    this.getPageDescriptionFn = getPageFn;
    this.embedModifierFn = embedModifierFn;
    this.getTotalEntriesFn = getTotalEntriesFn;

    this.currentPageIndex = 0;
    this.totalPages = null;
    this.pageSize = pageSize;
  }

  /**
   * Get the total number of pages
   *
   * @returns The total number of pages
   */
  private async getTotalPages(forceRefresh: boolean): Promise<number> {
    // Reset cached value
    if (forceRefresh) {
      this.totalPages = null;
    }

    // Return cached value
    if (this.totalPages !== null) {
      return this.totalPages;
    }

    const totalEntries = await this.getTotalEntriesFn();
    this.totalPages = Math.ceil(totalEntries / this.pageSize);

    return this.totalPages;
  }

  /**
   * Get the embed to send
   *
   * @returns The embed to send
   */
  private async getEmbed(): Promise<EmbedBuilder> {
    const page = await this.getPageDescriptionFn(
      this.currentPageIndex,
      this.pageSize
    );

    logger.debug(
      {
        pageIndex: this.currentPageIndex,
        pageSize: this.pageSize,
        page,
      },
      "Fetched page"
    );

    const embed = new EmbedBuilder();

    if (page.length > 0) {
      embed.setDescription(page);
    } else {
      embed.setDescription("There's nothing here... 🤔");
    }

    return this.embedModifierFn(embed);
  }

  /**
   * Get the components to send
   *
   * @param expired disable all buttons
   * @returns Message components
   */
  private async getComponents(
    expired: boolean
  ): Promise<ActionRowBuilder<ButtonBuilder>[]> {
    // Get forward and back pages, along with the current page on the center

    const totalPages = await this.getTotalPages(false);

    const back5Button = new ButtonBuilder()
      .setEmoji("⏪")
      .setCustomId(ButtonId.Back5)
      .setStyle(ButtonStyle.Secondary)
      // When expired or at the start
      .setDisabled(expired || this.currentPageIndex === 0);

    const backButton = new ButtonBuilder()
      .setEmoji("⬅️")
      .setCustomId(ButtonId.Back)
      .setStyle(ButtonStyle.Secondary)
      // When expired or at the start
      .setDisabled(expired || this.currentPageIndex === 0);

    let currentPageLabel = `${this.currentPageIndex + 1} / ${totalPages}`;
    if (totalPages === 0) {
      currentPageLabel = "0 / 0";
    }

    if (expired) {
      currentPageLabel = "Expired, run the command again";
    }

    const currentPage = new ButtonBuilder()
      .setLabel(currentPageLabel)
      .setCustomId(ButtonId.Current)
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true);

    // When expired or at the end, currentPageIndex is 0 indexed, totalPages is not
    const forwardButtonDisabled =
      expired || totalPages === 0 || this.currentPageIndex + 1 === totalPages;

    const forwardButton = new ButtonBuilder()
      .setEmoji("➡️")
      .setCustomId(ButtonId.Forward)
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(forwardButtonDisabled);

    const forward5Button = new ButtonBuilder()
      .setEmoji("⏩")
      .setCustomId(ButtonId.Forward5)
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(forwardButtonDisabled);

    const components = [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        back5Button,
        backButton,
        currentPage,
        forwardButton,
        forward5Button
      ),
    ];

    return components;
  }

  async paginate(): Promise<void> {
    let embed = await this.getEmbed();
    let components = await this.getComponents(false);

    const message = await this.interaction.reply({
      embeds: [embed],
      components,
    });

    let totalPages = await this.getTotalPages(false);
    if (totalPages < 1) {
      // No pages, no need to listen for button presses
      return;
    }

    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      // 3 Minutes
      time: 3 * 60000,
    });

    collector.on("collect", async (i) => {
      if (i.user.id !== this.interaction.user.id) {
        await i.reply({
          content:
            "This isn't for you!! Run your own command to use these buttons.",
          ephemeral: true,
        });

        return;
      }

      totalPages = await this.getTotalPages(false);

      logger.debug({
        message: "Paginator button pressed",
        buttonId: i.customId,
        totalPages,
        currentPage: this.currentPageIndex,
      });

      switch (i.customId) {
        case ButtonId.Back5:
          this.currentPageIndex = Math.max(this.currentPageIndex - 5, 0);
          break;
        case ButtonId.Back:
          this.currentPageIndex = Math.max(this.currentPageIndex - 1, 0);
          break;
        case ButtonId.Forward:
          this.currentPageIndex = Math.min(
            this.currentPageIndex + 1,
            totalPages - 1
          );
          break;
        case ButtonId.Forward5:
          this.currentPageIndex = Math.min(
            this.currentPageIndex + 5,
            totalPages - 1
          );
          break;
        default:
          throw new Error(`Unknown button custom id ${i.customId}`);
      }

      embed = await this.getEmbed();
      components = await this.getComponents(false);

      await i.update({
        embeds: [embed],
        components,
      });
    });

    collector.on("end", async () => {
      // Disable all buttons
      components = await this.getComponents(true);

      await message.edit({
        components,
      });
    });
  }
}
