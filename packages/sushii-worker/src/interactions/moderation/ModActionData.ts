import dayjs from "@/shared/domain/dayjs";
import { Duration } from "dayjs/plugin/duration";
import {
  Attachment,
  ChatInputCommandInteraction,
  Collection,
  GuildMember,
  User,
} from "discord.js";
import { Err, Ok, Result } from "ts-results";
import logger from "@/shared/infrastructure/logger";
import Context from "../../model/context";
import isGuildMember from "../../utils/isGuildMember";
import parseDuration from "../../utils/parseDuration";
import { ActionType } from "./ActionType";
import { DMReasonChoiceValue, ModerationOption } from "./options";

const log = logger.child({ module: "ModActionData" });

const ID_REGEX = /\d{17,20}/g;

export interface ModActionTarget {
  user: User;
  member: GuildMember | null;
}

/**
 * Common moderation command data
 */
export default class ModActionData {
  public actionType: ActionType;

  public options: ChatInputCommandInteraction["options"];

  public targets = new Map<string, ModActionTarget>();

  public invoker: User;

  public reason: string | null;

  public attachment: Attachment | null;

  // Only exists for ban
  public deleteMessageDays: number | null;

  /**
   * Duration of timeout, only exists for timeout and tempban command
   */
  public duration: Duration | null;

  public durationStr: string | null;

  private DMReason?: boolean;

  constructor(
    interaction: ChatInputCommandInteraction,
    actionType: ActionType,
  ) {
    this.actionType = actionType;
    this.options = interaction.options;

    this.invoker = interaction.user;

    // Reason or note
    this.reason =
      this.options.getString(ModerationOption.Reason) ||
      this.options.getString(ModerationOption.Note);
    this.attachment = this.options.getAttachment(ModerationOption.Attachment);

    this.deleteMessageDays = this.options.getInteger(
      ModerationOption.DaysToDelete,
    );

    this.durationStr = this.options.getString(ModerationOption.Duration);
    if (this.durationStr) {
      // Could be null if invalid -- validate() should catch this
      this.duration = parseDuration(this.durationStr);
    } else {
      this.duration = null;
    }

    // TODO: Configurable options for DM reason defaults
    const dmReasonString = this.options.getString(ModerationOption.DMReason);

    // If dmReasonString not provided, keep it undefined
    if (dmReasonString !== null) {
      this.DMReason = dmReasonString === DMReasonChoiceValue.Yes;
    }
  }

  /**
   * Should DM user, whether it be reason or a custom dm message, or both
   *
   * @param actionType
   * @returns
   */
  shouldDMReason(actionType: ActionType): boolean {
    // Warn always DMs, even if no reason provided
    if (actionType === ActionType.Warn) {
      return true;
    }

    // Don't DM if no reason provided - no point DMing a timeout if no reason
    // since the duration is shown in the server
    if (!this.reason) {
      return false;
    }

    // Unban never sends DM - user can never receive it
    if (actionType === ActionType.BanRemove) {
      return false;
    }

    // Timeout DMs by default (DMReason undefined), but follows DMReason if provided
    if (actionType === ActionType.Timeout && this.DMReason === undefined) {
      return true;
    }

    // If not provided, default to no dm.
    return this.DMReason || false;
  }

  async fetchTargets(
    ctx: Context,
    interaction: ChatInputCommandInteraction,
    skipMembers?: boolean,
  ): Promise<Result<void, string>> {
    log.debug(
      {
        interactionId: interaction.id,
      },
      "fetching targets",
    );

    if (!interaction.inCachedGuild()) {
      return Err("This command can only be used in cached guild.");
    }

    // Get IDs from string
    const targetsString = this.options.getString(ModerationOption.Users);
    if (!targetsString) {
      // user option should be required so this should only throw if very wrong.
      return Err("No target users provided");
    }

    log.debug(
      {
        interactionId: interaction.id,
        targetsString,
      },
      "targets string",
    );

    const targetIds = targetsString.match(ID_REGEX);
    if (!targetIds) {
      return Err(
        "No users were provided, please specify which users to target with IDs or mentions.",
      );
    }

    log.debug({
      interactionId: interaction.id,
      targetIds,
    });

    if (targetIds.length > 25) {
      return Err("You can't target more than 25 users at once.");
    }

    // For each ID, check if in resolved (mentioned)
    // else fetch member/user from API

    // Resolved users only contains mentions, not raw IDs
    const resolvedUsers = this.options.resolved?.users || new Collection();

    // Members can be missing if the target is not in the guild
    const resolvedMembers = this.options.resolved?.members || new Collection();

    const targetMemberPromises = [];
    const targetUserPromises = [];

    for (const id of targetIds) {
      const resolvedUser = resolvedUsers.get(id);
      const resolvedMember = resolvedMembers.get(id);

      // Raw ID provided, fetch member from API if not in resolved
      // Don't fetch members if skipMembers is true -- skipMembers if doing things
      // like unban where the member is not in the guild.
      if (!skipMembers && !resolvedUser && !resolvedMember) {
        targetMemberPromises.push(interaction.guild.members.fetch(id));
      }

      // Fetch member if not cached
      if (
        !skipMembers &&
        !resolvedUser &&
        resolvedMember &&
        !isGuildMember(resolvedMember)
      ) {
        targetMemberPromises.push(interaction.guild.members.fetch(id));
      }

      // Skipping members, fetch user
      if (skipMembers && !resolvedUser && !resolvedMember) {
        targetUserPromises.push(interaction.client.users.fetch(id));
      }

      // Mentioned and is a member object
      if (resolvedUser && resolvedMember && isGuildMember(resolvedMember)) {
        this.targets.set(id, {
          user: resolvedUser,
          member: resolvedMember,
        });
      }

      // Mentioned but not in guild
      if (resolvedUser && !resolvedMember) {
        this.targets.set(id, {
          user: resolvedUser,
          member: null,
        });
      }
    }

    // Resolve all member fetches
    const targetMembersResult = await Promise.allSettled(targetMemberPromises);

    log.debug(
      {
        interactionId: interaction.id,
        targetMembersResult: targetMembersResult.map((r) => r.status),
      },
      "resolved target members",
    );

    for (let i = 0; i < targetMembersResult.length; i += 1) {
      const result = targetMembersResult[i];

      if (result.status === "fulfilled") {
        const member = result.value;

        // User will always exist if fetched from API
        this.targets.set(member.id, {
          user: member.user,
          member,
        });
      } else {
        // Member not found, not in guild so fetch user
        // allSettled promises are in the same order as targetIds
        targetUserPromises.push(interaction.client.users.fetch(targetIds[i]));

        logger.debug(
          "fetch member not found (%s - %s), fetching user instead",
          result.reason,
          result.status,
        );
      }
    }

    log.debug(
      {
        interactionId: interaction.id,
        targetUserPromises: targetUserPromises.length,
      },
      "fetching target users instead of members",
    );

    // Resolve all user fetches -- non-members
    const targetUsersResult = await Promise.allSettled(targetUserPromises);
    for (let i = 0; i < targetUsersResult.length; i += 1) {
      const result = targetUsersResult[i];

      if (result.status === "fulfilled") {
        const user = result.value;

        // User will always exist if fetched from API (unless invalid id of course)
        this.targets.set(user.id!, {
          user,
          member: null,
        });
      } else {
        // Usually just cause it's invalid
        logger.debug(
          result.reason,
          "fetch user promise rejected, skipping user.",
        );
      }
    }

    log.debug(
      {
        interactionId: interaction.id,
        targetUsersResult: targetUsersResult.map((r) => r.status),
      },
      "fetched users",
    );

    if (this.targets.size === 0) {
      return Err(
        "No valid target users were found. Please check IDs are correct and try again.",
      );
    }

    return Ok.EMPTY;
  }

  durationEnd(): dayjs.Dayjs | null {
    if (!this.durationStr) {
      return null;
    }

    // This is **required** to exist if it's a timeout command, so it will
    // only be null if it's an invalid duration.
    const duration = parseDuration(this.durationStr);
    if (!duration) {
      throw new Error(
        `durationStr '${this.durationStr}' is not a valid duration, should be validated in validate()`,
      );
    }

    return dayjs.utc().add(duration);
  }

  validate(): Result<void, string> {
    if (this.reason && this.reason.length > 1024) {
      return Err("Reason must be less than 1024 characters");
    }

    // Not a tempban or timeout, no duration to validate
    if (![ActionType.TempBan, ActionType.Timeout].includes(this.actionType)) {
      return Ok.EMPTY;
    }

    if (this.durationStr && !this.duration) {
      log.debug(
        {
          actionType: this.actionType,
          durationStr: this.durationStr,
        },
        "Invalid duration in validate()",
      );

      return Err(
        "Invalid duration! Please use a valid duration such as 1d, 6h, etc.",
      );
    }

    return Ok.EMPTY;
  }
}
