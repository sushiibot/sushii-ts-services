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
import { listReminders } from "../../db/Reminder/Reminder.repository";
import db from "../../model/db";

export default class ReminderDeleteAutocomplete extends AutocompleteHandler {
  fullCommandNamePath = "reminder.delete";

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: AutocompleteInteraction,
    option: AutocompleteFocusedOption,
  ): Promise<void> {
    if (option.type !== ApplicationCommandOptionType.String) {
      throw new Error("Option type must be string.");
    }

    const matching = await listReminders(db, interaction.user.id);

    const choices: APIApplicationCommandOptionChoice[] | undefined = matching
      .filter((r) => r.description.startsWith(option.value) && r)
      .filter((r) => !!r)
      .slice(0, 25)
      .map((s) => {
        const durStr = getDurationFromNow(dayjs.utc(s.expire_at)).humanize();

        return {
          name: `ID: ${s.id} - Expiring in: ${durStr} - Description: ${s.description}`,
          value: s.set_at.toISOString(),
        };
      });

    await interaction.respond(choices || []);
  }
}
