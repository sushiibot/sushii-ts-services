import {
  EmbedBuilder,
  ButtonInteraction,
  ChatInputCommandInteraction,
  InteractionReplyOptions,
  ModalSubmitInteraction,
} from "discord.js";
import { MessageFlags } from "discord-api-types/v10";
import { t } from "i18next";
import Context from "../../model/context";
import Color from "../../utils/colors";

type ReplyableInteraction =
  | ChatInputCommandInteraction
  | ButtonInteraction
  | ModalSubmitInteraction;

export function getErrorMessage(
  title: string,
  description: string,
  ephemeral: boolean = false,
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
