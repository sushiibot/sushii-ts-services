import { UserLevel } from "../entities/UserLevel";

export interface UserLevelRepository {
  findByUserAndGuild(userId: string, guildId: string): Promise<UserLevel | null>;
  save(userLevel: UserLevel): Promise<void>;
  create(userLevel: UserLevel): Promise<void>;
}