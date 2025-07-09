import dayjs from "@/shared/domain/dayjs";
import { newModuleLogger } from "@/shared/infrastructure/logger";
import BackgroundTask from "./BackgroundTask";
import { Client } from "discord.js";
import db from "../infrastructure/database/db";
import { UserEmojiRateLimitDuration } from "../events/EmojiStatsHandler";

const logger = newModuleLogger("DeleteStaleEmojiStatsTask");

const task: BackgroundTask = {
  name: "Delete stale emoji stats rate limits",

  // Once a day
  cronTime: "0 0 * * *",

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async onTick(_client: Client): Promise<void> {
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
