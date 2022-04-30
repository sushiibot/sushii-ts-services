import { APIApplicationCommandAutocompleteInteraction } from "discord-api-types/v10";
import Context from "../../context";
import InteractionHandler from "./InteractionHandler";

export default abstract class AutocompleteHandler extends InteractionHandler {
  abstract readonly commandName: string;

  abstract handler(
    ctx: Context,
    interaction: APIApplicationCommandAutocompleteInteraction
  ): Promise<void>;
}
