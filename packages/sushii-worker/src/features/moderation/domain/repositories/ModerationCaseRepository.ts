import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Result } from "ts-results";

import * as schema from "@/infrastructure/database/schema";

import { ModerationCase } from "../entities/ModerationCase";

export interface ModerationCaseRepository {
  save(
    moderationCase: ModerationCase,
    tx?: NodePgDatabase<typeof schema>,
  ): Promise<Result<void, string>>;

  findById(
    guildId: string,
    caseId: string,
    tx?: NodePgDatabase<typeof schema>,
  ): Promise<Result<ModerationCase | null, string>>;

  findByUserId(
    guildId: string,
    userId: string,
    tx?: NodePgDatabase<typeof schema>,
  ): Promise<Result<ModerationCase[], string>>;

  findByGuildId(
    guildId: string,
    limit?: number,
    offset?: number,
    tx?: NodePgDatabase<typeof schema>,
  ): Promise<Result<ModerationCase[], string>>;

  /**
   * Gets the next case number for a guild.
   * When used within a transaction, automatically applies row locking to prevent race conditions.
   */
  getNextCaseNumber(
    guildId: string,
    tx?: NodePgDatabase<typeof schema>,
  ): Promise<Result<bigint, string>>;

  update(
    moderationCase: ModerationCase,
    tx?: NodePgDatabase<typeof schema>,
  ): Promise<Result<void, string>>;

  delete(
    guildId: string,
    caseId: string,
    tx?: NodePgDatabase<typeof schema>,
  ): Promise<Result<void, string>>;

  /**
   * Delete multiple cases by case ID range and return the deleted cases
   * Used by UncaseCommand for bulk deletion
   */
  deleteRange(
    guildId: string,
    startCaseId: number,
    endCaseId: number,
    tx?: NodePgDatabase<typeof schema>,
  ): Promise<Result<ModerationCase[], string>>;

  /**
   * Check if a case exists by case ID
   * Used for validation before operations
   */
  exists(
    guildId: string,
    caseId: string,
    tx?: NodePgDatabase<typeof schema>,
  ): Promise<Result<boolean, string>>;
}
