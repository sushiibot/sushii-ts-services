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
  // If using guild commands for testing
  guildId: string | undefined;
  graphqlApiURL: string;
  graphqlApiToken: string;
  sushiiImageServerURL: string;
  amqpUrl: string;
  amqpQueueName: string;

  // Example: 'https://discord.com/api'
  proxyUrl: string;
}
export class Config implements ConfigI {
  public token: string;

  public applicationId: string;

  public guildId: string | undefined;

  public graphqlApiURL: string;

  public graphqlApiToken: string;

  public sushiiImageServerURL: string;

  public amqpUrl: string;

  public amqpQueueName: string;

  public proxyUrl: string;

  constructor() {
    this.token = requiredEnv("DISCORD_TOKEN");
    this.applicationId = requiredEnv("APPLICATION_ID");
    this.guildId = process.env.GUILD_ID;
    this.graphqlApiURL = requiredEnv("SUSHII_GRAPHQL_URL");
    this.graphqlApiToken = requiredEnv("SUSHII_GRAPHQL_TOKEN");
    this.sushiiImageServerURL = requiredEnv("SUSHII_IMAGE_SERVER_URL");
    this.amqpUrl = requiredEnv("AMQP_URL");
    this.amqpQueueName = requiredEnv("AMQP_QUEUE_NAME");
    this.proxyUrl = requiredEnv("TWILIGHT_PROXY_URL");
  }
}