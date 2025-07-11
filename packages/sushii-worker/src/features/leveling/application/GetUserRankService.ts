import { User } from "discord.js";
import { Result, Ok, Err } from "ts-results";
import { UserRank } from "../domain/entities/UserRank";
import { UserProfile } from "../domain/entities/UserProfile";
import { UserLevel } from "../domain/entities/UserLevel";
import { GlobalUserLevel } from "../domain/entities/GlobalUserLevel";
import { UserProfileRepository } from "../domain/repositories/UserProfileRepository";
import { UserLevelRepository } from "../domain/repositories/UserLevelRepository";

export interface UserRankData {
  user: User;
  profile: UserProfile;
  guildLevel: UserLevel;
  globalLevel: GlobalUserLevel;
  rankings: UserRank;
}

export class GetUserRankService {
  constructor(
    private readonly userProfileRepository: UserProfileRepository,
    private readonly userLevelRepository: UserLevelRepository,
  ) {}

  async execute(
    user: User,
    guildId: string,
  ): Promise<Result<UserRankData, string>> {
    try {
      const [profile, guildLevel, globalLevel, rankings] = await Promise.all([
        this.userProfileRepository.getUserProfile(user.id),
        this.userLevelRepository.getUserGuildLevel(guildId, user.id),
        this.userLevelRepository.getUserGlobalLevel(user.id),
        this.userLevelRepository.getUserGuildRankings(guildId, user.id),
      ]);

      return Ok({
        user,
        profile,
        guildLevel,
        globalLevel,
        rankings,
      });
    } catch (error) {
      return Err(`Failed to get user rank data: ${error}`);
    }
  }
}
