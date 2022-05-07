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
  const userData = await ctx.sushiiAPI.getUser(user.id);
  const userRank = await ctx.sushiiAPI.getUserRank(user.id, guildId);
  const userLevel = new UserLevelProgress(parseInt(userRank.msgAllTime, 10));
  const globalXP = await ctx.sushiiAPI.getUserGlobalXP(user.id);
  const globalLevel = new UserLevelProgress(parseInt(globalXP, 10));

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
    RANK_ALL: userRank.msgAllTimeRank,
    RANK_ALL_TOTAL: userRank.msgAllTimeTotal,
    RANK_WEEK: userRank.msgWeekRank,
    RANK_WEEK_TOTAL: userRank.msgWeekTotal,
    RANK_MONTH: userRank.msgMonthRank,
    RANK_MONTH_TOTAL: userRank.msgMonthTotal,
    RANK_DAY: userRank.msgDayRank,
    RANK_DAY_TOTAL: userRank.msgDayTotal,
  };

  const rankBuffer = await ctx.sushiiImageServer.getUserRank(rankContext);

  return {
    rankBuffer,
  };
}
