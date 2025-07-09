import { CronJob } from "cron";
import * as Sentry from "@sentry/node";
import logger from "@/shared/infrastructure/logger";
import { Client } from "discord.js";
import { DeploymentService } from "@/features/deployment/application/DeploymentService";
import { AbstractBackgroundTask } from "./AbstractBackgroundTask";
import { DeleteOldMessagesTask } from "./DeleteOldMessagesTask";
import { StatsTask } from "./StatsTask";
import { DeleteStaleEmojiStatsRateLimit } from "./DeleteStaleEmojiStatsRateLimit";
import { RemindersTask } from "./RemindersTask";
import { GiveawayTask } from "./GiveawayTask";
import { TempbanTask } from "./TempbanTask";

export default async function startTasks(
  client: Client,
  deploymentService: DeploymentService,
): Promise<void> {
  const shardId = client.ws.shards.first()?.id ?? null;
  const isMainShard = shardId === 0;

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

  logger.info(
    {
      shardId,
      isMainShard,
    },
    "Starting background tasks",
  );

  const tasks: AbstractBackgroundTask[] = [
    new DeleteOldMessagesTask(client, deploymentService),
    new StatsTask(client, deploymentService),
    new DeleteStaleEmojiStatsRateLimit(client, deploymentService),
    new RemindersTask(client, deploymentService),
    new GiveawayTask(client, deploymentService),
    new TempbanTask(client, deploymentService),
  ];

  for (const task of tasks) {
    const cron = new CronJob(task.cronTime, async () => {
      try {
        logger.info(
          {
            taskName: task.name,
            shardId,
          },
          "Running background task",
        );

        // onTick will check deployment status before executing the task
        await task.onTick();
      } catch (err) {
        Sentry.captureException(err, {
          tags: {
            type: "task",
            name: task.name,
            shardId: shardId?.toString(),
          },
        });

        logger.error(
          {
            err,
            taskName: task.name,
            shardId,
          },
          "Error running background task",
        );
      }
    });

    // Actually start the cron job
    cron.start();

    logger.info(
      {
        taskName: task.name,
        shardId,
      },
      "Started background task",
    );
  }
}
