import { Client } from "discord.js";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Logger } from "pino";
import { Err, Ok, Result } from "ts-results";

import * as schema from "@/infrastructure/database/schema";

import { ModerationAction } from "../domain/entities/ModerationAction";
import { ModerationCase } from "../domain/entities/ModerationCase";
import { ModerationTarget } from "../domain/entities/ModerationTarget";
import { TempBan } from "../domain/entities/TempBan";
import { ModerationCaseRepository } from "../domain/repositories/ModerationCaseRepository";
import { TempBanRepository } from "../domain/repositories/TempBanRepository";
import { ModLogService } from "../domain/services/ModLogService";
import {
  ActionType,
  actionTypeRequiresDiscordAction,
} from "../domain/value-objects/ActionType";
import { formatActionTypeAsPastTense } from "../presentation/views/ActionTypeFormatter";
import { DMPolicyService } from "./DMPolicyService";
import { 
  ExecutionContext, 
  ExecutionContextWithCaseId,
  CompleteExecutionContext,
  InitialContext, 
  CompleteContext,
  AnyExecutionContext 
} from "./ExecutionContext";

// Constants
const DEFAULT_DELETE_MESSAGE_DAYS = 0 as const;

/**
 * Handles the execution pipeline for single moderation actions.
 * Extracted from ModerationService to follow Single Responsibility Principle.
 */
export class ModerationExecutionPipeline {
  constructor(
    private readonly caseRepository: ModerationCaseRepository,
    private readonly tempBanRepository: TempBanRepository,
    private readonly modLogService: ModLogService,
    private readonly dmPolicyService: DMPolicyService,
    private readonly client: Client,
    private readonly logger: Logger,
  ) {}

  /**
   * Executes a single moderation action through a clear pipeline of stages.
   *
   * Pipeline stages:
   * 1. Create case and validate
   * 2. Send pre-action DM (for ban actions)
   * 3. Execute Discord action
   * 4. Handle post-action tasks (temp bans, post-DMs, mod logs)
   */
  async execute(
    action: ModerationAction,
    finalActionType: ActionType,
    target: ModerationTarget,
    tx: NodePgDatabase<typeof schema>,
  ): Promise<Result<ModerationCase, string>> {
    const context: InitialContext = new ExecutionContext(action, finalActionType, target, tx);

    this.logger.info(
      {
        originalActionType: action.actionType,
        finalActionType: finalActionType,
        targetId: target.id,
        executorId: action.executor.id,
        guildId: action.guildId,
      },
      "Executing moderation action pipeline",
    );

    try {
      // Type-safe pipeline progression with state transitions
      const contextWithCase = await this.createCase(context);
      const contextWithPreDM = await this.sendPreActionDM(contextWithCase);
      const contextAfterDiscord = await this.executeDiscordAction(contextWithPreDM);
      const finalContext = await this.handlePostActionTasks(contextAfterDiscord);

      this.logger.info(
        {
          originalActionType: action.actionType,
          finalActionType: finalActionType,
          targetId: target.id,
          executorId: action.executor.id,
          guildId: action.guildId,
          caseId: finalContext.getCaseId(), // TypeScript knows this is safe
        },
        "Moderation action executed successfully",
      );

      return Ok(finalContext.getModerationCase()); // TypeScript knows this is safe
    } catch (error) {
      await this.cleanupOnFailure(context, error);
      return Err(error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Stage 1: Create and validate moderation case with row locking.
   * Returns a context with both case ID and moderation case set.
   */
  private async createCase(context: InitialContext): Promise<CompleteContext> {
    const validationResult = context.action.validate();
    if (!validationResult.ok) {
      this.logger.error(
        {
          actionType: context.action.actionType,
          targetId: context.target.id,
          error: validationResult.val,
        },
        "Action validation failed",
      );
      throw new Error(validationResult.val);
    }

    // Use the transaction-aware repository to get next case number with locking
    const caseNumberResult = await this.caseRepository.getNextCaseNumber(
      context.action.guildId,
      context.tx,
    );

    if (!caseNumberResult.ok) {
      this.logger.error(
        {
          actionType: context.action.actionType,
          targetId: context.target.id,
          error: caseNumberResult.val,
        },
        "Failed to get next case number",
      );
      throw new Error(caseNumberResult.val);
    }

    const caseId = caseNumberResult.val.toString();
    const contextWithCaseId = context.setCaseId(caseId);

    const moderationCase = ModerationCase.create(
      context.action.guildId,
      caseId,
      context.actionType,
      context.target.id,
      context.target.tag,
      context.action.executor.id,
      context.action.reason,
      undefined,
      context.action.attachment ? [context.action.attachment.url] : [],
    );

    const saveCaseResult = await this.caseRepository.save(
      moderationCase,
      context.tx,
    );
    if (!saveCaseResult.ok) {
      this.logger.error(
        {
          actionType: context.action.actionType,
          targetId: context.target.id,
          error: saveCaseResult.val,
        },
        "Failed to save moderation case",
      );
      throw new Error(saveCaseResult.val);
    }

    return contextWithCaseId.updateModerationCase(moderationCase);
  }

  /**
   * Stage 2: Send DM before Discord action (for ban actions only).
   * Returns updated context if DM was sent, otherwise returns the same context.
   */
  private async sendPreActionDM(context: CompleteContext): Promise<CompleteContext> {
    const { caseId, moderationCase } = context.getCaseData();

    const dmResult = await this.handleDMDelivery(
      "before",
      context.action,
      context.target,
      caseId,
      moderationCase,
      context.tx,
    );

    if (dmResult) {
      return context.updateModerationCase(dmResult);
    }

    return context;
  }

  /**
   * Stage 3: Execute Discord API action.
   * Returns the same context since Discord actions don't modify context state.
   */
  private async executeDiscordAction(context: CompleteContext): Promise<CompleteContext> {
    if (!actionTypeRequiresDiscordAction(context.actionType)) {
      return context; // Nothing to do for actions like Warn or Note
    }

    const discordResult = await this.performDiscordAction(
      context.action.guildId,
      context.action,
      context.target,
      context.actionType,
    );

    if (!discordResult.ok) {
      this.logger.error(
        {
          actionType: context.actionType,
          targetId: context.target.id,
          executorId: context.action.executor.id,
          guildId: context.action.guildId,
          error: discordResult.val,
        },
        "Failed to execute Discord action",
      );
      throw new Error(`Discord action failed: ${discordResult.val}`);
    }

    return context;
  }

  /**
   * Stage 4: Handle post-action tasks (temp bans, post-DMs, mod logs).
   * Returns updated context if any operations modify the moderation case.
   */
  private async handlePostActionTasks(context: CompleteContext): Promise<CompleteContext> {
    // Sub-task 1: Manage temp ban records
    await this.manageTempBanRecords(context);

    // Sub-task 2: Send post-action DM (may update context)
    const contextAfterDM = await this.sendPostActionDM(context);

    // Sub-task 3: Send mod log for Warn/Note actions
    await this.sendModLogIfNeeded(contextAfterDM);

    return contextAfterDM;
  }

  /**
   * Manages temporary ban database records based on action type.
   */
  private async manageTempBanRecords(context: CompleteContext): Promise<void> {
    const tempBanResult = await this.manageTempBanRecordsInternal(
      context.action,
      context.target,
    );

    if (!tempBanResult.ok) {
      this.logger.error(
        {
          actionType: context.actionType,
          targetId: context.target.id,
          guildId: context.action.guildId,
          error: tempBanResult.val,
        },
        "Failed to manage temp ban records",
      );
      // Note: We don't fail the entire operation since Discord action succeeded
      // This is logged as an error but doesn't throw
    }
  }

  /**
   * Sends post-action DM (for non-ban actions).
   * Returns updated context if DM was sent, otherwise returns the same context.
   */
  private async sendPostActionDM(context: CompleteContext): Promise<CompleteContext> {
    const { caseId, moderationCase } = context.getCaseData();

    const dmAfterResult = await this.handleDMDelivery(
      "after",
      context.action,
      context.target,
      caseId,
      moderationCase,
      context.tx,
    );

    if (dmAfterResult) {
      return context.updateModerationCase(dmAfterResult);
    }

    return context;
  }

  /**
   * Sends mod log for Warn/Note actions.
   */
  private async sendModLogIfNeeded(context: CompleteContext): Promise<void> {
    if (this.modLogService.shouldPostToModLog(context.actionType)) {
      const moderationCase = context.getModerationCase();

      const modLogResult = await this.modLogService.sendModLog(
        context.action.guildId,
        context.actionType,
        context.target,
        moderationCase,
      );

      if (!modLogResult.ok) {
        this.logger.warn(
          {
            actionType: context.actionType,
            targetId: context.target.id,
            guildId: context.action.guildId,
            error: modLogResult.val,
          },
          "Failed to send mod log",
        );
        // Don't fail the operation, just log the warning
      }
    }
  }

  /**
   * Comprehensive cleanup on pipeline failure.
   * Uses runtime checks and type guards since the context might be in any state when failure occurs.
   */
  private async cleanupOnFailure(
    context: AnyExecutionContext,
    error: unknown,
  ): Promise<void> {
    // Get case ID safely for logging - might not exist if failure was early
    let caseId: string | undefined;
    if (context instanceof ExecutionContextWithCaseId || context instanceof CompleteExecutionContext) {
      caseId = context.getCaseId();
    }

    this.logger.error(
      {
        err: error,
        actionType: context.actionType,
        targetId: context.target.id,
        guildId: context.action.guildId,
        caseId,
      },
      "Pipeline execution failed, starting cleanup",
    );

    const cleanupTasks: Promise<unknown>[] = [];

    // Clean up DM if it was sent - check if we have a complete context with moderation case
    if (context instanceof CompleteExecutionContext) {
      const moderationCase = context.getModerationCase();
      if (
        moderationCase.dmResult?.messageId &&
        moderationCase.dmResult?.channelId
      ) {
        cleanupTasks.push(this.cleanupDMOnFailure(moderationCase));
      }
    }

    // Delete mod log entry if case was created - check if we have case ID
    if (context instanceof ExecutionContextWithCaseId || context instanceof CompleteExecutionContext) {
      const caseIdForDeletion = context.getCaseId();
      cleanupTasks.push(
        this.caseRepository.delete(
          context.action.guildId,
          caseIdForDeletion,
          context.tx,
        ),
      );
    }

    // Execute all cleanup operations
    const results = await Promise.allSettled(cleanupTasks);

    // Log any cleanup failures
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        this.logger.error(
          {
            err: result.reason,
            guildId: context.action.guildId,
            caseId,
          },
          `Cleanup operation ${index} failed during rollback`,
        );
      }
    });
  }

  /**
   * Helper method to handle DM delivery based on timing and policy.
   */
  private async handleDMDelivery(
    timing: "before" | "after",
    action: ModerationAction,
    target: ModerationTarget,
    caseId: string,
    moderationCase: ModerationCase,
    tx: NodePgDatabase<typeof schema>,
  ): Promise<ModerationCase | null> {
    const shouldSendDM = await this.dmPolicyService.shouldSendDM(
      timing,
      action,
      target,
      action.guildId,
    );

    if (!shouldSendDM) {
      return null;
    }

    const dmResult = await this.sendDM(action.guildId, caseId, action, target);
    const updatedCase = moderationCase.withDMResult(dmResult);

    const updateResult = await this.caseRepository.update(updatedCase, tx);
    if (!updateResult.ok) {
      this.logger.warn(
        {
          actionType: action.actionType,
          targetId: target.id,
          timing,
          error: updateResult.val,
        },
        "Failed to update case with DM result",
      );
    }

    return updatedCase;
  }

  /**
   * Helper method to send DM to target user.
   */
  private async sendDM(
    guildId: string,
    caseId: string,
    action: ModerationAction,
    target: ModerationTarget,
  ): Promise<{ channelId?: string; messageId?: string; error?: string }> {
    try {
      const guild = this.client.guilds.cache.get(guildId);
      const guildName = guild ? guild.name : "Unknown Guild";

      const dmChannel = await target.user.createDM();

      let dmContent = `You have been ${formatActionTypeAsPastTense(action.actionType)} in **${guildName}**`;

      if (action.reason) {
        dmContent += `\n**Reason:** ${action.reason.value}`;
      }

      if (action.isTemporalAction()) {
        dmContent += `\n**Duration:** ${action.duration.originalString}`;
        dmContent += `\n**Expires:** <t:${Math.floor(action.duration.endTime().unix())}:f>`;
      }

      const message = await dmChannel.send(dmContent);

      this.logger.info(
        {
          caseId: caseId.toString(),
          targetId: target.id,
          messageId: message.id,
        },
        "DM sent successfully",
      );

      return {
        channelId: dmChannel.id,
        messageId: message.id,
      };
    } catch (error) {
      this.logger.warn(
        {
          caseId: caseId.toString(),
          targetId: target.id,
          err: error,
        },
        "Failed to send DM",
      );

      return {
        error: String(error),
      };
    }
  }

  /**
   * Helper method to clean up DM on failure.
   */
  private async cleanupDMOnFailure(caseWithDM: ModerationCase): Promise<void> {
    if (!caseWithDM.dmResult?.messageId || !caseWithDM.dmResult?.channelId) {
      return;
    }

    try {
      const dmChannel = await this.client.channels.fetch(
        caseWithDM.dmResult.channelId,
      );

      if (dmChannel?.isTextBased()) {
        await dmChannel.messages.delete(caseWithDM.dmResult.messageId);
        this.logger.info("Deleted DM after pipeline failure");
      }
    } catch (deleteError) {
      this.logger.warn(
        { err: deleteError },
        "Failed to delete DM after pipeline failure",
      );
    }
  }

  /**
   * Helper method to execute Discord actions based on action type.
   */
  private async performDiscordAction(
    guildId: string,
    action: ModerationAction,
    target: ModerationTarget,
    actionType: ActionType,
  ): Promise<Result<void, string>> {
    const guild = this.client.guilds.cache.get(guildId);
    if (!guild) {
      return Err("Guild not found");
    }

    try {
      switch (actionType) {
        case ActionType.Ban: {
          if (!action.isBanAction()) {
            return Err("Invalid action type for ban operation");
          }
          await guild.members.ban(target.id, {
            reason: action.reason?.value || "No reason provided",
            deleteMessageDays:
              action.deleteMessageDays || DEFAULT_DELETE_MESSAGE_DAYS,
          });
          break;
        }

        case ActionType.TempBan: {
          if (!action.isTempBanAction()) {
            return Err("Invalid action type for temp ban operation");
          }
          await guild.members.ban(target.id, {
            reason: action.reason?.value || "No reason provided",
            deleteMessageDays:
              action.deleteMessageDays || DEFAULT_DELETE_MESSAGE_DAYS,
          });
          break;
        }

        case ActionType.BanRemove: {
          await guild.members.unban(
            target.id,
            action.reason?.value || "No reason provided",
          );
          break;
        }

        case ActionType.Kick: {
          if (!target.member) {
            return Err("Cannot kick a user who is not in the guild");
          }
          await target.member.kick(
            action.reason?.value || "No reason provided",
          );
          break;
        }

        case ActionType.Timeout: {
          if (!target.member) {
            return Err("Cannot timeout a user who is not in the guild");
          }
          if (!action.isTimeoutAction()) {
            return Err("Invalid action type for timeout operation");
          }
          await target.member.timeout(
            action.duration.value.asMilliseconds(),
            action.reason?.value || "No reason provided",
          );
          break;
        }

        case ActionType.TimeoutAdjust: {
          if (!target.member) {
            return Err("Cannot timeout a user who is not in the guild");
          }
          if (!action.isTimeoutAction()) {
            return Err("Invalid action type for timeout operation");
          }
          await target.member.timeout(
            action.duration.value.asMilliseconds(),
            action.reason?.value || "No reason provided",
          );
          break;
        }

        case ActionType.TimeoutRemove: {
          if (!target.member) {
            return Err(
              "Cannot remove timeout from a user who is not in the guild",
            );
          }
          await target.member.timeout(
            null,
            action.reason?.value || "No reason provided",
          );
          break;
        }

        default:
          break;
      }

      this.logger.info(
        {
          actionType: actionType,
          targetId: target.id,
          guildId,
        },
        "Discord action executed successfully",
      );

      return Ok.EMPTY;
    } catch (error) {
      this.logger.error(
        {
          actionType: actionType,
          targetId: target.id,
          guildId,
          err: error,
        },
        "Failed to execute Discord action",
      );

      return Err(`Discord action failed: ${error}`);
    }
  }

  /**
   * Helper method to manage temp ban records.
   */
  private async manageTempBanRecordsInternal(
    action: ModerationAction,
    target: ModerationTarget,
  ): Promise<Result<void, string>> {
    switch (action.actionType) {
      case ActionType.TempBan: {
        if (!action.isTempBanAction()) {
          return Err("Invalid action type for temp ban database operation");
        }

        // Create temp ban record with expiration time
        const expiresAt = action.duration.endTime();
        const tempBan = TempBan.create(target.id, action.guildId, expiresAt);

        const saveResult = await this.tempBanRepository.save(tempBan);
        if (!saveResult.ok) {
          return Err(`Failed to save temp ban: ${saveResult.val}`);
        }

        this.logger.info(
          {
            userId: target.id,
            guildId: action.guildId,
            expiresAt: expiresAt.toISOString(),
          },
          "Created temp ban database record",
        );
        break;
      }

      case ActionType.BanRemove: {
        // Delete temp ban record if it exists (user might have been manually unbanned)
        const deleteResult = await this.tempBanRepository.delete(
          action.guildId,
          target.id,
        );
        if (!deleteResult.ok) {
          return Err(`Failed to delete temp ban: ${deleteResult.val}`);
        }

        if (deleteResult.val) {
          this.logger.info(
            {
              userId: target.id,
              guildId: action.guildId,
            },
            "Deleted temp ban database record",
          );
        } else {
          this.logger.debug(
            {
              userId: target.id,
              guildId: action.guildId,
            },
            "No temp ban record found to delete",
          );
        }
        break;
      }

      default:
        // No temp ban database operations needed for other action types
        break;
    }

    return Ok.EMPTY;
  }
}
