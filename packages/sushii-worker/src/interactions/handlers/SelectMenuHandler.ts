import { AnySelectMenuInteraction } from "discord.js";
import MessageComponentHandler from "./MessageComponentHandler";
import Context from "../../model/context";

export default abstract class SelectMenuHandler extends MessageComponentHandler {
  /**
   * Select menu submit handler function
   */
  abstract handleInteraction(
    ctx: Context,
    interaction: AnySelectMenuInteraction,
  ): Promise<void>;
}
