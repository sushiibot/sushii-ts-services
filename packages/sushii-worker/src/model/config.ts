import { z } from "zod";
import * as dotenv from "dotenv";
import logger from "../logger";

dotenv.config();

const schema = z.object({
  TOKEN: z.string(),
  LOG_LEVEL: z.string().optional().default("info"),
  APPLICATION_ID: z.string(),
  SENTRY_DSN: z.string(),
  GRAPHQL_API_URL: z.string(),
  GRAPHQL_API_WEBSOCKET_URL: z.string(),
  GRAPHQL_API_TOKEN: z.string(),
  SUSHII_IMAGE_SERVER_URL: z.string(),
  AMQP_URL: z.string(),

  // Example: 'https://discord.com/api'
  PROXY_URL: z.string(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  logger.error(
    "❌ Invalid environment variables:",
    JSON.stringify(parsed.error.format(), null, 4)
  );

  process.exit(1);
}

export type ConfigType = z.infer<typeof schema>;

export default parsed.data;
