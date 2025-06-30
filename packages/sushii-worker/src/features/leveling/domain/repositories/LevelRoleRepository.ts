import { LevelRole } from "../entities/LevelRole";

export interface LevelRoleRepository {
  findByGuild(guildId: string): Promise<LevelRole[]>;
}
