import {
  MessageLogBlock,
  MessageLogBlockType,
} from "../entities/MessageLogBlock";

export interface MessageLogBlockRepository {
  findByGuildId(guildId: string): Promise<MessageLogBlock[]>;
  addBlock(
    guildId: string,
    channelId: string,
    blockType: MessageLogBlockType,
  ): Promise<void>;
  removeBlock(guildId: string, channelId: string): Promise<void>;
}
