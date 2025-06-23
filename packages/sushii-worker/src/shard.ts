import "./dayjs";
import * as Sentry from "@sentry/node";
import { Client, GatewayIntentBits, Options, Partials } from "discord.js";
import log from "./logger";
import InteractionClient from "./client";
import initI18next from "./i18next";
import registerInteractionHandlers from "./interactions/commands";
import sdk from "./tracing";
import Context from "./model/context";
import config from "./model/config";
import registerEventHandlers from "./handlers";

Error.stackTraceLimit = 50;

async function initializeShard(): Promise<void> {
  Sentry.init({
    dsn: config.SENTRY_DSN,
    environment:
      process.env.NODE_ENV === "production" ? "production" : "development",
    tracesSampleRate: 1.0,
  });

  await initI18next();

  // Create a new client instance
  const djsClient = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildModeration,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildEmojisAndStickers,
    ],
    partials: [Partials.Message, Partials.Reaction, Partials.GuildMember],
    rest: {
      version: "10",
      api: config.DISCORD_API_PROXY_URL,
    },
    makeCache: Options.cacheWithLimits({
      MessageManager: 0,
      UserManager: 0,
    }),
  });

  djsClient.rest.setToken(config.DISCORD_TOKEN);

  const ctx = new Context(djsClient);
  const client = new InteractionClient(ctx);
  registerInteractionHandlers(client);

  await client.register();
  registerEventHandlers(ctx, djsClient, client);

  process.on("SIGTERM", async () => {
    log.info("SIGTERM received, shutting down shard gracefully");
    try {
      await djsClient.destroy();
      await Sentry.close(2000);
      await sdk.shutdown();
    } catch (err) {
      log.error(err, "error shutting down shard");
    }
    process.exit(0);
  });

  log.info("starting Discord client shard");
  await djsClient.login(config.DISCORD_TOKEN);
}

initializeShard().catch((e) => {
  Sentry.captureException(e, {
    level: "fatal",
  });
  log.error(e, "fatal error in shard");
  process.exit(1);
});
