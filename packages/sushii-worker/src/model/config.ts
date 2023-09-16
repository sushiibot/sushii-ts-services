import { z } from "zod";
import * as dotenv from "dotenv";
import pino from "pino";

dotenv.config();

const schema = z.object({
  DATABASE_URL: z.string(),
  DISCORD_TOKEN: z.string(),
  LOG_LEVEL: z.string().optional().default("info"),
  APPLICATION_ID: z.string(),
  SENTRY_DSN: z.string(),
  SUSHII_GRAPHQL_WS_URL: z.string(),
  SUSHII_GRAPHQL_TOKEN: z.string(),
  SUSHII_IMAGE_SERVER_URL: z.string(),

  METRICS_PORT: z.string().optional().default("3000"),

  // Example: 'https://discord.com/api'
  TWILIGHT_PROXY_URL: z.string(),

  NOTIFY_WEBHOOK_URL: z.string().optional(),
  NOTIFY_WEBHOOK_USERNAME: z.string().optional(),

  TRACING_EXPORTER_URL: z.string().optional(),

  DISABLE_BAN_FETCH_ON_READY: z
    .preprocess((x) => x === "true", z.boolean())
    .optional()
    .default(false),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  // Temporary logger since we need the config to setup the real one
  const logger = pino();

  logger.error(
    {
      error: parsed.error.format(),
    },
    "❌ Invalid environment variables"
  );

  process.exit(1);
}

export type ConfigType = z.infer<typeof schema>;

export default parsed.data;
