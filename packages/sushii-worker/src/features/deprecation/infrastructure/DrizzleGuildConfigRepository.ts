import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { guildConfigsInAppPublic } from "../../../infrastructure/database/schema";
import { GuildConfig, GuildConfigRepository } from "../domain/repositories/GuildConfigRepository";

/**
 * Drizzle implementation of GuildConfigRepository
 */
export class DrizzleGuildConfigRepository implements GuildConfigRepository {
  constructor(private readonly db: NodePgDatabase) {}

  async findById(guildId: string): Promise<GuildConfig | null> {
    const result = await this.db
      .select({
        id: guildConfigsInAppPublic.id,
        prefix: guildConfigsInAppPublic.prefix,
        disabledChannels: guildConfigsInAppPublic.disabledChannels,
      })
      .from(guildConfigsInAppPublic)
      .where(eq(guildConfigsInAppPublic.id, BigInt(guildId)))
      .limit(1);

    if (result.length === 0) {
      // Return default config for non-existent guilds
      return {
        id: guildId,
        prefix: null, // Will default to "s!" in the domain logic
        disabledChannels: null,
      };
    }

    const row = result[0];
    return {
      id: String(row.id),
      prefix: row.prefix,
      disabledChannels: row.disabledChannels ? row.disabledChannels.map(String) : null,
    };
  }
}