import { EmbedBuilder } from "discord.js";
import dayjs from "dayjs";
import logger from "../logger";
import Context from "../model/context";
import BackgroundTask from "./BackgroundTask";
import {
  deleteReminder,
  getAllExpiredReminders,
  getAndDeleteExpiredReminders,
} from "../db/Reminder/Reminder.repository";
import db from "../model/db";
import Color from "../utils/colors";
import toTimestamp from "../utils/toTimestamp";

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

    /* eslint-disable no-await-in-loop */
    for (const reminder of expiredReminders) {
      let user;
      try {
        user = await ctx.client.users.fetch(reminder.user_id);
      } catch (err) {
        continue;
      }

      const embed = new EmbedBuilder()
        .setTitle(
          `Reminder expired from ${toTimestamp(dayjs.utc(reminder.expire_at))}`,
        )
        .setDescription(reminder.description || "No description.")
        .setColor(Color.Info);

      try {
        await user.send({
          embeds: [embed],
        });
      } catch (err) {
        // Might fail if the user has DMs disabled
        continue;
      }
    }
    /* eslint-enable no-await-in-loop */
  },
};

export default task;
