import Context from "../model/context";
import BackgroundTask from "./BackgroundTask";
import { getAndDeleteExpiredTempBans } from "../db/TempBan/TempBan.repository";
import db from "../model/db";

const task: BackgroundTask = {
  name: "Update metrics",

  // Every 30 minutes
  cronTime: "*/30 * * * *",

  async onTick(ctx: Context): Promise<void> {
    const tempBans = await getAndDeleteExpiredTempBans(db);

    for (const tempBan of tempBans) {
      const guild = ctx.client.guilds.cache.get(tempBan.guild_id);
      if (!guild) {
        // Might be a guild that the bot is no longer in
        continue;
      }

      await guild.members.unban(
        tempBan.user_id,
        `Tempban from ${tempBan.created_at.toISOString()} expired.`,
      );
    }
  },
};

export default task;
