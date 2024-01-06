import { register } from "prom-client";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { logger as honoLogger } from "hono/logger";
import { Server } from "bun";
import logger from "./logger";
import config from "./model/config";

const httpLogger = logger.child({ name: "http" });

export default function server(): Server {
  const app = new Hono();
  app.use("*", honoLogger());
  app.notFound((c) => c.json({ message: "Not Found", ok: false }, 404));

  app.onError((err, c) => {
    httpLogger.error(`${err}`);
    return c.text("Error", 500);
  });

  app.get("/", (c) => c.text("ok"));
  app.get("/status", (c) =>
    c.json({
      deployment: config.DEPLOYMENT_NAME,
      owner: {
        userID: config.OWNER_USER_ID,
        channelID: config.OWNER_CHANNEL_ID,
      },
      tracingSamplePercentage: config.TRACING_SAMPLE_PERCENTAGE,
      disableBanFetchOnReady: config.DISABLE_BAN_FETCH_ON_READY,
      banPoolEnabled: config.BAN_POOL_ENABLED,
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
