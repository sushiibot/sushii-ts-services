/**
 * Simple value object representing a potential legacy command
 * Tracked temporarily to detect if the bot responds
 */
export class PotentialCommand {
  constructor(
    public readonly userId: string,
    public readonly channelId: string,
    public readonly messageContent: string,
    public readonly timestamp: Date,
  ) {}

  /**
   * Check if this potential command has expired (older than 500ms)
   */
  isExpired(): boolean {
    const now = new Date();
    const ageMs = now.getTime() - this.timestamp.getTime();
    return ageMs > 500; // 500ms TTL
  }

  /**
   * Factory method to create a new potential command
   */
  static create(userId: string, channelId: string, messageContent: string): PotentialCommand {
    return new PotentialCommand(userId, channelId, messageContent, new Date());
  }

  /**
   * Get a unique key for tracking this potential command
   */
  getTrackingKey(): string {
    return `${this.channelId}:${this.timestamp.getTime()}`;
  }
}