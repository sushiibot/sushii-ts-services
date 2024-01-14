import dayjs from "dayjs";
import Context from "../model/context";
import BackgroundTask from "./BackgroundTask";
import { getAndDeleteExpiredTempBans } from "../db/TempBan/TempBan.repository";
import db from "../model/db";
import logger from "../logger";
import toTimestamp from "../utils/toTimestamp";

const task: BackgroundTask = {
  name: "Unban expired tempbans",

  // Every 30 seconds
  cronTime: "*/30 * * * * *",

  async onTick(ctx: Context): Promise<void> {
    const tempBans = await getAndDeleteExpiredTempBans(db);

    logger.debug(
      {
        tempBans: tempBans.length,
      },
      "Unbanning tempbans",
    );

    for (const tempBan of tempBans) {
      const guild = ctx.client.guilds.cache.get(tempBan.guild_id);
      if (!guild) {
        // Might be a guild that the bot is no longer in
        continue;
      }

      const ts = toTimestamp(dayjs.utc(tempBan.created_at));

      await guild.members.unban(tempBan.user_id, `Tempban from ${ts} expired.`);
    }
  },
};

export default task;
