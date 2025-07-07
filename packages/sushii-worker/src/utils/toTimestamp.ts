import dayjs from "@/shared/domain/dayjs";
import { TimestampStyles, TimestampStylesString } from "discord.js";

export default function toTimestamp(
  date: dayjs.Dayjs,
  style: TimestampStylesString = TimestampStyles.ShortDateTime,
): string {
  return `<t:${date.unix()}:${style}>`;
}
