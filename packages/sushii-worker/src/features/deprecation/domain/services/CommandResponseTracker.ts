import { PotentialCommand } from "../entities/PotentialCommand";

/**
 * Domain service interface for tracking potential commands
 * and detecting bot responses
 */
export interface CommandResponseTracker {
  /**
   * Track a potential command for 500ms
   */
  trackPotentialCommand(userId: string, channelId: string, messageContent: string): Promise<void>;

  /**
   * Check if a bot response matches any pending potential commands in the channel
   * Returns the matching command if found, null otherwise
   */
  checkForMatchingCommand(channelId: string): Promise<PotentialCommand | null>;

  /**
   * Clean up expired potential commands (older than 500ms)
   */
  cleanupExpiredCommands(): Promise<void>;
}