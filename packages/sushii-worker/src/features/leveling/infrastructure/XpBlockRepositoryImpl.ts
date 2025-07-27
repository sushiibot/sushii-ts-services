import { and, eq, inArray, or } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { xpBlocksInAppPublic } from "src/infrastructure/database/schema";

import * as schema from "@/infrastructure/database/schema";

import { XpBlock } from "../domain/entities/XpBlock";
import { XpBlockRepository } from "../domain/repositories/XpBlockRepository";

export class XpBlockRepositoryImpl implements XpBlockRepository {
  constructor(private readonly db: NodePgDatabase<typeof schema>) {}

  async findActiveBlocks(
    guildId: string,
    channelId: string,
    roleIds: string[],
  ): Promise<XpBlock[]> {
    const guildIdBigint = BigInt(guildId);
    const channelIdBigint = BigInt(channelId);
    const roleIdsBigint = roleIds.map((id) => BigInt(id));

    const conditions = [
      and(
        eq(xpBlocksInAppPublic.blockId, channelIdBigint),
        eq(xpBlocksInAppPublic.blockType, "channel"),
      ),
    ];

    if (roleIdsBigint.length > 0) {
      conditions.push(
        and(
          inArray(xpBlocksInAppPublic.blockId, roleIdsBigint),
          eq(xpBlocksInAppPublic.blockType, "role"),
        ),
      );
    }

    const result = await this.db
      .select()
      .from(xpBlocksInAppPublic)
      .where(
        and(eq(xpBlocksInAppPublic.guildId, guildIdBigint), or(...conditions)),
      );

    return result.map(
      (record) =>
        new XpBlock(
          guildId,
          record.blockId.toString(),
          record.blockType as "channel" | "role",
        ),
    );
  }
}
