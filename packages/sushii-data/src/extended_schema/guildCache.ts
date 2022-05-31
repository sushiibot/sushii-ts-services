import { makeExtendSchemaPlugin, gql } from "graphile-utils";
import pino from "pino";
import { mapKeys, camelCase } from "lodash";
import redis from "./redis";

const logger = pino({
  name: "guildCacheSchemaPlugin",
});

export default makeExtendSchemaPlugin(() => ({
  typeDefs: gql`
    type RedisGuild {
      afkChannelId: String
      afkTimeout: Int!
      applicationId: String
      banner: String
      defaultMessageNotifications: Int
      description: String
      discoverySplash: String
      explicitContentFilter: Int
      icon: String
      id: String!
      joinedAt: String
      large: Boolean
      maxMembers: Int
      maxVideoChannelUsers: Int
      memberCount: Int
      mfaLevel: Int
      name: String!
      nsfwLevel: Int!
      ownerId: String!
      preferredLocale: String
      premiumSubscriptionCount: Int
      premiumTier: Int!
      rulesChannelId: String
      splash: String
      systemChannelFlags: Int
      systemChannelId: String
      unavailable: Boolean
      vanityUrlCode: String
      verificationLevel: Int
      voiceStates: [String]
      roles: [String]
      presences: [String]
      members: [String]
      features: [String]
      emojis: [String]
      channels: [String]
    }

    extend type Query {
      redisGuildByGuildId(guild_id: BigInt!): RedisGuild
      allRedisGuildIds: [BigInt!]!
    }
  `,
  resolvers: {
    Query: {
      redisGuild: async (_query, args) => {
        const cachedGuildStr = await redis.get(`guild:${args.guild_id}`);
        logger.info(`redis: get guild:${args.guild_id}`);

        if (!cachedGuildStr) {
          logger.warn(`could not find guild ${args.guild_id} in redis`);

          return null;
        }

        const parsedSnakeCase = JSON.parse(cachedGuildStr);

        // Convert keys to camel case
        return mapKeys(parsedSnakeCase, (v, k) => camelCase(k));
      },
      allRedisGuildIds: async () => {
        const keys = await redis.sMembers("guild_keys");

        // guild:187450744427773963
        return keys.map((k) => k.split(":")[1]);
      },
    },
  },
}));
