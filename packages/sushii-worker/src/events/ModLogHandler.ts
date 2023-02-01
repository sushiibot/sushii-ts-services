import {
  GatewayDispatchEvents,
  APIActionRowComponent,
  APIMessageActionRowComponent,
  ButtonStyle,
  AuditLogEvent,
  GatewayGuildAuditLogEntryCreateDispatchData,
} from "discord-api-types/v10";
import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import dayjs from "dayjs";
import logger from "../logger";
import Context from "../model/context";
import EventHandler from "./EventHandler";
import { ModLog } from "../generated/graphql";
import { ActionType } from "../interactions/moderation/ActionType";
import customIds from "../interactions/customIds";
import { TimeoutChange, getTimeoutChangeData } from "../types/TimeoutChange";
import buildModLogEmbed from "../builders/buildModLogEmbed";
import { buildDMEmbed } from "../interactions/moderation/sendDm";

interface ActionTypeEventData {
  actionType: ActionType;
  targetId: string;
  executorId?: string;
  reason?: string;
  timeoutChange?: TimeoutChange;
}

function getActionTypeFromEvent(
  eventType: GatewayDispatchEvents,
  event: GatewayGuildAuditLogEntryCreateDispatchData
): ActionTypeEventData | undefined {
  if (!event.target_id) {
    return;
  }

  const base = {
    targetId: event.target_id,
    executorId: event.user_id || undefined,
    reason: event.reason || undefined,
  };

  // Executor and reason are only used for NEW mod cases.
  // This means actionss with commands, e.g. ban with command will not use
  // these executorId/reason values since these are set by sushii
  switch (event.action_type) {
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
        ...base,
      };
    }
    default:
  }
}

function buildModLogComponents(
  ctx: Context,
  actionType: ActionType,
  event: GatewayGuildAuditLogEntryCreateDispatchData,
  modCase: Omit<ModLog, "nodeId" | "mutesByGuildIdAndCaseId">
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
        caseId: modCase.caseId,
      })
    );

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

  return [row.toJSON()];
}

export default class ModLogHandler extends EventHandler {
  eventTypes = [
    // All mod events, bans, kicks and timeouts
    GatewayDispatchEvents.GuildAuditLogEntryCreate,
  ];

  async handler(
    ctx: Context,
    eventType: GatewayDispatchEvents,
    event: GatewayGuildAuditLogEntryCreateDispatchData
  ): Promise<void> {
    // Initial deployment guilds, bp and test
    if (
      event.guild_id !== "187450744427773963" &&
      event.guild_id !== "167058919611564043"
    ) {
      return;
    }

    const { guildConfigById } = await ctx.sushiiAPI.sdk.guildConfigByID({
      guildId: event.guild_id,
    });

    // No guild config found, ignore
    if (
      !guildConfigById || // Config not found
      !guildConfigById.logMod || // No mod log set
      !guildConfigById.logModEnabled // Mod log disabled
    ) {
      return;
    }

    const actionTypeData = getActionTypeFromEvent(eventType, event);
    if (!actionTypeData) {
      return;
    }

    const { actionType, executorId, reason, timeoutChange } = actionTypeData;
    logger.debug("received mod log type %s", actionType);

    // No target ID found in event, ignore
    if (!event.target_id) {
      // Unrelated audit log event
      return;
    }

    const userRes = await ctx.REST.getUser(event.target_id);
    const targetUser = userRes.unwrap();

    const pendingCases = await ctx.sushiiAPI.sdk.getPendingModLog({
      guildId: event.guild_id,
      userId: event.target_id,
      action: actionType,
    });

    let matchingCase = pendingCases.allModLogs?.nodes.at(0);
    if (matchingCase) {
      // Now - 1 minute
      const minimumTime = dayjs.utc().subtract(1, "minute");
      const actionTime = dayjs.utc(matchingCase.actionTime);

      // If action time is older than 1 minute
      if (actionTime.isBefore(minimumTime)) {
        // Ignore if the action is more than 1 minute old
        matchingCase = undefined;
      }
    }

    // If there is a matching case AND if it was created in the last minute
    if (matchingCase) {
      // Mark case as not pending
      await ctx.sushiiAPI.sdk.updateModLog({
        guildId: event.guild_id,
        caseId: matchingCase.caseId,
        modLogPatch: {
          // There is already executor ID if this was found
          pending: false,
        },
      });
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
        guildId: event.guild_id,
      });

      if (!nextCaseId) {
        throw new Error("Failed to get next case ID");
      }

      const newModLog = await ctx.sushiiAPI.sdk.createModLog({
        modLog: {
          guildId: event.guild_id,
          caseId: nextCaseId,
          userId: event.target_id,
          action: actionType,
          reason,
          actionTime: dayjs().utc().toISOString(),
          pending: false,
          executorId,
          userTag: `${targetUser.username}#${targetUser.discriminator}`,
        },
      });

      if (!newModLog.createModLog?.modLog) {
        throw new Error("Failed to create mod log");
      }

      logger.debug(
        { newModLog: newModLog.createModLog.modLog },
        "Created new mod log case"
      );

      matchingCase = newModLog.createModLog.modLog;
    }

    const embed = await buildModLogEmbed(
      ctx,
      actionType,
      targetUser,
      matchingCase,
      timeoutChange
    );
    const components = buildModLogComponents(
      ctx,
      actionType,
      event,
      matchingCase
    );

    const sentMsgRes = await ctx.REST.sendChannelMessage(
      guildConfigById.logMod,
      {
        embeds: [embed.toJSON()],
        components,
      }
    );

    const sentMsg = sentMsgRes.unwrap();

    // Update message ID in db
    await ctx.sushiiAPI.sdk.updateModLog({
      caseId: matchingCase.caseId,
      guildId: matchingCase.guildId,
      modLogPatch: {
        msgId: sentMsg.id,
      },
    });

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
        event.guild_id,
        actionType,
        true, // should dm reason
        reason, // reason
        undefined, // dm message
        timeoutChange.new || undefined
      );

      await ctx.REST.dmUser(event.target_id, {
        embeds: [dmEmbed.toJSON()],
      });
    }
  }
}
