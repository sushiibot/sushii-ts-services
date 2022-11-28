import { CronJob } from "cron";
import logger from "../logger";
import Context from "../model/context";
import deleteOldMessages from "./deleteOldMessages";

export default async function startJobs(ctx: Context): Promise<void> {
  const jobs = [deleteOldMessages];

  logger.info("Starting jobs");

  for (const job of jobs) {
    const cron = new CronJob(job.cronTime, async () => {
      try {
        await job.onTick(ctx);
      } catch (err) {
        logger.error(err, "Error running job %s", job.name);
      }
    });
    cron.start();

    logger.info("Started job: %s", job.name);
  }
}
