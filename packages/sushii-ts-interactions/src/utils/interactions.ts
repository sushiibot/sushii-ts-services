import {
  isDMInteraction,
  isGuildInteraction,
} from "discord-api-types/utils/v9";
import {
  APIChatInputApplicationCommandInteraction,
  APIUser,
} from "discord-api-types/v9";

export default function getInvokerUser(
  interaction: APIChatInputApplicationCommandInteraction
): APIUser {
  if (isGuildInteraction(interaction)) {
    return interaction.member.user;
  }

  if (isDMInteraction(interaction)) {
    return interaction.user;
  }

  throw new Error("failed to get command invoker user");
}
