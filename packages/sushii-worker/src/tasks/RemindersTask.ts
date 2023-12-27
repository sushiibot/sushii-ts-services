import { EmbedBuilder } from "discord.js";
import dayjs from "dayjs";
import logger from "../logger";
import Context from "../model/context";
import BackgroundTask from "./BackgroundTask";
import {
  deleteReminder,
  getAllExpiredReminders,
} from "../db/Reminder/Reminder.repository";
import db from "../model/db";
import Color from "../utils/colors";
import toTimestamp from "../utils/toTimestamp";

const task: BackgroundTask = {
  name: "Check for expired reminders",

  // Every 30 seconds
  cronTime: "*/30 * * * * *",

  async onTick(ctx: Context): Promise<void> {
    const expiredReminders = await getAllExpiredReminders(db);

    logger.info(
      {
        expiredReminders: expiredReminders.length,
      },
      "checking expired reminders",
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

    // Delete reminders -- not in main loop since we want to delete them even if
    // the reminder failed
    for (const reminder of expiredReminders) {
      await deleteReminder(db, reminder.user_id, reminder.set_at);
    }

    logger.debug("Cleared expired reminders.");

    /* eslint-enable no-await-in-loop */
  },
};

export default task;
