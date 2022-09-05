import { EmbedBuilder } from "@discordjs/builders";
import { APIInteraction, MessageFlags } from "discord-api-types/v10";
import { t } from "i18next";
import Context from "../../model/context";
import { APIPromiseResult } from "../../model/rest";
import Color from "../../utils/colors";

export function interactionReplyError(
  ctx: Context,
  interaction: APIInteraction,
  title: string,
  description: string,
  ephemeral: boolean = false
): APIPromiseResult<void> {
  return ctx.REST.interactionReply(interaction, {
    embeds: [
      new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(Color.Error)
        .toJSON(),
    ],
    flags: ephemeral ? MessageFlags.Ephemeral : undefined,
  });
}

export function interactionReplyErrorPermission(
  ctx: Context,
  interaction: APIInteraction,
  permission: string
): APIPromiseResult<void> {
  return interactionReplyError(
    ctx,
    interaction,
    t("generic.error.error", { ns: "commands" }),
    t("generic.error.no_permission", { ns: "commands", permission })
  );
}

export function interactionReplyErrorUnauthorized(
  ctx: Context,
  interaction: APIInteraction,
  message: string
): APIPromiseResult<void> {
  return interactionReplyError(
    ctx,
    interaction,
    t("generic.error.error", { ns: "commands" }),
    t("generic.error.unauthorized_target", { ns: "commands", message })
  );
}

export function interactionReplyErrorMessage(
  ctx: Context,
  interaction: APIInteraction,
  message: string,
  ephemeral: boolean = false
): APIPromiseResult<void> {
  return interactionReplyError(
    ctx,
    interaction,
    t("generic.error.error", { ns: "commands" }),
    t("generic.error.message", { ns: "commands", message }),
    ephemeral
  );
}

export function interactionReplyErrorInternal(
  ctx: Context,
  interaction: APIInteraction
): APIPromiseResult<void> {
  return interactionReplyError(
    ctx,
    interaction,
    t("generic.error.error", { ns: "commands" }),
    t("generic.error.internal", { ns: "commands" })
  );
}
