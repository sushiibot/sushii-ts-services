import {
  EmbedBuilder,
  TimestampStyles,
  Interaction,
  RESTJSONErrorCodes,
  Message,
  User,
} from "discord.js";
import dayjs from "dayjs";
import { Err, Result } from "ts-results";
import Context from "../../model/context";
import catchApiError from "../../utils/catchApiError";
import Color from "../../utils/colors";
import toTimestamp from "../../utils/toTimestamp";
import { ActionType } from "./ActionType";
import ModActionData from "./ModActionData";

export async function buildDMEmbed(
  ctx: Context,
  guildId: string,
  action: ActionType,
  shouldDMReason: boolean,
  reason: string | null,
  timeoutEnd: dayjs.Dayjs | null
): Promise<EmbedBuilder> {
  const { redisGuildByGuildId } = await ctx.sushiiAPI.sdk.getRedisGuild({
    guild_id: guildId,
  });

  const guildName = redisGuildByGuildId?.name || `Server ID ${guildId}`;
  const guildIcon = redisGuildByGuildId?.icon
    ? ctx.CDN.cdn.icon(guildId, redisGuildByGuildId?.icon)
    : undefined;

  const fields = [];

  if (shouldDMReason && reason) {
    fields.push({
      name: "Reason",
      value: reason,
    });
  }

  if (timeoutEnd) {
    fields.push({
      name: "Timeout Duration",
      value: `Your timeout will expire ${toTimestamp(
        timeoutEnd,
        TimestampStyles.RelativeTime
      )}`,
    });
  }

  const title =
    action === ActionType.TimeoutRemove
      ? "Your timeout was removed"
      : `You have been ${ActionType.toPastTense(action)}`;

  return new EmbedBuilder()
    .setTitle(title)
    .setAuthor({
      name: guildName,
      iconURL: guildIcon,
    })
    .setFields(fields)
    .setColor(Color.Warning);
}

export default async function sendModActionDM(
  ctx: Context,
  interaction: Interaction,
  guildId: string,
  data: ModActionData,
  target: User,
  action: ActionType
): Promise<Result<Message, string>> {
  const embed = await buildDMEmbed(
    ctx,
    guildId,
    action,
    data.shouldDMReason(action),
    data.reason,
    data.communicationDisabledUntil().unwrapOr(null)
  );

  const dmMessage = await catchApiError(
    interaction.client.users.send,
    target.id,
    {
      embeds: [embed.toJSON()],
    }
  );

  if (dmMessage.err) {
    if (
      dmMessage.val.code === RESTJSONErrorCodes.CannotSendMessagesToThisUser
    ) {
      return Err("User has DMs disabled or bot is blocked.");
    }
  }

  return dmMessage.mapErr((e) => e.message);
}
