import { User } from "discord.js";
import { Err, Ok, Result } from "ts-results";
import Context from "../../model/context";
import UserLevelProgress from "./rank.entity";

export interface RankResponse {
  rankBuffer: ArrayBuffer;
}

export async function getUserRank(
  ctx: Context,
  user: User,
  guildId: string
): Promise<Result<RankResponse, string>> {
  const { userById: userData } = await ctx.sushiiAPI.sdk.userByID({
    id: user.id,
  });
  if (!userData) {
    return Err("User not found");
  }

  const { userGuildRank: userGuildLevel } =
    await ctx.sushiiAPI.sdk.userGuildLevelAndRank({
      guildId,
      userId: user.id,
    });
  if (!userGuildLevel) {
    return Err("User has no server XP");
  }

  const userLevel = new UserLevelProgress(
    parseInt(userGuildLevel.msgAllTime || "0", 10)
  );
  const { allUserLevels: globalXP } = await ctx.sushiiAPI.sdk.userGlobalLevel({
    userId: user.id,
  });
  const globalLevel = new UserLevelProgress(
    parseInt(globalXP?.aggregates?.sum?.msgAllTime || 0, 10)
  );

  const repInt = parseInt(userData.rep, 10);

  // starts at 7 for positive emojis
  // TODO: Update these to be exponential and not hard coded
  let repLevel = 7;
  if (repInt >= 2000) {
    repLevel = 11;
  } else if (repInt >= 1000) {
    repLevel = 10;
  } else if (repInt >= 100) {
    repLevel = 9;
  } else if (repInt >= 50) {
    repLevel = 8;
  }

  const rankContext: Record<string, string | boolean | number> = {
    CONTENT_COLOR: "0, 184, 148",
    CONTENT_OPACITY: "1",
    // Username stuff
    USERNAME: user.username,
    DISCRIMINATOR: user.discriminator.padStart(4, "0"),
    AVATAR_URL: user.displayAvatarURL({ forceStatic: true }),
    REP: userData.rep,
    REP_LEVEL: repLevel.toString().padStart(2, "0"),
    FISHIES: userData.fishies,
    // Rep and fishies
    // Emojis
    IS_PATRON: userData.isPatron,
    PATRON_EMOJI_URL:
      userData.profileData?.patronEmojiURL ||
      "https://cdn.discordapp.com/emojis/830976556976963644.png",
    LEVEL: userLevel.level,
    CURR_XP: userLevel.nextLevelXpProgress,
    REQ_XP: userLevel.nextLevelXpRequired,
    XP_PROGRESS: userLevel.nextLevelXpPercentage,
    // global
    GLOBAL_LEVEL: globalLevel.level,
    GLOBAL_CURR_XP: globalLevel.nextLevelXpProgress,
    GLOBAL_REQ_XP: globalLevel.nextLevelXpRequired,
    GLOBAL_XP_PROGRESS: globalLevel.nextLevelXpPercentage,
    // ranks
    RANK_ALL: userGuildLevel.msgAllTimeRank || "0",
    RANK_ALL_TOTAL: userGuildLevel.msgAllTimeTotal || "0",
    RANK_WEEK: userGuildLevel.msgWeekRank || "0",
    RANK_WEEK_TOTAL: userGuildLevel.msgWeekTotal || "0",
    RANK_MONTH: userGuildLevel.msgMonthRank || "0",
    RANK_MONTH_TOTAL: userGuildLevel.msgMonthTotal || "0",
    RANK_DAY: userGuildLevel.msgDayRank || "0",
    RANK_DAY_TOTAL: userGuildLevel.msgDayTotal || "0",
  };

  const rankBuffer = await ctx.sushiiImageServer.getUserRank(rankContext);

  return Ok({
    rankBuffer,
  });
}
