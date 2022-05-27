import {
  APIApplicationCommandAutocompleteInteraction,
  ApplicationCommandOptionType,
  InteractionResponseType,
} from "discord-api-types/v10";
import Context from "../../model/context";
import { AutocompleteHandler } from "../handlers";
import { AutocompleteOption } from "../handlers/AutocompleteHandler";

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
    interaction: APIApplicationCommandAutocompleteInteraction,
    option: AutocompleteOption
  ): Promise<void> {
    if (option.type !== ApplicationCommandOptionType.String) {
      throw new Error("Option type must be string.");
    }

    const matching = await ctx.sushiiAPI.sdk.searchTags({
      guildId: interaction.guild_id,
      filter: {
        tagName: {
          startsWithInsensitive: option.value,
        },
      },
    });

    const choices = matching.allTags?.edges.map((s) => ({
      name: s.node.tagName,
      value: s.node.tagName,
    }));

    await ctx.REST.interactionCallback(interaction, {
      type: InteractionResponseType.ApplicationCommandAutocompleteResult,
      data: {
        choices,
      },
    });
  }
}
