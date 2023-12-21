import { Kysely, QueryCreator, SelectQueryBuilder, sql } from "kysely";
import dayjs from "dayjs";
import { DB } from "../../model/dbTypes";
import { UserLevelRow } from "./UserLevel.table";

type TimeFrame = "day" | "week" | "month" | "all_time";

interface UserRank {
  rank: number;
  total_count: number;
}

/**
 * Check if two dates are in the same year.
 */
function isSameYear(d1: dayjs.Dayjs, d2: dayjs.Dayjs): boolean {
  return d1.year() === d2.year();
}

/**
 * Check if a date is in the current timeframe.
 *
 * @param timeframe
 * @param d
 * @returns
 */
function isCurrentTimeframe(timeframe: TimeFrame, d: dayjs.Dayjs): boolean {
  const now = dayjs.utc();

  switch (timeframe) {
    case "day": {
      return isSameYear(d, now) && d.dayOfYear() === now.dayOfYear();
    }
    case "week": {
      return isSameYear(d, now) && d.week() === now.week();
    }
    case "month": {
      return isSameYear(d, now) && d.month() === now.month();
    }
    case "all_time": {
      return true;
    }
  }
}

/**
 * Get the total number of users in a timeframe.
 *
 * @param db database
 * @param guildId guild ID
 * @param timeframe timeframe
 */
export async function totalUsersInTimeFrame(
  db: Kysely<DB>,
  guildId: string,
  timeframe: TimeFrame,
): Promise<number> {
  let query = db
    .selectFrom("app_public.user_levels")
    .select(({ fn }) => [fn.countAll<number>().as("total_count")])
    .where("guild_id", "=", guildId);

  switch (timeframe) {
    case "day": {
      query = query
        .where(sql`extract(doy from last_msg) = extract(doy from now())`)
        .where(sql`extract(year from last_msg) = extract(year from now())`);

      break;
    }
    case "week": {
      query = query
        .where(sql`extract(week from last_msg) = extract(week from now())`)
        .where(sql`extract(year from last_msg) = extract(year from now())`);

      break;
    }
    case "month": {
      query = query
        .where(sql`extract(month from last_msg) = extract(month from now())`)
        .where(sql`extract(year from last_msg) = extract(year from now())`);

      break;
    }
    case "all_time": {
      break;
    }
  }

  const result = await query.executeTakeFirst();

  return result?.total_count ?? 0;
}

/**
 * Create the query to get the row_number of all guild users in a timeframe.
 *
 * @param db database
 * @param guildId guild ID
 * @param timeframe
 */
function allRanksQuery(
  db: QueryCreator<DB>,
  guildId: string,
  timeframe: TimeFrame,
): SelectQueryBuilder<
  DB,
  "app_public.user_levels",
  {
    user_id: string;
    rank: number;
  }
> {
  const query = db
    .selectFrom("app_public.user_levels")
    .select(({ fn }) => [
      "user_id",
      fn.agg<number>("row_number").over().as("rank"),
    ])
    .where("guild_id", "=", guildId);

  switch (timeframe) {
    case "day": {
      return query
        .where(
          sql`extract(doy from last_msg)`,
          "=",
          sql`extract(doy from now())`,
        )
        .where(
          sql`extract(year from last_msg)`,
          "=",
          sql`extract(year from now())`,
        )
        .orderBy("msg_day", "desc");
    }
    case "week": {
      return query
        .where(
          sql`extract(week from last_msg)`,
          "=",
          sql`extract(week from now())`,
        )
        .where(
          sql`extract(year from last_msg)`,
          "=",
          sql`extract(year from now())`,
        )
        .orderBy("msg_week", "desc");
    }
    case "month": {
      return query
        .where(
          sql`extract(month from last_msg)`,
          "=",
          sql`extract(month from now())`,
        )
        .where(
          sql`extract(year from last_msg)`,
          "=",
          sql`extract(year from now())`,
        )
        .orderBy("msg_month", "desc");
    }
    case "all_time": {
      return query.orderBy("msg_all_time", "desc");
    }
  }
}

/**
 * Get the total number of users in a timeframe.
 *
 * @param db
 * @param guildId
 * @param timeframe
 * @returns
 */
async function guildUserCountInTimeFrame(
  db: QueryCreator<DB>,
  guildId: string,
  timeframe: TimeFrame,
): Promise<number> {
  // Total number of users in the timeframe
  let query = db
    .selectFrom("app_public.user_levels")
    .select(({ fn }) => [fn.countAll<number>().as("total_count")])
    .where("guild_id", "=", guildId);

  switch (timeframe) {
    case "day": {
      query = query
        .where(sql`extract(doy from last_msg) = extract(doy from now())`)
        .where(sql`extract(year from last_msg) = extract(year from now())`);

      break;
    }
    case "week": {
      query = query
        .where(sql`extract(week from last_msg) = extract(week from now())`)
        .where(sql`extract(year from last_msg) = extract(year from now())`);

      break;
    }
    case "month": {
      query = query
        .where(sql`extract(month from last_msg) = extract(month from now())`)
        .where(sql`extract(year from last_msg) = extract(year from now())`);

      break;
    }
    case "all_time": {
      break;
    }
  }

  const result = await query.executeTakeFirst();
  return result?.total_count ?? 0;
}

/**
 * Get the rank of a user in a guild in a timeframe.
 *
 * @param db
 * @param guildId
 * @param userId
 * @param timeframe
 * @returns
 */
export async function userGuildTimeframeRank(
  db: Kysely<DB>,
  guildId: string,
  userId: string,
  timeframe: TimeFrame,
): Promise<UserRank | undefined> {
  // Let's first check if their last message is within the latest timeframe
  // If it's not, we can just return undefined
  const user = await db
    .selectFrom("app_public.user_levels")
    .select(["last_msg"])
    .where("guild_id", "=", guildId)
    .where("user_id", "=", userId)
    .executeTakeFirst();

  if (!user) {
    return;
  }

  const d = dayjs.utc(user.last_msg);

  // Last message was in a previous timeframe, so there is no rank available
  if (!isCurrentTimeframe(timeframe, d)) {
    return;
  }

  const rankResult = await db
    .with("row_numbers", (db2) => allRanksQuery(db2, guildId, timeframe))
    .selectFrom("row_numbers")
    .select(["rank"])
    .where("user_id", "=", userId)
    .executeTakeFirst();

  if (!rankResult) {
    return;
  }

  // Now we can get the total count of users in the timeframe
  const totalCount = await guildUserCountInTimeFrame(db, guildId, timeframe);

  return {
    rank: rankResult.rank,
    total_count: totalCount,
  };
}

/**
 * Gets the rank of a user in a guild in all timeframes.
 *
 * @param db
 * @param guildId
 * @param userId
 * @returns
 */
export async function getUserGuildAllRanks(
  db: Kysely<DB>,
  guildId: string,
  userId: string,
): Promise<Record<TimeFrame, UserRank>> {
  const timeframes: TimeFrame[] = ["day", "week", "month", "all_time"];

  const ranks = await Promise.all(
    timeframes.map(async (timeframe) => {
      const rank = await userGuildTimeframeRank(db, guildId, userId, timeframe);
      if (!rank) {
        return {
          rank: 0,
          total_count: 0,
        };
      }

      return rank;
    }),
  );

  return Object.fromEntries(
    timeframes.map((timeframe, i) => [timeframe, ranks[i]]),
  ) as Record<TimeFrame, UserRank>;
}

/**
 * Gets the level row for a user in a guild.
 */
export function getUserGuildLevel(
  db: Kysely<DB>,
  guildId: string,
  userId: string,
): Promise<UserLevelRow | undefined> {
  return db
    .selectFrom("app_public.user_levels")
    .selectAll()
    .where("guild_id", "=", guildId)
    .where("user_id", "=", userId)
    .executeTakeFirst();
}

/**
 * Get total XP for a user in all guilds.
 *
 * @param db
 * @param userId
 * @returns
 */
export async function getUserGlobalAllMessages(
  db: Kysely<DB>,
  userId: string,
): Promise<number> {
  const res = await db
    .selectFrom("app_public.user_levels")
    .select(({ fn }) => fn.sum<number>("msg_all_time").as("msg_all_time"))
    .where("user_id", "=", userId)
    .groupBy("user_id")
    .executeTakeFirst();

  return res?.msg_all_time ?? 0;
}
