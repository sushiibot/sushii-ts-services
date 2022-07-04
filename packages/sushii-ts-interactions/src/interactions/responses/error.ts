import { EmbedBuilder } from "@discordjs/builders";
import { APIInteraction } from "discord-api-types/v10";
import { t } from "i18next";
import Context from "../../model/context";

export function interactionReplyErrorPerrmision(
  ctx: Context,
  interaction: APIInteraction,
  permission: string
): Promise<void> {
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

export function interactionReplyErrorInternal(
  ctx: Context,
  interaction: APIInteraction
): Promise<void> {
  return ctx.REST.interactionReply(interaction, {
    embeds: [
      new EmbedBuilder()
        .setTitle(t("generic.error.error", { ns: "commands" }))
        .setDescription(t("generic.error.internal", { ns: "commands" }))
        .toJSON(),
    ],
  });
}
