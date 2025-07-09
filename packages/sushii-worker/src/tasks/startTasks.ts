import { CronJob } from "cron";
import * as Sentry from "@sentry/node";
import logger from "@/shared/infrastructure/logger";
import { Client } from "discord.js";
import deleteOldMessages from "./DeleteOldMessagesTask";
import updateStats from "./StatsTask";
import deleteStaleEmojiStatsRateLimit from "./DeleteStaleEmojiStatsRateLimit";
import sendReminders from "./RemindersTask";
import giveaways from "./GiveawayTask";
import tempbans from "./TempbanTask";

export default async function startTasks(client: Client): Promise<void> {
  const shardId = client.ws.shards.first()?.id ?? null;
  const isMainShard = shardId === 0;

  logger.info(
    {
      shardId,
      isMainShard,
    },
    "Starting background tasks",
  );

  // Only run background tasks on shard 0 to avoid duplication
  if (!isMainShard) {
    logger.info(
      {
        shardId,
      },
      "Skipping background tasks on non-main shard",
    );
    return;
  }

  const jobs = [
    deleteOldMessages,
    updateStats,
    deleteStaleEmojiStatsRateLimit,
    sendReminders,
    giveaways,
    tempbans,
  ];

  for (const job of jobs) {
    const cron = new CronJob(job.cronTime, async () => {
      try {
        logger.info(
          {
            taskName: job.name,
            shardId,
          },
          "Running background task",
        );
        await job.onTick(client);
      } catch (err) {
        Sentry.captureException(err, {
          tags: {
            type: "job",
            name: job.name,
            shardId: shardId?.toString(),
          },
        });

        logger.error(
          {
            err,
            taskName: job.name,
            shardId,
          },
          "Error running background task",
        );
      }
    });

    cron.start();

    logger.info(
      {
        taskName: job.name,
        shardId,
      },
      "Started background task",
    );
  }
}
