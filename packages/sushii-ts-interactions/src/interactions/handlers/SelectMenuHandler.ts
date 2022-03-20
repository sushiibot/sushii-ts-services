import { APIMessageComponentSelectMenuInteraction } from "discord-api-types/v9";
import MessageComponentHandler from "./MessageComponentHandler";
import Context from "../../context";

export default abstract class SelectMenuHandler extends MessageComponentHandler {
  /**
   * Select menu submit handler function
   */
  abstract handleInteraction(
    ctx: Context,
    interaction: APIMessageComponentSelectMenuInteraction
  ): Promise<void>;
}
