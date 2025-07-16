import {
  EmbedBuilder,
  ButtonInteraction,
  ChatInputCommandInteraction,
  InteractionReplyOptions,
  ModalSubmitInteraction,
  InteractionEditReplyOptions,
} from "discord.js";
import { MessageFlags } from "discord.js";
import { t } from "i18next";
import Context from "../../model/context";
import Color from "../../utils/colors";

type ReplyableInteraction =
  | ChatInputCommandInteraction
  | ButtonInteraction
  | ModalSubmitInteraction;

export function getErrorMessageEmbeds(
  title: string,
  description: string,
): EmbedBuilder[] {
  return [
    new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(Color.Error),
  ];
}

export function getErrorMessage(
  title: string,
  description: string,
  ephemeral: boolean = false,
): InteractionReplyOptions {
  return {
    embeds: getErrorMessageEmbeds(title, description),
    flags: ephemeral ? MessageFlags.Ephemeral : undefined,
  };
}

export function getErrorMessageEdit(
  title: string,
  description: string,
): InteractionEditReplyOptions {
  return {
    embeds: getErrorMessageEmbeds(title, description),
  };
}

export async function interactionReplyError(
  ctx: Context,
  interaction: ReplyableInteraction,
  title: string,
  description: string,
  ephemeral: boolean = false,
): Promise<void> {
  await interaction.reply(getErrorMessage(title, description, ephemeral));
}

export async function interactionReplyErrorPermission(
  ctx: Context,
  interaction: ReplyableInteraction,
  permission: string,
): Promise<void> {
  return interactionReplyError(
    ctx,
    interaction,
    t("generic.error.error", { ns: "commands" }),
    t("generic.error.no_permission", { ns: "commands", permission }),
  );
}

export async function interactionReplyErrorUnauthorized(
  ctx: Context,
  interaction: ReplyableInteraction,
  message: string,
): Promise<void> {
  return interactionReplyError(
    ctx,
    interaction,
    t("generic.error.error", { ns: "commands" }),
    t("generic.error.unauthorized_target", { ns: "commands", message }),
  );
}

export async function interactionReplyErrorMessage(
  ctx: Context,
  interaction: ReplyableInteraction,
  message: string,
  ephemeral: boolean = false,
): Promise<void> {
  return interactionReplyError(
    ctx,
    interaction,
    t("generic.error.error", { ns: "commands" }),
    t("generic.error.message", { ns: "commands", message }),
    ephemeral,
  );
}

export async function interactionReplyErrorPlainMessage(
  ctx: Context,
  interaction: ReplyableInteraction,
  message: string,
  ephemeral: boolean = false,
): Promise<void> {
  return interactionReplyError(
    ctx,
    interaction,
    t("generic.error.error", { ns: "commands" }),
    message,
    ephemeral,
  );
}

export async function interactionReplyErrorInternal(
  ctx: Context,
  interaction: ReplyableInteraction,
): Promise<void> {
  return interactionReplyError(
    ctx,
    interaction,
    t("generic.error.error", { ns: "commands" }),
    t("generic.error.internal", { ns: "commands" }),
  );
}
