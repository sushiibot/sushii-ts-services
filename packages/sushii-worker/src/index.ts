import "./dayjs";
import * as Sentry from "@sentry/node";
import { Client, GatewayIntentBits, Options, Partials } from "discord.js";
import log from "./logger";
import InteractionClient from "./client";
import initI18next from "./i18next";
import addCommands from "./interactions/commands";
import server from "./server";
import Metrics from "./model/metrics";
import sdk from "./tracing";
import Context from "./model/context";
import startTasks from "./tasks/startTasks";
import config from "./model/config";
import registerEventHandlers from "./handlers";
import { registerShutdownSignals } from "./signals";

Error.stackTraceLimit = 50;

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

  const metrics = new Metrics();

  // Create a new client instance
  const djsClient = new Client({
    // Internal sharding, single process.
    // ShardingManager uses child processes, metrics server needs to be updated
    // to not run into port conflicts. Should be fine for a while.
    shards: "auto",
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildModeration, // old GuildBans
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildEmojisAndStickers,
    ],
    // Required to receive reaction events on uncached messages, leave events
    // on uncached members, etc
    partials: [Partials.Message, Partials.Reaction, Partials.GuildMember],
    rest: {
      version: "10",
      // Ensure we are using the proxy api url
      api: config.DISCORD_API_PROXY_URL,
    },
    makeCache: Options.cacheWithLimits({
      // Do not cache messages
      MessageManager: 0,
      // Do not cache users
      UserManager: 0,
    }),
  });

  // Set token for rest client early for command registration
  djsClient.rest.setToken(config.DISCORD_TOKEN);

  const ctx = new Context(djsClient);
  const client = new InteractionClient(ctx, metrics);
  addCommands(client);

  // Register commands to Discord API
  await client.register();

  // Register node.js event handlers on the Discord.js client
  registerEventHandlers(ctx, djsClient, client);

  // Start background jobs
  await startTasks(ctx);

  // ---------------------------------------------------------------------------
  // Metrics and healthcheck

  const s = server(metrics.getRegistry());

  registerShutdownSignals(async () => {
    log.info("closing Discord client");
    try {
      await djsClient.destroy();
      log.info("closing sentry");
      await Sentry.close(2000);

      log.info("closing tracing");
      await sdk.shutdown();

      log.info("closing metrics server");
      s.stop();

      log.flush();
    } catch (err) {
      log.error(err, "error shutting down");
      process.exit(1);
      return;
    }

    process.exit(0);
  });

  log.info("starting Discord client");

  // Start client
  await djsClient.login(config.DISCORD_TOKEN);
}

main().catch((e) => {
  Sentry.captureException(e, {
    level: "fatal",
  });

  log.error(e, "fatal error rip");
  process.exit(1);
});

process.on("exit", (code) => {
  log.info(`Exiting with code ${code}`);
  log.flush();
});
