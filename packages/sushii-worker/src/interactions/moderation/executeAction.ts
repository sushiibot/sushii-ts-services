import { EmbedBuilder } from "@discordjs/builders";
import dayjs from "dayjs";
import {
  APIChatInputApplicationCommandGuildInteraction,
  APIMessage,
  APIUser,
} from "discord-api-types/v10";
import { Err, Ok, Result } from "ts-results";
import { GetRedisGuildQuery } from "../../generated/graphql";
import logger from "../../logger";
import Context from "../../model/context";
import Color from "../../utils/colors";
import toSentenceCase from "../../utils/toSentenceCase";
import { ActionType } from "./ActionType";
import hasPermissionTargetingMember from "../../utils/hasPermission";
import ModActionData, { ModActionTarget } from "./ModActionData";
import sendModActionDM from "./sendDm";

interface ActionError {
  target: ModActionTarget;
  message: string;
}

function buildResponseEmbed(
  ctx: Context,
  data: ModActionData,
  action: ActionType,
  content: string,
  triedDMNonMember: boolean
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

    if (data.shouldDMReason(action) || data.dmMessage) {
      userDMValue = "📬 Members were sent a DM with the following.";

      // Has both reason + message
      if (data.shouldDMReason(action) && data.dmMessage) {
        userDMValue += `\n ┣ **Reason:** ${data.reason}`;
      }

      // Has reason + NO message
      if (data.shouldDMReason(action) && !data.dmMessage) {
        userDMValue += `\n ┗ **Reason:** ${data.reason}`;
      }

      if (data.dmMessage) {
        userDMValue += `\n┗ **Message:** ${data.dmMessage}`;
      }
    }

    if (triedDMNonMember) {
      userDMValue +=
        "\n\n**Note:** Some messages were not sent to users not in this server.";
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
      } users`
    )
    .setDescription(content)
    .setFields(fields)
    .setImage(data.attachment?.url || null)
    .setColor(Color.Success);
}

async function execActionUser(
  ctx: Context,
  interaction: APIChatInputApplicationCommandGuildInteraction,
  data: ModActionData,
  target: ModActionTarget,
  actionType: ActionType
): Promise<Result<ModActionTarget, ActionError>> {
  // Audit log header max 512 characters
  const auditLogReason = data.reason?.slice(0, 512);

  switch (actionType) {
    case ActionType.Kick: {
      // Member already fetched earlier
      if (!target.member) {
        return Err({
          target,
          message: "User is not in the server",
        });
      }

      const res = await ctx.REST.kickMember(
        interaction.guild_id,
        target.user.id,
        auditLogReason
      );

      if (res.err) {
        return Err({
          target,
          message: res.val.message,
        });
      }

      break;
    }
    case ActionType.Ban: {
      const res = await ctx.REST.banUser(
        interaction.guild_id,
        target.user.id,
        auditLogReason,
        data.deleteMessageDays
      );

      if (res.err) {
        return Err({
          target,
          message: res.val.message,
        });
      }

      break;
    }
    case ActionType.BanRemove: {
      const res = await ctx.REST.unbanUser(
        interaction.guild_id,
        target.user.id,
        auditLogReason
      );

      if (res.err) {
        return Err({
          target,
          message: res.val.message,
        });
      }

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

      const res = await ctx.REST.timeoutMember(
        interaction.guild_id,
        target.user.id,
        data.communicationDisabledUntil().unwrap(),
        auditLogReason
      );

      if (res.err) {
        return Err({
          target,
          message: res.val.message,
        });
      }

      break;
    }
    case ActionType.TimeoutRemove: {
      if (!target.member) {
        return Err({
          target,
          message: "User is not in the server",
        });
      }

      const res = await ctx.REST.timeoutMember(
        interaction.guild_id,
        target.user.id,
        null,
        auditLogReason
      );

      if (res.err) {
        return Err({
          target,
          message: res.val.message,
        });
      }

      break;
    }
    case ActionType.Warn:
      if (!target.member) {
        return Err({
          target,
          message: "User is not in the server",
        });
      }

      // Nothing, only DM
      break;
    case ActionType.Note:
      // Allow for non-members, send no DM

      break;
    case ActionType.Lookup:
    case ActionType.History:
      throw new Error(`unsupported action type ${actionType}`);
  }

  return Ok(target);
}

interface ExecuteActionUserResult {
  user: APIUser;
  dmSent: boolean;
  triedDMNonMember: boolean;
}

async function executeActionUser(
  ctx: Context,
  interaction: APIChatInputApplicationCommandGuildInteraction,
  data: ModActionData,
  target: ModActionTarget,
  actionType: ActionType,
  redisGuild: NonNullable<GetRedisGuildQuery["redisGuildByGuildId"]>
): Promise<Result<ExecuteActionUserResult, ActionError>> {
  const hasPermsTargetingMember = await hasPermissionTargetingMember(
    ctx,
    interaction,
    redisGuild,
    target.user,
    target.member || undefined
  );

  if (hasPermsTargetingMember.err) {
    return Err({
      target,
      message: hasPermsTargetingMember.val,
    });
  }

  const { nextCaseId } = await ctx.sushiiAPI.sdk.getNextCaseID({
    guildId: interaction.guild_id,
  });

  if (!nextCaseId) {
    return Err({
      target,
      message: "Failed to get next case id",
    });
  }

  await ctx.sushiiAPI.sdk.createModLog({
    modLog: {
      guildId: interaction.guild_id,
      caseId: nextCaseId,
      action: ActionType.toModLogString(actionType),
      pending: true,
      userId: target.user.id,
      userTag: target.user.discriminator,
      executorId: data.invoker.id,
      actionTime: dayjs().utc().toISOString(),
      reason: data.reason,
      attachments: data.attachment?.url ? [data.attachment.url] : [],
      // This is set in the mod logger
      msgId: undefined,
    },
  });

  // Only DM if should DM AND if target is in the server.
  const shouldDM = data.shouldDMReason(actionType) && target.member !== null;

  const triedDMNonMember =
    data.shouldDMReason(actionType) && target.member === null;

  let dmRes: Result<APIMessage, string> | null = null;
  // DM before for ban and send dm
  if (actionType === ActionType.Ban && shouldDM) {
    dmRes = await sendModActionDM(
      ctx,
      interaction,
      data,
      target.user,
      actionType
    );
  }

  // Only throw if we do NOT want a mod log case, e.g. fail to kick/ban/mute
  // REST methods will throw if it is not a successful request
  const res = await execActionUser(ctx, interaction, data, target, actionType);

  // DM after for non-ban and send dm
  if (actionType !== ActionType.Ban && shouldDM) {
    dmRes = await sendModActionDM(
      ctx,
      interaction,
      data,
      target.user,
      actionType
    );
  }

  // Revert stuff if failed to execute action
  if (res.err) {
    // Delete DM reason if it was sent
    let deleteDMPromise;
    if (dmRes && dmRes.ok) {
      deleteDMPromise = ctx.REST.deleteChannelMessage(
        dmRes.val.channel_id,
        dmRes.val.id
      );
    }

    const [resDeleteModLog, resDeleteDM] = await Promise.allSettled([
      ctx.sushiiAPI.sdk.deleteModLog({
        caseId: nextCaseId,
        guildId: interaction.guild_id,
      }),
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
    dmSent: shouldDM,
    triedDMNonMember,
  });
}

export default async function executeAction(
  ctx: Context,
  interaction: APIChatInputApplicationCommandGuildInteraction,
  data: ModActionData,
  actionType: ActionType
): Promise<Result<EmbedBuilder, Error>> {
  const redisGuild = await ctx.sushiiAPI.sdk.getRedisGuild({
    guild_id: interaction.guild_id,
  });

  logger.debug(redisGuild, "fetched redis guild");

  if (!redisGuild.redisGuildByGuildId) {
    return Err(new Error("Failed to get redis guild"));
  }

  let msg = "";

  // If executor wants to DM, but target is not a member
  let triedDMNonMember = false;

  for (const [, target] of data.targets) {
    // Should be synchronous so we don't reuse the same case ID
    // eslint-disable-next-line no-await-in-loop
    const res = await executeActionUser(
      ctx,
      interaction,
      data,
      target,
      actionType,
      redisGuild.redisGuildByGuildId
    );

    if (res.err) {
      msg += `:x: <@${res.val.target.user.id}> (\`${res.val.target.user.id}\`) - ${res.val.message}`;
    } else {
      msg += `${ActionType.toEmoji(actionType)} `;

      // Add emoji if DM was send to user
      if (res.val.dmSent) {
        msg += "📬 ";
      }

      msg += `<@${res.val.user.id}> (\`${res.val.user.id}\`)`;

      // Makes triedDMNonMember true if any returned value is true
      triedDMNonMember = triedDMNonMember || res.val.triedDMNonMember;
    }

    msg += "\n";
  }

  return Ok(buildResponseEmbed(ctx, data, actionType, msg, triedDMNonMember));
}
