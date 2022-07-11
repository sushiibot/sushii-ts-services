import { EmbedBuilder } from "@discordjs/builders";
import {
  APIInteraction,
  RESTPostAPIInteractionFollowupResult,
} from "discord-api-types/v10";
import { t } from "i18next";
import Context from "../../model/context";
import { APIPromiseResult } from "../../model/rest";

export function interactionReplyErrorPerrmision(
  ctx: Context,
  interaction: APIInteraction,
  permission: string
): APIPromiseResult<RESTPostAPIInteractionFollowupResult> {
  return ctx.REST.interactionReply(interaction, {
    embeds: [
      new EmbedBuilder()
        .setTitle(t("generic.error.error", { ns: "commands" }))
        .setDescription(
          t("generic.error.no_permission", { ns: "commands", permission })
        )
        .toJSON(),
    ],
  });
}

export function interactionReplyErrorMessage(
  ctx: Context,
  interaction: APIInteraction,
  message: string
): APIPromiseResult<RESTPostAPIInteractionFollowupResult> {
  return ctx.REST.interactionReply(interaction, {
    embeds: [
      new EmbedBuilder()
        .setTitle(t("generic.error.error", { ns: "commands" }))
        .setDescription(t("generic.error.message", { ns: "commands", message }))
        .toJSON(),
    ],
  });
}

export function interactionReplyErrorInternal(
  ctx: Context,
  interaction: APIInteraction
): APIPromiseResult<RESTPostAPIInteractionFollowupResult> {
  return ctx.REST.interactionReply(interaction, {
    embeds: [
      new EmbedBuilder()
        .setTitle(t("generic.error.error", { ns: "commands" }))
        .setDescription(t("generic.error.internal", { ns: "commands" }))
        .toJSON(),
    ],
  });
}
