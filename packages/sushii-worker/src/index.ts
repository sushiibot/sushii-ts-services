import "./dayjs";
import { AMQPClient } from "@cloudamqp/amqp-client";
import * as Sentry from "@sentry/node";
import { Client, Events, GatewayIntentBits, Options } from "discord.js";
import log from "./logger";
import InteractionClient from "./client";
import AmqpGateway from "./model/AmqpGateway";
import initI18next from "./i18next";
import addCommands from "./interactions/commands";
import server from "./server";
import Metrics from "./model/metrics";
import addEventHandlers from "./events/handlers";
import sdk from "./tracing";
import Context from "./model/context";
import startTasks from "./tasks/startTasks";
import { getSdkWebsocket, getWsClient } from "./model/graphqlClient";
import config from "./model/config";

async function main(): Promise<void> {
  Sentry.init({
    dsn: config.SENTRY_DSN,
    environment:
      process.env.NODE_ENV === "production" ? "production" : "development",

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });

  await initI18next();

  const amqpClient = new AMQPClient(config.AMQP_URL);
  const rabbitGatewayClient = new AmqpGateway(amqpClient, config);
  const metrics = new Metrics();

  const wsClient = getWsClient(config);
  const wsSdk = getSdkWebsocket(wsClient, metrics);

  const ctx = new Context(metrics, rabbitGatewayClient, wsSdk);
  const client = new InteractionClient(ctx, metrics);
  addCommands(client);
  addEventHandlers(client);

  // Register commands to Discord API
  await client.register();

  // Create a new client instance
  const djsClient = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildModeration,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.DirectMessages,
    ],
    rest: {
      version: "10",
      // Ensure we are using the proxy api url
      api: config.PROXY_URL,
    },
    makeCache: Options.cacheWithLimits({
      // Do not cache messages
      MessageManager: 0,
    }),
  });

  djsClient.once(Events.ClientReady, (c) => {
    log.info(`Ready! Logged in as ${c.user.tag}`);
  });

  djsClient.login(config.TOKEN);

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
