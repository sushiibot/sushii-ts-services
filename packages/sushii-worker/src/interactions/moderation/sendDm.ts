import { EmbedBuilder, TimestampStyles } from "@discordjs/builders";
import dayjs from "dayjs";
import { APIMessage, APIUser, RESTJSONErrorCodes } from "discord-api-types/v10";
import { Err, Result } from "ts-results";
import Context from "../../model/context";
import Color from "../../utils/colors";
import toTimestamp from "../../utils/toTimestamp";
import { ActionType } from "./ActionType";
import ModActionData from "./ModActionData";

export async function buildDMEmbed(
  ctx: Context,
  guildId: string,
  action: ActionType,
  shouldDMReason: boolean,
  reason: string | undefined,
  dmMessage: string | undefined,
  timeoutEnd: dayjs.Dayjs | undefined
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

  if (dmMessage) {
    fields.push({
      name: "Message",
      value: dmMessage,
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

  return new EmbedBuilder()
    .setTitle(`You have been ${ActionType.toPastTense(action)} in a server`)
    .setAuthor({
      name: guildName,
      iconURL: guildIcon,
    })
    .setFields(fields)
    .setColor(Color.Warning);
}

export default async function sendModActionDM(
  ctx: Context,
  guildId: string,
  data: ModActionData,
  target: APIUser,
  action: ActionType
): Promise<Result<APIMessage, string>> {
  const embed = await buildDMEmbed(
    ctx,
    guildId,
    action,
    data.shouldDMReason(action),
    data.reason,
    data.dmMessage,
    data.communicationDisabledUntil().unwrapOr(undefined)
  );

  const res = await ctx.REST.dmUser(target.id, {
    embeds: [embed.toJSON()],
  });

  if (res.err) {
    if (res.val.code === RESTJSONErrorCodes.CannotSendMessagesToThisUser) {
      return Err("User has DMs disabled or bot is blocked.");
    }
  }

  return res.mapErr((e) => e.message);
}
