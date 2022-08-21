import dayjs from "dayjs";
import { Duration } from "dayjs/plugin/duration";
import {
  APIAttachment,
  APIChatInputApplicationCommandGuildInteraction,
  APIInteractionDataResolvedGuildMember,
  APIUser,
} from "discord-api-types/v10";
import { Err, Ok, Result } from "ts-results";
import logger from "../../logger";
import Context from "../../model/context";
import getInvokerUser from "../../utils/interactions";
import parseDuration from "../../utils/parseDuration";
import CommandInteractionOptionResolver from "../resolver";

const ID_REGEX = /\d{17,20}/g;

export interface ModActionTarget {
  user: APIUser;
  member: Omit<APIInteractionDataResolvedGuildMember, "permissions"> | null;
}

/**
 * Common moderation command data
 */
export default class ModActionData {
  public options: CommandInteractionOptionResolver;

  public targets = new Map<string, ModActionTarget>();

  public invoker: APIUser;

  public reason?: string;

  public attachment?: APIAttachment;

  // Only exists for ban
  public deleteMessageDays?: number;

  /**
   * Duration of timeout, only exists for timeout command
   */
  public timeoutDuration?: Duration;

  public sendDM: boolean;

  constructor(interaction: APIChatInputApplicationCommandGuildInteraction) {
    this.options = new CommandInteractionOptionResolver(
      interaction.data.options,
      interaction.data.resolved
    );

    this.invoker = getInvokerUser(interaction);

    this.reason = this.options.getString("reason");
    this.attachment = this.options.getAttachment("attachment");

    this.deleteMessageDays = this.options.getInteger("days_to_delete");

    const durationStr = this.options.getString("duration");

    if (durationStr) {
      // This is **required** to exist if it's a timeout command, so it will
      // only be null if it's an invalid duration.
      this.timeoutDuration = parseDuration(durationStr) || undefined;
    }

    this.sendDM = this.options.getBoolean("send_dm") || true;
  }

  async fetchTargets(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction
  ): Promise<Result<void, string>> {
    // Get IDs from string
    const targetsString = this.options.getString("users");
    if (!targetsString) {
      // user option should be required so this should only throw if very wrong.
      return Err("No target users provided");
    }

    const targetIds = targetsString.match(ID_REGEX);
    if (!targetIds) {
      return Err(
        "No users were provided, please specify which users to target with IDs or mentions."
      );
    }

    // For each ID, check if in resolved (mentioned)
    // else fetch member/user from API

    // Resolved users only contains mentions, not raw IDs
    const resolvedUsers = this.options.getResolvedUsers();

    // Members can be missing if the target is not in the guild
    const resolvedMembers = this.options.getResolveMembers();

    const targetMemberPromises = [];

    for (const id of targetIds) {
      // Raw ID provided, fetch member from API if not in resolved
      if (!resolvedUsers[id] && !resolvedMembers[id]) {
        targetMemberPromises.push(ctx.REST.getMember(interaction.guild_id, id));
      }

      // Mentioned and is a member
      if (resolvedUsers[id] && resolvedMembers[id]) {
        this.targets.set(id, {
          user: resolvedUsers[id],
          member: resolvedMembers[id],
        });
      }

      // Mentioned but not in guild
      if (resolvedUsers[id] && !resolvedMembers[id]) {
        this.targets.set(id, {
          user: resolvedUsers[id],
          member: null,
        });
      }
    }

    // Resolve all member fetches
    const targetMembersResult = await Promise.allSettled(targetMemberPromises);
    const targetUserPromises = [];

    for (let i = 0; i < targetMembersResult.length; i += 1) {
      const result = targetMembersResult[i];

      if (result.status === "fulfilled") {
        if (result.value.ok) {
          const member = result.value.val;

          // User will always exist if fetched from API
          this.targets.set(member.user?.id!, {
            user: member.user!,
            member,
          });
        } else {
          // Member not found, not in guild so fetch user
          // allSettled promises are in the same order as targetIds
          targetUserPromises.push(ctx.REST.getUser(targetIds[i]));

          logger.debug(
            "fetch member not found (%s), fetching user instead",
            result.value.val.message
          );
        }
      } else {
        logger.error(result.reason, "fetch member promise rejected");
      }
    }

    // Resolve all user fetches -- non-members
    const targetUsersResult = await Promise.allSettled(targetUserPromises);
    for (let i = 0; i < targetUsersResult.length; i += 1) {
      const result = targetUsersResult[i];

      if (result.status === "fulfilled") {
        if (result.value.ok) {
          const user = result.value.val;

          // User will always exist if fetched from API
          this.targets.set(user.id!, {
            user,
            member: null,
          });
        } else {
          logger.error(result.value.val, "failed to find user");
        }
      } else {
        logger.error(result.reason, "fetch user promise rejected");
      }
    }

    return Ok.EMPTY;
  }

  communicationDisabledUntil(): Result<dayjs.Dayjs, string> {
    if (!this.timeoutDuration) {
      return Err("Invalid duration");
    }

    return Ok(dayjs.utc().add(this.timeoutDuration));
  }
}
