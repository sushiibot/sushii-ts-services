import * as Sentry from "@sentry/node";
import { CronJob } from "cron";
import { Client } from "discord.js";

import { DeploymentService } from "@/features/deployment/application/DeploymentService";
import logger from "@/shared/infrastructure/logger";

import { AbstractBackgroundTask } from "./AbstractBackgroundTask";
import { DeleteOldMessagesTask } from "./DeleteOldMessagesTask";
import { DeleteStaleEmojiStatsRateLimit } from "./DeleteStaleEmojiStatsRateLimit";
import { GiveawayTask } from "./GiveawayTask";
import { RemindersTask } from "./RemindersTask";
import { StatsTask } from "./StatsTask";
import { TempbanTask } from "./TempbanTask";

export default async function startTasks(
  client: Client,
  deploymentService: DeploymentService,
): Promise<void> {
  const isCluster0 = client.cluster.shardList.includes(0);

  // Only run background tasks on shard 0 to avoid duplication
  if (!isCluster0) {
    logger.info(
      {
        clusterId: client.cluster.id,
        shardIds: client.cluster.shardList,
      },
      "Skipping background tasks on non-main cluster",
    );

    return;
  }

  logger.info(
    {
      clusterId: client.cluster.id,
      shardIds: client.cluster.shardList,
      isCluster0,
    },
    "Starting background tasks on cluster with shard 0",
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
            clusterId: client.cluster.id,
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
            clusterId: client.cluster.id,
          },
        });

        logger.error(
          {
            err,
            taskName: task.name,
            clusterId: client.cluster.id,
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
        clusterId: client.cluster.id,
      },
      "Started background task",
    );
  }
}
