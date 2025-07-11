import { eq, and, sum, sql } from "drizzle-orm";
import { userLevelsInAppPublic } from "src/infrastructure/database/schema";
import { UserLevel } from "../domain/entities/UserLevel";
import { GlobalUserLevel } from "../domain/entities/GlobalUserLevel";
import { UserRank } from "../domain/entities/UserRank";
import { UserLevelRepository as IUserLevelRepository } from "../domain/repositories/UserLevelRepository";
import { TimeFrame } from "../domain/value-objects/TimeFrame";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "@/infrastructure/database/schema";

export type DrizzleDB = NodePgDatabase<typeof schema>;

interface UserRankData {
  rank: number | null;
  total_count: number;
}

export class UserLevelRepository implements IUserLevelRepository {
  constructor(private readonly db: NodePgDatabase<typeof schema>) {}

  async getUserGuildLevel(guildId: string, userId: string): Promise<UserLevel> {
    const result = await this.findByUserAndGuild(userId, guildId);
    return result || UserLevel.create(userId, guildId);
  }

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

  // GlobalUserLevelRepository methods
  private async getUserGlobalAllMessages(userId: string): Promise<bigint> {
    const result = await this.db
      .select({
        totalXp: sum(userLevelsInAppPublic.msgAllTime),
      })
      .from(userLevelsInAppPublic)
      .where(eq(userLevelsInAppPublic.userId, BigInt(userId)))
      .groupBy(userLevelsInAppPublic.userId);

    return BigInt(result[0]?.totalXp ?? 0);
  }

  async getUserGlobalLevel(userId: string): Promise<GlobalUserLevel> {
    const globalXp = await this.getUserGlobalAllMessages(userId);
    return GlobalUserLevel.create(userId, globalXp);
  }

  // UserRankRepository methods
  private getOrderByColumn(timeframe: TimeFrame) {
    switch (timeframe) {
      case TimeFrame.DAY:
        return userLevelsInAppPublic.msgDay;
      case TimeFrame.WEEK:
        return userLevelsInAppPublic.msgWeek;
      case TimeFrame.MONTH:
        return userLevelsInAppPublic.msgMonth;
      case TimeFrame.ALL_TIME:
        return userLevelsInAppPublic.msgAllTime;
    }
  }

  private async getUserCountInTimeframe(
    guildId: string,
    timeframe: TimeFrame,
  ): Promise<number> {
    const conditions = [eq(userLevelsInAppPublic.guildId, BigInt(guildId))];

    switch (timeframe) {
      case TimeFrame.DAY:
        conditions.push(
          sql`extract(doy from ${userLevelsInAppPublic.lastMsg}) = extract(doy from now())`,
          sql`extract(year from ${userLevelsInAppPublic.lastMsg}) = extract(year from now())`,
        );
        break;
      case TimeFrame.WEEK:
        conditions.push(
          sql`extract(week from ${userLevelsInAppPublic.lastMsg}) = extract(week from now())`,
          sql`extract(year from ${userLevelsInAppPublic.lastMsg}) = extract(year from now())`,
        );
        break;
      case TimeFrame.MONTH:
        conditions.push(
          sql`extract(month from ${userLevelsInAppPublic.lastMsg}) = extract(month from now())`,
          sql`extract(year from ${userLevelsInAppPublic.lastMsg}) = extract(year from now())`,
        );
        break;
      case TimeFrame.ALL_TIME:
        // No additional filtering needed
        break;
    }

    const result = await this.db
      .select({ count: sql<number>`count(*)`.as("count") })
      .from(userLevelsInAppPublic)
      .where(and(...conditions));

    return result[0]?.count ?? 0;
  }

  private async getUserGuildTimeframeRank(
    guildId: string,
    userId: string,
    timeframe: TimeFrame,
  ): Promise<UserRankData | undefined> {
    // First check if user has activity in this timeframe
    const user = await this.db
      .select({ lastMsg: userLevelsInAppPublic.lastMsg })
      .from(userLevelsInAppPublic)
      .where(
        and(
          eq(userLevelsInAppPublic.guildId, BigInt(guildId)),
          eq(userLevelsInAppPublic.userId, BigInt(userId)),
        ),
      )
      .limit(1);

    if (!user[0]) {
      return undefined;
    }

    // Get user's rank by counting users with higher XP
    const conditions = [eq(userLevelsInAppPublic.guildId, BigInt(guildId))];
    const orderColumn = this.getOrderByColumn(timeframe);

    // Add timeframe conditions
    switch (timeframe) {
      case TimeFrame.DAY:
        conditions.push(
          sql`extract(doy from ${userLevelsInAppPublic.lastMsg}) = extract(doy from now())`,
          sql`extract(year from ${userLevelsInAppPublic.lastMsg}) = extract(year from now())`,
        );
        break;
      case TimeFrame.WEEK:
        conditions.push(
          sql`extract(week from ${userLevelsInAppPublic.lastMsg}) = extract(week from now())`,
          sql`extract(year from ${userLevelsInAppPublic.lastMsg}) = extract(year from now())`,
        );
        break;
      case TimeFrame.MONTH:
        conditions.push(
          sql`extract(month from ${userLevelsInAppPublic.lastMsg}) = extract(month from now())`,
          sql`extract(year from ${userLevelsInAppPublic.lastMsg}) = extract(year from now())`,
        );
        break;
      case TimeFrame.ALL_TIME:
        // No additional conditions
        break;
    }

    // Get the user's XP for this timeframe
    const userXpResult = await this.db
      .select({ xp: orderColumn })
      .from(userLevelsInAppPublic)
      .where(
        and(...conditions, eq(userLevelsInAppPublic.userId, BigInt(userId))),
      )
      .limit(1);

    if (!userXpResult[0]) {
      return undefined;
    }

    const userXp = userXpResult[0].xp;

    // Count users with higher XP (rank = count + 1)
    const rankResult = await this.db
      .select({ count: sql<number>`count(*)`.as("count") })
      .from(userLevelsInAppPublic)
      .where(and(...conditions, sql`${orderColumn} > ${userXp}`));

    const rank = (rankResult[0]?.count ?? 0) + 1;

    // Get total count
    const totalCount = await this.getUserCountInTimeframe(guildId, timeframe);

    return {
      rank,
      total_count: totalCount,
    };
  }

  private async getUserGuildAllRanks(
    guildId: string,
    userId: string,
  ): Promise<Record<TimeFrame, UserRankData>> {
    const timeframes = [
      TimeFrame.DAY,
      TimeFrame.WEEK,
      TimeFrame.MONTH,
      TimeFrame.ALL_TIME,
    ];

    const ranks = await Promise.all(
      timeframes.map(async (timeframe) => {
        const rank = await this.getUserGuildTimeframeRank(
          guildId,
          userId,
          timeframe,
        );
        return rank || { rank: null, total_count: 0 };
      }),
    );

    return {
      [TimeFrame.DAY]: ranks[0],
      [TimeFrame.WEEK]: ranks[1],
      [TimeFrame.MONTH]: ranks[2],
      [TimeFrame.ALL_TIME]: ranks[3],
    };
  }

  async getUserGuildRankings(
    guildId: string,
    userId: string,
  ): Promise<UserRank> {
    const rankings = await this.getUserGuildAllRanks(guildId, userId);

    return UserRank.create(userId, guildId, {
      day: {
        rank: rankings[TimeFrame.DAY].rank,
        totalCount: rankings[TimeFrame.DAY].total_count,
      },
      week: {
        rank: rankings[TimeFrame.WEEK].rank,
        totalCount: rankings[TimeFrame.WEEK].total_count,
      },
      month: {
        rank: rankings[TimeFrame.MONTH].rank,
        totalCount: rankings[TimeFrame.MONTH].total_count,
      },
      allTime: {
        rank: rankings[TimeFrame.ALL_TIME].rank,
        totalCount: rankings[TimeFrame.ALL_TIME].total_count,
      },
    });
  }
}
