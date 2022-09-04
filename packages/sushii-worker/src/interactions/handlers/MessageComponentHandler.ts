import { APIMessageComponentInteraction } from "discord-api-types/v10";
import { match } from "path-to-regexp";
import Context from "../../model/context";

export default abstract class MessageComponentHandler {
  /**
   * Url-like path to match against
   */
  abstract readonly customIDMatch: ReturnType<typeof match>;

  /**
   * Button/dropdown/etc submit handler function
   */
  abstract handleInteraction(
    ctx: Context,
    interaction: APIMessageComponentInteraction
  ): Promise<void>;
}
