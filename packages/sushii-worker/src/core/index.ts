import "./dayjs";
import * as Sentry from "@sentry/bun";
import { ShardingManager } from "discord.js";
import { fileURLToPath } from "url";
import log from "./logger";
import server from "./server";
import sdk from "./tracing";
import config from "../model/config";
import { registerShutdownSignals } from "./signals";
import { drizzleDb } from "@/infrastructure/database/db";

// Type-safe reference to ensure shard.ts exists WITHOUT importing and running
// the file. If it's imported, it will cause process.send not defined errors as
// it wasn't spawned by the ShardingManager
import type {} from "./shard";
import { migrate } from "drizzle-orm/node-postgres/migrator";

Error.stackTraceLimit = 50;

async function main(): Promise<void> {
  Sentry.init({
    dsn: config.SENTRY_DSN,
    environment:
      config.SENTRY_ENVIRONMENT ||
      (process.env.NODE_ENV === "production" ? "production" : "development"),
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
  if (config.DISCORD_API_PROXY_URL) {
    try {
      const response = await fetch(config.DISCORD_API_PROXY_URL, {
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

  if (config.MANUAL_SHARD_COUNT) {
    log.info(
      { shardCount: config.MANUAL_SHARD_COUNT },
      "Using manual shard count",
    );
  }

  // Create ShardingManager
  const manager = new ShardingManager(shardFile, {
    token: config.DISCORD_TOKEN,
    totalShards: config.MANUAL_SHARD_COUNT || "auto",
    mode: "process",
    respawn: true,
  });

  // Start metrics and healthcheck server (runs only in main process)
  const servers = server(manager, []);

  registerShutdownSignals(async () => {
    log.info("shutting down ShardingManager");

    try {
      log.info("shutting down shards");
      manager.shards.forEach((shard) => shard.kill());

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

  manager.on("shardCreate", (shard) => {
    log.info(
      {
        shardId: shard.id,
      },
      "Launched shard",
    );
  });

  log.info("Spawning shards");
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
