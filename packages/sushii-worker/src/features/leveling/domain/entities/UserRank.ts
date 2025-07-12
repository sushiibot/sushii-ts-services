import { TimeFrame } from "../value-objects/TimeFrame";
import { RankPosition } from "../value-objects/RankPosition";

export interface TimeFrameRankings {
  day: RankPosition;
  week: RankPosition;
  month: RankPosition;
  allTime: RankPosition;
}

export class UserRank {
  constructor(
    private readonly userId: string,
    private readonly guildId: string,
    private readonly rankings: TimeFrameRankings,
  ) {}

  getUserId(): string {
    return this.userId;
  }

  getGuildId(): string {
    return this.guildId;
  }

  getRankingForTimeFrame(timeFrame: TimeFrame): RankPosition {
    switch (timeFrame) {
      case TimeFrame.DAY:
        return this.rankings.day;
      case TimeFrame.WEEK:
        return this.rankings.week;
      case TimeFrame.MONTH:
        return this.rankings.month;
      case TimeFrame.ALL_TIME:
        return this.rankings.allTime;
    }
  }

  getAllTimeRank(): RankPosition {
    return this.rankings.allTime;
  }

  getDayRank(): RankPosition {
    return this.rankings.day;
  }

  getWeekRank(): RankPosition {
    return this.rankings.week;
  }

  getMonthRank(): RankPosition {
    return this.rankings.month;
  }

  getAllRankings(): TimeFrameRankings {
    return this.rankings;
  }

  static create(
    userId: string,
    guildId: string,
    rankings: {
      day: { rank: number | null; totalCount: number };
      week: { rank: number | null; totalCount: number };
      month: { rank: number | null; totalCount: number };
      allTime: { rank: number | null; totalCount: number };
    },
  ): UserRank {
    return new UserRank(userId, guildId, {
      day: new RankPosition(rankings.day.rank, rankings.day.totalCount),
      week: new RankPosition(rankings.week.rank, rankings.week.totalCount),
      month: new RankPosition(rankings.month.rank, rankings.month.totalCount),
      allTime: new RankPosition(
        rankings.allTime.rank,
        rankings.allTime.totalCount,
      ),
    });
  }
}
