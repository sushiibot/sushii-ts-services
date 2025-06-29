import dayjs from "dayjs";
import { newModuleLogger } from "../logger";
import Context from "../model/context";
import BackgroundTask from "./BackgroundTask";
import db from "../infrastructure/database/config/db";
import { UserEmojiRateLimitDuration } from "../events/EmojiStatsHandler";

const logger = newModuleLogger("DeleteStaleEmojiStatsTask");

const task: BackgroundTask = {
  name: "Delete stale emoji stats rate limits",

  // Once a day
  cronTime: "0 0 * * *",

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async onTick(_ctx: Context): Promise<void> {
    const deleted = await db
      .deleteFrom("app_public.emoji_sticker_stats_rate_limits")
      .where(
        "last_used",
        "<",
        dayjs().utc().subtract(UserEmojiRateLimitDuration).toDate(),
      )
      .executeTakeFirst();

    logger.info(
      "Deleted %d old emoji stats rate limits",
      deleted.numDeletedRows,
    );
  },
};

export default task;
