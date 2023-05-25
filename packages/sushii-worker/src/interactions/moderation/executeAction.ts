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
  triedDMNonMemberCount: number
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

    if (data.shouldDMReason(action)) {
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
      } users`
    )
    .setDescription(content)
    .setFields(fields)
    .setImage(data.attachment?.url || null)
    .setColor(Color.Success);
}

async function execActionUser(
  ctx: Context,
  interaction: ChatInputCommandInteraction,
  data: ModActionData,
  target: ModActionTarget,
  actionType: ActionType
): Promise<Result<ModActionTarget, ActionError>> {
  if (!interaction.inCachedGuild()) {
    throw new Error("Interaction is not in guild");
  }

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
      case ActionType.Warn:
        if (!target.member) {
          return Err({
            target,
            message: "User is not in the server",
          });
        }

        // TODO: Log to mod log channel

        // Nothing, only DM
        break;
      case ActionType.Note:
        // Allow for non-members, send no DM

        break;
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

      return Err({
        target,
        message: err.message,
      });
    }

    throw err;
  }

  return Ok(target);
}

interface ExecuteActionUserResult {
  user: User;
  dmSent: boolean;
  triedDMNonMember: boolean;
}

async function executeActionUser(
  ctx: Context,
  interaction: ChatInputCommandInteraction<"cached">,
  data: ModActionData,
  target: ModActionTarget,
  actionType: ActionType
): Promise<Result<ExecuteActionUserResult, ActionError>> {
  if (!interaction.inGuild()) {
    throw new Error("Not in guild");
  }

  const hasPermsTargetingMember = await hasPermissionTargetingMember(
    interaction,
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
    guildId: interaction.guildId,
  });

  if (!nextCaseId) {
    return Err({
      target,
      message: "Failed to get next case id",
    });
  }

  await ctx.sushiiAPI.sdk.createModLog({
    modLog: {
      guildId: interaction.guildId,
      caseId: nextCaseId,
      action: actionType,
      pending: true,
      userId: target.user.id,
      userTag: `${target.user.username}#${target.user.discriminator}`,
      executorId: data.invoker.id,
      actionTime: dayjs().utc().toISOString(),
      reason: data.reason,
      attachments: data.attachment?.url ? [data.attachment.url] : [],
      // This is set in the mod logger
      msgId: undefined,
    },
  });

  // Only DM if (dm_reason true or has dm_message) AND if target is in the server.
  const shouldDM = data.shouldDM(actionType) && target.member !== null;

  const triedDMNonMember = data.shouldDM(actionType) && target.member === null;

  let dmRes: Result<Message, string> | null = null;
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
      // No need to catch err here, not awaited
      deleteDMPromise = dmRes.unwrap().delete();
    }

    const [resDeleteModLog, resDeleteDM] = await Promise.allSettled([
      ctx.sushiiAPI.sdk.deleteModLog({
        caseId: nextCaseId,
        guildId: interaction.guildId,
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
  interaction: ChatInputCommandInteraction<"cached">,
  data: ModActionData,
  actionType: ActionType
): Promise<Result<EmbedBuilder, Error>> {
  if (!interaction.guildId) {
    return Err(new Error("Guild ID is missing"));
  }

  let msg = "";

  // If executor wants to DM, but target is not a member
  let triedDMNonMemberCount = 0;

  for (const [, target] of data.targets) {
    // Should be synchronous so we don't reuse the same case ID
    // eslint-disable-next-line no-await-in-loop
    const res = await executeActionUser(
      ctx,
      interaction,
      data,
      target,
      actionType
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
      triedDMNonMemberCount += res.val.triedDMNonMember ? 1 : 0;
    }

    msg += "\n";
  }

  return Ok(
    buildResponseEmbed(ctx, data, actionType, msg, triedDMNonMemberCount)
  );
}
