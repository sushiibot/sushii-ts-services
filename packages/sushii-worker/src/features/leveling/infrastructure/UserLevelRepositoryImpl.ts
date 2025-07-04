import { eq, and } from "drizzle-orm";
import { userLevelsInAppPublic } from "src/infrastructure/database/schema";
import { UserLevel } from "../domain/entities/UserLevel";
import { UserLevelRepository } from "../domain/repositories/UserLevelRepository";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

export class UserLevelRepositoryImpl implements UserLevelRepository {
  constructor(private readonly db: NodePgDatabase) {}

  async findByUserAndGuild(
    userId: string,
    guildId: string,
  ): Promise<UserLevel | null> {
    const result = await this.db
      .select()
      .from(userLevelsInAppPublic)
      .where(
        and(
          eq(userLevelsInAppPublic.userId, BigInt(userId)),
          eq(userLevelsInAppPublic.guildId, BigInt(guildId)),
        ),
      )
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const record = result[0];
    return new UserLevel(
      userId,
      guildId,
      Number(record.msgAllTime),
      Number(record.msgMonth),
      Number(record.msgWeek),
      Number(record.msgDay),
      new Date(record.lastMsg),
    );
  }

  async save(userLevel: UserLevel): Promise<void> {
    await this.db
      .update(userLevelsInAppPublic)
      .set({
        msgAllTime: BigInt(userLevel.getAllTimeXp()),
        msgMonth: BigInt(userLevel.getMonthXp()),
        msgWeek: BigInt(userLevel.getWeekXp()),
        msgDay: BigInt(userLevel.getDayXp()),
        lastMsg: userLevel.getLastMessageTime(),
      })
      .where(
        and(
          eq(userLevelsInAppPublic.userId, BigInt(userLevel.getUserId())),
          eq(userLevelsInAppPublic.guildId, BigInt(userLevel.getGuildId())),
        ),
      );
  }

  async create(userLevel: UserLevel): Promise<void> {
    await this.db.insert(userLevelsInAppPublic).values({
      userId: BigInt(userLevel.getUserId()),
      guildId: BigInt(userLevel.getGuildId()),
      msgAllTime: BigInt(userLevel.getAllTimeXp()),
      msgMonth: BigInt(userLevel.getMonthXp()),
      msgWeek: BigInt(userLevel.getWeekXp()),
      msgDay: BigInt(userLevel.getDayXp()),
      lastMsg: userLevel.getLastMessageTime(),
    });
  }
}
