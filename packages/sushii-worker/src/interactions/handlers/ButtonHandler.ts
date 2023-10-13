import { ButtonInteraction } from "discord.js";
import MessageComponentHandler from "./MessageComponentHandler";
import Context from "../../model/context";

export default abstract class ButtonHandler extends MessageComponentHandler {
  /**
   * Button submit handler function
   */
  abstract handleInteraction(
    ctx: Context,
    interaction: ButtonInteraction,
  ): Promise<void>;
}
