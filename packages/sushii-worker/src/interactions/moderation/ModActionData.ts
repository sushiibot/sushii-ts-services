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
import { ActionType } from "./ActionType";
import { ModerationOption } from "./options";

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

  private DMReason?: boolean;

  public dmMessage?: string;

  constructor(interaction: APIChatInputApplicationCommandGuildInteraction) {
    this.options = new CommandInteractionOptionResolver(
      interaction.data.options,
      interaction.data.resolved
    );

    this.invoker = getInvokerUser(interaction);

    // Reason or note
    this.reason =
      this.options.getString(ModerationOption.Reason) ||
      this.options.getString(ModerationOption.Note);
    this.attachment = this.options.getAttachment(ModerationOption.Attachment);

    this.deleteMessageDays = this.options.getInteger(
      ModerationOption.DaysToDelete
    );

    const durationStr = this.options.getString(ModerationOption.Duration);

    if (durationStr) {
      // This is **required** to exist if it's a timeout command, so it will
      // only be null if it's an invalid duration.
      this.timeoutDuration = parseDuration(durationStr) || undefined;
    }

    this.DMReason = this.options.getBoolean(ModerationOption.DMReason);

    this.dmMessage = this.options.getString(ModerationOption.DMMessage);
  }

  /**
   * Should DM user, whether it be reason or a custom dm message, or both
   *
   * @param actionType
   * @returns
   */
  shouldDM(actionType: ActionType): boolean {
    return this.shouldDMReason(actionType) || !!this.dmMessage;
  }

  shouldDMReason(actionType: ActionType): boolean {
    // Unban never sends DM
    if (actionType === ActionType.BanRemove) {
      return false;
    }

    // Warn always DMs
    if (actionType === ActionType.Warn) {
      return true;
    }

    // Don't DM if no reason provided
    if (!this.reason) {
      return false;
    }

    // If not provided, default to no dm.
    return this.DMReason || false;
  }

  getDmMessage(): string | undefined {
    // Only DM reason if dm_reason True
    if (this.DMReason) {
      return this.reason;
    }

    // Return DM message if provided
    return this.dmMessage;
  }

  dmMessageType(): "reason" | "message" | undefined {
    // DM message has priority even if dm_reason is true
    if (this.dmMessage) {
      return "message";
    }

    if (this.DMReason) {
      return "reason";
    }
  }

  async fetchTargets(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    skipMembers?: boolean
  ): Promise<Result<void, string>> {
    // Get IDs from string
    const targetsString = this.options.getString(ModerationOption.Users);
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

    if (targetIds.length > 25) {
      return Err("You can't target more than 25 users at once.");
    }

    // For each ID, check if in resolved (mentioned)
    // else fetch member/user from API

    // Resolved users only contains mentions, not raw IDs
    const resolvedUsers = this.options.getResolvedUsers();

    // Members can be missing if the target is not in the guild
    const resolvedMembers = this.options.getResolveMembers();

    const targetMemberPromises = [];
    const targetUserPromises = [];

    for (const id of targetIds) {
      // Raw ID provided, fetch member from API if not in resolved
      // Don't fetch members if skipMembers is true -- skipMembers if doing things
      // like unban where the member is not in the guild.
      if (!skipMembers && !resolvedUsers[id] && !resolvedMembers[id]) {
        targetMemberPromises.push(ctx.REST.getMember(interaction.guild_id, id));
      }

      // Skipping members, fetch user
      if (skipMembers && !resolvedUsers[id] && !resolvedMembers[id]) {
        targetUserPromises.push(ctx.REST.getUser(id));
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

    if (this.targets.size === 0) {
      return Err(
        "No valid target users were found. Please check IDs are correct and try again."
      );
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
