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
import { ActionType } from "./ActionType";
import hasPermissionTargetingMember from "./hasPermission";
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
  content: string
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

  fields.push({
    name: "User DM",
    value: data.getSendDM(action)
      ? "📬 Members were sent a DM with the provided reason."
      : "📭 Members were **not** sent a DM with the provided reason.",
  });

  return new EmbedBuilder()
    .setTitle(`${ActionType.toPastTense(action)} ${data.targets.size} users`)
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
        data.reason
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
        data.reason
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
        data.reason
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
        data.reason
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
        data.reason
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
  }

  return Ok(target);
}

interface ExecuteActionUserResult {
  user: APIUser;
  dmSent: boolean;
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
      action: ActionType.toString(actionType),
      pending: true,
      userId: target.user.id,
      userTag: target.user.discriminator,
      executorId: data.invoker.id,
      actionTime: dayjs().utc().toISOString(),
      reason: data.reason,
      attachments: [data.attachment?.url || null],
      // This is set in the mod logger
      msgId: undefined,
    },
  });

  // Only DM if should DM AND if target is in the server.
  const shouldDM = data.getSendDM(actionType) && target.member !== null;

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

  if (!redisGuild.redisGuildByGuildId) {
    return Err(new Error("Failed to get redis guild"));
  }

  let msg = "";

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

      msg += `<@${res.val.user.id}> (\`${
        res.val.user.id
      }\`) ${ActionType.toPastTense(actionType)}`;
    }

    msg += "\n";
  }

  return Ok(buildResponseEmbed(ctx, data, actionType, msg));
}
