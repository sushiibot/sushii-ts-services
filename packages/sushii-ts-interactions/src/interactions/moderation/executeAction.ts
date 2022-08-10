import { EmbedBuilder } from "@discordjs/builders";
import dayjs from "dayjs";
import { APIChatInputApplicationCommandGuildInteraction } from "discord-api-types/v10";
import { t } from "i18next";
import { Err, Ok, Result } from "ts-results";
import Context from "../../model/context";
import Color from "../../utils/colors";
import { ActionType } from "./ActionType";
import ModActionData from "./ModActionData";
import sendModActionDM from "./sendDm";

export default async function executeAction(
  ctx: Context,
  interaction: APIChatInputApplicationCommandGuildInteraction,
  data: ModActionData,
  actionType: ActionType
): Promise<Result<void, Error>> {
  const { nextCaseId } = await ctx.sushiiAPI.sdk.getNextCaseID({
    guildId: interaction.guild_id,
  });

  if (!nextCaseId) {
    return Err(
      new Error(`Failed to get next case id for guild ${interaction.guild_id}`)
    );
  }

  const { createModLog } = await ctx.sushiiAPI.sdk.createModLog({
    modLog: {
      guildId: interaction.guild_id,
      caseId: nextCaseId,
      action: ActionType.toString(actionType),
      pending: true,
      userId: data.targetUser.id,
      userTag: data.targetUser.discriminator,
      executorId: data.invoker.id,
      actionTime: dayjs().utc().toISOString(),
      reason: data.reason,
      attachments: [data.attachment?.url || null],
      // This is set in the mod logger
      msgId: undefined,
    },
  });

  const modLog = createModLog?.modLog;

  if (!modLog) {
    return Err(new Error("Failed to create mod log"));
  }

  let dmRes;
  try {
    // DM first for ban
    if (actionType === ActionType.Ban) {
      dmRes = await sendModActionDM(ctx, interaction, data, actionType);
    }

    // Only throw if we do NOT want a mod log case, e.g. fail to kick/ban/mute
    // REST methods will throw if it is not a successful request
    switch (actionType) {
      case ActionType.Kick: {
        const res = await ctx.REST.kickMember(
          interaction.guild_id,
          data.targetUser.id,
          data.reason
        );

        if (res.err) {
          throw Error(res.val.message);
        }

        break;
      }
      case ActionType.Ban: {
        await ctx.REST.banUser(
          interaction.guild_id,
          data.targetUser.id,
          data.reason
        );

        break;
      }
      case ActionType.BanRemove: {
        await ctx.REST.unbanUser(
          interaction.guild_id,
          data.targetUser.id,
          data.reason
        );

        break;
      }
      case ActionType.Timeout:
      case ActionType.TimeoutAdjust: {
        // Timeout and adjust are both same, just update timeout end time

        await ctx.REST.timeoutMember(
          interaction.guild_id,
          data.targetUser.id,
          data.communicationDisabledUntil().unwrap(),
          data.reason
        );

        break;
      }
      case ActionType.TimeoutRemove: {
        await ctx.REST.timeoutMember(
          interaction.guild_id,
          data.targetUser.id,
          null,
          data.reason
        );
        break;
      }
      case ActionType.Warn:
        // Nothing, only DM
        break;
    }

    // DM after for non-ban
  } catch (err) {
    // Revert stuff like deleting mod log
    let deleteDMPromise;
    if (dmRes?.ok) {
      deleteDMPromise = ctx.REST.deleteChannelMessage(
        dmRes.val.channel_id,
        dmRes.val.channel_id
      );
    }

    await Promise.allSettled([
      ctx.sushiiAPI.sdk.deleteModLog({
        caseId: nextCaseId,
        guildId: interaction.guild_id,
      }),
      deleteDMPromise,
    ]);
  }

  return Ok.EMPTY;
}

function buildEmbed(
  ctx: Context,
  data: ModActionData,
  action: ActionType,
  errorMsg?: string
): EmbedBuilder {
  const userFaceURL = ctx.CDN.userFaceURL(data.targetUser);
  const userEmbed = new EmbedBuilder()
    .setTitle(
      t("ban.success", {
        ns: "commands",
        id: data.targetUser.id,
      })
    )
    .setAuthor({
      name: `${data.targetUser.username}#${data.targetUser.discriminator}`,
      iconURL: userFaceURL,
    })
    .setDescription(errorMsg)
    .setColor(Color.Success);

  return userEmbed;
}
