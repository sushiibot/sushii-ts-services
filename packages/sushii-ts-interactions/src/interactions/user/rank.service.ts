import {
  APIChatInputApplicationCommandInteraction,
  APIUser,
} from "discord-api-types/v9";
import Context from "../../context";

export interface RankResponse {
  rankBuffer: ArrayBuffer;
}

export async function getUserRank(
  ctx: Context,
  _interaction: APIChatInputApplicationCommandInteraction,
  user: APIUser
): Promise<RankResponse> {
  const rankContext = {
    // BASE_URL: sushii_conf.image_server_url,
    CONTENT_COLOR: "0, 184, 148",
    CONTENT_OPACITY: "1",
    // Username stuff
    USERNAME: user.username,
    DISCRIMINATOR: user.discriminator.padStart(4, "0"),
    AVATAR_URL: ctx.CDN.userFaceURL(user, { forceStatic: true }),

    /*
      // Rep and fishies
      "REP": user_data.rep,
      "REP_LEVEL": user_data.rep_level(),
      "FISHIES": user_data.fishies,
      // Emojis
      "IS_PATRON": user_data.is_patron,
      "PATRON_EMOJI_URL": user_data.profile_data
          .and_then(|d| d.0.patron_emoji_url)
          .unwrap_or_else(|| "https://cdn.discordapp.com/emojis/830976556976963644.png".into()),
      // levels
      "LEVEL": level_prog.level,
      "CURR_XP": level_prog.next_level_xp_progress,
      "REQ_XP": level_prog.next_level_xp_required,
      "XP_PROGRESS": level_prog.next_level_xp_percentage,
      // global
      "GLOBAL_LEVEL": level_prog_global.level,
      "GLOBAL_CURR_XP": level_prog_global.next_level_xp_progress,
      "GLOBAL_REQ_XP": level_prog_global.next_level_xp_required,
      "GLOBAL_XP_PROGRESS": level_prog_global.next_level_xp_percentage,
      // ranks
      "RANK_ALL": rank_all,
      "RANK_ALL_TOTAL": rank_all_total,
      "RANK_WEEK": rank_week,
      "RANK_WEEK_TOTAL": rank_week_total,
      "RANK_MONTH": rank_month,
      "RANK_MONTH_TOTAL": rank_month_total,
      "RANK_DAY": rank_day,
      "RANK_DAY_TOTAL": rank_day_total,
      */
  };

  const rankBuffer = await ctx.sushiiImageServer.getUserRank(rankContext);

  return {
    rankBuffer,
  };
}
