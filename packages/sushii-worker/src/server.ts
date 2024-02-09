import { register } from "prom-client";
import { Hono, MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { Server } from "bun";
import { Client, RESTPostAPIApplicationCommandsJSONBody } from "discord.js";
import logger from "./logger";
import config from "./model/config";

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

const httpLogger = logger.child({ module: "http" });

const pinoLoggerMiddleware: MiddlewareHandler = async (c, next) => {
  const start = Date.now();
  await next();
  const elapsed = Date.now() - start;

  const log = {
    method: c.req.method,
    path: c.req.routePath,
    status: c.res.status,
    elapsed,
  };

  const message = `${c.req.method} ${c.req.path} ${c.res.status} ${elapsed} ms`;

  if (c.res.status >= 400) {
    httpLogger.error(log, message);
  } else {
    httpLogger.debug(log, message);
  }
};

export default function server(
  client: Client<boolean>,
  commands: RESTPostAPIApplicationCommandsJSONBody[],
): Server {
  const app = new Hono();

  // Middleware
  app.use("*", pinoLoggerMiddleware);

  // Handlers
  app.notFound((c) => c.json({ message: "Not Found", ok: false }, 404));
  app.onError((err, c) => {
    httpLogger.error(`${err}`);
    return c.text("Error", 500);
  });

  // Routes
  app.get("/", (c) => c.text("ok"));
  app.get("/commands", (c) => c.json(commands));
  app.get("/status", (c) =>
    c.json({
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
      client: {
        readyAt: client.readyTimestamp,
        uptimeMs: client.uptime,
        shardCount: client.ws.shards.size,
        shardStatus: client.ws.shards.map((s) => ({
          id: s.id,
          status: ShardStatusToName[s.status],
          statusCode: s.status,
        })),
      },
    }),
  );

  // Prometheus metrics
  app.get("/metrics", async (c) => {
    try {
      const metrics = await register.metrics();

      c.header("Content-Type", register.contentType);
      return c.text(metrics);
    } catch (ex) {
      throw new HTTPException(500, {
        message: "Error generating metrics",
      });
    }
  });

  const s = Bun.serve({
    port: config.METRICS_PORT,
    fetch: app.fetch,
  });

  logger.info(
    `metrics listening on http://localhost:${config.METRICS_PORT}/metrics`,
  );
  logger.info(
    `healthcheck listening on http://localhost:${config.METRICS_PORT}/healthcheck`,
  );

  return s;
}
