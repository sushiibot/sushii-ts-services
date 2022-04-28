import dayjs from "dayjs";
import { Duration } from "dayjs/plugin/duration";
import {
  APIAttachment,
  APIChatInputApplicationCommandInteraction,
  APIUser,
} from "discord-api-types/v10";
import getInvokerUser from "../../utils/interactions";
import CommandInteractionOptionResolver from "../resolver";

/**
 * Common moderation command data
 */
export default class ModActionData {
  public target: APIUser;

  public invoker: APIUser;

  public reason?: string;

  public attachment?: APIAttachment;

  /**
   * Duration of timeout, only exists for timeout command
   */
  public timeoutDuration?: Duration;

  constructor(interaction: APIChatInputApplicationCommandInteraction) {
    const options = new CommandInteractionOptionResolver(
      interaction.data.options,
      interaction.data.resolved
    );

    this.invoker = getInvokerUser(interaction);

    const target = options.getUser("user");

    if (!target) {
      throw new Error("No user provided.");
    }

    this.target = target;

    this.reason = options.getString("reason");
    this.attachment = options.getAttachment("attachment");

    const durationStr = options.getString("duration");

    if (durationStr) {
      this.timeoutDuration = dayjs.duration(durationStr);
    }
  }
}
