import { APIMessageComponentInteraction } from "discord-api-types/v10";
import Context from "../../model/context";

export default abstract class MessageComponentHandler {
  /**
   * Prefix in custom IDs to match in order to use this handler. For example
   * a prefix of "userinfo" will handle all message component interactions with
   * a custom ID starting with "userinfo", e.g. "userinfo:12345". This is to
   * allow for interactions to be tied to a certain origin.
   */
  abstract readonly customIDPrefix: string;

  /**
   * Button/dropdown/etc submit handler function
   */
  abstract handleInteraction(
    ctx: Context,
    interaction: APIMessageComponentInteraction
  ): Promise<void>;
}
