import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Logger } from "pino";

import { GuildConfig } from "@/features/guild-settings/domain/entities/GuildConfig";
import { DrizzleGuildConfigurationRepository } from "@/features/guild-settings/infrastructure/DrizzleGuildConfigurationRepository";
import * as schema from "@/infrastructure/database/schema";

import { GuildConfigRepository } from "../../domain/repositories/GuildConfigRepository";

export class DrizzleGuildConfigRepository implements GuildConfigRepository {
  private readonly guildConfigRepo: DrizzleGuildConfigurationRepository;

  constructor(
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly logger: Logger,
  ) {
    this.guildConfigRepo = new DrizzleGuildConfigurationRepository(db, logger);
  }

  async findByGuildId(guildId: string): Promise<GuildConfig> {
    const config = await this.guildConfigRepo.findByGuildId(guildId);
    if (!config) {
      return GuildConfig.createDefault(guildId);
    }

    return config;
  }
}
