import "./dayjs";
import * as Sentry from "@sentry/node";
import { Client, GatewayIntentBits, Options, Partials } from "discord.js";
import log from "./logger";
import InteractionRouter from "./infrastructure/discord/InteractionRouter";
import initI18next from "./i18next";
import registerInteractionHandlers from "../interactions/commands";
import sdk from "./tracing";
import Context from "../model/context";
import config from "../model/config";
import registerEventHandlers from "./infrastructure/discord/handlers";
import { initCore, registerFeatures } from "./bootstrap";

Error.stackTraceLimit = 50;

async function initializeShard(): Promise<void> {
  Sentry.init({
    dsn: config.SENTRY_DSN,
    environment:
      config.SENTRY_ENVIRONMENT ||
      (process.env.NODE_ENV === "production" ? "production" : "development"),
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
      GatewayIntentBits.GuildExpressions,
    ],
    partials: [Partials.Message, Partials.Reaction, Partials.GuildMember],
    rest: {
      version: "10",
      // api: config.DISCORD_API_PROXY_URL,
    },
    makeCache: Options.cacheWithLimits({
      MessageManager: 0,
      UserManager: 0,
    }),
  });

  djsClient.rest.setToken(config.DISCORD_TOKEN);

  const ctx = new Context(djsClient);
  const interactionRouter = new InteractionRouter(ctx);
  registerInteractionHandlers(interactionRouter);

  // Only register on shard 0
  if (djsClient.shard?.ids[0] === 0) {
    log.info("registering interaction handlers on shard 0");

    await interactionRouter.register();
  }

  // START NEW REGISTRATION
  const { db } = initCore();

  // New registration of features
  registerFeatures(db, djsClient);

  // Legacy registration of event handlers
  registerEventHandlers(ctx, djsClient, interactionRouter);

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

  log.info(
    {
      shards: djsClient.shard?.ids,
      mode: djsClient.shard?.mode,
    },
    "starting Discord client shard",
  );
  await djsClient.login(config.DISCORD_TOKEN);
}

initializeShard().catch((e) => {
  Sentry.captureException(e, {
    level: "fatal",
  });
  log.error(e, "fatal error in shard");
  process.exit(1);
});
