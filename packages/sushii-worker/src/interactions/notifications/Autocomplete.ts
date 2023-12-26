import {
  ApplicationCommandOptionType,
  AutocompleteFocusedOption,
  AutocompleteInteraction,
} from "discord.js";
import Context from "../../model/context";
import db from "../../model/db";
import { AutocompleteHandler } from "../handlers";
import { searchNotifications } from "../../db/Notification/Notification.repository";

export default class NotificationListAutocomplete extends AutocompleteHandler {
  fullCommandNamePath = "notification.delete";

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: AutocompleteInteraction,
    option: AutocompleteFocusedOption,
  ): Promise<void> {
    if (option.type !== ApplicationCommandOptionType.String) {
      throw new Error("Option type must be string.");
    }

    if (!interaction.inCachedGuild()) {
      throw new Error("Guild not cached");
    }

    // Escaped in searchNotifications
    const matching = await searchNotifications(
      db,
      interaction.guildId,
      interaction.user.id,
      option.value,
    );

    const choices = matching.slice(0, 25).map((row) => ({
      name: row.keyword,
      value: row.keyword,
    }));

    await interaction.respond(choices || []);
  }
}
