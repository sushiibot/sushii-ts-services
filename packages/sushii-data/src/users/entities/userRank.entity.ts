import { UserLevelModel } from '../../../zod-types';
import { z } from 'zod';

export const UserLevelRankedModel = UserLevelModel.extend({
  msgAllTimeRank: z.bigint(),
  msgAllTimeTotal: z.bigint(),
  msgMonthRank: z.bigint(),
  msgMonthTotal: z.bigint(),
  msgWeekRank: z.bigint(),
  msgWeekTotal: z.bigint(),
  msgDayRank: z.bigint(),
  msgDayTotal: z.bigint(),
});

export type UserLevelRankedModelType = z.infer<typeof UserLevelRankedModel>;

export const fromStoredUserLevelRankedModel = UserLevelRankedModel.extend({
  userId: z.bigint().transform(toString),
  guildId: z.bigint().transform(toString),
  msgAllTime: z.bigint().transform(toString),
  msgMonth: z.bigint().transform(toString),
  msgWeek: z.bigint().transform(toString),
  msgDay: z.bigint().transform(toString),
  lastMsg: z.date().transform(toString),
  msgAllTimeRank: z.bigint().transform(toString),
  msgAllTimeTotal: z.bigint().transform(toString),
  msgMonthRank: z.bigint().transform(toString),
  msgMonthTotal: z.bigint().transform(toString),
  msgWeekRank: z.bigint().transform(toString),
  msgWeekTotal: z.bigint().transform(toString),
  msgDayRank: z.bigint().transform(toString),
  msgDayTotal: z.bigint().transform(toString),
});

export const TransportUserLevelRanked = UserLevelRankedModel.extend({
  userId: z.string(),
  guildId: z.string(),
  msgAllTime: z.string(),
  msgMonth: z.string(),
  msgWeek: z.string(),
  msgDay: z.string(),
  lastMsg: z.string(),
  msgAllTimeRank: z.string(),
  msgAllTimeTotal: z.string(),
  msgMonthRank: z.string(),
  msgMonthTotal: z.string(),
  msgWeekRank: z.string(),
  msgWeekTotal: z.string(),
  msgDayRank: z.string(),
  msgDayTotal: z.string(),
});

export type TransportUserLevelRankedModel = z.infer<
  typeof TransportUserLevelRanked
>;

export const fromTransportUserLevelRankedModel = UserLevelRankedModel.extend({
  userId: z.string().transform(BigInt),
  guildId: z.string().transform(BigInt),
  msgAllTime: z.string().transform(BigInt),
  msgMonth: z.string().transform(BigInt),
  msgWeek: z.string().transform(BigInt),
  msgDay: z.string().transform(BigInt),
  lastMsg: z.string().transform(Date),
  msgAllTimeRank: z.string().transform(BigInt),
  msgAllTimeTotal: z.string().transform(BigInt),
  msgMonthRank: z.string().transform(BigInt),
  msgMonthTotal: z.string().transform(BigInt),
  msgWeekRank: z.string().transform(BigInt),
  msgWeekTotal: z.string().transform(BigInt),
  msgDayRank: z.string().transform(BigInt),
  msgDayTotal: z.string().transform(BigInt),
});

export type StoredUserLevelRankedModel = z.infer<
  typeof fromTransportUserLevelRankedModel
>;

export function getDefaultTransportUserLevelRankedModel(
  id: string,
  guildId: string,
): TransportUserLevelRankedModel {
  return {
    userId: id,
    guildId,
    msgAllTime: '0',
    msgMonth: '0',
    msgWeek: '0',
    msgDay: '0',
    lastMsg: new Date().toISOString(),
    msgAllTimeRank: '0',
    msgAllTimeTotal: '0',
    msgMonthRank: '0',
    msgMonthTotal: '0',
    msgWeekRank: '0',
    msgWeekTotal: '0',
    msgDayRank: '0',
    msgDayTotal: '0',
  };
}
