import dayjs from "dayjs";
import {
  AutocompleteFocusedOption,
  AutocompleteInteraction,
  APIApplicationCommandOptionChoice,
  ApplicationCommandOptionType,
} from "discord.js";
import Context from "../../model/context";
import { getDurationFromNow } from "../../utils/getDuration";
import { AutocompleteHandler } from "../handlers";
import db from "../../model/db";
import { GiveawaySubcommand } from "./GiveawayCommand";
import { getAllActiveGiveaways } from "../../db/Giveaway/Giveaway.repository";

export default class GiveawayAutocomplete extends AutocompleteHandler {
  fullCommandNamePath = [
    GiveawaySubcommand.Delete,
    GiveawaySubcommand.End,
    GiveawaySubcommand.Reroll,
  ].map((subCommand) => `giveaway.${subCommand}`);

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: AutocompleteInteraction,
    option: AutocompleteFocusedOption,
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Interaction is not in a cached guild.");
    }

    if (option.type !== ApplicationCommandOptionType.String) {
      throw new Error("Option type must be string.");
    }

    const matching = await getAllActiveGiveaways(db, interaction.guildId);

    const choices: APIApplicationCommandOptionChoice[] | undefined = matching
      .slice(0, 25)
      .map((s) => {
        const durStr = getDurationFromNow(dayjs.utc(s.end_at)).humanize();

        return {
          name: `ID: ${s.id} - Ending in: ${durStr} - Prize: ${s.prize}`,
          value: s.id,
        };
      });

    await interaction.respond(choices || []);
  }
}
