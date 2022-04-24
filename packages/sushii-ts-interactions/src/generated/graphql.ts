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

/** Represents an update to a `GuildConfig`. Fields that are set will be updated. */
export type GuildConfigPatch = {
  disabledChannels?: InputMaybe<Array<InputMaybe<Scalars['BigInt']>>>;
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

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a single `RoleMenu`. */
  createRoleMenu?: Maybe<CreateRoleMenuPayload>;
  /** Creates a single `User`. */
  createUser?: Maybe<CreateUserPayload>;
  /** Deletes a single `RoleMenu` using its globally unique id. */
  deleteRoleMenu?: Maybe<DeleteRoleMenuPayload>;
  /** Deletes a single `RoleMenu` using a unique key. */
  deleteRoleMenuByMessageId?: Maybe<DeleteRoleMenuPayload>;
  graphql?: Maybe<GraphqlPayload>;
  logout?: Maybe<LogoutPayload>;
  /** Updates a single `GuildConfig` using its globally unique id and a patch. */
  updateGuildConfig?: Maybe<UpdateGuildConfigPayload>;
  /** Updates a single `GuildConfig` using a unique key and a patch. */
  updateGuildConfigById?: Maybe<UpdateGuildConfigPayload>;
  /** Updates a single `RoleMenu` using its globally unique id and a patch. */
  updateRoleMenu?: Maybe<UpdateRoleMenuPayload>;
  /** Updates a single `RoleMenu` using a unique key and a patch. */
  updateRoleMenuByMessageId?: Maybe<UpdateRoleMenuPayload>;
  /** Updates a single `User` using its globally unique id and a patch. */
  updateUser?: Maybe<UpdateUserPayload>;
  /** Updates a single `User` using a unique key and a patch. */
  updateUserById?: Maybe<UpdateUserPayload>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateRoleMenuArgs = {
  input: CreateRoleMenuInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateUserArgs = {
  input: CreateUserInput;
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
export type MutationGraphqlArgs = {
  input: GraphqlInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationLogoutArgs = {
  input: LogoutInput;
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
export type MutationUpdateRoleMenuArgs = {
  input: UpdateRoleMenuInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateRoleMenuByMessageIdArgs = {
  input: UpdateRoleMenuByMessageIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserByIdArgs = {
  input: UpdateUserByIdInput;
};

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
};

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
  /** Reads and enables pagination through a set of `GuildConfig`. */
  allGuildConfigs?: Maybe<GuildConfigsConnection>;
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
  /** Reads a single `GuildConfig` using its globally unique `ID`. */
  guildConfig?: Maybe<GuildConfig>;
  guildConfigById?: Maybe<GuildConfig>;
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars['ID'];
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
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
export type QueryGuildConfigArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryGuildConfigByIdArgs = {
  id: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars['ID'];
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
  BotStatsConnection: ResolverTypeWrapper<BotStatsConnection>;
  BotStatsEdge: ResolverTypeWrapper<BotStatsEdge>;
  BotStatsOrderBy: BotStatsOrderBy;
  CachedGuild: ResolverTypeWrapper<CachedGuild>;
  CachedUser: ResolverTypeWrapper<CachedUser>;
  CreateRoleMenuInput: CreateRoleMenuInput;
  CreateRoleMenuPayload: ResolverTypeWrapper<CreateRoleMenuPayload>;
  CreateUserInput: CreateUserInput;
  CreateUserPayload: ResolverTypeWrapper<CreateUserPayload>;
  CurrentUserManagedGuildIdEdge: ResolverTypeWrapper<CurrentUserManagedGuildIdEdge>;
  CurrentUserManagedGuildIdsConnection: ResolverTypeWrapper<CurrentUserManagedGuildIdsConnection>;
  Cursor: ResolverTypeWrapper<Scalars['Cursor']>;
  Datetime: ResolverTypeWrapper<Scalars['Datetime']>;
  DeleteRoleMenuByMessageIdInput: DeleteRoleMenuByMessageIdInput;
  DeleteRoleMenuInput: DeleteRoleMenuInput;
  DeleteRoleMenuPayload: ResolverTypeWrapper<DeleteRoleMenuPayload>;
  GraphqlInput: GraphqlInput;
  GraphqlPayload: ResolverTypeWrapper<GraphqlPayload>;
  GuildConfig: ResolverTypeWrapper<GuildConfig>;
  GuildConfigCondition: GuildConfigCondition;
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
  Mutation: ResolverTypeWrapper<{}>;
  Node: ResolversTypes['BotStat'] | ResolversTypes['CachedGuild'] | ResolversTypes['CachedUser'] | ResolversTypes['GuildConfig'] | ResolversTypes['Query'] | ResolversTypes['RoleMenu'] | ResolversTypes['Tag'] | ResolversTypes['User'] | ResolversTypes['UserLevel'] | ResolversTypes['WebUser'] | ResolversTypes['WebUserGuild'];
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Query: ResolverTypeWrapper<{}>;
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
  TagsConnection: ResolverTypeWrapper<TagsConnection>;
  TagsEdge: ResolverTypeWrapper<TagsEdge>;
  TagsOrderBy: TagsOrderBy;
  TimeframeUserLevelEdge: ResolverTypeWrapper<TimeframeUserLevelEdge>;
  TimeframeUserLevelsConnection: ResolverTypeWrapper<TimeframeUserLevelsConnection>;
  TimeframeUserLevelsRecord: ResolverTypeWrapper<TimeframeUserLevelsRecord>;
  UUID: ResolverTypeWrapper<Scalars['UUID']>;
  UpdateGuildConfigByIdInput: UpdateGuildConfigByIdInput;
  UpdateGuildConfigInput: UpdateGuildConfigInput;
  UpdateGuildConfigPayload: ResolverTypeWrapper<UpdateGuildConfigPayload>;
  UpdateRoleMenuByMessageIdInput: UpdateRoleMenuByMessageIdInput;
  UpdateRoleMenuInput: UpdateRoleMenuInput;
  UpdateRoleMenuPayload: ResolverTypeWrapper<UpdateRoleMenuPayload>;
  UpdateUserByIdInput: UpdateUserByIdInput;
  UpdateUserInput: UpdateUserInput;
  UpdateUserPayload: ResolverTypeWrapper<UpdateUserPayload>;
  User: ResolverTypeWrapper<User>;
  UserCondition: UserCondition;
  UserInput: UserInput;
  UserLevel: ResolverTypeWrapper<UserLevel>;
  UserPatch: UserPatch;
  UsersConnection: ResolverTypeWrapper<UsersConnection>;
  UsersEdge: ResolverTypeWrapper<UsersEdge>;
  UsersOrderBy: UsersOrderBy;
  WebUser: ResolverTypeWrapper<WebUser>;
  WebUserCondition: WebUserCondition;
  WebUserGuild: ResolverTypeWrapper<WebUserGuild>;
  WebUserGuildCondition: WebUserGuildCondition;
  WebUserGuildsConnection: ResolverTypeWrapper<WebUserGuildsConnection>;
  WebUserGuildsEdge: ResolverTypeWrapper<WebUserGuildsEdge>;
  WebUserGuildsOrderBy: WebUserGuildsOrderBy;
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
  BotStatsConnection: BotStatsConnection;
  BotStatsEdge: BotStatsEdge;
  CachedGuild: CachedGuild;
  CachedUser: CachedUser;
  CreateRoleMenuInput: CreateRoleMenuInput;
  CreateRoleMenuPayload: CreateRoleMenuPayload;
  CreateUserInput: CreateUserInput;
  CreateUserPayload: CreateUserPayload;
  CurrentUserManagedGuildIdEdge: CurrentUserManagedGuildIdEdge;
  CurrentUserManagedGuildIdsConnection: CurrentUserManagedGuildIdsConnection;
  Cursor: Scalars['Cursor'];
  Datetime: Scalars['Datetime'];
  DeleteRoleMenuByMessageIdInput: DeleteRoleMenuByMessageIdInput;
  DeleteRoleMenuInput: DeleteRoleMenuInput;
  DeleteRoleMenuPayload: DeleteRoleMenuPayload;
  GraphqlInput: GraphqlInput;
  GraphqlPayload: GraphqlPayload;
  GuildConfig: GuildConfig;
  GuildConfigCondition: GuildConfigCondition;
  GuildConfigPatch: GuildConfigPatch;
  GuildConfigsConnection: GuildConfigsConnection;
  GuildConfigsEdge: GuildConfigsEdge;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  JSON: Scalars['JSON'];
  LogoutInput: LogoutInput;
  LogoutPayload: LogoutPayload;
  Mutation: {};
  Node: ResolversParentTypes['BotStat'] | ResolversParentTypes['CachedGuild'] | ResolversParentTypes['CachedUser'] | ResolversParentTypes['GuildConfig'] | ResolversParentTypes['Query'] | ResolversParentTypes['RoleMenu'] | ResolversParentTypes['Tag'] | ResolversParentTypes['User'] | ResolversParentTypes['UserLevel'] | ResolversParentTypes['WebUser'] | ResolversParentTypes['WebUserGuild'];
  PageInfo: PageInfo;
  Query: {};
  RoleMenu: RoleMenu;
  RoleMenuCondition: RoleMenuCondition;
  RoleMenuInput: RoleMenuInput;
  RoleMenuPatch: RoleMenuPatch;
  RoleMenusConnection: RoleMenusConnection;
  RoleMenusEdge: RoleMenusEdge;
  String: Scalars['String'];
  Tag: Tag;
  TagCondition: TagCondition;
  TagsConnection: TagsConnection;
  TagsEdge: TagsEdge;
  TimeframeUserLevelEdge: TimeframeUserLevelEdge;
  TimeframeUserLevelsConnection: TimeframeUserLevelsConnection;
  TimeframeUserLevelsRecord: TimeframeUserLevelsRecord;
  UUID: Scalars['UUID'];
  UpdateGuildConfigByIdInput: UpdateGuildConfigByIdInput;
  UpdateGuildConfigInput: UpdateGuildConfigInput;
  UpdateGuildConfigPayload: UpdateGuildConfigPayload;
  UpdateRoleMenuByMessageIdInput: UpdateRoleMenuByMessageIdInput;
  UpdateRoleMenuInput: UpdateRoleMenuInput;
  UpdateRoleMenuPayload: UpdateRoleMenuPayload;
  UpdateUserByIdInput: UpdateUserByIdInput;
  UpdateUserInput: UpdateUserInput;
  UpdateUserPayload: UpdateUserPayload;
  User: User;
  UserCondition: UserCondition;
  UserInput: UserInput;
  UserLevel: UserLevel;
  UserPatch: UserPatch;
  UsersConnection: UsersConnection;
  UsersEdge: UsersEdge;
  WebUser: WebUser;
  WebUserCondition: WebUserCondition;
  WebUserGuild: WebUserGuild;
  WebUserGuildCondition: WebUserGuildCondition;
  WebUserGuildsConnection: WebUserGuildsConnection;
  WebUserGuildsEdge: WebUserGuildsEdge;
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

export type CachedUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['CachedUser'] = ResolversParentTypes['CachedUser']> = {
  avatarUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  discriminator?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  lastChecked?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateRoleMenuPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateRoleMenuPayload'] = ResolversParentTypes['CreateRoleMenuPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  roleMenu?: Resolver<Maybe<ResolversTypes['RoleMenu']>, ParentType, ContextType>;
  roleMenuEdge?: Resolver<Maybe<ResolversTypes['RoleMenusEdge']>, ParentType, ContextType, RequireFields<CreateRoleMenuPayloadRoleMenuEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateUserPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateUserPayload'] = ResolversParentTypes['CreateUserPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userEdge?: Resolver<Maybe<ResolversTypes['UsersEdge']>, ParentType, ContextType, RequireFields<CreateUserPayloadUserEdgeArgs, 'orderBy'>>;
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

export type DeleteRoleMenuPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteRoleMenuPayload'] = ResolversParentTypes['DeleteRoleMenuPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deletedRoleMenuId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  roleMenu?: Resolver<Maybe<ResolversTypes['RoleMenu']>, ParentType, ContextType>;
  roleMenuEdge?: Resolver<Maybe<ResolversTypes['RoleMenusEdge']>, ParentType, ContextType, RequireFields<DeleteRoleMenuPayloadRoleMenuEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GraphqlPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['GraphqlPayload'] = ResolversParentTypes['GraphqlPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  json?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
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

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createRoleMenu?: Resolver<Maybe<ResolversTypes['CreateRoleMenuPayload']>, ParentType, ContextType, RequireFields<MutationCreateRoleMenuArgs, 'input'>>;
  createUser?: Resolver<Maybe<ResolversTypes['CreateUserPayload']>, ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  deleteRoleMenu?: Resolver<Maybe<ResolversTypes['DeleteRoleMenuPayload']>, ParentType, ContextType, RequireFields<MutationDeleteRoleMenuArgs, 'input'>>;
  deleteRoleMenuByMessageId?: Resolver<Maybe<ResolversTypes['DeleteRoleMenuPayload']>, ParentType, ContextType, RequireFields<MutationDeleteRoleMenuByMessageIdArgs, 'input'>>;
  graphql?: Resolver<Maybe<ResolversTypes['GraphqlPayload']>, ParentType, ContextType, RequireFields<MutationGraphqlArgs, 'input'>>;
  logout?: Resolver<Maybe<ResolversTypes['LogoutPayload']>, ParentType, ContextType, RequireFields<MutationLogoutArgs, 'input'>>;
  updateGuildConfig?: Resolver<Maybe<ResolversTypes['UpdateGuildConfigPayload']>, ParentType, ContextType, RequireFields<MutationUpdateGuildConfigArgs, 'input'>>;
  updateGuildConfigById?: Resolver<Maybe<ResolversTypes['UpdateGuildConfigPayload']>, ParentType, ContextType, RequireFields<MutationUpdateGuildConfigByIdArgs, 'input'>>;
  updateRoleMenu?: Resolver<Maybe<ResolversTypes['UpdateRoleMenuPayload']>, ParentType, ContextType, RequireFields<MutationUpdateRoleMenuArgs, 'input'>>;
  updateRoleMenuByMessageId?: Resolver<Maybe<ResolversTypes['UpdateRoleMenuPayload']>, ParentType, ContextType, RequireFields<MutationUpdateRoleMenuByMessageIdArgs, 'input'>>;
  updateUser?: Resolver<Maybe<ResolversTypes['UpdateUserPayload']>, ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input'>>;
  updateUserById?: Resolver<Maybe<ResolversTypes['UpdateUserPayload']>, ParentType, ContextType, RequireFields<MutationUpdateUserByIdArgs, 'input'>>;
};

export type NodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  __resolveType: TypeResolveFn<'BotStat' | 'CachedGuild' | 'CachedUser' | 'GuildConfig' | 'Query' | 'RoleMenu' | 'Tag' | 'User' | 'UserLevel' | 'WebUser' | 'WebUserGuild', ParentType, ContextType>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
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
  allGuildConfigs?: Resolver<Maybe<ResolversTypes['GuildConfigsConnection']>, ParentType, ContextType, RequireFields<QueryAllGuildConfigsArgs, 'orderBy'>>;
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
  guildConfig?: Resolver<Maybe<ResolversTypes['GuildConfig']>, ParentType, ContextType, RequireFields<QueryGuildConfigArgs, 'nodeId'>>;
  guildConfigById?: Resolver<Maybe<ResolversTypes['GuildConfig']>, ParentType, ContextType, RequireFields<QueryGuildConfigByIdArgs, 'id'>>;
  node?: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<QueryNodeArgs, 'nodeId'>>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
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

export type UpdateGuildConfigPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateGuildConfigPayload'] = ResolversParentTypes['UpdateGuildConfigPayload']> = {
  cachedGuildById?: Resolver<Maybe<ResolversTypes['CachedGuild']>, ParentType, ContextType>;
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  guildConfig?: Resolver<Maybe<ResolversTypes['GuildConfig']>, ParentType, ContextType>;
  guildConfigEdge?: Resolver<Maybe<ResolversTypes['GuildConfigsEdge']>, ParentType, ContextType, RequireFields<UpdateGuildConfigPayloadGuildConfigEdgeArgs, 'orderBy'>>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateRoleMenuPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateRoleMenuPayload'] = ResolversParentTypes['UpdateRoleMenuPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  roleMenu?: Resolver<Maybe<ResolversTypes['RoleMenu']>, ParentType, ContextType>;
  roleMenuEdge?: Resolver<Maybe<ResolversTypes['RoleMenusEdge']>, ParentType, ContextType, RequireFields<UpdateRoleMenuPayloadRoleMenuEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateUserPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateUserPayload'] = ResolversParentTypes['UpdateUserPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userEdge?: Resolver<Maybe<ResolversTypes['UsersEdge']>, ParentType, ContextType, RequireFields<UpdateUserPayloadUserEdgeArgs, 'orderBy'>>;
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
  CachedUser?: CachedUserResolvers<ContextType>;
  CreateRoleMenuPayload?: CreateRoleMenuPayloadResolvers<ContextType>;
  CreateUserPayload?: CreateUserPayloadResolvers<ContextType>;
  CurrentUserManagedGuildIdEdge?: CurrentUserManagedGuildIdEdgeResolvers<ContextType>;
  CurrentUserManagedGuildIdsConnection?: CurrentUserManagedGuildIdsConnectionResolvers<ContextType>;
  Cursor?: GraphQLScalarType;
  Datetime?: GraphQLScalarType;
  DeleteRoleMenuPayload?: DeleteRoleMenuPayloadResolvers<ContextType>;
  GraphqlPayload?: GraphqlPayloadResolvers<ContextType>;
  GuildConfig?: GuildConfigResolvers<ContextType>;
  GuildConfigsConnection?: GuildConfigsConnectionResolvers<ContextType>;
  GuildConfigsEdge?: GuildConfigsEdgeResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  LogoutPayload?: LogoutPayloadResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
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
  UpdateGuildConfigPayload?: UpdateGuildConfigPayloadResolvers<ContextType>;
  UpdateRoleMenuPayload?: UpdateRoleMenuPayloadResolvers<ContextType>;
  UpdateUserPayload?: UpdateUserPayloadResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserLevel?: UserLevelResolvers<ContextType>;
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