import {
  APIChatInputApplicationCommandInteraction,
  APIUser,
} from "discord-api-types/v10";
import Context from "../../model/context";
import UserLevelProgress from "./rank.entity";

export interface RankResponse {
  rankBuffer: ArrayBuffer;
}

export async function getUserRank(
  ctx: Context,
  _interaction: APIChatInputApplicationCommandInteraction,
  user: APIUser,
  guildId: string
): Promise<RankResponse> {
  const { userById: userData } = await ctx.sushiiAPI.sdk.userByID({
    id: user.id,
  });
  if (!userData) {
    throw new Error("User not found");
  }

  const { userGuildRank: userGuildLevel } =
    await ctx.sushiiAPI.sdk.userGuildLevelAndRank({
      guildId,
      userId: user.id,
    });
  if (!userGuildLevel) {
    throw new Error("User has no server XP");
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

  const rankContext: Record<string, string | boolean | number> = {
    // BASE_URL: sushii_conf.image_server_url,
    CONTENT_COLOR: "0, 184, 148",
    CONTENT_OPACITY: "1",
    // Username stuff
    USERNAME: user.username,
    DISCRIMINATOR: user.discriminator.padStart(4, "0"),
    AVATAR_URL: ctx.CDN.userFaceURL(user, { forceStatic: true }),
    REP: userData.rep,
    // REP_LEVEL: userData.rep_level(),
    FISHIES: userData.fishies,
    // Rep and fishies
    // Emojis
    IS_PATRON: userData.isPatron,
    // "PATRON_EMOJI_URL": user_data.profile_data
    //     .and_then(|d| d.0.patron_emoji_url)
    //     .unwrap_or_else(|| "https://cdn.discordapp.com/emojis/830976556976963644.png".into()),
    // levels
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

  return {
    rankBuffer,
  };
}
