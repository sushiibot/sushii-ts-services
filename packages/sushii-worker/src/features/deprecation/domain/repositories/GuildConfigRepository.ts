/**
 * Guild configuration value object for the deprecation feature
 */
export interface GuildConfig {
  readonly id: string;
  readonly prefix: string | null;
  readonly disabledChannels: string[] | null;
}

/**
 * Repository interface for guild configuration
 */
export interface GuildConfigRepository {
  /**
   * Find guild configuration by guild ID
   */
  findById(guildId: string): Promise<GuildConfig | null>;
}