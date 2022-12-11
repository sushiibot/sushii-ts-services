import "./dayjs";
import dotenv from "dotenv";
import { AMQPClient } from "@cloudamqp/amqp-client";
import * as Sentry from "@sentry/node";
import { Client, createClient } from "graphql-ws";
import log from "./logger";
import InteractionClient from "./client";
import { Config } from "./model/config";
import AmqpGateway from "./model/AmqpGateway";
import initI18next from "./i18next";
import addCommands from "./interactions/commands";
import server from "./server";
import Metrics from "./model/metrics";
import addEventHandlers from "./events/handlers";
import sdk from "./tracing";
import Context from "./model/context";
import startTasks from "./tasks/startTasks";
import getHeadersWebSocket from "./model/Websocket";
import { getSdkWebsocket } from "./model/graphqlClient";

function getWsClient(config: Config): Client {
  return createClient({
    webSocketImpl: getHeadersWebSocket(config),
    url: config.graphqlApiWebsocketURL,
    connectionParams: {
      Authorization: `Bearer ${config.graphqlApiToken}`,
    },
    lazy: false,
    retryAttempts: Infinity,
    shouldRetry: () => true,
    on: {
      connected: () => {
        log.info("Websocket connected to sushii API");
      },
      error: (err) => {
        log.error({ err }, "Websocket error");
      },
      ping: (data) => {
        log.info(data, "Websocket ping");
      },
      pong: (data) => {
        log.info(data, "Websocket pong");
      },
      closed: (res) => {
        log.info(res, "Websocket closed");
      },
    },
    onNonLazyError: (err) => {
      log.error({ err }, "Websocket non-lazy error");
    },
  });
}

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

  const wsClient = getWsClient(config);
  const wsSdk = getSdkWebsocket(wsClient, metrics);

  const ctx = new Context(config, metrics, rabbitGatewayClient, wsSdk);
  const client = new InteractionClient(ctx, config, metrics);
  addCommands(client);
  addEventHandlers(client);

  // Register commands to Discord API
  await client.register();

  // Connect to event gateway
  await rabbitGatewayClient.connect((msg) => client.handleAMQPMessage(msg));

  // Start background jobs
  await startTasks(ctx);

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
      log.info("closing websocket connection to sushii API");
      await wsClient.dispose();

      log.info("closing rabbitmq");
      rabbitGatewayClient.stop();

      log.info("closing sentry");
      await Sentry.close(2000);

      log.info("closing tracing");
      await sdk.shutdown();

      log.flush();
    },
  });
}

main().catch((e) => {
  Sentry.captureException(e, {
    level: "fatal",
  });

  log.error(e, "fatal error rip");
});
