import { GlobalUserLevel } from "../entities/GlobalUserLevel";
import { UserLevel } from "../entities/UserLevel";
import { UserRank } from "../entities/UserRank";

export interface UserLevelRepository {
  findByUserAndGuild(
    userId: string,
    guildId: string,
  ): Promise<UserLevel | null>;
  getUserGuildLevel(guildId: string, userId: string): Promise<UserLevel>;
  getUserGlobalLevel(userId: string): Promise<GlobalUserLevel>;
  getUserGuildRankings(guildId: string, userId: string): Promise<UserRank>;
  save(userLevel: UserLevel): Promise<void>;
  create(userLevel: UserLevel): Promise<void>;
}
