import {
  APIActionRowComponent,
  APIMessageActionRowComponent,
  ButtonStyle,
  AuditLogEvent,
} from "discord-api-types/v10";
import {
  ActionRowBuilder,
  ButtonBuilder,
  Events,
  Guild,
  GuildAuditLogsEntry,
  User,
} from "discord.js";
import dayjs from "dayjs";
import logger from "../logger";
import Context from "../model/context";
import { EventHandlerFn } from "./EventHandler";
import { ActionType } from "../interactions/moderation/ActionType";
import customIds from "../interactions/customIds";
import { TimeoutChange, getTimeoutChangeData } from "../types/TimeoutChange";
import buildModLogEmbed from "../builders/buildModLogEmbed";
import { buildDMEmbed } from "../interactions/moderation/sendDm";
import db from "../model/db";

interface ActionTypeEventData {
  actionType: ActionType;
  targetId: string;
  executorId?: string;
  reason?: string;
  timeoutChange?: TimeoutChange;
}

function getActionTypeFromEvent(
  event: GuildAuditLogsEntry
): ActionTypeEventData | undefined {
  if (!event.targetId) {
    return;
  }

  const base = {
    targetId: event.targetId,
    executorId: event.executorId || undefined,
    reason: event.reason || undefined,
  };

  // Executor and reason are only used for NEW mod cases.
  // This means actionss with commands, e.g. ban with command will not use
  // these executorId/reason values since these are set by sushii
  switch (event.action) {
    case AuditLogEvent.MemberBanAdd: {
      return {
        actionType: ActionType.Ban,
        ...base,
      };
    }
    case AuditLogEvent.MemberBanRemove: {
      return {
        actionType: ActionType.BanRemove,
        ...base,
      };
    }
    case AuditLogEvent.MemberKick: {
      return {
        actionType: ActionType.Kick,
        ...base,
      };
    }
    case AuditLogEvent.MemberUpdate: {
      const timeoutData = getTimeoutChangeData(event);

      // Not timed out, likely a profile update
      if (!timeoutData) {
        return;
      }

      return {
        actionType: timeoutData.actionType,
        timeoutChange: timeoutData,
        ...base,
      };
    }
    default:
  }
}

interface ModLogComponents {
  reason: string | null;
  case_id: string;
}

export function buildModLogComponents(
  actionType: ActionType,
  modCase: ModLogComponents
): APIActionRowComponent<APIMessageActionRowComponent>[] {
  // Currently only add button for ban and timeout
  if (actionType !== ActionType.Ban && actionType !== ActionType.Timeout) {
    return [];
  }

  // TODO: Add buttons for DM sent, DM delete
  // This requires the dm status to be set in database as it is sent async
  // in a command vs this is the detached event handler

  if (modCase.reason) {
    // Already has reason, no need to add button
    return [];
  }

  const button = new ButtonBuilder()
    .setEmoji({
      name: "📝",
    })
    .setStyle(ButtonStyle.Secondary)
    .setLabel("Set reason")
    .setCustomId(
      customIds.modLogReason.compile({
        caseId: modCase.case_id,
      })
    );

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

  return [row.toJSON()];
}

const modLogHandler: EventHandlerFn<Events.GuildAuditLogEntryCreate> = async (
  ctx: Context,
  event: GuildAuditLogsEntry,
  guild: Guild
): Promise<void> => {
  const { guildConfigById } = await ctx.sushiiAPI.sdk.guildConfigByID({
    guildId: guild.id,
  });

  logger.debug(
    {
      guildId: guild.id,
      modlogChannelId: guildConfigById?.logMod,
      modlogEnabled: guildConfigById?.logModEnabled,
    },
    "mod log event"
  );

  // No guild config found, ignore
  if (
    !guildConfigById || // Config not found
    !guildConfigById.logMod || // No mod log set
    !guildConfigById.logModEnabled // Mod log disabled
  ) {
    return;
  }

  const actionTypeData = getActionTypeFromEvent(event);
  if (!actionTypeData) {
    logger.debug(
      {
        changes: event.changes,
      },
      "no action type data found"
    );
    return;
  }

  const { actionType, executorId, reason, timeoutChange } = actionTypeData;
  logger.debug(
    {
      guildId: guild.id,
      actionType,
      executorId,
      reason,
      timeoutChange,
    },
    "received mod log"
  );

  // No target ID found in event, ignore
  if (!event.targetId || event.targetType !== "User") {
    // Unrelated audit log event
    return;
  }

  const targetUser = await guild.client.users.fetch(event.targetId);

  let matchingCase = await db
    .selectFrom("app_public.mod_logs")
    .selectAll()
    .where("guild_id", "=", guild.id)
    .where("user_id", "=", event.targetId)
    .where("action", "=", actionType)
    .where("pending", "=", true)
    .orderBy("action_time", "desc")
    .executeTakeFirst();

  if (matchingCase) {
    // Now - 1 minute
    const minimumTime = dayjs.utc().subtract(1, "minute");
    const actionTime = dayjs.utc(matchingCase.action_time);

    // If action time is older than 1 minute
    if (actionTime.isBefore(minimumTime)) {
      // Ignore if the action is more than 1 minute old
      matchingCase = undefined;
    }
  }

  // If there is a matching case AND if it was created in the last minute
  if (matchingCase) {
    // Mark case as not pending
    await db
      .updateTable("app_public.mod_logs")
      .where("guild_id", "=", guild.id)
      .where("case_id", "=", matchingCase.case_id)
      // There is already executor ID if this was found
      .set({
        pending: false,
      })
      .execute();
  }

  // If this is a native manual timeout, we want to DM the user the reason.
  // ONLY DM if it is a **timeout,** ban reasons cannot be DM'd here
  // No DM for adjust, since regular users cannot use it.
  //
  // Not necessary to check if the target is a member, since you cannot
  // timeout a non-member.
  const shouldDMReason =
    !matchingCase &&
    (ActionType.Timeout === actionType ||
      ActionType.TimeoutRemove === actionType);

  // Create a new case if there isn't a pending case
  if (!matchingCase) {
    logger.debug("No pending case found, creating new case");

    const { nextCaseId } = await ctx.sushiiAPI.sdk.getNextCaseID({
      guildId: guild.id,
    });

    if (!nextCaseId) {
      throw new Error("Failed to get next case ID");
    }

    const newModLog = await db
      .insertInto("app_public.mod_logs")
      .values({
        guild_id: guild.id,
        case_id: nextCaseId,
        action: actionType,
        pending: false,
        user_id: event.targetId,
        user_tag: `${targetUser.username}#${targetUser.discriminator}`,
        executor_id: executorId,
        action_time: dayjs().utc().toISOString(),
        reason,
        // This is set in the mod logger
        msg_id: undefined,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    logger.debug({ newModLog }, "Created new mod log case");

    matchingCase = newModLog;
  }

  const embed = await buildModLogEmbed(
    ctx,
    actionType,
    targetUser,
    matchingCase,
    timeoutChange
  );
  const components = buildModLogComponents(actionType, matchingCase);

  const channel = await guild.channels.fetch(guildConfigById.logMod);

  if (!channel?.isTextBased()) {
    throw new Error("Mod log channel is not text based");
  }

  const sentMsg = await channel.send({
    embeds: [embed.toJSON()],
    components,
  });

  // Update message ID in db
  await db
    .updateTable("app_public.mod_logs")
    .where("guild_id", "=", guild.id)
    .where("case_id", "=", matchingCase.case_id)
    // There is already executor ID if this was found
    .set({
      msg_id: sentMsg.id,
    })
    .execute();

  if (
    shouldDMReason &&
    (timeoutChange?.actionType === ActionType.Timeout ||
      timeoutChange?.actionType === ActionType.TimeoutRemove)
  ) {
    // DM the user the reason if it is a timeout
    // Ignore cases where timeout is adjusted, since that can only done through a bot command.
    // Users can only add or remove timeouts.

    const dmEmbed = await buildDMEmbed(
      ctx,
      guild,
      actionType,
      true, // should dm reason
      reason || null, // reason
      timeoutChange.new || null
    );

    if (event.target instanceof User) {
      await event.target.send({
        embeds: [dmEmbed.toJSON()],
      });
    }
  }
};

export default modLogHandler;
