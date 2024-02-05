import { BaseInteraction, PermissionsBitField } from "discord.js";
import Context from "../../model/context";

/**
 * Response of a command check, a message will only exist on pass = false
 */
export type CheckResponse =
  | {
      pass: true;
    }
  | {
      pass: false;
      message: string;
    };

export default abstract class InteractionHandler {
  /**
   * Required permissions for the **bot** to run the command, ie. ban members
   */
  readonly requiredBotPermissions?: PermissionsBitField;

  /**
   * Interaction handler
   */
  abstract handler(
    ctx: Context,
    interaction: BaseInteraction,
    data?: any, // Any additional data to pass
  ): Promise<void>;
}
