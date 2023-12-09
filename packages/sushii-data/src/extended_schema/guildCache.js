"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphile_utils_1 = require("graphile-utils");
const pino_1 = __importDefault(require("pino"));
const lodash_1 = require("lodash");
const redis_1 = __importDefault(require("./redis"));
const logger = (0, pino_1.default)({
    name: "guildCacheSchemaPlugin",
});
exports.default = (0, graphile_utils_1.makeExtendSchemaPlugin)(() => ({
    typeDefs: (0, graphile_utils_1.gql) `
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
            redisGuildByGuildId: (_query, args) => __awaiter(void 0, void 0, void 0, function* () {
                const cachedGuildStr = yield redis_1.default.get(`guild:${args.guild_id}`);
                logger.info(`redis: get guild:${args.guild_id}`);
                if (!cachedGuildStr) {
                    logger.warn(`could not find guild ${args.guild_id} in redis`);
                    return null;
                }
                const parsedSnakeCase = JSON.parse(cachedGuildStr);
                const guildKeys = yield redis_1.default.sMembers(`guild_keys:${args.guild_id}`);
                const roles = yield Promise.all(guildKeys
                    .filter((key) => key.startsWith("role:"))
                    .map((key) => redis_1.default.get(key)));
                // Add filtered and json parsed roles to guild
                parsedSnakeCase.roles = roles
                    .filter((role) => role !== null)
                    .map((role) => JSON.parse(role));
                // Sort roles in place -- first by id, then by position.
                parsedSnakeCase.roles.sort((a, b) => a.id - b.id);
                parsedSnakeCase.roles.sort((a, b) => a.position - b.position);
                // Convert keys to camel case
                return (0, lodash_1.mapKeys)(parsedSnakeCase, (v, k) => (0, lodash_1.camelCase)(k));
            }),
            allRedisGuildIds: () => __awaiter(void 0, void 0, void 0, function* () {
                const keys = yield redis_1.default.sMembers("guild_keys");
                // guild:187450744427773963
                return keys.map((k) => k.split(":")[1]);
            }),
        },
    },
}));
