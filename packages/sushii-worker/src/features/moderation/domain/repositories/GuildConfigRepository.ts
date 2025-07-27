import { GuildConfig } from "@/features/guild-settings/domain/entities/GuildConfig";

export interface GuildConfigRepository {
  findByGuildId(guildId: string): Promise<GuildConfig>;
}
