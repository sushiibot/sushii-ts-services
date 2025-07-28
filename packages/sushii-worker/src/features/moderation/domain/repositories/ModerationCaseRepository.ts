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
}
