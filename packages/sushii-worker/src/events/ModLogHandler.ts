import { ButtonStyle, AuditLogEvent } from "discord-api-types/v10";
import {
  ActionRowBuilder,
  ButtonBuilder,
  DiscordAPIError,
  Events,
  Guild,
  GuildAuditLogsEntry,
} from "discord.js";
import dayjs from "@/shared/domain/dayjs";
import { newModuleLogger } from "@/shared/infrastructure/logger";
import Context from "../model/context";
import { EventHandlerFn } from "./EventHandler";
import { ActionType } from "../interactions/moderation/ActionType";
import customIds from "../interactions/customIds";
import { TimeoutChange, getTimeoutChangeData } from "../types/TimeoutChange";
import buildModLogEmbed from "../features/moderation/presentation/buildModLogEmbed";
import { buildDMEmbed } from "../interactions/moderation/sendDm";
import db from "../infrastructure/database/db";
import { insertModLog, upsertModLog } from "../db/ModLog/ModLog.repository";
import { getGuildConfig } from "../db/GuildConfig/GuildConfig.repository";

const log = newModuleLogger("ModLogHandler");

interface ActionTypeEventData {
  actionType: ActionType;
  targetId: string;
  executorId?: string;
  reason?: string;
  timeoutChange?: TimeoutChange;
}

function getActionTypeFromEvent(
  event: GuildAuditLogsEntry,
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
  dm_channel_id: string | null;
  dm_message_id: string | null;
  dm_message_error: string | null;
}

export function buildModLogComponents(
  actionType: ActionType,
  modCase: ModLogComponents,
  dmDeleted: boolean = false,
): ActionRowBuilder<ButtonBuilder>[] {
  const row = new ActionRowBuilder<ButtonBuilder>();

  log.debug(
    {
      actionType,
      modCase,
    },
    "Building mod log components",
  );

  if (modCase.dm_channel_id && modCase.dm_message_id && modCase.reason) {
    const statusEmoji = dmDeleted ? "🗑️" : "📬";
    const statusLabel = dmDeleted ? "Reason DM deleted" : "Reason DM sent";

    const dmSentButton = new ButtonBuilder()
      .setEmoji({
        name: statusEmoji,
      })
      .setStyle(ButtonStyle.Secondary)
      .setLabel(statusLabel)
      .setCustomId("noop")
      .setDisabled(true);

    row.addComponents(dmSentButton);

    // Only add delete button if the DM is not already deleted
    if (!dmDeleted) {
      const deleteDMButton = new ButtonBuilder()
        .setEmoji({
          name: "🗑️",
        })
        .setStyle(ButtonStyle.Secondary)
        .setLabel("Delete reason DM")
        .setDisabled(dmDeleted)
        .setCustomId(
          customIds.modLogDeleteReasonDM.compile({
            caseId: modCase.case_id,
            channelId: modCase.dm_channel_id,
            messageId: modCase.dm_message_id,
          }),
        );

      row.addComponents(deleteDMButton);
    }
  }

  if (modCase.dm_message_error) {
    const dmFailedButton = new ButtonBuilder()
      .setEmoji({
        name: "❌",
      })
      .setStyle(ButtonStyle.Secondary)
      .setLabel("Reason DM failed")
      .setCustomId("noop")
      .setDisabled(true);

    row.addComponents(dmFailedButton);
  }

  // If not ban and timeout, return without adding reason button
  if (actionType !== ActionType.Ban && actionType !== ActionType.Timeout) {
    if (row.components.length === 0) {
      log.debug(
        {
          actionType,
          modCase,
        },
        "No mod log components built",
      );
      return [];
    }

    log.debug(
      {
        actionType,
        modCase,
        row,
      },
      "mod log components built",
    );
    return [row];
  }

  // Already has reason, no need to add reason button, but still want to keep
  // the DM buttons
  if (modCase.reason && row.components.length > 0) {
    return [row];
  }

  // Has reason, but no DM buttons, return empty components
  if (modCase.reason) {
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
      }),
    );

  row.addComponents(button);

  return [row];
}

const modLogHandler: EventHandlerFn<Events.GuildAuditLogEntryCreate> = async (
  ctx: Context,
  event: GuildAuditLogsEntry,
  guild: Guild,
): Promise<void> => {
  const actionTypeData = getActionTypeFromEvent(event);
  if (!actionTypeData) {
    return;
  }

  const { actionType, executorId, reason, timeoutChange } = actionTypeData;
  log.debug(
    {
      guildId: guild.id,
      actionType,
      executorId,
      reason,
      timeoutChange,
    },
    "received mod log",
  );

  // Check event before fetching guild config
  const conf = await getGuildConfig(db, guild.id);

  // No guild config found, ignore
  if (
    !conf.log_mod || // No mod log set
    !conf.log_mod_enabled // Mod log disabled
  ) {
    return;
  }

  // No target ID found in event, ignore
  if (!event.targetId || event.targetType !== "User") {
    // Unrelated audit log event
    return;
  }

  // event.target is null, only event.targetId exists
  const targetUser = await guild.client.users.fetch(event.targetId);

  let matchingCase;
  await db.transaction().execute(async (tx) => {
    matchingCase = await tx
      .selectFrom("app_public.mod_logs")
      // Make sure to wait for the executeAction to finish before selecting
      // Or the DM columns will be stale
      .forUpdate()
      .selectAll()
      .where("guild_id", "=", guild.id)
      .where("user_id", "=", event.targetId)
      .where("action", "=", actionType)
      .where("pending", "=", true)
      .orderBy("action_time", "desc")
      .executeTakeFirst();

    if (matchingCase) {
      log.debug(
        matchingCase,
        "Found pending case, checking if it is older than 1 minute",
      );
    }

    if (matchingCase) {
      // Now - 1 minute
      const minimumTime = dayjs.utc().subtract(1, "minute");
      const actionTime = dayjs.utc(matchingCase.action_time);

      // If action time is older than 1 minute
      if (actionTime.isBefore(minimumTime)) {
        log.debug(
          {
            guildId: guild.id,
            caseId: matchingCase.case_id,
          },
          "Found pending case, but it is older than 1 minute, ignoring",
        );
        // Ignore if the action is more than 1 minute old
        matchingCase = undefined;
      }
    }

    // If there is a matching case AND if it was created in the last minute
    if (matchingCase) {
      // Mark case as not pending
      const res = await tx
        .updateTable("app_public.mod_logs")
        .where("guild_id", "=", guild.id)
        .where("case_id", "=", matchingCase.case_id)
        // There is already executor ID if this was found
        .set({
          pending: false,
        })
        .executeTakeFirst();

      log.debug(
        { pendingUpdateResult: res },
        "Marked pending case as not pending",
      );
    }
  });

  // If this is a native manual timeout, we want to DM the user the reason.
  // ONLY DM if it is a **timeout,** ban reasons cannot be DM'd here
  // No DM for adjust, since regular users cannot use it.
  //
  // Not necessary to check if the target is a member, since you cannot
  // timeout a non-member.
  const shouldDMReason =
    matchingCase === undefined &&
    (ActionType.Timeout === actionType ||
      ActionType.TimeoutRemove === actionType);

  // Create a new case if there isn't a pending case
  if (!matchingCase) {
    log.debug("No pending case found, creating new case");

    // insertModLog will increment the case ID, may prevent race conditions
    // with conflicting case IDs
    const newModLog = await insertModLog(db, {
      guild_id: guild.id,
      action: actionType,
      pending: false,
      user_id: event.targetId,
      user_tag: targetUser.tag,
      executor_id: executorId,
      action_time: dayjs().utc().toISOString(),
      reason,
      // This is set in the mod logger
      msg_id: undefined,
    });

    if (!newModLog) {
      throw new Error("Failed to create new mod log case");
    }

    log.debug({ newModLog }, "Created new mod log case");

    matchingCase = newModLog;
  }

  log.debug(matchingCase, "Matching mod log case");

  let shouldSaveModLog = false;

  if (shouldDMReason && timeoutChange) {
    shouldSaveModLog = true;

    // DM the user the reason if it is a timeout
    // Ignore cases where timeout is adjusted, since that can only done through a bot command.
    // Users can only add or remove timeouts.

    log.info(
      {
        actionType,
        timeoutChange,
      },
      "Sending timeout DM to user",
    );

    const dmEmbed = await buildDMEmbed(
      ctx,
      guild,
      actionType,
      true, // should dm reason
      reason || null, // reason
      timeoutChange.new || null,
    );

    try {
      const dmMsg = await targetUser.send({
        embeds: [dmEmbed],
      });

      // modlog will be updated with the message ID later when saving message id
      // of mod log
      matchingCase.dm_channel_id = dmMsg.channel.id;
      matchingCase.dm_message_id = dmMsg.id;
    } catch (err) {
      if (err instanceof DiscordAPIError) {
        matchingCase.dm_message_error = err.message;
      }

      log.debug(
        {
          actionType,
          timeoutChange,
          eventTarget: event.target,
          err,
        },
        "Failed to send timeout DM to user",
      );
    }
  }

  const embed = await buildModLogEmbed(
    ctx,
    actionType,
    targetUser,
    matchingCase,
    timeoutChange,
  );
  const components = buildModLogComponents(actionType, matchingCase);

  let channel;
  try {
    channel = await guild.channels.fetch(conf.log_mod);
  } catch (err) {
    log.error(
      {
        guildId: guild.id,
        modLogChannelId: conf.log_mod,
        err,
      },
      "Failed to fetch mod log channel",
    );

    return;
  }

  if (!channel?.isTextBased()) {
    throw new Error("Mod log channel is not text based");
  }

  let sentMsg;
  try {
    shouldSaveModLog = true;

    sentMsg = await channel.send({
      embeds: [embed.toJSON()],
      components,
    });
  } catch (err) {
    log.debug(
      {
        actionType,
        eventTarget: event.target,
        err,
      },
      "Failed to send mod log message",
    );
  }

  if (sentMsg) {
    // Update message ID in db
    matchingCase.msg_id = sentMsg.id;
  }

  // Save mod log if it was updated
  if (shouldSaveModLog) {
    await upsertModLog(db, matchingCase);
  }
};

export default modLogHandler;
