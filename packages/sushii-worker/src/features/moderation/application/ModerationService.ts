import { Client } from "discord.js";
import { Logger } from "pino";
import { Err, Ok, Result } from "ts-results";

import { ModerationAction } from "../domain/entities/ModerationAction";
import { DMResult, ModerationCase } from "../domain/entities/ModerationCase";
import { ModerationTarget } from "../domain/entities/ModerationTarget";
import { ModerationCaseRepository } from "../domain/repositories/ModerationCaseRepository";
import {
  ActionType,
  actionTypeRequiresDiscordAction,
} from "../domain/value-objects/ActionType";
import { formatActionTypeAsPastTense } from "../presentation/views/ActionTypeFormatter";
import { DMPolicyService } from "./DMPolicyService";

// Constants
const DEFAULT_DELETE_MESSAGE_DAYS = 0;

export class ModerationService {
  constructor(
    private readonly client: Client,
    private readonly caseRepository: ModerationCaseRepository,
    private readonly dmPolicyService: DMPolicyService,
    private readonly logger: Logger,
  ) {}

  async executeAction(
    action: ModerationAction,
    targets: ModerationTarget[],
  ): Promise<Result<ModerationCase, string>[]> {
    this.logger.info("Executing batch moderation actions");

    const results: Result<ModerationCase, string>[] = [];
    for (const target of targets) {
      const result = await this.executeActionSingle(action, target);
      results.push(result);
    }

    return results;
  }

  private async executeActionSingle(
    action: ModerationAction,
    target: ModerationTarget,
  ): Promise<Result<ModerationCase, string>> {
    const log = this.logger.child({
      actionType: action.actionType,
      targetId: target.id,
      executorId: action.executor.id,
      guildId: action.guildId,
    });

    log.info("Executing moderation action");

    // Validate and create case
    const caseResult = await this.validateAndCreateCase(action, target);
    if (!caseResult.ok) {
      return caseResult;
    }

    let finalCase = caseResult.val.case;
    const caseId = caseResult.val.caseId;

    // Send DM before Discord action for ban actions
    const dmBeforeResult = await this.sendDMIfNeeded(
      "before",
      action,
      target,
      caseId,
      finalCase,
    );
    if (dmBeforeResult) {
      finalCase = dmBeforeResult;
    }

    // Execute Discord action
    let discordActionFailed = false;
    if (actionTypeRequiresDiscordAction(action.actionType)) {
      const discordResult = await this.executeDiscordAction(
        action.guildId,
        action,
        target,
      );
      if (!discordResult.ok) {
        log.error(
          { error: discordResult.val },
          "Failed to execute Discord action",
        );
        discordActionFailed = true;

        // Clean up DM if Discord action failed
        await this.cleanupDMOnFailure(dmBeforeResult, log);
        return Err(String(discordResult.val));
      }
    }

    // Send DM after Discord action for non-ban actions
    if (!discordActionFailed) {
      const dmAfterResult = await this.sendDMIfNeeded(
        "after",
        action,
        target,
        caseId,
        finalCase,
      );
      if (dmAfterResult) {
        finalCase = dmAfterResult;
      }
    }

    log.info(
      { guildId: action.guildId, caseId },
      "Moderation action executed successfully",
    );
    return Ok(finalCase);
  }

  private async validateAndCreateCase(
    action: ModerationAction,
    target: ModerationTarget,
  ): Promise<Result<{ case: ModerationCase; caseId: string }, string>> {
    const log = this.logger.child({
      actionType: action.actionType,
      targetId: target.id,
    });

    const validationResult = action.validate();
    if (!validationResult.ok) {
      log.error({ error: validationResult.val }, "Action validation failed");
      return Err(String(validationResult.val));
    }

    const caseNumberResult = await this.caseRepository.getNextCaseNumber(
      action.guildId,
    );

    if (!caseNumberResult.ok) {
      log.error(
        { error: caseNumberResult.val },
        "Failed to get next case number",
      );
      return Err(String(caseNumberResult.val));
    }

    const caseId = caseNumberResult.val.toString();

    const moderationCase = ModerationCase.create(
      action.guildId,
      caseId,
      action.actionType,
      target.id,
      target.tag,
      action.executor.id,
      action.reason,
      undefined,
      action.attachment ? [action.attachment.url] : [],
    );

    const saveCaseResult = await this.caseRepository.save(moderationCase);
    if (!saveCaseResult.ok) {
      log.error(
        { error: saveCaseResult.val },
        "Failed to save moderation case",
      );
      return Err(String(saveCaseResult.val));
    }

    return Ok({ case: moderationCase, caseId });
  }

  private async sendDMIfNeeded(
    timing: "before" | "after",
    action: ModerationAction,
    target: ModerationTarget,
    caseId: string,
    moderationCase: ModerationCase,
  ): Promise<ModerationCase | null> {
    const log = this.logger.child({
      actionType: action.actionType,
      targetId: target.id,
      timing,
    });

    const shouldSendDMResult = await this.dmPolicyService.shouldSendDM(
      timing,
      action,
      target,
      action.guildId,
    );

    if (!shouldSendDMResult) {
      return null;
    }

    const dmResult = await this.sendDM(action.guildId, caseId, action, target);
    const updatedCase = moderationCase.withDMResult(dmResult);

    const updateResult = await this.caseRepository.update(updatedCase);
    if (!updateResult.ok) {
      log.warn(
        { error: updateResult.val },
        "Failed to update case with DM result",
      );
    }

    return updatedCase;
  }

  private async cleanupDMOnFailure(
    caseWithDM: ModerationCase | null,
    log: Logger,
  ): Promise<void> {
    if (!caseWithDM?.dmResult?.messageId || !caseWithDM?.dmResult?.channelId) {
      return;
    }

    try {
      const dmChannel = await this.client.channels.fetch(
        caseWithDM.dmResult.channelId,
      );
      if (dmChannel?.isTextBased()) {
        await dmChannel.messages.delete(caseWithDM.dmResult.messageId);
        log.info("Deleted DM after Discord action failure");
      }
    } catch (deleteError) {
      log.warn(
        { error: deleteError },
        "Failed to delete DM after Discord action failure",
      );
    }
  }

  private async sendDM(
    guildId: string,
    caseId: string,
    action: ModerationAction,
    target: ModerationTarget,
  ): Promise<DMResult> {
    const log = this.logger.child({
      caseId: caseId.toString(),
      targetId: target.id,
    });

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

      log.info({ messageId: message.id }, "DM sent successfully");
      return {
        channelId: dmChannel.id,
        messageId: message.id,
      };
    } catch (error) {
      log.warn({ error }, "Failed to send DM");
      return {
        error: String(error),
      };
    }
  }

  private async executeDiscordAction(
    guildId: string,
    action: ModerationAction,
    target: ModerationTarget,
  ): Promise<Result<void, string>> {
    const log = this.logger.child({
      actionType: action.actionType,
      targetId: target.id,
    });

    const guild = this.client.guilds.cache.get(guildId);
    if (!guild) {
      log.error("Guild not found");
      return Err("Guild not found");
    }

    try {
      switch (action.actionType) {
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

      log.info("Discord action executed successfully");
      return Ok.EMPTY;
    } catch (error) {
      log.error({ error }, "Failed to execute Discord action");
      return Err(`Discord action failed: ${error}`);
    }
  }
}
