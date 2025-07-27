import {
  ChatInputCommandInteraction,
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { Logger } from "pino";

import { SlashCommandHandler } from "@/interactions/handlers";
import {
  getErrorMessage,
  getErrorMessageEdit,
} from "@/interactions/responses/error";

import { ModerationService } from "../../application/ModerationService";
import { TargetResolutionService } from "../../application/TargetResolutionService";
import { WarnAction } from "../../domain/entities/ModerationAction";
import { ActionType } from "../../domain/value-objects/ActionType";
import { dmChoiceFromString } from "../../domain/value-objects/DMChoice";
import { Reason } from "../../domain/value-objects/Reason";
import { buildActionResultEmbed } from "../views/ModerationActionView";

export class WarnCommand extends SlashCommandHandler {
  command = new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn members.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setContexts(InteractionContextType.Guild)
    .addStringOption((option) =>
      option
        .setName("users")
        .setDescription(
          "Which users to warn. This can be multiple users with IDs or mentions.",
        )
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for warning this user.")
        .setRequired(true),
    )
    .addAttachmentOption((option) =>
      option
        .setName("attachment")
        .setDescription("Additional media to attach to the case.")
        .setRequired(false),
    )
    .toJSON();

  constructor(
    private readonly moderationService: ModerationService,
    private readonly targetResolutionService: TargetResolutionService,
    private readonly logger: Logger,
  ) {
    super();
  }

  async handler(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Not in cached guild");
    }

    const reasonResult = Reason.create(interaction.options.getString("reason"));
    if (!reasonResult.ok) {
      await interaction.reply(getErrorMessage("Error", reasonResult.val));
      return;
    }

    await interaction.deferReply();

    const targetsResult =
      await this.targetResolutionService.fetchTargets(interaction);
    if (!targetsResult.ok) {
      const editMsg = getErrorMessageEdit("Error", targetsResult.val);
      await interaction.editReply(editMsg);
      return;
    }

    const targets = targetsResult.val;

    const attachment = interaction.options.getAttachment("attachment");
    const reason = reasonResult.val;

    const dmReasonOption = interaction.options.getString("dm_reason");
    const dmChoice = dmChoiceFromString(dmReasonOption);

    const warnAction = new WarnAction(
      interaction.guildId,
      interaction.user,
      reason,
      dmChoice,
      attachment,
    );
    const result = await this.moderationService.executeAction(
      warnAction,
      targets,
    );

    const embed = buildActionResultEmbed(
      ActionType.Ban,
      interaction.user, // executor
      targets,
      result,
    );

    await interaction.editReply({ embeds: [embed] });
  }
}
