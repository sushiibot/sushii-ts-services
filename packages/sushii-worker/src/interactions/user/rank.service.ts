import { User } from "discord.js";
import { Ok, Result } from "ts-results";
import Context from "../../model/context";
import { calculateLevelProgress } from "../../services/XpService";
import { getUserOrDefault } from "../../db/User/User.repository";
import db from "../../model/db";
import {
  getUserGlobalAllMessages,
  getUserGuildAllRanks,
  getUserGuildLevel,
} from "../../db/UserLevel/UserLevel.repository";
import logger from "../../logger";

const log = logger.child({ module: "rank" });

export interface RankResponse {
  rankBuffer: ArrayBuffer;
}

export async function getUserRank(
  ctx: Context,
  user: User,
  guildId: string,
): Promise<Result<RankResponse, string>> {
  const userData = await getUserOrDefault(db, user.id);

  const guildRanks = await getUserGuildAllRanks(db, guildId, user.id);
  const guildLevel = await getUserGuildLevel(db, guildId, user.id);

  const allTimeXP = BigInt(guildLevel?.msg_all_time ?? 0n);
  const guildLevelProgress = calculateLevelProgress(allTimeXP);

  const globalXP = await getUserGlobalAllMessages(db, user.id);
  const globalLevelProgress = calculateLevelProgress(globalXP);

  log.debug({
    guildId,
    userId: user.id,
    guildRanks,
    guildLevel,
    guildLevelProgress,
    globalXP,
    globalLevelProgress,
  });

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

  let patronEmojiURL: string;
  if (
    userData.profile_data &&
    typeof userData.profile_data === "object" &&
    !Array.isArray(userData.profile_data) &&
    typeof userData.profile_data.patronEmojiURL === "string"
  ) {
    patronEmojiURL = userData.profile_data.patronEmojiURL;
  } else {
    patronEmojiURL = "https://cdn.discordapp.com/emojis/830976556976963644.png";
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
    IS_PATRON: userData.is_patron,
    PATRON_EMOJI_URL: patronEmojiURL,
    LEVEL: guildLevelProgress.level,
    CURR_XP: guildLevelProgress.nextLevelXpProgress,
    REQ_XP: guildLevelProgress.nextLevelXpRequired,
    XP_PROGRESS: guildLevelProgress.nextLevelXpPercentage,
    // global
    GLOBAL_LEVEL: globalLevelProgress.level,
    GLOBAL_CURR_XP: globalLevelProgress.nextLevelXpProgress,
    GLOBAL_REQ_XP: globalLevelProgress.nextLevelXpRequired,
    GLOBAL_XP_PROGRESS: globalLevelProgress.nextLevelXpPercentage,
    // ranks
    RANK_ALL: guildRanks.all_time.rank || "-",
    RANK_ALL_TOTAL: guildRanks.all_time.total_count || "-",
    RANK_WEEK: guildRanks.week.rank || "-",
    RANK_WEEK_TOTAL: guildRanks.week.total_count || "-",
    RANK_MONTH: guildRanks.month.rank || "-",
    RANK_MONTH_TOTAL: guildRanks.month.total_count || "-",
    RANK_DAY: guildRanks.day.rank || "-",
    RANK_DAY_TOTAL: guildRanks.day.total_count || "-",
  };

  const rankBuffer = await ctx.sushiiImageServer.getUserRank(rankContext);

  return Ok({
    rankBuffer,
  });
}
