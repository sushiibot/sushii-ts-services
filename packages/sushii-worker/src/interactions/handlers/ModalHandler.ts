import { ModalSubmitInteraction } from "discord.js";
import { match } from "path-to-regexp";
import Context from "../../model/context";

export default abstract class ModalHandler {
  /**
   * Url-like path to match against
   */
  abstract readonly customIDMatch: ReturnType<typeof match>;

  /**
   * Modal submit handler function
   */
  abstract handleModalSubmit(
    ctx: Context,
    interaction: ModalSubmitInteraction,
  ): Promise<void>;
}
