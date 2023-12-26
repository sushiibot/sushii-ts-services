import dayjs from "dayjs";
import logger from "../logger";
import Context from "../model/context";
import BackgroundTask from "./BackgroundTask";
import { deleteMessagesBefore } from "../db/Message/Message.repository";
import db from "../model/db";

const RETAIN_DURATION = dayjs.duration({
  days: 7,
});

const task: BackgroundTask = {
  name: "Delete messages older than 7 days",

  // Once a day
  cronTime: "0 0 * * *",

  async onTick(ctx: Context): Promise<void> {
    const res = await deleteMessagesBefore(
      db,
      dayjs().utc().subtract(RETAIN_DURATION).toDate(),
    );

    logger.info(
      {
        deleteCount: res.numDeletedRows,
      },
      "Deleted old messages",
    );
  },
};

export default task;
