import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { AutocompleteFocusedOption, AutocompleteInteraction } from "discord.js";
import Context from "../../model/context";
import { AutocompleteHandler } from "../handlers";

export default class TagGetAutocomplete extends AutocompleteHandler {
  fullCommandNamePath = [
    "tag.get",
    "tag.info",
    "tag.rename",
    "tag.edit",
    "tag.delete",
  ];

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: AutocompleteInteraction,
    option: AutocompleteFocusedOption
  ): Promise<void> {
    if (option.type !== ApplicationCommandOptionType.String) {
      throw new Error("Option type must be string.");
    }

    const matching = await ctx.sushiiAPI.sdk.searchTags({
      guildId: interaction.guildId,
      filter: {
        tagName: {
          startsWithInsensitive: option.value,
        },
      },
    });

    // Max 25, slice from 0 to end 25
    const choices = matching.allTags?.edges.slice(0, 25).map((s) => ({
      name: s.node.tagName,
      value: s.node.tagName,
    }));

    await interaction.respond(choices || []);
  }
}
