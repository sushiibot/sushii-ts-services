import {
  ChatInputCommandInteraction,
  InteractionContextType,
  PermissionFlagsBits,
  PermissionsBitField,
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
import { BanAction } from "../../domain/entities/ModerationAction";
import { ActionType } from "../../domain/value-objects/ActionType";
import { dmChoiceFromString } from "../../domain/value-objects/DMChoice";
import { Reason } from "../../domain/value-objects/Reason";
import { buildActionResultEmbed } from "../views/ModerationActionView";

export class BanCommand extends SlashCommandHandler {
  requiredBotPermissions = new PermissionsBitField().add("BanMembers");

  command = new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban users.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setContexts(InteractionContextType.Guild)
    .addStringOption((option) =>
      option
        .setName("users")
        .setDescription(
          "Which users to ban. This can be multiple users with IDs or mentions.",
        )
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("days_to_delete")
        .setDescription("Number of days to delete messages for")
        .setMaxValue(7)
        .setMinValue(0)
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for banning this user.")
        .setRequired(false),
    )
    .addAttachmentOption((option) =>
      option
        .setName("attachment")
        .setDescription("Additional media to attach to the case.")
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("dm_reason")
        .setDescription("Do you want to DM the user the reason?")
        .setChoices(
          { name: "Yes: DM the user the reason", value: "yes_dm" },
          { name: "No: Do not DM the user the reason", value: "no_dm" },
        )
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
    const deleteMessageDays =
      interaction.options.getInteger("days_to_delete") || undefined;

    const attachment = interaction.options.getAttachment("attachment");
    const reason = reasonResult.val;

    const dmReasonOption = interaction.options.getString("dm_reason");
    const dmChoice = dmChoiceFromString(dmReasonOption);

    const banAction = new BanAction(
      interaction.guildId,
      interaction.user,
      reason,
      dmChoice,
      attachment,
      deleteMessageDays,
    );
    const result = await this.moderationService.executeAction(
      banAction,
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
