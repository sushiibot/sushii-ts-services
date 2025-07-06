import "./dayjs";
import * as Sentry from "@sentry/bun";
import { fileURLToPath } from "url";
import log from "./logger";
import server from "./server";
import sdk from "./tracing";
import { config } from "@/core/config";
import { registerShutdownSignals } from "./signals";
import { drizzleDb } from "@/infrastructure/database/db";

// Type-safe reference to ensure shard.ts exists WITHOUT importing and running
// the file. If it's imported, it will cause process.send not defined errors as
// it wasn't spawned by the ShardingManager
import type {} from "./shard";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { ClusterManager, HeartbeatManager } from "discord-hybrid-sharding";

Error.stackTraceLimit = 50;

async function main(): Promise<void> {
  Sentry.init({
    dsn: config.sentry.dsn,
    environment: config.sentry.environment,
    tracesSampleRate: 1.0,
  });

  // Initial migration skipped manually for graphile-migrate -> drizzle migration
  // Run database migrations
  await migrate(drizzleDb, {
    migrationsFolder: "./drizzle",
  });

  // Close the database connection, as we don't need it in the main process
  // anymore
  await drizzleDb.$client.end();

  // ---------------------------------------------------------------------------
  // Checks

  // Ensure API proxy URL is valid and reachable
  if (config.discord.proxyUrl) {
    try {
      const response = await fetch(config.discord.proxyUrl, {
        method: "GET",
      });

      // Not found, etc. is fine, just not a server error
      if (response.status >= 500) {
        throw new Error(
          `API proxy URL returned ${response.status} ${response.statusText}`,
        );
      }
    } catch (err) {
      // Connection error, server isn't even up or not reachable
      log.error(
        { err },
        "Failed to reach API proxy URL, please check your configuration",
      );

      process.exit(1);
    }
  }

  // ---------------------------------------------------------------------------
  // ShardManager Initialization

  // Get the shard file path
  const shardFile = fileURLToPath(import.meta.resolve("./shard.ts"));

  if (config.manualShardCount) {
    log.info(
      {
        shardCount: config.manualShardCount,
      },
      "Using manual shard count",
    );
  }

  // Create ShardingManager
  const manager = new ClusterManager(shardFile, {
    token: config.discord.token,
    totalShards: config.manualShardCount || "auto",
    shardsPerClusters: config.shardsPerCluster,
    mode: "process",
  });

  manager.extend(
    new HeartbeatManager({
      // Interval to send a heartbeat
      interval: 2000,
      // Maximum amount of missed Heartbeats until Cluster will get respawned
      maxMissedHeartbeats: 5,
    }),
  );

  // Start metrics and healthcheck server (runs only in main process)
  const servers = server(manager, []);

  registerShutdownSignals(async () => {
    log.info("shutting down ShardingManager");

    try {
      log.info("shutting down shards");
      manager.clusters.values().forEach((shard) =>
        shard.kill({
          force: false,
        }),
      );

      log.info("closing sentry");
      await Sentry.close(2000);

      log.info("closing tracing");
      await sdk.shutdown();

      log.info("closing servers");
      servers.forEach((s) => s.stop());

      log.flush();
    } catch (err) {
      log.error(err, "error shutting down");
      process.exit(1);
    }

    process.exit(0);
  });

  manager.on("clusterReady", (cluster) => {
    log.info(
      {
        clusterId: cluster.id,
        shards: cluster.shardList,
      },
      "Cluster is ready",
    );
  });

  manager.on("clusterCreate", (cluster) =>
    log.info(
      {
        clusterId: cluster.id,
        shards: cluster.shardList,
        pid: (cluster.thread as Child)?.process?.pid,
        connected: (cluster.thread as Child)?.process?.connected,
      },
      `Launched Cluster $`,
    ),
  );

  log.info(
    {
      totalShards: manager.totalShards,
      manualShardCount: config.manualShardCount,
      shardsPerCluster: config.shardsPerCluster,
    },
    "Spawning shards",
  );
  await manager.spawn();
}

main().catch((e) => {
  Sentry.captureException(e, {
    level: "fatal",
  });

  log.error(e, "fatal error rip");
  log.flush();

  process.exit(1);
});

process.on("exit", (code) => {
  log.info(`Exiting with code ${code}`);
  log.flush();
});
