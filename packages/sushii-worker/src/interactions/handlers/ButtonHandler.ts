import { APIMessageComponentButtonInteraction } from "discord-api-types/v10";
import MessageComponentHandler from "./MessageComponentHandler";
import Context from "../../model/context";

export default abstract class ButtonHandler extends MessageComponentHandler {
  /**
   * Button submit handler function
   */
  abstract handleInteraction(
    ctx: Context,
    interaction: APIMessageComponentButtonInteraction
  ): Promise<void>;
}
