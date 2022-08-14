import { EmbedBuilder } from "@discordjs/builders";
import dayjs from "dayjs";
import {
  APIChatInputApplicationCommandGuildInteraction,
  APIUser,
} from "discord-api-types/v10";
import { t } from "i18next";
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
  return new EmbedBuilder()
    .setTitle(`${ActionType.toPastTense(action)} ${data.targets.size} users`)
    .setDescription(content)
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
      // Nothing, only DM
      break;
  }

  return Ok(target);
}

async function executeActionUser(
  ctx: Context,
  interaction: APIChatInputApplicationCommandGuildInteraction,
  data: ModActionData,
  target: ModActionTarget,
  actionType: ActionType,
  redisGuild: NonNullable<GetRedisGuildQuery["redisGuildByGuildId"]>
): Promise<Result<APIUser, ActionError>> {
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
      message: t("generic.error.unauthorized_target", {
        ns: "commands",
        message: hasPermsTargetingMember.val,
      }),
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

  let dmRes;
  // DM before for ban
  if (!data.skipDM && actionType !== ActionType.Ban) {
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

  // DM after for non-ban
  if (!data.skipDM && actionType !== ActionType.Ban) {
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
    if (dmRes?.ok) {
      deleteDMPromise = ctx.REST.deleteChannelMessage(
        dmRes.val.channel_id,
        dmRes.val.channel_id
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

  return Ok(target.user);
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

  const promises = [];
  for (const [, target] of data.targets) {
    promises.push(
      executeActionUser(
        ctx,
        interaction,
        data,
        target,
        actionType,
        redisGuild.redisGuildByGuildId
      )
    );
  }

  let msg = "";

  const results = await Promise.all(promises);
  for (const result of results) {
    if (result.err) {
      msg += `:x: <@${result.val.target.user.id}> (\`${result.val.target.user.id}\`) - ${result.val.message}`;
    } else {
      msg += `${ActionType.toEmoji(actionType)} <@${result.val.id}> (\`${
        result.val.id
      }\`) - ${ActionType.toPastTense(actionType)}`;
    }
  }

  return Ok(buildResponseEmbed(ctx, data, actionType, msg));
}
