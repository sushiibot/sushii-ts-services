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

export default class ReminderDeleteAutocomplete extends AutocompleteHandler {
  fullCommandNamePath = "reminder.delete";

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: AutocompleteInteraction,
    option: AutocompleteFocusedOption
  ): Promise<void> {
    if (option.type !== ApplicationCommandOptionType.String) {
      throw new Error("Option type must be string.");
    }

    const matching = await ctx.sushiiAPI.sdk.getUserReminders({
      userId: interaction.user.id,
    });

    const choices: APIApplicationCommandOptionChoice[] | undefined =
      matching.allReminders?.nodes
        .filter((r) => r.description.startsWith(option.value) && r)
        .filter((r) => !!r)
        .slice(0, 25)
        .map((s) => ({
          name: `${getDurationFromNow(dayjs.utc(s.expireAt)).humanize()} - ${
            s.description
          }`,
          value: s.setAt,
        }));

    await interaction.respond(choices || []);
  }
}
