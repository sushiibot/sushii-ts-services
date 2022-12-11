function requiredEnv(envVar: string): string {
  const value = process.env[envVar];
  if (!value) {
    throw new Error(`Missing environment variable: ${envVar}`);
  }

  return value;
}

export interface ConfigI {
  token: string;
  applicationId: string;

  sentryDsn?: string;
  // If using guild commands for testing
  guildIds: string[];
  graphqlApiURL: string;
  graphqlApiWebsocketURL: string;
  graphqlApiToken: string;
  sushiiImageServerURL: string;
  amqpUrl: string;

  // Example: 'https://discord.com/api'
  proxyUrl: string;
}
export class Config implements ConfigI {
  public token: string;

  public applicationId: string;

  public sentryDsn?: string;

  public guildIds: string[];

  public graphqlApiURL: string;

  public graphqlApiWebsocketURL: string;

  public graphqlApiToken: string;

  public sushiiImageServerURL: string;

  public amqpUrl: string;

  public proxyUrl: string;

  constructor() {
    this.token = requiredEnv("DISCORD_TOKEN");
    this.applicationId = requiredEnv("APPLICATION_ID");
    this.sentryDsn = process.env.SENTRY_DSN;
    this.guildIds = process.env.GUILD_IDS?.split(",") || [];
    this.graphqlApiURL = requiredEnv("SUSHII_GRAPHQL_URL");
    this.graphqlApiWebsocketURL = requiredEnv("SUSHII_GRAPHQL_WS_URL");
    this.graphqlApiToken = requiredEnv("SUSHII_GRAPHQL_TOKEN");
    this.sushiiImageServerURL = requiredEnv("SUSHII_IMAGE_SERVER_URL");
    this.amqpUrl = requiredEnv("AMQP_URL");
    this.proxyUrl = requiredEnv("TWILIGHT_PROXY_URL");
  }
}
