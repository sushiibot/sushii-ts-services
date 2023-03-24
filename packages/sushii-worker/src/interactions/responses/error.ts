import { EmbedBuilder } from "@discordjs/builders";
import { MessageFlags } from "discord-api-types/v10";
import {
  ChatInputCommandInteraction,
  InteractionReplyOptions,
} from "discord.js";
import { t } from "i18next";
import Context from "../../model/context";
import Color from "../../utils/colors";

export function getErrorMessage(
  title: string,
  description: string,
  ephemeral: boolean = false
): InteractionReplyOptions {
  return {
    embeds: [
      new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(Color.Error)
        .toJSON(),
    ],
    flags: ephemeral ? MessageFlags.Ephemeral : undefined,
  };
}

export async function interactionReplyError(
  ctx: Context,
  interaction: ChatInputCommandInteraction,
  title: string,
  description: string,
  ephemeral: boolean = false
): Promise<void> {
  interaction.reply(getErrorMessage(title, description, ephemeral));
}

export async function interactionReplyErrorPermission(
  ctx: Context,
  interaction: ChatInputCommandInteraction,
  permission: string
): Promise<void> {
  interactionReplyError(
    ctx,
    interaction,
    t("generic.error.error", { ns: "commands" }),
    t("generic.error.no_permission", { ns: "commands", permission })
  );
}

export async function interactionReplyErrorUnauthorized(
  ctx: Context,
  interaction: ChatInputCommandInteraction,
  message: string
): Promise<void> {
  interactionReplyError(
    ctx,
    interaction,
    t("generic.error.error", { ns: "commands" }),
    t("generic.error.unauthorized_target", { ns: "commands", message })
  );
}

export async function interactionReplyErrorMessage(
  ctx: Context,
  interaction: ChatInputCommandInteraction,
  message: string,
  ephemeral: boolean = false
): Promise<void> {
  interactionReplyError(
    ctx,
    interaction,
    t("generic.error.error", { ns: "commands" }),
    t("generic.error.message", { ns: "commands", message }),
    ephemeral
  );
}

export async function interactionReplyErrorPlainMessage(
  ctx: Context,
  interaction: ChatInputCommandInteraction,
  message: string,
  ephemeral: boolean = false
): Promise<void> {
  interactionReplyError(
    ctx,
    interaction,
    t("generic.error.error", { ns: "commands" }),
    message,
    ephemeral
  );
}

export async function interactionReplyErrorInternal(
  ctx: Context,
  interaction: ChatInputCommandInteraction
): Promise<void> {
  interactionReplyError(
    ctx,
    interaction,
    t("generic.error.error", { ns: "commands" }),
    t("generic.error.internal", { ns: "commands" })
  );
}
