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
   * Check function that will run before a command to see if it should be run.
   * By default, this always passes.
   */
  // eslint-disable-next-line class-methods-use-this
  async check(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _ctx: Context,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _interaction: BaseInteraction,
  ): Promise<CheckResponse> {
    return { pass: true };
  }

  /**
   * Interaction handler
   */
  abstract handler(
    ctx: Context,
    interaction: BaseInteraction,
    data?: any, // Any additional data to pass
  ): Promise<void>;
}
