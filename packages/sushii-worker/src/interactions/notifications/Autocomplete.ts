import {
  ApplicationCommandOptionType,
  AutocompleteFocusedOption,
  AutocompleteInteraction,
} from "discord.js";
import Context from "../../model/context";
import db from "../../model/db";
import { AutocompleteHandler } from "../handlers";

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

    // Escape any % characters
    const val = option.value.replace(/%/g, "%%");

    const matching = await db
      .selectFrom("app_public.notifications")
      .select("keyword")
      .where("guild_id", "=", interaction.guildId)
      .where("user_id", "=", interaction.user.id)
      .where("keyword", "ilike", `${val}%`)
      .execute();

    const choices = matching.slice(0, 25).map((row) => ({
      name: row.keyword,
      value: row.keyword,
    }));

    await interaction.respond(choices || []);
  }
}
