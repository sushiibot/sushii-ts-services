import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { AutocompleteFocusedOption, AutocompleteInteraction } from "discord.js";
import Context from "../../model/context";
import { AutocompleteHandler } from "../handlers";
import db from "../../model/db";

export default class TagGetAutocomplete extends AutocompleteHandler {
  fullCommandNamePath = [
    "tag.get",
    "tag.info",
    "tag.rename",
    "tag.edit",
    "tag.delete",
    "tagadmin.delete",
  ];

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: AutocompleteInteraction,
    option: AutocompleteFocusedOption
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Not in cached guild");
    }

    if (option.type !== ApplicationCommandOptionType.String) {
      throw new Error("Option type must be string.");
    }

    const tags = await db
      .selectFrom("app_public.tags")
      .selectAll()
      .where("guild_id", "=", interaction.guildId)
      .where("tag_name", "ilike", `${option.value}%`)
      .limit(25)
      .execute();

    // Max 25, slice from 0 to end 25
    const choices = tags.slice(0, 25).map((tag) => ({
      name: tag.tag_name,
      value: tag.tag_name,
    }));

    await interaction.respond(choices || []);
  }
}
