import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Logger } from "pino";
import { Err, Result } from "ts-results";

import * as schema from "@/infrastructure/database/schema";

import { ModerationAction } from "../../shared/domain/entities/ModerationAction";
import { ModerationCase } from "../../shared/domain/entities/ModerationCase";
import { ModerationTarget } from "../../shared/domain/entities/ModerationTarget";
import { PermissionValidationService } from "../../shared/domain/services/PermissionValidationService";
import { TimeoutDetectionService } from "../../shared/domain/services/TimeoutDetectionService";
import { ModerationExecutionPipeline } from "./ModerationExecutionPipeline";

export class ModerationService {
  constructor(
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly permissionService: PermissionValidationService,
    private readonly timeoutDetectionService: TimeoutDetectionService,
    private readonly executionPipeline: ModerationExecutionPipeline,
    private readonly logger: Logger,
  ) {}

  /**
   * Enhanced executeAction with transaction support, permission validation,
   * timeout detection, comprehensive rollback.
   */
  async executeAction(
    action: ModerationAction,
    targets: ModerationTarget[],
  ): Promise<Result<ModerationCase, string>[]> {
    this.logger.info(
      {
        actionType: action.actionType,
        targetCount: targets.length,
        executorId: action.executor.id,
        guildId: action.guildId,
      },
      "Executing batch moderation actions",
    );

    try {
      // Execute all actions within a transaction for consistency
      const results = await this.db.transaction(async (tx) => {
        const actionResults: Result<ModerationCase, string>[] = [];

        // Process each target sequentially to avoid race conditions
        for (const target of targets) {
          const result = await this.executeActionSingle(action, target, tx);
          actionResults.push(result);
        }

        return actionResults;
      });

      return results;
    } catch (error) {
      this.logger.error(
        {
          err: error,
          actionType: action.actionType,
          targetCount: targets.length,
          guildId: action.guildId,
        },
        "Failed to execute moderation actions",
      );

      // Return error results for all targets
      return targets.map(() => Err(`Transaction failed: ${error}`));
    }
  }

  /**
   * Enhanced executeActionSingle with comprehensive error handling and rollback.
   *
   * Execution flow:
   * 1. Validate permissions for the action
   * 2. Detect timeout adjustments and correct action type
   * 3. Create moderation case record with row locking
   * 4. Send DM notification before Discord action (for ban actions only)
   * 5. Execute the actual Discord API action (ban/kick/timeout/etc.)
   * 6. Manage temp ban database records (create for TempBan, delete for BanRemove)
   * 7. Send DM notification after Discord action (for non-ban actions)
   * 8. Send mod log for Warn/Note actions
   * 9. Comprehensive rollback on any failure
   *
   * @param action - The moderation action to execute
   * @param target - The target user for the action
   * @param tx - Transaction-aware database instance
   * @returns Result containing the final moderation case or error message
   */
  private async executeActionSingle(
    action: ModerationAction,
    target: ModerationTarget,
    tx: NodePgDatabase<typeof schema>,
  ): Promise<Result<ModerationCase, string>> {
    // 1. Permission validation
    const permissionResult = await this.permissionService.canTargetUser(
      action.executor,
      action.executorMember,
      target.user,
      target.member,
      action.actionType,
    );
    if (!permissionResult.ok) {
      return permissionResult;
    }

    // 2. Detect timeout adjustments and correct action type
    const correctedActionType =
      this.timeoutDetectionService.determineTimeoutActionType(
        action.actionType,
        target,
      );

    // Use the corrected action type for this execution
    const finalActionType = correctedActionType;

    return await this.executionPipeline.execute(
      action,
      finalActionType,
      target,
      tx,
    );
  }
}
