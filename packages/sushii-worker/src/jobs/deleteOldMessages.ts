import dayjs from "dayjs";
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
    await ctx.sushiiAPI.sdk.deleteMessagesBefore({
      before: dayjs().utc().subtract(RETAIN_DURATION).toISOString(),
    });
  },
};

export default job;
