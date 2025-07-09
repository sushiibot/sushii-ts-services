import { Events, Message } from "discord.js";
import { Logger } from "pino";
import { EventHandler } from "../../../core/cluster/presentation/EventHandler";
import { ProcessLegacyCommandService } from "../application/ProcessLegacyCommandService";

/**
 * Presentation layer handler for detecting bot responses to potential legacy commands
 */
export class BotResponseHandler extends EventHandler<Events.MessageCreate> {
  constructor(
    private readonly processLegacyCommandService: ProcessLegacyCommandService,
    private readonly logger: Logger,
    private readonly botUserId: string,
  ) {
    super();
  }

  readonly eventType = Events.MessageCreate;

  async handle(message: Message): Promise<void> {
    // Only handle messages from the bot itself
    if (message.author.id !== this.botUserId) {
      return;
    }

    // Only handle guild messages
    if (!message.guild) {
      return;
    }

    try {
      // Check if this bot response matches any pending potential commands
      await this.processLegacyCommandService.processBotResponse(message.channel.id);
    } catch (error) {
      this.logger.error(
        { 
          error: error instanceof Error ? error.message : String(error),
          guildId: message.guild.id,
          channelId: message.channel.id,
          messageId: message.id
        },
        "Error processing bot response for legacy command deprecation"
      );
    }
  }
}