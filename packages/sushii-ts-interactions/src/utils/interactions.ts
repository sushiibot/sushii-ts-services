import {
  isDMInteraction,
  isGuildInteraction,
} from "discord-api-types/utils/v10";
import { APIInteraction, APIUser } from "discord-api-types/v10";

export default function getInvokerUser(interaction: APIInteraction): APIUser {
  if (isGuildInteraction(interaction)) {
    return interaction.member.user;
  }

  if (isDMInteraction(interaction)) {
    return interaction.user;
  }

  throw new Error("failed to get command invoker user");
}
