import { and, desc, eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Logger } from "pino";
import { Err, Ok, Result } from "ts-results";

import * as schema from "@/infrastructure/database/schema";
import { modLogsInAppPublic } from "@/infrastructure/database/schema";

import { DMResult, ModerationCase } from "../../domain/entities/ModerationCase";
import { ModerationCaseRepository } from "../../domain/repositories/ModerationCaseRepository";
import { actionTypeFromString } from "../../domain/value-objects/ActionType";
import { Reason } from "../../domain/value-objects/Reason";

export class DrizzleModerationCaseRepository
  implements ModerationCaseRepository
{
  constructor(
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly logger: Logger,
  ) {}

  async save(moderationCase: ModerationCase): Promise<Result<void, string>> {
    try {
      const dmResult = moderationCase.dmResult;

      await this.db.insert(modLogsInAppPublic).values({
        guildId: BigInt(moderationCase.guildId),
        caseId: BigInt(moderationCase.caseId),
        action: moderationCase.actionType,
        actionTime: moderationCase.actionTime,
        pending: moderationCase.pending,
        userId: BigInt(moderationCase.userId),
        userTag: moderationCase.userTag,
        executorId: moderationCase.executorId
          ? BigInt(moderationCase.executorId)
          : null,
        reason: moderationCase.reason?.value || null,
        msgId: moderationCase.msgId ? BigInt(moderationCase.msgId) : null,
        attachments: moderationCase.attachments,
        dmChannelId: dmResult?.channelId ? BigInt(dmResult.channelId) : null,
        dmMessageId: dmResult?.messageId ? BigInt(dmResult.messageId) : null,
        dmMessageError: dmResult?.error || null,
      });

      return Ok.EMPTY;
    } catch (error) {
      this.logger.error({ error }, "Failed to save moderation case");
      return Err(`Failed to save moderation case: ${error}`);
    }
  }

  async findById(
    guildId: string,
    caseId: string,
  ): Promise<Result<ModerationCase | null, string>> {
    try {
      const result = await this.db
        .select()
        .from(modLogsInAppPublic)
        .where(
          and(
            eq(modLogsInAppPublic.guildId, BigInt(guildId)),
            eq(modLogsInAppPublic.caseId, BigInt(caseId)),
          ),
        )
        .limit(1);

      if (result.length === 0) {
        return Ok(null);
      }

      const row = result[0];
      const moderationCase = this.mapRowToModerationCase(row);
      return Ok(moderationCase);
    } catch (error) {
      this.logger.error(
        { error, caseId: caseId.toString() },
        "Failed to find moderation case by ID",
      );
      return Err(`Failed to find moderation case: ${error}`);
    }
  }

  async findByUserId(
    guildId: string,
    userId: string,
  ): Promise<Result<ModerationCase[], string>> {
    try {
      const results = await this.db
        .select()
        .from(modLogsInAppPublic)
        .where(
          and(
            eq(modLogsInAppPublic.guildId, BigInt(guildId)),
            eq(modLogsInAppPublic.userId, BigInt(userId)),
          ),
        )
        .orderBy(desc(modLogsInAppPublic.actionTime));

      const cases = results.map((row) => this.mapRowToModerationCase(row));
      return Ok(cases);
    } catch (error) {
      this.logger.error(
        { error, guildId, userId },
        "Failed to find moderation cases by user ID",
      );
      return Err(`Failed to find moderation cases: ${error}`);
    }
  }

  async findByGuildId(
    guildId: string,
    limit = 50,
    offset = 0,
  ): Promise<Result<ModerationCase[], string>> {
    try {
      const results = await this.db
        .select()
        .from(modLogsInAppPublic)
        .where(eq(modLogsInAppPublic.guildId, BigInt(guildId)))
        .orderBy(desc(modLogsInAppPublic.actionTime))
        .limit(limit)
        .offset(offset);

      const cases = results.map((row) => this.mapRowToModerationCase(row));
      return Ok(cases);
    } catch (error) {
      this.logger.error(
        { error, guildId, limit, offset },
        "Failed to find moderation cases by guild ID",
      );
      return Err(`Failed to find moderation cases: ${error}`);
    }
  }

  async getNextCaseNumber(guildId: string): Promise<Result<bigint, string>> {
    try {
      const result = await this.db
        .select({ maxCaseId: modLogsInAppPublic.caseId })
        .from(modLogsInAppPublic)
        .where(eq(modLogsInAppPublic.guildId, BigInt(guildId)))
        .orderBy(desc(modLogsInAppPublic.caseId))
        .limit(1);

      const nextCaseNumber = result.length > 0 ? result[0].maxCaseId + 1n : 1n;
      return Ok(nextCaseNumber);
    } catch (error) {
      this.logger.error({ error, guildId }, "Failed to get next case number");
      return Err(`Failed to get next case number: ${error}`);
    }
  }

  async update(moderationCase: ModerationCase): Promise<Result<void, string>> {
    try {
      const dmResult = moderationCase.dmResult;

      await this.db
        .update(modLogsInAppPublic)
        .set({
          action: moderationCase.actionType,
          actionTime: moderationCase.actionTime,
          pending: moderationCase.pending,
          userTag: moderationCase.userTag,
          executorId: moderationCase.executorId
            ? BigInt(moderationCase.executorId)
            : null,
          reason: moderationCase.reason?.value || null,
          msgId: moderationCase.msgId ? BigInt(moderationCase.msgId) : null,
          attachments: moderationCase.attachments,
          dmChannelId: dmResult?.channelId ? BigInt(dmResult.channelId) : null,
          dmMessageId: dmResult?.messageId ? BigInt(dmResult.messageId) : null,
          dmMessageError: dmResult?.error || null,
        })
        .where(
          and(
            eq(modLogsInAppPublic.guildId, BigInt(moderationCase.guildId)),
            eq(modLogsInAppPublic.caseId, BigInt(moderationCase.caseId)),
          ),
        );

      return Ok.EMPTY;
    } catch (error) {
      this.logger.error({ error }, "Failed to update moderation case");
      return Err(`Failed to update moderation case: ${error}`);
    }
  }

  async delete(guildId: string, caseId: string): Promise<Result<void, string>> {
    try {
      await this.db
        .delete(modLogsInAppPublic)
        .where(
          and(
            eq(modLogsInAppPublic.guildId, BigInt(guildId)),
            eq(modLogsInAppPublic.caseId, BigInt(caseId)),
          ),
        );

      return Ok.EMPTY;
    } catch (error) {
      this.logger.error(
        { error, guildId, caseId },
        "Failed to delete moderation case",
      );
      return Err(`Failed to delete moderation case: ${error}`);
    }
  }

  private mapRowToModerationCase(
    row: typeof modLogsInAppPublic.$inferSelect,
  ): ModerationCase {
    const actionType = actionTypeFromString(row.action);
    const reason = row.reason ? Reason.create(row.reason).unwrap() : null;

    let dmResult: DMResult | null = null;
    if (row.dmChannelId || row.dmMessageId || row.dmMessageError) {
      dmResult = {
        channelId: row.dmChannelId?.toString(),
        messageId: row.dmMessageId?.toString(),
        error: row.dmMessageError || undefined,
      };
    }

    return new ModerationCase(
      row.guildId.toString(),
      row.caseId.toString(),
      actionType,
      row.actionTime,
      row.userId.toString(),
      row.userTag,
      row.executorId?.toString() || null,
      reason,
      row.msgId?.toString() || null,
      row.attachments || [],
      dmResult,
      row.pending,
    );
  }
}
