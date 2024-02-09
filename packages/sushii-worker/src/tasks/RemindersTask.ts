import { EmbedBuilder } from "discord.js";
import dayjs from "dayjs";
import logger from "../logger";
import Context from "../model/context";
import BackgroundTask from "./BackgroundTask";
import { getAndDeleteExpiredReminders } from "../db/Reminder/Reminder.repository";
import db from "../model/db";
import Color from "../utils/colors";
import toTimestamp from "../utils/toTimestamp";
import { sentRemindersCounter } from "../metrics/metrics";

const task: BackgroundTask = {
  name: "Check for expired reminders",

  // Every 30 seconds
  cronTime: "*/30 * * * * *",

  async onTick(ctx: Context): Promise<void> {
    const expiredReminders = await getAndDeleteExpiredReminders(db);

    logger.info(
      {
        expiredReminders: expiredReminders.length,
      },
      "checking and deleting expired reminders",
    );

    let numSuccess = 0;
    let numFailed = 0;

    /* eslint-disable no-await-in-loop */
    for (const reminder of expiredReminders) {
      let user;
      try {
        user = await ctx.client.users.fetch(reminder.user_id);

        const embed = new EmbedBuilder()
          .setTitle(
            `Reminder expired from ${toTimestamp(dayjs.utc(reminder.expire_at))}`,
          )
          .setDescription(reminder.description || "No description.")
          .setColor(Color.Info);

        await user.send({
          embeds: [embed],
        });

        numSuccess += 1;
      } catch (err) {
        // Might fail if the user has DMs disabled
        numFailed += 1;
        continue;
      }
    }
    /* eslint-enable no-await-in-loop */

    sentRemindersCounter.inc(
      {
        status: "success",
      },
      numSuccess,
    );

    sentRemindersCounter.inc(
      {
        status: "failed",
      },
      numFailed,
    );
  },
};

export default task;
