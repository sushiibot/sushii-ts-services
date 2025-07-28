import { Client } from "discord.js";
import { User } from "discord.js";
import { Logger } from "pino";
import { Err, Ok, Result } from "ts-results";

import { ModerationCase } from "../domain/entities/ModerationCase";
import { ModerationCaseRepository } from "../domain/repositories/ModerationCaseRepository";
import { UserInfo } from "../domain/types/UserInfo";

export interface UserHistoryResult {
  userInfo: UserInfo;
  moderationHistory: ModerationCase[];
  totalCases: number;
}

export class HistoryService {
  constructor(
    private readonly client: Client,
    private readonly caseRepository: ModerationCaseRepository,
    private readonly logger: Logger,
  ) {}

  async getUserHistory(
    guildId: string,
    userId: string,
  ): Promise<Result<UserHistoryResult, string>> {
    const log = this.logger.child({ guildId, userId });

    log.info("Looking up user moderation history");

    const guild = this.client.guilds.cache.get(guildId);
    if (!guild) {
      return Err("Guild not found");
    }

    const member = guild.members.cache.get(userId);
    let user: User | null = null;

    if (member) {
      user = member.user;
    } else {
      try {
        user = await this.client.users.fetch(userId);
      } catch (error) {
        log.error({ error }, "Failed to fetch user from Discord");
        return Err(`Failed to fetch user: ${error}`);
      }
    }

    if (!user) {
      return Err("User not found");
    }

    const moderationHistoryResult = await this.caseRepository.findByUserId(
      guildId,
      userId,
    );
    if (!moderationHistoryResult.ok) {
      log.error(
        { error: moderationHistoryResult.val },
        "Failed to get moderation history",
      );
      return Err(moderationHistoryResult.val);
    }

    const result: UserHistoryResult = {
      userInfo: {
        id: user.id,
        username: user.username,
        avatarURL: user.displayAvatarURL(),
        createdAt: user.createdAt,
        joinedAt: member ? member.joinedAt : null,
        isBot: user.bot,
      },
      moderationHistory: moderationHistoryResult.val,
      totalCases: moderationHistoryResult.val.length,
    };

    log.info({ totalCases: result.totalCases }, "User history lookup completed");
    return Ok(result);
  }
}