import dayjs from "dayjs";
import {
  APIApplicationCommandAutocompleteInteraction,
  APIApplicationCommandOptionChoice,
  ApplicationCommandOptionType,
  InteractionResponseType,
} from "discord-api-types/v10";
import Context from "../../model/context";
import { getDurationFromNow } from "../../utils/getDuration";
import getInvokerUser from "../../utils/interactions";
import { AutocompleteHandler } from "../handlers";
import { AutocompleteOption } from "../handlers/AutocompleteHandler";

export default class ReminderDeleteAutocomplete extends AutocompleteHandler {
  fullCommandNamePath = "reminder.delete";

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

    const matching = await ctx.sushiiAPI.sdk.getUserReminders({
      userId: invoker.id,
    });

    const choices: APIApplicationCommandOptionChoice[] | undefined =
      matching.allReminders?.nodes
        .filter((r) => r.description.startsWith(option.value) && r)
        .filter((r) => !!r)
        .map((s) => ({
          name: `${getDurationFromNow(dayjs.utc(s.expireAt)).humanize()} - ${
            s.description
          }`,
          value: s.setAt,
        }));

    await ctx.REST.interactionCallback(interaction, {
      type: InteractionResponseType.ApplicationCommandAutocompleteResult,
      data: {
        choices,
      },
    });
  }
}
