import { APIMessageComponentSelectMenuInteraction } from "discord-api-types/v10";
import MessageComponentHandler from "./MessageComponentHandler";
import Context from "../../model/context";

export default abstract class SelectMenuHandler extends MessageComponentHandler {
  /**
   * Select menu submit handler function
   */
  abstract handleInteraction(
    ctx: Context,
    interaction: APIMessageComponentSelectMenuInteraction
  ): Promise<void>;
}
