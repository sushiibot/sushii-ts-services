import { Result } from "ts-results";

import { ModerationCase } from "../entities/ModerationCase";

export interface ModerationCaseRepository {
  save(moderationCase: ModerationCase): Promise<Result<void, string>>;

  findById(
    guildId: string,
    caseId: string,
  ): Promise<Result<ModerationCase | null, string>>;

  findByUserId(
    guildId: string,
    userId: string,
  ): Promise<Result<ModerationCase[], string>>;

  findByGuildId(
    guildId: string,
    limit?: number,
    offset?: number,
  ): Promise<Result<ModerationCase[], string>>;

  getNextCaseNumber(guildId: string): Promise<Result<bigint, string>>;

  update(moderationCase: ModerationCase): Promise<Result<void, string>>;

  delete(guildId: string, caseId: string): Promise<Result<void, string>>;
}
