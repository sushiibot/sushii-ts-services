import {
  EmbedBuilder,
  TimestampStyles,
  Interaction,
  RESTJSONErrorCodes,
  Message,
  User,
  Guild,
  DiscordAPIError,
} from "discord.js";
import dayjs from "dayjs";
import { Err, Ok, Result } from "ts-results";
import Context from "../../model/context";
import Color from "../../utils/colors";
import toTimestamp from "../../utils/toTimestamp";
import { ActionType } from "./ActionType";
import ModActionData from "./ModActionData";

export async function buildDMEmbed(
  ctx: Context,
  guild: Guild,
  action: ActionType,
  shouldDMReason: boolean,
  reason: string | null,
  timeoutEnd: dayjs.Dayjs | null,
): Promise<EmbedBuilder> {
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
        TimestampStyles.RelativeTime,
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
      name: guild.name,
      iconURL: guild.iconURL() || undefined,
    })
    .setFields(fields)
    .setColor(Color.Warning);
}

export default async function sendModActionDM(
  ctx: Context,
  interaction: Interaction<"cached">,
  data: ModActionData,
  target: User,
  action: ActionType,
): Promise<Result<Message, string>> {
  const embed = await buildDMEmbed(
    ctx,
    interaction.guild,
    action,
    data.shouldDMReason(action),
    data.reason,
    data.communicationDisabledUntil().unwrapOr(null),
  );

  try {
    const dmMessage = await interaction.client.users.send(target.id, {
      embeds: [embed],
    });

    return Ok(dmMessage);
  } catch (err) {
    if (err instanceof DiscordAPIError) {
      if (err.code === RESTJSONErrorCodes.CannotSendMessagesToThisUser) {
        return Err("User has DMs disabled or bot is blocked.");
      }
    }

    throw err;
  }
}
