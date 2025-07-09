import { Events, Message } from "discord.js";
import { Logger } from "pino";
import { EventHandler } from "../../../core/cluster/presentation/EventHandler";
import { ProcessLegacyCommandService } from "../application/ProcessLegacyCommandService";

/**
 * Presentation layer handler for legacy command deprecation warnings
 */
export class LegacyCommandDeprecationHandler extends EventHandler<Events.MessageCreate> {
  constructor(
    private readonly processLegacyCommandService: ProcessLegacyCommandService,
    private readonly logger: Logger,
  ) {
    super();
  }

  readonly eventType = Events.MessageCreate;

  async handle(message: Message): Promise<void> {
    // Only handle guild messages from real users
    if (!message.guild || message.author.bot) {
      return;
    }

    try {
      // Delegate to application service
      await this.processLegacyCommandService.execute(
        message.author.id,
        message.content,
        message.guild.id,
        message.channel.id,
      );
    } catch (error) {
      this.logger.error(
        { 
          error: error instanceof Error ? error.message : String(error),
          guildId: message.guild.id,
          userId: message.author.id,
          messageContent: message.content
        },
        "Error processing legacy command deprecation"
      );
    }
  }
}