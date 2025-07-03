import { register } from "prom-client";
import { Hono, MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { Server } from "bun";
import {
  ShardingManager,
  RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";
import { newModuleLogger } from "./logger";
import config from "../model/config";
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
    path: c.req.routePath,
    status: c.res.status,
    elapsedMs,
  };

  const message = `${c.req.method} ${c.req.path} ${c.res.status} ${elapsedMs} ms`;

  if (c.res.status >= 400) {
    logger.error(log, message);
  } else {
    logger.debug(log, message);
  }
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
        deployment: config.DEPLOYMENT_NAME,
        shards: {
          total: totalShards,
          ready: readyCount,
        },
      },
      statusCode,
    );
  });

  return Bun.serve({
    port: config.HEALTH_PORT,
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
        deployment: config.DEPLOYMENT_NAME,
        owner: {
          userID: config.OWNER_USER_ID,
          channelID: config.OWNER_CHANNEL_ID,
        },
        tracingSamplePercentage: config.TRACING_SAMPLE_PERCENTAGE,
        disableBanFetchOnReady: config.DISABLE_BAN_FETCH_ON_READY,
        banPoolEnabled: config.BAN_POOL_ENABLED,
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
    port: config.METRICS_PORT,
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
    `health endpoint listening on http://localhost:${config.HEALTH_PORT}/health`,
  );
  logger.info(
    `metrics endpoint listening on http://localhost:${config.METRICS_PORT}/metrics`,
  );
  logger.info(
    `status endpoint listening on http://localhost:${config.METRICS_PORT}/status`,
  );

  return [healthServer, monitoringServer];
}
