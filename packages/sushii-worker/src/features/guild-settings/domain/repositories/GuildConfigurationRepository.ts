import { GuildConfig } from "../entities/GuildConfig";

export interface GuildConfigurationRepository {
  findByGuildId(guildId: string): Promise<GuildConfig>;
  save(configuration: GuildConfig): Promise<GuildConfig>;
}
