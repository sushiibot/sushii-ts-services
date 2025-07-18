import dayjs from "@/shared/domain/dayjs";
import {
  AutocompleteFocusedOption,
  AutocompleteInteraction,
  APIApplicationCommandOptionChoice,
  ApplicationCommandOptionType,
} from "discord.js";
import { getDurationFromNow } from "../../utils/getDuration";
import { AutocompleteHandler } from "../handlers";
import db from "../../infrastructure/database/db";
import { GiveawaySubcommand } from "./Giveaway.command";
import {
  getAllActiveGiveaways,
  getAllCompletedGiveaways,
} from "../../db/Giveaway/Giveaway.repository";

export default class GiveawayAutocomplete extends AutocompleteHandler {
  fullCommandNamePath = [
    `giveaway.${GiveawaySubcommand.Delete}`,
    `giveaway.${GiveawaySubcommand.End}`,
    `giveaway.${GiveawaySubcommand.Reroll}`,
  ];

  async handleAutocomplete(
    interaction: AutocompleteInteraction,
    option: AutocompleteFocusedOption,
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Interaction is not in a cached guild.");
    }

    if (option.type !== ApplicationCommandOptionType.String) {
      throw new Error("Option type must be string.");
    }

    const subcommand = interaction.options.getSubcommand();

    let matching;
    let giveawaysCompleted = false;

    if (subcommand === GiveawaySubcommand.Reroll) {
      // Only show ENDED giveaways
      matching = await getAllCompletedGiveaways(db, interaction.guildId);
      giveawaysCompleted = true;
    } else {
      // Only show ACTIVE giveaways
      matching = await getAllActiveGiveaways(db, interaction.guildId);
    }

    const choices: APIApplicationCommandOptionChoice[] | undefined = matching
      .slice(0, 25)
      .map((s) => {
        const durStr = getDurationFromNow(dayjs.utc(s.end_at)).humanize();

        let name = `ID: ${s.id} - `;

        if (giveawaysCompleted) {
          name += `Ended: ${durStr} ago`;
        } else {
          name += `Ending in: ${durStr}`;
        }

        name += ` - Prize: ${s.prize}`;

        return {
          name,
          value: s.id,
        };
      });

    await interaction.respond(choices || []);
  }
}
