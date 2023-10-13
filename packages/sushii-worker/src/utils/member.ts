import dayjs from "dayjs";
import {
  APIGuildMember,
  APIInteractionDataResolvedGuildMember,
} from "discord-api-types/v10";

export default function memberIsTimedOut(
  member: APIGuildMember | APIInteractionDataResolvedGuildMember | undefined,
): boolean {
  if (!member?.communication_disabled_until) {
    return false;
  }

  // End time not reached yet
  // now < endTime
  return dayjs().utc().isBefore(member.communication_disabled_until);
}
