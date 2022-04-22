import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * A signed eight-byte integer. The upper big integer values are greater than the
   * max value for a JavaScript number. Therefore all big integers will be output as
   * strings and not numbers.
   */
  BigInt: any;
  /** A location in a connection that can be used for resuming pagination. */
  Cursor: any;
  /**
   * A point in time as described by the [ISO
   * 8601](https://en.wikipedia.org/wiki/ISO_8601) standard. May or may not include a timezone.
   */
  Datetime: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
  /** A universally unique identifier as defined by [RFC 4122](https://tools.ietf.org/html/rfc4122). */
  UUID: any;
};

export type BotStat = Node & {
  __typename?: 'BotStat';
  category: Scalars['String'];
  count: Scalars['BigInt'];
  createdAt: Scalars['Datetime'];
  name: Scalars['String'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  updatedAt: Scalars['Datetime'];
};

/** A condition to be used against `BotStat` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type BotStatCondition = {
  /** Checks for equality with the object’s `category` field. */
  category?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `count` field. */
  count?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `name` field. */
  name?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']>;
};

/** An input for mutations affecting `BotStat` */
export type BotStatInput = {
  category: Scalars['String'];
  count: Scalars['BigInt'];
  createdAt?: InputMaybe<Scalars['Datetime']>;
  name: Scalars['String'];
  updatedAt?: InputMaybe<Scalars['Datetime']>;
};

/** Represents an update to a `BotStat`. Fields that are set will be updated. */
export type BotStatPatch = {
  category?: InputMaybe<Scalars['String']>;
  count?: InputMaybe<Scalars['BigInt']>;
  createdAt?: InputMaybe<Scalars['Datetime']>;
  name?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['Datetime']>;
};

/** A connection to a list of `BotStat` values. */
export type BotStatsConnection = {
  __typename?: 'BotStatsConnection';
  /** A list of edges which contains the `BotStat` and cursor to aid in pagination. */
  edges: Array<BotStatsEdge>;
  /** A list of `BotStat` objects. */
  nodes: Array<BotStat>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `BotStat` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `BotStat` edge in the connection. */
export type BotStatsEdge = {
  __typename?: 'BotStatsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `BotStat` at the end of the edge. */
  node: BotStat;
};

/** Methods to use when ordering `BotStat`. */
export enum BotStatsOrderBy {
  CategoryAsc = 'CATEGORY_ASC',
  CategoryDesc = 'CATEGORY_DESC',
  CountAsc = 'COUNT_ASC',
  CountDesc = 'COUNT_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC'
}

export type CachedGuild = Node & {
  __typename?: 'CachedGuild';
  banner?: Maybe<Scalars['String']>;
  createdAt: Scalars['Datetime'];
  features: Array<Maybe<Scalars['String']>>;
  /** Reads a single `GuildConfig` that is related to this `CachedGuild`. */
  guildConfigById?: Maybe<GuildConfig>;
  icon?: Maybe<Scalars['String']>;
  id: Scalars['BigInt'];
  name: Scalars['String'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  splash?: Maybe<Scalars['String']>;
  updatedAt: Scalars['Datetime'];
  /** Reads and enables pagination through a set of `WebUserGuild`. */
  webUserGuildsByGuildId: WebUserGuildsConnection;
};


export type CachedGuildWebUserGuildsByGuildIdArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<WebUserGuildCondition>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<WebUserGuildsOrderBy>>;
};

/** An input for mutations affecting `CachedGuild` */
export type CachedGuildInput = {
  banner?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['Datetime']>;
  features?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  icon?: InputMaybe<Scalars['String']>;
  id: Scalars['BigInt'];
  name: Scalars['String'];
  splash?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['Datetime']>;
};

/** Represents an update to a `CachedGuild`. Fields that are set will be updated. */
export type CachedGuildPatch = {
  banner?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['Datetime']>;
  features?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  icon?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['BigInt']>;
  name?: InputMaybe<Scalars['String']>;
  splash?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['Datetime']>;
};

/** A `CachedGuild` edge in the connection. */
export type CachedGuildsEdge = {
  __typename?: 'CachedGuildsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `CachedGuild` at the end of the edge. */
  node: CachedGuild;
};

/** Methods to use when ordering `CachedGuild`. */
export enum CachedGuildsOrderBy {
  BannerAsc = 'BANNER_ASC',
  BannerDesc = 'BANNER_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  FeaturesAsc = 'FEATURES_ASC',
  FeaturesDesc = 'FEATURES_DESC',
  IconAsc = 'ICON_ASC',
  IconDesc = 'ICON_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SplashAsc = 'SPLASH_ASC',
  SplashDesc = 'SPLASH_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC'
}

export type CachedUser = Node & {
  __typename?: 'CachedUser';
  avatarUrl: Scalars['String'];
  discriminator: Scalars['Int'];
  id: Scalars['BigInt'];
  lastChecked: Scalars['Datetime'];
  name: Scalars['String'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
};

/** An input for mutations affecting `CachedUser` */
export type CachedUserInput = {
  avatarUrl: Scalars['String'];
  discriminator: Scalars['Int'];
  id: Scalars['BigInt'];
  lastChecked: Scalars['Datetime'];
  name: Scalars['String'];
};

/** Represents an update to a `CachedUser`. Fields that are set will be updated. */
export type CachedUserPatch = {
  avatarUrl?: InputMaybe<Scalars['String']>;
  discriminator?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['BigInt']>;
  lastChecked?: InputMaybe<Scalars['Datetime']>;
  name?: InputMaybe<Scalars['String']>;
};

/** A `CachedUser` edge in the connection. */
export type CachedUsersEdge = {
  __typename?: 'CachedUsersEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `CachedUser` at the end of the edge. */
  node: CachedUser;
};

/** Methods to use when ordering `CachedUser`. */
export enum CachedUsersOrderBy {
  AvatarUrlAsc = 'AVATAR_URL_ASC',
  AvatarUrlDesc = 'AVATAR_URL_DESC',
  DiscriminatorAsc = 'DISCRIMINATOR_ASC',
  DiscriminatorDesc = 'DISCRIMINATOR_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  LastCheckedAsc = 'LAST_CHECKED_ASC',
  LastCheckedDesc = 'LAST_CHECKED_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** All input for the create `BotStat` mutation. */
export type CreateBotStatInput = {
  /** The `BotStat` to be created by this mutation. */
  botStat: BotStatInput;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
};

/** The output of our create `BotStat` mutation. */
export type CreateBotStatPayload = {
  __typename?: 'CreateBotStatPayload';
  /** The `BotStat` that was created by this mutation. */
  botStat?: Maybe<BotStat>;
  /** An edge for our `BotStat`. May be used by Relay 1. */
  botStatEdge?: Maybe<BotStatsEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `BotStat` mutation. */
export type CreateBotStatPayloadBotStatEdgeArgs = {
  orderBy?: InputMaybe<Array<BotStatsOrderBy>>;
};

/** All input for the create `CachedGuild` mutation. */
export type CreateCachedGuildInput = {
  /** The `CachedGuild` to be created by this mutation. */
  cachedGuild: CachedGuildInput;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
};

/** The output of our create `CachedGuild` mutation. */
export type CreateCachedGuildPayload = {
  __typename?: 'CreateCachedGuildPayload';
  /** The `CachedGuild` that was created by this mutation. */
  cachedGuild?: Maybe<CachedGuild>;
  /** An edge for our `CachedGuild`. May be used by Relay 1. */
  cachedGuildEdge?: Maybe<CachedGuildsEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `CachedGuild` mutation. */
export type CreateCachedGuildPayloadCachedGuildEdgeArgs = {
  orderBy?: InputMaybe<Array<CachedGuildsOrderBy>>;
};

/** All input for the create `CachedUser` mutation. */
export type CreateCachedUserInput = {
  /** The `CachedUser` to be created by this mutation. */
  cachedUser: CachedUserInput;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
};

/** The output of our create `CachedUser` mutation. */
export type CreateCachedUserPayload = {
  __typename?: 'CreateCachedUserPayload';
  /** The `CachedUser` that was created by this mutation. */
  cachedUser?: Maybe<CachedUser>;
  /** An edge for our `CachedUser`. May be used by Relay 1. */
  cachedUserEdge?: Maybe<CachedUsersEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `CachedUser` mutation. */
export type CreateCachedUserPayloadCachedUserEdgeArgs = {
  orderBy?: InputMaybe<Array<CachedUsersOrderBy>>;
};

/** All input for the create `Feed` mutation. */
export type CreateFeedInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `Feed` to be created by this mutation. */
  feed: FeedInput;
};

/** All input for the create `FeedItem` mutation. */
export type CreateFeedItemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `FeedItem` to be created by this mutation. */
  feedItem: FeedItemInput;
};

/** The output of our create `FeedItem` mutation. */
export type CreateFeedItemPayload = {
  __typename?: 'CreateFeedItemPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `FeedItem` that was created by this mutation. */
  feedItem?: Maybe<FeedItem>;
  /** An edge for our `FeedItem`. May be used by Relay 1. */
  feedItemEdge?: Maybe<FeedItemsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `FeedItem` mutation. */
export type CreateFeedItemPayloadFeedItemEdgeArgs = {
  orderBy?: InputMaybe<Array<FeedItemsOrderBy>>;
};

/** The output of our create `Feed` mutation. */
export type CreateFeedPayload = {
  __typename?: 'CreateFeedPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Feed` that was created by this mutation. */
  feed?: Maybe<Feed>;
  /** An edge for our `Feed`. May be used by Relay 1. */
  feedEdge?: Maybe<FeedsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `Feed` mutation. */
export type CreateFeedPayloadFeedEdgeArgs = {
  orderBy?: InputMaybe<Array<FeedsOrderBy>>;
};

/** All input for the create `FeedSubscription` mutation. */
export type CreateFeedSubscriptionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `FeedSubscription` to be created by this mutation. */
  feedSubscription: FeedSubscriptionInput;
};

/** The output of our create `FeedSubscription` mutation. */
export type CreateFeedSubscriptionPayload = {
  __typename?: 'CreateFeedSubscriptionPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Feed` that is related to this `FeedSubscription`. */
  feedByFeedId?: Maybe<Feed>;
  /** The `FeedSubscription` that was created by this mutation. */
  feedSubscription?: Maybe<FeedSubscription>;
  /** An edge for our `FeedSubscription`. May be used by Relay 1. */
  feedSubscriptionEdge?: Maybe<FeedSubscriptionsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `FeedSubscription` mutation. */
export type CreateFeedSubscriptionPayloadFeedSubscriptionEdgeArgs = {
  orderBy?: InputMaybe<Array<FeedSubscriptionsOrderBy>>;
};

/** All input for the create `GuildBan` mutation. */
export type CreateGuildBanInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `GuildBan` to be created by this mutation. */
  guildBan: GuildBanInput;
};

/** The output of our create `GuildBan` mutation. */
export type CreateGuildBanPayload = {
  __typename?: 'CreateGuildBanPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `GuildBan` that was created by this mutation. */
  guildBan?: Maybe<GuildBan>;
  /** An edge for our `GuildBan`. May be used by Relay 1. */
  guildBanEdge?: Maybe<GuildBansEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `GuildBan` mutation. */
export type CreateGuildBanPayloadGuildBanEdgeArgs = {
  orderBy?: InputMaybe<Array<GuildBansOrderBy>>;
};

/** All input for the create `GuildConfig` mutation. */
export type CreateGuildConfigInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `GuildConfig` to be created by this mutation. */
  guildConfig: GuildConfigInput;
};

/** The output of our create `GuildConfig` mutation. */
export type CreateGuildConfigPayload = {
  __typename?: 'CreateGuildConfigPayload';
  /** Reads a single `CachedGuild` that is related to this `GuildConfig`. */
  cachedGuildById?: Maybe<CachedGuild>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `GuildConfig` that was created by this mutation. */
  guildConfig?: Maybe<GuildConfig>;
  /** An edge for our `GuildConfig`. May be used by Relay 1. */
  guildConfigEdge?: Maybe<GuildConfigsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `GuildConfig` mutation. */
export type CreateGuildConfigPayloadGuildConfigEdgeArgs = {
  orderBy?: InputMaybe<Array<GuildConfigsOrderBy>>;
};

/** All input for the create `Member` mutation. */
export type CreateMemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `Member` to be created by this mutation. */
  member: MemberInput;
};

/** The output of our create `Member` mutation. */
export type CreateMemberPayload = {
  __typename?: 'CreateMemberPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Member` that was created by this mutation. */
  member?: Maybe<Member>;
  /** An edge for our `Member`. May be used by Relay 1. */
  memberEdge?: Maybe<MembersEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `Member` mutation. */
export type CreateMemberPayloadMemberEdgeArgs = {
  orderBy?: InputMaybe<Array<MembersOrderBy>>;
};

/** All input for the create `Message` mutation. */
export type CreateMessageInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `Message` to be created by this mutation. */
  message: MessageInput;
};

/** The output of our create `Message` mutation. */
export type CreateMessagePayload = {
  __typename?: 'CreateMessagePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Message` that was created by this mutation. */
  message?: Maybe<Message>;
  /** An edge for our `Message`. May be used by Relay 1. */
  messageEdge?: Maybe<MessagesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `Message` mutation. */
export type CreateMessagePayloadMessageEdgeArgs = {
  orderBy?: InputMaybe<Array<MessagesOrderBy>>;
};

/** All input for the create `ModLog` mutation. */
export type CreateModLogInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `ModLog` to be created by this mutation. */
  modLog: ModLogInput;
};

/** The output of our create `ModLog` mutation. */
export type CreateModLogPayload = {
  __typename?: 'CreateModLogPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ModLog` that was created by this mutation. */
  modLog?: Maybe<ModLog>;
  /** An edge for our `ModLog`. May be used by Relay 1. */
  modLogEdge?: Maybe<ModLogsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `ModLog` mutation. */
export type CreateModLogPayloadModLogEdgeArgs = {
  orderBy?: InputMaybe<Array<ModLogsOrderBy>>;
};

/** All input for the create `Mute` mutation. */
export type CreateMuteInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `Mute` to be created by this mutation. */
  mute: MuteInput;
};

/** The output of our create `Mute` mutation. */
export type CreateMutePayload = {
  __typename?: 'CreateMutePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `ModLog` that is related to this `Mute`. */
  modLogByGuildIdAndCaseId?: Maybe<ModLog>;
  /** The `Mute` that was created by this mutation. */
  mute?: Maybe<Mute>;
  /** An edge for our `Mute`. May be used by Relay 1. */
  muteEdge?: Maybe<MutesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `Mute` mutation. */
export type CreateMutePayloadMuteEdgeArgs = {
  orderBy?: InputMaybe<Array<MutesOrderBy>>;
};

/** All input for the create `Notification` mutation. */
export type CreateNotificationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `Notification` to be created by this mutation. */
  notification: NotificationInput;
};

/** The output of our create `Notification` mutation. */
export type CreateNotificationPayload = {
  __typename?: 'CreateNotificationPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Notification` that was created by this mutation. */
  notification?: Maybe<Notification>;
  /** An edge for our `Notification`. May be used by Relay 1. */
  notificationEdge?: Maybe<NotificationsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `Notification` mutation. */
export type CreateNotificationPayloadNotificationEdgeArgs = {
  orderBy?: InputMaybe<Array<NotificationsOrderBy>>;
};

/** All input for the create `Reminder` mutation. */
export type CreateReminderInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `Reminder` to be created by this mutation. */
  reminder: ReminderInput;
};

/** The output of our create `Reminder` mutation. */
export type CreateReminderPayload = {
  __typename?: 'CreateReminderPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Reminder` that was created by this mutation. */
  reminder?: Maybe<Reminder>;
  /** An edge for our `Reminder`. May be used by Relay 1. */
  reminderEdge?: Maybe<RemindersEdge>;
};


/** The output of our create `Reminder` mutation. */
export type CreateReminderPayloadReminderEdgeArgs = {
  orderBy?: InputMaybe<Array<RemindersOrderBy>>;
};

/** All input for the create `RoleMenu` mutation. */
export type CreateRoleMenuInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `RoleMenu` to be created by this mutation. */
  roleMenu: RoleMenuInput;
};

/** The output of our create `RoleMenu` mutation. */
export type CreateRoleMenuPayload = {
  __typename?: 'CreateRoleMenuPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `RoleMenu` that was created by this mutation. */
  roleMenu?: Maybe<RoleMenu>;
  /** An edge for our `RoleMenu`. May be used by Relay 1. */
  roleMenuEdge?: Maybe<RoleMenusEdge>;
};


/** The output of our create `RoleMenu` mutation. */
export type CreateRoleMenuPayloadRoleMenuEdgeArgs = {
  orderBy?: InputMaybe<Array<RoleMenusOrderBy>>;
};

/** All input for the create `Tag` mutation. */
export type CreateTagInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `Tag` to be created by this mutation. */
  tag: TagInput;
};

/** The output of our create `Tag` mutation. */
export type CreateTagPayload = {
  __typename?: 'CreateTagPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Tag` that was created by this mutation. */
  tag?: Maybe<Tag>;
  /** An edge for our `Tag`. May be used by Relay 1. */
  tagEdge?: Maybe<TagsEdge>;
};


/** The output of our create `Tag` mutation. */
export type CreateTagPayloadTagEdgeArgs = {
  orderBy?: InputMaybe<Array<TagsOrderBy>>;
};

/** All input for the create `User` mutation. */
export type CreateUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `User` to be created by this mutation. */
  user: UserInput;
};

/** All input for the create `UserLevel` mutation. */
export type CreateUserLevelInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `UserLevel` to be created by this mutation. */
  userLevel: UserLevelInput;
};

/** The output of our create `UserLevel` mutation. */
export type CreateUserLevelPayload = {
  __typename?: 'CreateUserLevelPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `UserLevel` that was created by this mutation. */
  userLevel?: Maybe<UserLevel>;
  /** An edge for our `UserLevel`. May be used by Relay 1. */
  userLevelEdge?: Maybe<UserLevelsEdge>;
};


/** The output of our create `UserLevel` mutation. */
export type CreateUserLevelPayloadUserLevelEdgeArgs = {
  orderBy?: InputMaybe<Array<UserLevelsOrderBy>>;
};

/** The output of our create `User` mutation. */
export type CreateUserPayload = {
  __typename?: 'CreateUserPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `User` that was created by this mutation. */
  user?: Maybe<User>;
  /** An edge for our `User`. May be used by Relay 1. */
  userEdge?: Maybe<UsersEdge>;
};


/** The output of our create `User` mutation. */
export type CreateUserPayloadUserEdgeArgs = {
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
};

/** All input for the create `WebUserGuild` mutation. */
export type CreateWebUserGuildInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `WebUserGuild` to be created by this mutation. */
  webUserGuild: WebUserGuildInput;
};

/** The output of our create `WebUserGuild` mutation. */
export type CreateWebUserGuildPayload = {
  __typename?: 'CreateWebUserGuildPayload';
  /** Reads a single `CachedGuild` that is related to this `WebUserGuild`. */
  cachedGuildByGuildId?: Maybe<CachedGuild>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `WebUser` that is related to this `WebUserGuild`. */
  webUserByUserId?: Maybe<WebUser>;
  /** The `WebUserGuild` that was created by this mutation. */
  webUserGuild?: Maybe<WebUserGuild>;
  /** An edge for our `WebUserGuild`. May be used by Relay 1. */
  webUserGuildEdge?: Maybe<WebUserGuildsEdge>;
};


/** The output of our create `WebUserGuild` mutation. */
export type CreateWebUserGuildPayloadWebUserGuildEdgeArgs = {
  orderBy?: InputMaybe<Array<WebUserGuildsOrderBy>>;
};

/** All input for the create `WebUser` mutation. */
export type CreateWebUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `WebUser` to be created by this mutation. */
  webUser: WebUserInput;
};

/** The output of our create `WebUser` mutation. */
export type CreateWebUserPayload = {
  __typename?: 'CreateWebUserPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `WebUser` that was created by this mutation. */
  webUser?: Maybe<WebUser>;
  /** An edge for our `WebUser`. May be used by Relay 1. */
  webUserEdge?: Maybe<WebUsersEdge>;
};


/** The output of our create `WebUser` mutation. */
export type CreateWebUserPayloadWebUserEdgeArgs = {
  orderBy?: InputMaybe<Array<WebUsersOrderBy>>;
};

/** A `BigInt` edge in the connection. */
export type CurrentUserManagedGuildIdEdge = {
  __typename?: 'CurrentUserManagedGuildIdEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `BigInt` at the end of the edge. */
  node?: Maybe<Scalars['BigInt']>;
};

/** A connection to a list of `BigInt` values. */
export type CurrentUserManagedGuildIdsConnection = {
  __typename?: 'CurrentUserManagedGuildIdsConnection';
  /** A list of edges which contains the `BigInt` and cursor to aid in pagination. */
  edges: Array<CurrentUserManagedGuildIdEdge>;
  /** A list of `BigInt` objects. */
  nodes: Array<Maybe<Scalars['BigInt']>>;
  /** The count of *all* `BigInt` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** All input for the `deleteBotStatByNameAndCategory` mutation. */
export type DeleteBotStatByNameAndCategoryInput = {
  category: Scalars['String'];
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

/** All input for the `deleteBotStat` mutation. */
export type DeleteBotStatInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `BotStat` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `BotStat` mutation. */
export type DeleteBotStatPayload = {
  __typename?: 'DeleteBotStatPayload';
  /** The `BotStat` that was deleted by this mutation. */
  botStat?: Maybe<BotStat>;
  /** An edge for our `BotStat`. May be used by Relay 1. */
  botStatEdge?: Maybe<BotStatsEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedBotStatId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `BotStat` mutation. */
export type DeleteBotStatPayloadBotStatEdgeArgs = {
  orderBy?: InputMaybe<Array<BotStatsOrderBy>>;
};

/** All input for the `deleteCachedGuildById` mutation. */
export type DeleteCachedGuildByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['BigInt'];
};

/** All input for the `deleteCachedGuild` mutation. */
export type DeleteCachedGuildInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `CachedGuild` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `CachedGuild` mutation. */
export type DeleteCachedGuildPayload = {
  __typename?: 'DeleteCachedGuildPayload';
  /** The `CachedGuild` that was deleted by this mutation. */
  cachedGuild?: Maybe<CachedGuild>;
  /** An edge for our `CachedGuild`. May be used by Relay 1. */
  cachedGuildEdge?: Maybe<CachedGuildsEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedCachedGuildId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `CachedGuild` mutation. */
export type DeleteCachedGuildPayloadCachedGuildEdgeArgs = {
  orderBy?: InputMaybe<Array<CachedGuildsOrderBy>>;
};

/** All input for the `deleteCachedUserById` mutation. */
export type DeleteCachedUserByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['BigInt'];
};

/** All input for the `deleteCachedUser` mutation. */
export type DeleteCachedUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `CachedUser` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `CachedUser` mutation. */
export type DeleteCachedUserPayload = {
  __typename?: 'DeleteCachedUserPayload';
  /** The `CachedUser` that was deleted by this mutation. */
  cachedUser?: Maybe<CachedUser>;
  /** An edge for our `CachedUser`. May be used by Relay 1. */
  cachedUserEdge?: Maybe<CachedUsersEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedCachedUserId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `CachedUser` mutation. */
export type DeleteCachedUserPayloadCachedUserEdgeArgs = {
  orderBy?: InputMaybe<Array<CachedUsersOrderBy>>;
};

/** All input for the `deleteFeedByFeedId` mutation. */
export type DeleteFeedByFeedIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  feedId: Scalars['String'];
};

/** All input for the `deleteFeed` mutation. */
export type DeleteFeedInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Feed` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deleteFeedItemByFeedIdAndItemId` mutation. */
export type DeleteFeedItemByFeedIdAndItemIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  feedId: Scalars['String'];
  itemId: Scalars['String'];
};

/** All input for the `deleteFeedItem` mutation. */
export type DeleteFeedItemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `FeedItem` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `FeedItem` mutation. */
export type DeleteFeedItemPayload = {
  __typename?: 'DeleteFeedItemPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedFeedItemId?: Maybe<Scalars['ID']>;
  /** The `FeedItem` that was deleted by this mutation. */
  feedItem?: Maybe<FeedItem>;
  /** An edge for our `FeedItem`. May be used by Relay 1. */
  feedItemEdge?: Maybe<FeedItemsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `FeedItem` mutation. */
export type DeleteFeedItemPayloadFeedItemEdgeArgs = {
  orderBy?: InputMaybe<Array<FeedItemsOrderBy>>;
};

/** The output of our delete `Feed` mutation. */
export type DeleteFeedPayload = {
  __typename?: 'DeleteFeedPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedFeedId?: Maybe<Scalars['ID']>;
  /** The `Feed` that was deleted by this mutation. */
  feed?: Maybe<Feed>;
  /** An edge for our `Feed`. May be used by Relay 1. */
  feedEdge?: Maybe<FeedsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `Feed` mutation. */
export type DeleteFeedPayloadFeedEdgeArgs = {
  orderBy?: InputMaybe<Array<FeedsOrderBy>>;
};

/** All input for the `deleteFeedSubscriptionByFeedIdAndChannelId` mutation. */
export type DeleteFeedSubscriptionByFeedIdAndChannelIdInput = {
  channelId: Scalars['BigInt'];
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  feedId: Scalars['String'];
};

/** All input for the `deleteFeedSubscription` mutation. */
export type DeleteFeedSubscriptionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `FeedSubscription` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `FeedSubscription` mutation. */
export type DeleteFeedSubscriptionPayload = {
  __typename?: 'DeleteFeedSubscriptionPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedFeedSubscriptionId?: Maybe<Scalars['ID']>;
  /** Reads a single `Feed` that is related to this `FeedSubscription`. */
  feedByFeedId?: Maybe<Feed>;
  /** The `FeedSubscription` that was deleted by this mutation. */
  feedSubscription?: Maybe<FeedSubscription>;
  /** An edge for our `FeedSubscription`. May be used by Relay 1. */
  feedSubscriptionEdge?: Maybe<FeedSubscriptionsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `FeedSubscription` mutation. */
export type DeleteFeedSubscriptionPayloadFeedSubscriptionEdgeArgs = {
  orderBy?: InputMaybe<Array<FeedSubscriptionsOrderBy>>;
};

/** All input for the `deleteGuildBanByGuildIdAndUserId` mutation. */
export type DeleteGuildBanByGuildIdAndUserIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  guildId: Scalars['BigInt'];
  userId: Scalars['BigInt'];
};

/** All input for the `deleteGuildBan` mutation. */
export type DeleteGuildBanInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `GuildBan` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `GuildBan` mutation. */
export type DeleteGuildBanPayload = {
  __typename?: 'DeleteGuildBanPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedGuildBanId?: Maybe<Scalars['ID']>;
  /** The `GuildBan` that was deleted by this mutation. */
  guildBan?: Maybe<GuildBan>;
  /** An edge for our `GuildBan`. May be used by Relay 1. */
  guildBanEdge?: Maybe<GuildBansEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `GuildBan` mutation. */
export type DeleteGuildBanPayloadGuildBanEdgeArgs = {
  orderBy?: InputMaybe<Array<GuildBansOrderBy>>;
};

/** All input for the `deleteGuildConfigById` mutation. */
export type DeleteGuildConfigByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['BigInt'];
};

/** All input for the `deleteGuildConfig` mutation. */
export type DeleteGuildConfigInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `GuildConfig` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `GuildConfig` mutation. */
export type DeleteGuildConfigPayload = {
  __typename?: 'DeleteGuildConfigPayload';
  /** Reads a single `CachedGuild` that is related to this `GuildConfig`. */
  cachedGuildById?: Maybe<CachedGuild>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedGuildConfigId?: Maybe<Scalars['ID']>;
  /** The `GuildConfig` that was deleted by this mutation. */
  guildConfig?: Maybe<GuildConfig>;
  /** An edge for our `GuildConfig`. May be used by Relay 1. */
  guildConfigEdge?: Maybe<GuildConfigsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `GuildConfig` mutation. */
export type DeleteGuildConfigPayloadGuildConfigEdgeArgs = {
  orderBy?: InputMaybe<Array<GuildConfigsOrderBy>>;
};

/** All input for the `deleteMemberByGuildIdAndUserId` mutation. */
export type DeleteMemberByGuildIdAndUserIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  guildId: Scalars['BigInt'];
  userId: Scalars['BigInt'];
};

/** All input for the `deleteMember` mutation. */
export type DeleteMemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Member` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `Member` mutation. */
export type DeleteMemberPayload = {
  __typename?: 'DeleteMemberPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedMemberId?: Maybe<Scalars['ID']>;
  /** The `Member` that was deleted by this mutation. */
  member?: Maybe<Member>;
  /** An edge for our `Member`. May be used by Relay 1. */
  memberEdge?: Maybe<MembersEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `Member` mutation. */
export type DeleteMemberPayloadMemberEdgeArgs = {
  orderBy?: InputMaybe<Array<MembersOrderBy>>;
};

/** All input for the `deleteModLogByGuildIdAndCaseId` mutation. */
export type DeleteModLogByGuildIdAndCaseIdInput = {
  caseId: Scalars['BigInt'];
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  guildId: Scalars['BigInt'];
};

/** All input for the `deleteModLog` mutation. */
export type DeleteModLogInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `ModLog` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `ModLog` mutation. */
export type DeleteModLogPayload = {
  __typename?: 'DeleteModLogPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedModLogId?: Maybe<Scalars['ID']>;
  /** The `ModLog` that was deleted by this mutation. */
  modLog?: Maybe<ModLog>;
  /** An edge for our `ModLog`. May be used by Relay 1. */
  modLogEdge?: Maybe<ModLogsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `ModLog` mutation. */
export type DeleteModLogPayloadModLogEdgeArgs = {
  orderBy?: InputMaybe<Array<ModLogsOrderBy>>;
};

/** All input for the `deleteMuteByGuildIdAndUserId` mutation. */
export type DeleteMuteByGuildIdAndUserIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  guildId: Scalars['BigInt'];
  userId: Scalars['BigInt'];
};

/** All input for the `deleteMute` mutation. */
export type DeleteMuteInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Mute` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `Mute` mutation. */
export type DeleteMutePayload = {
  __typename?: 'DeleteMutePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedMuteId?: Maybe<Scalars['ID']>;
  /** Reads a single `ModLog` that is related to this `Mute`. */
  modLogByGuildIdAndCaseId?: Maybe<ModLog>;
  /** The `Mute` that was deleted by this mutation. */
  mute?: Maybe<Mute>;
  /** An edge for our `Mute`. May be used by Relay 1. */
  muteEdge?: Maybe<MutesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `Mute` mutation. */
export type DeleteMutePayloadMuteEdgeArgs = {
  orderBy?: InputMaybe<Array<MutesOrderBy>>;
};

/** All input for the `deleteNotificationByUserIdAndGuildIdAndKeyword` mutation. */
export type DeleteNotificationByUserIdAndGuildIdAndKeywordInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  guildId: Scalars['BigInt'];
  keyword: Scalars['String'];
  userId: Scalars['BigInt'];
};

/** All input for the `deleteNotification` mutation. */
export type DeleteNotificationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Notification` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `Notification` mutation. */
export type DeleteNotificationPayload = {
  __typename?: 'DeleteNotificationPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedNotificationId?: Maybe<Scalars['ID']>;
  /** The `Notification` that was deleted by this mutation. */
  notification?: Maybe<Notification>;
  /** An edge for our `Notification`. May be used by Relay 1. */
  notificationEdge?: Maybe<NotificationsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `Notification` mutation. */
export type DeleteNotificationPayloadNotificationEdgeArgs = {
  orderBy?: InputMaybe<Array<NotificationsOrderBy>>;
};

/** All input for the `deleteReminderByUserIdAndSetAt` mutation. */
export type DeleteReminderByUserIdAndSetAtInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  setAt: Scalars['Datetime'];
  userId: Scalars['BigInt'];
};

/** All input for the `deleteReminder` mutation. */
export type DeleteReminderInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Reminder` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `Reminder` mutation. */
export type DeleteReminderPayload = {
  __typename?: 'DeleteReminderPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedReminderId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Reminder` that was deleted by this mutation. */
  reminder?: Maybe<Reminder>;
  /** An edge for our `Reminder`. May be used by Relay 1. */
  reminderEdge?: Maybe<RemindersEdge>;
};


/** The output of our delete `Reminder` mutation. */
export type DeleteReminderPayloadReminderEdgeArgs = {
  orderBy?: InputMaybe<Array<RemindersOrderBy>>;
};

/** All input for the `deleteRoleMenuByMessageId` mutation. */
export type DeleteRoleMenuByMessageIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  messageId: Scalars['BigInt'];
};

/** All input for the `deleteRoleMenu` mutation. */
export type DeleteRoleMenuInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `RoleMenu` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `RoleMenu` mutation. */
export type DeleteRoleMenuPayload = {
  __typename?: 'DeleteRoleMenuPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedRoleMenuId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `RoleMenu` that was deleted by this mutation. */
  roleMenu?: Maybe<RoleMenu>;
  /** An edge for our `RoleMenu`. May be used by Relay 1. */
  roleMenuEdge?: Maybe<RoleMenusEdge>;
};


/** The output of our delete `RoleMenu` mutation. */
export type DeleteRoleMenuPayloadRoleMenuEdgeArgs = {
  orderBy?: InputMaybe<Array<RoleMenusOrderBy>>;
};

/** All input for the `deleteTagByGuildIdAndTagName` mutation. */
export type DeleteTagByGuildIdAndTagNameInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  guildId: Scalars['BigInt'];
  tagName: Scalars['String'];
};

/** All input for the `deleteTag` mutation. */
export type DeleteTagInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Tag` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `Tag` mutation. */
export type DeleteTagPayload = {
  __typename?: 'DeleteTagPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedTagId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Tag` that was deleted by this mutation. */
  tag?: Maybe<Tag>;
  /** An edge for our `Tag`. May be used by Relay 1. */
  tagEdge?: Maybe<TagsEdge>;
};


/** The output of our delete `Tag` mutation. */
export type DeleteTagPayloadTagEdgeArgs = {
  orderBy?: InputMaybe<Array<TagsOrderBy>>;
};

/** All input for the `deleteUserById` mutation. */
export type DeleteUserByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['BigInt'];
};

/** All input for the `deleteUser` mutation. */
export type DeleteUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `User` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deleteUserLevelByUserIdAndGuildId` mutation. */
export type DeleteUserLevelByUserIdAndGuildIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  guildId: Scalars['BigInt'];
  userId: Scalars['BigInt'];
};

/** All input for the `deleteUserLevel` mutation. */
export type DeleteUserLevelInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `UserLevel` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `UserLevel` mutation. */
export type DeleteUserLevelPayload = {
  __typename?: 'DeleteUserLevelPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedUserLevelId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `UserLevel` that was deleted by this mutation. */
  userLevel?: Maybe<UserLevel>;
  /** An edge for our `UserLevel`. May be used by Relay 1. */
  userLevelEdge?: Maybe<UserLevelsEdge>;
};


/** The output of our delete `UserLevel` mutation. */
export type DeleteUserLevelPayloadUserLevelEdgeArgs = {
  orderBy?: InputMaybe<Array<UserLevelsOrderBy>>;
};

/** The output of our delete `User` mutation. */
export type DeleteUserPayload = {
  __typename?: 'DeleteUserPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedUserId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `User` that was deleted by this mutation. */
  user?: Maybe<User>;
  /** An edge for our `User`. May be used by Relay 1. */
  userEdge?: Maybe<UsersEdge>;
};


/** The output of our delete `User` mutation. */
export type DeleteUserPayloadUserEdgeArgs = {
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
};

/** All input for the `deleteWebUserById` mutation. */
export type DeleteWebUserByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Unique identifier for the user. This should match their Discord ID. */
  id: Scalars['BigInt'];
};

/** All input for the `deleteWebUserGuildByUserIdAndGuildId` mutation. */
export type DeleteWebUserGuildByUserIdAndGuildIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  guildId: Scalars['BigInt'];
  userId: Scalars['BigInt'];
};

/** All input for the `deleteWebUserGuild` mutation. */
export type DeleteWebUserGuildInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `WebUserGuild` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `WebUserGuild` mutation. */
export type DeleteWebUserGuildPayload = {
  __typename?: 'DeleteWebUserGuildPayload';
  /** Reads a single `CachedGuild` that is related to this `WebUserGuild`. */
  cachedGuildByGuildId?: Maybe<CachedGuild>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedWebUserGuildId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `WebUser` that is related to this `WebUserGuild`. */
  webUserByUserId?: Maybe<WebUser>;
  /** The `WebUserGuild` that was deleted by this mutation. */
  webUserGuild?: Maybe<WebUserGuild>;
  /** An edge for our `WebUserGuild`. May be used by Relay 1. */
  webUserGuildEdge?: Maybe<WebUserGuildsEdge>;
};


/** The output of our delete `WebUserGuild` mutation. */
export type DeleteWebUserGuildPayloadWebUserGuildEdgeArgs = {
  orderBy?: InputMaybe<Array<WebUserGuildsOrderBy>>;
};

/** All input for the `deleteWebUser` mutation. */
export type DeleteWebUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `WebUser` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `WebUser` mutation. */
export type DeleteWebUserPayload = {
  __typename?: 'DeleteWebUserPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedWebUserId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `WebUser` that was deleted by this mutation. */
  webUser?: Maybe<WebUser>;
  /** An edge for our `WebUser`. May be used by Relay 1. */
  webUserEdge?: Maybe<WebUsersEdge>;
};


/** The output of our delete `WebUser` mutation. */
export type DeleteWebUserPayloadWebUserEdgeArgs = {
  orderBy?: InputMaybe<Array<WebUsersOrderBy>>;
};

export type Feed = Node & {
  __typename?: 'Feed';
  feedId: Scalars['String'];
  /** Reads and enables pagination through a set of `FeedSubscription`. */
  feedSubscriptionsByFeedId: FeedSubscriptionsConnection;
  metadata?: Maybe<Scalars['JSON']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
};


export type FeedFeedSubscriptionsByFeedIdArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<FeedSubscriptionCondition>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<FeedSubscriptionsOrderBy>>;
};

/** A condition to be used against `Feed` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type FeedCondition = {
  /** Checks for equality with the object’s `feedId` field. */
  feedId?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `metadata` field. */
  metadata?: InputMaybe<Scalars['JSON']>;
};

/** An input for mutations affecting `Feed` */
export type FeedInput = {
  feedId: Scalars['String'];
  metadata?: InputMaybe<Scalars['JSON']>;
};

export type FeedItem = Node & {
  __typename?: 'FeedItem';
  feedId: Scalars['String'];
  itemId: Scalars['String'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
};

/**
 * A condition to be used against `FeedItem` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type FeedItemCondition = {
  /** Checks for equality with the object’s `feedId` field. */
  feedId?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `itemId` field. */
  itemId?: InputMaybe<Scalars['String']>;
};

/** An input for mutations affecting `FeedItem` */
export type FeedItemInput = {
  feedId: Scalars['String'];
  itemId: Scalars['String'];
};

/** Represents an update to a `FeedItem`. Fields that are set will be updated. */
export type FeedItemPatch = {
  feedId?: InputMaybe<Scalars['String']>;
  itemId?: InputMaybe<Scalars['String']>;
};

/** A connection to a list of `FeedItem` values. */
export type FeedItemsConnection = {
  __typename?: 'FeedItemsConnection';
  /** A list of edges which contains the `FeedItem` and cursor to aid in pagination. */
  edges: Array<FeedItemsEdge>;
  /** A list of `FeedItem` objects. */
  nodes: Array<FeedItem>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `FeedItem` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `FeedItem` edge in the connection. */
export type FeedItemsEdge = {
  __typename?: 'FeedItemsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `FeedItem` at the end of the edge. */
  node: FeedItem;
};

/** Methods to use when ordering `FeedItem`. */
export enum FeedItemsOrderBy {
  FeedIdAsc = 'FEED_ID_ASC',
  FeedIdDesc = 'FEED_ID_DESC',
  ItemIdAsc = 'ITEM_ID_ASC',
  ItemIdDesc = 'ITEM_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** Represents an update to a `Feed`. Fields that are set will be updated. */
export type FeedPatch = {
  feedId?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Scalars['JSON']>;
};

export type FeedSubscription = Node & {
  __typename?: 'FeedSubscription';
  channelId: Scalars['BigInt'];
  /** Reads a single `Feed` that is related to this `FeedSubscription`. */
  feedByFeedId?: Maybe<Feed>;
  feedId: Scalars['String'];
  guildId: Scalars['BigInt'];
  mentionRole?: Maybe<Scalars['BigInt']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
};

/**
 * A condition to be used against `FeedSubscription` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type FeedSubscriptionCondition = {
  /** Checks for equality with the object’s `channelId` field. */
  channelId?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `feedId` field. */
  feedId?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `guildId` field. */
  guildId?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `mentionRole` field. */
  mentionRole?: InputMaybe<Scalars['BigInt']>;
};

/** An input for mutations affecting `FeedSubscription` */
export type FeedSubscriptionInput = {
  channelId: Scalars['BigInt'];
  feedId: Scalars['String'];
  guildId: Scalars['BigInt'];
  mentionRole?: InputMaybe<Scalars['BigInt']>;
};

/** Represents an update to a `FeedSubscription`. Fields that are set will be updated. */
export type FeedSubscriptionPatch = {
  channelId?: InputMaybe<Scalars['BigInt']>;
  feedId?: InputMaybe<Scalars['String']>;
  guildId?: InputMaybe<Scalars['BigInt']>;
  mentionRole?: InputMaybe<Scalars['BigInt']>;
};

/** A connection to a list of `FeedSubscription` values. */
export type FeedSubscriptionsConnection = {
  __typename?: 'FeedSubscriptionsConnection';
  /** A list of edges which contains the `FeedSubscription` and cursor to aid in pagination. */
  edges: Array<FeedSubscriptionsEdge>;
  /** A list of `FeedSubscription` objects. */
  nodes: Array<FeedSubscription>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `FeedSubscription` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `FeedSubscription` edge in the connection. */
export type FeedSubscriptionsEdge = {
  __typename?: 'FeedSubscriptionsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `FeedSubscription` at the end of the edge. */
  node: FeedSubscription;
};

/** Methods to use when ordering `FeedSubscription`. */
export enum FeedSubscriptionsOrderBy {
  ChannelIdAsc = 'CHANNEL_ID_ASC',
  ChannelIdDesc = 'CHANNEL_ID_DESC',
  FeedIdAsc = 'FEED_ID_ASC',
  FeedIdDesc = 'FEED_ID_DESC',
  GuildIdAsc = 'GUILD_ID_ASC',
  GuildIdDesc = 'GUILD_ID_DESC',
  MentionRoleAsc = 'MENTION_ROLE_ASC',
  MentionRoleDesc = 'MENTION_ROLE_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A connection to a list of `Feed` values. */
export type FeedsConnection = {
  __typename?: 'FeedsConnection';
  /** A list of edges which contains the `Feed` and cursor to aid in pagination. */
  edges: Array<FeedsEdge>;
  /** A list of `Feed` objects. */
  nodes: Array<Feed>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Feed` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Feed` edge in the connection. */
export type FeedsEdge = {
  __typename?: 'FeedsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Feed` at the end of the edge. */
  node: Feed;
};

/** Methods to use when ordering `Feed`. */
export enum FeedsOrderBy {
  FeedIdAsc = 'FEED_ID_ASC',
  FeedIdDesc = 'FEED_ID_DESC',
  MetadataAsc = 'METADATA_ASC',
  MetadataDesc = 'METADATA_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** All input for the `graphql` mutation. */
export type GraphqlInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  extensions?: InputMaybe<Scalars['JSON']>;
  operationName?: InputMaybe<Scalars['String']>;
  query?: InputMaybe<Scalars['String']>;
  variables?: InputMaybe<Scalars['JSON']>;
};

/** The output of our `graphql` mutation. */
export type GraphqlPayload = {
  __typename?: 'GraphqlPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  json?: Maybe<Scalars['JSON']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

export type GuildBan = Node & {
  __typename?: 'GuildBan';
  guildId: Scalars['BigInt'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  userId: Scalars['BigInt'];
};

/**
 * A condition to be used against `GuildBan` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type GuildBanCondition = {
  /** Checks for equality with the object’s `guildId` field. */
  guildId?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['BigInt']>;
};

/** An input for mutations affecting `GuildBan` */
export type GuildBanInput = {
  guildId: Scalars['BigInt'];
  userId: Scalars['BigInt'];
};

/** Represents an update to a `GuildBan`. Fields that are set will be updated. */
export type GuildBanPatch = {
  guildId?: InputMaybe<Scalars['BigInt']>;
  userId?: InputMaybe<Scalars['BigInt']>;
};

/** A connection to a list of `GuildBan` values. */
export type GuildBansConnection = {
  __typename?: 'GuildBansConnection';
  /** A list of edges which contains the `GuildBan` and cursor to aid in pagination. */
  edges: Array<GuildBansEdge>;
  /** A list of `GuildBan` objects. */
  nodes: Array<GuildBan>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `GuildBan` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `GuildBan` edge in the connection. */
export type GuildBansEdge = {
  __typename?: 'GuildBansEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `GuildBan` at the end of the edge. */
  node: GuildBan;
};

/** Methods to use when ordering `GuildBan`. */
export enum GuildBansOrderBy {
  GuildIdAsc = 'GUILD_ID_ASC',
  GuildIdDesc = 'GUILD_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC'
}

export type GuildConfig = Node & {
  __typename?: 'GuildConfig';
  /** Reads a single `CachedGuild` that is related to this `GuildConfig`. */
  cachedGuildById?: Maybe<CachedGuild>;
  data: Scalars['JSON'];
  disabledChannels?: Maybe<Array<Maybe<Scalars['BigInt']>>>;
  id: Scalars['BigInt'];
  inviteGuard: Scalars['Boolean'];
  joinMsg?: Maybe<Scalars['String']>;
  joinMsgEnabled: Scalars['Boolean'];
  joinReact?: Maybe<Scalars['String']>;
  leaveMsg?: Maybe<Scalars['String']>;
  leaveMsgEnabled: Scalars['Boolean'];
  logMember?: Maybe<Scalars['BigInt']>;
  logMemberEnabled: Scalars['Boolean'];
  logMod?: Maybe<Scalars['BigInt']>;
  logModEnabled: Scalars['Boolean'];
  logMsg?: Maybe<Scalars['BigInt']>;
  logMsgEnabled: Scalars['Boolean'];
  maxMention?: Maybe<Scalars['Int']>;
  msgChannel?: Maybe<Scalars['BigInt']>;
  muteDmEnabled: Scalars['Boolean'];
  muteDmText?: Maybe<Scalars['String']>;
  muteDuration?: Maybe<Scalars['BigInt']>;
  muteRole?: Maybe<Scalars['BigInt']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  prefix?: Maybe<Scalars['String']>;
  roleChannel?: Maybe<Scalars['BigInt']>;
  roleConfig?: Maybe<Scalars['JSON']>;
  roleEnabled: Scalars['Boolean'];
  warnDmEnabled: Scalars['Boolean'];
  warnDmText?: Maybe<Scalars['String']>;
};

/**
 * A condition to be used against `GuildConfig` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type GuildConfigCondition = {
  /** Checks for equality with the object’s `data` field. */
  data?: InputMaybe<Scalars['JSON']>;
  /** Checks for equality with the object’s `disabledChannels` field. */
  disabledChannels?: InputMaybe<Array<InputMaybe<Scalars['BigInt']>>>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `inviteGuard` field. */
  inviteGuard?: InputMaybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `joinMsg` field. */
  joinMsg?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `joinMsgEnabled` field. */
  joinMsgEnabled?: InputMaybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `joinReact` field. */
  joinReact?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `leaveMsg` field. */
  leaveMsg?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `leaveMsgEnabled` field. */
  leaveMsgEnabled?: InputMaybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `logMember` field. */
  logMember?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `logMemberEnabled` field. */
  logMemberEnabled?: InputMaybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `logMod` field. */
  logMod?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `logModEnabled` field. */
  logModEnabled?: InputMaybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `logMsg` field. */
  logMsg?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `logMsgEnabled` field. */
  logMsgEnabled?: InputMaybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `maxMention` field. */
  maxMention?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `msgChannel` field. */
  msgChannel?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `muteDmEnabled` field. */
  muteDmEnabled?: InputMaybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `muteDmText` field. */
  muteDmText?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `muteDuration` field. */
  muteDuration?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `muteRole` field. */
  muteRole?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `prefix` field. */
  prefix?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `roleChannel` field. */
  roleChannel?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `roleConfig` field. */
  roleConfig?: InputMaybe<Scalars['JSON']>;
  /** Checks for equality with the object’s `roleEnabled` field. */
  roleEnabled?: InputMaybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `warnDmEnabled` field. */
  warnDmEnabled?: InputMaybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `warnDmText` field. */
  warnDmText?: InputMaybe<Scalars['String']>;
};

/** An input for mutations affecting `GuildConfig` */
export type GuildConfigInput = {
  data?: InputMaybe<Scalars['JSON']>;
  disabledChannels?: InputMaybe<Array<InputMaybe<Scalars['BigInt']>>>;
  id: Scalars['BigInt'];
  inviteGuard?: InputMaybe<Scalars['Boolean']>;
  joinMsg?: InputMaybe<Scalars['String']>;
  joinMsgEnabled?: InputMaybe<Scalars['Boolean']>;
  joinReact?: InputMaybe<Scalars['String']>;
  leaveMsg?: InputMaybe<Scalars['String']>;
  leaveMsgEnabled?: InputMaybe<Scalars['Boolean']>;
  logMember?: InputMaybe<Scalars['BigInt']>;
  logMemberEnabled?: InputMaybe<Scalars['Boolean']>;
  logMod?: InputMaybe<Scalars['BigInt']>;
  logModEnabled?: InputMaybe<Scalars['Boolean']>;
  logMsg?: InputMaybe<Scalars['BigInt']>;
  logMsgEnabled?: InputMaybe<Scalars['Boolean']>;
  maxMention?: InputMaybe<Scalars['Int']>;
  msgChannel?: InputMaybe<Scalars['BigInt']>;
  muteDmEnabled?: InputMaybe<Scalars['Boolean']>;
  muteDmText?: InputMaybe<Scalars['String']>;
  muteDuration?: InputMaybe<Scalars['BigInt']>;
  muteRole?: InputMaybe<Scalars['BigInt']>;
  prefix?: InputMaybe<Scalars['String']>;
  roleChannel?: InputMaybe<Scalars['BigInt']>;
  roleConfig?: InputMaybe<Scalars['JSON']>;
  roleEnabled?: InputMaybe<Scalars['Boolean']>;
  warnDmEnabled?: InputMaybe<Scalars['Boolean']>;
  warnDmText?: InputMaybe<Scalars['String']>;
};

/** Represents an update to a `GuildConfig`. Fields that are set will be updated. */
export type GuildConfigPatch = {
  data?: InputMaybe<Scalars['JSON']>;
  disabledChannels?: InputMaybe<Array<InputMaybe<Scalars['BigInt']>>>;
  id?: InputMaybe<Scalars['BigInt']>;
  inviteGuard?: InputMaybe<Scalars['Boolean']>;
  joinMsg?: InputMaybe<Scalars['String']>;
  joinMsgEnabled?: InputMaybe<Scalars['Boolean']>;
  joinReact?: InputMaybe<Scalars['String']>;
  leaveMsg?: InputMaybe<Scalars['String']>;
  leaveMsgEnabled?: InputMaybe<Scalars['Boolean']>;
  logMember?: InputMaybe<Scalars['BigInt']>;
  logMemberEnabled?: InputMaybe<Scalars['Boolean']>;
  logMod?: InputMaybe<Scalars['BigInt']>;
  logModEnabled?: InputMaybe<Scalars['Boolean']>;
  logMsg?: InputMaybe<Scalars['BigInt']>;
  logMsgEnabled?: InputMaybe<Scalars['Boolean']>;
  maxMention?: InputMaybe<Scalars['Int']>;
  msgChannel?: InputMaybe<Scalars['BigInt']>;
  muteDmEnabled?: InputMaybe<Scalars['Boolean']>;
  muteDmText?: InputMaybe<Scalars['String']>;
  muteDuration?: InputMaybe<Scalars['BigInt']>;
  muteRole?: InputMaybe<Scalars['BigInt']>;
  prefix?: InputMaybe<Scalars['String']>;
  roleChannel?: InputMaybe<Scalars['BigInt']>;
  roleConfig?: InputMaybe<Scalars['JSON']>;
  roleEnabled?: InputMaybe<Scalars['Boolean']>;
  warnDmEnabled?: InputMaybe<Scalars['Boolean']>;
  warnDmText?: InputMaybe<Scalars['String']>;
};

/** A connection to a list of `GuildConfig` values. */
export type GuildConfigsConnection = {
  __typename?: 'GuildConfigsConnection';
  /** A list of edges which contains the `GuildConfig` and cursor to aid in pagination. */
  edges: Array<GuildConfigsEdge>;
  /** A list of `GuildConfig` objects. */
  nodes: Array<GuildConfig>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `GuildConfig` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `GuildConfig` edge in the connection. */
export type GuildConfigsEdge = {
  __typename?: 'GuildConfigsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `GuildConfig` at the end of the edge. */
  node: GuildConfig;
};

/** Methods to use when ordering `GuildConfig`. */
export enum GuildConfigsOrderBy {
  DataAsc = 'DATA_ASC',
  DataDesc = 'DATA_DESC',
  DisabledChannelsAsc = 'DISABLED_CHANNELS_ASC',
  DisabledChannelsDesc = 'DISABLED_CHANNELS_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  InviteGuardAsc = 'INVITE_GUARD_ASC',
  InviteGuardDesc = 'INVITE_GUARD_DESC',
  JoinMsgAsc = 'JOIN_MSG_ASC',
  JoinMsgDesc = 'JOIN_MSG_DESC',
  JoinMsgEnabledAsc = 'JOIN_MSG_ENABLED_ASC',
  JoinMsgEnabledDesc = 'JOIN_MSG_ENABLED_DESC',
  JoinReactAsc = 'JOIN_REACT_ASC',
  JoinReactDesc = 'JOIN_REACT_DESC',
  LeaveMsgAsc = 'LEAVE_MSG_ASC',
  LeaveMsgDesc = 'LEAVE_MSG_DESC',
  LeaveMsgEnabledAsc = 'LEAVE_MSG_ENABLED_ASC',
  LeaveMsgEnabledDesc = 'LEAVE_MSG_ENABLED_DESC',
  LogMemberAsc = 'LOG_MEMBER_ASC',
  LogMemberDesc = 'LOG_MEMBER_DESC',
  LogMemberEnabledAsc = 'LOG_MEMBER_ENABLED_ASC',
  LogMemberEnabledDesc = 'LOG_MEMBER_ENABLED_DESC',
  LogModAsc = 'LOG_MOD_ASC',
  LogModDesc = 'LOG_MOD_DESC',
  LogModEnabledAsc = 'LOG_MOD_ENABLED_ASC',
  LogModEnabledDesc = 'LOG_MOD_ENABLED_DESC',
  LogMsgAsc = 'LOG_MSG_ASC',
  LogMsgDesc = 'LOG_MSG_DESC',
  LogMsgEnabledAsc = 'LOG_MSG_ENABLED_ASC',
  LogMsgEnabledDesc = 'LOG_MSG_ENABLED_DESC',
  MaxMentionAsc = 'MAX_MENTION_ASC',
  MaxMentionDesc = 'MAX_MENTION_DESC',
  MsgChannelAsc = 'MSG_CHANNEL_ASC',
  MsgChannelDesc = 'MSG_CHANNEL_DESC',
  MuteDmEnabledAsc = 'MUTE_DM_ENABLED_ASC',
  MuteDmEnabledDesc = 'MUTE_DM_ENABLED_DESC',
  MuteDmTextAsc = 'MUTE_DM_TEXT_ASC',
  MuteDmTextDesc = 'MUTE_DM_TEXT_DESC',
  MuteDurationAsc = 'MUTE_DURATION_ASC',
  MuteDurationDesc = 'MUTE_DURATION_DESC',
  MuteRoleAsc = 'MUTE_ROLE_ASC',
  MuteRoleDesc = 'MUTE_ROLE_DESC',
  Natural = 'NATURAL',
  PrefixAsc = 'PREFIX_ASC',
  PrefixDesc = 'PREFIX_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RoleChannelAsc = 'ROLE_CHANNEL_ASC',
  RoleChannelDesc = 'ROLE_CHANNEL_DESC',
  RoleConfigAsc = 'ROLE_CONFIG_ASC',
  RoleConfigDesc = 'ROLE_CONFIG_DESC',
  RoleEnabledAsc = 'ROLE_ENABLED_ASC',
  RoleEnabledDesc = 'ROLE_ENABLED_DESC',
  WarnDmEnabledAsc = 'WARN_DM_ENABLED_ASC',
  WarnDmEnabledDesc = 'WARN_DM_ENABLED_DESC',
  WarnDmTextAsc = 'WARN_DM_TEXT_ASC',
  WarnDmTextDesc = 'WARN_DM_TEXT_DESC'
}

export enum LevelTimeframe {
  AllTime = 'ALL_TIME',
  Day = 'DAY',
  Month = 'MONTH',
  Week = 'WEEK'
}

/** All input for the `logout` mutation. */
export type LogoutInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
};

/** The output of our `logout` mutation. */
export type LogoutPayload = {
  __typename?: 'LogoutPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

export type Member = Node & {
  __typename?: 'Member';
  guildId: Scalars['BigInt'];
  joinTime: Scalars['Datetime'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  userId: Scalars['BigInt'];
};

/** A condition to be used against `Member` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type MemberCondition = {
  /** Checks for equality with the object’s `guildId` field. */
  guildId?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `joinTime` field. */
  joinTime?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['BigInt']>;
};

/** An input for mutations affecting `Member` */
export type MemberInput = {
  guildId: Scalars['BigInt'];
  joinTime: Scalars['Datetime'];
  userId: Scalars['BigInt'];
};

/** Represents an update to a `Member`. Fields that are set will be updated. */
export type MemberPatch = {
  guildId?: InputMaybe<Scalars['BigInt']>;
  joinTime?: InputMaybe<Scalars['Datetime']>;
  userId?: InputMaybe<Scalars['BigInt']>;
};

/** A connection to a list of `Member` values. */
export type MembersConnection = {
  __typename?: 'MembersConnection';
  /** A list of edges which contains the `Member` and cursor to aid in pagination. */
  edges: Array<MembersEdge>;
  /** A list of `Member` objects. */
  nodes: Array<Member>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Member` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Member` edge in the connection. */
export type MembersEdge = {
  __typename?: 'MembersEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Member` at the end of the edge. */
  node: Member;
};

/** Methods to use when ordering `Member`. */
export enum MembersOrderBy {
  GuildIdAsc = 'GUILD_ID_ASC',
  GuildIdDesc = 'GUILD_ID_DESC',
  JoinTimeAsc = 'JOIN_TIME_ASC',
  JoinTimeDesc = 'JOIN_TIME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC'
}

export type Message = {
  __typename?: 'Message';
  authorId: Scalars['BigInt'];
  channelId: Scalars['BigInt'];
  content: Scalars['String'];
  created: Scalars['Datetime'];
  guildId: Scalars['BigInt'];
  messageId: Scalars['BigInt'];
  msg: Scalars['JSON'];
};

/** A condition to be used against `Message` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type MessageCondition = {
  /** Checks for equality with the object’s `authorId` field. */
  authorId?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `channelId` field. */
  channelId?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `content` field. */
  content?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `created` field. */
  created?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `guildId` field. */
  guildId?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `messageId` field. */
  messageId?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `msg` field. */
  msg?: InputMaybe<Scalars['JSON']>;
};

/** An input for mutations affecting `Message` */
export type MessageInput = {
  authorId: Scalars['BigInt'];
  channelId: Scalars['BigInt'];
  content: Scalars['String'];
  created: Scalars['Datetime'];
  guildId: Scalars['BigInt'];
  messageId: Scalars['BigInt'];
  msg: Scalars['JSON'];
};

/** A connection to a list of `Message` values. */
export type MessagesConnection = {
  __typename?: 'MessagesConnection';
  /** A list of edges which contains the `Message` and cursor to aid in pagination. */
  edges: Array<MessagesEdge>;
  /** A list of `Message` objects. */
  nodes: Array<Message>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Message` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Message` edge in the connection. */
export type MessagesEdge = {
  __typename?: 'MessagesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Message` at the end of the edge. */
  node: Message;
};

/** Methods to use when ordering `Message`. */
export enum MessagesOrderBy {
  AuthorIdAsc = 'AUTHOR_ID_ASC',
  AuthorIdDesc = 'AUTHOR_ID_DESC',
  ChannelIdAsc = 'CHANNEL_ID_ASC',
  ChannelIdDesc = 'CHANNEL_ID_DESC',
  ContentAsc = 'CONTENT_ASC',
  ContentDesc = 'CONTENT_DESC',
  CreatedAsc = 'CREATED_ASC',
  CreatedDesc = 'CREATED_DESC',
  GuildIdAsc = 'GUILD_ID_ASC',
  GuildIdDesc = 'GUILD_ID_DESC',
  MessageIdAsc = 'MESSAGE_ID_ASC',
  MessageIdDesc = 'MESSAGE_ID_DESC',
  MsgAsc = 'MSG_ASC',
  MsgDesc = 'MSG_DESC',
  Natural = 'NATURAL'
}

export type ModLog = Node & {
  __typename?: 'ModLog';
  action: Scalars['String'];
  actionTime: Scalars['Datetime'];
  attachments: Array<Maybe<Scalars['String']>>;
  caseId: Scalars['BigInt'];
  executorId?: Maybe<Scalars['BigInt']>;
  guildId: Scalars['BigInt'];
  msgId?: Maybe<Scalars['BigInt']>;
  /** Reads and enables pagination through a set of `Mute`. */
  mutesByGuildIdAndCaseId: MutesConnection;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  pending: Scalars['Boolean'];
  reason?: Maybe<Scalars['String']>;
  userId: Scalars['BigInt'];
  userTag: Scalars['String'];
};


export type ModLogMutesByGuildIdAndCaseIdArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<MuteCondition>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MutesOrderBy>>;
};

/** A condition to be used against `ModLog` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ModLogCondition = {
  /** Checks for equality with the object’s `action` field. */
  action?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `actionTime` field. */
  actionTime?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `attachments` field. */
  attachments?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Checks for equality with the object’s `caseId` field. */
  caseId?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `executorId` field. */
  executorId?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `guildId` field. */
  guildId?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `msgId` field. */
  msgId?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `pending` field. */
  pending?: InputMaybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `reason` field. */
  reason?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `userTag` field. */
  userTag?: InputMaybe<Scalars['String']>;
};

/** An input for mutations affecting `ModLog` */
export type ModLogInput = {
  action: Scalars['String'];
  actionTime: Scalars['Datetime'];
  attachments?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  caseId: Scalars['BigInt'];
  executorId?: InputMaybe<Scalars['BigInt']>;
  guildId: Scalars['BigInt'];
  msgId?: InputMaybe<Scalars['BigInt']>;
  pending: Scalars['Boolean'];
  reason?: InputMaybe<Scalars['String']>;
  userId: Scalars['BigInt'];
  userTag: Scalars['String'];
};

/** Represents an update to a `ModLog`. Fields that are set will be updated. */
export type ModLogPatch = {
  action?: InputMaybe<Scalars['String']>;
  actionTime?: InputMaybe<Scalars['Datetime']>;
  attachments?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  caseId?: InputMaybe<Scalars['BigInt']>;
  executorId?: InputMaybe<Scalars['BigInt']>;
  guildId?: InputMaybe<Scalars['BigInt']>;
  msgId?: InputMaybe<Scalars['BigInt']>;
  pending?: InputMaybe<Scalars['Boolean']>;
  reason?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['BigInt']>;
  userTag?: InputMaybe<Scalars['String']>;
};

/** A connection to a list of `ModLog` values. */
export type ModLogsConnection = {
  __typename?: 'ModLogsConnection';
  /** A list of edges which contains the `ModLog` and cursor to aid in pagination. */
  edges: Array<ModLogsEdge>;
  /** A list of `ModLog` objects. */
  nodes: Array<ModLog>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ModLog` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `ModLog` edge in the connection. */
export type ModLogsEdge = {
  __typename?: 'ModLogsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ModLog` at the end of the edge. */
  node: ModLog;
};

/** Methods to use when ordering `ModLog`. */
export enum ModLogsOrderBy {
  ActionAsc = 'ACTION_ASC',
  ActionDesc = 'ACTION_DESC',
  ActionTimeAsc = 'ACTION_TIME_ASC',
  ActionTimeDesc = 'ACTION_TIME_DESC',
  AttachmentsAsc = 'ATTACHMENTS_ASC',
  AttachmentsDesc = 'ATTACHMENTS_DESC',
  CaseIdAsc = 'CASE_ID_ASC',
  CaseIdDesc = 'CASE_ID_DESC',
  ExecutorIdAsc = 'EXECUTOR_ID_ASC',
  ExecutorIdDesc = 'EXECUTOR_ID_DESC',
  GuildIdAsc = 'GUILD_ID_ASC',
  GuildIdDesc = 'GUILD_ID_DESC',
  MsgIdAsc = 'MSG_ID_ASC',
  MsgIdDesc = 'MSG_ID_DESC',
  Natural = 'NATURAL',
  PendingAsc = 'PENDING_ASC',
  PendingDesc = 'PENDING_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ReasonAsc = 'REASON_ASC',
  ReasonDesc = 'REASON_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC',
  UserTagAsc = 'USER_TAG_ASC',
  UserTagDesc = 'USER_TAG_DESC'
}

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a single `BotStat`. */
  createBotStat?: Maybe<CreateBotStatPayload>;
  /** Creates a single `CachedGuild`. */
  createCachedGuild?: Maybe<CreateCachedGuildPayload>;
  /** Creates a single `CachedUser`. */
  createCachedUser?: Maybe<CreateCachedUserPayload>;
  /** Creates a single `Feed`. */
  createFeed?: Maybe<CreateFeedPayload>;
  /** Creates a single `FeedItem`. */
  createFeedItem?: Maybe<CreateFeedItemPayload>;
  /** Creates a single `FeedSubscription`. */
  createFeedSubscription?: Maybe<CreateFeedSubscriptionPayload>;
  /** Creates a single `GuildBan`. */
  createGuildBan?: Maybe<CreateGuildBanPayload>;
  /** Creates a single `GuildConfig`. */
  createGuildConfig?: Maybe<CreateGuildConfigPayload>;
  /** Creates a single `Member`. */
  createMember?: Maybe<CreateMemberPayload>;
  /** Creates a single `Message`. */
  createMessage?: Maybe<CreateMessagePayload>;
  /** Creates a single `ModLog`. */
  createModLog?: Maybe<CreateModLogPayload>;
  /** Creates a single `Mute`. */
  createMute?: Maybe<CreateMutePayload>;
  /** Creates a single `Notification`. */
  createNotification?: Maybe<CreateNotificationPayload>;
  /** Creates a single `Reminder`. */
  createReminder?: Maybe<CreateReminderPayload>;
  /** Creates a single `RoleMenu`. */
  createRoleMenu?: Maybe<CreateRoleMenuPayload>;
  /** Creates a single `Tag`. */
  createTag?: Maybe<CreateTagPayload>;
  /** Creates a single `User`. */
  createUser?: Maybe<CreateUserPayload>;
  /** Creates a single `UserLevel`. */
  createUserLevel?: Maybe<CreateUserLevelPayload>;
  /** Creates a single `WebUser`. */
  createWebUser?: Maybe<CreateWebUserPayload>;
  /** Creates a single `WebUserGuild`. */
  createWebUserGuild?: Maybe<CreateWebUserGuildPayload>;
  /** Deletes a single `BotStat` using its globally unique id. */
  deleteBotStat?: Maybe<DeleteBotStatPayload>;
  /** Deletes a single `BotStat` using a unique key. */
  deleteBotStatByNameAndCategory?: Maybe<DeleteBotStatPayload>;
  /** Deletes a single `CachedGuild` using its globally unique id. */
  deleteCachedGuild?: Maybe<DeleteCachedGuildPayload>;
  /** Deletes a single `CachedGuild` using a unique key. */
  deleteCachedGuildById?: Maybe<DeleteCachedGuildPayload>;
  /** Deletes a single `CachedUser` using its globally unique id. */
  deleteCachedUser?: Maybe<DeleteCachedUserPayload>;
  /** Deletes a single `CachedUser` using a unique key. */
  deleteCachedUserById?: Maybe<DeleteCachedUserPayload>;
  /** Deletes a single `Feed` using its globally unique id. */
  deleteFeed?: Maybe<DeleteFeedPayload>;
  /** Deletes a single `Feed` using a unique key. */
  deleteFeedByFeedId?: Maybe<DeleteFeedPayload>;
  /** Deletes a single `FeedItem` using its globally unique id. */
  deleteFeedItem?: Maybe<DeleteFeedItemPayload>;
  /** Deletes a single `FeedItem` using a unique key. */
  deleteFeedItemByFeedIdAndItemId?: Maybe<DeleteFeedItemPayload>;
  /** Deletes a single `FeedSubscription` using its globally unique id. */
  deleteFeedSubscription?: Maybe<DeleteFeedSubscriptionPayload>;
  /** Deletes a single `FeedSubscription` using a unique key. */
  deleteFeedSubscriptionByFeedIdAndChannelId?: Maybe<DeleteFeedSubscriptionPayload>;
  /** Deletes a single `GuildBan` using its globally unique id. */
  deleteGuildBan?: Maybe<DeleteGuildBanPayload>;
  /** Deletes a single `GuildBan` using a unique key. */
  deleteGuildBanByGuildIdAndUserId?: Maybe<DeleteGuildBanPayload>;
  /** Deletes a single `GuildConfig` using its globally unique id. */
  deleteGuildConfig?: Maybe<DeleteGuildConfigPayload>;
  /** Deletes a single `GuildConfig` using a unique key. */
  deleteGuildConfigById?: Maybe<DeleteGuildConfigPayload>;
  /** Deletes a single `Member` using its globally unique id. */
  deleteMember?: Maybe<DeleteMemberPayload>;
  /** Deletes a single `Member` using a unique key. */
  deleteMemberByGuildIdAndUserId?: Maybe<DeleteMemberPayload>;
  /** Deletes a single `ModLog` using its globally unique id. */
  deleteModLog?: Maybe<DeleteModLogPayload>;
  /** Deletes a single `ModLog` using a unique key. */
  deleteModLogByGuildIdAndCaseId?: Maybe<DeleteModLogPayload>;
  /** Deletes a single `Mute` using its globally unique id. */
  deleteMute?: Maybe<DeleteMutePayload>;
  /** Deletes a single `Mute` using a unique key. */
  deleteMuteByGuildIdAndUserId?: Maybe<DeleteMutePayload>;
  /** Deletes a single `Notification` using its globally unique id. */
  deleteNotification?: Maybe<DeleteNotificationPayload>;
  /** Deletes a single `Notification` using a unique key. */
  deleteNotificationByUserIdAndGuildIdAndKeyword?: Maybe<DeleteNotificationPayload>;
  /** Deletes a single `Reminder` using its globally unique id. */
  deleteReminder?: Maybe<DeleteReminderPayload>;
  /** Deletes a single `Reminder` using a unique key. */
  deleteReminderByUserIdAndSetAt?: Maybe<DeleteReminderPayload>;
  /** Deletes a single `RoleMenu` using its globally unique id. */
  deleteRoleMenu?: Maybe<DeleteRoleMenuPayload>;
  /** Deletes a single `RoleMenu` using a unique key. */
  deleteRoleMenuByMessageId?: Maybe<DeleteRoleMenuPayload>;
  /** Deletes a single `Tag` using its globally unique id. */
  deleteTag?: Maybe<DeleteTagPayload>;
  /** Deletes a single `Tag` using a unique key. */
  deleteTagByGuildIdAndTagName?: Maybe<DeleteTagPayload>;
  /** Deletes a single `User` using its globally unique id. */
  deleteUser?: Maybe<DeleteUserPayload>;
  /** Deletes a single `User` using a unique key. */
  deleteUserById?: Maybe<DeleteUserPayload>;
  /** Deletes a single `UserLevel` using its globally unique id. */
  deleteUserLevel?: Maybe<DeleteUserLevelPayload>;
  /** Deletes a single `UserLevel` using a unique key. */
  deleteUserLevelByUserIdAndGuildId?: Maybe<DeleteUserLevelPayload>;
  /** Deletes a single `WebUser` using its globally unique id. */
  deleteWebUser?: Maybe<DeleteWebUserPayload>;
  /** Deletes a single `WebUser` using a unique key. */
  deleteWebUserById?: Maybe<DeleteWebUserPayload>;
  /** Deletes a single `WebUserGuild` using its globally unique id. */
  deleteWebUserGuild?: Maybe<DeleteWebUserGuildPayload>;
  /** Deletes a single `WebUserGuild` using a unique key. */
  deleteWebUserGuildByUserIdAndGuildId?: Maybe<DeleteWebUserGuildPayload>;
  graphql?: Maybe<GraphqlPayload>;
  logout?: Maybe<LogoutPayload>;
  /** Updates a single `BotStat` using its globally unique id and a patch. */
  updateBotStat?: Maybe<UpdateBotStatPayload>;
  /** Updates a single `BotStat` using a unique key and a patch. */
  updateBotStatByNameAndCategory?: Maybe<UpdateBotStatPayload>;
  /** Updates a single `CachedGuild` using its globally unique id and a patch. */
  updateCachedGuild?: Maybe<UpdateCachedGuildPayload>;
  /** Updates a single `CachedGuild` using a unique key and a patch. */
  updateCachedGuildById?: Maybe<UpdateCachedGuildPayload>;
  /** Updates a single `CachedUser` using its globally unique id and a patch. */
  updateCachedUser?: Maybe<UpdateCachedUserPayload>;
  /** Updates a single `CachedUser` using a unique key and a patch. */
  updateCachedUserById?: Maybe<UpdateCachedUserPayload>;
  /** Updates a single `Feed` using its globally unique id and a patch. */
  updateFeed?: Maybe<UpdateFeedPayload>;
  /** Updates a single `Feed` using a unique key and a patch. */
  updateFeedByFeedId?: Maybe<UpdateFeedPayload>;
  /** Updates a single `FeedItem` using its globally unique id and a patch. */
  updateFeedItem?: Maybe<UpdateFeedItemPayload>;
  /** Updates a single `FeedItem` using a unique key and a patch. */
  updateFeedItemByFeedIdAndItemId?: Maybe<UpdateFeedItemPayload>;
  /** Updates a single `FeedSubscription` using its globally unique id and a patch. */
  updateFeedSubscription?: Maybe<UpdateFeedSubscriptionPayload>;
  /** Updates a single `FeedSubscription` using a unique key and a patch. */
  updateFeedSubscriptionByFeedIdAndChannelId?: Maybe<UpdateFeedSubscriptionPayload>;
  /** Updates a single `GuildBan` using its globally unique id and a patch. */
  updateGuildBan?: Maybe<UpdateGuildBanPayload>;
  /** Updates a single `GuildBan` using a unique key and a patch. */
  updateGuildBanByGuildIdAndUserId?: Maybe<UpdateGuildBanPayload>;
  /** Updates a single `GuildConfig` using its globally unique id and a patch. */
  updateGuildConfig?: Maybe<UpdateGuildConfigPayload>;
  /** Updates a single `GuildConfig` using a unique key and a patch. */
  updateGuildConfigById?: Maybe<UpdateGuildConfigPayload>;
  /** Updates a single `Member` using its globally unique id and a patch. */
  updateMember?: Maybe<UpdateMemberPayload>;
  /** Updates a single `Member` using a unique key and a patch. */
  updateMemberByGuildIdAndUserId?: Maybe<UpdateMemberPayload>;
  /** Updates a single `ModLog` using its globally unique id and a patch. */
  updateModLog?: Maybe<UpdateModLogPayload>;
  /** Updates a single `ModLog` using a unique key and a patch. */
  updateModLogByGuildIdAndCaseId?: Maybe<UpdateModLogPayload>;
  /** Updates a single `Mute` using its globally unique id and a patch. */
  updateMute?: Maybe<UpdateMutePayload>;
  /** Updates a single `Mute` using a unique key and a patch. */
  updateMuteByGuildIdAndUserId?: Maybe<UpdateMutePayload>;
  /** Updates a single `Notification` using its globally unique id and a patch. */
  updateNotification?: Maybe<UpdateNotificationPayload>;
  /** Updates a single `Notification` using a unique key and a patch. */
  updateNotificationByUserIdAndGuildIdAndKeyword?: Maybe<UpdateNotificationPayload>;
  /** Updates a single `Reminder` using its globally unique id and a patch. */
  updateReminder?: Maybe<UpdateReminderPayload>;
  /** Updates a single `Reminder` using a unique key and a patch. */
  updateReminderByUserIdAndSetAt?: Maybe<UpdateReminderPayload>;
  /** Updates a single `RoleMenu` using its globally unique id and a patch. */
  updateRoleMenu?: Maybe<UpdateRoleMenuPayload>;
  /** Updates a single `RoleMenu` using a unique key and a patch. */
  updateRoleMenuByMessageId?: Maybe<UpdateRoleMenuPayload>;
  /** Updates a single `Tag` using its globally unique id and a patch. */
  updateTag?: Maybe<UpdateTagPayload>;
  /** Updates a single `Tag` using a unique key and a patch. */
  updateTagByGuildIdAndTagName?: Maybe<UpdateTagPayload>;
  /** Updates a single `User` using its globally unique id and a patch. */
  updateUser?: Maybe<UpdateUserPayload>;
  /** Updates a single `User` using a unique key and a patch. */
  updateUserById?: Maybe<UpdateUserPayload>;
  /** Updates a single `UserLevel` using its globally unique id and a patch. */
  updateUserLevel?: Maybe<UpdateUserLevelPayload>;
  /** Updates a single `UserLevel` using a unique key and a patch. */
  updateUserLevelByUserIdAndGuildId?: Maybe<UpdateUserLevelPayload>;
  /** Updates a single `WebUser` using its globally unique id and a patch. */
  updateWebUser?: Maybe<UpdateWebUserPayload>;
  /** Updates a single `WebUser` using a unique key and a patch. */
  updateWebUserById?: Maybe<UpdateWebUserPayload>;
  /** Updates a single `WebUserGuild` using its globally unique id and a patch. */
  updateWebUserGuild?: Maybe<UpdateWebUserGuildPayload>;
  /** Updates a single `WebUserGuild` using a unique key and a patch. */
  updateWebUserGuildByUserIdAndGuildId?: Maybe<UpdateWebUserGuildPayload>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateBotStatArgs = {
  input: CreateBotStatInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateCachedGuildArgs = {
  input: CreateCachedGuildInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateCachedUserArgs = {
  input: CreateCachedUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateFeedArgs = {
  input: CreateFeedInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateFeedItemArgs = {
  input: CreateFeedItemInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateFeedSubscriptionArgs = {
  input: CreateFeedSubscriptionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateGuildBanArgs = {
  input: CreateGuildBanInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateGuildConfigArgs = {
  input: CreateGuildConfigInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateMemberArgs = {
  input: CreateMemberInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateMessageArgs = {
  input: CreateMessageInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateModLogArgs = {
  input: CreateModLogInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateMuteArgs = {
  input: CreateMuteInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateNotificationArgs = {
  input: CreateNotificationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateReminderArgs = {
  input: CreateReminderInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateRoleMenuArgs = {
  input: CreateRoleMenuInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTagArgs = {
  input: CreateTagInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateUserLevelArgs = {
  input: CreateUserLevelInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateWebUserArgs = {
  input: CreateWebUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateWebUserGuildArgs = {
  input: CreateWebUserGuildInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteBotStatArgs = {
  input: DeleteBotStatInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteBotStatByNameAndCategoryArgs = {
  input: DeleteBotStatByNameAndCategoryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCachedGuildArgs = {
  input: DeleteCachedGuildInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCachedGuildByIdArgs = {
  input: DeleteCachedGuildByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCachedUserArgs = {
  input: DeleteCachedUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCachedUserByIdArgs = {
  input: DeleteCachedUserByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteFeedArgs = {
  input: DeleteFeedInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteFeedByFeedIdArgs = {
  input: DeleteFeedByFeedIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteFeedItemArgs = {
  input: DeleteFeedItemInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteFeedItemByFeedIdAndItemIdArgs = {
  input: DeleteFeedItemByFeedIdAndItemIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteFeedSubscriptionArgs = {
  input: DeleteFeedSubscriptionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteFeedSubscriptionByFeedIdAndChannelIdArgs = {
  input: DeleteFeedSubscriptionByFeedIdAndChannelIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteGuildBanArgs = {
  input: DeleteGuildBanInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteGuildBanByGuildIdAndUserIdArgs = {
  input: DeleteGuildBanByGuildIdAndUserIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteGuildConfigArgs = {
  input: DeleteGuildConfigInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteGuildConfigByIdArgs = {
  input: DeleteGuildConfigByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMemberArgs = {
  input: DeleteMemberInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMemberByGuildIdAndUserIdArgs = {
  input: DeleteMemberByGuildIdAndUserIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteModLogArgs = {
  input: DeleteModLogInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteModLogByGuildIdAndCaseIdArgs = {
  input: DeleteModLogByGuildIdAndCaseIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMuteArgs = {
  input: DeleteMuteInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMuteByGuildIdAndUserIdArgs = {
  input: DeleteMuteByGuildIdAndUserIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteNotificationArgs = {
  input: DeleteNotificationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteNotificationByUserIdAndGuildIdAndKeywordArgs = {
  input: DeleteNotificationByUserIdAndGuildIdAndKeywordInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteReminderArgs = {
  input: DeleteReminderInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteReminderByUserIdAndSetAtArgs = {
  input: DeleteReminderByUserIdAndSetAtInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteRoleMenuArgs = {
  input: DeleteRoleMenuInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteRoleMenuByMessageIdArgs = {
  input: DeleteRoleMenuByMessageIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTagArgs = {
  input: DeleteTagInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTagByGuildIdAndTagNameArgs = {
  input: DeleteTagByGuildIdAndTagNameInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserArgs = {
  input: DeleteUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserByIdArgs = {
  input: DeleteUserByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserLevelArgs = {
  input: DeleteUserLevelInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserLevelByUserIdAndGuildIdArgs = {
  input: DeleteUserLevelByUserIdAndGuildIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteWebUserArgs = {
  input: DeleteWebUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteWebUserByIdArgs = {
  input: DeleteWebUserByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteWebUserGuildArgs = {
  input: DeleteWebUserGuildInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteWebUserGuildByUserIdAndGuildIdArgs = {
  input: DeleteWebUserGuildByUserIdAndGuildIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationGraphqlArgs = {
  input: GraphqlInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationLogoutArgs = {
  input: LogoutInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateBotStatArgs = {
  input: UpdateBotStatInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateBotStatByNameAndCategoryArgs = {
  input: UpdateBotStatByNameAndCategoryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCachedGuildArgs = {
  input: UpdateCachedGuildInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCachedGuildByIdArgs = {
  input: UpdateCachedGuildByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCachedUserArgs = {
  input: UpdateCachedUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCachedUserByIdArgs = {
  input: UpdateCachedUserByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateFeedArgs = {
  input: UpdateFeedInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateFeedByFeedIdArgs = {
  input: UpdateFeedByFeedIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateFeedItemArgs = {
  input: UpdateFeedItemInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateFeedItemByFeedIdAndItemIdArgs = {
  input: UpdateFeedItemByFeedIdAndItemIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateFeedSubscriptionArgs = {
  input: UpdateFeedSubscriptionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateFeedSubscriptionByFeedIdAndChannelIdArgs = {
  input: UpdateFeedSubscriptionByFeedIdAndChannelIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateGuildBanArgs = {
  input: UpdateGuildBanInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateGuildBanByGuildIdAndUserIdArgs = {
  input: UpdateGuildBanByGuildIdAndUserIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateGuildConfigArgs = {
  input: UpdateGuildConfigInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateGuildConfigByIdArgs = {
  input: UpdateGuildConfigByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateMemberArgs = {
  input: UpdateMemberInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateMemberByGuildIdAndUserIdArgs = {
  input: UpdateMemberByGuildIdAndUserIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateModLogArgs = {
  input: UpdateModLogInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateModLogByGuildIdAndCaseIdArgs = {
  input: UpdateModLogByGuildIdAndCaseIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateMuteArgs = {
  input: UpdateMuteInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateMuteByGuildIdAndUserIdArgs = {
  input: UpdateMuteByGuildIdAndUserIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateNotificationArgs = {
  input: UpdateNotificationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateNotificationByUserIdAndGuildIdAndKeywordArgs = {
  input: UpdateNotificationByUserIdAndGuildIdAndKeywordInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateReminderArgs = {
  input: UpdateReminderInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateReminderByUserIdAndSetAtArgs = {
  input: UpdateReminderByUserIdAndSetAtInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateRoleMenuArgs = {
  input: UpdateRoleMenuInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateRoleMenuByMessageIdArgs = {
  input: UpdateRoleMenuByMessageIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTagArgs = {
  input: UpdateTagInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTagByGuildIdAndTagNameArgs = {
  input: UpdateTagByGuildIdAndTagNameInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserByIdArgs = {
  input: UpdateUserByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserLevelArgs = {
  input: UpdateUserLevelInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserLevelByUserIdAndGuildIdArgs = {
  input: UpdateUserLevelByUserIdAndGuildIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateWebUserArgs = {
  input: UpdateWebUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateWebUserByIdArgs = {
  input: UpdateWebUserByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateWebUserGuildArgs = {
  input: UpdateWebUserGuildInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateWebUserGuildByUserIdAndGuildIdArgs = {
  input: UpdateWebUserGuildByUserIdAndGuildIdInput;
};

export type Mute = Node & {
  __typename?: 'Mute';
  caseId?: Maybe<Scalars['BigInt']>;
  endTime?: Maybe<Scalars['Datetime']>;
  guildId: Scalars['BigInt'];
  /** Reads a single `ModLog` that is related to this `Mute`. */
  modLogByGuildIdAndCaseId?: Maybe<ModLog>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  pending: Scalars['Boolean'];
  startTime: Scalars['Datetime'];
  userId: Scalars['BigInt'];
};

/** A condition to be used against `Mute` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type MuteCondition = {
  /** Checks for equality with the object’s `caseId` field. */
  caseId?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `endTime` field. */
  endTime?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `guildId` field. */
  guildId?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `pending` field. */
  pending?: InputMaybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `startTime` field. */
  startTime?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['BigInt']>;
};

/** An input for mutations affecting `Mute` */
export type MuteInput = {
  caseId?: InputMaybe<Scalars['BigInt']>;
  endTime?: InputMaybe<Scalars['Datetime']>;
  guildId: Scalars['BigInt'];
  pending?: InputMaybe<Scalars['Boolean']>;
  startTime: Scalars['Datetime'];
  userId: Scalars['BigInt'];
};

/** Represents an update to a `Mute`. Fields that are set will be updated. */
export type MutePatch = {
  caseId?: InputMaybe<Scalars['BigInt']>;
  endTime?: InputMaybe<Scalars['Datetime']>;
  guildId?: InputMaybe<Scalars['BigInt']>;
  pending?: InputMaybe<Scalars['Boolean']>;
  startTime?: InputMaybe<Scalars['Datetime']>;
  userId?: InputMaybe<Scalars['BigInt']>;
};

/** A connection to a list of `Mute` values. */
export type MutesConnection = {
  __typename?: 'MutesConnection';
  /** A list of edges which contains the `Mute` and cursor to aid in pagination. */
  edges: Array<MutesEdge>;
  /** A list of `Mute` objects. */
  nodes: Array<Mute>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Mute` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Mute` edge in the connection. */
export type MutesEdge = {
  __typename?: 'MutesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Mute` at the end of the edge. */
  node: Mute;
};

/** Methods to use when ordering `Mute`. */
export enum MutesOrderBy {
  CaseIdAsc = 'CASE_ID_ASC',
  CaseIdDesc = 'CASE_ID_DESC',
  EndTimeAsc = 'END_TIME_ASC',
  EndTimeDesc = 'END_TIME_DESC',
  GuildIdAsc = 'GUILD_ID_ASC',
  GuildIdDesc = 'GUILD_ID_DESC',
  Natural = 'NATURAL',
  PendingAsc = 'PENDING_ASC',
  PendingDesc = 'PENDING_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  StartTimeAsc = 'START_TIME_ASC',
  StartTimeDesc = 'START_TIME_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC'
}

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
};

export type Notification = Node & {
  __typename?: 'Notification';
  guildId: Scalars['BigInt'];
  keyword: Scalars['String'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  userId: Scalars['BigInt'];
};

/**
 * A condition to be used against `Notification` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type NotificationCondition = {
  /** Checks for equality with the object’s `guildId` field. */
  guildId?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `keyword` field. */
  keyword?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['BigInt']>;
};

/** An input for mutations affecting `Notification` */
export type NotificationInput = {
  guildId: Scalars['BigInt'];
  keyword: Scalars['String'];
  userId: Scalars['BigInt'];
};

/** Represents an update to a `Notification`. Fields that are set will be updated. */
export type NotificationPatch = {
  guildId?: InputMaybe<Scalars['BigInt']>;
  keyword?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['BigInt']>;
};

/** A connection to a list of `Notification` values. */
export type NotificationsConnection = {
  __typename?: 'NotificationsConnection';
  /** A list of edges which contains the `Notification` and cursor to aid in pagination. */
  edges: Array<NotificationsEdge>;
  /** A list of `Notification` objects. */
  nodes: Array<Notification>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Notification` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Notification` edge in the connection. */
export type NotificationsEdge = {
  __typename?: 'NotificationsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Notification` at the end of the edge. */
  node: Notification;
};

/** Methods to use when ordering `Notification`. */
export enum NotificationsOrderBy {
  GuildIdAsc = 'GUILD_ID_ASC',
  GuildIdDesc = 'GUILD_ID_DESC',
  KeywordAsc = 'KEYWORD_ASC',
  KeywordDesc = 'KEYWORD_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC'
}

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']>;
};

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename?: 'Query';
  /** Reads and enables pagination through a set of `BotStat`. */
  allBotStats?: Maybe<BotStatsConnection>;
  /** Reads and enables pagination through a set of `FeedItem`. */
  allFeedItems?: Maybe<FeedItemsConnection>;
  /** Reads and enables pagination through a set of `FeedSubscription`. */
  allFeedSubscriptions?: Maybe<FeedSubscriptionsConnection>;
  /** Reads and enables pagination through a set of `Feed`. */
  allFeeds?: Maybe<FeedsConnection>;
  /** Reads and enables pagination through a set of `GuildBan`. */
  allGuildBans?: Maybe<GuildBansConnection>;
  /** Reads and enables pagination through a set of `GuildConfig`. */
  allGuildConfigs?: Maybe<GuildConfigsConnection>;
  /** Reads and enables pagination through a set of `Member`. */
  allMembers?: Maybe<MembersConnection>;
  /** Reads and enables pagination through a set of `Message`. */
  allMessages?: Maybe<MessagesConnection>;
  /** Reads and enables pagination through a set of `ModLog`. */
  allModLogs?: Maybe<ModLogsConnection>;
  /** Reads and enables pagination through a set of `Mute`. */
  allMutes?: Maybe<MutesConnection>;
  /** Reads and enables pagination through a set of `Notification`. */
  allNotifications?: Maybe<NotificationsConnection>;
  /** Reads and enables pagination through a set of `Reminder`. */
  allReminders?: Maybe<RemindersConnection>;
  /** Reads and enables pagination through a set of `RoleMenu`. */
  allRoleMenus?: Maybe<RoleMenusConnection>;
  /** Reads and enables pagination through a set of `Tag`. */
  allTags?: Maybe<TagsConnection>;
  /** Reads and enables pagination through a set of `User`. */
  allUsers?: Maybe<UsersConnection>;
  /** Reads and enables pagination through a set of `WebUserGuild`. */
  allWebUserGuilds?: Maybe<WebUserGuildsConnection>;
  /** Reads and enables pagination through a set of `WebUser`. */
  allWebUsers?: Maybe<WebUsersConnection>;
  /** Reads a single `BotStat` using its globally unique `ID`. */
  botStat?: Maybe<BotStat>;
  botStatByNameAndCategory?: Maybe<BotStat>;
  /** Reads a single `CachedGuild` using its globally unique `ID`. */
  cachedGuild?: Maybe<CachedGuild>;
  cachedGuildById?: Maybe<CachedGuild>;
  /** Reads a single `CachedUser` using its globally unique `ID`. */
  cachedUser?: Maybe<CachedUser>;
  cachedUserById?: Maybe<CachedUser>;
  /** Handy method to get the current session ID. */
  currentSessionId?: Maybe<Scalars['UUID']>;
  /** The currently logged in user (or null if not logged in). */
  currentUser?: Maybe<WebUser>;
  currentUserDiscordId?: Maybe<Scalars['BigInt']>;
  /** Handy method to get the current user ID for use in RLS policies, etc; in GraphQL, use `currentUser{id}` instead. */
  currentUserId?: Maybe<Scalars['BigInt']>;
  currentUserManagedGuildIds?: Maybe<CurrentUserManagedGuildIdsConnection>;
  /** Reads a single `Feed` using its globally unique `ID`. */
  feed?: Maybe<Feed>;
  feedByFeedId?: Maybe<Feed>;
  /** Reads a single `FeedItem` using its globally unique `ID`. */
  feedItem?: Maybe<FeedItem>;
  feedItemByFeedIdAndItemId?: Maybe<FeedItem>;
  /** Reads a single `FeedSubscription` using its globally unique `ID`. */
  feedSubscription?: Maybe<FeedSubscription>;
  feedSubscriptionByFeedIdAndChannelId?: Maybe<FeedSubscription>;
  /** Reads a single `GuildBan` using its globally unique `ID`. */
  guildBan?: Maybe<GuildBan>;
  guildBanByGuildIdAndUserId?: Maybe<GuildBan>;
  /** Reads a single `GuildConfig` using its globally unique `ID`. */
  guildConfig?: Maybe<GuildConfig>;
  guildConfigById?: Maybe<GuildConfig>;
  /** Reads a single `Member` using its globally unique `ID`. */
  member?: Maybe<Member>;
  memberByGuildIdAndUserId?: Maybe<Member>;
  /** Reads a single `ModLog` using its globally unique `ID`. */
  modLog?: Maybe<ModLog>;
  modLogByGuildIdAndCaseId?: Maybe<ModLog>;
  /** Reads a single `Mute` using its globally unique `ID`. */
  mute?: Maybe<Mute>;
  muteByGuildIdAndUserId?: Maybe<Mute>;
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars['ID'];
  /** Reads a single `Notification` using its globally unique `ID`. */
  notification?: Maybe<Notification>;
  notificationByUserIdAndGuildIdAndKeyword?: Maybe<Notification>;
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  /** Reads a single `Reminder` using its globally unique `ID`. */
  reminder?: Maybe<Reminder>;
  reminderByUserIdAndSetAt?: Maybe<Reminder>;
  /** Reads a single `RoleMenu` using its globally unique `ID`. */
  roleMenu?: Maybe<RoleMenu>;
  roleMenuByMessageId?: Maybe<RoleMenu>;
  /** Reads a single `Tag` using its globally unique `ID`. */
  tag?: Maybe<Tag>;
  tagByGuildIdAndTagName?: Maybe<Tag>;
  /** Leaderboard for given timeframe and optional guild. If guild is null, it is the global leaderboard */
  timeframeUserLevels?: Maybe<TimeframeUserLevelsConnection>;
  /** Reads a single `User` using its globally unique `ID`. */
  user?: Maybe<User>;
  userById?: Maybe<User>;
  /** Reads a single `UserLevel` using its globally unique `ID`. */
  userLevel?: Maybe<UserLevel>;
  userLevelByUserIdAndGuildId?: Maybe<UserLevel>;
  /** Reads a single `WebUser` using its globally unique `ID`. */
  webUser?: Maybe<WebUser>;
  webUserById?: Maybe<WebUser>;
  /** Reads a single `WebUserGuild` using its globally unique `ID`. */
  webUserGuild?: Maybe<WebUserGuild>;
  webUserGuildByUserIdAndGuildId?: Maybe<WebUserGuild>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllBotStatsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<BotStatCondition>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<BotStatsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllFeedItemsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<FeedItemCondition>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<FeedItemsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllFeedSubscriptionsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<FeedSubscriptionCondition>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<FeedSubscriptionsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllFeedsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<FeedCondition>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<FeedsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllGuildBansArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<GuildBanCondition>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<GuildBansOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllGuildConfigsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<GuildConfigCondition>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<GuildConfigsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllMembersArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<MemberCondition>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MembersOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllMessagesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<MessageCondition>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MessagesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllModLogsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<ModLogCondition>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<ModLogsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllMutesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<MuteCondition>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MutesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllNotificationsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<NotificationCondition>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<NotificationsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllRemindersArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<ReminderCondition>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<RemindersOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllRoleMenusArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<RoleMenuCondition>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<RoleMenusOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllTagsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TagCondition>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TagsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllUsersArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<UserCondition>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllWebUserGuildsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<WebUserGuildCondition>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<WebUserGuildsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllWebUsersArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<WebUserCondition>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<WebUsersOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryBotStatArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryBotStatByNameAndCategoryArgs = {
  category: Scalars['String'];
  name: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCachedGuildArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCachedGuildByIdArgs = {
  id: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCachedUserArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCachedUserByIdArgs = {
  id: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCurrentUserManagedGuildIdsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryFeedArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryFeedByFeedIdArgs = {
  feedId: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryFeedItemArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryFeedItemByFeedIdAndItemIdArgs = {
  feedId: Scalars['String'];
  itemId: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryFeedSubscriptionArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryFeedSubscriptionByFeedIdAndChannelIdArgs = {
  channelId: Scalars['BigInt'];
  feedId: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryGuildBanArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryGuildBanByGuildIdAndUserIdArgs = {
  guildId: Scalars['BigInt'];
  userId: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryGuildConfigArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryGuildConfigByIdArgs = {
  id: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryMemberArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryMemberByGuildIdAndUserIdArgs = {
  guildId: Scalars['BigInt'];
  userId: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryModLogArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryModLogByGuildIdAndCaseIdArgs = {
  caseId: Scalars['BigInt'];
  guildId: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryMuteArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryMuteByGuildIdAndUserIdArgs = {
  guildId: Scalars['BigInt'];
  userId: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryNotificationArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryNotificationByUserIdAndGuildIdAndKeywordArgs = {
  guildId: Scalars['BigInt'];
  keyword: Scalars['String'];
  userId: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryReminderArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryReminderByUserIdAndSetAtArgs = {
  setAt: Scalars['Datetime'];
  userId: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryRoleMenuArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryRoleMenuByMessageIdArgs = {
  messageId: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTagArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTagByGuildIdAndTagNameArgs = {
  guildId: Scalars['BigInt'];
  tagName: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTimeframeUserLevelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  guildId?: InputMaybe<Scalars['BigInt']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  timeframe?: InputMaybe<LevelTimeframe>;
};


/** The root query type which gives access points into the data universe. */
export type QueryUserArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserByIdArgs = {
  id: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserLevelArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserLevelByUserIdAndGuildIdArgs = {
  guildId: Scalars['BigInt'];
  userId: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryWebUserArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryWebUserByIdArgs = {
  id: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryWebUserGuildArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryWebUserGuildByUserIdAndGuildIdArgs = {
  guildId: Scalars['BigInt'];
  userId: Scalars['BigInt'];
};

export type Reminder = Node & {
  __typename?: 'Reminder';
  description: Scalars['String'];
  expireAt: Scalars['Datetime'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  setAt: Scalars['Datetime'];
  userId: Scalars['BigInt'];
};

/**
 * A condition to be used against `Reminder` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type ReminderCondition = {
  /** Checks for equality with the object’s `description` field. */
  description?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `expireAt` field. */
  expireAt?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `setAt` field. */
  setAt?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['BigInt']>;
};

/** An input for mutations affecting `Reminder` */
export type ReminderInput = {
  description: Scalars['String'];
  expireAt: Scalars['Datetime'];
  setAt: Scalars['Datetime'];
  userId: Scalars['BigInt'];
};

/** Represents an update to a `Reminder`. Fields that are set will be updated. */
export type ReminderPatch = {
  description?: InputMaybe<Scalars['String']>;
  expireAt?: InputMaybe<Scalars['Datetime']>;
  setAt?: InputMaybe<Scalars['Datetime']>;
  userId?: InputMaybe<Scalars['BigInt']>;
};

/** A connection to a list of `Reminder` values. */
export type RemindersConnection = {
  __typename?: 'RemindersConnection';
  /** A list of edges which contains the `Reminder` and cursor to aid in pagination. */
  edges: Array<RemindersEdge>;
  /** A list of `Reminder` objects. */
  nodes: Array<Reminder>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Reminder` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Reminder` edge in the connection. */
export type RemindersEdge = {
  __typename?: 'RemindersEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Reminder` at the end of the edge. */
  node: Reminder;
};

/** Methods to use when ordering `Reminder`. */
export enum RemindersOrderBy {
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  ExpireAtAsc = 'EXPIRE_AT_ASC',
  ExpireAtDesc = 'EXPIRE_AT_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SetAtAsc = 'SET_AT_ASC',
  SetAtDesc = 'SET_AT_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC'
}

export type RoleMenu = Node & {
  __typename?: 'RoleMenu';
  channelId: Scalars['BigInt'];
  editorId?: Maybe<Scalars['BigInt']>;
  guildId: Scalars['BigInt'];
  messageId: Scalars['BigInt'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
};

/**
 * A condition to be used against `RoleMenu` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type RoleMenuCondition = {
  /** Checks for equality with the object’s `channelId` field. */
  channelId?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `editorId` field. */
  editorId?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `guildId` field. */
  guildId?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `messageId` field. */
  messageId?: InputMaybe<Scalars['BigInt']>;
};

/** An input for mutations affecting `RoleMenu` */
export type RoleMenuInput = {
  channelId: Scalars['BigInt'];
  editorId?: InputMaybe<Scalars['BigInt']>;
  guildId: Scalars['BigInt'];
  messageId: Scalars['BigInt'];
};

/** Represents an update to a `RoleMenu`. Fields that are set will be updated. */
export type RoleMenuPatch = {
  channelId?: InputMaybe<Scalars['BigInt']>;
  editorId?: InputMaybe<Scalars['BigInt']>;
  guildId?: InputMaybe<Scalars['BigInt']>;
  messageId?: InputMaybe<Scalars['BigInt']>;
};

/** A connection to a list of `RoleMenu` values. */
export type RoleMenusConnection = {
  __typename?: 'RoleMenusConnection';
  /** A list of edges which contains the `RoleMenu` and cursor to aid in pagination. */
  edges: Array<RoleMenusEdge>;
  /** A list of `RoleMenu` objects. */
  nodes: Array<RoleMenu>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `RoleMenu` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `RoleMenu` edge in the connection. */
export type RoleMenusEdge = {
  __typename?: 'RoleMenusEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `RoleMenu` at the end of the edge. */
  node: RoleMenu;
};

/** Methods to use when ordering `RoleMenu`. */
export enum RoleMenusOrderBy {
  ChannelIdAsc = 'CHANNEL_ID_ASC',
  ChannelIdDesc = 'CHANNEL_ID_DESC',
  EditorIdAsc = 'EDITOR_ID_ASC',
  EditorIdDesc = 'EDITOR_ID_DESC',
  GuildIdAsc = 'GUILD_ID_ASC',
  GuildIdDesc = 'GUILD_ID_DESC',
  MessageIdAsc = 'MESSAGE_ID_ASC',
  MessageIdDesc = 'MESSAGE_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

export type Tag = Node & {
  __typename?: 'Tag';
  content: Scalars['String'];
  created: Scalars['Datetime'];
  guildId: Scalars['BigInt'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  ownerId: Scalars['BigInt'];
  tagName: Scalars['String'];
  useCount: Scalars['BigInt'];
};

/** A condition to be used against `Tag` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type TagCondition = {
  /** Checks for equality with the object’s `content` field. */
  content?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `created` field. */
  created?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `guildId` field. */
  guildId?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `ownerId` field. */
  ownerId?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `tagName` field. */
  tagName?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `useCount` field. */
  useCount?: InputMaybe<Scalars['BigInt']>;
};

/** An input for mutations affecting `Tag` */
export type TagInput = {
  content: Scalars['String'];
  created: Scalars['Datetime'];
  guildId: Scalars['BigInt'];
  ownerId: Scalars['BigInt'];
  tagName: Scalars['String'];
  useCount: Scalars['BigInt'];
};

/** Represents an update to a `Tag`. Fields that are set will be updated. */
export type TagPatch = {
  content?: InputMaybe<Scalars['String']>;
  created?: InputMaybe<Scalars['Datetime']>;
  guildId?: InputMaybe<Scalars['BigInt']>;
  ownerId?: InputMaybe<Scalars['BigInt']>;
  tagName?: InputMaybe<Scalars['String']>;
  useCount?: InputMaybe<Scalars['BigInt']>;
};

/** A connection to a list of `Tag` values. */
export type TagsConnection = {
  __typename?: 'TagsConnection';
  /** A list of edges which contains the `Tag` and cursor to aid in pagination. */
  edges: Array<TagsEdge>;
  /** A list of `Tag` objects. */
  nodes: Array<Tag>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Tag` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Tag` edge in the connection. */
export type TagsEdge = {
  __typename?: 'TagsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Tag` at the end of the edge. */
  node: Tag;
};

/** Methods to use when ordering `Tag`. */
export enum TagsOrderBy {
  ContentAsc = 'CONTENT_ASC',
  ContentDesc = 'CONTENT_DESC',
  CreatedAsc = 'CREATED_ASC',
  CreatedDesc = 'CREATED_DESC',
  GuildIdAsc = 'GUILD_ID_ASC',
  GuildIdDesc = 'GUILD_ID_DESC',
  Natural = 'NATURAL',
  OwnerIdAsc = 'OWNER_ID_ASC',
  OwnerIdDesc = 'OWNER_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TagNameAsc = 'TAG_NAME_ASC',
  TagNameDesc = 'TAG_NAME_DESC',
  UseCountAsc = 'USE_COUNT_ASC',
  UseCountDesc = 'USE_COUNT_DESC'
}

/** A `TimeframeUserLevelsRecord` edge in the connection. */
export type TimeframeUserLevelEdge = {
  __typename?: 'TimeframeUserLevelEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `TimeframeUserLevelsRecord` at the end of the edge. */
  node: TimeframeUserLevelsRecord;
};

/** A connection to a list of `TimeframeUserLevelsRecord` values. */
export type TimeframeUserLevelsConnection = {
  __typename?: 'TimeframeUserLevelsConnection';
  /** A list of edges which contains the `TimeframeUserLevelsRecord` and cursor to aid in pagination. */
  edges: Array<TimeframeUserLevelEdge>;
  /** A list of `TimeframeUserLevelsRecord` objects. */
  nodes: Array<TimeframeUserLevelsRecord>;
  /** The count of *all* `TimeframeUserLevelsRecord` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** The return type of our `timeframeUserLevels` query. */
export type TimeframeUserLevelsRecord = {
  __typename?: 'TimeframeUserLevelsRecord';
  avatarUrl?: Maybe<Scalars['String']>;
  currentLevel?: Maybe<Scalars['BigInt']>;
  discriminator?: Maybe<Scalars['Int']>;
  gainedLevels?: Maybe<Scalars['BigInt']>;
  nextLevelXpProgress?: Maybe<Scalars['BigInt']>;
  nextLevelXpRequired?: Maybe<Scalars['BigInt']>;
  userId?: Maybe<Scalars['BigInt']>;
  username?: Maybe<Scalars['String']>;
  xp?: Maybe<Scalars['BigInt']>;
  xpDiff?: Maybe<Scalars['BigInt']>;
};

/** All input for the `updateBotStatByNameAndCategory` mutation. */
export type UpdateBotStatByNameAndCategoryInput = {
  /** An object where the defined keys will be set on the `BotStat` being updated. */
  botStatPatch: BotStatPatch;
  category: Scalars['String'];
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

/** All input for the `updateBotStat` mutation. */
export type UpdateBotStatInput = {
  /** An object where the defined keys will be set on the `BotStat` being updated. */
  botStatPatch: BotStatPatch;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `BotStat` to be updated. */
  nodeId: Scalars['ID'];
};

/** The output of our update `BotStat` mutation. */
export type UpdateBotStatPayload = {
  __typename?: 'UpdateBotStatPayload';
  /** The `BotStat` that was updated by this mutation. */
  botStat?: Maybe<BotStat>;
  /** An edge for our `BotStat`. May be used by Relay 1. */
  botStatEdge?: Maybe<BotStatsEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `BotStat` mutation. */
export type UpdateBotStatPayloadBotStatEdgeArgs = {
  orderBy?: InputMaybe<Array<BotStatsOrderBy>>;
};

/** All input for the `updateCachedGuildById` mutation. */
export type UpdateCachedGuildByIdInput = {
  /** An object where the defined keys will be set on the `CachedGuild` being updated. */
  cachedGuildPatch: CachedGuildPatch;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['BigInt'];
};

/** All input for the `updateCachedGuild` mutation. */
export type UpdateCachedGuildInput = {
  /** An object where the defined keys will be set on the `CachedGuild` being updated. */
  cachedGuildPatch: CachedGuildPatch;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `CachedGuild` to be updated. */
  nodeId: Scalars['ID'];
};

/** The output of our update `CachedGuild` mutation. */
export type UpdateCachedGuildPayload = {
  __typename?: 'UpdateCachedGuildPayload';
  /** The `CachedGuild` that was updated by this mutation. */
  cachedGuild?: Maybe<CachedGuild>;
  /** An edge for our `CachedGuild`. May be used by Relay 1. */
  cachedGuildEdge?: Maybe<CachedGuildsEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `CachedGuild` mutation. */
export type UpdateCachedGuildPayloadCachedGuildEdgeArgs = {
  orderBy?: InputMaybe<Array<CachedGuildsOrderBy>>;
};

/** All input for the `updateCachedUserById` mutation. */
export type UpdateCachedUserByIdInput = {
  /** An object where the defined keys will be set on the `CachedUser` being updated. */
  cachedUserPatch: CachedUserPatch;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['BigInt'];
};

/** All input for the `updateCachedUser` mutation. */
export type UpdateCachedUserInput = {
  /** An object where the defined keys will be set on the `CachedUser` being updated. */
  cachedUserPatch: CachedUserPatch;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `CachedUser` to be updated. */
  nodeId: Scalars['ID'];
};

/** The output of our update `CachedUser` mutation. */
export type UpdateCachedUserPayload = {
  __typename?: 'UpdateCachedUserPayload';
  /** The `CachedUser` that was updated by this mutation. */
  cachedUser?: Maybe<CachedUser>;
  /** An edge for our `CachedUser`. May be used by Relay 1. */
  cachedUserEdge?: Maybe<CachedUsersEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `CachedUser` mutation. */
export type UpdateCachedUserPayloadCachedUserEdgeArgs = {
  orderBy?: InputMaybe<Array<CachedUsersOrderBy>>;
};

/** All input for the `updateFeedByFeedId` mutation. */
export type UpdateFeedByFeedIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  feedId: Scalars['String'];
  /** An object where the defined keys will be set on the `Feed` being updated. */
  feedPatch: FeedPatch;
};

/** All input for the `updateFeed` mutation. */
export type UpdateFeedInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `Feed` being updated. */
  feedPatch: FeedPatch;
  /** The globally unique `ID` which will identify a single `Feed` to be updated. */
  nodeId: Scalars['ID'];
};

/** All input for the `updateFeedItemByFeedIdAndItemId` mutation. */
export type UpdateFeedItemByFeedIdAndItemIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  feedId: Scalars['String'];
  /** An object where the defined keys will be set on the `FeedItem` being updated. */
  feedItemPatch: FeedItemPatch;
  itemId: Scalars['String'];
};

/** All input for the `updateFeedItem` mutation. */
export type UpdateFeedItemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `FeedItem` being updated. */
  feedItemPatch: FeedItemPatch;
  /** The globally unique `ID` which will identify a single `FeedItem` to be updated. */
  nodeId: Scalars['ID'];
};

/** The output of our update `FeedItem` mutation. */
export type UpdateFeedItemPayload = {
  __typename?: 'UpdateFeedItemPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `FeedItem` that was updated by this mutation. */
  feedItem?: Maybe<FeedItem>;
  /** An edge for our `FeedItem`. May be used by Relay 1. */
  feedItemEdge?: Maybe<FeedItemsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `FeedItem` mutation. */
export type UpdateFeedItemPayloadFeedItemEdgeArgs = {
  orderBy?: InputMaybe<Array<FeedItemsOrderBy>>;
};

/** The output of our update `Feed` mutation. */
export type UpdateFeedPayload = {
  __typename?: 'UpdateFeedPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Feed` that was updated by this mutation. */
  feed?: Maybe<Feed>;
  /** An edge for our `Feed`. May be used by Relay 1. */
  feedEdge?: Maybe<FeedsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `Feed` mutation. */
export type UpdateFeedPayloadFeedEdgeArgs = {
  orderBy?: InputMaybe<Array<FeedsOrderBy>>;
};

/** All input for the `updateFeedSubscriptionByFeedIdAndChannelId` mutation. */
export type UpdateFeedSubscriptionByFeedIdAndChannelIdInput = {
  channelId: Scalars['BigInt'];
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  feedId: Scalars['String'];
  /** An object where the defined keys will be set on the `FeedSubscription` being updated. */
  feedSubscriptionPatch: FeedSubscriptionPatch;
};

/** All input for the `updateFeedSubscription` mutation. */
export type UpdateFeedSubscriptionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `FeedSubscription` being updated. */
  feedSubscriptionPatch: FeedSubscriptionPatch;
  /** The globally unique `ID` which will identify a single `FeedSubscription` to be updated. */
  nodeId: Scalars['ID'];
};

/** The output of our update `FeedSubscription` mutation. */
export type UpdateFeedSubscriptionPayload = {
  __typename?: 'UpdateFeedSubscriptionPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Feed` that is related to this `FeedSubscription`. */
  feedByFeedId?: Maybe<Feed>;
  /** The `FeedSubscription` that was updated by this mutation. */
  feedSubscription?: Maybe<FeedSubscription>;
  /** An edge for our `FeedSubscription`. May be used by Relay 1. */
  feedSubscriptionEdge?: Maybe<FeedSubscriptionsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `FeedSubscription` mutation. */
export type UpdateFeedSubscriptionPayloadFeedSubscriptionEdgeArgs = {
  orderBy?: InputMaybe<Array<FeedSubscriptionsOrderBy>>;
};

/** All input for the `updateGuildBanByGuildIdAndUserId` mutation. */
export type UpdateGuildBanByGuildIdAndUserIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `GuildBan` being updated. */
  guildBanPatch: GuildBanPatch;
  guildId: Scalars['BigInt'];
  userId: Scalars['BigInt'];
};

/** All input for the `updateGuildBan` mutation. */
export type UpdateGuildBanInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `GuildBan` being updated. */
  guildBanPatch: GuildBanPatch;
  /** The globally unique `ID` which will identify a single `GuildBan` to be updated. */
  nodeId: Scalars['ID'];
};

/** The output of our update `GuildBan` mutation. */
export type UpdateGuildBanPayload = {
  __typename?: 'UpdateGuildBanPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `GuildBan` that was updated by this mutation. */
  guildBan?: Maybe<GuildBan>;
  /** An edge for our `GuildBan`. May be used by Relay 1. */
  guildBanEdge?: Maybe<GuildBansEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `GuildBan` mutation. */
export type UpdateGuildBanPayloadGuildBanEdgeArgs = {
  orderBy?: InputMaybe<Array<GuildBansOrderBy>>;
};

/** All input for the `updateGuildConfigById` mutation. */
export type UpdateGuildConfigByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `GuildConfig` being updated. */
  guildConfigPatch: GuildConfigPatch;
  id: Scalars['BigInt'];
};

/** All input for the `updateGuildConfig` mutation. */
export type UpdateGuildConfigInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `GuildConfig` being updated. */
  guildConfigPatch: GuildConfigPatch;
  /** The globally unique `ID` which will identify a single `GuildConfig` to be updated. */
  nodeId: Scalars['ID'];
};

/** The output of our update `GuildConfig` mutation. */
export type UpdateGuildConfigPayload = {
  __typename?: 'UpdateGuildConfigPayload';
  /** Reads a single `CachedGuild` that is related to this `GuildConfig`. */
  cachedGuildById?: Maybe<CachedGuild>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `GuildConfig` that was updated by this mutation. */
  guildConfig?: Maybe<GuildConfig>;
  /** An edge for our `GuildConfig`. May be used by Relay 1. */
  guildConfigEdge?: Maybe<GuildConfigsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `GuildConfig` mutation. */
export type UpdateGuildConfigPayloadGuildConfigEdgeArgs = {
  orderBy?: InputMaybe<Array<GuildConfigsOrderBy>>;
};

/** All input for the `updateMemberByGuildIdAndUserId` mutation. */
export type UpdateMemberByGuildIdAndUserIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  guildId: Scalars['BigInt'];
  /** An object where the defined keys will be set on the `Member` being updated. */
  memberPatch: MemberPatch;
  userId: Scalars['BigInt'];
};

/** All input for the `updateMember` mutation. */
export type UpdateMemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `Member` being updated. */
  memberPatch: MemberPatch;
  /** The globally unique `ID` which will identify a single `Member` to be updated. */
  nodeId: Scalars['ID'];
};

/** The output of our update `Member` mutation. */
export type UpdateMemberPayload = {
  __typename?: 'UpdateMemberPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Member` that was updated by this mutation. */
  member?: Maybe<Member>;
  /** An edge for our `Member`. May be used by Relay 1. */
  memberEdge?: Maybe<MembersEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `Member` mutation. */
export type UpdateMemberPayloadMemberEdgeArgs = {
  orderBy?: InputMaybe<Array<MembersOrderBy>>;
};

/** All input for the `updateModLogByGuildIdAndCaseId` mutation. */
export type UpdateModLogByGuildIdAndCaseIdInput = {
  caseId: Scalars['BigInt'];
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  guildId: Scalars['BigInt'];
  /** An object where the defined keys will be set on the `ModLog` being updated. */
  modLogPatch: ModLogPatch;
};

/** All input for the `updateModLog` mutation. */
export type UpdateModLogInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `ModLog` being updated. */
  modLogPatch: ModLogPatch;
  /** The globally unique `ID` which will identify a single `ModLog` to be updated. */
  nodeId: Scalars['ID'];
};

/** The output of our update `ModLog` mutation. */
export type UpdateModLogPayload = {
  __typename?: 'UpdateModLogPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ModLog` that was updated by this mutation. */
  modLog?: Maybe<ModLog>;
  /** An edge for our `ModLog`. May be used by Relay 1. */
  modLogEdge?: Maybe<ModLogsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `ModLog` mutation. */
export type UpdateModLogPayloadModLogEdgeArgs = {
  orderBy?: InputMaybe<Array<ModLogsOrderBy>>;
};

/** All input for the `updateMuteByGuildIdAndUserId` mutation. */
export type UpdateMuteByGuildIdAndUserIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  guildId: Scalars['BigInt'];
  /** An object where the defined keys will be set on the `Mute` being updated. */
  mutePatch: MutePatch;
  userId: Scalars['BigInt'];
};

/** All input for the `updateMute` mutation. */
export type UpdateMuteInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `Mute` being updated. */
  mutePatch: MutePatch;
  /** The globally unique `ID` which will identify a single `Mute` to be updated. */
  nodeId: Scalars['ID'];
};

/** The output of our update `Mute` mutation. */
export type UpdateMutePayload = {
  __typename?: 'UpdateMutePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `ModLog` that is related to this `Mute`. */
  modLogByGuildIdAndCaseId?: Maybe<ModLog>;
  /** The `Mute` that was updated by this mutation. */
  mute?: Maybe<Mute>;
  /** An edge for our `Mute`. May be used by Relay 1. */
  muteEdge?: Maybe<MutesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `Mute` mutation. */
export type UpdateMutePayloadMuteEdgeArgs = {
  orderBy?: InputMaybe<Array<MutesOrderBy>>;
};

/** All input for the `updateNotificationByUserIdAndGuildIdAndKeyword` mutation. */
export type UpdateNotificationByUserIdAndGuildIdAndKeywordInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  guildId: Scalars['BigInt'];
  keyword: Scalars['String'];
  /** An object where the defined keys will be set on the `Notification` being updated. */
  notificationPatch: NotificationPatch;
  userId: Scalars['BigInt'];
};

/** All input for the `updateNotification` mutation. */
export type UpdateNotificationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Notification` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `Notification` being updated. */
  notificationPatch: NotificationPatch;
};

/** The output of our update `Notification` mutation. */
export type UpdateNotificationPayload = {
  __typename?: 'UpdateNotificationPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Notification` that was updated by this mutation. */
  notification?: Maybe<Notification>;
  /** An edge for our `Notification`. May be used by Relay 1. */
  notificationEdge?: Maybe<NotificationsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `Notification` mutation. */
export type UpdateNotificationPayloadNotificationEdgeArgs = {
  orderBy?: InputMaybe<Array<NotificationsOrderBy>>;
};

/** All input for the `updateReminderByUserIdAndSetAt` mutation. */
export type UpdateReminderByUserIdAndSetAtInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `Reminder` being updated. */
  reminderPatch: ReminderPatch;
  setAt: Scalars['Datetime'];
  userId: Scalars['BigInt'];
};

/** All input for the `updateReminder` mutation. */
export type UpdateReminderInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Reminder` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `Reminder` being updated. */
  reminderPatch: ReminderPatch;
};

/** The output of our update `Reminder` mutation. */
export type UpdateReminderPayload = {
  __typename?: 'UpdateReminderPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Reminder` that was updated by this mutation. */
  reminder?: Maybe<Reminder>;
  /** An edge for our `Reminder`. May be used by Relay 1. */
  reminderEdge?: Maybe<RemindersEdge>;
};


/** The output of our update `Reminder` mutation. */
export type UpdateReminderPayloadReminderEdgeArgs = {
  orderBy?: InputMaybe<Array<RemindersOrderBy>>;
};

/** All input for the `updateRoleMenuByMessageId` mutation. */
export type UpdateRoleMenuByMessageIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  messageId: Scalars['BigInt'];
  /** An object where the defined keys will be set on the `RoleMenu` being updated. */
  roleMenuPatch: RoleMenuPatch;
};

/** All input for the `updateRoleMenu` mutation. */
export type UpdateRoleMenuInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `RoleMenu` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `RoleMenu` being updated. */
  roleMenuPatch: RoleMenuPatch;
};

/** The output of our update `RoleMenu` mutation. */
export type UpdateRoleMenuPayload = {
  __typename?: 'UpdateRoleMenuPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `RoleMenu` that was updated by this mutation. */
  roleMenu?: Maybe<RoleMenu>;
  /** An edge for our `RoleMenu`. May be used by Relay 1. */
  roleMenuEdge?: Maybe<RoleMenusEdge>;
};


/** The output of our update `RoleMenu` mutation. */
export type UpdateRoleMenuPayloadRoleMenuEdgeArgs = {
  orderBy?: InputMaybe<Array<RoleMenusOrderBy>>;
};

/** All input for the `updateTagByGuildIdAndTagName` mutation. */
export type UpdateTagByGuildIdAndTagNameInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  guildId: Scalars['BigInt'];
  tagName: Scalars['String'];
  /** An object where the defined keys will be set on the `Tag` being updated. */
  tagPatch: TagPatch;
};

/** All input for the `updateTag` mutation. */
export type UpdateTagInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Tag` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `Tag` being updated. */
  tagPatch: TagPatch;
};

/** The output of our update `Tag` mutation. */
export type UpdateTagPayload = {
  __typename?: 'UpdateTagPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Tag` that was updated by this mutation. */
  tag?: Maybe<Tag>;
  /** An edge for our `Tag`. May be used by Relay 1. */
  tagEdge?: Maybe<TagsEdge>;
};


/** The output of our update `Tag` mutation. */
export type UpdateTagPayloadTagEdgeArgs = {
  orderBy?: InputMaybe<Array<TagsOrderBy>>;
};

/** All input for the `updateUserById` mutation. */
export type UpdateUserByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['BigInt'];
  /** An object where the defined keys will be set on the `User` being updated. */
  userPatch: UserPatch;
};

/** All input for the `updateUser` mutation. */
export type UpdateUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `User` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `User` being updated. */
  userPatch: UserPatch;
};

/** All input for the `updateUserLevelByUserIdAndGuildId` mutation. */
export type UpdateUserLevelByUserIdAndGuildIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  guildId: Scalars['BigInt'];
  userId: Scalars['BigInt'];
  /** An object where the defined keys will be set on the `UserLevel` being updated. */
  userLevelPatch: UserLevelPatch;
};

/** All input for the `updateUserLevel` mutation. */
export type UpdateUserLevelInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `UserLevel` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `UserLevel` being updated. */
  userLevelPatch: UserLevelPatch;
};

/** The output of our update `UserLevel` mutation. */
export type UpdateUserLevelPayload = {
  __typename?: 'UpdateUserLevelPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `UserLevel` that was updated by this mutation. */
  userLevel?: Maybe<UserLevel>;
  /** An edge for our `UserLevel`. May be used by Relay 1. */
  userLevelEdge?: Maybe<UserLevelsEdge>;
};


/** The output of our update `UserLevel` mutation. */
export type UpdateUserLevelPayloadUserLevelEdgeArgs = {
  orderBy?: InputMaybe<Array<UserLevelsOrderBy>>;
};

/** The output of our update `User` mutation. */
export type UpdateUserPayload = {
  __typename?: 'UpdateUserPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `User` that was updated by this mutation. */
  user?: Maybe<User>;
  /** An edge for our `User`. May be used by Relay 1. */
  userEdge?: Maybe<UsersEdge>;
};


/** The output of our update `User` mutation. */
export type UpdateUserPayloadUserEdgeArgs = {
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
};

/** All input for the `updateWebUserById` mutation. */
export type UpdateWebUserByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Unique identifier for the user. This should match their Discord ID. */
  id: Scalars['BigInt'];
  /** An object where the defined keys will be set on the `WebUser` being updated. */
  webUserPatch: WebUserPatch;
};

/** All input for the `updateWebUserGuildByUserIdAndGuildId` mutation. */
export type UpdateWebUserGuildByUserIdAndGuildIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  guildId: Scalars['BigInt'];
  userId: Scalars['BigInt'];
  /** An object where the defined keys will be set on the `WebUserGuild` being updated. */
  webUserGuildPatch: WebUserGuildPatch;
};

/** All input for the `updateWebUserGuild` mutation. */
export type UpdateWebUserGuildInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `WebUserGuild` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `WebUserGuild` being updated. */
  webUserGuildPatch: WebUserGuildPatch;
};

/** The output of our update `WebUserGuild` mutation. */
export type UpdateWebUserGuildPayload = {
  __typename?: 'UpdateWebUserGuildPayload';
  /** Reads a single `CachedGuild` that is related to this `WebUserGuild`. */
  cachedGuildByGuildId?: Maybe<CachedGuild>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `WebUser` that is related to this `WebUserGuild`. */
  webUserByUserId?: Maybe<WebUser>;
  /** The `WebUserGuild` that was updated by this mutation. */
  webUserGuild?: Maybe<WebUserGuild>;
  /** An edge for our `WebUserGuild`. May be used by Relay 1. */
  webUserGuildEdge?: Maybe<WebUserGuildsEdge>;
};


/** The output of our update `WebUserGuild` mutation. */
export type UpdateWebUserGuildPayloadWebUserGuildEdgeArgs = {
  orderBy?: InputMaybe<Array<WebUserGuildsOrderBy>>;
};

/** All input for the `updateWebUser` mutation. */
export type UpdateWebUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `WebUser` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `WebUser` being updated. */
  webUserPatch: WebUserPatch;
};

/** The output of our update `WebUser` mutation. */
export type UpdateWebUserPayload = {
  __typename?: 'UpdateWebUserPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `WebUser` that was updated by this mutation. */
  webUser?: Maybe<WebUser>;
  /** An edge for our `WebUser`. May be used by Relay 1. */
  webUserEdge?: Maybe<WebUsersEdge>;
};


/** The output of our update `WebUser` mutation. */
export type UpdateWebUserPayloadWebUserEdgeArgs = {
  orderBy?: InputMaybe<Array<WebUsersOrderBy>>;
};

export type User = Node & {
  __typename?: 'User';
  fishies: Scalars['BigInt'];
  id: Scalars['BigInt'];
  isPatron: Scalars['Boolean'];
  lastFishies?: Maybe<Scalars['Datetime']>;
  lastRep?: Maybe<Scalars['Datetime']>;
  lastfmUsername?: Maybe<Scalars['String']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  patronEmoji?: Maybe<Scalars['String']>;
  profileData?: Maybe<Scalars['JSON']>;
  rep: Scalars['BigInt'];
};

/** A condition to be used against `User` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type UserCondition = {
  /** Checks for equality with the object’s `fishies` field. */
  fishies?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `isPatron` field. */
  isPatron?: InputMaybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `lastFishies` field. */
  lastFishies?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `lastRep` field. */
  lastRep?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `lastfmUsername` field. */
  lastfmUsername?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `patronEmoji` field. */
  patronEmoji?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `profileData` field. */
  profileData?: InputMaybe<Scalars['JSON']>;
  /** Checks for equality with the object’s `rep` field. */
  rep?: InputMaybe<Scalars['BigInt']>;
};

/** An input for mutations affecting `User` */
export type UserInput = {
  fishies: Scalars['BigInt'];
  id: Scalars['BigInt'];
  isPatron: Scalars['Boolean'];
  lastFishies?: InputMaybe<Scalars['Datetime']>;
  lastRep?: InputMaybe<Scalars['Datetime']>;
  lastfmUsername?: InputMaybe<Scalars['String']>;
  patronEmoji?: InputMaybe<Scalars['String']>;
  profileData?: InputMaybe<Scalars['JSON']>;
  rep: Scalars['BigInt'];
};

export type UserLevel = Node & {
  __typename?: 'UserLevel';
  guildId: Scalars['BigInt'];
  lastMsg: Scalars['Datetime'];
  msgAllTime: Scalars['BigInt'];
  msgDay: Scalars['BigInt'];
  msgMonth: Scalars['BigInt'];
  msgWeek: Scalars['BigInt'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  userId: Scalars['BigInt'];
};

/** An input for mutations affecting `UserLevel` */
export type UserLevelInput = {
  guildId: Scalars['BigInt'];
  lastMsg: Scalars['Datetime'];
  msgAllTime: Scalars['BigInt'];
  msgDay: Scalars['BigInt'];
  msgMonth: Scalars['BigInt'];
  msgWeek: Scalars['BigInt'];
  userId: Scalars['BigInt'];
};

/** Represents an update to a `UserLevel`. Fields that are set will be updated. */
export type UserLevelPatch = {
  guildId?: InputMaybe<Scalars['BigInt']>;
  lastMsg?: InputMaybe<Scalars['Datetime']>;
  msgAllTime?: InputMaybe<Scalars['BigInt']>;
  msgDay?: InputMaybe<Scalars['BigInt']>;
  msgMonth?: InputMaybe<Scalars['BigInt']>;
  msgWeek?: InputMaybe<Scalars['BigInt']>;
  userId?: InputMaybe<Scalars['BigInt']>;
};

/** A `UserLevel` edge in the connection. */
export type UserLevelsEdge = {
  __typename?: 'UserLevelsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `UserLevel` at the end of the edge. */
  node: UserLevel;
};

/** Methods to use when ordering `UserLevel`. */
export enum UserLevelsOrderBy {
  GuildIdAsc = 'GUILD_ID_ASC',
  GuildIdDesc = 'GUILD_ID_DESC',
  LastMsgAsc = 'LAST_MSG_ASC',
  LastMsgDesc = 'LAST_MSG_DESC',
  MsgAllTimeAsc = 'MSG_ALL_TIME_ASC',
  MsgAllTimeDesc = 'MSG_ALL_TIME_DESC',
  MsgDayAsc = 'MSG_DAY_ASC',
  MsgDayDesc = 'MSG_DAY_DESC',
  MsgMonthAsc = 'MSG_MONTH_ASC',
  MsgMonthDesc = 'MSG_MONTH_DESC',
  MsgWeekAsc = 'MSG_WEEK_ASC',
  MsgWeekDesc = 'MSG_WEEK_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC'
}

/** Represents an update to a `User`. Fields that are set will be updated. */
export type UserPatch = {
  fishies?: InputMaybe<Scalars['BigInt']>;
  id?: InputMaybe<Scalars['BigInt']>;
  isPatron?: InputMaybe<Scalars['Boolean']>;
  lastFishies?: InputMaybe<Scalars['Datetime']>;
  lastRep?: InputMaybe<Scalars['Datetime']>;
  lastfmUsername?: InputMaybe<Scalars['String']>;
  patronEmoji?: InputMaybe<Scalars['String']>;
  profileData?: InputMaybe<Scalars['JSON']>;
  rep?: InputMaybe<Scalars['BigInt']>;
};

/** A connection to a list of `User` values. */
export type UsersConnection = {
  __typename?: 'UsersConnection';
  /** A list of edges which contains the `User` and cursor to aid in pagination. */
  edges: Array<UsersEdge>;
  /** A list of `User` objects. */
  nodes: Array<User>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `User` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `User` edge in the connection. */
export type UsersEdge = {
  __typename?: 'UsersEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `User` at the end of the edge. */
  node: User;
};

/** Methods to use when ordering `User`. */
export enum UsersOrderBy {
  FishiesAsc = 'FISHIES_ASC',
  FishiesDesc = 'FISHIES_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  IsPatronAsc = 'IS_PATRON_ASC',
  IsPatronDesc = 'IS_PATRON_DESC',
  LastfmUsernameAsc = 'LASTFM_USERNAME_ASC',
  LastfmUsernameDesc = 'LASTFM_USERNAME_DESC',
  LastFishiesAsc = 'LAST_FISHIES_ASC',
  LastFishiesDesc = 'LAST_FISHIES_DESC',
  LastRepAsc = 'LAST_REP_ASC',
  LastRepDesc = 'LAST_REP_DESC',
  Natural = 'NATURAL',
  PatronEmojiAsc = 'PATRON_EMOJI_ASC',
  PatronEmojiDesc = 'PATRON_EMOJI_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ProfileDataAsc = 'PROFILE_DATA_ASC',
  ProfileDataDesc = 'PROFILE_DATA_DESC',
  RepAsc = 'REP_ASC',
  RepDesc = 'REP_DESC'
}

/** A user who can log in to the application. */
export type WebUser = Node & {
  __typename?: 'WebUser';
  /** Discord avatar hash. Null if user does not have one. */
  avatar?: Maybe<Scalars['String']>;
  /** First registered on the application. Is not when a user created their Discord account. */
  createdAt: Scalars['Datetime'];
  /** Additional profile details extracted from Discord oauth */
  details: Scalars['JSON'];
  /** Discord disciminator of the user. */
  discriminator: Scalars['Int'];
  /** Unique identifier for the user. This should match their Discord ID. */
  id: Scalars['BigInt'];
  /** If true, the user has elevated privileges. */
  isAdmin: Scalars['Boolean'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  updatedAt: Scalars['Datetime'];
  /** Discord username of the user. */
  username: Scalars['String'];
  /** Reads and enables pagination through a set of `WebUserGuild`. */
  webUserGuildsByUserId: WebUserGuildsConnection;
};


/** A user who can log in to the application. */
export type WebUserWebUserGuildsByUserIdArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<WebUserGuildCondition>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<WebUserGuildsOrderBy>>;
};

/** A condition to be used against `WebUser` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type WebUserCondition = {
  /** Checks for equality with the object’s `avatar` field. */
  avatar?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `details` field. */
  details?: InputMaybe<Scalars['JSON']>;
  /** Checks for equality with the object’s `discriminator` field. */
  discriminator?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `isAdmin` field. */
  isAdmin?: InputMaybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `username` field. */
  username?: InputMaybe<Scalars['String']>;
};

export type WebUserGuild = Node & {
  __typename?: 'WebUserGuild';
  /** Reads a single `CachedGuild` that is related to this `WebUserGuild`. */
  cachedGuildByGuildId?: Maybe<CachedGuild>;
  guildId: Scalars['BigInt'];
  manageGuild?: Maybe<Scalars['Boolean']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  owner: Scalars['Boolean'];
  permissions: Scalars['BigInt'];
  userId: Scalars['BigInt'];
  /** Reads a single `WebUser` that is related to this `WebUserGuild`. */
  webUserByUserId?: Maybe<WebUser>;
};

/**
 * A condition to be used against `WebUserGuild` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type WebUserGuildCondition = {
  /** Checks for equality with the object’s `guildId` field. */
  guildId?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `manageGuild` field. */
  manageGuild?: InputMaybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `owner` field. */
  owner?: InputMaybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `permissions` field. */
  permissions?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['BigInt']>;
};

/** An input for mutations affecting `WebUserGuild` */
export type WebUserGuildInput = {
  guildId: Scalars['BigInt'];
  manageGuild?: InputMaybe<Scalars['Boolean']>;
  owner: Scalars['Boolean'];
  permissions: Scalars['BigInt'];
  userId: Scalars['BigInt'];
};

/** Represents an update to a `WebUserGuild`. Fields that are set will be updated. */
export type WebUserGuildPatch = {
  guildId?: InputMaybe<Scalars['BigInt']>;
  manageGuild?: InputMaybe<Scalars['Boolean']>;
  owner?: InputMaybe<Scalars['Boolean']>;
  permissions?: InputMaybe<Scalars['BigInt']>;
  userId?: InputMaybe<Scalars['BigInt']>;
};

/** A connection to a list of `WebUserGuild` values. */
export type WebUserGuildsConnection = {
  __typename?: 'WebUserGuildsConnection';
  /** A list of edges which contains the `WebUserGuild` and cursor to aid in pagination. */
  edges: Array<WebUserGuildsEdge>;
  /** A list of `WebUserGuild` objects. */
  nodes: Array<WebUserGuild>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `WebUserGuild` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `WebUserGuild` edge in the connection. */
export type WebUserGuildsEdge = {
  __typename?: 'WebUserGuildsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `WebUserGuild` at the end of the edge. */
  node: WebUserGuild;
};

/** Methods to use when ordering `WebUserGuild`. */
export enum WebUserGuildsOrderBy {
  GuildIdAsc = 'GUILD_ID_ASC',
  GuildIdDesc = 'GUILD_ID_DESC',
  ManageGuildAsc = 'MANAGE_GUILD_ASC',
  ManageGuildDesc = 'MANAGE_GUILD_DESC',
  Natural = 'NATURAL',
  OwnerAsc = 'OWNER_ASC',
  OwnerDesc = 'OWNER_DESC',
  PermissionsAsc = 'PERMISSIONS_ASC',
  PermissionsDesc = 'PERMISSIONS_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC'
}

/** An input for mutations affecting `WebUser` */
export type WebUserInput = {
  /** Discord avatar hash. Null if user does not have one. */
  avatar?: InputMaybe<Scalars['String']>;
  /** First registered on the application. Is not when a user created their Discord account. */
  createdAt?: InputMaybe<Scalars['Datetime']>;
  /** Additional profile details extracted from Discord oauth */
  details?: InputMaybe<Scalars['JSON']>;
  /** Discord disciminator of the user. */
  discriminator: Scalars['Int'];
  /** Unique identifier for the user. This should match their Discord ID. */
  id: Scalars['BigInt'];
  /** If true, the user has elevated privileges. */
  isAdmin?: InputMaybe<Scalars['Boolean']>;
  updatedAt?: InputMaybe<Scalars['Datetime']>;
  /** Discord username of the user. */
  username: Scalars['String'];
};

/** Represents an update to a `WebUser`. Fields that are set will be updated. */
export type WebUserPatch = {
  /** Discord avatar hash. Null if user does not have one. */
  avatar?: InputMaybe<Scalars['String']>;
  /** First registered on the application. Is not when a user created their Discord account. */
  createdAt?: InputMaybe<Scalars['Datetime']>;
  /** Additional profile details extracted from Discord oauth */
  details?: InputMaybe<Scalars['JSON']>;
  /** Discord disciminator of the user. */
  discriminator?: InputMaybe<Scalars['Int']>;
  /** Unique identifier for the user. This should match their Discord ID. */
  id?: InputMaybe<Scalars['BigInt']>;
  /** If true, the user has elevated privileges. */
  isAdmin?: InputMaybe<Scalars['Boolean']>;
  updatedAt?: InputMaybe<Scalars['Datetime']>;
  /** Discord username of the user. */
  username?: InputMaybe<Scalars['String']>;
};

/** A connection to a list of `WebUser` values. */
export type WebUsersConnection = {
  __typename?: 'WebUsersConnection';
  /** A list of edges which contains the `WebUser` and cursor to aid in pagination. */
  edges: Array<WebUsersEdge>;
  /** A list of `WebUser` objects. */
  nodes: Array<WebUser>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `WebUser` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `WebUser` edge in the connection. */
export type WebUsersEdge = {
  __typename?: 'WebUsersEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `WebUser` at the end of the edge. */
  node: WebUser;
};

/** Methods to use when ordering `WebUser`. */
export enum WebUsersOrderBy {
  AvatarAsc = 'AVATAR_ASC',
  AvatarDesc = 'AVATAR_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  DetailsAsc = 'DETAILS_ASC',
  DetailsDesc = 'DETAILS_DESC',
  DiscriminatorAsc = 'DISCRIMINATOR_ASC',
  DiscriminatorDesc = 'DISCRIMINATOR_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  IsAdminAsc = 'IS_ADMIN_ASC',
  IsAdminDesc = 'IS_ADMIN_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  UsernameAsc = 'USERNAME_ASC',
  UsernameDesc = 'USERNAME_DESC'
}



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  BotStat: ResolverTypeWrapper<BotStat>;
  BotStatCondition: BotStatCondition;
  BotStatInput: BotStatInput;
  BotStatPatch: BotStatPatch;
  BotStatsConnection: ResolverTypeWrapper<BotStatsConnection>;
  BotStatsEdge: ResolverTypeWrapper<BotStatsEdge>;
  BotStatsOrderBy: BotStatsOrderBy;
  CachedGuild: ResolverTypeWrapper<CachedGuild>;
  CachedGuildInput: CachedGuildInput;
  CachedGuildPatch: CachedGuildPatch;
  CachedGuildsEdge: ResolverTypeWrapper<CachedGuildsEdge>;
  CachedGuildsOrderBy: CachedGuildsOrderBy;
  CachedUser: ResolverTypeWrapper<CachedUser>;
  CachedUserInput: CachedUserInput;
  CachedUserPatch: CachedUserPatch;
  CachedUsersEdge: ResolverTypeWrapper<CachedUsersEdge>;
  CachedUsersOrderBy: CachedUsersOrderBy;
  CreateBotStatInput: CreateBotStatInput;
  CreateBotStatPayload: ResolverTypeWrapper<CreateBotStatPayload>;
  CreateCachedGuildInput: CreateCachedGuildInput;
  CreateCachedGuildPayload: ResolverTypeWrapper<CreateCachedGuildPayload>;
  CreateCachedUserInput: CreateCachedUserInput;
  CreateCachedUserPayload: ResolverTypeWrapper<CreateCachedUserPayload>;
  CreateFeedInput: CreateFeedInput;
  CreateFeedItemInput: CreateFeedItemInput;
  CreateFeedItemPayload: ResolverTypeWrapper<CreateFeedItemPayload>;
  CreateFeedPayload: ResolverTypeWrapper<CreateFeedPayload>;
  CreateFeedSubscriptionInput: CreateFeedSubscriptionInput;
  CreateFeedSubscriptionPayload: ResolverTypeWrapper<CreateFeedSubscriptionPayload>;
  CreateGuildBanInput: CreateGuildBanInput;
  CreateGuildBanPayload: ResolverTypeWrapper<CreateGuildBanPayload>;
  CreateGuildConfigInput: CreateGuildConfigInput;
  CreateGuildConfigPayload: ResolverTypeWrapper<CreateGuildConfigPayload>;
  CreateMemberInput: CreateMemberInput;
  CreateMemberPayload: ResolverTypeWrapper<CreateMemberPayload>;
  CreateMessageInput: CreateMessageInput;
  CreateMessagePayload: ResolverTypeWrapper<CreateMessagePayload>;
  CreateModLogInput: CreateModLogInput;
  CreateModLogPayload: ResolverTypeWrapper<CreateModLogPayload>;
  CreateMuteInput: CreateMuteInput;
  CreateMutePayload: ResolverTypeWrapper<CreateMutePayload>;
  CreateNotificationInput: CreateNotificationInput;
  CreateNotificationPayload: ResolverTypeWrapper<CreateNotificationPayload>;
  CreateReminderInput: CreateReminderInput;
  CreateReminderPayload: ResolverTypeWrapper<CreateReminderPayload>;
  CreateRoleMenuInput: CreateRoleMenuInput;
  CreateRoleMenuPayload: ResolverTypeWrapper<CreateRoleMenuPayload>;
  CreateTagInput: CreateTagInput;
  CreateTagPayload: ResolverTypeWrapper<CreateTagPayload>;
  CreateUserInput: CreateUserInput;
  CreateUserLevelInput: CreateUserLevelInput;
  CreateUserLevelPayload: ResolverTypeWrapper<CreateUserLevelPayload>;
  CreateUserPayload: ResolverTypeWrapper<CreateUserPayload>;
  CreateWebUserGuildInput: CreateWebUserGuildInput;
  CreateWebUserGuildPayload: ResolverTypeWrapper<CreateWebUserGuildPayload>;
  CreateWebUserInput: CreateWebUserInput;
  CreateWebUserPayload: ResolverTypeWrapper<CreateWebUserPayload>;
  CurrentUserManagedGuildIdEdge: ResolverTypeWrapper<CurrentUserManagedGuildIdEdge>;
  CurrentUserManagedGuildIdsConnection: ResolverTypeWrapper<CurrentUserManagedGuildIdsConnection>;
  Cursor: ResolverTypeWrapper<Scalars['Cursor']>;
  Datetime: ResolverTypeWrapper<Scalars['Datetime']>;
  DeleteBotStatByNameAndCategoryInput: DeleteBotStatByNameAndCategoryInput;
  DeleteBotStatInput: DeleteBotStatInput;
  DeleteBotStatPayload: ResolverTypeWrapper<DeleteBotStatPayload>;
  DeleteCachedGuildByIdInput: DeleteCachedGuildByIdInput;
  DeleteCachedGuildInput: DeleteCachedGuildInput;
  DeleteCachedGuildPayload: ResolverTypeWrapper<DeleteCachedGuildPayload>;
  DeleteCachedUserByIdInput: DeleteCachedUserByIdInput;
  DeleteCachedUserInput: DeleteCachedUserInput;
  DeleteCachedUserPayload: ResolverTypeWrapper<DeleteCachedUserPayload>;
  DeleteFeedByFeedIdInput: DeleteFeedByFeedIdInput;
  DeleteFeedInput: DeleteFeedInput;
  DeleteFeedItemByFeedIdAndItemIdInput: DeleteFeedItemByFeedIdAndItemIdInput;
  DeleteFeedItemInput: DeleteFeedItemInput;
  DeleteFeedItemPayload: ResolverTypeWrapper<DeleteFeedItemPayload>;
  DeleteFeedPayload: ResolverTypeWrapper<DeleteFeedPayload>;
  DeleteFeedSubscriptionByFeedIdAndChannelIdInput: DeleteFeedSubscriptionByFeedIdAndChannelIdInput;
  DeleteFeedSubscriptionInput: DeleteFeedSubscriptionInput;
  DeleteFeedSubscriptionPayload: ResolverTypeWrapper<DeleteFeedSubscriptionPayload>;
  DeleteGuildBanByGuildIdAndUserIdInput: DeleteGuildBanByGuildIdAndUserIdInput;
  DeleteGuildBanInput: DeleteGuildBanInput;
  DeleteGuildBanPayload: ResolverTypeWrapper<DeleteGuildBanPayload>;
  DeleteGuildConfigByIdInput: DeleteGuildConfigByIdInput;
  DeleteGuildConfigInput: DeleteGuildConfigInput;
  DeleteGuildConfigPayload: ResolverTypeWrapper<DeleteGuildConfigPayload>;
  DeleteMemberByGuildIdAndUserIdInput: DeleteMemberByGuildIdAndUserIdInput;
  DeleteMemberInput: DeleteMemberInput;
  DeleteMemberPayload: ResolverTypeWrapper<DeleteMemberPayload>;
  DeleteModLogByGuildIdAndCaseIdInput: DeleteModLogByGuildIdAndCaseIdInput;
  DeleteModLogInput: DeleteModLogInput;
  DeleteModLogPayload: ResolverTypeWrapper<DeleteModLogPayload>;
  DeleteMuteByGuildIdAndUserIdInput: DeleteMuteByGuildIdAndUserIdInput;
  DeleteMuteInput: DeleteMuteInput;
  DeleteMutePayload: ResolverTypeWrapper<DeleteMutePayload>;
  DeleteNotificationByUserIdAndGuildIdAndKeywordInput: DeleteNotificationByUserIdAndGuildIdAndKeywordInput;
  DeleteNotificationInput: DeleteNotificationInput;
  DeleteNotificationPayload: ResolverTypeWrapper<DeleteNotificationPayload>;
  DeleteReminderByUserIdAndSetAtInput: DeleteReminderByUserIdAndSetAtInput;
  DeleteReminderInput: DeleteReminderInput;
  DeleteReminderPayload: ResolverTypeWrapper<DeleteReminderPayload>;
  DeleteRoleMenuByMessageIdInput: DeleteRoleMenuByMessageIdInput;
  DeleteRoleMenuInput: DeleteRoleMenuInput;
  DeleteRoleMenuPayload: ResolverTypeWrapper<DeleteRoleMenuPayload>;
  DeleteTagByGuildIdAndTagNameInput: DeleteTagByGuildIdAndTagNameInput;
  DeleteTagInput: DeleteTagInput;
  DeleteTagPayload: ResolverTypeWrapper<DeleteTagPayload>;
  DeleteUserByIdInput: DeleteUserByIdInput;
  DeleteUserInput: DeleteUserInput;
  DeleteUserLevelByUserIdAndGuildIdInput: DeleteUserLevelByUserIdAndGuildIdInput;
  DeleteUserLevelInput: DeleteUserLevelInput;
  DeleteUserLevelPayload: ResolverTypeWrapper<DeleteUserLevelPayload>;
  DeleteUserPayload: ResolverTypeWrapper<DeleteUserPayload>;
  DeleteWebUserByIdInput: DeleteWebUserByIdInput;
  DeleteWebUserGuildByUserIdAndGuildIdInput: DeleteWebUserGuildByUserIdAndGuildIdInput;
  DeleteWebUserGuildInput: DeleteWebUserGuildInput;
  DeleteWebUserGuildPayload: ResolverTypeWrapper<DeleteWebUserGuildPayload>;
  DeleteWebUserInput: DeleteWebUserInput;
  DeleteWebUserPayload: ResolverTypeWrapper<DeleteWebUserPayload>;
  Feed: ResolverTypeWrapper<Feed>;
  FeedCondition: FeedCondition;
  FeedInput: FeedInput;
  FeedItem: ResolverTypeWrapper<FeedItem>;
  FeedItemCondition: FeedItemCondition;
  FeedItemInput: FeedItemInput;
  FeedItemPatch: FeedItemPatch;
  FeedItemsConnection: ResolverTypeWrapper<FeedItemsConnection>;
  FeedItemsEdge: ResolverTypeWrapper<FeedItemsEdge>;
  FeedItemsOrderBy: FeedItemsOrderBy;
  FeedPatch: FeedPatch;
  FeedSubscription: ResolverTypeWrapper<FeedSubscription>;
  FeedSubscriptionCondition: FeedSubscriptionCondition;
  FeedSubscriptionInput: FeedSubscriptionInput;
  FeedSubscriptionPatch: FeedSubscriptionPatch;
  FeedSubscriptionsConnection: ResolverTypeWrapper<FeedSubscriptionsConnection>;
  FeedSubscriptionsEdge: ResolverTypeWrapper<FeedSubscriptionsEdge>;
  FeedSubscriptionsOrderBy: FeedSubscriptionsOrderBy;
  FeedsConnection: ResolverTypeWrapper<FeedsConnection>;
  FeedsEdge: ResolverTypeWrapper<FeedsEdge>;
  FeedsOrderBy: FeedsOrderBy;
  GraphqlInput: GraphqlInput;
  GraphqlPayload: ResolverTypeWrapper<GraphqlPayload>;
  GuildBan: ResolverTypeWrapper<GuildBan>;
  GuildBanCondition: GuildBanCondition;
  GuildBanInput: GuildBanInput;
  GuildBanPatch: GuildBanPatch;
  GuildBansConnection: ResolverTypeWrapper<GuildBansConnection>;
  GuildBansEdge: ResolverTypeWrapper<GuildBansEdge>;
  GuildBansOrderBy: GuildBansOrderBy;
  GuildConfig: ResolverTypeWrapper<GuildConfig>;
  GuildConfigCondition: GuildConfigCondition;
  GuildConfigInput: GuildConfigInput;
  GuildConfigPatch: GuildConfigPatch;
  GuildConfigsConnection: ResolverTypeWrapper<GuildConfigsConnection>;
  GuildConfigsEdge: ResolverTypeWrapper<GuildConfigsEdge>;
  GuildConfigsOrderBy: GuildConfigsOrderBy;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  LevelTimeframe: LevelTimeframe;
  LogoutInput: LogoutInput;
  LogoutPayload: ResolverTypeWrapper<LogoutPayload>;
  Member: ResolverTypeWrapper<Member>;
  MemberCondition: MemberCondition;
  MemberInput: MemberInput;
  MemberPatch: MemberPatch;
  MembersConnection: ResolverTypeWrapper<MembersConnection>;
  MembersEdge: ResolverTypeWrapper<MembersEdge>;
  MembersOrderBy: MembersOrderBy;
  Message: ResolverTypeWrapper<Message>;
  MessageCondition: MessageCondition;
  MessageInput: MessageInput;
  MessagesConnection: ResolverTypeWrapper<MessagesConnection>;
  MessagesEdge: ResolverTypeWrapper<MessagesEdge>;
  MessagesOrderBy: MessagesOrderBy;
  ModLog: ResolverTypeWrapper<ModLog>;
  ModLogCondition: ModLogCondition;
  ModLogInput: ModLogInput;
  ModLogPatch: ModLogPatch;
  ModLogsConnection: ResolverTypeWrapper<ModLogsConnection>;
  ModLogsEdge: ResolverTypeWrapper<ModLogsEdge>;
  ModLogsOrderBy: ModLogsOrderBy;
  Mutation: ResolverTypeWrapper<{}>;
  Mute: ResolverTypeWrapper<Mute>;
  MuteCondition: MuteCondition;
  MuteInput: MuteInput;
  MutePatch: MutePatch;
  MutesConnection: ResolverTypeWrapper<MutesConnection>;
  MutesEdge: ResolverTypeWrapper<MutesEdge>;
  MutesOrderBy: MutesOrderBy;
  Node: ResolversTypes['BotStat'] | ResolversTypes['CachedGuild'] | ResolversTypes['CachedUser'] | ResolversTypes['Feed'] | ResolversTypes['FeedItem'] | ResolversTypes['FeedSubscription'] | ResolversTypes['GuildBan'] | ResolversTypes['GuildConfig'] | ResolversTypes['Member'] | ResolversTypes['ModLog'] | ResolversTypes['Mute'] | ResolversTypes['Notification'] | ResolversTypes['Query'] | ResolversTypes['Reminder'] | ResolversTypes['RoleMenu'] | ResolversTypes['Tag'] | ResolversTypes['User'] | ResolversTypes['UserLevel'] | ResolversTypes['WebUser'] | ResolversTypes['WebUserGuild'];
  Notification: ResolverTypeWrapper<Notification>;
  NotificationCondition: NotificationCondition;
  NotificationInput: NotificationInput;
  NotificationPatch: NotificationPatch;
  NotificationsConnection: ResolverTypeWrapper<NotificationsConnection>;
  NotificationsEdge: ResolverTypeWrapper<NotificationsEdge>;
  NotificationsOrderBy: NotificationsOrderBy;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Query: ResolverTypeWrapper<{}>;
  Reminder: ResolverTypeWrapper<Reminder>;
  ReminderCondition: ReminderCondition;
  ReminderInput: ReminderInput;
  ReminderPatch: ReminderPatch;
  RemindersConnection: ResolverTypeWrapper<RemindersConnection>;
  RemindersEdge: ResolverTypeWrapper<RemindersEdge>;
  RemindersOrderBy: RemindersOrderBy;
  RoleMenu: ResolverTypeWrapper<RoleMenu>;
  RoleMenuCondition: RoleMenuCondition;
  RoleMenuInput: RoleMenuInput;
  RoleMenuPatch: RoleMenuPatch;
  RoleMenusConnection: ResolverTypeWrapper<RoleMenusConnection>;
  RoleMenusEdge: ResolverTypeWrapper<RoleMenusEdge>;
  RoleMenusOrderBy: RoleMenusOrderBy;
  String: ResolverTypeWrapper<Scalars['String']>;
  Tag: ResolverTypeWrapper<Tag>;
  TagCondition: TagCondition;
  TagInput: TagInput;
  TagPatch: TagPatch;
  TagsConnection: ResolverTypeWrapper<TagsConnection>;
  TagsEdge: ResolverTypeWrapper<TagsEdge>;
  TagsOrderBy: TagsOrderBy;
  TimeframeUserLevelEdge: ResolverTypeWrapper<TimeframeUserLevelEdge>;
  TimeframeUserLevelsConnection: ResolverTypeWrapper<TimeframeUserLevelsConnection>;
  TimeframeUserLevelsRecord: ResolverTypeWrapper<TimeframeUserLevelsRecord>;
  UUID: ResolverTypeWrapper<Scalars['UUID']>;
  UpdateBotStatByNameAndCategoryInput: UpdateBotStatByNameAndCategoryInput;
  UpdateBotStatInput: UpdateBotStatInput;
  UpdateBotStatPayload: ResolverTypeWrapper<UpdateBotStatPayload>;
  UpdateCachedGuildByIdInput: UpdateCachedGuildByIdInput;
  UpdateCachedGuildInput: UpdateCachedGuildInput;
  UpdateCachedGuildPayload: ResolverTypeWrapper<UpdateCachedGuildPayload>;
  UpdateCachedUserByIdInput: UpdateCachedUserByIdInput;
  UpdateCachedUserInput: UpdateCachedUserInput;
  UpdateCachedUserPayload: ResolverTypeWrapper<UpdateCachedUserPayload>;
  UpdateFeedByFeedIdInput: UpdateFeedByFeedIdInput;
  UpdateFeedInput: UpdateFeedInput;
  UpdateFeedItemByFeedIdAndItemIdInput: UpdateFeedItemByFeedIdAndItemIdInput;
  UpdateFeedItemInput: UpdateFeedItemInput;
  UpdateFeedItemPayload: ResolverTypeWrapper<UpdateFeedItemPayload>;
  UpdateFeedPayload: ResolverTypeWrapper<UpdateFeedPayload>;
  UpdateFeedSubscriptionByFeedIdAndChannelIdInput: UpdateFeedSubscriptionByFeedIdAndChannelIdInput;
  UpdateFeedSubscriptionInput: UpdateFeedSubscriptionInput;
  UpdateFeedSubscriptionPayload: ResolverTypeWrapper<UpdateFeedSubscriptionPayload>;
  UpdateGuildBanByGuildIdAndUserIdInput: UpdateGuildBanByGuildIdAndUserIdInput;
  UpdateGuildBanInput: UpdateGuildBanInput;
  UpdateGuildBanPayload: ResolverTypeWrapper<UpdateGuildBanPayload>;
  UpdateGuildConfigByIdInput: UpdateGuildConfigByIdInput;
  UpdateGuildConfigInput: UpdateGuildConfigInput;
  UpdateGuildConfigPayload: ResolverTypeWrapper<UpdateGuildConfigPayload>;
  UpdateMemberByGuildIdAndUserIdInput: UpdateMemberByGuildIdAndUserIdInput;
  UpdateMemberInput: UpdateMemberInput;
  UpdateMemberPayload: ResolverTypeWrapper<UpdateMemberPayload>;
  UpdateModLogByGuildIdAndCaseIdInput: UpdateModLogByGuildIdAndCaseIdInput;
  UpdateModLogInput: UpdateModLogInput;
  UpdateModLogPayload: ResolverTypeWrapper<UpdateModLogPayload>;
  UpdateMuteByGuildIdAndUserIdInput: UpdateMuteByGuildIdAndUserIdInput;
  UpdateMuteInput: UpdateMuteInput;
  UpdateMutePayload: ResolverTypeWrapper<UpdateMutePayload>;
  UpdateNotificationByUserIdAndGuildIdAndKeywordInput: UpdateNotificationByUserIdAndGuildIdAndKeywordInput;
  UpdateNotificationInput: UpdateNotificationInput;
  UpdateNotificationPayload: ResolverTypeWrapper<UpdateNotificationPayload>;
  UpdateReminderByUserIdAndSetAtInput: UpdateReminderByUserIdAndSetAtInput;
  UpdateReminderInput: UpdateReminderInput;
  UpdateReminderPayload: ResolverTypeWrapper<UpdateReminderPayload>;
  UpdateRoleMenuByMessageIdInput: UpdateRoleMenuByMessageIdInput;
  UpdateRoleMenuInput: UpdateRoleMenuInput;
  UpdateRoleMenuPayload: ResolverTypeWrapper<UpdateRoleMenuPayload>;
  UpdateTagByGuildIdAndTagNameInput: UpdateTagByGuildIdAndTagNameInput;
  UpdateTagInput: UpdateTagInput;
  UpdateTagPayload: ResolverTypeWrapper<UpdateTagPayload>;
  UpdateUserByIdInput: UpdateUserByIdInput;
  UpdateUserInput: UpdateUserInput;
  UpdateUserLevelByUserIdAndGuildIdInput: UpdateUserLevelByUserIdAndGuildIdInput;
  UpdateUserLevelInput: UpdateUserLevelInput;
  UpdateUserLevelPayload: ResolverTypeWrapper<UpdateUserLevelPayload>;
  UpdateUserPayload: ResolverTypeWrapper<UpdateUserPayload>;
  UpdateWebUserByIdInput: UpdateWebUserByIdInput;
  UpdateWebUserGuildByUserIdAndGuildIdInput: UpdateWebUserGuildByUserIdAndGuildIdInput;
  UpdateWebUserGuildInput: UpdateWebUserGuildInput;
  UpdateWebUserGuildPayload: ResolverTypeWrapper<UpdateWebUserGuildPayload>;
  UpdateWebUserInput: UpdateWebUserInput;
  UpdateWebUserPayload: ResolverTypeWrapper<UpdateWebUserPayload>;
  User: ResolverTypeWrapper<User>;
  UserCondition: UserCondition;
  UserInput: UserInput;
  UserLevel: ResolverTypeWrapper<UserLevel>;
  UserLevelInput: UserLevelInput;
  UserLevelPatch: UserLevelPatch;
  UserLevelsEdge: ResolverTypeWrapper<UserLevelsEdge>;
  UserLevelsOrderBy: UserLevelsOrderBy;
  UserPatch: UserPatch;
  UsersConnection: ResolverTypeWrapper<UsersConnection>;
  UsersEdge: ResolverTypeWrapper<UsersEdge>;
  UsersOrderBy: UsersOrderBy;
  WebUser: ResolverTypeWrapper<WebUser>;
  WebUserCondition: WebUserCondition;
  WebUserGuild: ResolverTypeWrapper<WebUserGuild>;
  WebUserGuildCondition: WebUserGuildCondition;
  WebUserGuildInput: WebUserGuildInput;
  WebUserGuildPatch: WebUserGuildPatch;
  WebUserGuildsConnection: ResolverTypeWrapper<WebUserGuildsConnection>;
  WebUserGuildsEdge: ResolverTypeWrapper<WebUserGuildsEdge>;
  WebUserGuildsOrderBy: WebUserGuildsOrderBy;
  WebUserInput: WebUserInput;
  WebUserPatch: WebUserPatch;
  WebUsersConnection: ResolverTypeWrapper<WebUsersConnection>;
  WebUsersEdge: ResolverTypeWrapper<WebUsersEdge>;
  WebUsersOrderBy: WebUsersOrderBy;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  BigInt: Scalars['BigInt'];
  Boolean: Scalars['Boolean'];
  BotStat: BotStat;
  BotStatCondition: BotStatCondition;
  BotStatInput: BotStatInput;
  BotStatPatch: BotStatPatch;
  BotStatsConnection: BotStatsConnection;
  BotStatsEdge: BotStatsEdge;
  CachedGuild: CachedGuild;
  CachedGuildInput: CachedGuildInput;
  CachedGuildPatch: CachedGuildPatch;
  CachedGuildsEdge: CachedGuildsEdge;
  CachedUser: CachedUser;
  CachedUserInput: CachedUserInput;
  CachedUserPatch: CachedUserPatch;
  CachedUsersEdge: CachedUsersEdge;
  CreateBotStatInput: CreateBotStatInput;
  CreateBotStatPayload: CreateBotStatPayload;
  CreateCachedGuildInput: CreateCachedGuildInput;
  CreateCachedGuildPayload: CreateCachedGuildPayload;
  CreateCachedUserInput: CreateCachedUserInput;
  CreateCachedUserPayload: CreateCachedUserPayload;
  CreateFeedInput: CreateFeedInput;
  CreateFeedItemInput: CreateFeedItemInput;
  CreateFeedItemPayload: CreateFeedItemPayload;
  CreateFeedPayload: CreateFeedPayload;
  CreateFeedSubscriptionInput: CreateFeedSubscriptionInput;
  CreateFeedSubscriptionPayload: CreateFeedSubscriptionPayload;
  CreateGuildBanInput: CreateGuildBanInput;
  CreateGuildBanPayload: CreateGuildBanPayload;
  CreateGuildConfigInput: CreateGuildConfigInput;
  CreateGuildConfigPayload: CreateGuildConfigPayload;
  CreateMemberInput: CreateMemberInput;
  CreateMemberPayload: CreateMemberPayload;
  CreateMessageInput: CreateMessageInput;
  CreateMessagePayload: CreateMessagePayload;
  CreateModLogInput: CreateModLogInput;
  CreateModLogPayload: CreateModLogPayload;
  CreateMuteInput: CreateMuteInput;
  CreateMutePayload: CreateMutePayload;
  CreateNotificationInput: CreateNotificationInput;
  CreateNotificationPayload: CreateNotificationPayload;
  CreateReminderInput: CreateReminderInput;
  CreateReminderPayload: CreateReminderPayload;
  CreateRoleMenuInput: CreateRoleMenuInput;
  CreateRoleMenuPayload: CreateRoleMenuPayload;
  CreateTagInput: CreateTagInput;
  CreateTagPayload: CreateTagPayload;
  CreateUserInput: CreateUserInput;
  CreateUserLevelInput: CreateUserLevelInput;
  CreateUserLevelPayload: CreateUserLevelPayload;
  CreateUserPayload: CreateUserPayload;
  CreateWebUserGuildInput: CreateWebUserGuildInput;
  CreateWebUserGuildPayload: CreateWebUserGuildPayload;
  CreateWebUserInput: CreateWebUserInput;
  CreateWebUserPayload: CreateWebUserPayload;
  CurrentUserManagedGuildIdEdge: CurrentUserManagedGuildIdEdge;
  CurrentUserManagedGuildIdsConnection: CurrentUserManagedGuildIdsConnection;
  Cursor: Scalars['Cursor'];
  Datetime: Scalars['Datetime'];
  DeleteBotStatByNameAndCategoryInput: DeleteBotStatByNameAndCategoryInput;
  DeleteBotStatInput: DeleteBotStatInput;
  DeleteBotStatPayload: DeleteBotStatPayload;
  DeleteCachedGuildByIdInput: DeleteCachedGuildByIdInput;
  DeleteCachedGuildInput: DeleteCachedGuildInput;
  DeleteCachedGuildPayload: DeleteCachedGuildPayload;
  DeleteCachedUserByIdInput: DeleteCachedUserByIdInput;
  DeleteCachedUserInput: DeleteCachedUserInput;
  DeleteCachedUserPayload: DeleteCachedUserPayload;
  DeleteFeedByFeedIdInput: DeleteFeedByFeedIdInput;
  DeleteFeedInput: DeleteFeedInput;
  DeleteFeedItemByFeedIdAndItemIdInput: DeleteFeedItemByFeedIdAndItemIdInput;
  DeleteFeedItemInput: DeleteFeedItemInput;
  DeleteFeedItemPayload: DeleteFeedItemPayload;
  DeleteFeedPayload: DeleteFeedPayload;
  DeleteFeedSubscriptionByFeedIdAndChannelIdInput: DeleteFeedSubscriptionByFeedIdAndChannelIdInput;
  DeleteFeedSubscriptionInput: DeleteFeedSubscriptionInput;
  DeleteFeedSubscriptionPayload: DeleteFeedSubscriptionPayload;
  DeleteGuildBanByGuildIdAndUserIdInput: DeleteGuildBanByGuildIdAndUserIdInput;
  DeleteGuildBanInput: DeleteGuildBanInput;
  DeleteGuildBanPayload: DeleteGuildBanPayload;
  DeleteGuildConfigByIdInput: DeleteGuildConfigByIdInput;
  DeleteGuildConfigInput: DeleteGuildConfigInput;
  DeleteGuildConfigPayload: DeleteGuildConfigPayload;
  DeleteMemberByGuildIdAndUserIdInput: DeleteMemberByGuildIdAndUserIdInput;
  DeleteMemberInput: DeleteMemberInput;
  DeleteMemberPayload: DeleteMemberPayload;
  DeleteModLogByGuildIdAndCaseIdInput: DeleteModLogByGuildIdAndCaseIdInput;
  DeleteModLogInput: DeleteModLogInput;
  DeleteModLogPayload: DeleteModLogPayload;
  DeleteMuteByGuildIdAndUserIdInput: DeleteMuteByGuildIdAndUserIdInput;
  DeleteMuteInput: DeleteMuteInput;
  DeleteMutePayload: DeleteMutePayload;
  DeleteNotificationByUserIdAndGuildIdAndKeywordInput: DeleteNotificationByUserIdAndGuildIdAndKeywordInput;
  DeleteNotificationInput: DeleteNotificationInput;
  DeleteNotificationPayload: DeleteNotificationPayload;
  DeleteReminderByUserIdAndSetAtInput: DeleteReminderByUserIdAndSetAtInput;
  DeleteReminderInput: DeleteReminderInput;
  DeleteReminderPayload: DeleteReminderPayload;
  DeleteRoleMenuByMessageIdInput: DeleteRoleMenuByMessageIdInput;
  DeleteRoleMenuInput: DeleteRoleMenuInput;
  DeleteRoleMenuPayload: DeleteRoleMenuPayload;
  DeleteTagByGuildIdAndTagNameInput: DeleteTagByGuildIdAndTagNameInput;
  DeleteTagInput: DeleteTagInput;
  DeleteTagPayload: DeleteTagPayload;
  DeleteUserByIdInput: DeleteUserByIdInput;
  DeleteUserInput: DeleteUserInput;
  DeleteUserLevelByUserIdAndGuildIdInput: DeleteUserLevelByUserIdAndGuildIdInput;
  DeleteUserLevelInput: DeleteUserLevelInput;
  DeleteUserLevelPayload: DeleteUserLevelPayload;
  DeleteUserPayload: DeleteUserPayload;
  DeleteWebUserByIdInput: DeleteWebUserByIdInput;
  DeleteWebUserGuildByUserIdAndGuildIdInput: DeleteWebUserGuildByUserIdAndGuildIdInput;
  DeleteWebUserGuildInput: DeleteWebUserGuildInput;
  DeleteWebUserGuildPayload: DeleteWebUserGuildPayload;
  DeleteWebUserInput: DeleteWebUserInput;
  DeleteWebUserPayload: DeleteWebUserPayload;
  Feed: Feed;
  FeedCondition: FeedCondition;
  FeedInput: FeedInput;
  FeedItem: FeedItem;
  FeedItemCondition: FeedItemCondition;
  FeedItemInput: FeedItemInput;
  FeedItemPatch: FeedItemPatch;
  FeedItemsConnection: FeedItemsConnection;
  FeedItemsEdge: FeedItemsEdge;
  FeedPatch: FeedPatch;
  FeedSubscription: FeedSubscription;
  FeedSubscriptionCondition: FeedSubscriptionCondition;
  FeedSubscriptionInput: FeedSubscriptionInput;
  FeedSubscriptionPatch: FeedSubscriptionPatch;
  FeedSubscriptionsConnection: FeedSubscriptionsConnection;
  FeedSubscriptionsEdge: FeedSubscriptionsEdge;
  FeedsConnection: FeedsConnection;
  FeedsEdge: FeedsEdge;
  GraphqlInput: GraphqlInput;
  GraphqlPayload: GraphqlPayload;
  GuildBan: GuildBan;
  GuildBanCondition: GuildBanCondition;
  GuildBanInput: GuildBanInput;
  GuildBanPatch: GuildBanPatch;
  GuildBansConnection: GuildBansConnection;
  GuildBansEdge: GuildBansEdge;
  GuildConfig: GuildConfig;
  GuildConfigCondition: GuildConfigCondition;
  GuildConfigInput: GuildConfigInput;
  GuildConfigPatch: GuildConfigPatch;
  GuildConfigsConnection: GuildConfigsConnection;
  GuildConfigsEdge: GuildConfigsEdge;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  JSON: Scalars['JSON'];
  LogoutInput: LogoutInput;
  LogoutPayload: LogoutPayload;
  Member: Member;
  MemberCondition: MemberCondition;
  MemberInput: MemberInput;
  MemberPatch: MemberPatch;
  MembersConnection: MembersConnection;
  MembersEdge: MembersEdge;
  Message: Message;
  MessageCondition: MessageCondition;
  MessageInput: MessageInput;
  MessagesConnection: MessagesConnection;
  MessagesEdge: MessagesEdge;
  ModLog: ModLog;
  ModLogCondition: ModLogCondition;
  ModLogInput: ModLogInput;
  ModLogPatch: ModLogPatch;
  ModLogsConnection: ModLogsConnection;
  ModLogsEdge: ModLogsEdge;
  Mutation: {};
  Mute: Mute;
  MuteCondition: MuteCondition;
  MuteInput: MuteInput;
  MutePatch: MutePatch;
  MutesConnection: MutesConnection;
  MutesEdge: MutesEdge;
  Node: ResolversParentTypes['BotStat'] | ResolversParentTypes['CachedGuild'] | ResolversParentTypes['CachedUser'] | ResolversParentTypes['Feed'] | ResolversParentTypes['FeedItem'] | ResolversParentTypes['FeedSubscription'] | ResolversParentTypes['GuildBan'] | ResolversParentTypes['GuildConfig'] | ResolversParentTypes['Member'] | ResolversParentTypes['ModLog'] | ResolversParentTypes['Mute'] | ResolversParentTypes['Notification'] | ResolversParentTypes['Query'] | ResolversParentTypes['Reminder'] | ResolversParentTypes['RoleMenu'] | ResolversParentTypes['Tag'] | ResolversParentTypes['User'] | ResolversParentTypes['UserLevel'] | ResolversParentTypes['WebUser'] | ResolversParentTypes['WebUserGuild'];
  Notification: Notification;
  NotificationCondition: NotificationCondition;
  NotificationInput: NotificationInput;
  NotificationPatch: NotificationPatch;
  NotificationsConnection: NotificationsConnection;
  NotificationsEdge: NotificationsEdge;
  PageInfo: PageInfo;
  Query: {};
  Reminder: Reminder;
  ReminderCondition: ReminderCondition;
  ReminderInput: ReminderInput;
  ReminderPatch: ReminderPatch;
  RemindersConnection: RemindersConnection;
  RemindersEdge: RemindersEdge;
  RoleMenu: RoleMenu;
  RoleMenuCondition: RoleMenuCondition;
  RoleMenuInput: RoleMenuInput;
  RoleMenuPatch: RoleMenuPatch;
  RoleMenusConnection: RoleMenusConnection;
  RoleMenusEdge: RoleMenusEdge;
  String: Scalars['String'];
  Tag: Tag;
  TagCondition: TagCondition;
  TagInput: TagInput;
  TagPatch: TagPatch;
  TagsConnection: TagsConnection;
  TagsEdge: TagsEdge;
  TimeframeUserLevelEdge: TimeframeUserLevelEdge;
  TimeframeUserLevelsConnection: TimeframeUserLevelsConnection;
  TimeframeUserLevelsRecord: TimeframeUserLevelsRecord;
  UUID: Scalars['UUID'];
  UpdateBotStatByNameAndCategoryInput: UpdateBotStatByNameAndCategoryInput;
  UpdateBotStatInput: UpdateBotStatInput;
  UpdateBotStatPayload: UpdateBotStatPayload;
  UpdateCachedGuildByIdInput: UpdateCachedGuildByIdInput;
  UpdateCachedGuildInput: UpdateCachedGuildInput;
  UpdateCachedGuildPayload: UpdateCachedGuildPayload;
  UpdateCachedUserByIdInput: UpdateCachedUserByIdInput;
  UpdateCachedUserInput: UpdateCachedUserInput;
  UpdateCachedUserPayload: UpdateCachedUserPayload;
  UpdateFeedByFeedIdInput: UpdateFeedByFeedIdInput;
  UpdateFeedInput: UpdateFeedInput;
  UpdateFeedItemByFeedIdAndItemIdInput: UpdateFeedItemByFeedIdAndItemIdInput;
  UpdateFeedItemInput: UpdateFeedItemInput;
  UpdateFeedItemPayload: UpdateFeedItemPayload;
  UpdateFeedPayload: UpdateFeedPayload;
  UpdateFeedSubscriptionByFeedIdAndChannelIdInput: UpdateFeedSubscriptionByFeedIdAndChannelIdInput;
  UpdateFeedSubscriptionInput: UpdateFeedSubscriptionInput;
  UpdateFeedSubscriptionPayload: UpdateFeedSubscriptionPayload;
  UpdateGuildBanByGuildIdAndUserIdInput: UpdateGuildBanByGuildIdAndUserIdInput;
  UpdateGuildBanInput: UpdateGuildBanInput;
  UpdateGuildBanPayload: UpdateGuildBanPayload;
  UpdateGuildConfigByIdInput: UpdateGuildConfigByIdInput;
  UpdateGuildConfigInput: UpdateGuildConfigInput;
  UpdateGuildConfigPayload: UpdateGuildConfigPayload;
  UpdateMemberByGuildIdAndUserIdInput: UpdateMemberByGuildIdAndUserIdInput;
  UpdateMemberInput: UpdateMemberInput;
  UpdateMemberPayload: UpdateMemberPayload;
  UpdateModLogByGuildIdAndCaseIdInput: UpdateModLogByGuildIdAndCaseIdInput;
  UpdateModLogInput: UpdateModLogInput;
  UpdateModLogPayload: UpdateModLogPayload;
  UpdateMuteByGuildIdAndUserIdInput: UpdateMuteByGuildIdAndUserIdInput;
  UpdateMuteInput: UpdateMuteInput;
  UpdateMutePayload: UpdateMutePayload;
  UpdateNotificationByUserIdAndGuildIdAndKeywordInput: UpdateNotificationByUserIdAndGuildIdAndKeywordInput;
  UpdateNotificationInput: UpdateNotificationInput;
  UpdateNotificationPayload: UpdateNotificationPayload;
  UpdateReminderByUserIdAndSetAtInput: UpdateReminderByUserIdAndSetAtInput;
  UpdateReminderInput: UpdateReminderInput;
  UpdateReminderPayload: UpdateReminderPayload;
  UpdateRoleMenuByMessageIdInput: UpdateRoleMenuByMessageIdInput;
  UpdateRoleMenuInput: UpdateRoleMenuInput;
  UpdateRoleMenuPayload: UpdateRoleMenuPayload;
  UpdateTagByGuildIdAndTagNameInput: UpdateTagByGuildIdAndTagNameInput;
  UpdateTagInput: UpdateTagInput;
  UpdateTagPayload: UpdateTagPayload;
  UpdateUserByIdInput: UpdateUserByIdInput;
  UpdateUserInput: UpdateUserInput;
  UpdateUserLevelByUserIdAndGuildIdInput: UpdateUserLevelByUserIdAndGuildIdInput;
  UpdateUserLevelInput: UpdateUserLevelInput;
  UpdateUserLevelPayload: UpdateUserLevelPayload;
  UpdateUserPayload: UpdateUserPayload;
  UpdateWebUserByIdInput: UpdateWebUserByIdInput;
  UpdateWebUserGuildByUserIdAndGuildIdInput: UpdateWebUserGuildByUserIdAndGuildIdInput;
  UpdateWebUserGuildInput: UpdateWebUserGuildInput;
  UpdateWebUserGuildPayload: UpdateWebUserGuildPayload;
  UpdateWebUserInput: UpdateWebUserInput;
  UpdateWebUserPayload: UpdateWebUserPayload;
  User: User;
  UserCondition: UserCondition;
  UserInput: UserInput;
  UserLevel: UserLevel;
  UserLevelInput: UserLevelInput;
  UserLevelPatch: UserLevelPatch;
  UserLevelsEdge: UserLevelsEdge;
  UserPatch: UserPatch;
  UsersConnection: UsersConnection;
  UsersEdge: UsersEdge;
  WebUser: WebUser;
  WebUserCondition: WebUserCondition;
  WebUserGuild: WebUserGuild;
  WebUserGuildCondition: WebUserGuildCondition;
  WebUserGuildInput: WebUserGuildInput;
  WebUserGuildPatch: WebUserGuildPatch;
  WebUserGuildsConnection: WebUserGuildsConnection;
  WebUserGuildsEdge: WebUserGuildsEdge;
  WebUserInput: WebUserInput;
  WebUserPatch: WebUserPatch;
  WebUsersConnection: WebUsersConnection;
  WebUsersEdge: WebUsersEdge;
};

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export type BotStatResolvers<ContextType = any, ParentType extends ResolversParentTypes['BotStat'] = ResolversParentTypes['BotStat']> = {
  category?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  count?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BotStatsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['BotStatsConnection'] = ResolversParentTypes['BotStatsConnection']> = {
  edges?: Resolver<Array<ResolversTypes['BotStatsEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['BotStat']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BotStatsEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['BotStatsEdge'] = ResolversParentTypes['BotStatsEdge']> = {
  cursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['BotStat'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CachedGuildResolvers<ContextType = any, ParentType extends ResolversParentTypes['CachedGuild'] = ResolversParentTypes['CachedGuild']> = {
  banner?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  features?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  guildConfigById?: Resolver<Maybe<ResolversTypes['GuildConfig']>, ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  splash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  webUserGuildsByGuildId?: Resolver<ResolversTypes['WebUserGuildsConnection'], ParentType, ContextType, RequireFields<CachedGuildWebUserGuildsByGuildIdArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CachedGuildsEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['CachedGuildsEdge'] = ResolversParentTypes['CachedGuildsEdge']> = {
  cursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['CachedGuild'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CachedUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['CachedUser'] = ResolversParentTypes['CachedUser']> = {
  avatarUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  discriminator?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  lastChecked?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CachedUsersEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['CachedUsersEdge'] = ResolversParentTypes['CachedUsersEdge']> = {
  cursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['CachedUser'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateBotStatPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateBotStatPayload'] = ResolversParentTypes['CreateBotStatPayload']> = {
  botStat?: Resolver<Maybe<ResolversTypes['BotStat']>, ParentType, ContextType>;
  botStatEdge?: Resolver<Maybe<ResolversTypes['BotStatsEdge']>, ParentType, ContextType, RequireFields<CreateBotStatPayloadBotStatEdgeArgs, 'orderBy'>>;
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateCachedGuildPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateCachedGuildPayload'] = ResolversParentTypes['CreateCachedGuildPayload']> = {
  cachedGuild?: Resolver<Maybe<ResolversTypes['CachedGuild']>, ParentType, ContextType>;
  cachedGuildEdge?: Resolver<Maybe<ResolversTypes['CachedGuildsEdge']>, ParentType, ContextType, RequireFields<CreateCachedGuildPayloadCachedGuildEdgeArgs, 'orderBy'>>;
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateCachedUserPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateCachedUserPayload'] = ResolversParentTypes['CreateCachedUserPayload']> = {
  cachedUser?: Resolver<Maybe<ResolversTypes['CachedUser']>, ParentType, ContextType>;
  cachedUserEdge?: Resolver<Maybe<ResolversTypes['CachedUsersEdge']>, ParentType, ContextType, RequireFields<CreateCachedUserPayloadCachedUserEdgeArgs, 'orderBy'>>;
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateFeedItemPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateFeedItemPayload'] = ResolversParentTypes['CreateFeedItemPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  feedItem?: Resolver<Maybe<ResolversTypes['FeedItem']>, ParentType, ContextType>;
  feedItemEdge?: Resolver<Maybe<ResolversTypes['FeedItemsEdge']>, ParentType, ContextType, RequireFields<CreateFeedItemPayloadFeedItemEdgeArgs, 'orderBy'>>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateFeedPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateFeedPayload'] = ResolversParentTypes['CreateFeedPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  feed?: Resolver<Maybe<ResolversTypes['Feed']>, ParentType, ContextType>;
  feedEdge?: Resolver<Maybe<ResolversTypes['FeedsEdge']>, ParentType, ContextType, RequireFields<CreateFeedPayloadFeedEdgeArgs, 'orderBy'>>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateFeedSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateFeedSubscriptionPayload'] = ResolversParentTypes['CreateFeedSubscriptionPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  feedByFeedId?: Resolver<Maybe<ResolversTypes['Feed']>, ParentType, ContextType>;
  feedSubscription?: Resolver<Maybe<ResolversTypes['FeedSubscription']>, ParentType, ContextType>;
  feedSubscriptionEdge?: Resolver<Maybe<ResolversTypes['FeedSubscriptionsEdge']>, ParentType, ContextType, RequireFields<CreateFeedSubscriptionPayloadFeedSubscriptionEdgeArgs, 'orderBy'>>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateGuildBanPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateGuildBanPayload'] = ResolversParentTypes['CreateGuildBanPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  guildBan?: Resolver<Maybe<ResolversTypes['GuildBan']>, ParentType, ContextType>;
  guildBanEdge?: Resolver<Maybe<ResolversTypes['GuildBansEdge']>, ParentType, ContextType, RequireFields<CreateGuildBanPayloadGuildBanEdgeArgs, 'orderBy'>>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateGuildConfigPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateGuildConfigPayload'] = ResolversParentTypes['CreateGuildConfigPayload']> = {
  cachedGuildById?: Resolver<Maybe<ResolversTypes['CachedGuild']>, ParentType, ContextType>;
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  guildConfig?: Resolver<Maybe<ResolversTypes['GuildConfig']>, ParentType, ContextType>;
  guildConfigEdge?: Resolver<Maybe<ResolversTypes['GuildConfigsEdge']>, ParentType, ContextType, RequireFields<CreateGuildConfigPayloadGuildConfigEdgeArgs, 'orderBy'>>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateMemberPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateMemberPayload'] = ResolversParentTypes['CreateMemberPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  member?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType>;
  memberEdge?: Resolver<Maybe<ResolversTypes['MembersEdge']>, ParentType, ContextType, RequireFields<CreateMemberPayloadMemberEdgeArgs, 'orderBy'>>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateMessagePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateMessagePayload'] = ResolversParentTypes['CreateMessagePayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['Message']>, ParentType, ContextType>;
  messageEdge?: Resolver<Maybe<ResolversTypes['MessagesEdge']>, ParentType, ContextType, RequireFields<CreateMessagePayloadMessageEdgeArgs, 'orderBy'>>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateModLogPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateModLogPayload'] = ResolversParentTypes['CreateModLogPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  modLog?: Resolver<Maybe<ResolversTypes['ModLog']>, ParentType, ContextType>;
  modLogEdge?: Resolver<Maybe<ResolversTypes['ModLogsEdge']>, ParentType, ContextType, RequireFields<CreateModLogPayloadModLogEdgeArgs, 'orderBy'>>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateMutePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateMutePayload'] = ResolversParentTypes['CreateMutePayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  modLogByGuildIdAndCaseId?: Resolver<Maybe<ResolversTypes['ModLog']>, ParentType, ContextType>;
  mute?: Resolver<Maybe<ResolversTypes['Mute']>, ParentType, ContextType>;
  muteEdge?: Resolver<Maybe<ResolversTypes['MutesEdge']>, ParentType, ContextType, RequireFields<CreateMutePayloadMuteEdgeArgs, 'orderBy'>>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateNotificationPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateNotificationPayload'] = ResolversParentTypes['CreateNotificationPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  notification?: Resolver<Maybe<ResolversTypes['Notification']>, ParentType, ContextType>;
  notificationEdge?: Resolver<Maybe<ResolversTypes['NotificationsEdge']>, ParentType, ContextType, RequireFields<CreateNotificationPayloadNotificationEdgeArgs, 'orderBy'>>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateReminderPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateReminderPayload'] = ResolversParentTypes['CreateReminderPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  reminder?: Resolver<Maybe<ResolversTypes['Reminder']>, ParentType, ContextType>;
  reminderEdge?: Resolver<Maybe<ResolversTypes['RemindersEdge']>, ParentType, ContextType, RequireFields<CreateReminderPayloadReminderEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateRoleMenuPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateRoleMenuPayload'] = ResolversParentTypes['CreateRoleMenuPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  roleMenu?: Resolver<Maybe<ResolversTypes['RoleMenu']>, ParentType, ContextType>;
  roleMenuEdge?: Resolver<Maybe<ResolversTypes['RoleMenusEdge']>, ParentType, ContextType, RequireFields<CreateRoleMenuPayloadRoleMenuEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateTagPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateTagPayload'] = ResolversParentTypes['CreateTagPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  tag?: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType>;
  tagEdge?: Resolver<Maybe<ResolversTypes['TagsEdge']>, ParentType, ContextType, RequireFields<CreateTagPayloadTagEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateUserLevelPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateUserLevelPayload'] = ResolversParentTypes['CreateUserLevelPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userLevel?: Resolver<Maybe<ResolversTypes['UserLevel']>, ParentType, ContextType>;
  userLevelEdge?: Resolver<Maybe<ResolversTypes['UserLevelsEdge']>, ParentType, ContextType, RequireFields<CreateUserLevelPayloadUserLevelEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateUserPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateUserPayload'] = ResolversParentTypes['CreateUserPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userEdge?: Resolver<Maybe<ResolversTypes['UsersEdge']>, ParentType, ContextType, RequireFields<CreateUserPayloadUserEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateWebUserGuildPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateWebUserGuildPayload'] = ResolversParentTypes['CreateWebUserGuildPayload']> = {
  cachedGuildByGuildId?: Resolver<Maybe<ResolversTypes['CachedGuild']>, ParentType, ContextType>;
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  webUserByUserId?: Resolver<Maybe<ResolversTypes['WebUser']>, ParentType, ContextType>;
  webUserGuild?: Resolver<Maybe<ResolversTypes['WebUserGuild']>, ParentType, ContextType>;
  webUserGuildEdge?: Resolver<Maybe<ResolversTypes['WebUserGuildsEdge']>, ParentType, ContextType, RequireFields<CreateWebUserGuildPayloadWebUserGuildEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateWebUserPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateWebUserPayload'] = ResolversParentTypes['CreateWebUserPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  webUser?: Resolver<Maybe<ResolversTypes['WebUser']>, ParentType, ContextType>;
  webUserEdge?: Resolver<Maybe<ResolversTypes['WebUsersEdge']>, ParentType, ContextType, RequireFields<CreateWebUserPayloadWebUserEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CurrentUserManagedGuildIdEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['CurrentUserManagedGuildIdEdge'] = ResolversParentTypes['CurrentUserManagedGuildIdEdge']> = {
  cursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  node?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CurrentUserManagedGuildIdsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['CurrentUserManagedGuildIdsConnection'] = ResolversParentTypes['CurrentUserManagedGuildIdsConnection']> = {
  edges?: Resolver<Array<ResolversTypes['CurrentUserManagedGuildIdEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<Maybe<ResolversTypes['BigInt']>>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface CursorScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Cursor'], any> {
  name: 'Cursor';
}

export interface DatetimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Datetime'], any> {
  name: 'Datetime';
}

export type DeleteBotStatPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteBotStatPayload'] = ResolversParentTypes['DeleteBotStatPayload']> = {
  botStat?: Resolver<Maybe<ResolversTypes['BotStat']>, ParentType, ContextType>;
  botStatEdge?: Resolver<Maybe<ResolversTypes['BotStatsEdge']>, ParentType, ContextType, RequireFields<DeleteBotStatPayloadBotStatEdgeArgs, 'orderBy'>>;
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deletedBotStatId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteCachedGuildPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteCachedGuildPayload'] = ResolversParentTypes['DeleteCachedGuildPayload']> = {
  cachedGuild?: Resolver<Maybe<ResolversTypes['CachedGuild']>, ParentType, ContextType>;
  cachedGuildEdge?: Resolver<Maybe<ResolversTypes['CachedGuildsEdge']>, ParentType, ContextType, RequireFields<DeleteCachedGuildPayloadCachedGuildEdgeArgs, 'orderBy'>>;
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deletedCachedGuildId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteCachedUserPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteCachedUserPayload'] = ResolversParentTypes['DeleteCachedUserPayload']> = {
  cachedUser?: Resolver<Maybe<ResolversTypes['CachedUser']>, ParentType, ContextType>;
  cachedUserEdge?: Resolver<Maybe<ResolversTypes['CachedUsersEdge']>, ParentType, ContextType, RequireFields<DeleteCachedUserPayloadCachedUserEdgeArgs, 'orderBy'>>;
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deletedCachedUserId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteFeedItemPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteFeedItemPayload'] = ResolversParentTypes['DeleteFeedItemPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deletedFeedItemId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  feedItem?: Resolver<Maybe<ResolversTypes['FeedItem']>, ParentType, ContextType>;
  feedItemEdge?: Resolver<Maybe<ResolversTypes['FeedItemsEdge']>, ParentType, ContextType, RequireFields<DeleteFeedItemPayloadFeedItemEdgeArgs, 'orderBy'>>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteFeedPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteFeedPayload'] = ResolversParentTypes['DeleteFeedPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deletedFeedId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  feed?: Resolver<Maybe<ResolversTypes['Feed']>, ParentType, ContextType>;
  feedEdge?: Resolver<Maybe<ResolversTypes['FeedsEdge']>, ParentType, ContextType, RequireFields<DeleteFeedPayloadFeedEdgeArgs, 'orderBy'>>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteFeedSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteFeedSubscriptionPayload'] = ResolversParentTypes['DeleteFeedSubscriptionPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deletedFeedSubscriptionId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  feedByFeedId?: Resolver<Maybe<ResolversTypes['Feed']>, ParentType, ContextType>;
  feedSubscription?: Resolver<Maybe<ResolversTypes['FeedSubscription']>, ParentType, ContextType>;
  feedSubscriptionEdge?: Resolver<Maybe<ResolversTypes['FeedSubscriptionsEdge']>, ParentType, ContextType, RequireFields<DeleteFeedSubscriptionPayloadFeedSubscriptionEdgeArgs, 'orderBy'>>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteGuildBanPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteGuildBanPayload'] = ResolversParentTypes['DeleteGuildBanPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deletedGuildBanId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  guildBan?: Resolver<Maybe<ResolversTypes['GuildBan']>, ParentType, ContextType>;
  guildBanEdge?: Resolver<Maybe<ResolversTypes['GuildBansEdge']>, ParentType, ContextType, RequireFields<DeleteGuildBanPayloadGuildBanEdgeArgs, 'orderBy'>>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteGuildConfigPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteGuildConfigPayload'] = ResolversParentTypes['DeleteGuildConfigPayload']> = {
  cachedGuildById?: Resolver<Maybe<ResolversTypes['CachedGuild']>, ParentType, ContextType>;
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deletedGuildConfigId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  guildConfig?: Resolver<Maybe<ResolversTypes['GuildConfig']>, ParentType, ContextType>;
  guildConfigEdge?: Resolver<Maybe<ResolversTypes['GuildConfigsEdge']>, ParentType, ContextType, RequireFields<DeleteGuildConfigPayloadGuildConfigEdgeArgs, 'orderBy'>>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteMemberPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteMemberPayload'] = ResolversParentTypes['DeleteMemberPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deletedMemberId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  member?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType>;
  memberEdge?: Resolver<Maybe<ResolversTypes['MembersEdge']>, ParentType, ContextType, RequireFields<DeleteMemberPayloadMemberEdgeArgs, 'orderBy'>>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteModLogPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteModLogPayload'] = ResolversParentTypes['DeleteModLogPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deletedModLogId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  modLog?: Resolver<Maybe<ResolversTypes['ModLog']>, ParentType, ContextType>;
  modLogEdge?: Resolver<Maybe<ResolversTypes['ModLogsEdge']>, ParentType, ContextType, RequireFields<DeleteModLogPayloadModLogEdgeArgs, 'orderBy'>>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteMutePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteMutePayload'] = ResolversParentTypes['DeleteMutePayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deletedMuteId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  modLogByGuildIdAndCaseId?: Resolver<Maybe<ResolversTypes['ModLog']>, ParentType, ContextType>;
  mute?: Resolver<Maybe<ResolversTypes['Mute']>, ParentType, ContextType>;
  muteEdge?: Resolver<Maybe<ResolversTypes['MutesEdge']>, ParentType, ContextType, RequireFields<DeleteMutePayloadMuteEdgeArgs, 'orderBy'>>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteNotificationPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteNotificationPayload'] = ResolversParentTypes['DeleteNotificationPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deletedNotificationId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  notification?: Resolver<Maybe<ResolversTypes['Notification']>, ParentType, ContextType>;
  notificationEdge?: Resolver<Maybe<ResolversTypes['NotificationsEdge']>, ParentType, ContextType, RequireFields<DeleteNotificationPayloadNotificationEdgeArgs, 'orderBy'>>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteReminderPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteReminderPayload'] = ResolversParentTypes['DeleteReminderPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deletedReminderId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  reminder?: Resolver<Maybe<ResolversTypes['Reminder']>, ParentType, ContextType>;
  reminderEdge?: Resolver<Maybe<ResolversTypes['RemindersEdge']>, ParentType, ContextType, RequireFields<DeleteReminderPayloadReminderEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteRoleMenuPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteRoleMenuPayload'] = ResolversParentTypes['DeleteRoleMenuPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deletedRoleMenuId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  roleMenu?: Resolver<Maybe<ResolversTypes['RoleMenu']>, ParentType, ContextType>;
  roleMenuEdge?: Resolver<Maybe<ResolversTypes['RoleMenusEdge']>, ParentType, ContextType, RequireFields<DeleteRoleMenuPayloadRoleMenuEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteTagPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteTagPayload'] = ResolversParentTypes['DeleteTagPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deletedTagId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  tag?: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType>;
  tagEdge?: Resolver<Maybe<ResolversTypes['TagsEdge']>, ParentType, ContextType, RequireFields<DeleteTagPayloadTagEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteUserLevelPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteUserLevelPayload'] = ResolversParentTypes['DeleteUserLevelPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deletedUserLevelId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userLevel?: Resolver<Maybe<ResolversTypes['UserLevel']>, ParentType, ContextType>;
  userLevelEdge?: Resolver<Maybe<ResolversTypes['UserLevelsEdge']>, ParentType, ContextType, RequireFields<DeleteUserLevelPayloadUserLevelEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteUserPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteUserPayload'] = ResolversParentTypes['DeleteUserPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deletedUserId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userEdge?: Resolver<Maybe<ResolversTypes['UsersEdge']>, ParentType, ContextType, RequireFields<DeleteUserPayloadUserEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteWebUserGuildPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteWebUserGuildPayload'] = ResolversParentTypes['DeleteWebUserGuildPayload']> = {
  cachedGuildByGuildId?: Resolver<Maybe<ResolversTypes['CachedGuild']>, ParentType, ContextType>;
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deletedWebUserGuildId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  webUserByUserId?: Resolver<Maybe<ResolversTypes['WebUser']>, ParentType, ContextType>;
  webUserGuild?: Resolver<Maybe<ResolversTypes['WebUserGuild']>, ParentType, ContextType>;
  webUserGuildEdge?: Resolver<Maybe<ResolversTypes['WebUserGuildsEdge']>, ParentType, ContextType, RequireFields<DeleteWebUserGuildPayloadWebUserGuildEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteWebUserPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteWebUserPayload'] = ResolversParentTypes['DeleteWebUserPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deletedWebUserId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  webUser?: Resolver<Maybe<ResolversTypes['WebUser']>, ParentType, ContextType>;
  webUserEdge?: Resolver<Maybe<ResolversTypes['WebUsersEdge']>, ParentType, ContextType, RequireFields<DeleteWebUserPayloadWebUserEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FeedResolvers<ContextType = any, ParentType extends ResolversParentTypes['Feed'] = ResolversParentTypes['Feed']> = {
  feedId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  feedSubscriptionsByFeedId?: Resolver<ResolversTypes['FeedSubscriptionsConnection'], ParentType, ContextType, RequireFields<FeedFeedSubscriptionsByFeedIdArgs, 'orderBy'>>;
  metadata?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FeedItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedItem'] = ResolversParentTypes['FeedItem']> = {
  feedId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  itemId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FeedItemsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedItemsConnection'] = ResolversParentTypes['FeedItemsConnection']> = {
  edges?: Resolver<Array<ResolversTypes['FeedItemsEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['FeedItem']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FeedItemsEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedItemsEdge'] = ResolversParentTypes['FeedItemsEdge']> = {
  cursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['FeedItem'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FeedSubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedSubscription'] = ResolversParentTypes['FeedSubscription']> = {
  channelId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  feedByFeedId?: Resolver<Maybe<ResolversTypes['Feed']>, ParentType, ContextType>;
  feedId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  guildId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  mentionRole?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FeedSubscriptionsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedSubscriptionsConnection'] = ResolversParentTypes['FeedSubscriptionsConnection']> = {
  edges?: Resolver<Array<ResolversTypes['FeedSubscriptionsEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['FeedSubscription']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FeedSubscriptionsEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedSubscriptionsEdge'] = ResolversParentTypes['FeedSubscriptionsEdge']> = {
  cursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['FeedSubscription'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FeedsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedsConnection'] = ResolversParentTypes['FeedsConnection']> = {
  edges?: Resolver<Array<ResolversTypes['FeedsEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['Feed']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FeedsEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedsEdge'] = ResolversParentTypes['FeedsEdge']> = {
  cursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Feed'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GraphqlPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['GraphqlPayload'] = ResolversParentTypes['GraphqlPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  json?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuildBanResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuildBan'] = ResolversParentTypes['GuildBan']> = {
  guildId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuildBansConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuildBansConnection'] = ResolversParentTypes['GuildBansConnection']> = {
  edges?: Resolver<Array<ResolversTypes['GuildBansEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['GuildBan']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuildBansEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuildBansEdge'] = ResolversParentTypes['GuildBansEdge']> = {
  cursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['GuildBan'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuildConfigResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuildConfig'] = ResolversParentTypes['GuildConfig']> = {
  cachedGuildById?: Resolver<Maybe<ResolversTypes['CachedGuild']>, ParentType, ContextType>;
  data?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  disabledChannels?: Resolver<Maybe<Array<Maybe<ResolversTypes['BigInt']>>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  inviteGuard?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  joinMsg?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  joinMsgEnabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  joinReact?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  leaveMsg?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  leaveMsgEnabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  logMember?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  logMemberEnabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  logMod?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  logModEnabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  logMsg?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  logMsgEnabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  maxMention?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  msgChannel?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  muteDmEnabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  muteDmText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  muteDuration?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  muteRole?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  prefix?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  roleChannel?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  roleConfig?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  roleEnabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  warnDmEnabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  warnDmText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuildConfigsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuildConfigsConnection'] = ResolversParentTypes['GuildConfigsConnection']> = {
  edges?: Resolver<Array<ResolversTypes['GuildConfigsEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['GuildConfig']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuildConfigsEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuildConfigsEdge'] = ResolversParentTypes['GuildConfigsEdge']> = {
  cursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['GuildConfig'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type LogoutPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['LogoutPayload'] = ResolversParentTypes['LogoutPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MemberResolvers<ContextType = any, ParentType extends ResolversParentTypes['Member'] = ResolversParentTypes['Member']> = {
  guildId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  joinTime?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MembersConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['MembersConnection'] = ResolversParentTypes['MembersConnection']> = {
  edges?: Resolver<Array<ResolversTypes['MembersEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['Member']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MembersEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['MembersEdge'] = ResolversParentTypes['MembersEdge']> = {
  cursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Member'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MessageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Message'] = ResolversParentTypes['Message']> = {
  authorId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  channelId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  guildId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  messageId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  msg?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MessagesConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['MessagesConnection'] = ResolversParentTypes['MessagesConnection']> = {
  edges?: Resolver<Array<ResolversTypes['MessagesEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['Message']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MessagesEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['MessagesEdge'] = ResolversParentTypes['MessagesEdge']> = {
  cursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Message'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ModLogResolvers<ContextType = any, ParentType extends ResolversParentTypes['ModLog'] = ResolversParentTypes['ModLog']> = {
  action?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  actionTime?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  attachments?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  caseId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  executorId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  guildId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  msgId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  mutesByGuildIdAndCaseId?: Resolver<ResolversTypes['MutesConnection'], ParentType, ContextType, RequireFields<ModLogMutesByGuildIdAndCaseIdArgs, 'orderBy'>>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  pending?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  userTag?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ModLogsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['ModLogsConnection'] = ResolversParentTypes['ModLogsConnection']> = {
  edges?: Resolver<Array<ResolversTypes['ModLogsEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['ModLog']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ModLogsEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['ModLogsEdge'] = ResolversParentTypes['ModLogsEdge']> = {
  cursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['ModLog'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createBotStat?: Resolver<Maybe<ResolversTypes['CreateBotStatPayload']>, ParentType, ContextType, RequireFields<MutationCreateBotStatArgs, 'input'>>;
  createCachedGuild?: Resolver<Maybe<ResolversTypes['CreateCachedGuildPayload']>, ParentType, ContextType, RequireFields<MutationCreateCachedGuildArgs, 'input'>>;
  createCachedUser?: Resolver<Maybe<ResolversTypes['CreateCachedUserPayload']>, ParentType, ContextType, RequireFields<MutationCreateCachedUserArgs, 'input'>>;
  createFeed?: Resolver<Maybe<ResolversTypes['CreateFeedPayload']>, ParentType, ContextType, RequireFields<MutationCreateFeedArgs, 'input'>>;
  createFeedItem?: Resolver<Maybe<ResolversTypes['CreateFeedItemPayload']>, ParentType, ContextType, RequireFields<MutationCreateFeedItemArgs, 'input'>>;
  createFeedSubscription?: Resolver<Maybe<ResolversTypes['CreateFeedSubscriptionPayload']>, ParentType, ContextType, RequireFields<MutationCreateFeedSubscriptionArgs, 'input'>>;
  createGuildBan?: Resolver<Maybe<ResolversTypes['CreateGuildBanPayload']>, ParentType, ContextType, RequireFields<MutationCreateGuildBanArgs, 'input'>>;
  createGuildConfig?: Resolver<Maybe<ResolversTypes['CreateGuildConfigPayload']>, ParentType, ContextType, RequireFields<MutationCreateGuildConfigArgs, 'input'>>;
  createMember?: Resolver<Maybe<ResolversTypes['CreateMemberPayload']>, ParentType, ContextType, RequireFields<MutationCreateMemberArgs, 'input'>>;
  createMessage?: Resolver<Maybe<ResolversTypes['CreateMessagePayload']>, ParentType, ContextType, RequireFields<MutationCreateMessageArgs, 'input'>>;
  createModLog?: Resolver<Maybe<ResolversTypes['CreateModLogPayload']>, ParentType, ContextType, RequireFields<MutationCreateModLogArgs, 'input'>>;
  createMute?: Resolver<Maybe<ResolversTypes['CreateMutePayload']>, ParentType, ContextType, RequireFields<MutationCreateMuteArgs, 'input'>>;
  createNotification?: Resolver<Maybe<ResolversTypes['CreateNotificationPayload']>, ParentType, ContextType, RequireFields<MutationCreateNotificationArgs, 'input'>>;
  createReminder?: Resolver<Maybe<ResolversTypes['CreateReminderPayload']>, ParentType, ContextType, RequireFields<MutationCreateReminderArgs, 'input'>>;
  createRoleMenu?: Resolver<Maybe<ResolversTypes['CreateRoleMenuPayload']>, ParentType, ContextType, RequireFields<MutationCreateRoleMenuArgs, 'input'>>;
  createTag?: Resolver<Maybe<ResolversTypes['CreateTagPayload']>, ParentType, ContextType, RequireFields<MutationCreateTagArgs, 'input'>>;
  createUser?: Resolver<Maybe<ResolversTypes['CreateUserPayload']>, ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  createUserLevel?: Resolver<Maybe<ResolversTypes['CreateUserLevelPayload']>, ParentType, ContextType, RequireFields<MutationCreateUserLevelArgs, 'input'>>;
  createWebUser?: Resolver<Maybe<ResolversTypes['CreateWebUserPayload']>, ParentType, ContextType, RequireFields<MutationCreateWebUserArgs, 'input'>>;
  createWebUserGuild?: Resolver<Maybe<ResolversTypes['CreateWebUserGuildPayload']>, ParentType, ContextType, RequireFields<MutationCreateWebUserGuildArgs, 'input'>>;
  deleteBotStat?: Resolver<Maybe<ResolversTypes['DeleteBotStatPayload']>, ParentType, ContextType, RequireFields<MutationDeleteBotStatArgs, 'input'>>;
  deleteBotStatByNameAndCategory?: Resolver<Maybe<ResolversTypes['DeleteBotStatPayload']>, ParentType, ContextType, RequireFields<MutationDeleteBotStatByNameAndCategoryArgs, 'input'>>;
  deleteCachedGuild?: Resolver<Maybe<ResolversTypes['DeleteCachedGuildPayload']>, ParentType, ContextType, RequireFields<MutationDeleteCachedGuildArgs, 'input'>>;
  deleteCachedGuildById?: Resolver<Maybe<ResolversTypes['DeleteCachedGuildPayload']>, ParentType, ContextType, RequireFields<MutationDeleteCachedGuildByIdArgs, 'input'>>;
  deleteCachedUser?: Resolver<Maybe<ResolversTypes['DeleteCachedUserPayload']>, ParentType, ContextType, RequireFields<MutationDeleteCachedUserArgs, 'input'>>;
  deleteCachedUserById?: Resolver<Maybe<ResolversTypes['DeleteCachedUserPayload']>, ParentType, ContextType, RequireFields<MutationDeleteCachedUserByIdArgs, 'input'>>;
  deleteFeed?: Resolver<Maybe<ResolversTypes['DeleteFeedPayload']>, ParentType, ContextType, RequireFields<MutationDeleteFeedArgs, 'input'>>;
  deleteFeedByFeedId?: Resolver<Maybe<ResolversTypes['DeleteFeedPayload']>, ParentType, ContextType, RequireFields<MutationDeleteFeedByFeedIdArgs, 'input'>>;
  deleteFeedItem?: Resolver<Maybe<ResolversTypes['DeleteFeedItemPayload']>, ParentType, ContextType, RequireFields<MutationDeleteFeedItemArgs, 'input'>>;
  deleteFeedItemByFeedIdAndItemId?: Resolver<Maybe<ResolversTypes['DeleteFeedItemPayload']>, ParentType, ContextType, RequireFields<MutationDeleteFeedItemByFeedIdAndItemIdArgs, 'input'>>;
  deleteFeedSubscription?: Resolver<Maybe<ResolversTypes['DeleteFeedSubscriptionPayload']>, ParentType, ContextType, RequireFields<MutationDeleteFeedSubscriptionArgs, 'input'>>;
  deleteFeedSubscriptionByFeedIdAndChannelId?: Resolver<Maybe<ResolversTypes['DeleteFeedSubscriptionPayload']>, ParentType, ContextType, RequireFields<MutationDeleteFeedSubscriptionByFeedIdAndChannelIdArgs, 'input'>>;
  deleteGuildBan?: Resolver<Maybe<ResolversTypes['DeleteGuildBanPayload']>, ParentType, ContextType, RequireFields<MutationDeleteGuildBanArgs, 'input'>>;
  deleteGuildBanByGuildIdAndUserId?: Resolver<Maybe<ResolversTypes['DeleteGuildBanPayload']>, ParentType, ContextType, RequireFields<MutationDeleteGuildBanByGuildIdAndUserIdArgs, 'input'>>;
  deleteGuildConfig?: Resolver<Maybe<ResolversTypes['DeleteGuildConfigPayload']>, ParentType, ContextType, RequireFields<MutationDeleteGuildConfigArgs, 'input'>>;
  deleteGuildConfigById?: Resolver<Maybe<ResolversTypes['DeleteGuildConfigPayload']>, ParentType, ContextType, RequireFields<MutationDeleteGuildConfigByIdArgs, 'input'>>;
  deleteMember?: Resolver<Maybe<ResolversTypes['DeleteMemberPayload']>, ParentType, ContextType, RequireFields<MutationDeleteMemberArgs, 'input'>>;
  deleteMemberByGuildIdAndUserId?: Resolver<Maybe<ResolversTypes['DeleteMemberPayload']>, ParentType, ContextType, RequireFields<MutationDeleteMemberByGuildIdAndUserIdArgs, 'input'>>;
  deleteModLog?: Resolver<Maybe<ResolversTypes['DeleteModLogPayload']>, ParentType, ContextType, RequireFields<MutationDeleteModLogArgs, 'input'>>;
  deleteModLogByGuildIdAndCaseId?: Resolver<Maybe<ResolversTypes['DeleteModLogPayload']>, ParentType, ContextType, RequireFields<MutationDeleteModLogByGuildIdAndCaseIdArgs, 'input'>>;
  deleteMute?: Resolver<Maybe<ResolversTypes['DeleteMutePayload']>, ParentType, ContextType, RequireFields<MutationDeleteMuteArgs, 'input'>>;
  deleteMuteByGuildIdAndUserId?: Resolver<Maybe<ResolversTypes['DeleteMutePayload']>, ParentType, ContextType, RequireFields<MutationDeleteMuteByGuildIdAndUserIdArgs, 'input'>>;
  deleteNotification?: Resolver<Maybe<ResolversTypes['DeleteNotificationPayload']>, ParentType, ContextType, RequireFields<MutationDeleteNotificationArgs, 'input'>>;
  deleteNotificationByUserIdAndGuildIdAndKeyword?: Resolver<Maybe<ResolversTypes['DeleteNotificationPayload']>, ParentType, ContextType, RequireFields<MutationDeleteNotificationByUserIdAndGuildIdAndKeywordArgs, 'input'>>;
  deleteReminder?: Resolver<Maybe<ResolversTypes['DeleteReminderPayload']>, ParentType, ContextType, RequireFields<MutationDeleteReminderArgs, 'input'>>;
  deleteReminderByUserIdAndSetAt?: Resolver<Maybe<ResolversTypes['DeleteReminderPayload']>, ParentType, ContextType, RequireFields<MutationDeleteReminderByUserIdAndSetAtArgs, 'input'>>;
  deleteRoleMenu?: Resolver<Maybe<ResolversTypes['DeleteRoleMenuPayload']>, ParentType, ContextType, RequireFields<MutationDeleteRoleMenuArgs, 'input'>>;
  deleteRoleMenuByMessageId?: Resolver<Maybe<ResolversTypes['DeleteRoleMenuPayload']>, ParentType, ContextType, RequireFields<MutationDeleteRoleMenuByMessageIdArgs, 'input'>>;
  deleteTag?: Resolver<Maybe<ResolversTypes['DeleteTagPayload']>, ParentType, ContextType, RequireFields<MutationDeleteTagArgs, 'input'>>;
  deleteTagByGuildIdAndTagName?: Resolver<Maybe<ResolversTypes['DeleteTagPayload']>, ParentType, ContextType, RequireFields<MutationDeleteTagByGuildIdAndTagNameArgs, 'input'>>;
  deleteUser?: Resolver<Maybe<ResolversTypes['DeleteUserPayload']>, ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'input'>>;
  deleteUserById?: Resolver<Maybe<ResolversTypes['DeleteUserPayload']>, ParentType, ContextType, RequireFields<MutationDeleteUserByIdArgs, 'input'>>;
  deleteUserLevel?: Resolver<Maybe<ResolversTypes['DeleteUserLevelPayload']>, ParentType, ContextType, RequireFields<MutationDeleteUserLevelArgs, 'input'>>;
  deleteUserLevelByUserIdAndGuildId?: Resolver<Maybe<ResolversTypes['DeleteUserLevelPayload']>, ParentType, ContextType, RequireFields<MutationDeleteUserLevelByUserIdAndGuildIdArgs, 'input'>>;
  deleteWebUser?: Resolver<Maybe<ResolversTypes['DeleteWebUserPayload']>, ParentType, ContextType, RequireFields<MutationDeleteWebUserArgs, 'input'>>;
  deleteWebUserById?: Resolver<Maybe<ResolversTypes['DeleteWebUserPayload']>, ParentType, ContextType, RequireFields<MutationDeleteWebUserByIdArgs, 'input'>>;
  deleteWebUserGuild?: Resolver<Maybe<ResolversTypes['DeleteWebUserGuildPayload']>, ParentType, ContextType, RequireFields<MutationDeleteWebUserGuildArgs, 'input'>>;
  deleteWebUserGuildByUserIdAndGuildId?: Resolver<Maybe<ResolversTypes['DeleteWebUserGuildPayload']>, ParentType, ContextType, RequireFields<MutationDeleteWebUserGuildByUserIdAndGuildIdArgs, 'input'>>;
  graphql?: Resolver<Maybe<ResolversTypes['GraphqlPayload']>, ParentType, ContextType, RequireFields<MutationGraphqlArgs, 'input'>>;
  logout?: Resolver<Maybe<ResolversTypes['LogoutPayload']>, ParentType, ContextType, RequireFields<MutationLogoutArgs, 'input'>>;
  updateBotStat?: Resolver<Maybe<ResolversTypes['UpdateBotStatPayload']>, ParentType, ContextType, RequireFields<MutationUpdateBotStatArgs, 'input'>>;
  updateBotStatByNameAndCategory?: Resolver<Maybe<ResolversTypes['UpdateBotStatPayload']>, ParentType, ContextType, RequireFields<MutationUpdateBotStatByNameAndCategoryArgs, 'input'>>;
  updateCachedGuild?: Resolver<Maybe<ResolversTypes['UpdateCachedGuildPayload']>, ParentType, ContextType, RequireFields<MutationUpdateCachedGuildArgs, 'input'>>;
  updateCachedGuildById?: Resolver<Maybe<ResolversTypes['UpdateCachedGuildPayload']>, ParentType, ContextType, RequireFields<MutationUpdateCachedGuildByIdArgs, 'input'>>;
  updateCachedUser?: Resolver<Maybe<ResolversTypes['UpdateCachedUserPayload']>, ParentType, ContextType, RequireFields<MutationUpdateCachedUserArgs, 'input'>>;
  updateCachedUserById?: Resolver<Maybe<ResolversTypes['UpdateCachedUserPayload']>, ParentType, ContextType, RequireFields<MutationUpdateCachedUserByIdArgs, 'input'>>;
  updateFeed?: Resolver<Maybe<ResolversTypes['UpdateFeedPayload']>, ParentType, ContextType, RequireFields<MutationUpdateFeedArgs, 'input'>>;
  updateFeedByFeedId?: Resolver<Maybe<ResolversTypes['UpdateFeedPayload']>, ParentType, ContextType, RequireFields<MutationUpdateFeedByFeedIdArgs, 'input'>>;
  updateFeedItem?: Resolver<Maybe<ResolversTypes['UpdateFeedItemPayload']>, ParentType, ContextType, RequireFields<MutationUpdateFeedItemArgs, 'input'>>;
  updateFeedItemByFeedIdAndItemId?: Resolver<Maybe<ResolversTypes['UpdateFeedItemPayload']>, ParentType, ContextType, RequireFields<MutationUpdateFeedItemByFeedIdAndItemIdArgs, 'input'>>;
  updateFeedSubscription?: Resolver<Maybe<ResolversTypes['UpdateFeedSubscriptionPayload']>, ParentType, ContextType, RequireFields<MutationUpdateFeedSubscriptionArgs, 'input'>>;
  updateFeedSubscriptionByFeedIdAndChannelId?: Resolver<Maybe<ResolversTypes['UpdateFeedSubscriptionPayload']>, ParentType, ContextType, RequireFields<MutationUpdateFeedSubscriptionByFeedIdAndChannelIdArgs, 'input'>>;
  updateGuildBan?: Resolver<Maybe<ResolversTypes['UpdateGuildBanPayload']>, ParentType, ContextType, RequireFields<MutationUpdateGuildBanArgs, 'input'>>;
  updateGuildBanByGuildIdAndUserId?: Resolver<Maybe<ResolversTypes['UpdateGuildBanPayload']>, ParentType, ContextType, RequireFields<MutationUpdateGuildBanByGuildIdAndUserIdArgs, 'input'>>;
  updateGuildConfig?: Resolver<Maybe<ResolversTypes['UpdateGuildConfigPayload']>, ParentType, ContextType, RequireFields<MutationUpdateGuildConfigArgs, 'input'>>;
  updateGuildConfigById?: Resolver<Maybe<ResolversTypes['UpdateGuildConfigPayload']>, ParentType, ContextType, RequireFields<MutationUpdateGuildConfigByIdArgs, 'input'>>;
  updateMember?: Resolver<Maybe<ResolversTypes['UpdateMemberPayload']>, ParentType, ContextType, RequireFields<MutationUpdateMemberArgs, 'input'>>;
  updateMemberByGuildIdAndUserId?: Resolver<Maybe<ResolversTypes['UpdateMemberPayload']>, ParentType, ContextType, RequireFields<MutationUpdateMemberByGuildIdAndUserIdArgs, 'input'>>;
  updateModLog?: Resolver<Maybe<ResolversTypes['UpdateModLogPayload']>, ParentType, ContextType, RequireFields<MutationUpdateModLogArgs, 'input'>>;
  updateModLogByGuildIdAndCaseId?: Resolver<Maybe<ResolversTypes['UpdateModLogPayload']>, ParentType, ContextType, RequireFields<MutationUpdateModLogByGuildIdAndCaseIdArgs, 'input'>>;
  updateMute?: Resolver<Maybe<ResolversTypes['UpdateMutePayload']>, ParentType, ContextType, RequireFields<MutationUpdateMuteArgs, 'input'>>;
  updateMuteByGuildIdAndUserId?: Resolver<Maybe<ResolversTypes['UpdateMutePayload']>, ParentType, ContextType, RequireFields<MutationUpdateMuteByGuildIdAndUserIdArgs, 'input'>>;
  updateNotification?: Resolver<Maybe<ResolversTypes['UpdateNotificationPayload']>, ParentType, ContextType, RequireFields<MutationUpdateNotificationArgs, 'input'>>;
  updateNotificationByUserIdAndGuildIdAndKeyword?: Resolver<Maybe<ResolversTypes['UpdateNotificationPayload']>, ParentType, ContextType, RequireFields<MutationUpdateNotificationByUserIdAndGuildIdAndKeywordArgs, 'input'>>;
  updateReminder?: Resolver<Maybe<ResolversTypes['UpdateReminderPayload']>, ParentType, ContextType, RequireFields<MutationUpdateReminderArgs, 'input'>>;
  updateReminderByUserIdAndSetAt?: Resolver<Maybe<ResolversTypes['UpdateReminderPayload']>, ParentType, ContextType, RequireFields<MutationUpdateReminderByUserIdAndSetAtArgs, 'input'>>;
  updateRoleMenu?: Resolver<Maybe<ResolversTypes['UpdateRoleMenuPayload']>, ParentType, ContextType, RequireFields<MutationUpdateRoleMenuArgs, 'input'>>;
  updateRoleMenuByMessageId?: Resolver<Maybe<ResolversTypes['UpdateRoleMenuPayload']>, ParentType, ContextType, RequireFields<MutationUpdateRoleMenuByMessageIdArgs, 'input'>>;
  updateTag?: Resolver<Maybe<ResolversTypes['UpdateTagPayload']>, ParentType, ContextType, RequireFields<MutationUpdateTagArgs, 'input'>>;
  updateTagByGuildIdAndTagName?: Resolver<Maybe<ResolversTypes['UpdateTagPayload']>, ParentType, ContextType, RequireFields<MutationUpdateTagByGuildIdAndTagNameArgs, 'input'>>;
  updateUser?: Resolver<Maybe<ResolversTypes['UpdateUserPayload']>, ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input'>>;
  updateUserById?: Resolver<Maybe<ResolversTypes['UpdateUserPayload']>, ParentType, ContextType, RequireFields<MutationUpdateUserByIdArgs, 'input'>>;
  updateUserLevel?: Resolver<Maybe<ResolversTypes['UpdateUserLevelPayload']>, ParentType, ContextType, RequireFields<MutationUpdateUserLevelArgs, 'input'>>;
  updateUserLevelByUserIdAndGuildId?: Resolver<Maybe<ResolversTypes['UpdateUserLevelPayload']>, ParentType, ContextType, RequireFields<MutationUpdateUserLevelByUserIdAndGuildIdArgs, 'input'>>;
  updateWebUser?: Resolver<Maybe<ResolversTypes['UpdateWebUserPayload']>, ParentType, ContextType, RequireFields<MutationUpdateWebUserArgs, 'input'>>;
  updateWebUserById?: Resolver<Maybe<ResolversTypes['UpdateWebUserPayload']>, ParentType, ContextType, RequireFields<MutationUpdateWebUserByIdArgs, 'input'>>;
  updateWebUserGuild?: Resolver<Maybe<ResolversTypes['UpdateWebUserGuildPayload']>, ParentType, ContextType, RequireFields<MutationUpdateWebUserGuildArgs, 'input'>>;
  updateWebUserGuildByUserIdAndGuildId?: Resolver<Maybe<ResolversTypes['UpdateWebUserGuildPayload']>, ParentType, ContextType, RequireFields<MutationUpdateWebUserGuildByUserIdAndGuildIdArgs, 'input'>>;
};

export type MuteResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mute'] = ResolversParentTypes['Mute']> = {
  caseId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  endTime?: Resolver<Maybe<ResolversTypes['Datetime']>, ParentType, ContextType>;
  guildId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  modLogByGuildIdAndCaseId?: Resolver<Maybe<ResolversTypes['ModLog']>, ParentType, ContextType>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  pending?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startTime?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutesConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['MutesConnection'] = ResolversParentTypes['MutesConnection']> = {
  edges?: Resolver<Array<ResolversTypes['MutesEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['Mute']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutesEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['MutesEdge'] = ResolversParentTypes['MutesEdge']> = {
  cursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Mute'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  __resolveType: TypeResolveFn<'BotStat' | 'CachedGuild' | 'CachedUser' | 'Feed' | 'FeedItem' | 'FeedSubscription' | 'GuildBan' | 'GuildConfig' | 'Member' | 'ModLog' | 'Mute' | 'Notification' | 'Query' | 'Reminder' | 'RoleMenu' | 'Tag' | 'User' | 'UserLevel' | 'WebUser' | 'WebUserGuild', ParentType, ContextType>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type NotificationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Notification'] = ResolversParentTypes['Notification']> = {
  guildId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  keyword?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NotificationsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotificationsConnection'] = ResolversParentTypes['NotificationsConnection']> = {
  edges?: Resolver<Array<ResolversTypes['NotificationsEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['Notification']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NotificationsEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotificationsEdge'] = ResolversParentTypes['NotificationsEdge']> = {
  cursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Notification'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  endCursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  allBotStats?: Resolver<Maybe<ResolversTypes['BotStatsConnection']>, ParentType, ContextType, RequireFields<QueryAllBotStatsArgs, 'orderBy'>>;
  allFeedItems?: Resolver<Maybe<ResolversTypes['FeedItemsConnection']>, ParentType, ContextType, RequireFields<QueryAllFeedItemsArgs, 'orderBy'>>;
  allFeedSubscriptions?: Resolver<Maybe<ResolversTypes['FeedSubscriptionsConnection']>, ParentType, ContextType, RequireFields<QueryAllFeedSubscriptionsArgs, 'orderBy'>>;
  allFeeds?: Resolver<Maybe<ResolversTypes['FeedsConnection']>, ParentType, ContextType, RequireFields<QueryAllFeedsArgs, 'orderBy'>>;
  allGuildBans?: Resolver<Maybe<ResolversTypes['GuildBansConnection']>, ParentType, ContextType, RequireFields<QueryAllGuildBansArgs, 'orderBy'>>;
  allGuildConfigs?: Resolver<Maybe<ResolversTypes['GuildConfigsConnection']>, ParentType, ContextType, RequireFields<QueryAllGuildConfigsArgs, 'orderBy'>>;
  allMembers?: Resolver<Maybe<ResolversTypes['MembersConnection']>, ParentType, ContextType, RequireFields<QueryAllMembersArgs, 'orderBy'>>;
  allMessages?: Resolver<Maybe<ResolversTypes['MessagesConnection']>, ParentType, ContextType, RequireFields<QueryAllMessagesArgs, 'orderBy'>>;
  allModLogs?: Resolver<Maybe<ResolversTypes['ModLogsConnection']>, ParentType, ContextType, RequireFields<QueryAllModLogsArgs, 'orderBy'>>;
  allMutes?: Resolver<Maybe<ResolversTypes['MutesConnection']>, ParentType, ContextType, RequireFields<QueryAllMutesArgs, 'orderBy'>>;
  allNotifications?: Resolver<Maybe<ResolversTypes['NotificationsConnection']>, ParentType, ContextType, RequireFields<QueryAllNotificationsArgs, 'orderBy'>>;
  allReminders?: Resolver<Maybe<ResolversTypes['RemindersConnection']>, ParentType, ContextType, RequireFields<QueryAllRemindersArgs, 'orderBy'>>;
  allRoleMenus?: Resolver<Maybe<ResolversTypes['RoleMenusConnection']>, ParentType, ContextType, RequireFields<QueryAllRoleMenusArgs, 'orderBy'>>;
  allTags?: Resolver<Maybe<ResolversTypes['TagsConnection']>, ParentType, ContextType, RequireFields<QueryAllTagsArgs, 'orderBy'>>;
  allUsers?: Resolver<Maybe<ResolversTypes['UsersConnection']>, ParentType, ContextType, RequireFields<QueryAllUsersArgs, 'orderBy'>>;
  allWebUserGuilds?: Resolver<Maybe<ResolversTypes['WebUserGuildsConnection']>, ParentType, ContextType, RequireFields<QueryAllWebUserGuildsArgs, 'orderBy'>>;
  allWebUsers?: Resolver<Maybe<ResolversTypes['WebUsersConnection']>, ParentType, ContextType, RequireFields<QueryAllWebUsersArgs, 'orderBy'>>;
  botStat?: Resolver<Maybe<ResolversTypes['BotStat']>, ParentType, ContextType, RequireFields<QueryBotStatArgs, 'nodeId'>>;
  botStatByNameAndCategory?: Resolver<Maybe<ResolversTypes['BotStat']>, ParentType, ContextType, RequireFields<QueryBotStatByNameAndCategoryArgs, 'category' | 'name'>>;
  cachedGuild?: Resolver<Maybe<ResolversTypes['CachedGuild']>, ParentType, ContextType, RequireFields<QueryCachedGuildArgs, 'nodeId'>>;
  cachedGuildById?: Resolver<Maybe<ResolversTypes['CachedGuild']>, ParentType, ContextType, RequireFields<QueryCachedGuildByIdArgs, 'id'>>;
  cachedUser?: Resolver<Maybe<ResolversTypes['CachedUser']>, ParentType, ContextType, RequireFields<QueryCachedUserArgs, 'nodeId'>>;
  cachedUserById?: Resolver<Maybe<ResolversTypes['CachedUser']>, ParentType, ContextType, RequireFields<QueryCachedUserByIdArgs, 'id'>>;
  currentSessionId?: Resolver<Maybe<ResolversTypes['UUID']>, ParentType, ContextType>;
  currentUser?: Resolver<Maybe<ResolversTypes['WebUser']>, ParentType, ContextType>;
  currentUserDiscordId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  currentUserId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  currentUserManagedGuildIds?: Resolver<Maybe<ResolversTypes['CurrentUserManagedGuildIdsConnection']>, ParentType, ContextType, Partial<QueryCurrentUserManagedGuildIdsArgs>>;
  feed?: Resolver<Maybe<ResolversTypes['Feed']>, ParentType, ContextType, RequireFields<QueryFeedArgs, 'nodeId'>>;
  feedByFeedId?: Resolver<Maybe<ResolversTypes['Feed']>, ParentType, ContextType, RequireFields<QueryFeedByFeedIdArgs, 'feedId'>>;
  feedItem?: Resolver<Maybe<ResolversTypes['FeedItem']>, ParentType, ContextType, RequireFields<QueryFeedItemArgs, 'nodeId'>>;
  feedItemByFeedIdAndItemId?: Resolver<Maybe<ResolversTypes['FeedItem']>, ParentType, ContextType, RequireFields<QueryFeedItemByFeedIdAndItemIdArgs, 'feedId' | 'itemId'>>;
  feedSubscription?: Resolver<Maybe<ResolversTypes['FeedSubscription']>, ParentType, ContextType, RequireFields<QueryFeedSubscriptionArgs, 'nodeId'>>;
  feedSubscriptionByFeedIdAndChannelId?: Resolver<Maybe<ResolversTypes['FeedSubscription']>, ParentType, ContextType, RequireFields<QueryFeedSubscriptionByFeedIdAndChannelIdArgs, 'channelId' | 'feedId'>>;
  guildBan?: Resolver<Maybe<ResolversTypes['GuildBan']>, ParentType, ContextType, RequireFields<QueryGuildBanArgs, 'nodeId'>>;
  guildBanByGuildIdAndUserId?: Resolver<Maybe<ResolversTypes['GuildBan']>, ParentType, ContextType, RequireFields<QueryGuildBanByGuildIdAndUserIdArgs, 'guildId' | 'userId'>>;
  guildConfig?: Resolver<Maybe<ResolversTypes['GuildConfig']>, ParentType, ContextType, RequireFields<QueryGuildConfigArgs, 'nodeId'>>;
  guildConfigById?: Resolver<Maybe<ResolversTypes['GuildConfig']>, ParentType, ContextType, RequireFields<QueryGuildConfigByIdArgs, 'id'>>;
  member?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType, RequireFields<QueryMemberArgs, 'nodeId'>>;
  memberByGuildIdAndUserId?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType, RequireFields<QueryMemberByGuildIdAndUserIdArgs, 'guildId' | 'userId'>>;
  modLog?: Resolver<Maybe<ResolversTypes['ModLog']>, ParentType, ContextType, RequireFields<QueryModLogArgs, 'nodeId'>>;
  modLogByGuildIdAndCaseId?: Resolver<Maybe<ResolversTypes['ModLog']>, ParentType, ContextType, RequireFields<QueryModLogByGuildIdAndCaseIdArgs, 'caseId' | 'guildId'>>;
  mute?: Resolver<Maybe<ResolversTypes['Mute']>, ParentType, ContextType, RequireFields<QueryMuteArgs, 'nodeId'>>;
  muteByGuildIdAndUserId?: Resolver<Maybe<ResolversTypes['Mute']>, ParentType, ContextType, RequireFields<QueryMuteByGuildIdAndUserIdArgs, 'guildId' | 'userId'>>;
  node?: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<QueryNodeArgs, 'nodeId'>>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  notification?: Resolver<Maybe<ResolversTypes['Notification']>, ParentType, ContextType, RequireFields<QueryNotificationArgs, 'nodeId'>>;
  notificationByUserIdAndGuildIdAndKeyword?: Resolver<Maybe<ResolversTypes['Notification']>, ParentType, ContextType, RequireFields<QueryNotificationByUserIdAndGuildIdAndKeywordArgs, 'guildId' | 'keyword' | 'userId'>>;
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  reminder?: Resolver<Maybe<ResolversTypes['Reminder']>, ParentType, ContextType, RequireFields<QueryReminderArgs, 'nodeId'>>;
  reminderByUserIdAndSetAt?: Resolver<Maybe<ResolversTypes['Reminder']>, ParentType, ContextType, RequireFields<QueryReminderByUserIdAndSetAtArgs, 'setAt' | 'userId'>>;
  roleMenu?: Resolver<Maybe<ResolversTypes['RoleMenu']>, ParentType, ContextType, RequireFields<QueryRoleMenuArgs, 'nodeId'>>;
  roleMenuByMessageId?: Resolver<Maybe<ResolversTypes['RoleMenu']>, ParentType, ContextType, RequireFields<QueryRoleMenuByMessageIdArgs, 'messageId'>>;
  tag?: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType, RequireFields<QueryTagArgs, 'nodeId'>>;
  tagByGuildIdAndTagName?: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType, RequireFields<QueryTagByGuildIdAndTagNameArgs, 'guildId' | 'tagName'>>;
  timeframeUserLevels?: Resolver<Maybe<ResolversTypes['TimeframeUserLevelsConnection']>, ParentType, ContextType, Partial<QueryTimeframeUserLevelsArgs>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'nodeId'>>;
  userById?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserByIdArgs, 'id'>>;
  userLevel?: Resolver<Maybe<ResolversTypes['UserLevel']>, ParentType, ContextType, RequireFields<QueryUserLevelArgs, 'nodeId'>>;
  userLevelByUserIdAndGuildId?: Resolver<Maybe<ResolversTypes['UserLevel']>, ParentType, ContextType, RequireFields<QueryUserLevelByUserIdAndGuildIdArgs, 'guildId' | 'userId'>>;
  webUser?: Resolver<Maybe<ResolversTypes['WebUser']>, ParentType, ContextType, RequireFields<QueryWebUserArgs, 'nodeId'>>;
  webUserById?: Resolver<Maybe<ResolversTypes['WebUser']>, ParentType, ContextType, RequireFields<QueryWebUserByIdArgs, 'id'>>;
  webUserGuild?: Resolver<Maybe<ResolversTypes['WebUserGuild']>, ParentType, ContextType, RequireFields<QueryWebUserGuildArgs, 'nodeId'>>;
  webUserGuildByUserIdAndGuildId?: Resolver<Maybe<ResolversTypes['WebUserGuild']>, ParentType, ContextType, RequireFields<QueryWebUserGuildByUserIdAndGuildIdArgs, 'guildId' | 'userId'>>;
};

export type ReminderResolvers<ContextType = any, ParentType extends ResolversParentTypes['Reminder'] = ResolversParentTypes['Reminder']> = {
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expireAt?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  setAt?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RemindersConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['RemindersConnection'] = ResolversParentTypes['RemindersConnection']> = {
  edges?: Resolver<Array<ResolversTypes['RemindersEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['Reminder']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RemindersEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['RemindersEdge'] = ResolversParentTypes['RemindersEdge']> = {
  cursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Reminder'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoleMenuResolvers<ContextType = any, ParentType extends ResolversParentTypes['RoleMenu'] = ResolversParentTypes['RoleMenu']> = {
  channelId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  editorId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  guildId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  messageId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoleMenusConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['RoleMenusConnection'] = ResolversParentTypes['RoleMenusConnection']> = {
  edges?: Resolver<Array<ResolversTypes['RoleMenusEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['RoleMenu']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoleMenusEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['RoleMenusEdge'] = ResolversParentTypes['RoleMenusEdge']> = {
  cursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['RoleMenu'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tag'] = ResolversParentTypes['Tag']> = {
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  guildId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ownerId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  tagName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  useCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['TagsConnection'] = ResolversParentTypes['TagsConnection']> = {
  edges?: Resolver<Array<ResolversTypes['TagsEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagsEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['TagsEdge'] = ResolversParentTypes['TagsEdge']> = {
  cursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Tag'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TimeframeUserLevelEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['TimeframeUserLevelEdge'] = ResolversParentTypes['TimeframeUserLevelEdge']> = {
  cursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['TimeframeUserLevelsRecord'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TimeframeUserLevelsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['TimeframeUserLevelsConnection'] = ResolversParentTypes['TimeframeUserLevelsConnection']> = {
  edges?: Resolver<Array<ResolversTypes['TimeframeUserLevelEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['TimeframeUserLevelsRecord']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TimeframeUserLevelsRecordResolvers<ContextType = any, ParentType extends ResolversParentTypes['TimeframeUserLevelsRecord'] = ResolversParentTypes['TimeframeUserLevelsRecord']> = {
  avatarUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  currentLevel?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  discriminator?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  gainedLevels?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  nextLevelXpProgress?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  nextLevelXpRequired?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  xp?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  xpDiff?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface UuidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UUID'], any> {
  name: 'UUID';
}

export type UpdateBotStatPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateBotStatPayload'] = ResolversParentTypes['UpdateBotStatPayload']> = {
  botStat?: Resolver<Maybe<ResolversTypes['BotStat']>, ParentType, ContextType>;
  botStatEdge?: Resolver<Maybe<ResolversTypes['BotStatsEdge']>, ParentType, ContextType, RequireFields<UpdateBotStatPayloadBotStatEdgeArgs, 'orderBy'>>;
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateCachedGuildPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateCachedGuildPayload'] = ResolversParentTypes['UpdateCachedGuildPayload']> = {
  cachedGuild?: Resolver<Maybe<ResolversTypes['CachedGuild']>, ParentType, ContextType>;
  cachedGuildEdge?: Resolver<Maybe<ResolversTypes['CachedGuildsEdge']>, ParentType, ContextType, RequireFields<UpdateCachedGuildPayloadCachedGuildEdgeArgs, 'orderBy'>>;
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateCachedUserPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateCachedUserPayload'] = ResolversParentTypes['UpdateCachedUserPayload']> = {
  cachedUser?: Resolver<Maybe<ResolversTypes['CachedUser']>, ParentType, ContextType>;
  cachedUserEdge?: Resolver<Maybe<ResolversTypes['CachedUsersEdge']>, ParentType, ContextType, RequireFields<UpdateCachedUserPayloadCachedUserEdgeArgs, 'orderBy'>>;
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateFeedItemPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateFeedItemPayload'] = ResolversParentTypes['UpdateFeedItemPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  feedItem?: Resolver<Maybe<ResolversTypes['FeedItem']>, ParentType, ContextType>;
  feedItemEdge?: Resolver<Maybe<ResolversTypes['FeedItemsEdge']>, ParentType, ContextType, RequireFields<UpdateFeedItemPayloadFeedItemEdgeArgs, 'orderBy'>>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateFeedPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateFeedPayload'] = ResolversParentTypes['UpdateFeedPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  feed?: Resolver<Maybe<ResolversTypes['Feed']>, ParentType, ContextType>;
  feedEdge?: Resolver<Maybe<ResolversTypes['FeedsEdge']>, ParentType, ContextType, RequireFields<UpdateFeedPayloadFeedEdgeArgs, 'orderBy'>>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateFeedSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateFeedSubscriptionPayload'] = ResolversParentTypes['UpdateFeedSubscriptionPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  feedByFeedId?: Resolver<Maybe<ResolversTypes['Feed']>, ParentType, ContextType>;
  feedSubscription?: Resolver<Maybe<ResolversTypes['FeedSubscription']>, ParentType, ContextType>;
  feedSubscriptionEdge?: Resolver<Maybe<ResolversTypes['FeedSubscriptionsEdge']>, ParentType, ContextType, RequireFields<UpdateFeedSubscriptionPayloadFeedSubscriptionEdgeArgs, 'orderBy'>>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateGuildBanPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateGuildBanPayload'] = ResolversParentTypes['UpdateGuildBanPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  guildBan?: Resolver<Maybe<ResolversTypes['GuildBan']>, ParentType, ContextType>;
  guildBanEdge?: Resolver<Maybe<ResolversTypes['GuildBansEdge']>, ParentType, ContextType, RequireFields<UpdateGuildBanPayloadGuildBanEdgeArgs, 'orderBy'>>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateGuildConfigPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateGuildConfigPayload'] = ResolversParentTypes['UpdateGuildConfigPayload']> = {
  cachedGuildById?: Resolver<Maybe<ResolversTypes['CachedGuild']>, ParentType, ContextType>;
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  guildConfig?: Resolver<Maybe<ResolversTypes['GuildConfig']>, ParentType, ContextType>;
  guildConfigEdge?: Resolver<Maybe<ResolversTypes['GuildConfigsEdge']>, ParentType, ContextType, RequireFields<UpdateGuildConfigPayloadGuildConfigEdgeArgs, 'orderBy'>>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateMemberPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateMemberPayload'] = ResolversParentTypes['UpdateMemberPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  member?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType>;
  memberEdge?: Resolver<Maybe<ResolversTypes['MembersEdge']>, ParentType, ContextType, RequireFields<UpdateMemberPayloadMemberEdgeArgs, 'orderBy'>>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateModLogPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateModLogPayload'] = ResolversParentTypes['UpdateModLogPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  modLog?: Resolver<Maybe<ResolversTypes['ModLog']>, ParentType, ContextType>;
  modLogEdge?: Resolver<Maybe<ResolversTypes['ModLogsEdge']>, ParentType, ContextType, RequireFields<UpdateModLogPayloadModLogEdgeArgs, 'orderBy'>>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateMutePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateMutePayload'] = ResolversParentTypes['UpdateMutePayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  modLogByGuildIdAndCaseId?: Resolver<Maybe<ResolversTypes['ModLog']>, ParentType, ContextType>;
  mute?: Resolver<Maybe<ResolversTypes['Mute']>, ParentType, ContextType>;
  muteEdge?: Resolver<Maybe<ResolversTypes['MutesEdge']>, ParentType, ContextType, RequireFields<UpdateMutePayloadMuteEdgeArgs, 'orderBy'>>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateNotificationPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateNotificationPayload'] = ResolversParentTypes['UpdateNotificationPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  notification?: Resolver<Maybe<ResolversTypes['Notification']>, ParentType, ContextType>;
  notificationEdge?: Resolver<Maybe<ResolversTypes['NotificationsEdge']>, ParentType, ContextType, RequireFields<UpdateNotificationPayloadNotificationEdgeArgs, 'orderBy'>>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateReminderPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateReminderPayload'] = ResolversParentTypes['UpdateReminderPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  reminder?: Resolver<Maybe<ResolversTypes['Reminder']>, ParentType, ContextType>;
  reminderEdge?: Resolver<Maybe<ResolversTypes['RemindersEdge']>, ParentType, ContextType, RequireFields<UpdateReminderPayloadReminderEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateRoleMenuPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateRoleMenuPayload'] = ResolversParentTypes['UpdateRoleMenuPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  roleMenu?: Resolver<Maybe<ResolversTypes['RoleMenu']>, ParentType, ContextType>;
  roleMenuEdge?: Resolver<Maybe<ResolversTypes['RoleMenusEdge']>, ParentType, ContextType, RequireFields<UpdateRoleMenuPayloadRoleMenuEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateTagPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateTagPayload'] = ResolversParentTypes['UpdateTagPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  tag?: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType>;
  tagEdge?: Resolver<Maybe<ResolversTypes['TagsEdge']>, ParentType, ContextType, RequireFields<UpdateTagPayloadTagEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateUserLevelPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateUserLevelPayload'] = ResolversParentTypes['UpdateUserLevelPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userLevel?: Resolver<Maybe<ResolversTypes['UserLevel']>, ParentType, ContextType>;
  userLevelEdge?: Resolver<Maybe<ResolversTypes['UserLevelsEdge']>, ParentType, ContextType, RequireFields<UpdateUserLevelPayloadUserLevelEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateUserPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateUserPayload'] = ResolversParentTypes['UpdateUserPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userEdge?: Resolver<Maybe<ResolversTypes['UsersEdge']>, ParentType, ContextType, RequireFields<UpdateUserPayloadUserEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateWebUserGuildPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateWebUserGuildPayload'] = ResolversParentTypes['UpdateWebUserGuildPayload']> = {
  cachedGuildByGuildId?: Resolver<Maybe<ResolversTypes['CachedGuild']>, ParentType, ContextType>;
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  webUserByUserId?: Resolver<Maybe<ResolversTypes['WebUser']>, ParentType, ContextType>;
  webUserGuild?: Resolver<Maybe<ResolversTypes['WebUserGuild']>, ParentType, ContextType>;
  webUserGuildEdge?: Resolver<Maybe<ResolversTypes['WebUserGuildsEdge']>, ParentType, ContextType, RequireFields<UpdateWebUserGuildPayloadWebUserGuildEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateWebUserPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateWebUserPayload'] = ResolversParentTypes['UpdateWebUserPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  webUser?: Resolver<Maybe<ResolversTypes['WebUser']>, ParentType, ContextType>;
  webUserEdge?: Resolver<Maybe<ResolversTypes['WebUsersEdge']>, ParentType, ContextType, RequireFields<UpdateWebUserPayloadWebUserEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  fishies?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  isPatron?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastFishies?: Resolver<Maybe<ResolversTypes['Datetime']>, ParentType, ContextType>;
  lastRep?: Resolver<Maybe<ResolversTypes['Datetime']>, ParentType, ContextType>;
  lastfmUsername?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  patronEmoji?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  profileData?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  rep?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserLevelResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserLevel'] = ResolversParentTypes['UserLevel']> = {
  guildId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  lastMsg?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  msgAllTime?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  msgDay?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  msgMonth?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  msgWeek?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserLevelsEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserLevelsEdge'] = ResolversParentTypes['UserLevelsEdge']> = {
  cursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['UserLevel'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UsersConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['UsersConnection'] = ResolversParentTypes['UsersConnection']> = {
  edges?: Resolver<Array<ResolversTypes['UsersEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UsersEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['UsersEdge'] = ResolversParentTypes['UsersEdge']> = {
  cursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WebUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['WebUser'] = ResolversParentTypes['WebUser']> = {
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  details?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  discriminator?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  isAdmin?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  webUserGuildsByUserId?: Resolver<ResolversTypes['WebUserGuildsConnection'], ParentType, ContextType, RequireFields<WebUserWebUserGuildsByUserIdArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WebUserGuildResolvers<ContextType = any, ParentType extends ResolversParentTypes['WebUserGuild'] = ResolversParentTypes['WebUserGuild']> = {
  cachedGuildByGuildId?: Resolver<Maybe<ResolversTypes['CachedGuild']>, ParentType, ContextType>;
  guildId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  manageGuild?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  permissions?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  webUserByUserId?: Resolver<Maybe<ResolversTypes['WebUser']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WebUserGuildsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['WebUserGuildsConnection'] = ResolversParentTypes['WebUserGuildsConnection']> = {
  edges?: Resolver<Array<ResolversTypes['WebUserGuildsEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['WebUserGuild']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WebUserGuildsEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['WebUserGuildsEdge'] = ResolversParentTypes['WebUserGuildsEdge']> = {
  cursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['WebUserGuild'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WebUsersConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['WebUsersConnection'] = ResolversParentTypes['WebUsersConnection']> = {
  edges?: Resolver<Array<ResolversTypes['WebUsersEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['WebUser']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WebUsersEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['WebUsersEdge'] = ResolversParentTypes['WebUsersEdge']> = {
  cursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['WebUser'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  BigInt?: GraphQLScalarType;
  BotStat?: BotStatResolvers<ContextType>;
  BotStatsConnection?: BotStatsConnectionResolvers<ContextType>;
  BotStatsEdge?: BotStatsEdgeResolvers<ContextType>;
  CachedGuild?: CachedGuildResolvers<ContextType>;
  CachedGuildsEdge?: CachedGuildsEdgeResolvers<ContextType>;
  CachedUser?: CachedUserResolvers<ContextType>;
  CachedUsersEdge?: CachedUsersEdgeResolvers<ContextType>;
  CreateBotStatPayload?: CreateBotStatPayloadResolvers<ContextType>;
  CreateCachedGuildPayload?: CreateCachedGuildPayloadResolvers<ContextType>;
  CreateCachedUserPayload?: CreateCachedUserPayloadResolvers<ContextType>;
  CreateFeedItemPayload?: CreateFeedItemPayloadResolvers<ContextType>;
  CreateFeedPayload?: CreateFeedPayloadResolvers<ContextType>;
  CreateFeedSubscriptionPayload?: CreateFeedSubscriptionPayloadResolvers<ContextType>;
  CreateGuildBanPayload?: CreateGuildBanPayloadResolvers<ContextType>;
  CreateGuildConfigPayload?: CreateGuildConfigPayloadResolvers<ContextType>;
  CreateMemberPayload?: CreateMemberPayloadResolvers<ContextType>;
  CreateMessagePayload?: CreateMessagePayloadResolvers<ContextType>;
  CreateModLogPayload?: CreateModLogPayloadResolvers<ContextType>;
  CreateMutePayload?: CreateMutePayloadResolvers<ContextType>;
  CreateNotificationPayload?: CreateNotificationPayloadResolvers<ContextType>;
  CreateReminderPayload?: CreateReminderPayloadResolvers<ContextType>;
  CreateRoleMenuPayload?: CreateRoleMenuPayloadResolvers<ContextType>;
  CreateTagPayload?: CreateTagPayloadResolvers<ContextType>;
  CreateUserLevelPayload?: CreateUserLevelPayloadResolvers<ContextType>;
  CreateUserPayload?: CreateUserPayloadResolvers<ContextType>;
  CreateWebUserGuildPayload?: CreateWebUserGuildPayloadResolvers<ContextType>;
  CreateWebUserPayload?: CreateWebUserPayloadResolvers<ContextType>;
  CurrentUserManagedGuildIdEdge?: CurrentUserManagedGuildIdEdgeResolvers<ContextType>;
  CurrentUserManagedGuildIdsConnection?: CurrentUserManagedGuildIdsConnectionResolvers<ContextType>;
  Cursor?: GraphQLScalarType;
  Datetime?: GraphQLScalarType;
  DeleteBotStatPayload?: DeleteBotStatPayloadResolvers<ContextType>;
  DeleteCachedGuildPayload?: DeleteCachedGuildPayloadResolvers<ContextType>;
  DeleteCachedUserPayload?: DeleteCachedUserPayloadResolvers<ContextType>;
  DeleteFeedItemPayload?: DeleteFeedItemPayloadResolvers<ContextType>;
  DeleteFeedPayload?: DeleteFeedPayloadResolvers<ContextType>;
  DeleteFeedSubscriptionPayload?: DeleteFeedSubscriptionPayloadResolvers<ContextType>;
  DeleteGuildBanPayload?: DeleteGuildBanPayloadResolvers<ContextType>;
  DeleteGuildConfigPayload?: DeleteGuildConfigPayloadResolvers<ContextType>;
  DeleteMemberPayload?: DeleteMemberPayloadResolvers<ContextType>;
  DeleteModLogPayload?: DeleteModLogPayloadResolvers<ContextType>;
  DeleteMutePayload?: DeleteMutePayloadResolvers<ContextType>;
  DeleteNotificationPayload?: DeleteNotificationPayloadResolvers<ContextType>;
  DeleteReminderPayload?: DeleteReminderPayloadResolvers<ContextType>;
  DeleteRoleMenuPayload?: DeleteRoleMenuPayloadResolvers<ContextType>;
  DeleteTagPayload?: DeleteTagPayloadResolvers<ContextType>;
  DeleteUserLevelPayload?: DeleteUserLevelPayloadResolvers<ContextType>;
  DeleteUserPayload?: DeleteUserPayloadResolvers<ContextType>;
  DeleteWebUserGuildPayload?: DeleteWebUserGuildPayloadResolvers<ContextType>;
  DeleteWebUserPayload?: DeleteWebUserPayloadResolvers<ContextType>;
  Feed?: FeedResolvers<ContextType>;
  FeedItem?: FeedItemResolvers<ContextType>;
  FeedItemsConnection?: FeedItemsConnectionResolvers<ContextType>;
  FeedItemsEdge?: FeedItemsEdgeResolvers<ContextType>;
  FeedSubscription?: FeedSubscriptionResolvers<ContextType>;
  FeedSubscriptionsConnection?: FeedSubscriptionsConnectionResolvers<ContextType>;
  FeedSubscriptionsEdge?: FeedSubscriptionsEdgeResolvers<ContextType>;
  FeedsConnection?: FeedsConnectionResolvers<ContextType>;
  FeedsEdge?: FeedsEdgeResolvers<ContextType>;
  GraphqlPayload?: GraphqlPayloadResolvers<ContextType>;
  GuildBan?: GuildBanResolvers<ContextType>;
  GuildBansConnection?: GuildBansConnectionResolvers<ContextType>;
  GuildBansEdge?: GuildBansEdgeResolvers<ContextType>;
  GuildConfig?: GuildConfigResolvers<ContextType>;
  GuildConfigsConnection?: GuildConfigsConnectionResolvers<ContextType>;
  GuildConfigsEdge?: GuildConfigsEdgeResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  LogoutPayload?: LogoutPayloadResolvers<ContextType>;
  Member?: MemberResolvers<ContextType>;
  MembersConnection?: MembersConnectionResolvers<ContextType>;
  MembersEdge?: MembersEdgeResolvers<ContextType>;
  Message?: MessageResolvers<ContextType>;
  MessagesConnection?: MessagesConnectionResolvers<ContextType>;
  MessagesEdge?: MessagesEdgeResolvers<ContextType>;
  ModLog?: ModLogResolvers<ContextType>;
  ModLogsConnection?: ModLogsConnectionResolvers<ContextType>;
  ModLogsEdge?: ModLogsEdgeResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Mute?: MuteResolvers<ContextType>;
  MutesConnection?: MutesConnectionResolvers<ContextType>;
  MutesEdge?: MutesEdgeResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  Notification?: NotificationResolvers<ContextType>;
  NotificationsConnection?: NotificationsConnectionResolvers<ContextType>;
  NotificationsEdge?: NotificationsEdgeResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Reminder?: ReminderResolvers<ContextType>;
  RemindersConnection?: RemindersConnectionResolvers<ContextType>;
  RemindersEdge?: RemindersEdgeResolvers<ContextType>;
  RoleMenu?: RoleMenuResolvers<ContextType>;
  RoleMenusConnection?: RoleMenusConnectionResolvers<ContextType>;
  RoleMenusEdge?: RoleMenusEdgeResolvers<ContextType>;
  Tag?: TagResolvers<ContextType>;
  TagsConnection?: TagsConnectionResolvers<ContextType>;
  TagsEdge?: TagsEdgeResolvers<ContextType>;
  TimeframeUserLevelEdge?: TimeframeUserLevelEdgeResolvers<ContextType>;
  TimeframeUserLevelsConnection?: TimeframeUserLevelsConnectionResolvers<ContextType>;
  TimeframeUserLevelsRecord?: TimeframeUserLevelsRecordResolvers<ContextType>;
  UUID?: GraphQLScalarType;
  UpdateBotStatPayload?: UpdateBotStatPayloadResolvers<ContextType>;
  UpdateCachedGuildPayload?: UpdateCachedGuildPayloadResolvers<ContextType>;
  UpdateCachedUserPayload?: UpdateCachedUserPayloadResolvers<ContextType>;
  UpdateFeedItemPayload?: UpdateFeedItemPayloadResolvers<ContextType>;
  UpdateFeedPayload?: UpdateFeedPayloadResolvers<ContextType>;
  UpdateFeedSubscriptionPayload?: UpdateFeedSubscriptionPayloadResolvers<ContextType>;
  UpdateGuildBanPayload?: UpdateGuildBanPayloadResolvers<ContextType>;
  UpdateGuildConfigPayload?: UpdateGuildConfigPayloadResolvers<ContextType>;
  UpdateMemberPayload?: UpdateMemberPayloadResolvers<ContextType>;
  UpdateModLogPayload?: UpdateModLogPayloadResolvers<ContextType>;
  UpdateMutePayload?: UpdateMutePayloadResolvers<ContextType>;
  UpdateNotificationPayload?: UpdateNotificationPayloadResolvers<ContextType>;
  UpdateReminderPayload?: UpdateReminderPayloadResolvers<ContextType>;
  UpdateRoleMenuPayload?: UpdateRoleMenuPayloadResolvers<ContextType>;
  UpdateTagPayload?: UpdateTagPayloadResolvers<ContextType>;
  UpdateUserLevelPayload?: UpdateUserLevelPayloadResolvers<ContextType>;
  UpdateUserPayload?: UpdateUserPayloadResolvers<ContextType>;
  UpdateWebUserGuildPayload?: UpdateWebUserGuildPayloadResolvers<ContextType>;
  UpdateWebUserPayload?: UpdateWebUserPayloadResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserLevel?: UserLevelResolvers<ContextType>;
  UserLevelsEdge?: UserLevelsEdgeResolvers<ContextType>;
  UsersConnection?: UsersConnectionResolvers<ContextType>;
  UsersEdge?: UsersEdgeResolvers<ContextType>;
  WebUser?: WebUserResolvers<ContextType>;
  WebUserGuild?: WebUserGuildResolvers<ContextType>;
  WebUserGuildsConnection?: WebUserGuildsConnectionResolvers<ContextType>;
  WebUserGuildsEdge?: WebUserGuildsEdgeResolvers<ContextType>;
  WebUsersConnection?: WebUsersConnectionResolvers<ContextType>;
  WebUsersEdge?: WebUsersEdgeResolvers<ContextType>;
};


export type UserDataFragment = { __typename?: 'User', id: any, isPatron: boolean, rep: any, lastRep?: any | null, fishies: any, lastFishies?: any | null, lastfmUsername?: string | null, patronEmoji?: string | null, profileData?: any | null };

export type CreateUserMutationVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser?: { __typename?: 'CreateUserPayload', user?: { __typename?: 'User', id: any, isPatron: boolean, rep: any, lastRep?: any | null, fishies: any, lastFishies?: any | null, lastfmUsername?: string | null, patronEmoji?: string | null, profileData?: any | null } | null } | null };

export type UserByIdQueryVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type UserByIdQuery = { __typename?: 'Query', userById?: { __typename?: 'User', id: any, isPatron: boolean, rep: any, lastRep?: any | null, fishies: any, lastFishies?: any | null, lastfmUsername?: string | null, patronEmoji?: string | null, profileData?: any | null } | null };

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['BigInt'];
  userPatch: UserPatch;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUserById?: { __typename?: 'UpdateUserPayload', user?: { __typename?: 'User', id: any, isPatron: boolean, rep: any, lastRep?: any | null, fishies: any, lastFishies?: any | null, lastfmUsername?: string | null, patronEmoji?: string | null, profileData?: any | null } | null } | null };

export const UserDataFragmentDoc = gql`
    fragment UserData on User {
  id
  isPatron
  rep
  lastRep
  fishies
  lastFishies
  lastfmUsername
  patronEmoji
  profileData
}
    `;
export const CreateUserDocument = gql`
    mutation createUser($id: BigInt!) {
  createUser(input: {user: {id: $id, fishies: "0", isPatron: false, rep: "0"}}) {
    user {
      ...UserData
    }
  }
}
    ${UserDataFragmentDoc}`;
export const UserByIdDocument = gql`
    query userByID($id: BigInt!) {
  userById(id: $id) {
    ...UserData
  }
}
    ${UserDataFragmentDoc}`;
export const UpdateUserDocument = gql`
    mutation updateUser($id: BigInt!, $userPatch: UserPatch!) {
  updateUserById(input: {id: $id, userPatch: $userPatch}) {
    user {
      ...UserData
    }
  }
}
    ${UserDataFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    createUser(variables: CreateUserMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateUserMutation>(CreateUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createUser', 'mutation');
    },
    userByID(variables: UserByIdQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UserByIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<UserByIdQuery>(UserByIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'userByID', 'query');
    },
    updateUser(variables: UpdateUserMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateUserMutation>(UpdateUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateUser', 'mutation');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;