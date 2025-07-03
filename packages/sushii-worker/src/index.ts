import "./dayjs";
import * as Sentry from "@sentry/node";
import { ShardingManager } from "discord.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import log from "./logger";
import server from "./server";
import sdk from "./tracing";
import config from "./model/config";
import { registerShutdownSignals } from "./signals";

Error.stackTraceLimit = 50;

async function main(): Promise<void> {
  Sentry.init({
    dsn: config.SENTRY_DSN,
    environment:
      process.env.NODE_ENV === "production" ? "production" : "development",
    tracesSampleRate: 1.0,
  });

  // Get the shard file path
  const fileName = fileURLToPath(import.meta.url);
  const dirName = dirname(fileName);
  const shardFile = join(dirName, "./core/shard.ts");

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
  });

  // Start metrics and healthcheck server (runs only in main process)
  const servers = server(manager, []);

  registerShutdownSignals(async () => {
    log.info("shutting down ShardingManager");

    try {
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
  process.exit(1);
});

process.on("exit", (code) => {
  log.info(`Exiting with code ${code}`);
  log.flush();
});
