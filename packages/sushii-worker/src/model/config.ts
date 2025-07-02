import { z } from "zod";
import * as dotenv from "dotenv";
import pino from "pino";

dotenv.config();

const deploymentNameSchema = z.enum(["blue", "green"]);

const schema = z.object({
  // Name of the deployment of the current running process. This is used to
  // switch handling of events/interactions between multiple running processes.
  // Default is "blue"
  DEPLOYMENT_NAME: deploymentNameSchema,
  // Only owner can modify deployment in the channel ID
  OWNER_USER_ID: z.string().optional(),
  OWNER_CHANNEL_ID: z.string().optional(),

  DATABASE_URL: z.string(),
  DISCORD_TOKEN: z.string(),
  LOG_LEVEL: z.string().optional().default("info"),
  APPLICATION_ID: z.string(),
  SENTRY_DSN: z.string().optional(),
  SENTRY_ENVIRONMENT: z.string().optional(),
  SUSHII_IMAGE_SERVER_URL: z.string(),

  METRICS_PORT: z.string().optional().default("9090"),

  // Example: 'https://discord.com/api'
  DISCORD_API_PROXY_URL: z.string(),

  NOTIFY_WEBHOOK_URL: z.string().optional(),
  NOTIFY_WEBHOOK_USERNAME: z.string().optional(),

  NOTIFY_WEBHOOK_ERR_URL: z.string().optional(),

  TRACING_EXPORTER_URL: z.string().optional(),
  TRACING_SAMPLE_PERCENTAGE: z
    .preprocess((val) => Number(val), z.number())
    .optional()
    .default(0.05), // 5%

  DISABLE_BAN_FETCH_ON_READY: z
    .preprocess((x) => x === "true", z.boolean())
    .optional()
    .default(false),

  // Feature flags
  BAN_POOL_ENABLED: z
    .preprocess((x) => x === "true", z.boolean())
    .optional()
    .default(false),

  // Testing flags
  MANUAL_SHARD_COUNT: z.coerce.number().optional(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  // Temporary logger since we need the config to setup the real one
  const logger = pino();

  logger.error(
    {
      error: parsed.error.format(),
    },
    "❌ Invalid environment variables",
  );

  process.exit(1);
}

export type ConfigType = z.infer<typeof schema>;

export default parsed.data;
