import { CronJob } from "cron";
import * as Sentry from "@sentry/node";
import logger from "../logger";
import Context from "../model/context";
import deleteOldMessages from "./DeleteOldMessagesJob";

export default async function startJobs(ctx: Context): Promise<void> {
  const jobs = [deleteOldMessages];

  logger.info("Starting background tasks");

  for (const job of jobs) {
    const cron = new CronJob(job.cronTime, async () => {
      try {
        logger.info("Running background task: '%s'", job.name);
        await job.onTick(ctx);
      } catch (err) {
        Sentry.captureException(err, {
          tags: {
            type: "job",
            name: job.name,
          },
        });

        logger.error(err, "Error running background task: '%s'", job.name);
      }
    });
    cron.start();

    logger.info("Started background task: '%s'", job.name);
  }
}
