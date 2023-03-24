import {
  ApplicationCommandOptionType,
  AutocompleteFocusedOption,
  AutocompleteInteraction,
} from "discord.js";
import Context from "../../model/context";
import { AutocompleteHandler } from "../handlers";

export default class NotificationListAutocomplete extends AutocompleteHandler {
  fullCommandNamePath = "notification.delete";

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: AutocompleteInteraction,
    option: AutocompleteFocusedOption
  ): Promise<void> {
    if (option.type !== ApplicationCommandOptionType.String) {
      throw new Error("Option type must be string.");
    }

    const matching = await ctx.sushiiAPI.sdk.searchNotificationsStartingWith({
      userId: interaction.user.id,
      query: option.value,
    });

    const choices = matching.notificationsStartingWith?.nodes
      .filter((k): k is string => !!k)
      .slice(0, 25)
      .map((s) => ({
        name: s,
        value: s,
      }));

    await interaction.respond(choices || []);
  }
}
