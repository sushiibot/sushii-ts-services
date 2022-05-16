import {
  APIApplicationCommandAutocompleteInteraction,
  ApplicationCommandOptionType,
  InteractionResponseType,
} from "discord-api-types/v10";
import Context from "../../model/context";
import getInvokerUser from "../../utils/interactions";
import { AutocompleteHandler } from "../handlers";
import { AutocompleteOption } from "../handlers/AutocompleteHandler";

export default class TagAutocomplete extends AutocompleteHandler {
  fullCommandNamePath = "notification.delete";

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: APIApplicationCommandAutocompleteInteraction,
    option: AutocompleteOption
  ): Promise<void> {
    if (option.type !== ApplicationCommandOptionType.String) {
      throw new Error("Option type must be string.");
    }

    const invoker = getInvokerUser(interaction);

    const matching = await ctx.sushiiAPI.sdk.searchNotificationsStartingWith({
      userId: invoker.id,
      query: option.value,
    });

    const choices = matching.notificationsStartingWith?.nodes
      .filter((k): k is string => !!k)
      .map((s) => ({
        name: s,
        value: s,
      }));

    await ctx.REST.interactionCallback(interaction, {
      type: InteractionResponseType.ApplicationCommandAutocompleteResult,
      data: {
        choices,
      },
    });
  }
}
