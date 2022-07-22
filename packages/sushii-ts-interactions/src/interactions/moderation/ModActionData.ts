import dayjs from "dayjs";
import { Duration } from "dayjs/plugin/duration";
import {
  APIAttachment,
  APIChatInputApplicationCommandInteraction,
  APIInteractionDataResolvedGuildMember,
  APIUser,
} from "discord-api-types/v10";
import { Err, Ok, Result } from "ts-results";
import getInvokerUser from "../../utils/interactions";
import parseDuration from "../../utils/parseDuration";
import CommandInteractionOptionResolver from "../resolver";

/**
 * Common moderation command data
 */
export default class ModActionData {
  public targetUser: APIUser;

  public targetMember?: APIInteractionDataResolvedGuildMember;

  public invoker: APIUser;

  public reason?: string;

  public attachment?: APIAttachment;

  // Only exists for ban
  public deleteMessageDays?: number;

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

    this.targetUser = target;

    // Could be undefined if the target is not in the guild
    this.targetMember = options.getMember("user");

    this.reason = options.getString("reason");
    this.attachment = options.getAttachment("attachment");

    this.deleteMessageDays = options.getInteger("days_to_delete");

    const durationStr = options.getString("duration");

    if (durationStr) {
      // This is **required** to exist if it's a timeout command, so it will
      // only be null if it's an invalid duration.
      this.timeoutDuration = parseDuration(durationStr) || undefined;
    }
  }

  communicationDisabledUntil(): Result<dayjs.Dayjs, string> {
    if (!this.timeoutDuration) {
      return Err("Invalid duration");
    }

    return Ok(dayjs.utc().add(this.timeoutDuration));
  }
}
