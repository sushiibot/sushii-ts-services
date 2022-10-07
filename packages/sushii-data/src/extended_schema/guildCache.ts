import { makeExtendSchemaPlugin, gql } from "graphile-utils";
import pino from "pino";
import { mapKeys, camelCase } from "lodash";
import redis from "./redis";

const logger = pino({
  name: "guildCacheSchemaPlugin",
});

export default makeExtendSchemaPlugin(() => ({
  typeDefs: gql`
    type RedisRoleTags {
      bot_id: String
      integration_id: String
    }

    type RedisGuildRole {
      id: String!
      name: String!
      color: Int!
      hoist: Boolean!
      icon: String
      unicode_emoji: String
      position: Int!
      permissions: String!
      managed: Boolean!
      mentionable: Boolean!
      tags: RedisRoleTags
    }

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
      roles: [RedisGuildRole!]!
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
      redisGuildByGuildId: async (_query, args) => {
        const cachedGuildStr = await redis.get(`guild:${args.guild_id}`);
        logger.info(`redis: get guild:${args.guild_id}`);

        if (!cachedGuildStr) {
          logger.warn(`could not find guild ${args.guild_id} in redis`);

          return null;
        }

        const parsedSnakeCase = JSON.parse(cachedGuildStr);

        const guildKeys = await redis.sMembers(`guild_keys:${args.guild_id}`);

        const roles = await Promise.all(
          guildKeys
            .filter((key) => key.startsWith("role:"))
            .map((key) => redis.get(key)),
        );

        // Add filtered and json parsed roles to guild
        parsedSnakeCase.roles = roles
          .filter((role): role is string => role !== null)
          .map((role) => JSON.parse(role));

        // Sort roles in place -- first by id, then by position.
        parsedSnakeCase.roles.sort((a: any, b: any) => a.id - b.id);
        parsedSnakeCase.roles.sort((a: any, b: any) => a.position - b.position);

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
