import { PotentialCommand } from "../domain/entities/PotentialCommand";
import { CommandResponseTracker } from "../domain/services/CommandResponseTracker";

/**
 * In-memory implementation of CommandResponseTracker
 * Tracks potential commands for 500ms with automatic cleanup
 */
export class InMemoryCommandTracker implements CommandResponseTracker {
  private potentialCommands = new Map<string, PotentialCommand>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Run cleanup every 100ms to remove expired commands
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredCommands().catch(() => {
        // Ignore cleanup errors
      });
    }, 100);
  }

  async trackPotentialCommand(userId: string, channelId: string, messageContent: string): Promise<void> {
    const command = PotentialCommand.create(userId, channelId, messageContent);
    this.potentialCommands.set(command.getTrackingKey(), command);
  }

  async checkForMatchingCommand(channelId: string): Promise<PotentialCommand | null> {
    // Find the most recent potential command in this channel
    let mostRecentCommand: PotentialCommand | null = null;
    let mostRecentTime = 0;

    for (const [, command] of this.potentialCommands.entries()) {
      if (command.channelId === channelId && !command.isExpired()) {
        const commandTime = command.timestamp.getTime();
        if (commandTime > mostRecentTime) {
          mostRecentTime = commandTime;
          mostRecentCommand = command;
        }
      }
    }

    // Remove the matched command from tracking
    if (mostRecentCommand) {
      this.potentialCommands.delete(mostRecentCommand.getTrackingKey());
    }

    return mostRecentCommand;
  }

  async cleanupExpiredCommands(): Promise<void> {
    for (const [key, command] of this.potentialCommands.entries()) {
      if (command.isExpired()) {
        this.potentialCommands.delete(key);
      }
    }
  }

  /**
   * Clean up resources when shutting down
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.potentialCommands.clear();
  }

  /**
   * Get current tracking stats for debugging
   */
  getStats(): { trackedCommands: number } {
    return {
      trackedCommands: this.potentialCommands.size,
    };
  }
}