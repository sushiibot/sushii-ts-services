import "./dayjs";
import { REST } from "@discordjs/rest";
import dotenv from "dotenv";
import { AMQPClient } from "@cloudamqp/amqp-client";
import Sentry from "@sentry/node";
import log from "./logger";
import InteractionClient from "./interactions/client";
import { Config } from "./model/config";
import AmqpGateway from "./gateway/amqp";
import initI18next from "./i18next";
import addCommands from "./interactions/commands";

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
  const rest = new REST({
    version: "10",
    // api: config.proxyUrl,
  }).setToken(config.token);

  log.info("config: %o", config.proxyUrl);

  const interactionClient = new InteractionClient(rest, config);
  addCommands(interactionClient);

  // Register commands to Discord API
  await interactionClient.register();

  log.info("connecting to rabbitmq for gateway events");
  await rabbitGatewayClient.connect((msg) =>
    interactionClient.handleAMQPMessage(msg)
  );

  log.info("connected to rabbitmq, processing events");

  process.on("SIGINT", () => {
    log.info("cleaning up");

    log.info("closing rabbitmq");
    rabbitGatewayClient.stop();

    log.info("closing sentry");
    Sentry.close(2000).then(() => {
      log.info("bye");
      process.exit();
    });
  });
}

main().catch((e) => {
  log.error(e, "fatal error rip");
});
