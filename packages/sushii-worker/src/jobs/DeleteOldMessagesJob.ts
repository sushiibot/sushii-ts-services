import dayjs from "dayjs";
import logger from "../logger";
import Context from "../model/context";
import PeriodicJob from "./PeriodicJob";

const RETAIN_DURATION = dayjs.duration({
  days: 7,
});

const job: PeriodicJob = {
  name: "Delete messages older than 7 days",

  // Once a day
  cronTime: "0 0 * * *",

  async onTick(ctx: Context): Promise<void> {
    const { deleteMessagesBefore } =
      await ctx.sushiiAPI.sdk.deleteMessagesBefore({
        before: dayjs().utc().subtract(RETAIN_DURATION).toISOString(),
      });

    if (!deleteMessagesBefore) {
      return;
    }

    logger.info("Deleted %d messages", deleteMessagesBefore.bigInt || 0);
  },
};

export default job;
