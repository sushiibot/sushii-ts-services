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
import dayjs from "@/shared/domain/dayjs";
import { Err, Ok, Result } from "ts-results";
import Color from "../../utils/colors";
import toTimestamp from "../../utils/toTimestamp";
import { ActionType } from "./ActionType";
import ModActionData from "./ModActionData";

export async function buildDMEmbed(
  guild: Guild,
  action: ActionType,
  shouldDMReason: boolean,
  reason: string | null,
  durationEnd: dayjs.Dayjs | null,
): Promise<EmbedBuilder> {
  const fields = [];

  if (shouldDMReason && reason) {
    fields.push({
      name: "Reason",
      value: reason,
    });
  }

  // Timeout or tempban
  if (durationEnd) {
    fields.push({
      name: "Duration",
      value: `Your ${ActionType.toString(action)} will expire ${toTimestamp(
        durationEnd,
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
  interaction: Interaction<"cached">,
  data: ModActionData,
  target: User,
  action: ActionType,
): Promise<Result<Message, string>> {
  const embed = await buildDMEmbed(
    interaction.guild,
    action,
    data.shouldDMReason(action),
    data.reason,
    data.durationEnd(),
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
