import {
  APIApplicationCommandAutocompleteInteraction,
  APIApplicationCommandInteractionDataIntegerOption,
  APIApplicationCommandInteractionDataNumberOption,
  APIApplicationCommandInteractionDataStringOption,
} from "discord-api-types/v10";
import Context from "../../context";
import InteractionHandler from "./InteractionHandler";

export type AutocompleteOption =
  | APIApplicationCommandInteractionDataStringOption
  | APIApplicationCommandInteractionDataIntegerOption
  | APIApplicationCommandInteractionDataNumberOption;

export default abstract class AutocompleteHandler extends InteractionHandler {
  /**
   * Path of command including parent commands joined with periods.
   * Example for /notification add:
   * fullCommandNamePath = "notification.add"
   *
   * Example for /notification:
   * fullCommandNamePath = "notification"
   */
  abstract readonly fullCommandNamePath: string;

  abstract handler(
    ctx: Context,
    interaction: APIApplicationCommandAutocompleteInteraction,
    option: AutocompleteOption
  ): Promise<void>;
}
