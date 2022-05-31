import "dotenv/config";
import express from "express";
import { postgraphile } from "postgraphile";
import compression from "compression";
import helmet from "helmet";
import pino from "pino";
import pinoHttp from "pino-http";
import http from "http";
import bodyparser from "body-parser";
import { createTerminus, TerminusState } from "@godaddy/terminus";
import { database, schemas, options, port } from "./options";
import redis from "./extended_schema/redis";

const logger = pino({
  name: "postgraphile",
});

async function main() {
  const middleware = postgraphile(database, schemas, options);
  await redis.connect();

  const app = express();

  // ---------------------------------------------------------------------------

  app.use(pinoHttp());
  app.use(compression({ threshold: 0 }));
  app.use(helmet());

  app.use(bodyparser.json());
  app.use(bodyparser.urlencoded({ extended: false }));
  app.use(bodyparser.text({ type: "application/graphql" }));

  // ---------------------------------------------------------------------------

  app.use(middleware);

  const server = http.createServer(app);

  createTerminus(server, {
    healthChecks: {
      "/health": async ({ state }: { state: TerminusState }) =>
        !state.isShuttingDown,
    },
    onShutdown: async () => {
      logger.info("bye!");
    },
    beforeShutdown: async () => {
      logger.info("shutting down");
    },
    signals: ["SIGINT", "SIGTERM"],
    logger: logger.error,
  });

  server.listen(port, () => {
    const address = server.address();

    if (address && typeof address !== "string") {
      const href = `http://localhost:${address.port}${
        options.graphiqlRoute || "/graphiql"
      }`;

      logger.info(`PostGraphiQL available at ${href} 🚀`);
    } else {
      logger.info(`PostGraphile listening on ${address} 🚀`);
    }
  });
}

main().catch((e) => logger.error(e));
