import { Logger } from "pino";
import {
  MessageLogBlock,
  MessageLogBlockType,
} from "../domain/entities/MessageLogBlock";
import { MessageLogBlockRepository } from "../domain/repositories/MessageLogBlockRepository";

export class MessageLogService {
  constructor(
    private readonly messageLogBlockRepository: MessageLogBlockRepository,
    private readonly logger: Logger,
  ) {}

  async getIgnoredChannels(guildId: string): Promise<MessageLogBlock[]> {
    return this.messageLogBlockRepository.findByGuildId(guildId);
  }

  async addIgnoredChannel(
    guildId: string,
    channelId: string,
    blockType: MessageLogBlockType = "all",
  ): Promise<void> {
    this.logger.info(
      { guildId, channelId, blockType },
      "Adding ignored channel",
    );

    await this.messageLogBlockRepository.addBlock(
      guildId,
      channelId,
      blockType,
    );
  }

  async removeIgnoredChannel(
    guildId: string,
    channelId: string,
  ): Promise<void> {
    this.logger.info({ guildId, channelId }, "Removing ignored channel");

    await this.messageLogBlockRepository.removeBlock(guildId, channelId);
  }
}
