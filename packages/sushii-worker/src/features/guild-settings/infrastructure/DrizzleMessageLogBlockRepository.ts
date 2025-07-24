import { eq, and } from "drizzle-orm";
import { Logger } from "pino";
import { msgLogBlocksInAppPublic } from "@/infrastructure/database/schema";
import {
  MessageLogBlock,
  MessageLogBlockType,
} from "../domain/entities/MessageLogBlock";
import { MessageLogBlockRepository } from "../domain/repositories/MessageLogBlockRepository";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "@/infrastructure/database/schema";

export class DrizzleMessageLogBlockRepository
  implements MessageLogBlockRepository
{
  constructor(
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly logger: Logger,
  ) {}

  async findByGuildId(guildId: string): Promise<MessageLogBlock[]> {
    this.logger.debug({ guildId }, "Finding message log blocks");

    const results = await this.db
      .select()
      .from(msgLogBlocksInAppPublic)
      .where(eq(msgLogBlocksInAppPublic.guildId, BigInt(guildId)));

    return results.map(
      (row) =>
        new MessageLogBlock(
          row.guildId.toString(),
          row.channelId.toString(),
          row.blockType as MessageLogBlockType,
        ),
    );
  }

  async addBlock(
    guildId: string,
    channelId: string,
    blockType: MessageLogBlockType,
  ): Promise<void> {
    this.logger.debug(
      { guildId, channelId, blockType },
      "Adding message log block",
    );

    await this.db
      .insert(msgLogBlocksInAppPublic)
      .values({
        guildId: BigInt(guildId),
        channelId: BigInt(channelId),
        blockType,
      })
      .onConflictDoUpdate({
        target: [
          msgLogBlocksInAppPublic.guildId,
          msgLogBlocksInAppPublic.channelId,
        ],
        set: { blockType },
      });
  }

  async removeBlock(guildId: string, channelId: string): Promise<void> {
    this.logger.debug({ guildId, channelId }, "Removing message log block");

    await this.db
      .delete(msgLogBlocksInAppPublic)
      .where(
        and(
          eq(msgLogBlocksInAppPublic.guildId, BigInt(guildId)),
          eq(msgLogBlocksInAppPublic.channelId, BigInt(channelId)),
        ),
      );
  }
}
