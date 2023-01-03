import {
  GatewayDispatchEvents,
  GatewayGuildMemberUpdateDispatchData,
  APIGuildMember,
  APIActionRowComponent,
  APIMessageActionRowComponent,
  ButtonStyle,
} from "discord-api-types/v10";
import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import dayjs from "dayjs";
import logger from "../logger";
import Context from "../model/context";
import EventHandler from "./EventHandler";
import { ModLog } from "../generated/graphql";
import { ActionType } from "../interactions/moderation/ActionType";
import customIds from "../interactions/customIds";
import { EventData } from "../types/ModLogEventData";
import buildModLogEmbed from "../builders/buildModLogEmbed";

function getActionTypeFromEvent(
  eventType: GatewayDispatchEvents,
  event: EventData,
  old: EventData
): ActionType | null {
  switch (eventType) {
    case GatewayDispatchEvents.GuildBanAdd:
      return ActionType.Ban;
    case GatewayDispatchEvents.GuildBanRemove:
      return ActionType.BanRemove;
    case GatewayDispatchEvents.GuildMemberUpdate: {
      const oldMember = old as APIGuildMember;
      const e = event as GatewayGuildMemberUpdateDispatchData;

      // No change in timeout
      if (
        oldMember.communication_disabled_until ===
        e.communication_disabled_until
      ) {
        return null;
      }

      // New timeout
      if (
        !oldMember.communication_disabled_until &&
        e.communication_disabled_until
      ) {
        return ActionType.Timeout;
      }

      // Timeout removed
      // This won't happen for all timeouts! Only when manually removed when it
      // is still active. Otherwise, timeouts naturally expire without an event
      if (
        oldMember.communication_disabled_until &&
        !e.communication_disabled_until
      ) {
        return ActionType.TimeoutRemove;
      }

      // Timeout updated
      if (
        oldMember.communication_disabled_until !==
        e.communication_disabled_until
      ) {
        return ActionType.TimeoutAdjust;
      }

      return null;
    }

    default:
      return null;
  }
}

function buildModLogComponents(
  ctx: Context,
  actionType: ActionType,
  event: EventData,
  modCase: Omit<ModLog, "nodeId" | "mutesByGuildIdAndCaseId">
): APIActionRowComponent<APIMessageActionRowComponent>[] {
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
    GatewayDispatchEvents.GuildBanAdd,
    GatewayDispatchEvents.GuildBanRemove,
    // Timeout
    GatewayDispatchEvents.GuildMemberUpdate,
  ];

  async handler(
    ctx: Context,
    eventType: GatewayDispatchEvents,
    event: EventData,
    old: EventData
  ): Promise<void> {
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

    const actionType = getActionTypeFromEvent(eventType, event, old);
    logger.debug("received mod log type %s", actionType);

    if (!actionType) {
      return;
    }

    const pendingCases = await ctx.sushiiAPI.sdk.getPendingModLog({
      guildId: event.guild_id,
      userId: event.user.id,
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
          pending: false,
        },
      });
    }

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
          userId: event.user.id,
          action: actionType,
          actionTime: dayjs().utc().toISOString(),
          pending: false,
          userTag: `${event.user.username}#${event.user.discriminator}`,
        },
      });

      if (!newModLog.createModLog?.modLog) {
        throw new Error("Failed to create mod log");
      }

      logger.debug("Created new mod log case %s", nextCaseId);

      matchingCase = newModLog.createModLog.modLog;
    }

    if (eventType === GatewayDispatchEvents.GuildBanAdd) {
      logger.info(event.user);
    }

    const embed = await buildModLogEmbed(
      ctx,
      actionType,
      event.user,
      matchingCase
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
  }
}
