import {
  EmbedBuilder,
  RESTJSONErrorCodes,
  ChatInputCommandInteraction,
  Message,
  User,
  DiscordAPIError,
} from "discord.js";
import dayjs from "@/shared/domain/dayjs";
import { Err, Ok, Result } from "ts-results";
import { AllSelection } from "kysely/dist/cjs/parser/select-parser";
import opentelemetry, { SpanStatusCode } from "@opentelemetry/api";
import logger from "@/shared/infrastructure/logger";
import Color from "../../utils/colors";
import toSentenceCase from "../../utils/toSentenceCase";
import { ActionType } from "./ActionType";
import hasPermissionTargetingMember from "../../utils/hasPermission";
import ModActionData, { ModActionTarget } from "./ModActionData";
import sendModActionDM from "./sendDm";
import buildModLogEmbed from "../../features/moderation/presentation/buildModLogEmbed";
import db from "../../infrastructure/database/db";
import { buildModLogComponents } from "../../events/ModLogHandler";
import { DB } from "../../infrastructure/database/dbTypes";
import {
  deleteModLog,
  getNextCaseId,
  upsertModLog,
} from "../../db/ModLog/ModLog.repository";
import { getGuildConfig } from "../../db/GuildConfig/GuildConfig.repository";
import { startCaughtActiveSpan } from "@/shared/infrastructure/tracing";
import {
  deleteTempBan,
  upsertTempBan,
} from "../../db/TempBan/TempBan.repository";

const log = logger.child({ module: "executeAction" });
const tracer = opentelemetry.trace.getTracer("sushii-worker");

interface ActionError {
  target: ModActionTarget;
  message: string;
}

function buildResponseEmbed(
  data: ModActionData,
  action: ActionType,
  content: string,
  triedDMNonMemberCount: number,
  failedDMCount: number,
): EmbedBuilder {
  const fields = [];

  fields.push({
    name: "Reason",
    value: data.reason || "No reason provided",
  });

  if (data.deleteMessageDays) {
    fields.push({
      name: "Delete message days",
      value: data.deleteMessageDays.toString(),
    });
  }

  // No delete message days
  if (action === ActionType.Ban && !data.deleteMessageDays) {
    fields.push({
      name: "Delete message days",
      value: "No messages were deleted.",
    });
  }

  if (data.duration) {
    fields.push({
      name: "Timeout duration",
      value: data.duration.humanize(),
    });
  }

  // Unban and note never has dm, no need for field
  if (![ActionType.BanRemove, ActionType.Note].includes(action)) {
    let userDMValue;

    if (data.targets.size === failedDMCount) {
      userDMValue =
        "❌ Failed to DM reason to users, their privacy settings do not allow me to DM or they have blocked me :(";
    } else if (data.shouldDMReason(action)) {
      userDMValue = "📬 Reason sent to member in DMs";
    }

    if (triedDMNonMemberCount > 0) {
      userDMValue +=
        "\n\n**Note:** Some messages were not sent to users not in this server.";
    }

    // Failed to DM all targets
    if (data.targets.size === triedDMNonMemberCount) {
      userDMValue =
        "❌ Did not send reason to the users as they are not in the server";
    }

    // Do not include field if no dm
    if (userDMValue) {
      fields.push({
        name: "User DM",
        value: userDMValue,
      });
    }
  }

  return new EmbedBuilder()
    .setTitle(
      `${toSentenceCase(ActionType.toPastTense(action))} ${
        data.targets.size
      } users`,
    )
    .setDescription(content)
    .setFields(fields)
    .setImage(data.attachment?.url || null)
    .setColor(Color.Success);
}

async function sendModLog(
  interaction: ChatInputCommandInteraction<"cached">,
  guildConfig: AllSelection<DB, "app_public.guild_configs">,
  actionType: ActionType,
  target: ModActionTarget,
  modCase: AllSelection<DB, "app_public.mod_logs">,
): Promise<void> {
  const embed = await buildModLogEmbed(
    interaction.client,
    actionType,
    target.user,
    modCase,
  );
  const components = buildModLogComponents(actionType, modCase);

  if (guildConfig.log_mod_enabled && guildConfig.log_mod) {
    const modLogChannel = await interaction.guild.channels.fetch(
      guildConfig.log_mod,
    );

    if (modLogChannel && modLogChannel.isTextBased()) {
      await modLogChannel.send({
        embeds: [embed],
        components,
      });
    }
  }
}

async function execActionUser(
  interaction: ChatInputCommandInteraction,
  data: ModActionData,
  target: ModActionTarget,
  actionType: ActionType,
): Promise<Result<ModActionTarget, ActionError>> {
  if (!interaction.inCachedGuild()) {
    throw new Error("Interaction is not in guild");
  }

  return tracer.startActiveSpan("execActionUser", async (span) => {
    // Audit log header max 512 characters
    const auditLogReason = data.reason?.slice(0, 512);

    try {
      switch (actionType) {
        case ActionType.Kick: {
          // Member already fetched earlier
          if (!target.member) {
            return Err({
              target,
              message: "User is not in the server",
            });
          }

          await interaction.guild.members.kick(target.user.id, auditLogReason);

          break;
        }
        case ActionType.Ban: {
          await interaction.guild.members.ban(target.user.id, {
            reason: auditLogReason,
            deleteMessageSeconds: (data.deleteMessageDays || 0) * 86400,
          });

          break;
        }
        case ActionType.TempBan: {
          const endDate = data.durationEnd()?.toDate();
          if (!endDate) {
            throw new Error("durationEnd is null");
          }

          await upsertTempBan(db, {
            guild_id: interaction.guildId,
            user_id: target.user.id,
            expires_at: endDate,
          });

          await interaction.guild.members.ban(target.user.id, {
            reason: auditLogReason,
            deleteMessageSeconds: (data.deleteMessageDays || 0) * 86400,
          });

          break;
        }
        case ActionType.BanRemove: {
          await interaction.guild.members.unban(target.user.id, auditLogReason);

          // Delete tempban, if any -- no error if not found
          // TODO: Actually tell user if a tempban was removed
          await deleteTempBan(db, interaction.guildId, target.user.id);

          break;
        }
        case ActionType.Timeout:
        case ActionType.TimeoutAdjust: {
          if (!target.member) {
            return Err({
              target,
              message: "User is not in the server",
            });
          }

          const endDate = data.durationEnd()?.toDate();
          if (!endDate) {
            throw new Error(`durationEnd is null for action ${actionType}`);
          }

          // Timeout and adjust are both same, just update timeout end time
          await interaction.guild.members.edit(target.user.id, {
            communicationDisabledUntil: endDate,
            reason: auditLogReason,
          });

          break;
        }
        case ActionType.TimeoutRemove: {
          if (!target.member) {
            return Err({
              target,
              message: "User is not in the server",
            });
          }

          await interaction.guild.members.edit(target.user.id, {
            communicationDisabledUntil: null,
            reason: auditLogReason,
          });

          break;
        }
        case ActionType.Warn: {
          // Only warn if member is in the server
          if (!target.member) {
            return Err({
              target,
              message: "User is not in the server",
            });
          }

          // Send to mod log only -- done after this function

          break;
        }
        case ActionType.Note: {
          // Allow for non-members, send no DM

          // Send to mod log only -- done after this function

          break;
        }
        case ActionType.Lookup:
        case ActionType.History:
          throw new Error(`unsupported action type ${actionType}`);
      }
    } catch (err) {
      if (err instanceof DiscordAPIError) {
        if (err.code === RESTJSONErrorCodes.MissingPermissions) {
          return Err({
            target,
            message:
              "I don't have permission to do this action, make sure I have the \
    `Ban Members` and`Timeout Members` permission or that my role is above the target user.",
          });
        }

        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: err.message,
        });

        return Err({
          target,
          message: err.message,
        });
      }

      throw err;
    } finally {
      span.end();
    }

    return Ok(target);
  });
}

interface ExecuteActionUserResult {
  user: User;
  shouldDM: boolean;
  failedDM: boolean;
  triedDMNonMember: boolean;
}

async function executeActionUser(
  interaction: ChatInputCommandInteraction<"cached">,
  data: ModActionData,
  target: ModActionTarget,
  incomingActionType: ActionType,
): Promise<Result<ExecuteActionUserResult, ActionError>> {
  if (!interaction.inGuild()) {
    throw new Error("Not in guild");
  }

  return startCaughtActiveSpan(tracer, "executeActionUser", async () => {
    const hasPermsTargetingMember = await hasPermissionTargetingMember(
      interaction,
      target.user,
      target.member || undefined,
    );

    if (hasPermsTargetingMember.err) {
      return Err({
        target,
        message: hasPermsTargetingMember.val,
      });
    }

    const nextCaseId = await getNextCaseId(db, interaction.guildId);

    logger.debug(
      {
        nextCaseId,
      },
      "Creating new mod log",
    );

    // Should not be pending for note or warn actions
    const isPending =
      incomingActionType !== ActionType.Note &&
      incomingActionType !== ActionType.Warn;

    // Check if member is already timed out
    const communicationDisabledUntil = dayjs.utc(
      target.member?.communicationDisabledUntil,
    );
    // This is the current timeout **before** applying the new one
    // If there is a timeout that hasn't expired yet, then this is an adjustment
    // Always false if not a timeout action
    const isTimeoutAdjust =
      incomingActionType === ActionType.Timeout &&
      communicationDisabledUntil.isValid() &&
      communicationDisabledUntil.isAfter(dayjs.utc());

    // Copy the action type and modify if needed
    let actionType = incomingActionType;
    if (isTimeoutAdjust) {
      actionType = ActionType.TimeoutAdjust;
    }

    const modLog = await upsertModLog(db, {
      guild_id: interaction.guildId,
      case_id: nextCaseId,
      action: actionType,
      pending: isPending,
      user_id: target.user.id,
      user_tag: target.user.tag,
      executor_id: data.invoker.id,
      action_time: dayjs().utc().toISOString(),
      reason: data.reason,
      attachments: data.attachment?.url ? [data.attachment.url] : [],
      // This is set in the mod logger
      msg_id: undefined,
    });

    if (!modLog) {
      throw new Error("Failed to create mod log");
    }

    log.debug(
      {
        actionType,
        guildId: interaction.guildId,
        caseId: modLog.case_id,
      },
      "Created new mod log entry",
    );

    // Only DM if (dm_reason true or has dm_message) AND if target is in the server.
    const shouldDM = data.shouldDMReason(actionType) && target.member !== null;

    const triedDMNonMember =
      data.shouldDMReason(actionType) && target.member === null;

    log.debug({
      shouldDM,
      triedDMNonMember,
    });

    let dmRes: Result<Message, string> | null = null;

    await db.transaction().execute(async (tx) => {
      // Lock the row for mod log
      // If there isn't a lock, the mod log handler will already be done by the
      // time the dm is sent.
      await tx
        .selectFrom("app_public.mod_logs")
        .forUpdate()
        .selectAll()
        .where("guild_id", "=", modLog.guild_id)
        .where("case_id", "=", modLog.case_id)
        .execute();

      // DM before for ban and send dm
      if (actionType === ActionType.Ban && shouldDM) {
        dmRes = await sendModActionDM(
          interaction,
          data,
          target.user,
          actionType,
        );
      }

      // Only throw if we do NOT want a mod log case, e.g. fail to kick/ban/mute
      // REST methods will throw if it is not a successful request
      const res = await execActionUser(interaction, data, target, actionType);

      // DM after for non-ban and send dm
      if (actionType !== ActionType.Ban && shouldDM) {
        dmRes = await sendModActionDM(
          interaction,
          data,
          target.user,
          actionType,
        );
      }

      // Revert stuff if failed to execute action
      if (res.err) {
        // Delete DM reason if it was sent
        let deleteDMPromise;
        if (dmRes && dmRes.ok) {
          // No need to catch err here, not awaited
          deleteDMPromise = dmRes.val.delete();
        }

        log.debug(
          {
            actionType,
            guildId: interaction.guildId,
            caseId: modLog.case_id,
          },
          "Failed to execute action, deleting mod log and dm",
        );

        const [resDeleteModLog, resDeleteDM] = await Promise.allSettled([
          deleteModLog(tx, interaction.guildId, nextCaseId.toString()),
          deleteDMPromise,
        ]);

        if (resDeleteModLog.status === "rejected") {
          logger.error(resDeleteModLog.reason, "failed to delete mod log");
        }

        if (resDeleteDM.status === "rejected") {
          logger.error(resDeleteDM.reason, "failed to delete mod log DM");
        }

        return res;
      }

      if (dmRes !== null) {
        // If DM was attempted AND if it success - set channel & ID
        if (dmRes.ok) {
          modLog.dm_channel_id = dmRes.val.channelId;
          modLog.dm_message_id = dmRes.val.id;
        } else {
          // Otherwise, set the error
          modLog.dm_message_error = dmRes.val;
        }

        // Update mod log again with DM details
        logger.debug("Upserting mod log with DM details");
        await upsertModLog(tx, modLog);
        logger.debug("Updated mod log with DM details");
      } else {
        logger.debug("No DM result");
      }
    });

    // Send mod log if needed - warn / note
    // AFTER: DM was sent (warn) so the components are created properly
    if (actionType === ActionType.Warn || actionType === ActionType.Note) {
      const guildConfig = await getGuildConfig(db, interaction.guildId);

      await sendModLog(interaction, guildConfig, actionType, target, modLog);
    }

    return Ok({
      user: target.user,
      shouldDM,
      failedDM: !!modLog.dm_message_error,
      triedDMNonMember,
    });
  });
}

export default async function executeAction(
  interaction: ChatInputCommandInteraction<"cached">,
  data: ModActionData,
  actionType: ActionType,
): Promise<Result<EmbedBuilder, Error>> {
  if (!interaction.guildId) {
    return Err(new Error("Guild ID is missing"));
  }

  return startCaughtActiveSpan(tracer, "executeAction", async () => {
    let msg = "";

    // If executor wants to DM, but target is not a member
    let triedDMNonMemberCount = 0;
    // If executor wants to DM, but failed to send DM probably cuz of privacy settings
    let failedDMCount = 0;

    log.debug(
      {
        actionType,
        targets: data.targets.size,
      },
      "Executing mod action",
    );

    for (const [, target] of data.targets) {
      // Should be synchronous so we don't reuse the same case ID

      const res = await executeActionUser(
        interaction,
        data,
        target,
        actionType,
      );

      if (res.err) {
        msg += `:x: <@${res.val.target.user.id}> (\`${res.val.target.user.id}\`) - ${res.val.message}`;
      } else {
        msg += `${ActionType.toEmoji(actionType)} `;

        if (res.val.failedDM) {
          msg += "❌ ";
          failedDMCount += 1;
        } else if (res.val.shouldDM) {
          // Add emoji if DM was send to user
          msg += "📬 ";
        }

        msg += `<@${res.val.user.id}> (\`${res.val.user.id}\`)`;

        // Makes triedDMNonMember true if any returned value is true
        triedDMNonMemberCount += res.val.triedDMNonMember ? 1 : 0;
      }

      msg += "\n";
    }

    log.debug(
      {
        actionType,
        targets: data.targets.size,
        failedDMCount,
      },
      "Done executing mod action",
    );

    return Ok(
      buildResponseEmbed(
        data,
        actionType,
        msg,
        triedDMNonMemberCount,
        failedDMCount,
      ),
    );
  });
}
