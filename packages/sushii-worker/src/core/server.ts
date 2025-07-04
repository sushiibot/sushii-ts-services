import { register } from "prom-client";
import { Hono, MiddlewareHandler } from "hono";
import { routePath } from "hono/route";
import { HTTPException } from "hono/http-exception";
import { Server } from "bun";
import {
  ShardingManager,
  RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";
import { newModuleLogger } from "./logger";
import { config } from "./config";
import { updateShardMetrics } from "../metrics/gatewayMetrics";

// Reverse mapping of the Status enum to get the name
export const ShardStatusToName = {
  0: "Ready",
  1: "Connecting",
  2: "Reconnecting",
  3: "Idle",
  4: "Nearly",
  5: "Disconnected",
  6: "WaitingForGuilds",
  7: "Identifying",
  8: "Resuming",
};

const logger = newModuleLogger("http");

const pinoLoggerMiddleware: MiddlewareHandler = async (c, next) => {
  const start = Date.now();
  await next();
  const elapsedMs = Date.now() - start;

  const log = {
    method: c.req.method,
    path: routePath(c),
    status: c.res.status,
    elapsedMs,
  };

  const message = `${c.req.method} ${c.req.path} ${c.res.status} ${elapsedMs} ms`;
  logger.debug(log, message);
};

function createHealthServer(manager: ShardingManager): Server {
  const app = new Hono();

  // Middleware
  app.use("*", pinoLoggerMiddleware);

  // Routes
  app.get("/health", (c) => {
    const shardStatuses = Array.from(manager.shards.values()).map(
      (s) => s.ready,
    );
    const readyCount = shardStatuses.filter(Boolean).length;

    const totalShards = manager.totalShards;
    const fullyReady = readyCount === totalShards;
    const statusCode = fullyReady ? 200 : 503;

    return c.json(
      {
        status: fullyReady ? "healthy" : "unhealthy",
        deployment: config.deployment.name,
        shards: {
          total: totalShards,
          ready: readyCount,
        },
      },
      statusCode,
    );
  });

  return Bun.serve({
    port: config.metrics.healthPort,
    fetch: app.fetch,
  });
}

function createMonitoringServer(
  manager: ShardingManager,
  commands: RESTPostAPIApplicationCommandsJSONBody[],
): Server {
  const app = new Hono();

  // Middleware
  app.use("*", pinoLoggerMiddleware);

  // Routes
  app.get("/commands", (c) => c.json(commands));
  app.get("/status", (c) => {
    const shardInfo = {
      count: manager.totalShards,
      status: Array.from(manager.shards.values()).map((s) => ({
        id: s.id,
        ready: s.ready,
        process: {
          pid: s.process?.pid,
          connected: s.process?.connected,
        },
      })),
    };

    const fullyReady = shardInfo.status.every((s) => s.ready);

    return c.json({
      status: fullyReady ? "healthy" : "unhealthy",
      config: {
        deployment: config.deployment.name,
        owner: {
          userID: config.deployment.ownerUserId,
          channelID: config.deployment.ownerChannelId,
        },
        tracingSamplePercentage: config.tracing.samplePercentage,
        disableBanFetchOnReady: config.features.disableBanFetchOnReady,
        banPoolEnabled: config.features.banPoolEnabled,
      },
      shards: shardInfo,
    });
  });

  // Prometheus metrics
  app.get("/metrics", async (c) => {
    try {
      // Update shard metrics
      await updateShardMetrics(manager);

      const metrics = await register.metrics();

      c.header("Content-Type", register.contentType);
      return c.text(metrics);
    } catch (err) {
      logger.error({ err }, "Error generating metrics");

      throw new HTTPException(500, {
        message: "Error generating metrics",
      });
    }
  });

  return Bun.serve({
    port: config.metrics.port,
    fetch: app.fetch,
  });
}

export default function server(
  manager: ShardingManager,
  commands: RESTPostAPIApplicationCommandsJSONBody[],
): Server[] {
  const healthServer = createHealthServer(manager);
  const monitoringServer = createMonitoringServer(manager, commands);

  logger.info(
    `health endpoint listening on http://localhost:${config.metrics.healthPort}/health`,
  );
  logger.info(
    `metrics endpoint listening on http://localhost:${config.metrics.port}/metrics`,
  );
  logger.info(
    `status endpoint listening on http://localhost:${config.metrics.port}/status`,
  );

  return [healthServer, monitoringServer];
}
