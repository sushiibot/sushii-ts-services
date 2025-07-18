import { ApplicationCommandOptionType } from "discord.js";
import { AutocompleteFocusedOption, AutocompleteInteraction } from "discord.js";
import { Logger } from "pino";
import { AutocompleteHandler } from "@/interactions/handlers";
import { TagSearchService } from "../application/TagSearchService";

export class TagGetAutocomplete extends AutocompleteHandler {
  fullCommandNamePath = ["t"];

  constructor(
    private readonly tagSearchService: TagSearchService,
    private readonly logger: Logger,
  ) {
    super();
  }

  async handler(
    interaction: AutocompleteInteraction,
    option: AutocompleteFocusedOption,
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      return;
    }

    if (option.type !== ApplicationCommandOptionType.String) {
      return;
    }

    const query = option.value;

    try {
      const tags = await this.tagSearchService.searchTags({
        guildId: interaction.guildId,
        startsWith: query || undefined,
      });

      const choices = tags.slice(0, 25).map((tag) => ({
        name: tag.getName().getValue(),
        value: tag.getName().getValue(),
      }));

      await interaction.respond(choices);
    } catch (error) {
      this.logger.error({ error }, "Error in tag get autocomplete");
      await interaction.respond([]);
    }
  }
}
