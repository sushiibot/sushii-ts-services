import {
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";
import { ContextMenuCommandInteraction } from "discord.js";
import Context from "../../model/context";
import InteractionHandler from "./InteractionHandler";

export default abstract class ContextMenuHandler extends InteractionHandler {
  /**
   * Data for command, e.g. the name, description, options
   */
  abstract readonly command:
    | RESTPostAPIChatInputApplicationCommandsJSONBody
    | RESTPostAPIApplicationCommandsJSONBody;

  /**
   * Field for the actual handler function
   */
  abstract handler(
    ctx: Context,
    interaction: ContextMenuCommandInteraction,
  ): Promise<void>;
}
