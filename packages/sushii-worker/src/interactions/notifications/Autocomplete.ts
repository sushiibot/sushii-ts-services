import {
  ApplicationCommandOptionType,
  AutocompleteFocusedOption,
  AutocompleteInteraction,
} from "discord.js";
import db from "../../infrastructure/database/db";
import { AutocompleteHandler } from "../handlers";
import { searchNotifications } from "../../db/Notification/Notification.repository";

export default class NotificationListAutocomplete extends AutocompleteHandler {
  fullCommandNamePath = "notification.delete";

  async handleAutocomplete(
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

    const choices = matching
      // Remove any notifications that are too long, new notification should
      // have a limit of 100 characters, but old ones will not be able to be
      // listed
      .filter((n) => n.keyword.length <= 100)
      .slice(0, 25)
      .map((row) => ({
        name: row.keyword,
        value: row.keyword,
      }));

    await interaction.respond(choices || []);
  }
}
