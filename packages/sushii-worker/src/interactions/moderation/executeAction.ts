import {
  EmbedBuilder,
  RESTJSONErrorCodes,
  ChatInputCommandInteraction,
  Message,
  User,
  DiscordAPIError,
} from "discord.js";
import dayjs from "dayjs";
import { Err, Ok, Result } from "ts-results";
import { AllSelection } from "kysely/dist/cjs/parser/select-parser";
import opentelemetry, { SpanStatusCode } from "@opentelemetry/api";
import logger from "../../logger";
import Context from "../../model/context";
import Color from "../../utils/colors";
import toSentenceCase from "../../utils/toSentenceCase";
import { ActionType } from "./ActionType";
import hasPermissionTargetingMember from "../../utils/hasPermission";
import ModActionData, { ModActionTarget } from "./ModActionData";
import sendModActionDM from "./sendDm";
import buildModLogEmbed from "../../builders/buildModLogEmbed";
import db from "../../model/db";
import { buildModLogComponents } from "../../events/ModLogHandler";
import { DB } from "../../model/dbTypes";
import {
  deleteModLog,
  getNextCaseId,
  upsertModLog,
} from "../../db/ModLog/ModLog.repository";
import { getGuildConfig } from "../../db/GuildConfig/GuildConfig.repository";
import { startCaughtActiveSpan } from "../../tracing";

const log = logger.child({ module: "executeAction" });
const tracer = opentelemetry.trace.getTracer("sushii-worker");

interface ActionError {
  target: ModActionTarget;
  message: string;
}

function buildResponseEmbed(
  ctx: Context,
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

  if (data.timeoutDuration) {
    fields.push({
      name: "Timeout duration",
      value: data.timeoutDuration.humanize(),
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
  ctx: Context,
  interaction: ChatInputCommandInteraction<"cached">,
  guildConfig: AllSelection<DB, "app_public.guild_configs">,
  actionType: ActionType,
  target: ModActionTarget,
  modCase: AllSelection<DB, "app_public.mod_logs">,
): Promise<void> {
  const embed = await buildModLogEmbed(ctx, actionType, target.user, modCase);
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
  ctx: Context,
  interaction: ChatInputCommandInteraction,
  data: ModActionData,
  target: ModActionTarget,
  actionType: ActionType,
  modCase: AllSelection<DB, "app_public.mod_logs">,
): Promise<Result<ModActionTarget, ActionError>> {
  if (!interaction.inCachedGuild()) {
    throw new Error("Interaction is not in guild");
  }

  return tracer.startActiveSpan("execActionUser", async (span) => {
    // Audit log header max 512 characters
    const auditLogReason = data.reason?.slice(0, 512);

    const guildConfig = await getGuildConfig(db, interaction.guildId);

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
        case ActionType.BanRemove: {
          await interaction.guild.members.unban(target.user.id, auditLogReason);

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

          // Timeout and adjust are both same, just update timeout end time
          await interaction.guild.members.edit(target.user.id, {
            communicationDisabledUntil: data
              .communicationDisabledUntil()
              .unwrap()
              .toISOString(),
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

          await sendModLog(
            ctx,
            interaction,
            guildConfig,
            actionType,
            target,
            modCase,
          );

          break;
        }
        case ActionType.Note: {
          // Allow for non-members, send no DM

          // Send to mod log only
          await sendModLog(
            ctx,
            interaction,
            guildConfig,
            actionType,
            target,
            modCase,
          );

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
  ctx: Context,
  interaction: ChatInputCommandInteraction<"cached">,
  data: ModActionData,
  target: ModActionTarget,
  actionType: ActionType,
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
      actionType !== ActionType.Note && actionType !== ActionType.Warn;

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
    const shouldDM = data.shouldDM(actionType) && target.member !== null;

    const triedDMNonMember =
      data.shouldDM(actionType) && target.member === null;

    let dmRes: Result<Message, string> | null = null;
    // DM before for ban and send dm
    if (actionType === ActionType.Ban && shouldDM) {
      dmRes = await sendModActionDM(
        ctx,
        interaction,
        data,
        target.user,
        actionType,
      );
    }

    // Only throw if we do NOT want a mod log case, e.g. fail to kick/ban/mute
    // REST methods will throw if it is not a successful request
    const res = await execActionUser(
      ctx,
      interaction,
      data,
      target,
      actionType,
      modLog,
    );

    // DM after for non-ban and send dm
    if (actionType !== ActionType.Ban && shouldDM) {
      dmRes = await sendModActionDM(
        ctx,
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
        deleteDMPromise = dmRes.unwrap().delete();
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
        deleteModLog(db, interaction.guildId, nextCaseId.toString()),
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

    return Ok({
      user: target.user,
      shouldDM,
      failedDM: dmRes?.err || false,
      triedDMNonMember,
    });
  });
}

export default async function executeAction(
  ctx: Context,
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
      // eslint-disable-next-line no-await-in-loop
      const res = await executeActionUser(
        ctx,
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
        ctx,
        data,
        actionType,
        msg,
        triedDMNonMemberCount,
        failedDMCount,
      ),
    );
  });
}
