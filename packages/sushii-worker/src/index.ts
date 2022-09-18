import "./dayjs";
import dotenv from "dotenv";
import { AMQPClient } from "@cloudamqp/amqp-client";
import * as Sentry from "@sentry/node";
import log from "./logger";
import InteractionClient from "./client";
import { Config } from "./model/config";
import AmqpGateway from "./gateway/amqp";
import initI18next from "./i18next";
import addCommands from "./interactions/commands";
import server from "./server";
import Metrics from "./model/metrics";
import addEventHandlers from "./events/handlers";

async function main(): Promise<void> {
  dotenv.config();
  const config = new Config();

  Sentry.init({
    dsn: config.sentryDsn,
    environment:
      process.env.NODE_ENV === "production" ? "production" : "development",

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });

  await initI18next();

  const amqpClient = new AMQPClient(config.amqpUrl);
  const rabbitGatewayClient = new AmqpGateway(amqpClient, config);
  const metrics = new Metrics();

  const client = new InteractionClient(config, metrics);
  addCommands(client);
  addEventHandlers(client);

  // Register commands to Discord API
  await client.register();

  await rabbitGatewayClient.connect((msg) => client.handleAMQPMessage(msg));

  // ---------------------------------------------------------------------------
  // Metrics and healthcheck

  server(metrics.getRegistry(), {
    onHealthcheck: async () => {
      log.info("healthcheck");

      return {
        hey: "meow",
        ampq: rabbitGatewayClient.consumer?.channel.id,
      };
    },
    onShutdown: async () => {
      log.info("closing rabbitmq");
      rabbitGatewayClient.stop();

      log.info("closing sentry");
      await Sentry.close(2000);
    },
  });
}

main().catch((e) => {
  Sentry.captureException(e, {
    level: "fatal",
  });

  log.error(e, "fatal error rip");
});
