import { Client } from "discord.js";
import { Logger } from "pino";
import { NotificationService, SimpleCommand } from "../domain/services/NotificationService";

/**
 * Discord.js implementation of NotificationService
 */
export class DiscordNotificationService implements NotificationService {
  constructor(
    private readonly client: Client,
    private readonly logger: Logger,
  ) {}

  async sendDeprecationWarning(userId: string, command: SimpleCommand): Promise<void> {
    try {
      const user = await this.client.users.fetch(userId);
      
      await user.send({
        content: `⚠️ **Legacy Command Deprecation Notice**\n\n` +
                 `You used the legacy text command: \`${command.getFullCommand()}\`\n\n` +
                 `Text commands are being phased out. Please use **slash commands** instead:\n` +
                 `• Type \`/\` to see available slash commands\n` +
                 `• Most commands have been migrated to slash commands\n\n` +
                 `This is a friendly reminder - your command still works for now, but won't be available much longer.`
      });
      
      this.logger.info(
        { 
          userId, 
          command: command.command
        },
        "Sent deprecation warning DM"
      );
    } catch (error) {
      this.logger.debug(
        { 
          userId, 
          command: command.command,
          error: error instanceof Error ? error.message : String(error)
        },
        "Failed to send deprecation warning DM"
      );
      
      // Re-throw to let the application service handle it
      throw error;
    }
  }
}