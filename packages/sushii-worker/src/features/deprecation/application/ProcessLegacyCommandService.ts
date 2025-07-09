import { DeprecationWarning } from "../domain/entities/DeprecationWarning";
import { DeprecationWarningRepository } from "../domain/repositories/DeprecationWarningRepository";
import { GuildConfigRepository } from "../domain/repositories/GuildConfigRepository";
import { CommandResponseTracker } from "../domain/services/CommandResponseTracker";
import { NotificationService } from "../domain/services/NotificationService";

/**
 * Application service for processing potential legacy commands
 * Simplified approach: just check prefix and track for bot response
 */
export class ProcessLegacyCommandService {
  constructor(
    private readonly warningRepository: DeprecationWarningRepository,
    private readonly guildConfigRepository: GuildConfigRepository,
    private readonly commandTracker: CommandResponseTracker,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * Process a potential legacy command
   * Only tracks if guild has a configured prefix
   */
  async execute(
    userId: string,
    messageContent: string,
    guildId: string,
    channelId: string,
  ): Promise<void> {
    // Get guild configuration
    const guildConfig = await this.guildConfigRepository.findById(guildId);
    
    // IMPORTANT: Only proceed if guild has a configured prefix (no fallback)
    if (!guildConfig?.prefix) {
      return; // No prefix configured, do nothing
    }
    
    // Check if channel is disabled
    if (guildConfig.disabledChannels?.includes(channelId)) {
      return;
    }

    // Simple prefix check
    if (!messageContent.startsWith(guildConfig.prefix)) {
      return;
    }

    // Track as potential command for 500ms
    await this.commandTracker.trackPotentialCommand(userId, channelId, messageContent);
  }

  /**
   * Process bot response and send deprecation warning if it matches a tracked command
   */
  async processBotResponse(channelId: string): Promise<void> {
    // Check if this bot response matches any pending potential commands
    const matchingCommand = await this.commandTracker.checkForMatchingCommand(channelId);
    
    if (!matchingCommand) {
      return; // No matching command found
    }

    // Check if user should receive a warning (rate limiting)
    const existingWarning = await this.warningRepository.findByUserId(matchingCommand.userId);
    
    if (existingWarning && !existingWarning.canSendWarning()) {
      return; // User was warned recently
    }

    // Send deprecation warning
    try {
      // Create a simple command representation for the notification
      const simpleLegacyCommand = {
        command: matchingCommand.messageContent,
        getFullCommand: () => matchingCommand.messageContent
      };

      await this.notificationService.sendDeprecationWarning(matchingCommand.userId, simpleLegacyCommand);
      
      // Update warning record
      const newWarning = existingWarning 
        ? existingWarning.updateWarningTime()
        : DeprecationWarning.create(matchingCommand.userId);
      
      await this.warningRepository.save(newWarning);
    } catch {
      // Silently ignore notification failures (user may have DMs disabled)
      // We don't update the warning record if notification failed
    }
  }
}