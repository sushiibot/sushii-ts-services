import http from "http";
import express from "express";
import { createTerminus } from "@godaddy/terminus";
import client from "prom-client";
import logger from "./logger";
import config from "./model/config";

interface ServerOptions {
  onHealthcheck: () => Promise<any>;
  onShutdown: () => Promise<void>;
}

export default function server(
  promRegistry: client.Registry,
  { onHealthcheck, onShutdown }: ServerOptions
): http.Server {
  const app = express();

  app.get("/", (req, res) => {
    res.send("ok");
  });

  // Prometheus metrics
  app.get("/metrics", async (req, res) => {
    try {
      res.set("Content-Type", promRegistry.contentType);
      res.end(await promRegistry.metrics());
    } catch (ex) {
      res.status(500).end(ex);
    }
  });

  const s = http.createServer(app);

  createTerminus(s, {
    signals: ["SIGINT", "SIGTERM"],
    healthChecks: {
      "/healthcheck": async ({ state }) => {
        if (state.isShuttingDown) {
          return;
        }

        return onHealthcheck();
      }, // a function accepting a state and returning a promise indicating service health,
      verbatim: true, // [optional = false] use object returned from /healthcheck verbatim in response,
    },
    onShutdown: async () => {
      await onShutdown();
      logger.info("bye!");
    },
    beforeShutdown: async () => {
      logger.info("shutting down");
    },
    // Error object needs to be first argument instead of last for pino
    logger: (msg, err) => logger.error(err, msg),
  });

  s.listen(config.METRICS_PORT);

  logger.info(
    `metrics listening on http://localhost:${config.METRICS_PORT}/metrics`
  );
  logger.info(
    `healthcheck listening on http://localhost:${config.METRICS_PORT}/healthcheck`
  );

  return s;
}
