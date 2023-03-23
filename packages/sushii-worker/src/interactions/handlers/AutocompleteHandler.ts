import { AutocompleteFocusedOption, AutocompleteInteraction } from "discord.js";
import Context from "../../model/context";
import InteractionHandler from "./InteractionHandler";

export default abstract class AutocompleteHandler extends InteractionHandler {
  /**
   * Path of command including parent commands joined with periods.
   * Example for /notification add:
   * fullCommandNamePath = "notification.add"
   *
   * Example for /notification:
   * fullCommandNamePath = "notification"
   */
  abstract readonly fullCommandNamePath: string | string[];

  abstract handler(
    ctx: Context,
    interaction: AutocompleteInteraction,
    option: AutocompleteFocusedOption
  ): Promise<void>;
}
