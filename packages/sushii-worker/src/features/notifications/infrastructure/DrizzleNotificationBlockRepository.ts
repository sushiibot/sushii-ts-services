import { and, eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

import {
  notificationBlockTypeInAppPublic,
  notificationBlocksInAppPublic,
} from "@/infrastructure/database/schema";
import * as schema from "@/infrastructure/database/schema";

import {
  BlockType,
  NotificationBlock,
} from "../domain/entities/NotificationBlock";
import { NotificationBlockRepository } from "../domain/repositories/NotificationBlockRepository";

export class DrizzleNotificationBlockRepository
  implements NotificationBlockRepository
{
  constructor(private readonly db: NodePgDatabase<typeof schema>) {}

  async add(block: NotificationBlock): Promise<boolean> {
    const result = await this.db
      .insert(notificationBlocksInAppPublic)
      .values({
        userId: BigInt(block.userId),
        blockId: BigInt(block.blockId),
        blockType: this.mapBlockType(block.blockType),
      })
      .onConflictDoNothing({
        target: [
          notificationBlocksInAppPublic.userId,
          notificationBlocksInAppPublic.blockId,
        ],
      });

    return (result.rowCount ?? 0) > 0;
  }

  async findByUser(userId: string): Promise<NotificationBlock[]> {
    const rows = await this.db
      .select()
      .from(notificationBlocksInAppPublic)
      .where(eq(notificationBlocksInAppPublic.userId, BigInt(userId)));

    return rows.map(
      (row) =>
        new NotificationBlock(
          row.userId.toString(),
          row.blockId.toString(),
          this.mapBlockTypeFromDb(row.blockType),
        ),
    );
  }

  async delete(
    userId: string,
    blockId: string,
  ): Promise<NotificationBlock | null> {
    const row = await this.db
      .delete(notificationBlocksInAppPublic)
      .where(
        and(
          eq(notificationBlocksInAppPublic.userId, BigInt(userId)),
          eq(notificationBlocksInAppPublic.blockId, BigInt(blockId)),
        ),
      )
      .returning();

    return row.length > 0
      ? new NotificationBlock(
          row[0].userId.toString(),
          row[0].blockId.toString(),
          this.mapBlockTypeFromDb(row[0].blockType),
        )
      : null;
  }

  private mapBlockType(
    blockType: BlockType,
  ): (typeof notificationBlockTypeInAppPublic.enumValues)[number] {
    return blockType as (typeof notificationBlockTypeInAppPublic.enumValues)[number];
  }

  private mapBlockTypeFromDb(
    blockType: (typeof notificationBlockTypeInAppPublic.enumValues)[number],
  ): BlockType {
    return blockType as BlockType;
  }
}
