import { z } from "zod";
import * as dotenv from "dotenv";
import logger from "../logger";

dotenv.config();

const schema = z.object({
  DISCORD_TOKEN: z.string(),
  LOG_LEVEL: z.string().optional().default("info"),
  APPLICATION_ID: z.string(),
  SENTRY_DSN: z.string(),
  SUSHII_GRAPHQL_URL: z.string(),
  SUSHII_GRAPHQL_WS_URL: z.string(),
  SUSHII_GRAPHQL_TOKEN: z.string(),
  SUSHII_IMAGE_SERVER_URL: z.string(),
  DATABASE_URL: z.string(),

  // Example: 'https://discord.com/api'
  TWILIGHT_PROXY_URL: z.string(),

  NOTIFY_WEBHOOK_URL: z.string().optional(),
  NOTIFY_WEBHOOK_USERNAME: z.string().optional(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
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
