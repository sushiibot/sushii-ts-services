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
  /** A floating point number that requires more precision than IEEE 754 binary 64 */
  BigFloat: any;
  /**
   * A signed eight-byte integer. The upper big integer values are greater than the
   * max value for a JavaScript number. Therefore all big integers will be output as
   * strings and not numbers.
   */
  BigInt: string;
  /** A location in a connection that can be used for resuming pagination. */
  Cursor: any;
  /**
   * A point in time as described by the [ISO
   * 8601](https://en.wikipedia.org/wiki/ISO_8601) standard. May or may not include a timezone.
   */
  Datetime: string;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { [key: string]: any };
  /** A universally unique identifier as defined by [RFC 4122](https://tools.ietf.org/html/rfc4122). */
  UUID: any;
};

/** A filter to be used against BigInt fields. All fields are combined with a logical ‘and.’ */
export type BigIntFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['BigInt']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['BigInt']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['BigInt']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['BigInt']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['BigInt']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['BigInt']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['BigInt']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['BigInt']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['BigInt']>>;
};

/** A filter to be used against BigInt List fields. All fields are combined with a logical ‘and.’ */
export type BigIntListFilter = {
  /** Any array item is equal to the specified value. */
  anyEqualTo?: InputMaybe<Scalars['BigInt']>;
  /** Any array item is greater than the specified value. */
  anyGreaterThan?: InputMaybe<Scalars['BigInt']>;
  /** Any array item is greater than or equal to the specified value. */
  anyGreaterThanOrEqualTo?: InputMaybe<Scalars['BigInt']>;
  /** Any array item is less than the specified value. */
  anyLessThan?: InputMaybe<Scalars['BigInt']>;
  /** Any array item is less than or equal to the specified value. */
  anyLessThanOrEqualTo?: InputMaybe<Scalars['BigInt']>;
  /** Any array item is not equal to the specified value. */
  anyNotEqualTo?: InputMaybe<Scalars['BigInt']>;
  /** Contained by the specified list of values. */
  containedBy?: InputMaybe<Array<InputMaybe<Scalars['BigInt']>>>;
  /** Contains the specified list of values. */
  contains?: InputMaybe<Array<InputMaybe<Scalars['BigInt']>>>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Array<InputMaybe<Scalars['BigInt']>>>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Array<InputMaybe<Scalars['BigInt']>>>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Array<InputMaybe<Scalars['BigInt']>>>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Array<InputMaybe<Scalars['BigInt']>>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Array<InputMaybe<Scalars['BigInt']>>>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Array<InputMaybe<Scalars['BigInt']>>>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Array<InputMaybe<Scalars['BigInt']>>>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Array<InputMaybe<Scalars['BigInt']>>>;
  /** Overlaps the specified list of values. */
  overlaps?: InputMaybe<Array<InputMaybe<Scalars['BigInt']>>>;
};

/** A filter to be used against Boolean fields. All fields are combined with a logical ‘and.’ */
export type BooleanFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Boolean']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Boolean']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Boolean']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Boolean']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Boolean']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Boolean']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Boolean']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Boolean']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Boolean']>>;
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

export type BotStatAggregates = {
  __typename?: 'BotStatAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<BotStatAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<BotStatDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<BotStatMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<BotStatMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<BotStatStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<BotStatStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<BotStatSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<BotStatVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<BotStatVarianceSampleAggregates>;
};

export type BotStatAverageAggregates = {
  __typename?: 'BotStatAverageAggregates';
  /** Mean average of count across the matching connection */
  count?: Maybe<Scalars['BigFloat']>;
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

export type BotStatDistinctCountAggregates = {
  __typename?: 'BotStatDistinctCountAggregates';
  /** Distinct count of category across the matching connection */
  category?: Maybe<Scalars['BigInt']>;
  /** Distinct count of count across the matching connection */
  count?: Maybe<Scalars['BigInt']>;
  /** Distinct count of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigInt']>;
  /** Distinct count of name across the matching connection */
  name?: Maybe<Scalars['BigInt']>;
  /** Distinct count of updatedAt across the matching connection */
  updatedAt?: Maybe<Scalars['BigInt']>;
};

/** A filter to be used against `BotStat` object types. All fields are combined with a logical ‘and.’ */
export type BotStatFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<BotStatFilter>>;
  /** Filter by the object’s `category` field. */
  category?: InputMaybe<StringFilter>;
  /** Filter by the object’s `count` field. */
  count?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<BotStatFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<BotStatFilter>>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<DatetimeFilter>;
};

/** An input for mutations affecting `BotStat` */
export type BotStatInput = {
  category: Scalars['String'];
  count: Scalars['BigInt'];
  createdAt?: InputMaybe<Scalars['Datetime']>;
  name: Scalars['String'];
  updatedAt?: InputMaybe<Scalars['Datetime']>;
};

export type BotStatMaxAggregates = {
  __typename?: 'BotStatMaxAggregates';
  /** Maximum of count across the matching connection */
  count?: Maybe<Scalars['BigInt']>;
};

export type BotStatMinAggregates = {
  __typename?: 'BotStatMinAggregates';
  /** Minimum of count across the matching connection */
  count?: Maybe<Scalars['BigInt']>;
};

/** Represents an update to a `BotStat`. Fields that are set will be updated. */
export type BotStatPatch = {
  category?: InputMaybe<Scalars['String']>;
  count?: InputMaybe<Scalars['BigInt']>;
  createdAt?: InputMaybe<Scalars['Datetime']>;
  name?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['Datetime']>;
};

export type BotStatStddevPopulationAggregates = {
  __typename?: 'BotStatStddevPopulationAggregates';
  /** Population standard deviation of count across the matching connection */
  count?: Maybe<Scalars['BigFloat']>;
};

export type BotStatStddevSampleAggregates = {
  __typename?: 'BotStatStddevSampleAggregates';
  /** Sample standard deviation of count across the matching connection */
  count?: Maybe<Scalars['BigFloat']>;
};

export type BotStatSumAggregates = {
  __typename?: 'BotStatSumAggregates';
  /** Sum of count across the matching connection */
  count: Scalars['BigFloat'];
};

export type BotStatVariancePopulationAggregates = {
  __typename?: 'BotStatVariancePopulationAggregates';
  /** Population variance of count across the matching connection */
  count?: Maybe<Scalars['BigFloat']>;
};

export type BotStatVarianceSampleAggregates = {
  __typename?: 'BotStatVarianceSampleAggregates';
  /** Sample variance of count across the matching connection */
  count?: Maybe<Scalars['BigFloat']>;
};

/** A connection to a list of `BotStat` values. */
export type BotStatsConnection = {
  __typename?: 'BotStatsConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<BotStatAggregates>;
  /** A list of edges which contains the `BotStat` and cursor to aid in pagination. */
  edges: Array<BotStatsEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<BotStatAggregates>>;
  /** A list of `BotStat` objects. */
  nodes: Array<BotStat>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `BotStat` you could get from the connection. */
  totalCount: Scalars['Int'];
};


/** A connection to a list of `BotStat` values. */
export type BotStatsConnectionGroupedAggregatesArgs = {
  groupBy: Array<BotStatsGroupBy>;
  having?: InputMaybe<BotStatsHavingInput>;
};

/** A `BotStat` edge in the connection. */
export type BotStatsEdge = {
  __typename?: 'BotStatsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `BotStat` at the end of the edge. */
  node: BotStat;
};

/** Grouping methods for `BotStat` for usage during aggregation. */
export enum BotStatsGroupBy {
  Category = 'CATEGORY',
  Count = 'COUNT',
  CreatedAt = 'CREATED_AT',
  CreatedAtTruncatedToDay = 'CREATED_AT_TRUNCATED_TO_DAY',
  CreatedAtTruncatedToHour = 'CREATED_AT_TRUNCATED_TO_HOUR',
  Name = 'NAME',
  UpdatedAt = 'UPDATED_AT',
  UpdatedAtTruncatedToDay = 'UPDATED_AT_TRUNCATED_TO_DAY',
  UpdatedAtTruncatedToHour = 'UPDATED_AT_TRUNCATED_TO_HOUR'
}

export type BotStatsHavingAverageInput = {
  count?: InputMaybe<HavingBigintFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type BotStatsHavingDistinctCountInput = {
  count?: InputMaybe<HavingBigintFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

/** Conditions for `BotStat` aggregates. */
export type BotStatsHavingInput = {
  AND?: InputMaybe<Array<BotStatsHavingInput>>;
  OR?: InputMaybe<Array<BotStatsHavingInput>>;
  average?: InputMaybe<BotStatsHavingAverageInput>;
  distinctCount?: InputMaybe<BotStatsHavingDistinctCountInput>;
  max?: InputMaybe<BotStatsHavingMaxInput>;
  min?: InputMaybe<BotStatsHavingMinInput>;
  stddevPopulation?: InputMaybe<BotStatsHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<BotStatsHavingStddevSampleInput>;
  sum?: InputMaybe<BotStatsHavingSumInput>;
  variancePopulation?: InputMaybe<BotStatsHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<BotStatsHavingVarianceSampleInput>;
};

export type BotStatsHavingMaxInput = {
  count?: InputMaybe<HavingBigintFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type BotStatsHavingMinInput = {
  count?: InputMaybe<HavingBigintFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type BotStatsHavingStddevPopulationInput = {
  count?: InputMaybe<HavingBigintFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type BotStatsHavingStddevSampleInput = {
  count?: InputMaybe<HavingBigintFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type BotStatsHavingSumInput = {
  count?: InputMaybe<HavingBigintFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type BotStatsHavingVariancePopulationInput = {
  count?: InputMaybe<HavingBigintFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type BotStatsHavingVarianceSampleInput = {
  count?: InputMaybe<HavingBigintFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
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
  filter?: InputMaybe<WebUserGuildFilter>;
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
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  WebUserGuildsByGuildIdAverageGuildIdAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_AVERAGE_GUILD_ID_ASC',
  WebUserGuildsByGuildIdAverageGuildIdDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_AVERAGE_GUILD_ID_DESC',
  WebUserGuildsByGuildIdAverageManageGuildAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_AVERAGE_MANAGE_GUILD_ASC',
  WebUserGuildsByGuildIdAverageManageGuildDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_AVERAGE_MANAGE_GUILD_DESC',
  WebUserGuildsByGuildIdAverageOwnerAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_AVERAGE_OWNER_ASC',
  WebUserGuildsByGuildIdAverageOwnerDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_AVERAGE_OWNER_DESC',
  WebUserGuildsByGuildIdAveragePermissionsAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_AVERAGE_PERMISSIONS_ASC',
  WebUserGuildsByGuildIdAveragePermissionsDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_AVERAGE_PERMISSIONS_DESC',
  WebUserGuildsByGuildIdAverageUserIdAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_AVERAGE_USER_ID_ASC',
  WebUserGuildsByGuildIdAverageUserIdDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_AVERAGE_USER_ID_DESC',
  WebUserGuildsByGuildIdCountAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_COUNT_ASC',
  WebUserGuildsByGuildIdCountDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_COUNT_DESC',
  WebUserGuildsByGuildIdDistinctCountGuildIdAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_DISTINCT_COUNT_GUILD_ID_ASC',
  WebUserGuildsByGuildIdDistinctCountGuildIdDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_DISTINCT_COUNT_GUILD_ID_DESC',
  WebUserGuildsByGuildIdDistinctCountManageGuildAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_DISTINCT_COUNT_MANAGE_GUILD_ASC',
  WebUserGuildsByGuildIdDistinctCountManageGuildDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_DISTINCT_COUNT_MANAGE_GUILD_DESC',
  WebUserGuildsByGuildIdDistinctCountOwnerAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_DISTINCT_COUNT_OWNER_ASC',
  WebUserGuildsByGuildIdDistinctCountOwnerDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_DISTINCT_COUNT_OWNER_DESC',
  WebUserGuildsByGuildIdDistinctCountPermissionsAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_DISTINCT_COUNT_PERMISSIONS_ASC',
  WebUserGuildsByGuildIdDistinctCountPermissionsDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_DISTINCT_COUNT_PERMISSIONS_DESC',
  WebUserGuildsByGuildIdDistinctCountUserIdAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_DISTINCT_COUNT_USER_ID_ASC',
  WebUserGuildsByGuildIdDistinctCountUserIdDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_DISTINCT_COUNT_USER_ID_DESC',
  WebUserGuildsByGuildIdMaxGuildIdAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_MAX_GUILD_ID_ASC',
  WebUserGuildsByGuildIdMaxGuildIdDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_MAX_GUILD_ID_DESC',
  WebUserGuildsByGuildIdMaxManageGuildAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_MAX_MANAGE_GUILD_ASC',
  WebUserGuildsByGuildIdMaxManageGuildDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_MAX_MANAGE_GUILD_DESC',
  WebUserGuildsByGuildIdMaxOwnerAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_MAX_OWNER_ASC',
  WebUserGuildsByGuildIdMaxOwnerDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_MAX_OWNER_DESC',
  WebUserGuildsByGuildIdMaxPermissionsAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_MAX_PERMISSIONS_ASC',
  WebUserGuildsByGuildIdMaxPermissionsDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_MAX_PERMISSIONS_DESC',
  WebUserGuildsByGuildIdMaxUserIdAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_MAX_USER_ID_ASC',
  WebUserGuildsByGuildIdMaxUserIdDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_MAX_USER_ID_DESC',
  WebUserGuildsByGuildIdMinGuildIdAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_MIN_GUILD_ID_ASC',
  WebUserGuildsByGuildIdMinGuildIdDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_MIN_GUILD_ID_DESC',
  WebUserGuildsByGuildIdMinManageGuildAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_MIN_MANAGE_GUILD_ASC',
  WebUserGuildsByGuildIdMinManageGuildDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_MIN_MANAGE_GUILD_DESC',
  WebUserGuildsByGuildIdMinOwnerAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_MIN_OWNER_ASC',
  WebUserGuildsByGuildIdMinOwnerDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_MIN_OWNER_DESC',
  WebUserGuildsByGuildIdMinPermissionsAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_MIN_PERMISSIONS_ASC',
  WebUserGuildsByGuildIdMinPermissionsDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_MIN_PERMISSIONS_DESC',
  WebUserGuildsByGuildIdMinUserIdAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_MIN_USER_ID_ASC',
  WebUserGuildsByGuildIdMinUserIdDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_MIN_USER_ID_DESC',
  WebUserGuildsByGuildIdStddevPopulationGuildIdAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_STDDEV_POPULATION_GUILD_ID_ASC',
  WebUserGuildsByGuildIdStddevPopulationGuildIdDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_STDDEV_POPULATION_GUILD_ID_DESC',
  WebUserGuildsByGuildIdStddevPopulationManageGuildAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_STDDEV_POPULATION_MANAGE_GUILD_ASC',
  WebUserGuildsByGuildIdStddevPopulationManageGuildDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_STDDEV_POPULATION_MANAGE_GUILD_DESC',
  WebUserGuildsByGuildIdStddevPopulationOwnerAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_STDDEV_POPULATION_OWNER_ASC',
  WebUserGuildsByGuildIdStddevPopulationOwnerDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_STDDEV_POPULATION_OWNER_DESC',
  WebUserGuildsByGuildIdStddevPopulationPermissionsAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_STDDEV_POPULATION_PERMISSIONS_ASC',
  WebUserGuildsByGuildIdStddevPopulationPermissionsDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_STDDEV_POPULATION_PERMISSIONS_DESC',
  WebUserGuildsByGuildIdStddevPopulationUserIdAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_STDDEV_POPULATION_USER_ID_ASC',
  WebUserGuildsByGuildIdStddevPopulationUserIdDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_STDDEV_POPULATION_USER_ID_DESC',
  WebUserGuildsByGuildIdStddevSampleGuildIdAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_STDDEV_SAMPLE_GUILD_ID_ASC',
  WebUserGuildsByGuildIdStddevSampleGuildIdDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_STDDEV_SAMPLE_GUILD_ID_DESC',
  WebUserGuildsByGuildIdStddevSampleManageGuildAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_STDDEV_SAMPLE_MANAGE_GUILD_ASC',
  WebUserGuildsByGuildIdStddevSampleManageGuildDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_STDDEV_SAMPLE_MANAGE_GUILD_DESC',
  WebUserGuildsByGuildIdStddevSampleOwnerAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_STDDEV_SAMPLE_OWNER_ASC',
  WebUserGuildsByGuildIdStddevSampleOwnerDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_STDDEV_SAMPLE_OWNER_DESC',
  WebUserGuildsByGuildIdStddevSamplePermissionsAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_STDDEV_SAMPLE_PERMISSIONS_ASC',
  WebUserGuildsByGuildIdStddevSamplePermissionsDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_STDDEV_SAMPLE_PERMISSIONS_DESC',
  WebUserGuildsByGuildIdStddevSampleUserIdAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_STDDEV_SAMPLE_USER_ID_ASC',
  WebUserGuildsByGuildIdStddevSampleUserIdDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_STDDEV_SAMPLE_USER_ID_DESC',
  WebUserGuildsByGuildIdSumGuildIdAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_SUM_GUILD_ID_ASC',
  WebUserGuildsByGuildIdSumGuildIdDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_SUM_GUILD_ID_DESC',
  WebUserGuildsByGuildIdSumManageGuildAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_SUM_MANAGE_GUILD_ASC',
  WebUserGuildsByGuildIdSumManageGuildDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_SUM_MANAGE_GUILD_DESC',
  WebUserGuildsByGuildIdSumOwnerAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_SUM_OWNER_ASC',
  WebUserGuildsByGuildIdSumOwnerDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_SUM_OWNER_DESC',
  WebUserGuildsByGuildIdSumPermissionsAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_SUM_PERMISSIONS_ASC',
  WebUserGuildsByGuildIdSumPermissionsDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_SUM_PERMISSIONS_DESC',
  WebUserGuildsByGuildIdSumUserIdAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_SUM_USER_ID_ASC',
  WebUserGuildsByGuildIdSumUserIdDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_SUM_USER_ID_DESC',
  WebUserGuildsByGuildIdVariancePopulationGuildIdAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_VARIANCE_POPULATION_GUILD_ID_ASC',
  WebUserGuildsByGuildIdVariancePopulationGuildIdDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_VARIANCE_POPULATION_GUILD_ID_DESC',
  WebUserGuildsByGuildIdVariancePopulationManageGuildAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_VARIANCE_POPULATION_MANAGE_GUILD_ASC',
  WebUserGuildsByGuildIdVariancePopulationManageGuildDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_VARIANCE_POPULATION_MANAGE_GUILD_DESC',
  WebUserGuildsByGuildIdVariancePopulationOwnerAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_VARIANCE_POPULATION_OWNER_ASC',
  WebUserGuildsByGuildIdVariancePopulationOwnerDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_VARIANCE_POPULATION_OWNER_DESC',
  WebUserGuildsByGuildIdVariancePopulationPermissionsAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_VARIANCE_POPULATION_PERMISSIONS_ASC',
  WebUserGuildsByGuildIdVariancePopulationPermissionsDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_VARIANCE_POPULATION_PERMISSIONS_DESC',
  WebUserGuildsByGuildIdVariancePopulationUserIdAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_VARIANCE_POPULATION_USER_ID_ASC',
  WebUserGuildsByGuildIdVariancePopulationUserIdDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_VARIANCE_POPULATION_USER_ID_DESC',
  WebUserGuildsByGuildIdVarianceSampleGuildIdAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_VARIANCE_SAMPLE_GUILD_ID_ASC',
  WebUserGuildsByGuildIdVarianceSampleGuildIdDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_VARIANCE_SAMPLE_GUILD_ID_DESC',
  WebUserGuildsByGuildIdVarianceSampleManageGuildAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_VARIANCE_SAMPLE_MANAGE_GUILD_ASC',
  WebUserGuildsByGuildIdVarianceSampleManageGuildDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_VARIANCE_SAMPLE_MANAGE_GUILD_DESC',
  WebUserGuildsByGuildIdVarianceSampleOwnerAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_VARIANCE_SAMPLE_OWNER_ASC',
  WebUserGuildsByGuildIdVarianceSampleOwnerDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_VARIANCE_SAMPLE_OWNER_DESC',
  WebUserGuildsByGuildIdVarianceSamplePermissionsAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_VARIANCE_SAMPLE_PERMISSIONS_ASC',
  WebUserGuildsByGuildIdVarianceSamplePermissionsDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_VARIANCE_SAMPLE_PERMISSIONS_DESC',
  WebUserGuildsByGuildIdVarianceSampleUserIdAsc = 'WEB_USER_GUILDS_BY_GUILD_ID_VARIANCE_SAMPLE_USER_ID_ASC',
  WebUserGuildsByGuildIdVarianceSampleUserIdDesc = 'WEB_USER_GUILDS_BY_GUILD_ID_VARIANCE_SAMPLE_USER_ID_DESC'
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

/** A filter to be used against Datetime fields. All fields are combined with a logical ‘and.’ */
export type DatetimeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Datetime']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Datetime']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Datetime']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Datetime']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Datetime']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Datetime']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Datetime']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Datetime']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Datetime']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Datetime']>>;
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

/** All input for the `deleteRoleMenuByGuildIdAndMenuName` mutation. */
export type DeleteRoleMenuByGuildIdAndMenuNameInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  guildId: Scalars['BigInt'];
  menuName: Scalars['String'];
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
  filter?: InputMaybe<FeedSubscriptionFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<FeedSubscriptionsOrderBy>>;
};

export type FeedAggregates = {
  __typename?: 'FeedAggregates';
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<FeedDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']>>;
};

/** A condition to be used against `Feed` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type FeedCondition = {
  /** Checks for equality with the object’s `feedId` field. */
  feedId?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `metadata` field. */
  metadata?: InputMaybe<Scalars['JSON']>;
};

export type FeedDistinctCountAggregates = {
  __typename?: 'FeedDistinctCountAggregates';
  /** Distinct count of feedId across the matching connection */
  feedId?: Maybe<Scalars['BigInt']>;
  /** Distinct count of metadata across the matching connection */
  metadata?: Maybe<Scalars['BigInt']>;
};

/** A filter to be used against `Feed` object types. All fields are combined with a logical ‘and.’ */
export type FeedFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<FeedFilter>>;
  /** Filter by the object’s `feedId` field. */
  feedId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `metadata` field. */
  metadata?: InputMaybe<JsonFilter>;
  /** Negates the expression. */
  not?: InputMaybe<FeedFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<FeedFilter>>;
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

export type FeedItemAggregates = {
  __typename?: 'FeedItemAggregates';
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<FeedItemDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']>>;
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

export type FeedItemDistinctCountAggregates = {
  __typename?: 'FeedItemDistinctCountAggregates';
  /** Distinct count of feedId across the matching connection */
  feedId?: Maybe<Scalars['BigInt']>;
  /** Distinct count of itemId across the matching connection */
  itemId?: Maybe<Scalars['BigInt']>;
};

/** A filter to be used against `FeedItem` object types. All fields are combined with a logical ‘and.’ */
export type FeedItemFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<FeedItemFilter>>;
  /** Filter by the object’s `feedId` field. */
  feedId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `itemId` field. */
  itemId?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<FeedItemFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<FeedItemFilter>>;
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
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<FeedItemAggregates>;
  /** A list of edges which contains the `FeedItem` and cursor to aid in pagination. */
  edges: Array<FeedItemsEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<FeedItemAggregates>>;
  /** A list of `FeedItem` objects. */
  nodes: Array<FeedItem>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `FeedItem` you could get from the connection. */
  totalCount: Scalars['Int'];
};


/** A connection to a list of `FeedItem` values. */
export type FeedItemsConnectionGroupedAggregatesArgs = {
  groupBy: Array<FeedItemsGroupBy>;
  having?: InputMaybe<FeedItemsHavingInput>;
};

/** A `FeedItem` edge in the connection. */
export type FeedItemsEdge = {
  __typename?: 'FeedItemsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `FeedItem` at the end of the edge. */
  node: FeedItem;
};

/** Grouping methods for `FeedItem` for usage during aggregation. */
export enum FeedItemsGroupBy {
  FeedId = 'FEED_ID',
  ItemId = 'ITEM_ID'
}

/** Conditions for `FeedItem` aggregates. */
export type FeedItemsHavingInput = {
  AND?: InputMaybe<Array<FeedItemsHavingInput>>;
  OR?: InputMaybe<Array<FeedItemsHavingInput>>;
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

export type FeedSubscriptionAggregates = {
  __typename?: 'FeedSubscriptionAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<FeedSubscriptionAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<FeedSubscriptionDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<FeedSubscriptionMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<FeedSubscriptionMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<FeedSubscriptionStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<FeedSubscriptionStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<FeedSubscriptionSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<FeedSubscriptionVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<FeedSubscriptionVarianceSampleAggregates>;
};

export type FeedSubscriptionAverageAggregates = {
  __typename?: 'FeedSubscriptionAverageAggregates';
  /** Mean average of channelId across the matching connection */
  channelId?: Maybe<Scalars['BigFloat']>;
  /** Mean average of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Mean average of mentionRole across the matching connection */
  mentionRole?: Maybe<Scalars['BigFloat']>;
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

export type FeedSubscriptionDistinctCountAggregates = {
  __typename?: 'FeedSubscriptionDistinctCountAggregates';
  /** Distinct count of channelId across the matching connection */
  channelId?: Maybe<Scalars['BigInt']>;
  /** Distinct count of feedId across the matching connection */
  feedId?: Maybe<Scalars['BigInt']>;
  /** Distinct count of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Distinct count of mentionRole across the matching connection */
  mentionRole?: Maybe<Scalars['BigInt']>;
};

/** A filter to be used against `FeedSubscription` object types. All fields are combined with a logical ‘and.’ */
export type FeedSubscriptionFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<FeedSubscriptionFilter>>;
  /** Filter by the object’s `channelId` field. */
  channelId?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `feedId` field. */
  feedId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `guildId` field. */
  guildId?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `mentionRole` field. */
  mentionRole?: InputMaybe<BigIntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<FeedSubscriptionFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<FeedSubscriptionFilter>>;
};

/** An input for mutations affecting `FeedSubscription` */
export type FeedSubscriptionInput = {
  channelId: Scalars['BigInt'];
  feedId: Scalars['String'];
  guildId: Scalars['BigInt'];
  mentionRole?: InputMaybe<Scalars['BigInt']>;
};

export type FeedSubscriptionMaxAggregates = {
  __typename?: 'FeedSubscriptionMaxAggregates';
  /** Maximum of channelId across the matching connection */
  channelId?: Maybe<Scalars['BigInt']>;
  /** Maximum of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Maximum of mentionRole across the matching connection */
  mentionRole?: Maybe<Scalars['BigInt']>;
};

export type FeedSubscriptionMinAggregates = {
  __typename?: 'FeedSubscriptionMinAggregates';
  /** Minimum of channelId across the matching connection */
  channelId?: Maybe<Scalars['BigInt']>;
  /** Minimum of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Minimum of mentionRole across the matching connection */
  mentionRole?: Maybe<Scalars['BigInt']>;
};

/** Represents an update to a `FeedSubscription`. Fields that are set will be updated. */
export type FeedSubscriptionPatch = {
  channelId?: InputMaybe<Scalars['BigInt']>;
  feedId?: InputMaybe<Scalars['String']>;
  guildId?: InputMaybe<Scalars['BigInt']>;
  mentionRole?: InputMaybe<Scalars['BigInt']>;
};

export type FeedSubscriptionStddevPopulationAggregates = {
  __typename?: 'FeedSubscriptionStddevPopulationAggregates';
  /** Population standard deviation of channelId across the matching connection */
  channelId?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of mentionRole across the matching connection */
  mentionRole?: Maybe<Scalars['BigFloat']>;
};

export type FeedSubscriptionStddevSampleAggregates = {
  __typename?: 'FeedSubscriptionStddevSampleAggregates';
  /** Sample standard deviation of channelId across the matching connection */
  channelId?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of mentionRole across the matching connection */
  mentionRole?: Maybe<Scalars['BigFloat']>;
};

export type FeedSubscriptionSumAggregates = {
  __typename?: 'FeedSubscriptionSumAggregates';
  /** Sum of channelId across the matching connection */
  channelId: Scalars['BigFloat'];
  /** Sum of guildId across the matching connection */
  guildId: Scalars['BigFloat'];
  /** Sum of mentionRole across the matching connection */
  mentionRole: Scalars['BigFloat'];
};

export type FeedSubscriptionVariancePopulationAggregates = {
  __typename?: 'FeedSubscriptionVariancePopulationAggregates';
  /** Population variance of channelId across the matching connection */
  channelId?: Maybe<Scalars['BigFloat']>;
  /** Population variance of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Population variance of mentionRole across the matching connection */
  mentionRole?: Maybe<Scalars['BigFloat']>;
};

export type FeedSubscriptionVarianceSampleAggregates = {
  __typename?: 'FeedSubscriptionVarianceSampleAggregates';
  /** Sample variance of channelId across the matching connection */
  channelId?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of mentionRole across the matching connection */
  mentionRole?: Maybe<Scalars['BigFloat']>;
};

/** A connection to a list of `FeedSubscription` values. */
export type FeedSubscriptionsConnection = {
  __typename?: 'FeedSubscriptionsConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<FeedSubscriptionAggregates>;
  /** A list of edges which contains the `FeedSubscription` and cursor to aid in pagination. */
  edges: Array<FeedSubscriptionsEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<FeedSubscriptionAggregates>>;
  /** A list of `FeedSubscription` objects. */
  nodes: Array<FeedSubscription>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `FeedSubscription` you could get from the connection. */
  totalCount: Scalars['Int'];
};


/** A connection to a list of `FeedSubscription` values. */
export type FeedSubscriptionsConnectionGroupedAggregatesArgs = {
  groupBy: Array<FeedSubscriptionsGroupBy>;
  having?: InputMaybe<FeedSubscriptionsHavingInput>;
};

/** A `FeedSubscription` edge in the connection. */
export type FeedSubscriptionsEdge = {
  __typename?: 'FeedSubscriptionsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `FeedSubscription` at the end of the edge. */
  node: FeedSubscription;
};

/** Grouping methods for `FeedSubscription` for usage during aggregation. */
export enum FeedSubscriptionsGroupBy {
  ChannelId = 'CHANNEL_ID',
  FeedId = 'FEED_ID',
  GuildId = 'GUILD_ID',
  MentionRole = 'MENTION_ROLE'
}

export type FeedSubscriptionsHavingAverageInput = {
  channelId?: InputMaybe<HavingBigintFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  mentionRole?: InputMaybe<HavingBigintFilter>;
};

export type FeedSubscriptionsHavingDistinctCountInput = {
  channelId?: InputMaybe<HavingBigintFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  mentionRole?: InputMaybe<HavingBigintFilter>;
};

/** Conditions for `FeedSubscription` aggregates. */
export type FeedSubscriptionsHavingInput = {
  AND?: InputMaybe<Array<FeedSubscriptionsHavingInput>>;
  OR?: InputMaybe<Array<FeedSubscriptionsHavingInput>>;
  average?: InputMaybe<FeedSubscriptionsHavingAverageInput>;
  distinctCount?: InputMaybe<FeedSubscriptionsHavingDistinctCountInput>;
  max?: InputMaybe<FeedSubscriptionsHavingMaxInput>;
  min?: InputMaybe<FeedSubscriptionsHavingMinInput>;
  stddevPopulation?: InputMaybe<FeedSubscriptionsHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<FeedSubscriptionsHavingStddevSampleInput>;
  sum?: InputMaybe<FeedSubscriptionsHavingSumInput>;
  variancePopulation?: InputMaybe<FeedSubscriptionsHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<FeedSubscriptionsHavingVarianceSampleInput>;
};

export type FeedSubscriptionsHavingMaxInput = {
  channelId?: InputMaybe<HavingBigintFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  mentionRole?: InputMaybe<HavingBigintFilter>;
};

export type FeedSubscriptionsHavingMinInput = {
  channelId?: InputMaybe<HavingBigintFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  mentionRole?: InputMaybe<HavingBigintFilter>;
};

export type FeedSubscriptionsHavingStddevPopulationInput = {
  channelId?: InputMaybe<HavingBigintFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  mentionRole?: InputMaybe<HavingBigintFilter>;
};

export type FeedSubscriptionsHavingStddevSampleInput = {
  channelId?: InputMaybe<HavingBigintFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  mentionRole?: InputMaybe<HavingBigintFilter>;
};

export type FeedSubscriptionsHavingSumInput = {
  channelId?: InputMaybe<HavingBigintFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  mentionRole?: InputMaybe<HavingBigintFilter>;
};

export type FeedSubscriptionsHavingVariancePopulationInput = {
  channelId?: InputMaybe<HavingBigintFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  mentionRole?: InputMaybe<HavingBigintFilter>;
};

export type FeedSubscriptionsHavingVarianceSampleInput = {
  channelId?: InputMaybe<HavingBigintFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  mentionRole?: InputMaybe<HavingBigintFilter>;
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
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<FeedAggregates>;
  /** A list of edges which contains the `Feed` and cursor to aid in pagination. */
  edges: Array<FeedsEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<FeedAggregates>>;
  /** A list of `Feed` objects. */
  nodes: Array<Feed>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Feed` you could get from the connection. */
  totalCount: Scalars['Int'];
};


/** A connection to a list of `Feed` values. */
export type FeedsConnectionGroupedAggregatesArgs = {
  groupBy: Array<FeedsGroupBy>;
  having?: InputMaybe<FeedsHavingInput>;
};

/** A `Feed` edge in the connection. */
export type FeedsEdge = {
  __typename?: 'FeedsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Feed` at the end of the edge. */
  node: Feed;
};

/** Grouping methods for `Feed` for usage during aggregation. */
export enum FeedsGroupBy {
  Metadata = 'METADATA'
}

/** Conditions for `Feed` aggregates. */
export type FeedsHavingInput = {
  AND?: InputMaybe<Array<FeedsHavingInput>>;
  OR?: InputMaybe<Array<FeedsHavingInput>>;
};

/** Methods to use when ordering `Feed`. */
export enum FeedsOrderBy {
  FeedIdAsc = 'FEED_ID_ASC',
  FeedIdDesc = 'FEED_ID_DESC',
  FeedSubscriptionsByFeedIdAverageChannelIdAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_AVERAGE_CHANNEL_ID_ASC',
  FeedSubscriptionsByFeedIdAverageChannelIdDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_AVERAGE_CHANNEL_ID_DESC',
  FeedSubscriptionsByFeedIdAverageFeedIdAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_AVERAGE_FEED_ID_ASC',
  FeedSubscriptionsByFeedIdAverageFeedIdDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_AVERAGE_FEED_ID_DESC',
  FeedSubscriptionsByFeedIdAverageGuildIdAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_AVERAGE_GUILD_ID_ASC',
  FeedSubscriptionsByFeedIdAverageGuildIdDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_AVERAGE_GUILD_ID_DESC',
  FeedSubscriptionsByFeedIdAverageMentionRoleAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_AVERAGE_MENTION_ROLE_ASC',
  FeedSubscriptionsByFeedIdAverageMentionRoleDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_AVERAGE_MENTION_ROLE_DESC',
  FeedSubscriptionsByFeedIdCountAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_COUNT_ASC',
  FeedSubscriptionsByFeedIdCountDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_COUNT_DESC',
  FeedSubscriptionsByFeedIdDistinctCountChannelIdAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_DISTINCT_COUNT_CHANNEL_ID_ASC',
  FeedSubscriptionsByFeedIdDistinctCountChannelIdDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_DISTINCT_COUNT_CHANNEL_ID_DESC',
  FeedSubscriptionsByFeedIdDistinctCountFeedIdAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_DISTINCT_COUNT_FEED_ID_ASC',
  FeedSubscriptionsByFeedIdDistinctCountFeedIdDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_DISTINCT_COUNT_FEED_ID_DESC',
  FeedSubscriptionsByFeedIdDistinctCountGuildIdAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_DISTINCT_COUNT_GUILD_ID_ASC',
  FeedSubscriptionsByFeedIdDistinctCountGuildIdDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_DISTINCT_COUNT_GUILD_ID_DESC',
  FeedSubscriptionsByFeedIdDistinctCountMentionRoleAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_DISTINCT_COUNT_MENTION_ROLE_ASC',
  FeedSubscriptionsByFeedIdDistinctCountMentionRoleDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_DISTINCT_COUNT_MENTION_ROLE_DESC',
  FeedSubscriptionsByFeedIdMaxChannelIdAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_MAX_CHANNEL_ID_ASC',
  FeedSubscriptionsByFeedIdMaxChannelIdDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_MAX_CHANNEL_ID_DESC',
  FeedSubscriptionsByFeedIdMaxFeedIdAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_MAX_FEED_ID_ASC',
  FeedSubscriptionsByFeedIdMaxFeedIdDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_MAX_FEED_ID_DESC',
  FeedSubscriptionsByFeedIdMaxGuildIdAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_MAX_GUILD_ID_ASC',
  FeedSubscriptionsByFeedIdMaxGuildIdDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_MAX_GUILD_ID_DESC',
  FeedSubscriptionsByFeedIdMaxMentionRoleAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_MAX_MENTION_ROLE_ASC',
  FeedSubscriptionsByFeedIdMaxMentionRoleDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_MAX_MENTION_ROLE_DESC',
  FeedSubscriptionsByFeedIdMinChannelIdAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_MIN_CHANNEL_ID_ASC',
  FeedSubscriptionsByFeedIdMinChannelIdDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_MIN_CHANNEL_ID_DESC',
  FeedSubscriptionsByFeedIdMinFeedIdAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_MIN_FEED_ID_ASC',
  FeedSubscriptionsByFeedIdMinFeedIdDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_MIN_FEED_ID_DESC',
  FeedSubscriptionsByFeedIdMinGuildIdAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_MIN_GUILD_ID_ASC',
  FeedSubscriptionsByFeedIdMinGuildIdDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_MIN_GUILD_ID_DESC',
  FeedSubscriptionsByFeedIdMinMentionRoleAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_MIN_MENTION_ROLE_ASC',
  FeedSubscriptionsByFeedIdMinMentionRoleDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_MIN_MENTION_ROLE_DESC',
  FeedSubscriptionsByFeedIdStddevPopulationChannelIdAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_STDDEV_POPULATION_CHANNEL_ID_ASC',
  FeedSubscriptionsByFeedIdStddevPopulationChannelIdDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_STDDEV_POPULATION_CHANNEL_ID_DESC',
  FeedSubscriptionsByFeedIdStddevPopulationFeedIdAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_STDDEV_POPULATION_FEED_ID_ASC',
  FeedSubscriptionsByFeedIdStddevPopulationFeedIdDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_STDDEV_POPULATION_FEED_ID_DESC',
  FeedSubscriptionsByFeedIdStddevPopulationGuildIdAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_STDDEV_POPULATION_GUILD_ID_ASC',
  FeedSubscriptionsByFeedIdStddevPopulationGuildIdDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_STDDEV_POPULATION_GUILD_ID_DESC',
  FeedSubscriptionsByFeedIdStddevPopulationMentionRoleAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_STDDEV_POPULATION_MENTION_ROLE_ASC',
  FeedSubscriptionsByFeedIdStddevPopulationMentionRoleDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_STDDEV_POPULATION_MENTION_ROLE_DESC',
  FeedSubscriptionsByFeedIdStddevSampleChannelIdAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_STDDEV_SAMPLE_CHANNEL_ID_ASC',
  FeedSubscriptionsByFeedIdStddevSampleChannelIdDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_STDDEV_SAMPLE_CHANNEL_ID_DESC',
  FeedSubscriptionsByFeedIdStddevSampleFeedIdAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_STDDEV_SAMPLE_FEED_ID_ASC',
  FeedSubscriptionsByFeedIdStddevSampleFeedIdDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_STDDEV_SAMPLE_FEED_ID_DESC',
  FeedSubscriptionsByFeedIdStddevSampleGuildIdAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_STDDEV_SAMPLE_GUILD_ID_ASC',
  FeedSubscriptionsByFeedIdStddevSampleGuildIdDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_STDDEV_SAMPLE_GUILD_ID_DESC',
  FeedSubscriptionsByFeedIdStddevSampleMentionRoleAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_STDDEV_SAMPLE_MENTION_ROLE_ASC',
  FeedSubscriptionsByFeedIdStddevSampleMentionRoleDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_STDDEV_SAMPLE_MENTION_ROLE_DESC',
  FeedSubscriptionsByFeedIdSumChannelIdAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_SUM_CHANNEL_ID_ASC',
  FeedSubscriptionsByFeedIdSumChannelIdDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_SUM_CHANNEL_ID_DESC',
  FeedSubscriptionsByFeedIdSumFeedIdAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_SUM_FEED_ID_ASC',
  FeedSubscriptionsByFeedIdSumFeedIdDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_SUM_FEED_ID_DESC',
  FeedSubscriptionsByFeedIdSumGuildIdAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_SUM_GUILD_ID_ASC',
  FeedSubscriptionsByFeedIdSumGuildIdDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_SUM_GUILD_ID_DESC',
  FeedSubscriptionsByFeedIdSumMentionRoleAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_SUM_MENTION_ROLE_ASC',
  FeedSubscriptionsByFeedIdSumMentionRoleDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_SUM_MENTION_ROLE_DESC',
  FeedSubscriptionsByFeedIdVariancePopulationChannelIdAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_VARIANCE_POPULATION_CHANNEL_ID_ASC',
  FeedSubscriptionsByFeedIdVariancePopulationChannelIdDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_VARIANCE_POPULATION_CHANNEL_ID_DESC',
  FeedSubscriptionsByFeedIdVariancePopulationFeedIdAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_VARIANCE_POPULATION_FEED_ID_ASC',
  FeedSubscriptionsByFeedIdVariancePopulationFeedIdDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_VARIANCE_POPULATION_FEED_ID_DESC',
  FeedSubscriptionsByFeedIdVariancePopulationGuildIdAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_VARIANCE_POPULATION_GUILD_ID_ASC',
  FeedSubscriptionsByFeedIdVariancePopulationGuildIdDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_VARIANCE_POPULATION_GUILD_ID_DESC',
  FeedSubscriptionsByFeedIdVariancePopulationMentionRoleAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_VARIANCE_POPULATION_MENTION_ROLE_ASC',
  FeedSubscriptionsByFeedIdVariancePopulationMentionRoleDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_VARIANCE_POPULATION_MENTION_ROLE_DESC',
  FeedSubscriptionsByFeedIdVarianceSampleChannelIdAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_VARIANCE_SAMPLE_CHANNEL_ID_ASC',
  FeedSubscriptionsByFeedIdVarianceSampleChannelIdDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_VARIANCE_SAMPLE_CHANNEL_ID_DESC',
  FeedSubscriptionsByFeedIdVarianceSampleFeedIdAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_VARIANCE_SAMPLE_FEED_ID_ASC',
  FeedSubscriptionsByFeedIdVarianceSampleFeedIdDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_VARIANCE_SAMPLE_FEED_ID_DESC',
  FeedSubscriptionsByFeedIdVarianceSampleGuildIdAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_VARIANCE_SAMPLE_GUILD_ID_ASC',
  FeedSubscriptionsByFeedIdVarianceSampleGuildIdDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_VARIANCE_SAMPLE_GUILD_ID_DESC',
  FeedSubscriptionsByFeedIdVarianceSampleMentionRoleAsc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_VARIANCE_SAMPLE_MENTION_ROLE_ASC',
  FeedSubscriptionsByFeedIdVarianceSampleMentionRoleDesc = 'FEED_SUBSCRIPTIONS_BY_FEED_ID_VARIANCE_SAMPLE_MENTION_ROLE_DESC',
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

export type GuildBanAggregates = {
  __typename?: 'GuildBanAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<GuildBanAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<GuildBanDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<GuildBanMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<GuildBanMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<GuildBanStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<GuildBanStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<GuildBanSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<GuildBanVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<GuildBanVarianceSampleAggregates>;
};

export type GuildBanAverageAggregates = {
  __typename?: 'GuildBanAverageAggregates';
  /** Mean average of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Mean average of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
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

export type GuildBanDistinctCountAggregates = {
  __typename?: 'GuildBanDistinctCountAggregates';
  /** Distinct count of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Distinct count of userId across the matching connection */
  userId?: Maybe<Scalars['BigInt']>;
};

/** A filter to be used against `GuildBan` object types. All fields are combined with a logical ‘and.’ */
export type GuildBanFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<GuildBanFilter>>;
  /** Filter by the object’s `guildId` field. */
  guildId?: InputMaybe<BigIntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<GuildBanFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<GuildBanFilter>>;
  /** Filter by the object’s `userId` field. */
  userId?: InputMaybe<BigIntFilter>;
};

/** An input for mutations affecting `GuildBan` */
export type GuildBanInput = {
  guildId: Scalars['BigInt'];
  userId: Scalars['BigInt'];
};

export type GuildBanMaxAggregates = {
  __typename?: 'GuildBanMaxAggregates';
  /** Maximum of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Maximum of userId across the matching connection */
  userId?: Maybe<Scalars['BigInt']>;
};

export type GuildBanMinAggregates = {
  __typename?: 'GuildBanMinAggregates';
  /** Minimum of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Minimum of userId across the matching connection */
  userId?: Maybe<Scalars['BigInt']>;
};

/** Represents an update to a `GuildBan`. Fields that are set will be updated. */
export type GuildBanPatch = {
  guildId?: InputMaybe<Scalars['BigInt']>;
  userId?: InputMaybe<Scalars['BigInt']>;
};

export type GuildBanStddevPopulationAggregates = {
  __typename?: 'GuildBanStddevPopulationAggregates';
  /** Population standard deviation of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

export type GuildBanStddevSampleAggregates = {
  __typename?: 'GuildBanStddevSampleAggregates';
  /** Sample standard deviation of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

export type GuildBanSumAggregates = {
  __typename?: 'GuildBanSumAggregates';
  /** Sum of guildId across the matching connection */
  guildId: Scalars['BigFloat'];
  /** Sum of userId across the matching connection */
  userId: Scalars['BigFloat'];
};

export type GuildBanVariancePopulationAggregates = {
  __typename?: 'GuildBanVariancePopulationAggregates';
  /** Population variance of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Population variance of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

export type GuildBanVarianceSampleAggregates = {
  __typename?: 'GuildBanVarianceSampleAggregates';
  /** Sample variance of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

/** A connection to a list of `GuildBan` values. */
export type GuildBansConnection = {
  __typename?: 'GuildBansConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<GuildBanAggregates>;
  /** A list of edges which contains the `GuildBan` and cursor to aid in pagination. */
  edges: Array<GuildBansEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<GuildBanAggregates>>;
  /** A list of `GuildBan` objects. */
  nodes: Array<GuildBan>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `GuildBan` you could get from the connection. */
  totalCount: Scalars['Int'];
};


/** A connection to a list of `GuildBan` values. */
export type GuildBansConnectionGroupedAggregatesArgs = {
  groupBy: Array<GuildBansGroupBy>;
  having?: InputMaybe<GuildBansHavingInput>;
};

/** A `GuildBan` edge in the connection. */
export type GuildBansEdge = {
  __typename?: 'GuildBansEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `GuildBan` at the end of the edge. */
  node: GuildBan;
};

/** Grouping methods for `GuildBan` for usage during aggregation. */
export enum GuildBansGroupBy {
  GuildId = 'GUILD_ID',
  UserId = 'USER_ID'
}

export type GuildBansHavingAverageInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type GuildBansHavingDistinctCountInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

/** Conditions for `GuildBan` aggregates. */
export type GuildBansHavingInput = {
  AND?: InputMaybe<Array<GuildBansHavingInput>>;
  OR?: InputMaybe<Array<GuildBansHavingInput>>;
  average?: InputMaybe<GuildBansHavingAverageInput>;
  distinctCount?: InputMaybe<GuildBansHavingDistinctCountInput>;
  max?: InputMaybe<GuildBansHavingMaxInput>;
  min?: InputMaybe<GuildBansHavingMinInput>;
  stddevPopulation?: InputMaybe<GuildBansHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<GuildBansHavingStddevSampleInput>;
  sum?: InputMaybe<GuildBansHavingSumInput>;
  variancePopulation?: InputMaybe<GuildBansHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<GuildBansHavingVarianceSampleInput>;
};

export type GuildBansHavingMaxInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type GuildBansHavingMinInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type GuildBansHavingStddevPopulationInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type GuildBansHavingStddevSampleInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type GuildBansHavingSumInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type GuildBansHavingVariancePopulationInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type GuildBansHavingVarianceSampleInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
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

export type GuildConfigAggregates = {
  __typename?: 'GuildConfigAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<GuildConfigAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<GuildConfigDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<GuildConfigMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<GuildConfigMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<GuildConfigStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<GuildConfigStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<GuildConfigSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<GuildConfigVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<GuildConfigVarianceSampleAggregates>;
};

export type GuildConfigAverageAggregates = {
  __typename?: 'GuildConfigAverageAggregates';
  /** Mean average of id across the matching connection */
  id?: Maybe<Scalars['BigFloat']>;
  /** Mean average of logMember across the matching connection */
  logMember?: Maybe<Scalars['BigFloat']>;
  /** Mean average of logMod across the matching connection */
  logMod?: Maybe<Scalars['BigFloat']>;
  /** Mean average of logMsg across the matching connection */
  logMsg?: Maybe<Scalars['BigFloat']>;
  /** Mean average of maxMention across the matching connection */
  maxMention?: Maybe<Scalars['BigFloat']>;
  /** Mean average of msgChannel across the matching connection */
  msgChannel?: Maybe<Scalars['BigFloat']>;
  /** Mean average of muteDuration across the matching connection */
  muteDuration?: Maybe<Scalars['BigFloat']>;
  /** Mean average of muteRole across the matching connection */
  muteRole?: Maybe<Scalars['BigFloat']>;
  /** Mean average of roleChannel across the matching connection */
  roleChannel?: Maybe<Scalars['BigFloat']>;
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

export type GuildConfigDistinctCountAggregates = {
  __typename?: 'GuildConfigDistinctCountAggregates';
  /** Distinct count of data across the matching connection */
  data?: Maybe<Scalars['BigInt']>;
  /** Distinct count of disabledChannels across the matching connection */
  disabledChannels?: Maybe<Scalars['BigInt']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']>;
  /** Distinct count of inviteGuard across the matching connection */
  inviteGuard?: Maybe<Scalars['BigInt']>;
  /** Distinct count of joinMsg across the matching connection */
  joinMsg?: Maybe<Scalars['BigInt']>;
  /** Distinct count of joinMsgEnabled across the matching connection */
  joinMsgEnabled?: Maybe<Scalars['BigInt']>;
  /** Distinct count of joinReact across the matching connection */
  joinReact?: Maybe<Scalars['BigInt']>;
  /** Distinct count of leaveMsg across the matching connection */
  leaveMsg?: Maybe<Scalars['BigInt']>;
  /** Distinct count of leaveMsgEnabled across the matching connection */
  leaveMsgEnabled?: Maybe<Scalars['BigInt']>;
  /** Distinct count of logMember across the matching connection */
  logMember?: Maybe<Scalars['BigInt']>;
  /** Distinct count of logMemberEnabled across the matching connection */
  logMemberEnabled?: Maybe<Scalars['BigInt']>;
  /** Distinct count of logMod across the matching connection */
  logMod?: Maybe<Scalars['BigInt']>;
  /** Distinct count of logModEnabled across the matching connection */
  logModEnabled?: Maybe<Scalars['BigInt']>;
  /** Distinct count of logMsg across the matching connection */
  logMsg?: Maybe<Scalars['BigInt']>;
  /** Distinct count of logMsgEnabled across the matching connection */
  logMsgEnabled?: Maybe<Scalars['BigInt']>;
  /** Distinct count of maxMention across the matching connection */
  maxMention?: Maybe<Scalars['BigInt']>;
  /** Distinct count of msgChannel across the matching connection */
  msgChannel?: Maybe<Scalars['BigInt']>;
  /** Distinct count of muteDmEnabled across the matching connection */
  muteDmEnabled?: Maybe<Scalars['BigInt']>;
  /** Distinct count of muteDmText across the matching connection */
  muteDmText?: Maybe<Scalars['BigInt']>;
  /** Distinct count of muteDuration across the matching connection */
  muteDuration?: Maybe<Scalars['BigInt']>;
  /** Distinct count of muteRole across the matching connection */
  muteRole?: Maybe<Scalars['BigInt']>;
  /** Distinct count of prefix across the matching connection */
  prefix?: Maybe<Scalars['BigInt']>;
  /** Distinct count of roleChannel across the matching connection */
  roleChannel?: Maybe<Scalars['BigInt']>;
  /** Distinct count of roleConfig across the matching connection */
  roleConfig?: Maybe<Scalars['BigInt']>;
  /** Distinct count of roleEnabled across the matching connection */
  roleEnabled?: Maybe<Scalars['BigInt']>;
  /** Distinct count of warnDmEnabled across the matching connection */
  warnDmEnabled?: Maybe<Scalars['BigInt']>;
  /** Distinct count of warnDmText across the matching connection */
  warnDmText?: Maybe<Scalars['BigInt']>;
};

/** A filter to be used against `GuildConfig` object types. All fields are combined with a logical ‘and.’ */
export type GuildConfigFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<GuildConfigFilter>>;
  /** Filter by the object’s `data` field. */
  data?: InputMaybe<JsonFilter>;
  /** Filter by the object’s `disabledChannels` field. */
  disabledChannels?: InputMaybe<BigIntListFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `inviteGuard` field. */
  inviteGuard?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `joinMsg` field. */
  joinMsg?: InputMaybe<StringFilter>;
  /** Filter by the object’s `joinMsgEnabled` field. */
  joinMsgEnabled?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `joinReact` field. */
  joinReact?: InputMaybe<StringFilter>;
  /** Filter by the object’s `leaveMsg` field. */
  leaveMsg?: InputMaybe<StringFilter>;
  /** Filter by the object’s `leaveMsgEnabled` field. */
  leaveMsgEnabled?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `logMember` field. */
  logMember?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `logMemberEnabled` field. */
  logMemberEnabled?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `logMod` field. */
  logMod?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `logModEnabled` field. */
  logModEnabled?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `logMsg` field. */
  logMsg?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `logMsgEnabled` field. */
  logMsgEnabled?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `maxMention` field. */
  maxMention?: InputMaybe<IntFilter>;
  /** Filter by the object’s `msgChannel` field. */
  msgChannel?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `muteDmEnabled` field. */
  muteDmEnabled?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `muteDmText` field. */
  muteDmText?: InputMaybe<StringFilter>;
  /** Filter by the object’s `muteDuration` field. */
  muteDuration?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `muteRole` field. */
  muteRole?: InputMaybe<BigIntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<GuildConfigFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<GuildConfigFilter>>;
  /** Filter by the object’s `prefix` field. */
  prefix?: InputMaybe<StringFilter>;
  /** Filter by the object’s `roleChannel` field. */
  roleChannel?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `roleConfig` field. */
  roleConfig?: InputMaybe<JsonFilter>;
  /** Filter by the object’s `roleEnabled` field. */
  roleEnabled?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `warnDmEnabled` field. */
  warnDmEnabled?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `warnDmText` field. */
  warnDmText?: InputMaybe<StringFilter>;
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

export type GuildConfigMaxAggregates = {
  __typename?: 'GuildConfigMaxAggregates';
  /** Maximum of id across the matching connection */
  id?: Maybe<Scalars['BigInt']>;
  /** Maximum of logMember across the matching connection */
  logMember?: Maybe<Scalars['BigInt']>;
  /** Maximum of logMod across the matching connection */
  logMod?: Maybe<Scalars['BigInt']>;
  /** Maximum of logMsg across the matching connection */
  logMsg?: Maybe<Scalars['BigInt']>;
  /** Maximum of maxMention across the matching connection */
  maxMention?: Maybe<Scalars['Int']>;
  /** Maximum of msgChannel across the matching connection */
  msgChannel?: Maybe<Scalars['BigInt']>;
  /** Maximum of muteDuration across the matching connection */
  muteDuration?: Maybe<Scalars['BigInt']>;
  /** Maximum of muteRole across the matching connection */
  muteRole?: Maybe<Scalars['BigInt']>;
  /** Maximum of roleChannel across the matching connection */
  roleChannel?: Maybe<Scalars['BigInt']>;
};

export type GuildConfigMinAggregates = {
  __typename?: 'GuildConfigMinAggregates';
  /** Minimum of id across the matching connection */
  id?: Maybe<Scalars['BigInt']>;
  /** Minimum of logMember across the matching connection */
  logMember?: Maybe<Scalars['BigInt']>;
  /** Minimum of logMod across the matching connection */
  logMod?: Maybe<Scalars['BigInt']>;
  /** Minimum of logMsg across the matching connection */
  logMsg?: Maybe<Scalars['BigInt']>;
  /** Minimum of maxMention across the matching connection */
  maxMention?: Maybe<Scalars['Int']>;
  /** Minimum of msgChannel across the matching connection */
  msgChannel?: Maybe<Scalars['BigInt']>;
  /** Minimum of muteDuration across the matching connection */
  muteDuration?: Maybe<Scalars['BigInt']>;
  /** Minimum of muteRole across the matching connection */
  muteRole?: Maybe<Scalars['BigInt']>;
  /** Minimum of roleChannel across the matching connection */
  roleChannel?: Maybe<Scalars['BigInt']>;
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

export type GuildConfigStddevPopulationAggregates = {
  __typename?: 'GuildConfigStddevPopulationAggregates';
  /** Population standard deviation of id across the matching connection */
  id?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of logMember across the matching connection */
  logMember?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of logMod across the matching connection */
  logMod?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of logMsg across the matching connection */
  logMsg?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of maxMention across the matching connection */
  maxMention?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of msgChannel across the matching connection */
  msgChannel?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of muteDuration across the matching connection */
  muteDuration?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of muteRole across the matching connection */
  muteRole?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of roleChannel across the matching connection */
  roleChannel?: Maybe<Scalars['BigFloat']>;
};

export type GuildConfigStddevSampleAggregates = {
  __typename?: 'GuildConfigStddevSampleAggregates';
  /** Sample standard deviation of id across the matching connection */
  id?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of logMember across the matching connection */
  logMember?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of logMod across the matching connection */
  logMod?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of logMsg across the matching connection */
  logMsg?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of maxMention across the matching connection */
  maxMention?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of msgChannel across the matching connection */
  msgChannel?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of muteDuration across the matching connection */
  muteDuration?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of muteRole across the matching connection */
  muteRole?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of roleChannel across the matching connection */
  roleChannel?: Maybe<Scalars['BigFloat']>;
};

export type GuildConfigSumAggregates = {
  __typename?: 'GuildConfigSumAggregates';
  /** Sum of id across the matching connection */
  id: Scalars['BigFloat'];
  /** Sum of logMember across the matching connection */
  logMember: Scalars['BigFloat'];
  /** Sum of logMod across the matching connection */
  logMod: Scalars['BigFloat'];
  /** Sum of logMsg across the matching connection */
  logMsg: Scalars['BigFloat'];
  /** Sum of maxMention across the matching connection */
  maxMention: Scalars['BigInt'];
  /** Sum of msgChannel across the matching connection */
  msgChannel: Scalars['BigFloat'];
  /** Sum of muteDuration across the matching connection */
  muteDuration: Scalars['BigFloat'];
  /** Sum of muteRole across the matching connection */
  muteRole: Scalars['BigFloat'];
  /** Sum of roleChannel across the matching connection */
  roleChannel: Scalars['BigFloat'];
};

export type GuildConfigVariancePopulationAggregates = {
  __typename?: 'GuildConfigVariancePopulationAggregates';
  /** Population variance of id across the matching connection */
  id?: Maybe<Scalars['BigFloat']>;
  /** Population variance of logMember across the matching connection */
  logMember?: Maybe<Scalars['BigFloat']>;
  /** Population variance of logMod across the matching connection */
  logMod?: Maybe<Scalars['BigFloat']>;
  /** Population variance of logMsg across the matching connection */
  logMsg?: Maybe<Scalars['BigFloat']>;
  /** Population variance of maxMention across the matching connection */
  maxMention?: Maybe<Scalars['BigFloat']>;
  /** Population variance of msgChannel across the matching connection */
  msgChannel?: Maybe<Scalars['BigFloat']>;
  /** Population variance of muteDuration across the matching connection */
  muteDuration?: Maybe<Scalars['BigFloat']>;
  /** Population variance of muteRole across the matching connection */
  muteRole?: Maybe<Scalars['BigFloat']>;
  /** Population variance of roleChannel across the matching connection */
  roleChannel?: Maybe<Scalars['BigFloat']>;
};

export type GuildConfigVarianceSampleAggregates = {
  __typename?: 'GuildConfigVarianceSampleAggregates';
  /** Sample variance of id across the matching connection */
  id?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of logMember across the matching connection */
  logMember?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of logMod across the matching connection */
  logMod?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of logMsg across the matching connection */
  logMsg?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of maxMention across the matching connection */
  maxMention?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of msgChannel across the matching connection */
  msgChannel?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of muteDuration across the matching connection */
  muteDuration?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of muteRole across the matching connection */
  muteRole?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of roleChannel across the matching connection */
  roleChannel?: Maybe<Scalars['BigFloat']>;
};

/** A connection to a list of `GuildConfig` values. */
export type GuildConfigsConnection = {
  __typename?: 'GuildConfigsConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<GuildConfigAggregates>;
  /** A list of edges which contains the `GuildConfig` and cursor to aid in pagination. */
  edges: Array<GuildConfigsEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<GuildConfigAggregates>>;
  /** A list of `GuildConfig` objects. */
  nodes: Array<GuildConfig>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `GuildConfig` you could get from the connection. */
  totalCount: Scalars['Int'];
};


/** A connection to a list of `GuildConfig` values. */
export type GuildConfigsConnectionGroupedAggregatesArgs = {
  groupBy: Array<GuildConfigsGroupBy>;
  having?: InputMaybe<GuildConfigsHavingInput>;
};

/** A `GuildConfig` edge in the connection. */
export type GuildConfigsEdge = {
  __typename?: 'GuildConfigsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `GuildConfig` at the end of the edge. */
  node: GuildConfig;
};

/** Grouping methods for `GuildConfig` for usage during aggregation. */
export enum GuildConfigsGroupBy {
  Data = 'DATA',
  DisabledChannels = 'DISABLED_CHANNELS',
  InviteGuard = 'INVITE_GUARD',
  JoinMsg = 'JOIN_MSG',
  JoinMsgEnabled = 'JOIN_MSG_ENABLED',
  JoinReact = 'JOIN_REACT',
  LeaveMsg = 'LEAVE_MSG',
  LeaveMsgEnabled = 'LEAVE_MSG_ENABLED',
  LogMember = 'LOG_MEMBER',
  LogMemberEnabled = 'LOG_MEMBER_ENABLED',
  LogMod = 'LOG_MOD',
  LogModEnabled = 'LOG_MOD_ENABLED',
  LogMsg = 'LOG_MSG',
  LogMsgEnabled = 'LOG_MSG_ENABLED',
  MaxMention = 'MAX_MENTION',
  MsgChannel = 'MSG_CHANNEL',
  MuteDmEnabled = 'MUTE_DM_ENABLED',
  MuteDmText = 'MUTE_DM_TEXT',
  MuteDuration = 'MUTE_DURATION',
  MuteRole = 'MUTE_ROLE',
  Prefix = 'PREFIX',
  RoleChannel = 'ROLE_CHANNEL',
  RoleConfig = 'ROLE_CONFIG',
  RoleEnabled = 'ROLE_ENABLED',
  WarnDmEnabled = 'WARN_DM_ENABLED',
  WarnDmText = 'WARN_DM_TEXT'
}

export type GuildConfigsHavingAverageInput = {
  id?: InputMaybe<HavingBigintFilter>;
  logMember?: InputMaybe<HavingBigintFilter>;
  logMod?: InputMaybe<HavingBigintFilter>;
  logMsg?: InputMaybe<HavingBigintFilter>;
  maxMention?: InputMaybe<HavingIntFilter>;
  msgChannel?: InputMaybe<HavingBigintFilter>;
  muteDuration?: InputMaybe<HavingBigintFilter>;
  muteRole?: InputMaybe<HavingBigintFilter>;
  roleChannel?: InputMaybe<HavingBigintFilter>;
};

export type GuildConfigsHavingDistinctCountInput = {
  id?: InputMaybe<HavingBigintFilter>;
  logMember?: InputMaybe<HavingBigintFilter>;
  logMod?: InputMaybe<HavingBigintFilter>;
  logMsg?: InputMaybe<HavingBigintFilter>;
  maxMention?: InputMaybe<HavingIntFilter>;
  msgChannel?: InputMaybe<HavingBigintFilter>;
  muteDuration?: InputMaybe<HavingBigintFilter>;
  muteRole?: InputMaybe<HavingBigintFilter>;
  roleChannel?: InputMaybe<HavingBigintFilter>;
};

/** Conditions for `GuildConfig` aggregates. */
export type GuildConfigsHavingInput = {
  AND?: InputMaybe<Array<GuildConfigsHavingInput>>;
  OR?: InputMaybe<Array<GuildConfigsHavingInput>>;
  average?: InputMaybe<GuildConfigsHavingAverageInput>;
  distinctCount?: InputMaybe<GuildConfigsHavingDistinctCountInput>;
  max?: InputMaybe<GuildConfigsHavingMaxInput>;
  min?: InputMaybe<GuildConfigsHavingMinInput>;
  stddevPopulation?: InputMaybe<GuildConfigsHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<GuildConfigsHavingStddevSampleInput>;
  sum?: InputMaybe<GuildConfigsHavingSumInput>;
  variancePopulation?: InputMaybe<GuildConfigsHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<GuildConfigsHavingVarianceSampleInput>;
};

export type GuildConfigsHavingMaxInput = {
  id?: InputMaybe<HavingBigintFilter>;
  logMember?: InputMaybe<HavingBigintFilter>;
  logMod?: InputMaybe<HavingBigintFilter>;
  logMsg?: InputMaybe<HavingBigintFilter>;
  maxMention?: InputMaybe<HavingIntFilter>;
  msgChannel?: InputMaybe<HavingBigintFilter>;
  muteDuration?: InputMaybe<HavingBigintFilter>;
  muteRole?: InputMaybe<HavingBigintFilter>;
  roleChannel?: InputMaybe<HavingBigintFilter>;
};

export type GuildConfigsHavingMinInput = {
  id?: InputMaybe<HavingBigintFilter>;
  logMember?: InputMaybe<HavingBigintFilter>;
  logMod?: InputMaybe<HavingBigintFilter>;
  logMsg?: InputMaybe<HavingBigintFilter>;
  maxMention?: InputMaybe<HavingIntFilter>;
  msgChannel?: InputMaybe<HavingBigintFilter>;
  muteDuration?: InputMaybe<HavingBigintFilter>;
  muteRole?: InputMaybe<HavingBigintFilter>;
  roleChannel?: InputMaybe<HavingBigintFilter>;
};

export type GuildConfigsHavingStddevPopulationInput = {
  id?: InputMaybe<HavingBigintFilter>;
  logMember?: InputMaybe<HavingBigintFilter>;
  logMod?: InputMaybe<HavingBigintFilter>;
  logMsg?: InputMaybe<HavingBigintFilter>;
  maxMention?: InputMaybe<HavingIntFilter>;
  msgChannel?: InputMaybe<HavingBigintFilter>;
  muteDuration?: InputMaybe<HavingBigintFilter>;
  muteRole?: InputMaybe<HavingBigintFilter>;
  roleChannel?: InputMaybe<HavingBigintFilter>;
};

export type GuildConfigsHavingStddevSampleInput = {
  id?: InputMaybe<HavingBigintFilter>;
  logMember?: InputMaybe<HavingBigintFilter>;
  logMod?: InputMaybe<HavingBigintFilter>;
  logMsg?: InputMaybe<HavingBigintFilter>;
  maxMention?: InputMaybe<HavingIntFilter>;
  msgChannel?: InputMaybe<HavingBigintFilter>;
  muteDuration?: InputMaybe<HavingBigintFilter>;
  muteRole?: InputMaybe<HavingBigintFilter>;
  roleChannel?: InputMaybe<HavingBigintFilter>;
};

export type GuildConfigsHavingSumInput = {
  id?: InputMaybe<HavingBigintFilter>;
  logMember?: InputMaybe<HavingBigintFilter>;
  logMod?: InputMaybe<HavingBigintFilter>;
  logMsg?: InputMaybe<HavingBigintFilter>;
  maxMention?: InputMaybe<HavingIntFilter>;
  msgChannel?: InputMaybe<HavingBigintFilter>;
  muteDuration?: InputMaybe<HavingBigintFilter>;
  muteRole?: InputMaybe<HavingBigintFilter>;
  roleChannel?: InputMaybe<HavingBigintFilter>;
};

export type GuildConfigsHavingVariancePopulationInput = {
  id?: InputMaybe<HavingBigintFilter>;
  logMember?: InputMaybe<HavingBigintFilter>;
  logMod?: InputMaybe<HavingBigintFilter>;
  logMsg?: InputMaybe<HavingBigintFilter>;
  maxMention?: InputMaybe<HavingIntFilter>;
  msgChannel?: InputMaybe<HavingBigintFilter>;
  muteDuration?: InputMaybe<HavingBigintFilter>;
  muteRole?: InputMaybe<HavingBigintFilter>;
  roleChannel?: InputMaybe<HavingBigintFilter>;
};

export type GuildConfigsHavingVarianceSampleInput = {
  id?: InputMaybe<HavingBigintFilter>;
  logMember?: InputMaybe<HavingBigintFilter>;
  logMod?: InputMaybe<HavingBigintFilter>;
  logMsg?: InputMaybe<HavingBigintFilter>;
  maxMention?: InputMaybe<HavingIntFilter>;
  msgChannel?: InputMaybe<HavingBigintFilter>;
  muteDuration?: InputMaybe<HavingBigintFilter>;
  muteRole?: InputMaybe<HavingBigintFilter>;
  roleChannel?: InputMaybe<HavingBigintFilter>;
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

export type HavingBigintFilter = {
  equalTo?: InputMaybe<Scalars['BigInt']>;
  greaterThan?: InputMaybe<Scalars['BigInt']>;
  greaterThanOrEqualTo?: InputMaybe<Scalars['BigInt']>;
  lessThan?: InputMaybe<Scalars['BigInt']>;
  lessThanOrEqualTo?: InputMaybe<Scalars['BigInt']>;
  notEqualTo?: InputMaybe<Scalars['BigInt']>;
};

export type HavingDatetimeFilter = {
  equalTo?: InputMaybe<Scalars['Datetime']>;
  greaterThan?: InputMaybe<Scalars['Datetime']>;
  greaterThanOrEqualTo?: InputMaybe<Scalars['Datetime']>;
  lessThan?: InputMaybe<Scalars['Datetime']>;
  lessThanOrEqualTo?: InputMaybe<Scalars['Datetime']>;
  notEqualTo?: InputMaybe<Scalars['Datetime']>;
};

export type HavingIntFilter = {
  equalTo?: InputMaybe<Scalars['Int']>;
  greaterThan?: InputMaybe<Scalars['Int']>;
  greaterThanOrEqualTo?: InputMaybe<Scalars['Int']>;
  lessThan?: InputMaybe<Scalars['Int']>;
  lessThanOrEqualTo?: InputMaybe<Scalars['Int']>;
  notEqualTo?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against Int fields. All fields are combined with a logical ‘and.’ */
export type IntFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Int']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Int']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Int']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Int']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Int']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Int']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Int']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Int']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Int']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Int']>>;
};

/** A filter to be used against JSON fields. All fields are combined with a logical ‘and.’ */
export type JsonFilter = {
  /** Contained by the specified JSON. */
  containedBy?: InputMaybe<Scalars['JSON']>;
  /** Contains the specified JSON. */
  contains?: InputMaybe<Scalars['JSON']>;
  /** Contains all of the specified keys. */
  containsAllKeys?: InputMaybe<Array<Scalars['String']>>;
  /** Contains any of the specified keys. */
  containsAnyKeys?: InputMaybe<Array<Scalars['String']>>;
  /** Contains the specified key. */
  containsKey?: InputMaybe<Scalars['String']>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['JSON']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['JSON']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['JSON']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['JSON']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['JSON']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['JSON']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['JSON']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['JSON']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['JSON']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['JSON']>>;
};

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

export type MemberAggregates = {
  __typename?: 'MemberAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<MemberAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<MemberDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<MemberMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<MemberMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<MemberStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<MemberStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<MemberSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<MemberVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<MemberVarianceSampleAggregates>;
};

export type MemberAverageAggregates = {
  __typename?: 'MemberAverageAggregates';
  /** Mean average of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Mean average of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
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

export type MemberDistinctCountAggregates = {
  __typename?: 'MemberDistinctCountAggregates';
  /** Distinct count of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Distinct count of joinTime across the matching connection */
  joinTime?: Maybe<Scalars['BigInt']>;
  /** Distinct count of userId across the matching connection */
  userId?: Maybe<Scalars['BigInt']>;
};

/** A filter to be used against `Member` object types. All fields are combined with a logical ‘and.’ */
export type MemberFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<MemberFilter>>;
  /** Filter by the object’s `guildId` field. */
  guildId?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `joinTime` field. */
  joinTime?: InputMaybe<DatetimeFilter>;
  /** Negates the expression. */
  not?: InputMaybe<MemberFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<MemberFilter>>;
  /** Filter by the object’s `userId` field. */
  userId?: InputMaybe<BigIntFilter>;
};

/** An input for mutations affecting `Member` */
export type MemberInput = {
  guildId: Scalars['BigInt'];
  joinTime: Scalars['Datetime'];
  userId: Scalars['BigInt'];
};

export type MemberMaxAggregates = {
  __typename?: 'MemberMaxAggregates';
  /** Maximum of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Maximum of userId across the matching connection */
  userId?: Maybe<Scalars['BigInt']>;
};

export type MemberMinAggregates = {
  __typename?: 'MemberMinAggregates';
  /** Minimum of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Minimum of userId across the matching connection */
  userId?: Maybe<Scalars['BigInt']>;
};

/** Represents an update to a `Member`. Fields that are set will be updated. */
export type MemberPatch = {
  guildId?: InputMaybe<Scalars['BigInt']>;
  joinTime?: InputMaybe<Scalars['Datetime']>;
  userId?: InputMaybe<Scalars['BigInt']>;
};

export type MemberStddevPopulationAggregates = {
  __typename?: 'MemberStddevPopulationAggregates';
  /** Population standard deviation of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

export type MemberStddevSampleAggregates = {
  __typename?: 'MemberStddevSampleAggregates';
  /** Sample standard deviation of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

export type MemberSumAggregates = {
  __typename?: 'MemberSumAggregates';
  /** Sum of guildId across the matching connection */
  guildId: Scalars['BigFloat'];
  /** Sum of userId across the matching connection */
  userId: Scalars['BigFloat'];
};

export type MemberVariancePopulationAggregates = {
  __typename?: 'MemberVariancePopulationAggregates';
  /** Population variance of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Population variance of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

export type MemberVarianceSampleAggregates = {
  __typename?: 'MemberVarianceSampleAggregates';
  /** Sample variance of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

/** A connection to a list of `Member` values. */
export type MembersConnection = {
  __typename?: 'MembersConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<MemberAggregates>;
  /** A list of edges which contains the `Member` and cursor to aid in pagination. */
  edges: Array<MembersEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<MemberAggregates>>;
  /** A list of `Member` objects. */
  nodes: Array<Member>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Member` you could get from the connection. */
  totalCount: Scalars['Int'];
};


/** A connection to a list of `Member` values. */
export type MembersConnectionGroupedAggregatesArgs = {
  groupBy: Array<MembersGroupBy>;
  having?: InputMaybe<MembersHavingInput>;
};

/** A `Member` edge in the connection. */
export type MembersEdge = {
  __typename?: 'MembersEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Member` at the end of the edge. */
  node: Member;
};

/** Grouping methods for `Member` for usage during aggregation. */
export enum MembersGroupBy {
  GuildId = 'GUILD_ID',
  JoinTime = 'JOIN_TIME',
  JoinTimeTruncatedToDay = 'JOIN_TIME_TRUNCATED_TO_DAY',
  JoinTimeTruncatedToHour = 'JOIN_TIME_TRUNCATED_TO_HOUR',
  UserId = 'USER_ID'
}

export type MembersHavingAverageInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  joinTime?: InputMaybe<HavingDatetimeFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type MembersHavingDistinctCountInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  joinTime?: InputMaybe<HavingDatetimeFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

/** Conditions for `Member` aggregates. */
export type MembersHavingInput = {
  AND?: InputMaybe<Array<MembersHavingInput>>;
  OR?: InputMaybe<Array<MembersHavingInput>>;
  average?: InputMaybe<MembersHavingAverageInput>;
  distinctCount?: InputMaybe<MembersHavingDistinctCountInput>;
  max?: InputMaybe<MembersHavingMaxInput>;
  min?: InputMaybe<MembersHavingMinInput>;
  stddevPopulation?: InputMaybe<MembersHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<MembersHavingStddevSampleInput>;
  sum?: InputMaybe<MembersHavingSumInput>;
  variancePopulation?: InputMaybe<MembersHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<MembersHavingVarianceSampleInput>;
};

export type MembersHavingMaxInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  joinTime?: InputMaybe<HavingDatetimeFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type MembersHavingMinInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  joinTime?: InputMaybe<HavingDatetimeFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type MembersHavingStddevPopulationInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  joinTime?: InputMaybe<HavingDatetimeFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type MembersHavingStddevSampleInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  joinTime?: InputMaybe<HavingDatetimeFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type MembersHavingSumInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  joinTime?: InputMaybe<HavingDatetimeFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type MembersHavingVariancePopulationInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  joinTime?: InputMaybe<HavingDatetimeFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type MembersHavingVarianceSampleInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  joinTime?: InputMaybe<HavingDatetimeFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
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

export type MessageAggregates = {
  __typename?: 'MessageAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<MessageAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<MessageDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<MessageMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<MessageMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<MessageStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<MessageStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<MessageSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<MessageVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<MessageVarianceSampleAggregates>;
};

export type MessageAverageAggregates = {
  __typename?: 'MessageAverageAggregates';
  /** Mean average of authorId across the matching connection */
  authorId?: Maybe<Scalars['BigFloat']>;
  /** Mean average of channelId across the matching connection */
  channelId?: Maybe<Scalars['BigFloat']>;
  /** Mean average of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Mean average of messageId across the matching connection */
  messageId?: Maybe<Scalars['BigFloat']>;
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

export type MessageDistinctCountAggregates = {
  __typename?: 'MessageDistinctCountAggregates';
  /** Distinct count of authorId across the matching connection */
  authorId?: Maybe<Scalars['BigInt']>;
  /** Distinct count of channelId across the matching connection */
  channelId?: Maybe<Scalars['BigInt']>;
  /** Distinct count of content across the matching connection */
  content?: Maybe<Scalars['BigInt']>;
  /** Distinct count of created across the matching connection */
  created?: Maybe<Scalars['BigInt']>;
  /** Distinct count of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Distinct count of messageId across the matching connection */
  messageId?: Maybe<Scalars['BigInt']>;
  /** Distinct count of msg across the matching connection */
  msg?: Maybe<Scalars['BigInt']>;
};

/** A filter to be used against `Message` object types. All fields are combined with a logical ‘and.’ */
export type MessageFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<MessageFilter>>;
  /** Filter by the object’s `authorId` field. */
  authorId?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `channelId` field. */
  channelId?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `content` field. */
  content?: InputMaybe<StringFilter>;
  /** Filter by the object’s `created` field. */
  created?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `guildId` field. */
  guildId?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `messageId` field. */
  messageId?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `msg` field. */
  msg?: InputMaybe<JsonFilter>;
  /** Negates the expression. */
  not?: InputMaybe<MessageFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<MessageFilter>>;
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

export type MessageMaxAggregates = {
  __typename?: 'MessageMaxAggregates';
  /** Maximum of authorId across the matching connection */
  authorId?: Maybe<Scalars['BigInt']>;
  /** Maximum of channelId across the matching connection */
  channelId?: Maybe<Scalars['BigInt']>;
  /** Maximum of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Maximum of messageId across the matching connection */
  messageId?: Maybe<Scalars['BigInt']>;
};

export type MessageMinAggregates = {
  __typename?: 'MessageMinAggregates';
  /** Minimum of authorId across the matching connection */
  authorId?: Maybe<Scalars['BigInt']>;
  /** Minimum of channelId across the matching connection */
  channelId?: Maybe<Scalars['BigInt']>;
  /** Minimum of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Minimum of messageId across the matching connection */
  messageId?: Maybe<Scalars['BigInt']>;
};

export type MessageStddevPopulationAggregates = {
  __typename?: 'MessageStddevPopulationAggregates';
  /** Population standard deviation of authorId across the matching connection */
  authorId?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of channelId across the matching connection */
  channelId?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of messageId across the matching connection */
  messageId?: Maybe<Scalars['BigFloat']>;
};

export type MessageStddevSampleAggregates = {
  __typename?: 'MessageStddevSampleAggregates';
  /** Sample standard deviation of authorId across the matching connection */
  authorId?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of channelId across the matching connection */
  channelId?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of messageId across the matching connection */
  messageId?: Maybe<Scalars['BigFloat']>;
};

export type MessageSumAggregates = {
  __typename?: 'MessageSumAggregates';
  /** Sum of authorId across the matching connection */
  authorId: Scalars['BigFloat'];
  /** Sum of channelId across the matching connection */
  channelId: Scalars['BigFloat'];
  /** Sum of guildId across the matching connection */
  guildId: Scalars['BigFloat'];
  /** Sum of messageId across the matching connection */
  messageId: Scalars['BigFloat'];
};

export type MessageVariancePopulationAggregates = {
  __typename?: 'MessageVariancePopulationAggregates';
  /** Population variance of authorId across the matching connection */
  authorId?: Maybe<Scalars['BigFloat']>;
  /** Population variance of channelId across the matching connection */
  channelId?: Maybe<Scalars['BigFloat']>;
  /** Population variance of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Population variance of messageId across the matching connection */
  messageId?: Maybe<Scalars['BigFloat']>;
};

export type MessageVarianceSampleAggregates = {
  __typename?: 'MessageVarianceSampleAggregates';
  /** Sample variance of authorId across the matching connection */
  authorId?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of channelId across the matching connection */
  channelId?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of messageId across the matching connection */
  messageId?: Maybe<Scalars['BigFloat']>;
};

/** A connection to a list of `Message` values. */
export type MessagesConnection = {
  __typename?: 'MessagesConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<MessageAggregates>;
  /** A list of edges which contains the `Message` and cursor to aid in pagination. */
  edges: Array<MessagesEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<MessageAggregates>>;
  /** A list of `Message` objects. */
  nodes: Array<Message>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Message` you could get from the connection. */
  totalCount: Scalars['Int'];
};


/** A connection to a list of `Message` values. */
export type MessagesConnectionGroupedAggregatesArgs = {
  groupBy: Array<MessagesGroupBy>;
  having?: InputMaybe<MessagesHavingInput>;
};

/** A `Message` edge in the connection. */
export type MessagesEdge = {
  __typename?: 'MessagesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Message` at the end of the edge. */
  node: Message;
};

/** Grouping methods for `Message` for usage during aggregation. */
export enum MessagesGroupBy {
  AuthorId = 'AUTHOR_ID',
  ChannelId = 'CHANNEL_ID',
  Content = 'CONTENT',
  Created = 'CREATED',
  CreatedTruncatedToDay = 'CREATED_TRUNCATED_TO_DAY',
  CreatedTruncatedToHour = 'CREATED_TRUNCATED_TO_HOUR',
  GuildId = 'GUILD_ID',
  MessageId = 'MESSAGE_ID',
  Msg = 'MSG'
}

export type MessagesHavingAverageInput = {
  authorId?: InputMaybe<HavingBigintFilter>;
  channelId?: InputMaybe<HavingBigintFilter>;
  created?: InputMaybe<HavingDatetimeFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  messageId?: InputMaybe<HavingBigintFilter>;
};

export type MessagesHavingDistinctCountInput = {
  authorId?: InputMaybe<HavingBigintFilter>;
  channelId?: InputMaybe<HavingBigintFilter>;
  created?: InputMaybe<HavingDatetimeFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  messageId?: InputMaybe<HavingBigintFilter>;
};

/** Conditions for `Message` aggregates. */
export type MessagesHavingInput = {
  AND?: InputMaybe<Array<MessagesHavingInput>>;
  OR?: InputMaybe<Array<MessagesHavingInput>>;
  average?: InputMaybe<MessagesHavingAverageInput>;
  distinctCount?: InputMaybe<MessagesHavingDistinctCountInput>;
  max?: InputMaybe<MessagesHavingMaxInput>;
  min?: InputMaybe<MessagesHavingMinInput>;
  stddevPopulation?: InputMaybe<MessagesHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<MessagesHavingStddevSampleInput>;
  sum?: InputMaybe<MessagesHavingSumInput>;
  variancePopulation?: InputMaybe<MessagesHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<MessagesHavingVarianceSampleInput>;
};

export type MessagesHavingMaxInput = {
  authorId?: InputMaybe<HavingBigintFilter>;
  channelId?: InputMaybe<HavingBigintFilter>;
  created?: InputMaybe<HavingDatetimeFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  messageId?: InputMaybe<HavingBigintFilter>;
};

export type MessagesHavingMinInput = {
  authorId?: InputMaybe<HavingBigintFilter>;
  channelId?: InputMaybe<HavingBigintFilter>;
  created?: InputMaybe<HavingDatetimeFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  messageId?: InputMaybe<HavingBigintFilter>;
};

export type MessagesHavingStddevPopulationInput = {
  authorId?: InputMaybe<HavingBigintFilter>;
  channelId?: InputMaybe<HavingBigintFilter>;
  created?: InputMaybe<HavingDatetimeFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  messageId?: InputMaybe<HavingBigintFilter>;
};

export type MessagesHavingStddevSampleInput = {
  authorId?: InputMaybe<HavingBigintFilter>;
  channelId?: InputMaybe<HavingBigintFilter>;
  created?: InputMaybe<HavingDatetimeFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  messageId?: InputMaybe<HavingBigintFilter>;
};

export type MessagesHavingSumInput = {
  authorId?: InputMaybe<HavingBigintFilter>;
  channelId?: InputMaybe<HavingBigintFilter>;
  created?: InputMaybe<HavingDatetimeFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  messageId?: InputMaybe<HavingBigintFilter>;
};

export type MessagesHavingVariancePopulationInput = {
  authorId?: InputMaybe<HavingBigintFilter>;
  channelId?: InputMaybe<HavingBigintFilter>;
  created?: InputMaybe<HavingDatetimeFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  messageId?: InputMaybe<HavingBigintFilter>;
};

export type MessagesHavingVarianceSampleInput = {
  authorId?: InputMaybe<HavingBigintFilter>;
  channelId?: InputMaybe<HavingBigintFilter>;
  created?: InputMaybe<HavingDatetimeFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  messageId?: InputMaybe<HavingBigintFilter>;
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
  filter?: InputMaybe<MuteFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MutesOrderBy>>;
};

export type ModLogAggregates = {
  __typename?: 'ModLogAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<ModLogAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<ModLogDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<ModLogMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<ModLogMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<ModLogStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<ModLogStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<ModLogSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<ModLogVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<ModLogVarianceSampleAggregates>;
};

export type ModLogAverageAggregates = {
  __typename?: 'ModLogAverageAggregates';
  /** Mean average of caseId across the matching connection */
  caseId?: Maybe<Scalars['BigFloat']>;
  /** Mean average of executorId across the matching connection */
  executorId?: Maybe<Scalars['BigFloat']>;
  /** Mean average of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Mean average of msgId across the matching connection */
  msgId?: Maybe<Scalars['BigFloat']>;
  /** Mean average of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
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

export type ModLogDistinctCountAggregates = {
  __typename?: 'ModLogDistinctCountAggregates';
  /** Distinct count of action across the matching connection */
  action?: Maybe<Scalars['BigInt']>;
  /** Distinct count of actionTime across the matching connection */
  actionTime?: Maybe<Scalars['BigInt']>;
  /** Distinct count of attachments across the matching connection */
  attachments?: Maybe<Scalars['BigInt']>;
  /** Distinct count of caseId across the matching connection */
  caseId?: Maybe<Scalars['BigInt']>;
  /** Distinct count of executorId across the matching connection */
  executorId?: Maybe<Scalars['BigInt']>;
  /** Distinct count of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Distinct count of msgId across the matching connection */
  msgId?: Maybe<Scalars['BigInt']>;
  /** Distinct count of pending across the matching connection */
  pending?: Maybe<Scalars['BigInt']>;
  /** Distinct count of reason across the matching connection */
  reason?: Maybe<Scalars['BigInt']>;
  /** Distinct count of userId across the matching connection */
  userId?: Maybe<Scalars['BigInt']>;
  /** Distinct count of userTag across the matching connection */
  userTag?: Maybe<Scalars['BigInt']>;
};

/** A filter to be used against `ModLog` object types. All fields are combined with a logical ‘and.’ */
export type ModLogFilter = {
  /** Filter by the object’s `action` field. */
  action?: InputMaybe<StringFilter>;
  /** Filter by the object’s `actionTime` field. */
  actionTime?: InputMaybe<DatetimeFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ModLogFilter>>;
  /** Filter by the object’s `attachments` field. */
  attachments?: InputMaybe<StringListFilter>;
  /** Filter by the object’s `caseId` field. */
  caseId?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `executorId` field. */
  executorId?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `guildId` field. */
  guildId?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `msgId` field. */
  msgId?: InputMaybe<BigIntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ModLogFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ModLogFilter>>;
  /** Filter by the object’s `pending` field. */
  pending?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `reason` field. */
  reason?: InputMaybe<StringFilter>;
  /** Filter by the object’s `userId` field. */
  userId?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `userTag` field. */
  userTag?: InputMaybe<StringFilter>;
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

export type ModLogMaxAggregates = {
  __typename?: 'ModLogMaxAggregates';
  /** Maximum of caseId across the matching connection */
  caseId?: Maybe<Scalars['BigInt']>;
  /** Maximum of executorId across the matching connection */
  executorId?: Maybe<Scalars['BigInt']>;
  /** Maximum of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Maximum of msgId across the matching connection */
  msgId?: Maybe<Scalars['BigInt']>;
  /** Maximum of userId across the matching connection */
  userId?: Maybe<Scalars['BigInt']>;
};

export type ModLogMinAggregates = {
  __typename?: 'ModLogMinAggregates';
  /** Minimum of caseId across the matching connection */
  caseId?: Maybe<Scalars['BigInt']>;
  /** Minimum of executorId across the matching connection */
  executorId?: Maybe<Scalars['BigInt']>;
  /** Minimum of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Minimum of msgId across the matching connection */
  msgId?: Maybe<Scalars['BigInt']>;
  /** Minimum of userId across the matching connection */
  userId?: Maybe<Scalars['BigInt']>;
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

export type ModLogStddevPopulationAggregates = {
  __typename?: 'ModLogStddevPopulationAggregates';
  /** Population standard deviation of caseId across the matching connection */
  caseId?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of executorId across the matching connection */
  executorId?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of msgId across the matching connection */
  msgId?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

export type ModLogStddevSampleAggregates = {
  __typename?: 'ModLogStddevSampleAggregates';
  /** Sample standard deviation of caseId across the matching connection */
  caseId?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of executorId across the matching connection */
  executorId?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of msgId across the matching connection */
  msgId?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

export type ModLogSumAggregates = {
  __typename?: 'ModLogSumAggregates';
  /** Sum of caseId across the matching connection */
  caseId: Scalars['BigFloat'];
  /** Sum of executorId across the matching connection */
  executorId: Scalars['BigFloat'];
  /** Sum of guildId across the matching connection */
  guildId: Scalars['BigFloat'];
  /** Sum of msgId across the matching connection */
  msgId: Scalars['BigFloat'];
  /** Sum of userId across the matching connection */
  userId: Scalars['BigFloat'];
};

export type ModLogVariancePopulationAggregates = {
  __typename?: 'ModLogVariancePopulationAggregates';
  /** Population variance of caseId across the matching connection */
  caseId?: Maybe<Scalars['BigFloat']>;
  /** Population variance of executorId across the matching connection */
  executorId?: Maybe<Scalars['BigFloat']>;
  /** Population variance of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Population variance of msgId across the matching connection */
  msgId?: Maybe<Scalars['BigFloat']>;
  /** Population variance of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

export type ModLogVarianceSampleAggregates = {
  __typename?: 'ModLogVarianceSampleAggregates';
  /** Sample variance of caseId across the matching connection */
  caseId?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of executorId across the matching connection */
  executorId?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of msgId across the matching connection */
  msgId?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

/** A connection to a list of `ModLog` values. */
export type ModLogsConnection = {
  __typename?: 'ModLogsConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<ModLogAggregates>;
  /** A list of edges which contains the `ModLog` and cursor to aid in pagination. */
  edges: Array<ModLogsEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<ModLogAggregates>>;
  /** A list of `ModLog` objects. */
  nodes: Array<ModLog>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ModLog` you could get from the connection. */
  totalCount: Scalars['Int'];
};


/** A connection to a list of `ModLog` values. */
export type ModLogsConnectionGroupedAggregatesArgs = {
  groupBy: Array<ModLogsGroupBy>;
  having?: InputMaybe<ModLogsHavingInput>;
};

/** A `ModLog` edge in the connection. */
export type ModLogsEdge = {
  __typename?: 'ModLogsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ModLog` at the end of the edge. */
  node: ModLog;
};

/** Grouping methods for `ModLog` for usage during aggregation. */
export enum ModLogsGroupBy {
  Action = 'ACTION',
  ActionTime = 'ACTION_TIME',
  ActionTimeTruncatedToDay = 'ACTION_TIME_TRUNCATED_TO_DAY',
  ActionTimeTruncatedToHour = 'ACTION_TIME_TRUNCATED_TO_HOUR',
  Attachments = 'ATTACHMENTS',
  CaseId = 'CASE_ID',
  ExecutorId = 'EXECUTOR_ID',
  GuildId = 'GUILD_ID',
  MsgId = 'MSG_ID',
  Pending = 'PENDING',
  Reason = 'REASON',
  UserId = 'USER_ID',
  UserTag = 'USER_TAG'
}

export type ModLogsHavingAverageInput = {
  actionTime?: InputMaybe<HavingDatetimeFilter>;
  caseId?: InputMaybe<HavingBigintFilter>;
  executorId?: InputMaybe<HavingBigintFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  msgId?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type ModLogsHavingDistinctCountInput = {
  actionTime?: InputMaybe<HavingDatetimeFilter>;
  caseId?: InputMaybe<HavingBigintFilter>;
  executorId?: InputMaybe<HavingBigintFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  msgId?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

/** Conditions for `ModLog` aggregates. */
export type ModLogsHavingInput = {
  AND?: InputMaybe<Array<ModLogsHavingInput>>;
  OR?: InputMaybe<Array<ModLogsHavingInput>>;
  average?: InputMaybe<ModLogsHavingAverageInput>;
  distinctCount?: InputMaybe<ModLogsHavingDistinctCountInput>;
  max?: InputMaybe<ModLogsHavingMaxInput>;
  min?: InputMaybe<ModLogsHavingMinInput>;
  stddevPopulation?: InputMaybe<ModLogsHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<ModLogsHavingStddevSampleInput>;
  sum?: InputMaybe<ModLogsHavingSumInput>;
  variancePopulation?: InputMaybe<ModLogsHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<ModLogsHavingVarianceSampleInput>;
};

export type ModLogsHavingMaxInput = {
  actionTime?: InputMaybe<HavingDatetimeFilter>;
  caseId?: InputMaybe<HavingBigintFilter>;
  executorId?: InputMaybe<HavingBigintFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  msgId?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type ModLogsHavingMinInput = {
  actionTime?: InputMaybe<HavingDatetimeFilter>;
  caseId?: InputMaybe<HavingBigintFilter>;
  executorId?: InputMaybe<HavingBigintFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  msgId?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type ModLogsHavingStddevPopulationInput = {
  actionTime?: InputMaybe<HavingDatetimeFilter>;
  caseId?: InputMaybe<HavingBigintFilter>;
  executorId?: InputMaybe<HavingBigintFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  msgId?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type ModLogsHavingStddevSampleInput = {
  actionTime?: InputMaybe<HavingDatetimeFilter>;
  caseId?: InputMaybe<HavingBigintFilter>;
  executorId?: InputMaybe<HavingBigintFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  msgId?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type ModLogsHavingSumInput = {
  actionTime?: InputMaybe<HavingDatetimeFilter>;
  caseId?: InputMaybe<HavingBigintFilter>;
  executorId?: InputMaybe<HavingBigintFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  msgId?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type ModLogsHavingVariancePopulationInput = {
  actionTime?: InputMaybe<HavingDatetimeFilter>;
  caseId?: InputMaybe<HavingBigintFilter>;
  executorId?: InputMaybe<HavingBigintFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  msgId?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type ModLogsHavingVarianceSampleInput = {
  actionTime?: InputMaybe<HavingDatetimeFilter>;
  caseId?: InputMaybe<HavingBigintFilter>;
  executorId?: InputMaybe<HavingBigintFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  msgId?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
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
  MutesByGuildIdAndCaseIdAverageCaseIdAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_AVERAGE_CASE_ID_ASC',
  MutesByGuildIdAndCaseIdAverageCaseIdDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_AVERAGE_CASE_ID_DESC',
  MutesByGuildIdAndCaseIdAverageEndTimeAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_AVERAGE_END_TIME_ASC',
  MutesByGuildIdAndCaseIdAverageEndTimeDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_AVERAGE_END_TIME_DESC',
  MutesByGuildIdAndCaseIdAverageGuildIdAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_AVERAGE_GUILD_ID_ASC',
  MutesByGuildIdAndCaseIdAverageGuildIdDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_AVERAGE_GUILD_ID_DESC',
  MutesByGuildIdAndCaseIdAveragePendingAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_AVERAGE_PENDING_ASC',
  MutesByGuildIdAndCaseIdAveragePendingDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_AVERAGE_PENDING_DESC',
  MutesByGuildIdAndCaseIdAverageStartTimeAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_AVERAGE_START_TIME_ASC',
  MutesByGuildIdAndCaseIdAverageStartTimeDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_AVERAGE_START_TIME_DESC',
  MutesByGuildIdAndCaseIdAverageUserIdAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_AVERAGE_USER_ID_ASC',
  MutesByGuildIdAndCaseIdAverageUserIdDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_AVERAGE_USER_ID_DESC',
  MutesByGuildIdAndCaseIdCountAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_COUNT_ASC',
  MutesByGuildIdAndCaseIdCountDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_COUNT_DESC',
  MutesByGuildIdAndCaseIdDistinctCountCaseIdAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_DISTINCT_COUNT_CASE_ID_ASC',
  MutesByGuildIdAndCaseIdDistinctCountCaseIdDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_DISTINCT_COUNT_CASE_ID_DESC',
  MutesByGuildIdAndCaseIdDistinctCountEndTimeAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_DISTINCT_COUNT_END_TIME_ASC',
  MutesByGuildIdAndCaseIdDistinctCountEndTimeDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_DISTINCT_COUNT_END_TIME_DESC',
  MutesByGuildIdAndCaseIdDistinctCountGuildIdAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_DISTINCT_COUNT_GUILD_ID_ASC',
  MutesByGuildIdAndCaseIdDistinctCountGuildIdDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_DISTINCT_COUNT_GUILD_ID_DESC',
  MutesByGuildIdAndCaseIdDistinctCountPendingAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_DISTINCT_COUNT_PENDING_ASC',
  MutesByGuildIdAndCaseIdDistinctCountPendingDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_DISTINCT_COUNT_PENDING_DESC',
  MutesByGuildIdAndCaseIdDistinctCountStartTimeAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_DISTINCT_COUNT_START_TIME_ASC',
  MutesByGuildIdAndCaseIdDistinctCountStartTimeDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_DISTINCT_COUNT_START_TIME_DESC',
  MutesByGuildIdAndCaseIdDistinctCountUserIdAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_DISTINCT_COUNT_USER_ID_ASC',
  MutesByGuildIdAndCaseIdDistinctCountUserIdDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_DISTINCT_COUNT_USER_ID_DESC',
  MutesByGuildIdAndCaseIdMaxCaseIdAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_MAX_CASE_ID_ASC',
  MutesByGuildIdAndCaseIdMaxCaseIdDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_MAX_CASE_ID_DESC',
  MutesByGuildIdAndCaseIdMaxEndTimeAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_MAX_END_TIME_ASC',
  MutesByGuildIdAndCaseIdMaxEndTimeDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_MAX_END_TIME_DESC',
  MutesByGuildIdAndCaseIdMaxGuildIdAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_MAX_GUILD_ID_ASC',
  MutesByGuildIdAndCaseIdMaxGuildIdDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_MAX_GUILD_ID_DESC',
  MutesByGuildIdAndCaseIdMaxPendingAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_MAX_PENDING_ASC',
  MutesByGuildIdAndCaseIdMaxPendingDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_MAX_PENDING_DESC',
  MutesByGuildIdAndCaseIdMaxStartTimeAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_MAX_START_TIME_ASC',
  MutesByGuildIdAndCaseIdMaxStartTimeDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_MAX_START_TIME_DESC',
  MutesByGuildIdAndCaseIdMaxUserIdAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_MAX_USER_ID_ASC',
  MutesByGuildIdAndCaseIdMaxUserIdDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_MAX_USER_ID_DESC',
  MutesByGuildIdAndCaseIdMinCaseIdAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_MIN_CASE_ID_ASC',
  MutesByGuildIdAndCaseIdMinCaseIdDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_MIN_CASE_ID_DESC',
  MutesByGuildIdAndCaseIdMinEndTimeAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_MIN_END_TIME_ASC',
  MutesByGuildIdAndCaseIdMinEndTimeDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_MIN_END_TIME_DESC',
  MutesByGuildIdAndCaseIdMinGuildIdAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_MIN_GUILD_ID_ASC',
  MutesByGuildIdAndCaseIdMinGuildIdDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_MIN_GUILD_ID_DESC',
  MutesByGuildIdAndCaseIdMinPendingAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_MIN_PENDING_ASC',
  MutesByGuildIdAndCaseIdMinPendingDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_MIN_PENDING_DESC',
  MutesByGuildIdAndCaseIdMinStartTimeAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_MIN_START_TIME_ASC',
  MutesByGuildIdAndCaseIdMinStartTimeDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_MIN_START_TIME_DESC',
  MutesByGuildIdAndCaseIdMinUserIdAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_MIN_USER_ID_ASC',
  MutesByGuildIdAndCaseIdMinUserIdDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_MIN_USER_ID_DESC',
  MutesByGuildIdAndCaseIdStddevPopulationCaseIdAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_STDDEV_POPULATION_CASE_ID_ASC',
  MutesByGuildIdAndCaseIdStddevPopulationCaseIdDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_STDDEV_POPULATION_CASE_ID_DESC',
  MutesByGuildIdAndCaseIdStddevPopulationEndTimeAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_STDDEV_POPULATION_END_TIME_ASC',
  MutesByGuildIdAndCaseIdStddevPopulationEndTimeDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_STDDEV_POPULATION_END_TIME_DESC',
  MutesByGuildIdAndCaseIdStddevPopulationGuildIdAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_STDDEV_POPULATION_GUILD_ID_ASC',
  MutesByGuildIdAndCaseIdStddevPopulationGuildIdDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_STDDEV_POPULATION_GUILD_ID_DESC',
  MutesByGuildIdAndCaseIdStddevPopulationPendingAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_STDDEV_POPULATION_PENDING_ASC',
  MutesByGuildIdAndCaseIdStddevPopulationPendingDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_STDDEV_POPULATION_PENDING_DESC',
  MutesByGuildIdAndCaseIdStddevPopulationStartTimeAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_STDDEV_POPULATION_START_TIME_ASC',
  MutesByGuildIdAndCaseIdStddevPopulationStartTimeDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_STDDEV_POPULATION_START_TIME_DESC',
  MutesByGuildIdAndCaseIdStddevPopulationUserIdAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_STDDEV_POPULATION_USER_ID_ASC',
  MutesByGuildIdAndCaseIdStddevPopulationUserIdDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_STDDEV_POPULATION_USER_ID_DESC',
  MutesByGuildIdAndCaseIdStddevSampleCaseIdAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_STDDEV_SAMPLE_CASE_ID_ASC',
  MutesByGuildIdAndCaseIdStddevSampleCaseIdDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_STDDEV_SAMPLE_CASE_ID_DESC',
  MutesByGuildIdAndCaseIdStddevSampleEndTimeAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_STDDEV_SAMPLE_END_TIME_ASC',
  MutesByGuildIdAndCaseIdStddevSampleEndTimeDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_STDDEV_SAMPLE_END_TIME_DESC',
  MutesByGuildIdAndCaseIdStddevSampleGuildIdAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_STDDEV_SAMPLE_GUILD_ID_ASC',
  MutesByGuildIdAndCaseIdStddevSampleGuildIdDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_STDDEV_SAMPLE_GUILD_ID_DESC',
  MutesByGuildIdAndCaseIdStddevSamplePendingAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_STDDEV_SAMPLE_PENDING_ASC',
  MutesByGuildIdAndCaseIdStddevSamplePendingDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_STDDEV_SAMPLE_PENDING_DESC',
  MutesByGuildIdAndCaseIdStddevSampleStartTimeAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_STDDEV_SAMPLE_START_TIME_ASC',
  MutesByGuildIdAndCaseIdStddevSampleStartTimeDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_STDDEV_SAMPLE_START_TIME_DESC',
  MutesByGuildIdAndCaseIdStddevSampleUserIdAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_STDDEV_SAMPLE_USER_ID_ASC',
  MutesByGuildIdAndCaseIdStddevSampleUserIdDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_STDDEV_SAMPLE_USER_ID_DESC',
  MutesByGuildIdAndCaseIdSumCaseIdAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_SUM_CASE_ID_ASC',
  MutesByGuildIdAndCaseIdSumCaseIdDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_SUM_CASE_ID_DESC',
  MutesByGuildIdAndCaseIdSumEndTimeAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_SUM_END_TIME_ASC',
  MutesByGuildIdAndCaseIdSumEndTimeDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_SUM_END_TIME_DESC',
  MutesByGuildIdAndCaseIdSumGuildIdAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_SUM_GUILD_ID_ASC',
  MutesByGuildIdAndCaseIdSumGuildIdDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_SUM_GUILD_ID_DESC',
  MutesByGuildIdAndCaseIdSumPendingAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_SUM_PENDING_ASC',
  MutesByGuildIdAndCaseIdSumPendingDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_SUM_PENDING_DESC',
  MutesByGuildIdAndCaseIdSumStartTimeAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_SUM_START_TIME_ASC',
  MutesByGuildIdAndCaseIdSumStartTimeDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_SUM_START_TIME_DESC',
  MutesByGuildIdAndCaseIdSumUserIdAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_SUM_USER_ID_ASC',
  MutesByGuildIdAndCaseIdSumUserIdDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_SUM_USER_ID_DESC',
  MutesByGuildIdAndCaseIdVariancePopulationCaseIdAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_VARIANCE_POPULATION_CASE_ID_ASC',
  MutesByGuildIdAndCaseIdVariancePopulationCaseIdDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_VARIANCE_POPULATION_CASE_ID_DESC',
  MutesByGuildIdAndCaseIdVariancePopulationEndTimeAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_VARIANCE_POPULATION_END_TIME_ASC',
  MutesByGuildIdAndCaseIdVariancePopulationEndTimeDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_VARIANCE_POPULATION_END_TIME_DESC',
  MutesByGuildIdAndCaseIdVariancePopulationGuildIdAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_VARIANCE_POPULATION_GUILD_ID_ASC',
  MutesByGuildIdAndCaseIdVariancePopulationGuildIdDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_VARIANCE_POPULATION_GUILD_ID_DESC',
  MutesByGuildIdAndCaseIdVariancePopulationPendingAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_VARIANCE_POPULATION_PENDING_ASC',
  MutesByGuildIdAndCaseIdVariancePopulationPendingDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_VARIANCE_POPULATION_PENDING_DESC',
  MutesByGuildIdAndCaseIdVariancePopulationStartTimeAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_VARIANCE_POPULATION_START_TIME_ASC',
  MutesByGuildIdAndCaseIdVariancePopulationStartTimeDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_VARIANCE_POPULATION_START_TIME_DESC',
  MutesByGuildIdAndCaseIdVariancePopulationUserIdAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_VARIANCE_POPULATION_USER_ID_ASC',
  MutesByGuildIdAndCaseIdVariancePopulationUserIdDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_VARIANCE_POPULATION_USER_ID_DESC',
  MutesByGuildIdAndCaseIdVarianceSampleCaseIdAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_VARIANCE_SAMPLE_CASE_ID_ASC',
  MutesByGuildIdAndCaseIdVarianceSampleCaseIdDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_VARIANCE_SAMPLE_CASE_ID_DESC',
  MutesByGuildIdAndCaseIdVarianceSampleEndTimeAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_VARIANCE_SAMPLE_END_TIME_ASC',
  MutesByGuildIdAndCaseIdVarianceSampleEndTimeDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_VARIANCE_SAMPLE_END_TIME_DESC',
  MutesByGuildIdAndCaseIdVarianceSampleGuildIdAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_VARIANCE_SAMPLE_GUILD_ID_ASC',
  MutesByGuildIdAndCaseIdVarianceSampleGuildIdDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_VARIANCE_SAMPLE_GUILD_ID_DESC',
  MutesByGuildIdAndCaseIdVarianceSamplePendingAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_VARIANCE_SAMPLE_PENDING_ASC',
  MutesByGuildIdAndCaseIdVarianceSamplePendingDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_VARIANCE_SAMPLE_PENDING_DESC',
  MutesByGuildIdAndCaseIdVarianceSampleStartTimeAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_VARIANCE_SAMPLE_START_TIME_ASC',
  MutesByGuildIdAndCaseIdVarianceSampleStartTimeDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_VARIANCE_SAMPLE_START_TIME_DESC',
  MutesByGuildIdAndCaseIdVarianceSampleUserIdAsc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_VARIANCE_SAMPLE_USER_ID_ASC',
  MutesByGuildIdAndCaseIdVarianceSampleUserIdDesc = 'MUTES_BY_GUILD_ID_AND_CASE_ID_VARIANCE_SAMPLE_USER_ID_DESC',
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
  deleteRoleMenuByGuildIdAndMenuName?: Maybe<DeleteRoleMenuPayload>;
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
  updateRoleMenuByGuildIdAndMenuName?: Maybe<UpdateRoleMenuPayload>;
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
export type MutationDeleteRoleMenuByGuildIdAndMenuNameArgs = {
  input: DeleteRoleMenuByGuildIdAndMenuNameInput;
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
export type MutationUpdateRoleMenuByGuildIdAndMenuNameArgs = {
  input: UpdateRoleMenuByGuildIdAndMenuNameInput;
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

export type MuteAggregates = {
  __typename?: 'MuteAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<MuteAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<MuteDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<MuteMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<MuteMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<MuteStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<MuteStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<MuteSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<MuteVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<MuteVarianceSampleAggregates>;
};

export type MuteAverageAggregates = {
  __typename?: 'MuteAverageAggregates';
  /** Mean average of caseId across the matching connection */
  caseId?: Maybe<Scalars['BigFloat']>;
  /** Mean average of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Mean average of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
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

export type MuteDistinctCountAggregates = {
  __typename?: 'MuteDistinctCountAggregates';
  /** Distinct count of caseId across the matching connection */
  caseId?: Maybe<Scalars['BigInt']>;
  /** Distinct count of endTime across the matching connection */
  endTime?: Maybe<Scalars['BigInt']>;
  /** Distinct count of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Distinct count of pending across the matching connection */
  pending?: Maybe<Scalars['BigInt']>;
  /** Distinct count of startTime across the matching connection */
  startTime?: Maybe<Scalars['BigInt']>;
  /** Distinct count of userId across the matching connection */
  userId?: Maybe<Scalars['BigInt']>;
};

/** A filter to be used against `Mute` object types. All fields are combined with a logical ‘and.’ */
export type MuteFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<MuteFilter>>;
  /** Filter by the object’s `caseId` field. */
  caseId?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `endTime` field. */
  endTime?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `guildId` field. */
  guildId?: InputMaybe<BigIntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<MuteFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<MuteFilter>>;
  /** Filter by the object’s `pending` field. */
  pending?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `startTime` field. */
  startTime?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `userId` field. */
  userId?: InputMaybe<BigIntFilter>;
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

export type MuteMaxAggregates = {
  __typename?: 'MuteMaxAggregates';
  /** Maximum of caseId across the matching connection */
  caseId?: Maybe<Scalars['BigInt']>;
  /** Maximum of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Maximum of userId across the matching connection */
  userId?: Maybe<Scalars['BigInt']>;
};

export type MuteMinAggregates = {
  __typename?: 'MuteMinAggregates';
  /** Minimum of caseId across the matching connection */
  caseId?: Maybe<Scalars['BigInt']>;
  /** Minimum of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Minimum of userId across the matching connection */
  userId?: Maybe<Scalars['BigInt']>;
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

export type MuteStddevPopulationAggregates = {
  __typename?: 'MuteStddevPopulationAggregates';
  /** Population standard deviation of caseId across the matching connection */
  caseId?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

export type MuteStddevSampleAggregates = {
  __typename?: 'MuteStddevSampleAggregates';
  /** Sample standard deviation of caseId across the matching connection */
  caseId?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

export type MuteSumAggregates = {
  __typename?: 'MuteSumAggregates';
  /** Sum of caseId across the matching connection */
  caseId: Scalars['BigFloat'];
  /** Sum of guildId across the matching connection */
  guildId: Scalars['BigFloat'];
  /** Sum of userId across the matching connection */
  userId: Scalars['BigFloat'];
};

export type MuteVariancePopulationAggregates = {
  __typename?: 'MuteVariancePopulationAggregates';
  /** Population variance of caseId across the matching connection */
  caseId?: Maybe<Scalars['BigFloat']>;
  /** Population variance of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Population variance of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

export type MuteVarianceSampleAggregates = {
  __typename?: 'MuteVarianceSampleAggregates';
  /** Sample variance of caseId across the matching connection */
  caseId?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

/** A connection to a list of `Mute` values. */
export type MutesConnection = {
  __typename?: 'MutesConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<MuteAggregates>;
  /** A list of edges which contains the `Mute` and cursor to aid in pagination. */
  edges: Array<MutesEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<MuteAggregates>>;
  /** A list of `Mute` objects. */
  nodes: Array<Mute>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Mute` you could get from the connection. */
  totalCount: Scalars['Int'];
};


/** A connection to a list of `Mute` values. */
export type MutesConnectionGroupedAggregatesArgs = {
  groupBy: Array<MutesGroupBy>;
  having?: InputMaybe<MutesHavingInput>;
};

/** A `Mute` edge in the connection. */
export type MutesEdge = {
  __typename?: 'MutesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Mute` at the end of the edge. */
  node: Mute;
};

/** Grouping methods for `Mute` for usage during aggregation. */
export enum MutesGroupBy {
  CaseId = 'CASE_ID',
  EndTime = 'END_TIME',
  EndTimeTruncatedToDay = 'END_TIME_TRUNCATED_TO_DAY',
  EndTimeTruncatedToHour = 'END_TIME_TRUNCATED_TO_HOUR',
  GuildId = 'GUILD_ID',
  Pending = 'PENDING',
  StartTime = 'START_TIME',
  StartTimeTruncatedToDay = 'START_TIME_TRUNCATED_TO_DAY',
  StartTimeTruncatedToHour = 'START_TIME_TRUNCATED_TO_HOUR',
  UserId = 'USER_ID'
}

export type MutesHavingAverageInput = {
  caseId?: InputMaybe<HavingBigintFilter>;
  endTime?: InputMaybe<HavingDatetimeFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  startTime?: InputMaybe<HavingDatetimeFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type MutesHavingDistinctCountInput = {
  caseId?: InputMaybe<HavingBigintFilter>;
  endTime?: InputMaybe<HavingDatetimeFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  startTime?: InputMaybe<HavingDatetimeFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

/** Conditions for `Mute` aggregates. */
export type MutesHavingInput = {
  AND?: InputMaybe<Array<MutesHavingInput>>;
  OR?: InputMaybe<Array<MutesHavingInput>>;
  average?: InputMaybe<MutesHavingAverageInput>;
  distinctCount?: InputMaybe<MutesHavingDistinctCountInput>;
  max?: InputMaybe<MutesHavingMaxInput>;
  min?: InputMaybe<MutesHavingMinInput>;
  stddevPopulation?: InputMaybe<MutesHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<MutesHavingStddevSampleInput>;
  sum?: InputMaybe<MutesHavingSumInput>;
  variancePopulation?: InputMaybe<MutesHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<MutesHavingVarianceSampleInput>;
};

export type MutesHavingMaxInput = {
  caseId?: InputMaybe<HavingBigintFilter>;
  endTime?: InputMaybe<HavingDatetimeFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  startTime?: InputMaybe<HavingDatetimeFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type MutesHavingMinInput = {
  caseId?: InputMaybe<HavingBigintFilter>;
  endTime?: InputMaybe<HavingDatetimeFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  startTime?: InputMaybe<HavingDatetimeFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type MutesHavingStddevPopulationInput = {
  caseId?: InputMaybe<HavingBigintFilter>;
  endTime?: InputMaybe<HavingDatetimeFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  startTime?: InputMaybe<HavingDatetimeFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type MutesHavingStddevSampleInput = {
  caseId?: InputMaybe<HavingBigintFilter>;
  endTime?: InputMaybe<HavingDatetimeFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  startTime?: InputMaybe<HavingDatetimeFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type MutesHavingSumInput = {
  caseId?: InputMaybe<HavingBigintFilter>;
  endTime?: InputMaybe<HavingDatetimeFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  startTime?: InputMaybe<HavingDatetimeFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type MutesHavingVariancePopulationInput = {
  caseId?: InputMaybe<HavingBigintFilter>;
  endTime?: InputMaybe<HavingDatetimeFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  startTime?: InputMaybe<HavingDatetimeFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type MutesHavingVarianceSampleInput = {
  caseId?: InputMaybe<HavingBigintFilter>;
  endTime?: InputMaybe<HavingDatetimeFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  startTime?: InputMaybe<HavingDatetimeFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
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

export type NotificationAggregates = {
  __typename?: 'NotificationAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<NotificationAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<NotificationDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<NotificationMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<NotificationMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<NotificationStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<NotificationStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<NotificationSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<NotificationVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<NotificationVarianceSampleAggregates>;
};

export type NotificationAverageAggregates = {
  __typename?: 'NotificationAverageAggregates';
  /** Mean average of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Mean average of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
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

export type NotificationDistinctCountAggregates = {
  __typename?: 'NotificationDistinctCountAggregates';
  /** Distinct count of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Distinct count of keyword across the matching connection */
  keyword?: Maybe<Scalars['BigInt']>;
  /** Distinct count of userId across the matching connection */
  userId?: Maybe<Scalars['BigInt']>;
};

/** A filter to be used against `Notification` object types. All fields are combined with a logical ‘and.’ */
export type NotificationFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<NotificationFilter>>;
  /** Filter by the object’s `guildId` field. */
  guildId?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `keyword` field. */
  keyword?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<NotificationFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<NotificationFilter>>;
  /** Filter by the object’s `userId` field. */
  userId?: InputMaybe<BigIntFilter>;
};

/** An input for mutations affecting `Notification` */
export type NotificationInput = {
  guildId: Scalars['BigInt'];
  keyword: Scalars['String'];
  userId: Scalars['BigInt'];
};

export type NotificationMaxAggregates = {
  __typename?: 'NotificationMaxAggregates';
  /** Maximum of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Maximum of userId across the matching connection */
  userId?: Maybe<Scalars['BigInt']>;
};

export type NotificationMinAggregates = {
  __typename?: 'NotificationMinAggregates';
  /** Minimum of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Minimum of userId across the matching connection */
  userId?: Maybe<Scalars['BigInt']>;
};

/** Represents an update to a `Notification`. Fields that are set will be updated. */
export type NotificationPatch = {
  guildId?: InputMaybe<Scalars['BigInt']>;
  keyword?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['BigInt']>;
};

export type NotificationStddevPopulationAggregates = {
  __typename?: 'NotificationStddevPopulationAggregates';
  /** Population standard deviation of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

export type NotificationStddevSampleAggregates = {
  __typename?: 'NotificationStddevSampleAggregates';
  /** Sample standard deviation of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

export type NotificationSumAggregates = {
  __typename?: 'NotificationSumAggregates';
  /** Sum of guildId across the matching connection */
  guildId: Scalars['BigFloat'];
  /** Sum of userId across the matching connection */
  userId: Scalars['BigFloat'];
};

export type NotificationVariancePopulationAggregates = {
  __typename?: 'NotificationVariancePopulationAggregates';
  /** Population variance of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Population variance of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

export type NotificationVarianceSampleAggregates = {
  __typename?: 'NotificationVarianceSampleAggregates';
  /** Sample variance of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

/** A connection to a list of `Notification` values. */
export type NotificationsConnection = {
  __typename?: 'NotificationsConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<NotificationAggregates>;
  /** A list of edges which contains the `Notification` and cursor to aid in pagination. */
  edges: Array<NotificationsEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<NotificationAggregates>>;
  /** A list of `Notification` objects. */
  nodes: Array<Notification>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Notification` you could get from the connection. */
  totalCount: Scalars['Int'];
};


/** A connection to a list of `Notification` values. */
export type NotificationsConnectionGroupedAggregatesArgs = {
  groupBy: Array<NotificationsGroupBy>;
  having?: InputMaybe<NotificationsHavingInput>;
};

/** A `Notification` edge in the connection. */
export type NotificationsEdge = {
  __typename?: 'NotificationsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Notification` at the end of the edge. */
  node: Notification;
};

/** Grouping methods for `Notification` for usage during aggregation. */
export enum NotificationsGroupBy {
  GuildId = 'GUILD_ID',
  Keyword = 'KEYWORD',
  UserId = 'USER_ID'
}

export type NotificationsHavingAverageInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type NotificationsHavingDistinctCountInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

/** Conditions for `Notification` aggregates. */
export type NotificationsHavingInput = {
  AND?: InputMaybe<Array<NotificationsHavingInput>>;
  OR?: InputMaybe<Array<NotificationsHavingInput>>;
  average?: InputMaybe<NotificationsHavingAverageInput>;
  distinctCount?: InputMaybe<NotificationsHavingDistinctCountInput>;
  max?: InputMaybe<NotificationsHavingMaxInput>;
  min?: InputMaybe<NotificationsHavingMinInput>;
  stddevPopulation?: InputMaybe<NotificationsHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<NotificationsHavingStddevSampleInput>;
  sum?: InputMaybe<NotificationsHavingSumInput>;
  variancePopulation?: InputMaybe<NotificationsHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<NotificationsHavingVarianceSampleInput>;
};

export type NotificationsHavingMaxInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type NotificationsHavingMinInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type NotificationsHavingStddevPopulationInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type NotificationsHavingStddevSampleInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type NotificationsHavingSumInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type NotificationsHavingVariancePopulationInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type NotificationsHavingVarianceSampleInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
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

/** A connection to a list of `String` values. */
export type NotificationsStartingWithConnection = {
  __typename?: 'NotificationsStartingWithConnection';
  /** A list of edges which contains the `String` and cursor to aid in pagination. */
  edges: Array<NotificationsStartingWithEdge>;
  /** A list of `String` objects. */
  nodes: Array<Maybe<Scalars['String']>>;
  /** The count of *all* `String` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `String` edge in the connection. */
export type NotificationsStartingWithEdge = {
  __typename?: 'NotificationsStartingWithEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `String` at the end of the edge. */
  node?: Maybe<Scalars['String']>;
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
  allRedisGuildIds: Array<Scalars['BigInt']>;
  /** Reads and enables pagination through a set of `Reminder`. */
  allReminders?: Maybe<RemindersConnection>;
  /** Reads and enables pagination through a set of `RoleMenu`. */
  allRoleMenus?: Maybe<RoleMenusConnection>;
  /** Reads and enables pagination through a set of `Tag`. */
  allTags?: Maybe<TagsConnection>;
  /** Reads and enables pagination through a set of `UserLevel`. */
  allUserLevels?: Maybe<UserLevelsConnection>;
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
  nextCaseId?: Maybe<Scalars['BigInt']>;
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars['ID'];
  /** Reads a single `Notification` using its globally unique `ID`. */
  notification?: Maybe<Notification>;
  notificationByUserIdAndGuildIdAndKeyword?: Maybe<Notification>;
  notificationsStartingWith?: Maybe<NotificationsStartingWithConnection>;
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  randomTag?: Maybe<Tag>;
  redisGuildByGuildId?: Maybe<RedisGuild>;
  /** Reads a single `Reminder` using its globally unique `ID`. */
  reminder?: Maybe<Reminder>;
  reminderByUserIdAndSetAt?: Maybe<Reminder>;
  /** Reads a single `RoleMenu` using its globally unique `ID`. */
  roleMenu?: Maybe<RoleMenu>;
  roleMenuByGuildIdAndMenuName?: Maybe<RoleMenu>;
  /** Reads a single `Tag` using its globally unique `ID`. */
  tag?: Maybe<Tag>;
  tagByGuildIdAndTagName?: Maybe<Tag>;
  /** Leaderboard for given timeframe and optional guild. If guild is null, it is the global leaderboard */
  timeframeUserLevels?: Maybe<TimeframeUserLevelsConnection>;
  /** Reads a single `User` using its globally unique `ID`. */
  user?: Maybe<User>;
  userById?: Maybe<User>;
  userGuildRank?: Maybe<UserGuildRankResult>;
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
  filter?: InputMaybe<BotStatFilter>;
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
  filter?: InputMaybe<FeedItemFilter>;
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
  filter?: InputMaybe<FeedSubscriptionFilter>;
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
  filter?: InputMaybe<FeedFilter>;
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
  filter?: InputMaybe<GuildBanFilter>;
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
  filter?: InputMaybe<GuildConfigFilter>;
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
  filter?: InputMaybe<MemberFilter>;
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
  filter?: InputMaybe<MessageFilter>;
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
  filter?: InputMaybe<ModLogFilter>;
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
  filter?: InputMaybe<MuteFilter>;
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
  filter?: InputMaybe<NotificationFilter>;
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
  filter?: InputMaybe<ReminderFilter>;
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
  filter?: InputMaybe<RoleMenuFilter>;
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
  filter?: InputMaybe<TagFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TagsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllUserLevelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<UserLevelCondition>;
  filter?: InputMaybe<UserLevelFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<UserLevelsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllUsersArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<UserCondition>;
  filter?: InputMaybe<UserFilter>;
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
  filter?: InputMaybe<WebUserGuildFilter>;
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
  filter?: InputMaybe<WebUserFilter>;
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
  filter?: InputMaybe<BigIntFilter>;
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
export type QueryNextCaseIdArgs = {
  guildId?: InputMaybe<Scalars['BigInt']>;
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
export type QueryNotificationsStartingWithArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  filter?: InputMaybe<StringFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['BigInt']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryRandomTagArgs = {
  guildId?: InputMaybe<Scalars['BigInt']>;
  ownerId?: InputMaybe<Scalars['BigInt']>;
  query?: InputMaybe<Scalars['String']>;
  startsWith?: InputMaybe<Scalars['Boolean']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryRedisGuildByGuildIdArgs = {
  guild_id: Scalars['BigInt'];
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
export type QueryRoleMenuByGuildIdAndMenuNameArgs = {
  guildId: Scalars['BigInt'];
  menuName: Scalars['String'];
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
  filter?: InputMaybe<TimeframeUserLevelsRecordFilter>;
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
export type QueryUserGuildRankArgs = {
  guildId: Scalars['BigInt'];
  userId: Scalars['BigInt'];
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

export type RedisGuild = {
  __typename?: 'RedisGuild';
  afkChannelId?: Maybe<Scalars['String']>;
  afkTimeout: Scalars['Int'];
  applicationId?: Maybe<Scalars['String']>;
  banner?: Maybe<Scalars['String']>;
  channels?: Maybe<Array<Maybe<Scalars['String']>>>;
  defaultMessageNotifications?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  discoverySplash?: Maybe<Scalars['String']>;
  emojis?: Maybe<Array<Maybe<Scalars['String']>>>;
  explicitContentFilter?: Maybe<Scalars['Int']>;
  features?: Maybe<Array<Maybe<Scalars['String']>>>;
  icon?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  joinedAt?: Maybe<Scalars['String']>;
  large?: Maybe<Scalars['Boolean']>;
  maxMembers?: Maybe<Scalars['Int']>;
  maxVideoChannelUsers?: Maybe<Scalars['Int']>;
  memberCount?: Maybe<Scalars['Int']>;
  members?: Maybe<Array<Maybe<Scalars['String']>>>;
  mfaLevel?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  nsfwLevel: Scalars['Int'];
  ownerId: Scalars['String'];
  preferredLocale?: Maybe<Scalars['String']>;
  premiumSubscriptionCount?: Maybe<Scalars['Int']>;
  premiumTier: Scalars['Int'];
  presences?: Maybe<Array<Maybe<Scalars['String']>>>;
  roles?: Maybe<Array<Maybe<RedisGuildRole>>>;
  rulesChannelId?: Maybe<Scalars['String']>;
  splash?: Maybe<Scalars['String']>;
  systemChannelFlags?: Maybe<Scalars['Int']>;
  systemChannelId?: Maybe<Scalars['String']>;
  unavailable?: Maybe<Scalars['Boolean']>;
  vanityUrlCode?: Maybe<Scalars['String']>;
  verificationLevel?: Maybe<Scalars['Int']>;
  voiceStates?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type RedisGuildRole = {
  __typename?: 'RedisGuildRole';
  color: Scalars['Int'];
  hoist: Scalars['Boolean'];
  icon?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  managed: Scalars['Boolean'];
  mentionable: Scalars['Boolean'];
  name: Scalars['String'];
  permissions: Scalars['String'];
  position: Scalars['Int'];
  tags?: Maybe<RedisRoleTags>;
  unicode_emoji?: Maybe<Scalars['String']>;
};

export type RedisRoleTags = {
  __typename?: 'RedisRoleTags';
  bot_id?: Maybe<Scalars['String']>;
  integration_id?: Maybe<Scalars['String']>;
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

export type ReminderAggregates = {
  __typename?: 'ReminderAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<ReminderAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<ReminderDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<ReminderMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<ReminderMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<ReminderStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<ReminderStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<ReminderSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<ReminderVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<ReminderVarianceSampleAggregates>;
};

export type ReminderAverageAggregates = {
  __typename?: 'ReminderAverageAggregates';
  /** Mean average of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
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

export type ReminderDistinctCountAggregates = {
  __typename?: 'ReminderDistinctCountAggregates';
  /** Distinct count of description across the matching connection */
  description?: Maybe<Scalars['BigInt']>;
  /** Distinct count of expireAt across the matching connection */
  expireAt?: Maybe<Scalars['BigInt']>;
  /** Distinct count of setAt across the matching connection */
  setAt?: Maybe<Scalars['BigInt']>;
  /** Distinct count of userId across the matching connection */
  userId?: Maybe<Scalars['BigInt']>;
};

/** A filter to be used against `Reminder` object types. All fields are combined with a logical ‘and.’ */
export type ReminderFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ReminderFilter>>;
  /** Filter by the object’s `description` field. */
  description?: InputMaybe<StringFilter>;
  /** Filter by the object’s `expireAt` field. */
  expireAt?: InputMaybe<DatetimeFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ReminderFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ReminderFilter>>;
  /** Filter by the object’s `setAt` field. */
  setAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `userId` field. */
  userId?: InputMaybe<BigIntFilter>;
};

/** An input for mutations affecting `Reminder` */
export type ReminderInput = {
  description: Scalars['String'];
  expireAt: Scalars['Datetime'];
  setAt: Scalars['Datetime'];
  userId: Scalars['BigInt'];
};

export type ReminderMaxAggregates = {
  __typename?: 'ReminderMaxAggregates';
  /** Maximum of userId across the matching connection */
  userId?: Maybe<Scalars['BigInt']>;
};

export type ReminderMinAggregates = {
  __typename?: 'ReminderMinAggregates';
  /** Minimum of userId across the matching connection */
  userId?: Maybe<Scalars['BigInt']>;
};

/** Represents an update to a `Reminder`. Fields that are set will be updated. */
export type ReminderPatch = {
  description?: InputMaybe<Scalars['String']>;
  expireAt?: InputMaybe<Scalars['Datetime']>;
  setAt?: InputMaybe<Scalars['Datetime']>;
  userId?: InputMaybe<Scalars['BigInt']>;
};

export type ReminderStddevPopulationAggregates = {
  __typename?: 'ReminderStddevPopulationAggregates';
  /** Population standard deviation of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

export type ReminderStddevSampleAggregates = {
  __typename?: 'ReminderStddevSampleAggregates';
  /** Sample standard deviation of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

export type ReminderSumAggregates = {
  __typename?: 'ReminderSumAggregates';
  /** Sum of userId across the matching connection */
  userId: Scalars['BigFloat'];
};

export type ReminderVariancePopulationAggregates = {
  __typename?: 'ReminderVariancePopulationAggregates';
  /** Population variance of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

export type ReminderVarianceSampleAggregates = {
  __typename?: 'ReminderVarianceSampleAggregates';
  /** Sample variance of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

/** A connection to a list of `Reminder` values. */
export type RemindersConnection = {
  __typename?: 'RemindersConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<ReminderAggregates>;
  /** A list of edges which contains the `Reminder` and cursor to aid in pagination. */
  edges: Array<RemindersEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<ReminderAggregates>>;
  /** A list of `Reminder` objects. */
  nodes: Array<Reminder>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Reminder` you could get from the connection. */
  totalCount: Scalars['Int'];
};


/** A connection to a list of `Reminder` values. */
export type RemindersConnectionGroupedAggregatesArgs = {
  groupBy: Array<RemindersGroupBy>;
  having?: InputMaybe<RemindersHavingInput>;
};

/** A `Reminder` edge in the connection. */
export type RemindersEdge = {
  __typename?: 'RemindersEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Reminder` at the end of the edge. */
  node: Reminder;
};

/** Grouping methods for `Reminder` for usage during aggregation. */
export enum RemindersGroupBy {
  Description = 'DESCRIPTION',
  ExpireAt = 'EXPIRE_AT',
  ExpireAtTruncatedToDay = 'EXPIRE_AT_TRUNCATED_TO_DAY',
  ExpireAtTruncatedToHour = 'EXPIRE_AT_TRUNCATED_TO_HOUR',
  SetAt = 'SET_AT',
  SetAtTruncatedToDay = 'SET_AT_TRUNCATED_TO_DAY',
  SetAtTruncatedToHour = 'SET_AT_TRUNCATED_TO_HOUR',
  UserId = 'USER_ID'
}

export type RemindersHavingAverageInput = {
  expireAt?: InputMaybe<HavingDatetimeFilter>;
  setAt?: InputMaybe<HavingDatetimeFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type RemindersHavingDistinctCountInput = {
  expireAt?: InputMaybe<HavingDatetimeFilter>;
  setAt?: InputMaybe<HavingDatetimeFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

/** Conditions for `Reminder` aggregates. */
export type RemindersHavingInput = {
  AND?: InputMaybe<Array<RemindersHavingInput>>;
  OR?: InputMaybe<Array<RemindersHavingInput>>;
  average?: InputMaybe<RemindersHavingAverageInput>;
  distinctCount?: InputMaybe<RemindersHavingDistinctCountInput>;
  max?: InputMaybe<RemindersHavingMaxInput>;
  min?: InputMaybe<RemindersHavingMinInput>;
  stddevPopulation?: InputMaybe<RemindersHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<RemindersHavingStddevSampleInput>;
  sum?: InputMaybe<RemindersHavingSumInput>;
  variancePopulation?: InputMaybe<RemindersHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<RemindersHavingVarianceSampleInput>;
};

export type RemindersHavingMaxInput = {
  expireAt?: InputMaybe<HavingDatetimeFilter>;
  setAt?: InputMaybe<HavingDatetimeFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type RemindersHavingMinInput = {
  expireAt?: InputMaybe<HavingDatetimeFilter>;
  setAt?: InputMaybe<HavingDatetimeFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type RemindersHavingStddevPopulationInput = {
  expireAt?: InputMaybe<HavingDatetimeFilter>;
  setAt?: InputMaybe<HavingDatetimeFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type RemindersHavingStddevSampleInput = {
  expireAt?: InputMaybe<HavingDatetimeFilter>;
  setAt?: InputMaybe<HavingDatetimeFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type RemindersHavingSumInput = {
  expireAt?: InputMaybe<HavingDatetimeFilter>;
  setAt?: InputMaybe<HavingDatetimeFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type RemindersHavingVariancePopulationInput = {
  expireAt?: InputMaybe<HavingDatetimeFilter>;
  setAt?: InputMaybe<HavingDatetimeFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type RemindersHavingVarianceSampleInput = {
  expireAt?: InputMaybe<HavingDatetimeFilter>;
  setAt?: InputMaybe<HavingDatetimeFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
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
  description?: Maybe<Scalars['String']>;
  guildId: Scalars['BigInt'];
  maxCount?: Maybe<Scalars['Int']>;
  menuName: Scalars['String'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  requiredRole?: Maybe<Scalars['BigInt']>;
  roleIds?: Maybe<Array<Maybe<Scalars['BigInt']>>>;
};

export type RoleMenuAggregates = {
  __typename?: 'RoleMenuAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<RoleMenuAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<RoleMenuDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<RoleMenuMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<RoleMenuMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<RoleMenuStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<RoleMenuStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<RoleMenuSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<RoleMenuVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<RoleMenuVarianceSampleAggregates>;
};

export type RoleMenuAverageAggregates = {
  __typename?: 'RoleMenuAverageAggregates';
  /** Mean average of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Mean average of maxCount across the matching connection */
  maxCount?: Maybe<Scalars['BigFloat']>;
  /** Mean average of requiredRole across the matching connection */
  requiredRole?: Maybe<Scalars['BigFloat']>;
};

/**
 * A condition to be used against `RoleMenu` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type RoleMenuCondition = {
  /** Checks for equality with the object’s `description` field. */
  description?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `guildId` field. */
  guildId?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `maxCount` field. */
  maxCount?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `menuName` field. */
  menuName?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `requiredRole` field. */
  requiredRole?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `roleIds` field. */
  roleIds?: InputMaybe<Array<InputMaybe<Scalars['BigInt']>>>;
};

export type RoleMenuDistinctCountAggregates = {
  __typename?: 'RoleMenuDistinctCountAggregates';
  /** Distinct count of description across the matching connection */
  description?: Maybe<Scalars['BigInt']>;
  /** Distinct count of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Distinct count of maxCount across the matching connection */
  maxCount?: Maybe<Scalars['BigInt']>;
  /** Distinct count of menuName across the matching connection */
  menuName?: Maybe<Scalars['BigInt']>;
  /** Distinct count of requiredRole across the matching connection */
  requiredRole?: Maybe<Scalars['BigInt']>;
  /** Distinct count of roleIds across the matching connection */
  roleIds?: Maybe<Scalars['BigInt']>;
};

/** A filter to be used against `RoleMenu` object types. All fields are combined with a logical ‘and.’ */
export type RoleMenuFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<RoleMenuFilter>>;
  /** Filter by the object’s `description` field. */
  description?: InputMaybe<StringFilter>;
  /** Filter by the object’s `guildId` field. */
  guildId?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `maxCount` field. */
  maxCount?: InputMaybe<IntFilter>;
  /** Filter by the object’s `menuName` field. */
  menuName?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<RoleMenuFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<RoleMenuFilter>>;
  /** Filter by the object’s `requiredRole` field. */
  requiredRole?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `roleIds` field. */
  roleIds?: InputMaybe<BigIntListFilter>;
};

/** An input for mutations affecting `RoleMenu` */
export type RoleMenuInput = {
  description?: InputMaybe<Scalars['String']>;
  guildId: Scalars['BigInt'];
  maxCount?: InputMaybe<Scalars['Int']>;
  menuName: Scalars['String'];
  requiredRole?: InputMaybe<Scalars['BigInt']>;
  roleIds?: InputMaybe<Array<InputMaybe<Scalars['BigInt']>>>;
};

export type RoleMenuMaxAggregates = {
  __typename?: 'RoleMenuMaxAggregates';
  /** Maximum of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Maximum of maxCount across the matching connection */
  maxCount?: Maybe<Scalars['Int']>;
  /** Maximum of requiredRole across the matching connection */
  requiredRole?: Maybe<Scalars['BigInt']>;
};

export type RoleMenuMinAggregates = {
  __typename?: 'RoleMenuMinAggregates';
  /** Minimum of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Minimum of maxCount across the matching connection */
  maxCount?: Maybe<Scalars['Int']>;
  /** Minimum of requiredRole across the matching connection */
  requiredRole?: Maybe<Scalars['BigInt']>;
};

/** Represents an update to a `RoleMenu`. Fields that are set will be updated. */
export type RoleMenuPatch = {
  description?: InputMaybe<Scalars['String']>;
  guildId?: InputMaybe<Scalars['BigInt']>;
  maxCount?: InputMaybe<Scalars['Int']>;
  menuName?: InputMaybe<Scalars['String']>;
  requiredRole?: InputMaybe<Scalars['BigInt']>;
  roleIds?: InputMaybe<Array<InputMaybe<Scalars['BigInt']>>>;
};

export type RoleMenuStddevPopulationAggregates = {
  __typename?: 'RoleMenuStddevPopulationAggregates';
  /** Population standard deviation of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of maxCount across the matching connection */
  maxCount?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of requiredRole across the matching connection */
  requiredRole?: Maybe<Scalars['BigFloat']>;
};

export type RoleMenuStddevSampleAggregates = {
  __typename?: 'RoleMenuStddevSampleAggregates';
  /** Sample standard deviation of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of maxCount across the matching connection */
  maxCount?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of requiredRole across the matching connection */
  requiredRole?: Maybe<Scalars['BigFloat']>;
};

export type RoleMenuSumAggregates = {
  __typename?: 'RoleMenuSumAggregates';
  /** Sum of guildId across the matching connection */
  guildId: Scalars['BigFloat'];
  /** Sum of maxCount across the matching connection */
  maxCount: Scalars['BigInt'];
  /** Sum of requiredRole across the matching connection */
  requiredRole: Scalars['BigFloat'];
};

export type RoleMenuVariancePopulationAggregates = {
  __typename?: 'RoleMenuVariancePopulationAggregates';
  /** Population variance of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Population variance of maxCount across the matching connection */
  maxCount?: Maybe<Scalars['BigFloat']>;
  /** Population variance of requiredRole across the matching connection */
  requiredRole?: Maybe<Scalars['BigFloat']>;
};

export type RoleMenuVarianceSampleAggregates = {
  __typename?: 'RoleMenuVarianceSampleAggregates';
  /** Sample variance of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of maxCount across the matching connection */
  maxCount?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of requiredRole across the matching connection */
  requiredRole?: Maybe<Scalars['BigFloat']>;
};

/** A connection to a list of `RoleMenu` values. */
export type RoleMenusConnection = {
  __typename?: 'RoleMenusConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<RoleMenuAggregates>;
  /** A list of edges which contains the `RoleMenu` and cursor to aid in pagination. */
  edges: Array<RoleMenusEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<RoleMenuAggregates>>;
  /** A list of `RoleMenu` objects. */
  nodes: Array<RoleMenu>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `RoleMenu` you could get from the connection. */
  totalCount: Scalars['Int'];
};


/** A connection to a list of `RoleMenu` values. */
export type RoleMenusConnectionGroupedAggregatesArgs = {
  groupBy: Array<RoleMenusGroupBy>;
  having?: InputMaybe<RoleMenusHavingInput>;
};

/** A `RoleMenu` edge in the connection. */
export type RoleMenusEdge = {
  __typename?: 'RoleMenusEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `RoleMenu` at the end of the edge. */
  node: RoleMenu;
};

/** Grouping methods for `RoleMenu` for usage during aggregation. */
export enum RoleMenusGroupBy {
  Description = 'DESCRIPTION',
  GuildId = 'GUILD_ID',
  MaxCount = 'MAX_COUNT',
  MenuName = 'MENU_NAME',
  RequiredRole = 'REQUIRED_ROLE',
  RoleIds = 'ROLE_IDS'
}

export type RoleMenusHavingAverageInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  maxCount?: InputMaybe<HavingIntFilter>;
  requiredRole?: InputMaybe<HavingBigintFilter>;
};

export type RoleMenusHavingDistinctCountInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  maxCount?: InputMaybe<HavingIntFilter>;
  requiredRole?: InputMaybe<HavingBigintFilter>;
};

/** Conditions for `RoleMenu` aggregates. */
export type RoleMenusHavingInput = {
  AND?: InputMaybe<Array<RoleMenusHavingInput>>;
  OR?: InputMaybe<Array<RoleMenusHavingInput>>;
  average?: InputMaybe<RoleMenusHavingAverageInput>;
  distinctCount?: InputMaybe<RoleMenusHavingDistinctCountInput>;
  max?: InputMaybe<RoleMenusHavingMaxInput>;
  min?: InputMaybe<RoleMenusHavingMinInput>;
  stddevPopulation?: InputMaybe<RoleMenusHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<RoleMenusHavingStddevSampleInput>;
  sum?: InputMaybe<RoleMenusHavingSumInput>;
  variancePopulation?: InputMaybe<RoleMenusHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<RoleMenusHavingVarianceSampleInput>;
};

export type RoleMenusHavingMaxInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  maxCount?: InputMaybe<HavingIntFilter>;
  requiredRole?: InputMaybe<HavingBigintFilter>;
};

export type RoleMenusHavingMinInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  maxCount?: InputMaybe<HavingIntFilter>;
  requiredRole?: InputMaybe<HavingBigintFilter>;
};

export type RoleMenusHavingStddevPopulationInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  maxCount?: InputMaybe<HavingIntFilter>;
  requiredRole?: InputMaybe<HavingBigintFilter>;
};

export type RoleMenusHavingStddevSampleInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  maxCount?: InputMaybe<HavingIntFilter>;
  requiredRole?: InputMaybe<HavingBigintFilter>;
};

export type RoleMenusHavingSumInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  maxCount?: InputMaybe<HavingIntFilter>;
  requiredRole?: InputMaybe<HavingBigintFilter>;
};

export type RoleMenusHavingVariancePopulationInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  maxCount?: InputMaybe<HavingIntFilter>;
  requiredRole?: InputMaybe<HavingBigintFilter>;
};

export type RoleMenusHavingVarianceSampleInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  maxCount?: InputMaybe<HavingIntFilter>;
  requiredRole?: InputMaybe<HavingBigintFilter>;
};

/** Methods to use when ordering `RoleMenu`. */
export enum RoleMenusOrderBy {
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  GuildIdAsc = 'GUILD_ID_ASC',
  GuildIdDesc = 'GUILD_ID_DESC',
  MaxCountAsc = 'MAX_COUNT_ASC',
  MaxCountDesc = 'MAX_COUNT_DESC',
  MenuNameAsc = 'MENU_NAME_ASC',
  MenuNameDesc = 'MENU_NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RequiredRoleAsc = 'REQUIRED_ROLE_ASC',
  RequiredRoleDesc = 'REQUIRED_ROLE_DESC',
  RoleIdsAsc = 'ROLE_IDS_ASC',
  RoleIdsDesc = 'ROLE_IDS_DESC'
}

/** A filter to be used against String fields. All fields are combined with a logical ‘and.’ */
export type StringFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['String']>;
  /** Not equal to the specified value, treating null like an ordinary value (case-insensitive). */
  distinctFromInsensitive?: InputMaybe<Scalars['String']>;
  /** Ends with the specified string (case-sensitive). */
  endsWith?: InputMaybe<Scalars['String']>;
  /** Ends with the specified string (case-insensitive). */
  endsWithInsensitive?: InputMaybe<Scalars['String']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['String']>;
  /** Equal to the specified value (case-insensitive). */
  equalToInsensitive?: InputMaybe<Scalars['String']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['String']>;
  /** Greater than the specified value (case-insensitive). */
  greaterThanInsensitive?: InputMaybe<Scalars['String']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['String']>;
  /** Greater than or equal to the specified value (case-insensitive). */
  greaterThanOrEqualToInsensitive?: InputMaybe<Scalars['String']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['String']>>;
  /** Included in the specified list (case-insensitive). */
  inInsensitive?: InputMaybe<Array<Scalars['String']>>;
  /** Contains the specified string (case-sensitive). */
  includes?: InputMaybe<Scalars['String']>;
  /** Contains the specified string (case-insensitive). */
  includesInsensitive?: InputMaybe<Scalars['String']>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['String']>;
  /** Less than the specified value (case-insensitive). */
  lessThanInsensitive?: InputMaybe<Scalars['String']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['String']>;
  /** Less than or equal to the specified value (case-insensitive). */
  lessThanOrEqualToInsensitive?: InputMaybe<Scalars['String']>;
  /** Matches the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  like?: InputMaybe<Scalars['String']>;
  /** Matches the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  likeInsensitive?: InputMaybe<Scalars['String']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['String']>;
  /** Equal to the specified value, treating null like an ordinary value (case-insensitive). */
  notDistinctFromInsensitive?: InputMaybe<Scalars['String']>;
  /** Does not end with the specified string (case-sensitive). */
  notEndsWith?: InputMaybe<Scalars['String']>;
  /** Does not end with the specified string (case-insensitive). */
  notEndsWithInsensitive?: InputMaybe<Scalars['String']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['String']>;
  /** Not equal to the specified value (case-insensitive). */
  notEqualToInsensitive?: InputMaybe<Scalars['String']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['String']>>;
  /** Not included in the specified list (case-insensitive). */
  notInInsensitive?: InputMaybe<Array<Scalars['String']>>;
  /** Does not contain the specified string (case-sensitive). */
  notIncludes?: InputMaybe<Scalars['String']>;
  /** Does not contain the specified string (case-insensitive). */
  notIncludesInsensitive?: InputMaybe<Scalars['String']>;
  /** Does not match the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLike?: InputMaybe<Scalars['String']>;
  /** Does not match the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLikeInsensitive?: InputMaybe<Scalars['String']>;
  /** Does not start with the specified string (case-sensitive). */
  notStartsWith?: InputMaybe<Scalars['String']>;
  /** Does not start with the specified string (case-insensitive). */
  notStartsWithInsensitive?: InputMaybe<Scalars['String']>;
  /** Starts with the specified string (case-sensitive). */
  startsWith?: InputMaybe<Scalars['String']>;
  /** Starts with the specified string (case-insensitive). */
  startsWithInsensitive?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against String List fields. All fields are combined with a logical ‘and.’ */
export type StringListFilter = {
  /** Any array item is equal to the specified value. */
  anyEqualTo?: InputMaybe<Scalars['String']>;
  /** Any array item is greater than the specified value. */
  anyGreaterThan?: InputMaybe<Scalars['String']>;
  /** Any array item is greater than or equal to the specified value. */
  anyGreaterThanOrEqualTo?: InputMaybe<Scalars['String']>;
  /** Any array item is less than the specified value. */
  anyLessThan?: InputMaybe<Scalars['String']>;
  /** Any array item is less than or equal to the specified value. */
  anyLessThanOrEqualTo?: InputMaybe<Scalars['String']>;
  /** Any array item is not equal to the specified value. */
  anyNotEqualTo?: InputMaybe<Scalars['String']>;
  /** Contained by the specified list of values. */
  containedBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Contains the specified list of values. */
  contains?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Overlaps the specified list of values. */
  overlaps?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Tag = Node & {
  __typename?: 'Tag';
  attachment?: Maybe<Scalars['String']>;
  content: Scalars['String'];
  created: Scalars['Datetime'];
  guildId: Scalars['BigInt'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  ownerId: Scalars['BigInt'];
  tagName: Scalars['String'];
  useCount: Scalars['BigInt'];
};

export type TagAggregates = {
  __typename?: 'TagAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<TagAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<TagDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<TagMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<TagMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<TagStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<TagStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<TagSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<TagVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<TagVarianceSampleAggregates>;
};

export type TagAverageAggregates = {
  __typename?: 'TagAverageAggregates';
  /** Mean average of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Mean average of ownerId across the matching connection */
  ownerId?: Maybe<Scalars['BigFloat']>;
  /** Mean average of useCount across the matching connection */
  useCount?: Maybe<Scalars['BigFloat']>;
};

/** A condition to be used against `Tag` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type TagCondition = {
  /** Checks for equality with the object’s `attachment` field. */
  attachment?: InputMaybe<Scalars['String']>;
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

export type TagDistinctCountAggregates = {
  __typename?: 'TagDistinctCountAggregates';
  /** Distinct count of attachment across the matching connection */
  attachment?: Maybe<Scalars['BigInt']>;
  /** Distinct count of content across the matching connection */
  content?: Maybe<Scalars['BigInt']>;
  /** Distinct count of created across the matching connection */
  created?: Maybe<Scalars['BigInt']>;
  /** Distinct count of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Distinct count of ownerId across the matching connection */
  ownerId?: Maybe<Scalars['BigInt']>;
  /** Distinct count of tagName across the matching connection */
  tagName?: Maybe<Scalars['BigInt']>;
  /** Distinct count of useCount across the matching connection */
  useCount?: Maybe<Scalars['BigInt']>;
};

/** A filter to be used against `Tag` object types. All fields are combined with a logical ‘and.’ */
export type TagFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TagFilter>>;
  /** Filter by the object’s `attachment` field. */
  attachment?: InputMaybe<StringFilter>;
  /** Filter by the object’s `content` field. */
  content?: InputMaybe<StringFilter>;
  /** Filter by the object’s `created` field. */
  created?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `guildId` field. */
  guildId?: InputMaybe<BigIntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<TagFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TagFilter>>;
  /** Filter by the object’s `ownerId` field. */
  ownerId?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `tagName` field. */
  tagName?: InputMaybe<StringFilter>;
  /** Filter by the object’s `useCount` field. */
  useCount?: InputMaybe<BigIntFilter>;
};

/** An input for mutations affecting `Tag` */
export type TagInput = {
  attachment?: InputMaybe<Scalars['String']>;
  content: Scalars['String'];
  created: Scalars['Datetime'];
  guildId: Scalars['BigInt'];
  ownerId: Scalars['BigInt'];
  tagName: Scalars['String'];
  useCount: Scalars['BigInt'];
};

export type TagMaxAggregates = {
  __typename?: 'TagMaxAggregates';
  /** Maximum of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Maximum of ownerId across the matching connection */
  ownerId?: Maybe<Scalars['BigInt']>;
  /** Maximum of useCount across the matching connection */
  useCount?: Maybe<Scalars['BigInt']>;
};

export type TagMinAggregates = {
  __typename?: 'TagMinAggregates';
  /** Minimum of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Minimum of ownerId across the matching connection */
  ownerId?: Maybe<Scalars['BigInt']>;
  /** Minimum of useCount across the matching connection */
  useCount?: Maybe<Scalars['BigInt']>;
};

/** Represents an update to a `Tag`. Fields that are set will be updated. */
export type TagPatch = {
  attachment?: InputMaybe<Scalars['String']>;
  content?: InputMaybe<Scalars['String']>;
  created?: InputMaybe<Scalars['Datetime']>;
  guildId?: InputMaybe<Scalars['BigInt']>;
  ownerId?: InputMaybe<Scalars['BigInt']>;
  tagName?: InputMaybe<Scalars['String']>;
  useCount?: InputMaybe<Scalars['BigInt']>;
};

export type TagStddevPopulationAggregates = {
  __typename?: 'TagStddevPopulationAggregates';
  /** Population standard deviation of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of ownerId across the matching connection */
  ownerId?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of useCount across the matching connection */
  useCount?: Maybe<Scalars['BigFloat']>;
};

export type TagStddevSampleAggregates = {
  __typename?: 'TagStddevSampleAggregates';
  /** Sample standard deviation of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of ownerId across the matching connection */
  ownerId?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of useCount across the matching connection */
  useCount?: Maybe<Scalars['BigFloat']>;
};

export type TagSumAggregates = {
  __typename?: 'TagSumAggregates';
  /** Sum of guildId across the matching connection */
  guildId: Scalars['BigFloat'];
  /** Sum of ownerId across the matching connection */
  ownerId: Scalars['BigFloat'];
  /** Sum of useCount across the matching connection */
  useCount: Scalars['BigFloat'];
};

export type TagVariancePopulationAggregates = {
  __typename?: 'TagVariancePopulationAggregates';
  /** Population variance of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Population variance of ownerId across the matching connection */
  ownerId?: Maybe<Scalars['BigFloat']>;
  /** Population variance of useCount across the matching connection */
  useCount?: Maybe<Scalars['BigFloat']>;
};

export type TagVarianceSampleAggregates = {
  __typename?: 'TagVarianceSampleAggregates';
  /** Sample variance of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of ownerId across the matching connection */
  ownerId?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of useCount across the matching connection */
  useCount?: Maybe<Scalars['BigFloat']>;
};

/** A connection to a list of `Tag` values. */
export type TagsConnection = {
  __typename?: 'TagsConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TagAggregates>;
  /** A list of edges which contains the `Tag` and cursor to aid in pagination. */
  edges: Array<TagsEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<TagAggregates>>;
  /** A list of `Tag` objects. */
  nodes: Array<Tag>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Tag` you could get from the connection. */
  totalCount: Scalars['Int'];
};


/** A connection to a list of `Tag` values. */
export type TagsConnectionGroupedAggregatesArgs = {
  groupBy: Array<TagsGroupBy>;
  having?: InputMaybe<TagsHavingInput>;
};

/** A `Tag` edge in the connection. */
export type TagsEdge = {
  __typename?: 'TagsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Tag` at the end of the edge. */
  node: Tag;
};

/** Grouping methods for `Tag` for usage during aggregation. */
export enum TagsGroupBy {
  Attachment = 'ATTACHMENT',
  Content = 'CONTENT',
  Created = 'CREATED',
  CreatedTruncatedToDay = 'CREATED_TRUNCATED_TO_DAY',
  CreatedTruncatedToHour = 'CREATED_TRUNCATED_TO_HOUR',
  GuildId = 'GUILD_ID',
  OwnerId = 'OWNER_ID',
  TagName = 'TAG_NAME',
  UseCount = 'USE_COUNT'
}

export type TagsHavingAverageInput = {
  created?: InputMaybe<HavingDatetimeFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  ownerId?: InputMaybe<HavingBigintFilter>;
  useCount?: InputMaybe<HavingBigintFilter>;
};

export type TagsHavingDistinctCountInput = {
  created?: InputMaybe<HavingDatetimeFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  ownerId?: InputMaybe<HavingBigintFilter>;
  useCount?: InputMaybe<HavingBigintFilter>;
};

/** Conditions for `Tag` aggregates. */
export type TagsHavingInput = {
  AND?: InputMaybe<Array<TagsHavingInput>>;
  OR?: InputMaybe<Array<TagsHavingInput>>;
  average?: InputMaybe<TagsHavingAverageInput>;
  distinctCount?: InputMaybe<TagsHavingDistinctCountInput>;
  max?: InputMaybe<TagsHavingMaxInput>;
  min?: InputMaybe<TagsHavingMinInput>;
  stddevPopulation?: InputMaybe<TagsHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<TagsHavingStddevSampleInput>;
  sum?: InputMaybe<TagsHavingSumInput>;
  variancePopulation?: InputMaybe<TagsHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<TagsHavingVarianceSampleInput>;
};

export type TagsHavingMaxInput = {
  created?: InputMaybe<HavingDatetimeFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  ownerId?: InputMaybe<HavingBigintFilter>;
  useCount?: InputMaybe<HavingBigintFilter>;
};

export type TagsHavingMinInput = {
  created?: InputMaybe<HavingDatetimeFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  ownerId?: InputMaybe<HavingBigintFilter>;
  useCount?: InputMaybe<HavingBigintFilter>;
};

export type TagsHavingStddevPopulationInput = {
  created?: InputMaybe<HavingDatetimeFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  ownerId?: InputMaybe<HavingBigintFilter>;
  useCount?: InputMaybe<HavingBigintFilter>;
};

export type TagsHavingStddevSampleInput = {
  created?: InputMaybe<HavingDatetimeFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  ownerId?: InputMaybe<HavingBigintFilter>;
  useCount?: InputMaybe<HavingBigintFilter>;
};

export type TagsHavingSumInput = {
  created?: InputMaybe<HavingDatetimeFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  ownerId?: InputMaybe<HavingBigintFilter>;
  useCount?: InputMaybe<HavingBigintFilter>;
};

export type TagsHavingVariancePopulationInput = {
  created?: InputMaybe<HavingDatetimeFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  ownerId?: InputMaybe<HavingBigintFilter>;
  useCount?: InputMaybe<HavingBigintFilter>;
};

export type TagsHavingVarianceSampleInput = {
  created?: InputMaybe<HavingDatetimeFilter>;
  guildId?: InputMaybe<HavingBigintFilter>;
  ownerId?: InputMaybe<HavingBigintFilter>;
  useCount?: InputMaybe<HavingBigintFilter>;
};

/** Methods to use when ordering `Tag`. */
export enum TagsOrderBy {
  AttachmentAsc = 'ATTACHMENT_ASC',
  AttachmentDesc = 'ATTACHMENT_DESC',
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

/** A filter to be used against `TimeframeUserLevelsRecord` object types. All fields are combined with a logical ‘and.’ */
export type TimeframeUserLevelsRecordFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TimeframeUserLevelsRecordFilter>>;
  /** Filter by the object’s `avatarUrl` field. */
  avatarUrl?: InputMaybe<StringFilter>;
  /** Filter by the object’s `currentLevel` field. */
  currentLevel?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `discriminator` field. */
  discriminator?: InputMaybe<IntFilter>;
  /** Filter by the object’s `gainedLevels` field. */
  gainedLevels?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `nextLevelXpProgress` field. */
  nextLevelXpProgress?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `nextLevelXpRequired` field. */
  nextLevelXpRequired?: InputMaybe<BigIntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<TimeframeUserLevelsRecordFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TimeframeUserLevelsRecordFilter>>;
  /** Filter by the object’s `userId` field. */
  userId?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `username` field. */
  username?: InputMaybe<StringFilter>;
  /** Filter by the object’s `xp` field. */
  xp?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `xpDiff` field. */
  xpDiff?: InputMaybe<BigIntFilter>;
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

/** All input for the `updateRoleMenuByGuildIdAndMenuName` mutation. */
export type UpdateRoleMenuByGuildIdAndMenuNameInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  guildId: Scalars['BigInt'];
  menuName: Scalars['String'];
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

export type UserAggregates = {
  __typename?: 'UserAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<UserAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<UserDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<UserMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<UserMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<UserStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<UserStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<UserSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<UserVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<UserVarianceSampleAggregates>;
};

export type UserAverageAggregates = {
  __typename?: 'UserAverageAggregates';
  /** Mean average of fishies across the matching connection */
  fishies?: Maybe<Scalars['BigFloat']>;
  /** Mean average of id across the matching connection */
  id?: Maybe<Scalars['BigFloat']>;
  /** Mean average of rep across the matching connection */
  rep?: Maybe<Scalars['BigFloat']>;
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

export type UserDistinctCountAggregates = {
  __typename?: 'UserDistinctCountAggregates';
  /** Distinct count of fishies across the matching connection */
  fishies?: Maybe<Scalars['BigInt']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']>;
  /** Distinct count of isPatron across the matching connection */
  isPatron?: Maybe<Scalars['BigInt']>;
  /** Distinct count of lastFishies across the matching connection */
  lastFishies?: Maybe<Scalars['BigInt']>;
  /** Distinct count of lastRep across the matching connection */
  lastRep?: Maybe<Scalars['BigInt']>;
  /** Distinct count of lastfmUsername across the matching connection */
  lastfmUsername?: Maybe<Scalars['BigInt']>;
  /** Distinct count of patronEmoji across the matching connection */
  patronEmoji?: Maybe<Scalars['BigInt']>;
  /** Distinct count of profileData across the matching connection */
  profileData?: Maybe<Scalars['BigInt']>;
  /** Distinct count of rep across the matching connection */
  rep?: Maybe<Scalars['BigInt']>;
};

/** A filter to be used against `User` object types. All fields are combined with a logical ‘and.’ */
export type UserFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<UserFilter>>;
  /** Filter by the object’s `fishies` field. */
  fishies?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `isPatron` field. */
  isPatron?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `lastFishies` field. */
  lastFishies?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `lastRep` field. */
  lastRep?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `lastfmUsername` field. */
  lastfmUsername?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<UserFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<UserFilter>>;
  /** Filter by the object’s `patronEmoji` field. */
  patronEmoji?: InputMaybe<StringFilter>;
  /** Filter by the object’s `profileData` field. */
  profileData?: InputMaybe<JsonFilter>;
  /** Filter by the object’s `rep` field. */
  rep?: InputMaybe<BigIntFilter>;
};

export type UserGuildRankResult = {
  __typename?: 'UserGuildRankResult';
  guildId?: Maybe<Scalars['BigInt']>;
  lastMsg?: Maybe<Scalars['Datetime']>;
  msgAllTime?: Maybe<Scalars['BigInt']>;
  msgAllTimeRank?: Maybe<Scalars['BigInt']>;
  msgAllTimeTotal?: Maybe<Scalars['BigInt']>;
  msgDay?: Maybe<Scalars['BigInt']>;
  msgDayRank?: Maybe<Scalars['BigInt']>;
  msgDayTotal?: Maybe<Scalars['BigInt']>;
  msgMonth?: Maybe<Scalars['BigInt']>;
  msgMonthRank?: Maybe<Scalars['BigInt']>;
  msgMonthTotal?: Maybe<Scalars['BigInt']>;
  msgWeek?: Maybe<Scalars['BigInt']>;
  msgWeekRank?: Maybe<Scalars['BigInt']>;
  msgWeekTotal?: Maybe<Scalars['BigInt']>;
  userId?: Maybe<Scalars['BigInt']>;
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

export type UserLevelAggregates = {
  __typename?: 'UserLevelAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<UserLevelAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<UserLevelDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<UserLevelMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<UserLevelMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<UserLevelStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<UserLevelStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<UserLevelSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<UserLevelVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<UserLevelVarianceSampleAggregates>;
};

export type UserLevelAverageAggregates = {
  __typename?: 'UserLevelAverageAggregates';
  /** Mean average of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Mean average of msgAllTime across the matching connection */
  msgAllTime?: Maybe<Scalars['BigFloat']>;
  /** Mean average of msgDay across the matching connection */
  msgDay?: Maybe<Scalars['BigFloat']>;
  /** Mean average of msgMonth across the matching connection */
  msgMonth?: Maybe<Scalars['BigFloat']>;
  /** Mean average of msgWeek across the matching connection */
  msgWeek?: Maybe<Scalars['BigFloat']>;
  /** Mean average of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

/**
 * A condition to be used against `UserLevel` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type UserLevelCondition = {
  /** Checks for equality with the object’s `guildId` field. */
  guildId?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `lastMsg` field. */
  lastMsg?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `msgAllTime` field. */
  msgAllTime?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `msgDay` field. */
  msgDay?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `msgMonth` field. */
  msgMonth?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `msgWeek` field. */
  msgWeek?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['BigInt']>;
};

export type UserLevelDistinctCountAggregates = {
  __typename?: 'UserLevelDistinctCountAggregates';
  /** Distinct count of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Distinct count of lastMsg across the matching connection */
  lastMsg?: Maybe<Scalars['BigInt']>;
  /** Distinct count of msgAllTime across the matching connection */
  msgAllTime?: Maybe<Scalars['BigInt']>;
  /** Distinct count of msgDay across the matching connection */
  msgDay?: Maybe<Scalars['BigInt']>;
  /** Distinct count of msgMonth across the matching connection */
  msgMonth?: Maybe<Scalars['BigInt']>;
  /** Distinct count of msgWeek across the matching connection */
  msgWeek?: Maybe<Scalars['BigInt']>;
  /** Distinct count of userId across the matching connection */
  userId?: Maybe<Scalars['BigInt']>;
};

/** A filter to be used against `UserLevel` object types. All fields are combined with a logical ‘and.’ */
export type UserLevelFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<UserLevelFilter>>;
  /** Filter by the object’s `guildId` field. */
  guildId?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `lastMsg` field. */
  lastMsg?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `msgAllTime` field. */
  msgAllTime?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `msgDay` field. */
  msgDay?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `msgMonth` field. */
  msgMonth?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `msgWeek` field. */
  msgWeek?: InputMaybe<BigIntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<UserLevelFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<UserLevelFilter>>;
  /** Filter by the object’s `userId` field. */
  userId?: InputMaybe<BigIntFilter>;
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

export type UserLevelMaxAggregates = {
  __typename?: 'UserLevelMaxAggregates';
  /** Maximum of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Maximum of msgAllTime across the matching connection */
  msgAllTime?: Maybe<Scalars['BigInt']>;
  /** Maximum of msgDay across the matching connection */
  msgDay?: Maybe<Scalars['BigInt']>;
  /** Maximum of msgMonth across the matching connection */
  msgMonth?: Maybe<Scalars['BigInt']>;
  /** Maximum of msgWeek across the matching connection */
  msgWeek?: Maybe<Scalars['BigInt']>;
  /** Maximum of userId across the matching connection */
  userId?: Maybe<Scalars['BigInt']>;
};

export type UserLevelMinAggregates = {
  __typename?: 'UserLevelMinAggregates';
  /** Minimum of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Minimum of msgAllTime across the matching connection */
  msgAllTime?: Maybe<Scalars['BigInt']>;
  /** Minimum of msgDay across the matching connection */
  msgDay?: Maybe<Scalars['BigInt']>;
  /** Minimum of msgMonth across the matching connection */
  msgMonth?: Maybe<Scalars['BigInt']>;
  /** Minimum of msgWeek across the matching connection */
  msgWeek?: Maybe<Scalars['BigInt']>;
  /** Minimum of userId across the matching connection */
  userId?: Maybe<Scalars['BigInt']>;
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

export type UserLevelStddevPopulationAggregates = {
  __typename?: 'UserLevelStddevPopulationAggregates';
  /** Population standard deviation of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of msgAllTime across the matching connection */
  msgAllTime?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of msgDay across the matching connection */
  msgDay?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of msgMonth across the matching connection */
  msgMonth?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of msgWeek across the matching connection */
  msgWeek?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

export type UserLevelStddevSampleAggregates = {
  __typename?: 'UserLevelStddevSampleAggregates';
  /** Sample standard deviation of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of msgAllTime across the matching connection */
  msgAllTime?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of msgDay across the matching connection */
  msgDay?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of msgMonth across the matching connection */
  msgMonth?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of msgWeek across the matching connection */
  msgWeek?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

export type UserLevelSumAggregates = {
  __typename?: 'UserLevelSumAggregates';
  /** Sum of guildId across the matching connection */
  guildId: Scalars['BigFloat'];
  /** Sum of msgAllTime across the matching connection */
  msgAllTime: Scalars['BigFloat'];
  /** Sum of msgDay across the matching connection */
  msgDay: Scalars['BigFloat'];
  /** Sum of msgMonth across the matching connection */
  msgMonth: Scalars['BigFloat'];
  /** Sum of msgWeek across the matching connection */
  msgWeek: Scalars['BigFloat'];
  /** Sum of userId across the matching connection */
  userId: Scalars['BigFloat'];
};

export type UserLevelVariancePopulationAggregates = {
  __typename?: 'UserLevelVariancePopulationAggregates';
  /** Population variance of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Population variance of msgAllTime across the matching connection */
  msgAllTime?: Maybe<Scalars['BigFloat']>;
  /** Population variance of msgDay across the matching connection */
  msgDay?: Maybe<Scalars['BigFloat']>;
  /** Population variance of msgMonth across the matching connection */
  msgMonth?: Maybe<Scalars['BigFloat']>;
  /** Population variance of msgWeek across the matching connection */
  msgWeek?: Maybe<Scalars['BigFloat']>;
  /** Population variance of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

export type UserLevelVarianceSampleAggregates = {
  __typename?: 'UserLevelVarianceSampleAggregates';
  /** Sample variance of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of msgAllTime across the matching connection */
  msgAllTime?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of msgDay across the matching connection */
  msgDay?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of msgMonth across the matching connection */
  msgMonth?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of msgWeek across the matching connection */
  msgWeek?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

/** A connection to a list of `UserLevel` values. */
export type UserLevelsConnection = {
  __typename?: 'UserLevelsConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<UserLevelAggregates>;
  /** A list of edges which contains the `UserLevel` and cursor to aid in pagination. */
  edges: Array<UserLevelsEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<UserLevelAggregates>>;
  /** A list of `UserLevel` objects. */
  nodes: Array<UserLevel>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `UserLevel` you could get from the connection. */
  totalCount: Scalars['Int'];
};


/** A connection to a list of `UserLevel` values. */
export type UserLevelsConnectionGroupedAggregatesArgs = {
  groupBy: Array<UserLevelsGroupBy>;
  having?: InputMaybe<UserLevelsHavingInput>;
};

/** A `UserLevel` edge in the connection. */
export type UserLevelsEdge = {
  __typename?: 'UserLevelsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `UserLevel` at the end of the edge. */
  node: UserLevel;
};

/** Grouping methods for `UserLevel` for usage during aggregation. */
export enum UserLevelsGroupBy {
  GuildId = 'GUILD_ID',
  LastMsg = 'LAST_MSG',
  LastMsgTruncatedToDay = 'LAST_MSG_TRUNCATED_TO_DAY',
  LastMsgTruncatedToHour = 'LAST_MSG_TRUNCATED_TO_HOUR',
  MsgAllTime = 'MSG_ALL_TIME',
  MsgDay = 'MSG_DAY',
  MsgMonth = 'MSG_MONTH',
  MsgWeek = 'MSG_WEEK',
  UserId = 'USER_ID'
}

export type UserLevelsHavingAverageInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  lastMsg?: InputMaybe<HavingDatetimeFilter>;
  msgAllTime?: InputMaybe<HavingBigintFilter>;
  msgDay?: InputMaybe<HavingBigintFilter>;
  msgMonth?: InputMaybe<HavingBigintFilter>;
  msgWeek?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type UserLevelsHavingDistinctCountInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  lastMsg?: InputMaybe<HavingDatetimeFilter>;
  msgAllTime?: InputMaybe<HavingBigintFilter>;
  msgDay?: InputMaybe<HavingBigintFilter>;
  msgMonth?: InputMaybe<HavingBigintFilter>;
  msgWeek?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

/** Conditions for `UserLevel` aggregates. */
export type UserLevelsHavingInput = {
  AND?: InputMaybe<Array<UserLevelsHavingInput>>;
  OR?: InputMaybe<Array<UserLevelsHavingInput>>;
  average?: InputMaybe<UserLevelsHavingAverageInput>;
  distinctCount?: InputMaybe<UserLevelsHavingDistinctCountInput>;
  max?: InputMaybe<UserLevelsHavingMaxInput>;
  min?: InputMaybe<UserLevelsHavingMinInput>;
  stddevPopulation?: InputMaybe<UserLevelsHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<UserLevelsHavingStddevSampleInput>;
  sum?: InputMaybe<UserLevelsHavingSumInput>;
  variancePopulation?: InputMaybe<UserLevelsHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<UserLevelsHavingVarianceSampleInput>;
};

export type UserLevelsHavingMaxInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  lastMsg?: InputMaybe<HavingDatetimeFilter>;
  msgAllTime?: InputMaybe<HavingBigintFilter>;
  msgDay?: InputMaybe<HavingBigintFilter>;
  msgMonth?: InputMaybe<HavingBigintFilter>;
  msgWeek?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type UserLevelsHavingMinInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  lastMsg?: InputMaybe<HavingDatetimeFilter>;
  msgAllTime?: InputMaybe<HavingBigintFilter>;
  msgDay?: InputMaybe<HavingBigintFilter>;
  msgMonth?: InputMaybe<HavingBigintFilter>;
  msgWeek?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type UserLevelsHavingStddevPopulationInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  lastMsg?: InputMaybe<HavingDatetimeFilter>;
  msgAllTime?: InputMaybe<HavingBigintFilter>;
  msgDay?: InputMaybe<HavingBigintFilter>;
  msgMonth?: InputMaybe<HavingBigintFilter>;
  msgWeek?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type UserLevelsHavingStddevSampleInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  lastMsg?: InputMaybe<HavingDatetimeFilter>;
  msgAllTime?: InputMaybe<HavingBigintFilter>;
  msgDay?: InputMaybe<HavingBigintFilter>;
  msgMonth?: InputMaybe<HavingBigintFilter>;
  msgWeek?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type UserLevelsHavingSumInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  lastMsg?: InputMaybe<HavingDatetimeFilter>;
  msgAllTime?: InputMaybe<HavingBigintFilter>;
  msgDay?: InputMaybe<HavingBigintFilter>;
  msgMonth?: InputMaybe<HavingBigintFilter>;
  msgWeek?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type UserLevelsHavingVariancePopulationInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  lastMsg?: InputMaybe<HavingDatetimeFilter>;
  msgAllTime?: InputMaybe<HavingBigintFilter>;
  msgDay?: InputMaybe<HavingBigintFilter>;
  msgMonth?: InputMaybe<HavingBigintFilter>;
  msgWeek?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type UserLevelsHavingVarianceSampleInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  lastMsg?: InputMaybe<HavingDatetimeFilter>;
  msgAllTime?: InputMaybe<HavingBigintFilter>;
  msgDay?: InputMaybe<HavingBigintFilter>;
  msgMonth?: InputMaybe<HavingBigintFilter>;
  msgWeek?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
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

export type UserMaxAggregates = {
  __typename?: 'UserMaxAggregates';
  /** Maximum of fishies across the matching connection */
  fishies?: Maybe<Scalars['BigInt']>;
  /** Maximum of id across the matching connection */
  id?: Maybe<Scalars['BigInt']>;
  /** Maximum of rep across the matching connection */
  rep?: Maybe<Scalars['BigInt']>;
};

export type UserMinAggregates = {
  __typename?: 'UserMinAggregates';
  /** Minimum of fishies across the matching connection */
  fishies?: Maybe<Scalars['BigInt']>;
  /** Minimum of id across the matching connection */
  id?: Maybe<Scalars['BigInt']>;
  /** Minimum of rep across the matching connection */
  rep?: Maybe<Scalars['BigInt']>;
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

export type UserStddevPopulationAggregates = {
  __typename?: 'UserStddevPopulationAggregates';
  /** Population standard deviation of fishies across the matching connection */
  fishies?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of id across the matching connection */
  id?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of rep across the matching connection */
  rep?: Maybe<Scalars['BigFloat']>;
};

export type UserStddevSampleAggregates = {
  __typename?: 'UserStddevSampleAggregates';
  /** Sample standard deviation of fishies across the matching connection */
  fishies?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of id across the matching connection */
  id?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of rep across the matching connection */
  rep?: Maybe<Scalars['BigFloat']>;
};

export type UserSumAggregates = {
  __typename?: 'UserSumAggregates';
  /** Sum of fishies across the matching connection */
  fishies: Scalars['BigFloat'];
  /** Sum of id across the matching connection */
  id: Scalars['BigFloat'];
  /** Sum of rep across the matching connection */
  rep: Scalars['BigFloat'];
};

export type UserVariancePopulationAggregates = {
  __typename?: 'UserVariancePopulationAggregates';
  /** Population variance of fishies across the matching connection */
  fishies?: Maybe<Scalars['BigFloat']>;
  /** Population variance of id across the matching connection */
  id?: Maybe<Scalars['BigFloat']>;
  /** Population variance of rep across the matching connection */
  rep?: Maybe<Scalars['BigFloat']>;
};

export type UserVarianceSampleAggregates = {
  __typename?: 'UserVarianceSampleAggregates';
  /** Sample variance of fishies across the matching connection */
  fishies?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of id across the matching connection */
  id?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of rep across the matching connection */
  rep?: Maybe<Scalars['BigFloat']>;
};

/** A connection to a list of `User` values. */
export type UsersConnection = {
  __typename?: 'UsersConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<UserAggregates>;
  /** A list of edges which contains the `User` and cursor to aid in pagination. */
  edges: Array<UsersEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<UserAggregates>>;
  /** A list of `User` objects. */
  nodes: Array<User>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `User` you could get from the connection. */
  totalCount: Scalars['Int'];
};


/** A connection to a list of `User` values. */
export type UsersConnectionGroupedAggregatesArgs = {
  groupBy: Array<UsersGroupBy>;
  having?: InputMaybe<UsersHavingInput>;
};

/** A `User` edge in the connection. */
export type UsersEdge = {
  __typename?: 'UsersEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `User` at the end of the edge. */
  node: User;
};

/** Grouping methods for `User` for usage during aggregation. */
export enum UsersGroupBy {
  Fishies = 'FISHIES',
  IsPatron = 'IS_PATRON',
  LastfmUsername = 'LASTFM_USERNAME',
  LastFishies = 'LAST_FISHIES',
  LastFishiesTruncatedToDay = 'LAST_FISHIES_TRUNCATED_TO_DAY',
  LastFishiesTruncatedToHour = 'LAST_FISHIES_TRUNCATED_TO_HOUR',
  LastRep = 'LAST_REP',
  LastRepTruncatedToDay = 'LAST_REP_TRUNCATED_TO_DAY',
  LastRepTruncatedToHour = 'LAST_REP_TRUNCATED_TO_HOUR',
  PatronEmoji = 'PATRON_EMOJI',
  ProfileData = 'PROFILE_DATA',
  Rep = 'REP'
}

export type UsersHavingAverageInput = {
  fishies?: InputMaybe<HavingBigintFilter>;
  id?: InputMaybe<HavingBigintFilter>;
  lastFishies?: InputMaybe<HavingDatetimeFilter>;
  lastRep?: InputMaybe<HavingDatetimeFilter>;
  rep?: InputMaybe<HavingBigintFilter>;
};

export type UsersHavingDistinctCountInput = {
  fishies?: InputMaybe<HavingBigintFilter>;
  id?: InputMaybe<HavingBigintFilter>;
  lastFishies?: InputMaybe<HavingDatetimeFilter>;
  lastRep?: InputMaybe<HavingDatetimeFilter>;
  rep?: InputMaybe<HavingBigintFilter>;
};

/** Conditions for `User` aggregates. */
export type UsersHavingInput = {
  AND?: InputMaybe<Array<UsersHavingInput>>;
  OR?: InputMaybe<Array<UsersHavingInput>>;
  average?: InputMaybe<UsersHavingAverageInput>;
  distinctCount?: InputMaybe<UsersHavingDistinctCountInput>;
  max?: InputMaybe<UsersHavingMaxInput>;
  min?: InputMaybe<UsersHavingMinInput>;
  stddevPopulation?: InputMaybe<UsersHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<UsersHavingStddevSampleInput>;
  sum?: InputMaybe<UsersHavingSumInput>;
  variancePopulation?: InputMaybe<UsersHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<UsersHavingVarianceSampleInput>;
};

export type UsersHavingMaxInput = {
  fishies?: InputMaybe<HavingBigintFilter>;
  id?: InputMaybe<HavingBigintFilter>;
  lastFishies?: InputMaybe<HavingDatetimeFilter>;
  lastRep?: InputMaybe<HavingDatetimeFilter>;
  rep?: InputMaybe<HavingBigintFilter>;
};

export type UsersHavingMinInput = {
  fishies?: InputMaybe<HavingBigintFilter>;
  id?: InputMaybe<HavingBigintFilter>;
  lastFishies?: InputMaybe<HavingDatetimeFilter>;
  lastRep?: InputMaybe<HavingDatetimeFilter>;
  rep?: InputMaybe<HavingBigintFilter>;
};

export type UsersHavingStddevPopulationInput = {
  fishies?: InputMaybe<HavingBigintFilter>;
  id?: InputMaybe<HavingBigintFilter>;
  lastFishies?: InputMaybe<HavingDatetimeFilter>;
  lastRep?: InputMaybe<HavingDatetimeFilter>;
  rep?: InputMaybe<HavingBigintFilter>;
};

export type UsersHavingStddevSampleInput = {
  fishies?: InputMaybe<HavingBigintFilter>;
  id?: InputMaybe<HavingBigintFilter>;
  lastFishies?: InputMaybe<HavingDatetimeFilter>;
  lastRep?: InputMaybe<HavingDatetimeFilter>;
  rep?: InputMaybe<HavingBigintFilter>;
};

export type UsersHavingSumInput = {
  fishies?: InputMaybe<HavingBigintFilter>;
  id?: InputMaybe<HavingBigintFilter>;
  lastFishies?: InputMaybe<HavingDatetimeFilter>;
  lastRep?: InputMaybe<HavingDatetimeFilter>;
  rep?: InputMaybe<HavingBigintFilter>;
};

export type UsersHavingVariancePopulationInput = {
  fishies?: InputMaybe<HavingBigintFilter>;
  id?: InputMaybe<HavingBigintFilter>;
  lastFishies?: InputMaybe<HavingDatetimeFilter>;
  lastRep?: InputMaybe<HavingDatetimeFilter>;
  rep?: InputMaybe<HavingBigintFilter>;
};

export type UsersHavingVarianceSampleInput = {
  fishies?: InputMaybe<HavingBigintFilter>;
  id?: InputMaybe<HavingBigintFilter>;
  lastFishies?: InputMaybe<HavingDatetimeFilter>;
  lastRep?: InputMaybe<HavingDatetimeFilter>;
  rep?: InputMaybe<HavingBigintFilter>;
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
  filter?: InputMaybe<WebUserGuildFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<WebUserGuildsOrderBy>>;
};

export type WebUserAggregates = {
  __typename?: 'WebUserAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<WebUserAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<WebUserDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<WebUserMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<WebUserMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<WebUserStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<WebUserStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<WebUserSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<WebUserVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<WebUserVarianceSampleAggregates>;
};

export type WebUserAverageAggregates = {
  __typename?: 'WebUserAverageAggregates';
  /** Mean average of discriminator across the matching connection */
  discriminator?: Maybe<Scalars['BigFloat']>;
  /** Mean average of id across the matching connection */
  id?: Maybe<Scalars['BigFloat']>;
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

export type WebUserDistinctCountAggregates = {
  __typename?: 'WebUserDistinctCountAggregates';
  /** Distinct count of avatar across the matching connection */
  avatar?: Maybe<Scalars['BigInt']>;
  /** Distinct count of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigInt']>;
  /** Distinct count of details across the matching connection */
  details?: Maybe<Scalars['BigInt']>;
  /** Distinct count of discriminator across the matching connection */
  discriminator?: Maybe<Scalars['BigInt']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']>;
  /** Distinct count of isAdmin across the matching connection */
  isAdmin?: Maybe<Scalars['BigInt']>;
  /** Distinct count of updatedAt across the matching connection */
  updatedAt?: Maybe<Scalars['BigInt']>;
  /** Distinct count of username across the matching connection */
  username?: Maybe<Scalars['BigInt']>;
};

/** A filter to be used against `WebUser` object types. All fields are combined with a logical ‘and.’ */
export type WebUserFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<WebUserFilter>>;
  /** Filter by the object’s `avatar` field. */
  avatar?: InputMaybe<StringFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `details` field. */
  details?: InputMaybe<JsonFilter>;
  /** Filter by the object’s `discriminator` field. */
  discriminator?: InputMaybe<IntFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `isAdmin` field. */
  isAdmin?: InputMaybe<BooleanFilter>;
  /** Negates the expression. */
  not?: InputMaybe<WebUserFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<WebUserFilter>>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `username` field. */
  username?: InputMaybe<StringFilter>;
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

export type WebUserGuildAggregates = {
  __typename?: 'WebUserGuildAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<WebUserGuildAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<WebUserGuildDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<WebUserGuildMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<WebUserGuildMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<WebUserGuildStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<WebUserGuildStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<WebUserGuildSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<WebUserGuildVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<WebUserGuildVarianceSampleAggregates>;
};

export type WebUserGuildAverageAggregates = {
  __typename?: 'WebUserGuildAverageAggregates';
  /** Mean average of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Mean average of permissions across the matching connection */
  permissions?: Maybe<Scalars['BigFloat']>;
  /** Mean average of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
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

export type WebUserGuildDistinctCountAggregates = {
  __typename?: 'WebUserGuildDistinctCountAggregates';
  /** Distinct count of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Distinct count of manageGuild across the matching connection */
  manageGuild?: Maybe<Scalars['BigInt']>;
  /** Distinct count of owner across the matching connection */
  owner?: Maybe<Scalars['BigInt']>;
  /** Distinct count of permissions across the matching connection */
  permissions?: Maybe<Scalars['BigInt']>;
  /** Distinct count of userId across the matching connection */
  userId?: Maybe<Scalars['BigInt']>;
};

/** A filter to be used against `WebUserGuild` object types. All fields are combined with a logical ‘and.’ */
export type WebUserGuildFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<WebUserGuildFilter>>;
  /** Filter by the object’s `guildId` field. */
  guildId?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `manageGuild` field. */
  manageGuild?: InputMaybe<BooleanFilter>;
  /** Negates the expression. */
  not?: InputMaybe<WebUserGuildFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<WebUserGuildFilter>>;
  /** Filter by the object’s `owner` field. */
  owner?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `permissions` field. */
  permissions?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `userId` field. */
  userId?: InputMaybe<BigIntFilter>;
};

/** An input for mutations affecting `WebUserGuild` */
export type WebUserGuildInput = {
  guildId: Scalars['BigInt'];
  manageGuild?: InputMaybe<Scalars['Boolean']>;
  owner: Scalars['Boolean'];
  permissions: Scalars['BigInt'];
  userId: Scalars['BigInt'];
};

export type WebUserGuildMaxAggregates = {
  __typename?: 'WebUserGuildMaxAggregates';
  /** Maximum of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Maximum of permissions across the matching connection */
  permissions?: Maybe<Scalars['BigInt']>;
  /** Maximum of userId across the matching connection */
  userId?: Maybe<Scalars['BigInt']>;
};

export type WebUserGuildMinAggregates = {
  __typename?: 'WebUserGuildMinAggregates';
  /** Minimum of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigInt']>;
  /** Minimum of permissions across the matching connection */
  permissions?: Maybe<Scalars['BigInt']>;
  /** Minimum of userId across the matching connection */
  userId?: Maybe<Scalars['BigInt']>;
};

/** Represents an update to a `WebUserGuild`. Fields that are set will be updated. */
export type WebUserGuildPatch = {
  guildId?: InputMaybe<Scalars['BigInt']>;
  manageGuild?: InputMaybe<Scalars['Boolean']>;
  owner?: InputMaybe<Scalars['Boolean']>;
  permissions?: InputMaybe<Scalars['BigInt']>;
  userId?: InputMaybe<Scalars['BigInt']>;
};

export type WebUserGuildStddevPopulationAggregates = {
  __typename?: 'WebUserGuildStddevPopulationAggregates';
  /** Population standard deviation of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of permissions across the matching connection */
  permissions?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

export type WebUserGuildStddevSampleAggregates = {
  __typename?: 'WebUserGuildStddevSampleAggregates';
  /** Sample standard deviation of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of permissions across the matching connection */
  permissions?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

export type WebUserGuildSumAggregates = {
  __typename?: 'WebUserGuildSumAggregates';
  /** Sum of guildId across the matching connection */
  guildId: Scalars['BigFloat'];
  /** Sum of permissions across the matching connection */
  permissions: Scalars['BigFloat'];
  /** Sum of userId across the matching connection */
  userId: Scalars['BigFloat'];
};

export type WebUserGuildVariancePopulationAggregates = {
  __typename?: 'WebUserGuildVariancePopulationAggregates';
  /** Population variance of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Population variance of permissions across the matching connection */
  permissions?: Maybe<Scalars['BigFloat']>;
  /** Population variance of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

export type WebUserGuildVarianceSampleAggregates = {
  __typename?: 'WebUserGuildVarianceSampleAggregates';
  /** Sample variance of guildId across the matching connection */
  guildId?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of permissions across the matching connection */
  permissions?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of userId across the matching connection */
  userId?: Maybe<Scalars['BigFloat']>;
};

/** A connection to a list of `WebUserGuild` values. */
export type WebUserGuildsConnection = {
  __typename?: 'WebUserGuildsConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<WebUserGuildAggregates>;
  /** A list of edges which contains the `WebUserGuild` and cursor to aid in pagination. */
  edges: Array<WebUserGuildsEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<WebUserGuildAggregates>>;
  /** A list of `WebUserGuild` objects. */
  nodes: Array<WebUserGuild>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `WebUserGuild` you could get from the connection. */
  totalCount: Scalars['Int'];
};


/** A connection to a list of `WebUserGuild` values. */
export type WebUserGuildsConnectionGroupedAggregatesArgs = {
  groupBy: Array<WebUserGuildsGroupBy>;
  having?: InputMaybe<WebUserGuildsHavingInput>;
};

/** A `WebUserGuild` edge in the connection. */
export type WebUserGuildsEdge = {
  __typename?: 'WebUserGuildsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `WebUserGuild` at the end of the edge. */
  node: WebUserGuild;
};

/** Grouping methods for `WebUserGuild` for usage during aggregation. */
export enum WebUserGuildsGroupBy {
  GuildId = 'GUILD_ID',
  ManageGuild = 'MANAGE_GUILD',
  Owner = 'OWNER',
  Permissions = 'PERMISSIONS',
  UserId = 'USER_ID'
}

export type WebUserGuildsHavingAverageInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  permissions?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type WebUserGuildsHavingDistinctCountInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  permissions?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

/** Conditions for `WebUserGuild` aggregates. */
export type WebUserGuildsHavingInput = {
  AND?: InputMaybe<Array<WebUserGuildsHavingInput>>;
  OR?: InputMaybe<Array<WebUserGuildsHavingInput>>;
  average?: InputMaybe<WebUserGuildsHavingAverageInput>;
  distinctCount?: InputMaybe<WebUserGuildsHavingDistinctCountInput>;
  max?: InputMaybe<WebUserGuildsHavingMaxInput>;
  min?: InputMaybe<WebUserGuildsHavingMinInput>;
  stddevPopulation?: InputMaybe<WebUserGuildsHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<WebUserGuildsHavingStddevSampleInput>;
  sum?: InputMaybe<WebUserGuildsHavingSumInput>;
  variancePopulation?: InputMaybe<WebUserGuildsHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<WebUserGuildsHavingVarianceSampleInput>;
};

export type WebUserGuildsHavingMaxInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  permissions?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type WebUserGuildsHavingMinInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  permissions?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type WebUserGuildsHavingStddevPopulationInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  permissions?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type WebUserGuildsHavingStddevSampleInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  permissions?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type WebUserGuildsHavingSumInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  permissions?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type WebUserGuildsHavingVariancePopulationInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  permissions?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
};

export type WebUserGuildsHavingVarianceSampleInput = {
  guildId?: InputMaybe<HavingBigintFilter>;
  permissions?: InputMaybe<HavingBigintFilter>;
  userId?: InputMaybe<HavingBigintFilter>;
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

export type WebUserMaxAggregates = {
  __typename?: 'WebUserMaxAggregates';
  /** Maximum of discriminator across the matching connection */
  discriminator?: Maybe<Scalars['Int']>;
  /** Maximum of id across the matching connection */
  id?: Maybe<Scalars['BigInt']>;
};

export type WebUserMinAggregates = {
  __typename?: 'WebUserMinAggregates';
  /** Minimum of discriminator across the matching connection */
  discriminator?: Maybe<Scalars['Int']>;
  /** Minimum of id across the matching connection */
  id?: Maybe<Scalars['BigInt']>;
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

export type WebUserStddevPopulationAggregates = {
  __typename?: 'WebUserStddevPopulationAggregates';
  /** Population standard deviation of discriminator across the matching connection */
  discriminator?: Maybe<Scalars['BigFloat']>;
  /** Population standard deviation of id across the matching connection */
  id?: Maybe<Scalars['BigFloat']>;
};

export type WebUserStddevSampleAggregates = {
  __typename?: 'WebUserStddevSampleAggregates';
  /** Sample standard deviation of discriminator across the matching connection */
  discriminator?: Maybe<Scalars['BigFloat']>;
  /** Sample standard deviation of id across the matching connection */
  id?: Maybe<Scalars['BigFloat']>;
};

export type WebUserSumAggregates = {
  __typename?: 'WebUserSumAggregates';
  /** Sum of discriminator across the matching connection */
  discriminator: Scalars['BigInt'];
  /** Sum of id across the matching connection */
  id: Scalars['BigFloat'];
};

export type WebUserVariancePopulationAggregates = {
  __typename?: 'WebUserVariancePopulationAggregates';
  /** Population variance of discriminator across the matching connection */
  discriminator?: Maybe<Scalars['BigFloat']>;
  /** Population variance of id across the matching connection */
  id?: Maybe<Scalars['BigFloat']>;
};

export type WebUserVarianceSampleAggregates = {
  __typename?: 'WebUserVarianceSampleAggregates';
  /** Sample variance of discriminator across the matching connection */
  discriminator?: Maybe<Scalars['BigFloat']>;
  /** Sample variance of id across the matching connection */
  id?: Maybe<Scalars['BigFloat']>;
};

/** A connection to a list of `WebUser` values. */
export type WebUsersConnection = {
  __typename?: 'WebUsersConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<WebUserAggregates>;
  /** A list of edges which contains the `WebUser` and cursor to aid in pagination. */
  edges: Array<WebUsersEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<WebUserAggregates>>;
  /** A list of `WebUser` objects. */
  nodes: Array<WebUser>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `WebUser` you could get from the connection. */
  totalCount: Scalars['Int'];
};


/** A connection to a list of `WebUser` values. */
export type WebUsersConnectionGroupedAggregatesArgs = {
  groupBy: Array<WebUsersGroupBy>;
  having?: InputMaybe<WebUsersHavingInput>;
};

/** A `WebUser` edge in the connection. */
export type WebUsersEdge = {
  __typename?: 'WebUsersEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `WebUser` at the end of the edge. */
  node: WebUser;
};

/** Grouping methods for `WebUser` for usage during aggregation. */
export enum WebUsersGroupBy {
  Avatar = 'AVATAR',
  CreatedAt = 'CREATED_AT',
  CreatedAtTruncatedToDay = 'CREATED_AT_TRUNCATED_TO_DAY',
  CreatedAtTruncatedToHour = 'CREATED_AT_TRUNCATED_TO_HOUR',
  Details = 'DETAILS',
  Discriminator = 'DISCRIMINATOR',
  IsAdmin = 'IS_ADMIN',
  UpdatedAt = 'UPDATED_AT',
  UpdatedAtTruncatedToDay = 'UPDATED_AT_TRUNCATED_TO_DAY',
  UpdatedAtTruncatedToHour = 'UPDATED_AT_TRUNCATED_TO_HOUR',
  Username = 'USERNAME'
}

export type WebUsersHavingAverageInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  discriminator?: InputMaybe<HavingIntFilter>;
  id?: InputMaybe<HavingBigintFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type WebUsersHavingDistinctCountInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  discriminator?: InputMaybe<HavingIntFilter>;
  id?: InputMaybe<HavingBigintFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

/** Conditions for `WebUser` aggregates. */
export type WebUsersHavingInput = {
  AND?: InputMaybe<Array<WebUsersHavingInput>>;
  OR?: InputMaybe<Array<WebUsersHavingInput>>;
  average?: InputMaybe<WebUsersHavingAverageInput>;
  distinctCount?: InputMaybe<WebUsersHavingDistinctCountInput>;
  max?: InputMaybe<WebUsersHavingMaxInput>;
  min?: InputMaybe<WebUsersHavingMinInput>;
  stddevPopulation?: InputMaybe<WebUsersHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<WebUsersHavingStddevSampleInput>;
  sum?: InputMaybe<WebUsersHavingSumInput>;
  variancePopulation?: InputMaybe<WebUsersHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<WebUsersHavingVarianceSampleInput>;
};

export type WebUsersHavingMaxInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  discriminator?: InputMaybe<HavingIntFilter>;
  id?: InputMaybe<HavingBigintFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type WebUsersHavingMinInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  discriminator?: InputMaybe<HavingIntFilter>;
  id?: InputMaybe<HavingBigintFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type WebUsersHavingStddevPopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  discriminator?: InputMaybe<HavingIntFilter>;
  id?: InputMaybe<HavingBigintFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type WebUsersHavingStddevSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  discriminator?: InputMaybe<HavingIntFilter>;
  id?: InputMaybe<HavingBigintFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type WebUsersHavingSumInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  discriminator?: InputMaybe<HavingIntFilter>;
  id?: InputMaybe<HavingBigintFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type WebUsersHavingVariancePopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  discriminator?: InputMaybe<HavingIntFilter>;
  id?: InputMaybe<HavingBigintFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type WebUsersHavingVarianceSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  discriminator?: InputMaybe<HavingIntFilter>;
  id?: InputMaybe<HavingBigintFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
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
  UsernameDesc = 'USERNAME_DESC',
  WebUserGuildsByUserIdAverageGuildIdAsc = 'WEB_USER_GUILDS_BY_USER_ID_AVERAGE_GUILD_ID_ASC',
  WebUserGuildsByUserIdAverageGuildIdDesc = 'WEB_USER_GUILDS_BY_USER_ID_AVERAGE_GUILD_ID_DESC',
  WebUserGuildsByUserIdAverageManageGuildAsc = 'WEB_USER_GUILDS_BY_USER_ID_AVERAGE_MANAGE_GUILD_ASC',
  WebUserGuildsByUserIdAverageManageGuildDesc = 'WEB_USER_GUILDS_BY_USER_ID_AVERAGE_MANAGE_GUILD_DESC',
  WebUserGuildsByUserIdAverageOwnerAsc = 'WEB_USER_GUILDS_BY_USER_ID_AVERAGE_OWNER_ASC',
  WebUserGuildsByUserIdAverageOwnerDesc = 'WEB_USER_GUILDS_BY_USER_ID_AVERAGE_OWNER_DESC',
  WebUserGuildsByUserIdAveragePermissionsAsc = 'WEB_USER_GUILDS_BY_USER_ID_AVERAGE_PERMISSIONS_ASC',
  WebUserGuildsByUserIdAveragePermissionsDesc = 'WEB_USER_GUILDS_BY_USER_ID_AVERAGE_PERMISSIONS_DESC',
  WebUserGuildsByUserIdAverageUserIdAsc = 'WEB_USER_GUILDS_BY_USER_ID_AVERAGE_USER_ID_ASC',
  WebUserGuildsByUserIdAverageUserIdDesc = 'WEB_USER_GUILDS_BY_USER_ID_AVERAGE_USER_ID_DESC',
  WebUserGuildsByUserIdCountAsc = 'WEB_USER_GUILDS_BY_USER_ID_COUNT_ASC',
  WebUserGuildsByUserIdCountDesc = 'WEB_USER_GUILDS_BY_USER_ID_COUNT_DESC',
  WebUserGuildsByUserIdDistinctCountGuildIdAsc = 'WEB_USER_GUILDS_BY_USER_ID_DISTINCT_COUNT_GUILD_ID_ASC',
  WebUserGuildsByUserIdDistinctCountGuildIdDesc = 'WEB_USER_GUILDS_BY_USER_ID_DISTINCT_COUNT_GUILD_ID_DESC',
  WebUserGuildsByUserIdDistinctCountManageGuildAsc = 'WEB_USER_GUILDS_BY_USER_ID_DISTINCT_COUNT_MANAGE_GUILD_ASC',
  WebUserGuildsByUserIdDistinctCountManageGuildDesc = 'WEB_USER_GUILDS_BY_USER_ID_DISTINCT_COUNT_MANAGE_GUILD_DESC',
  WebUserGuildsByUserIdDistinctCountOwnerAsc = 'WEB_USER_GUILDS_BY_USER_ID_DISTINCT_COUNT_OWNER_ASC',
  WebUserGuildsByUserIdDistinctCountOwnerDesc = 'WEB_USER_GUILDS_BY_USER_ID_DISTINCT_COUNT_OWNER_DESC',
  WebUserGuildsByUserIdDistinctCountPermissionsAsc = 'WEB_USER_GUILDS_BY_USER_ID_DISTINCT_COUNT_PERMISSIONS_ASC',
  WebUserGuildsByUserIdDistinctCountPermissionsDesc = 'WEB_USER_GUILDS_BY_USER_ID_DISTINCT_COUNT_PERMISSIONS_DESC',
  WebUserGuildsByUserIdDistinctCountUserIdAsc = 'WEB_USER_GUILDS_BY_USER_ID_DISTINCT_COUNT_USER_ID_ASC',
  WebUserGuildsByUserIdDistinctCountUserIdDesc = 'WEB_USER_GUILDS_BY_USER_ID_DISTINCT_COUNT_USER_ID_DESC',
  WebUserGuildsByUserIdMaxGuildIdAsc = 'WEB_USER_GUILDS_BY_USER_ID_MAX_GUILD_ID_ASC',
  WebUserGuildsByUserIdMaxGuildIdDesc = 'WEB_USER_GUILDS_BY_USER_ID_MAX_GUILD_ID_DESC',
  WebUserGuildsByUserIdMaxManageGuildAsc = 'WEB_USER_GUILDS_BY_USER_ID_MAX_MANAGE_GUILD_ASC',
  WebUserGuildsByUserIdMaxManageGuildDesc = 'WEB_USER_GUILDS_BY_USER_ID_MAX_MANAGE_GUILD_DESC',
  WebUserGuildsByUserIdMaxOwnerAsc = 'WEB_USER_GUILDS_BY_USER_ID_MAX_OWNER_ASC',
  WebUserGuildsByUserIdMaxOwnerDesc = 'WEB_USER_GUILDS_BY_USER_ID_MAX_OWNER_DESC',
  WebUserGuildsByUserIdMaxPermissionsAsc = 'WEB_USER_GUILDS_BY_USER_ID_MAX_PERMISSIONS_ASC',
  WebUserGuildsByUserIdMaxPermissionsDesc = 'WEB_USER_GUILDS_BY_USER_ID_MAX_PERMISSIONS_DESC',
  WebUserGuildsByUserIdMaxUserIdAsc = 'WEB_USER_GUILDS_BY_USER_ID_MAX_USER_ID_ASC',
  WebUserGuildsByUserIdMaxUserIdDesc = 'WEB_USER_GUILDS_BY_USER_ID_MAX_USER_ID_DESC',
  WebUserGuildsByUserIdMinGuildIdAsc = 'WEB_USER_GUILDS_BY_USER_ID_MIN_GUILD_ID_ASC',
  WebUserGuildsByUserIdMinGuildIdDesc = 'WEB_USER_GUILDS_BY_USER_ID_MIN_GUILD_ID_DESC',
  WebUserGuildsByUserIdMinManageGuildAsc = 'WEB_USER_GUILDS_BY_USER_ID_MIN_MANAGE_GUILD_ASC',
  WebUserGuildsByUserIdMinManageGuildDesc = 'WEB_USER_GUILDS_BY_USER_ID_MIN_MANAGE_GUILD_DESC',
  WebUserGuildsByUserIdMinOwnerAsc = 'WEB_USER_GUILDS_BY_USER_ID_MIN_OWNER_ASC',
  WebUserGuildsByUserIdMinOwnerDesc = 'WEB_USER_GUILDS_BY_USER_ID_MIN_OWNER_DESC',
  WebUserGuildsByUserIdMinPermissionsAsc = 'WEB_USER_GUILDS_BY_USER_ID_MIN_PERMISSIONS_ASC',
  WebUserGuildsByUserIdMinPermissionsDesc = 'WEB_USER_GUILDS_BY_USER_ID_MIN_PERMISSIONS_DESC',
  WebUserGuildsByUserIdMinUserIdAsc = 'WEB_USER_GUILDS_BY_USER_ID_MIN_USER_ID_ASC',
  WebUserGuildsByUserIdMinUserIdDesc = 'WEB_USER_GUILDS_BY_USER_ID_MIN_USER_ID_DESC',
  WebUserGuildsByUserIdStddevPopulationGuildIdAsc = 'WEB_USER_GUILDS_BY_USER_ID_STDDEV_POPULATION_GUILD_ID_ASC',
  WebUserGuildsByUserIdStddevPopulationGuildIdDesc = 'WEB_USER_GUILDS_BY_USER_ID_STDDEV_POPULATION_GUILD_ID_DESC',
  WebUserGuildsByUserIdStddevPopulationManageGuildAsc = 'WEB_USER_GUILDS_BY_USER_ID_STDDEV_POPULATION_MANAGE_GUILD_ASC',
  WebUserGuildsByUserIdStddevPopulationManageGuildDesc = 'WEB_USER_GUILDS_BY_USER_ID_STDDEV_POPULATION_MANAGE_GUILD_DESC',
  WebUserGuildsByUserIdStddevPopulationOwnerAsc = 'WEB_USER_GUILDS_BY_USER_ID_STDDEV_POPULATION_OWNER_ASC',
  WebUserGuildsByUserIdStddevPopulationOwnerDesc = 'WEB_USER_GUILDS_BY_USER_ID_STDDEV_POPULATION_OWNER_DESC',
  WebUserGuildsByUserIdStddevPopulationPermissionsAsc = 'WEB_USER_GUILDS_BY_USER_ID_STDDEV_POPULATION_PERMISSIONS_ASC',
  WebUserGuildsByUserIdStddevPopulationPermissionsDesc = 'WEB_USER_GUILDS_BY_USER_ID_STDDEV_POPULATION_PERMISSIONS_DESC',
  WebUserGuildsByUserIdStddevPopulationUserIdAsc = 'WEB_USER_GUILDS_BY_USER_ID_STDDEV_POPULATION_USER_ID_ASC',
  WebUserGuildsByUserIdStddevPopulationUserIdDesc = 'WEB_USER_GUILDS_BY_USER_ID_STDDEV_POPULATION_USER_ID_DESC',
  WebUserGuildsByUserIdStddevSampleGuildIdAsc = 'WEB_USER_GUILDS_BY_USER_ID_STDDEV_SAMPLE_GUILD_ID_ASC',
  WebUserGuildsByUserIdStddevSampleGuildIdDesc = 'WEB_USER_GUILDS_BY_USER_ID_STDDEV_SAMPLE_GUILD_ID_DESC',
  WebUserGuildsByUserIdStddevSampleManageGuildAsc = 'WEB_USER_GUILDS_BY_USER_ID_STDDEV_SAMPLE_MANAGE_GUILD_ASC',
  WebUserGuildsByUserIdStddevSampleManageGuildDesc = 'WEB_USER_GUILDS_BY_USER_ID_STDDEV_SAMPLE_MANAGE_GUILD_DESC',
  WebUserGuildsByUserIdStddevSampleOwnerAsc = 'WEB_USER_GUILDS_BY_USER_ID_STDDEV_SAMPLE_OWNER_ASC',
  WebUserGuildsByUserIdStddevSampleOwnerDesc = 'WEB_USER_GUILDS_BY_USER_ID_STDDEV_SAMPLE_OWNER_DESC',
  WebUserGuildsByUserIdStddevSamplePermissionsAsc = 'WEB_USER_GUILDS_BY_USER_ID_STDDEV_SAMPLE_PERMISSIONS_ASC',
  WebUserGuildsByUserIdStddevSamplePermissionsDesc = 'WEB_USER_GUILDS_BY_USER_ID_STDDEV_SAMPLE_PERMISSIONS_DESC',
  WebUserGuildsByUserIdStddevSampleUserIdAsc = 'WEB_USER_GUILDS_BY_USER_ID_STDDEV_SAMPLE_USER_ID_ASC',
  WebUserGuildsByUserIdStddevSampleUserIdDesc = 'WEB_USER_GUILDS_BY_USER_ID_STDDEV_SAMPLE_USER_ID_DESC',
  WebUserGuildsByUserIdSumGuildIdAsc = 'WEB_USER_GUILDS_BY_USER_ID_SUM_GUILD_ID_ASC',
  WebUserGuildsByUserIdSumGuildIdDesc = 'WEB_USER_GUILDS_BY_USER_ID_SUM_GUILD_ID_DESC',
  WebUserGuildsByUserIdSumManageGuildAsc = 'WEB_USER_GUILDS_BY_USER_ID_SUM_MANAGE_GUILD_ASC',
  WebUserGuildsByUserIdSumManageGuildDesc = 'WEB_USER_GUILDS_BY_USER_ID_SUM_MANAGE_GUILD_DESC',
  WebUserGuildsByUserIdSumOwnerAsc = 'WEB_USER_GUILDS_BY_USER_ID_SUM_OWNER_ASC',
  WebUserGuildsByUserIdSumOwnerDesc = 'WEB_USER_GUILDS_BY_USER_ID_SUM_OWNER_DESC',
  WebUserGuildsByUserIdSumPermissionsAsc = 'WEB_USER_GUILDS_BY_USER_ID_SUM_PERMISSIONS_ASC',
  WebUserGuildsByUserIdSumPermissionsDesc = 'WEB_USER_GUILDS_BY_USER_ID_SUM_PERMISSIONS_DESC',
  WebUserGuildsByUserIdSumUserIdAsc = 'WEB_USER_GUILDS_BY_USER_ID_SUM_USER_ID_ASC',
  WebUserGuildsByUserIdSumUserIdDesc = 'WEB_USER_GUILDS_BY_USER_ID_SUM_USER_ID_DESC',
  WebUserGuildsByUserIdVariancePopulationGuildIdAsc = 'WEB_USER_GUILDS_BY_USER_ID_VARIANCE_POPULATION_GUILD_ID_ASC',
  WebUserGuildsByUserIdVariancePopulationGuildIdDesc = 'WEB_USER_GUILDS_BY_USER_ID_VARIANCE_POPULATION_GUILD_ID_DESC',
  WebUserGuildsByUserIdVariancePopulationManageGuildAsc = 'WEB_USER_GUILDS_BY_USER_ID_VARIANCE_POPULATION_MANAGE_GUILD_ASC',
  WebUserGuildsByUserIdVariancePopulationManageGuildDesc = 'WEB_USER_GUILDS_BY_USER_ID_VARIANCE_POPULATION_MANAGE_GUILD_DESC',
  WebUserGuildsByUserIdVariancePopulationOwnerAsc = 'WEB_USER_GUILDS_BY_USER_ID_VARIANCE_POPULATION_OWNER_ASC',
  WebUserGuildsByUserIdVariancePopulationOwnerDesc = 'WEB_USER_GUILDS_BY_USER_ID_VARIANCE_POPULATION_OWNER_DESC',
  WebUserGuildsByUserIdVariancePopulationPermissionsAsc = 'WEB_USER_GUILDS_BY_USER_ID_VARIANCE_POPULATION_PERMISSIONS_ASC',
  WebUserGuildsByUserIdVariancePopulationPermissionsDesc = 'WEB_USER_GUILDS_BY_USER_ID_VARIANCE_POPULATION_PERMISSIONS_DESC',
  WebUserGuildsByUserIdVariancePopulationUserIdAsc = 'WEB_USER_GUILDS_BY_USER_ID_VARIANCE_POPULATION_USER_ID_ASC',
  WebUserGuildsByUserIdVariancePopulationUserIdDesc = 'WEB_USER_GUILDS_BY_USER_ID_VARIANCE_POPULATION_USER_ID_DESC',
  WebUserGuildsByUserIdVarianceSampleGuildIdAsc = 'WEB_USER_GUILDS_BY_USER_ID_VARIANCE_SAMPLE_GUILD_ID_ASC',
  WebUserGuildsByUserIdVarianceSampleGuildIdDesc = 'WEB_USER_GUILDS_BY_USER_ID_VARIANCE_SAMPLE_GUILD_ID_DESC',
  WebUserGuildsByUserIdVarianceSampleManageGuildAsc = 'WEB_USER_GUILDS_BY_USER_ID_VARIANCE_SAMPLE_MANAGE_GUILD_ASC',
  WebUserGuildsByUserIdVarianceSampleManageGuildDesc = 'WEB_USER_GUILDS_BY_USER_ID_VARIANCE_SAMPLE_MANAGE_GUILD_DESC',
  WebUserGuildsByUserIdVarianceSampleOwnerAsc = 'WEB_USER_GUILDS_BY_USER_ID_VARIANCE_SAMPLE_OWNER_ASC',
  WebUserGuildsByUserIdVarianceSampleOwnerDesc = 'WEB_USER_GUILDS_BY_USER_ID_VARIANCE_SAMPLE_OWNER_DESC',
  WebUserGuildsByUserIdVarianceSamplePermissionsAsc = 'WEB_USER_GUILDS_BY_USER_ID_VARIANCE_SAMPLE_PERMISSIONS_ASC',
  WebUserGuildsByUserIdVarianceSamplePermissionsDesc = 'WEB_USER_GUILDS_BY_USER_ID_VARIANCE_SAMPLE_PERMISSIONS_DESC',
  WebUserGuildsByUserIdVarianceSampleUserIdAsc = 'WEB_USER_GUILDS_BY_USER_ID_VARIANCE_SAMPLE_USER_ID_ASC',
  WebUserGuildsByUserIdVarianceSampleUserIdDesc = 'WEB_USER_GUILDS_BY_USER_ID_VARIANCE_SAMPLE_USER_ID_DESC'
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
  BigFloat: ResolverTypeWrapper<Scalars['BigFloat']>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
  BigIntFilter: BigIntFilter;
  BigIntListFilter: BigIntListFilter;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  BooleanFilter: BooleanFilter;
  BotStat: ResolverTypeWrapper<BotStat>;
  BotStatAggregates: ResolverTypeWrapper<BotStatAggregates>;
  BotStatAverageAggregates: ResolverTypeWrapper<BotStatAverageAggregates>;
  BotStatCondition: BotStatCondition;
  BotStatDistinctCountAggregates: ResolverTypeWrapper<BotStatDistinctCountAggregates>;
  BotStatFilter: BotStatFilter;
  BotStatInput: BotStatInput;
  BotStatMaxAggregates: ResolverTypeWrapper<BotStatMaxAggregates>;
  BotStatMinAggregates: ResolverTypeWrapper<BotStatMinAggregates>;
  BotStatPatch: BotStatPatch;
  BotStatStddevPopulationAggregates: ResolverTypeWrapper<BotStatStddevPopulationAggregates>;
  BotStatStddevSampleAggregates: ResolverTypeWrapper<BotStatStddevSampleAggregates>;
  BotStatSumAggregates: ResolverTypeWrapper<BotStatSumAggregates>;
  BotStatVariancePopulationAggregates: ResolverTypeWrapper<BotStatVariancePopulationAggregates>;
  BotStatVarianceSampleAggregates: ResolverTypeWrapper<BotStatVarianceSampleAggregates>;
  BotStatsConnection: ResolverTypeWrapper<BotStatsConnection>;
  BotStatsEdge: ResolverTypeWrapper<BotStatsEdge>;
  BotStatsGroupBy: BotStatsGroupBy;
  BotStatsHavingAverageInput: BotStatsHavingAverageInput;
  BotStatsHavingDistinctCountInput: BotStatsHavingDistinctCountInput;
  BotStatsHavingInput: BotStatsHavingInput;
  BotStatsHavingMaxInput: BotStatsHavingMaxInput;
  BotStatsHavingMinInput: BotStatsHavingMinInput;
  BotStatsHavingStddevPopulationInput: BotStatsHavingStddevPopulationInput;
  BotStatsHavingStddevSampleInput: BotStatsHavingStddevSampleInput;
  BotStatsHavingSumInput: BotStatsHavingSumInput;
  BotStatsHavingVariancePopulationInput: BotStatsHavingVariancePopulationInput;
  BotStatsHavingVarianceSampleInput: BotStatsHavingVarianceSampleInput;
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
  DatetimeFilter: DatetimeFilter;
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
  DeleteRoleMenuByGuildIdAndMenuNameInput: DeleteRoleMenuByGuildIdAndMenuNameInput;
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
  FeedAggregates: ResolverTypeWrapper<FeedAggregates>;
  FeedCondition: FeedCondition;
  FeedDistinctCountAggregates: ResolverTypeWrapper<FeedDistinctCountAggregates>;
  FeedFilter: FeedFilter;
  FeedInput: FeedInput;
  FeedItem: ResolverTypeWrapper<FeedItem>;
  FeedItemAggregates: ResolverTypeWrapper<FeedItemAggregates>;
  FeedItemCondition: FeedItemCondition;
  FeedItemDistinctCountAggregates: ResolverTypeWrapper<FeedItemDistinctCountAggregates>;
  FeedItemFilter: FeedItemFilter;
  FeedItemInput: FeedItemInput;
  FeedItemPatch: FeedItemPatch;
  FeedItemsConnection: ResolverTypeWrapper<FeedItemsConnection>;
  FeedItemsEdge: ResolverTypeWrapper<FeedItemsEdge>;
  FeedItemsGroupBy: FeedItemsGroupBy;
  FeedItemsHavingInput: FeedItemsHavingInput;
  FeedItemsOrderBy: FeedItemsOrderBy;
  FeedPatch: FeedPatch;
  FeedSubscription: ResolverTypeWrapper<FeedSubscription>;
  FeedSubscriptionAggregates: ResolverTypeWrapper<FeedSubscriptionAggregates>;
  FeedSubscriptionAverageAggregates: ResolverTypeWrapper<FeedSubscriptionAverageAggregates>;
  FeedSubscriptionCondition: FeedSubscriptionCondition;
  FeedSubscriptionDistinctCountAggregates: ResolverTypeWrapper<FeedSubscriptionDistinctCountAggregates>;
  FeedSubscriptionFilter: FeedSubscriptionFilter;
  FeedSubscriptionInput: FeedSubscriptionInput;
  FeedSubscriptionMaxAggregates: ResolverTypeWrapper<FeedSubscriptionMaxAggregates>;
  FeedSubscriptionMinAggregates: ResolverTypeWrapper<FeedSubscriptionMinAggregates>;
  FeedSubscriptionPatch: FeedSubscriptionPatch;
  FeedSubscriptionStddevPopulationAggregates: ResolverTypeWrapper<FeedSubscriptionStddevPopulationAggregates>;
  FeedSubscriptionStddevSampleAggregates: ResolverTypeWrapper<FeedSubscriptionStddevSampleAggregates>;
  FeedSubscriptionSumAggregates: ResolverTypeWrapper<FeedSubscriptionSumAggregates>;
  FeedSubscriptionVariancePopulationAggregates: ResolverTypeWrapper<FeedSubscriptionVariancePopulationAggregates>;
  FeedSubscriptionVarianceSampleAggregates: ResolverTypeWrapper<FeedSubscriptionVarianceSampleAggregates>;
  FeedSubscriptionsConnection: ResolverTypeWrapper<FeedSubscriptionsConnection>;
  FeedSubscriptionsEdge: ResolverTypeWrapper<FeedSubscriptionsEdge>;
  FeedSubscriptionsGroupBy: FeedSubscriptionsGroupBy;
  FeedSubscriptionsHavingAverageInput: FeedSubscriptionsHavingAverageInput;
  FeedSubscriptionsHavingDistinctCountInput: FeedSubscriptionsHavingDistinctCountInput;
  FeedSubscriptionsHavingInput: FeedSubscriptionsHavingInput;
  FeedSubscriptionsHavingMaxInput: FeedSubscriptionsHavingMaxInput;
  FeedSubscriptionsHavingMinInput: FeedSubscriptionsHavingMinInput;
  FeedSubscriptionsHavingStddevPopulationInput: FeedSubscriptionsHavingStddevPopulationInput;
  FeedSubscriptionsHavingStddevSampleInput: FeedSubscriptionsHavingStddevSampleInput;
  FeedSubscriptionsHavingSumInput: FeedSubscriptionsHavingSumInput;
  FeedSubscriptionsHavingVariancePopulationInput: FeedSubscriptionsHavingVariancePopulationInput;
  FeedSubscriptionsHavingVarianceSampleInput: FeedSubscriptionsHavingVarianceSampleInput;
  FeedSubscriptionsOrderBy: FeedSubscriptionsOrderBy;
  FeedsConnection: ResolverTypeWrapper<FeedsConnection>;
  FeedsEdge: ResolverTypeWrapper<FeedsEdge>;
  FeedsGroupBy: FeedsGroupBy;
  FeedsHavingInput: FeedsHavingInput;
  FeedsOrderBy: FeedsOrderBy;
  GraphqlInput: GraphqlInput;
  GraphqlPayload: ResolverTypeWrapper<GraphqlPayload>;
  GuildBan: ResolverTypeWrapper<GuildBan>;
  GuildBanAggregates: ResolverTypeWrapper<GuildBanAggregates>;
  GuildBanAverageAggregates: ResolverTypeWrapper<GuildBanAverageAggregates>;
  GuildBanCondition: GuildBanCondition;
  GuildBanDistinctCountAggregates: ResolverTypeWrapper<GuildBanDistinctCountAggregates>;
  GuildBanFilter: GuildBanFilter;
  GuildBanInput: GuildBanInput;
  GuildBanMaxAggregates: ResolverTypeWrapper<GuildBanMaxAggregates>;
  GuildBanMinAggregates: ResolverTypeWrapper<GuildBanMinAggregates>;
  GuildBanPatch: GuildBanPatch;
  GuildBanStddevPopulationAggregates: ResolverTypeWrapper<GuildBanStddevPopulationAggregates>;
  GuildBanStddevSampleAggregates: ResolverTypeWrapper<GuildBanStddevSampleAggregates>;
  GuildBanSumAggregates: ResolverTypeWrapper<GuildBanSumAggregates>;
  GuildBanVariancePopulationAggregates: ResolverTypeWrapper<GuildBanVariancePopulationAggregates>;
  GuildBanVarianceSampleAggregates: ResolverTypeWrapper<GuildBanVarianceSampleAggregates>;
  GuildBansConnection: ResolverTypeWrapper<GuildBansConnection>;
  GuildBansEdge: ResolverTypeWrapper<GuildBansEdge>;
  GuildBansGroupBy: GuildBansGroupBy;
  GuildBansHavingAverageInput: GuildBansHavingAverageInput;
  GuildBansHavingDistinctCountInput: GuildBansHavingDistinctCountInput;
  GuildBansHavingInput: GuildBansHavingInput;
  GuildBansHavingMaxInput: GuildBansHavingMaxInput;
  GuildBansHavingMinInput: GuildBansHavingMinInput;
  GuildBansHavingStddevPopulationInput: GuildBansHavingStddevPopulationInput;
  GuildBansHavingStddevSampleInput: GuildBansHavingStddevSampleInput;
  GuildBansHavingSumInput: GuildBansHavingSumInput;
  GuildBansHavingVariancePopulationInput: GuildBansHavingVariancePopulationInput;
  GuildBansHavingVarianceSampleInput: GuildBansHavingVarianceSampleInput;
  GuildBansOrderBy: GuildBansOrderBy;
  GuildConfig: ResolverTypeWrapper<GuildConfig>;
  GuildConfigAggregates: ResolverTypeWrapper<GuildConfigAggregates>;
  GuildConfigAverageAggregates: ResolverTypeWrapper<GuildConfigAverageAggregates>;
  GuildConfigCondition: GuildConfigCondition;
  GuildConfigDistinctCountAggregates: ResolverTypeWrapper<GuildConfigDistinctCountAggregates>;
  GuildConfigFilter: GuildConfigFilter;
  GuildConfigInput: GuildConfigInput;
  GuildConfigMaxAggregates: ResolverTypeWrapper<GuildConfigMaxAggregates>;
  GuildConfigMinAggregates: ResolverTypeWrapper<GuildConfigMinAggregates>;
  GuildConfigPatch: GuildConfigPatch;
  GuildConfigStddevPopulationAggregates: ResolverTypeWrapper<GuildConfigStddevPopulationAggregates>;
  GuildConfigStddevSampleAggregates: ResolverTypeWrapper<GuildConfigStddevSampleAggregates>;
  GuildConfigSumAggregates: ResolverTypeWrapper<GuildConfigSumAggregates>;
  GuildConfigVariancePopulationAggregates: ResolverTypeWrapper<GuildConfigVariancePopulationAggregates>;
  GuildConfigVarianceSampleAggregates: ResolverTypeWrapper<GuildConfigVarianceSampleAggregates>;
  GuildConfigsConnection: ResolverTypeWrapper<GuildConfigsConnection>;
  GuildConfigsEdge: ResolverTypeWrapper<GuildConfigsEdge>;
  GuildConfigsGroupBy: GuildConfigsGroupBy;
  GuildConfigsHavingAverageInput: GuildConfigsHavingAverageInput;
  GuildConfigsHavingDistinctCountInput: GuildConfigsHavingDistinctCountInput;
  GuildConfigsHavingInput: GuildConfigsHavingInput;
  GuildConfigsHavingMaxInput: GuildConfigsHavingMaxInput;
  GuildConfigsHavingMinInput: GuildConfigsHavingMinInput;
  GuildConfigsHavingStddevPopulationInput: GuildConfigsHavingStddevPopulationInput;
  GuildConfigsHavingStddevSampleInput: GuildConfigsHavingStddevSampleInput;
  GuildConfigsHavingSumInput: GuildConfigsHavingSumInput;
  GuildConfigsHavingVariancePopulationInput: GuildConfigsHavingVariancePopulationInput;
  GuildConfigsHavingVarianceSampleInput: GuildConfigsHavingVarianceSampleInput;
  GuildConfigsOrderBy: GuildConfigsOrderBy;
  HavingBigintFilter: HavingBigintFilter;
  HavingDatetimeFilter: HavingDatetimeFilter;
  HavingIntFilter: HavingIntFilter;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  IntFilter: IntFilter;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  JSONFilter: JsonFilter;
  LevelTimeframe: LevelTimeframe;
  LogoutInput: LogoutInput;
  LogoutPayload: ResolverTypeWrapper<LogoutPayload>;
  Member: ResolverTypeWrapper<Member>;
  MemberAggregates: ResolverTypeWrapper<MemberAggregates>;
  MemberAverageAggregates: ResolverTypeWrapper<MemberAverageAggregates>;
  MemberCondition: MemberCondition;
  MemberDistinctCountAggregates: ResolverTypeWrapper<MemberDistinctCountAggregates>;
  MemberFilter: MemberFilter;
  MemberInput: MemberInput;
  MemberMaxAggregates: ResolverTypeWrapper<MemberMaxAggregates>;
  MemberMinAggregates: ResolverTypeWrapper<MemberMinAggregates>;
  MemberPatch: MemberPatch;
  MemberStddevPopulationAggregates: ResolverTypeWrapper<MemberStddevPopulationAggregates>;
  MemberStddevSampleAggregates: ResolverTypeWrapper<MemberStddevSampleAggregates>;
  MemberSumAggregates: ResolverTypeWrapper<MemberSumAggregates>;
  MemberVariancePopulationAggregates: ResolverTypeWrapper<MemberVariancePopulationAggregates>;
  MemberVarianceSampleAggregates: ResolverTypeWrapper<MemberVarianceSampleAggregates>;
  MembersConnection: ResolverTypeWrapper<MembersConnection>;
  MembersEdge: ResolverTypeWrapper<MembersEdge>;
  MembersGroupBy: MembersGroupBy;
  MembersHavingAverageInput: MembersHavingAverageInput;
  MembersHavingDistinctCountInput: MembersHavingDistinctCountInput;
  MembersHavingInput: MembersHavingInput;
  MembersHavingMaxInput: MembersHavingMaxInput;
  MembersHavingMinInput: MembersHavingMinInput;
  MembersHavingStddevPopulationInput: MembersHavingStddevPopulationInput;
  MembersHavingStddevSampleInput: MembersHavingStddevSampleInput;
  MembersHavingSumInput: MembersHavingSumInput;
  MembersHavingVariancePopulationInput: MembersHavingVariancePopulationInput;
  MembersHavingVarianceSampleInput: MembersHavingVarianceSampleInput;
  MembersOrderBy: MembersOrderBy;
  Message: ResolverTypeWrapper<Message>;
  MessageAggregates: ResolverTypeWrapper<MessageAggregates>;
  MessageAverageAggregates: ResolverTypeWrapper<MessageAverageAggregates>;
  MessageCondition: MessageCondition;
  MessageDistinctCountAggregates: ResolverTypeWrapper<MessageDistinctCountAggregates>;
  MessageFilter: MessageFilter;
  MessageInput: MessageInput;
  MessageMaxAggregates: ResolverTypeWrapper<MessageMaxAggregates>;
  MessageMinAggregates: ResolverTypeWrapper<MessageMinAggregates>;
  MessageStddevPopulationAggregates: ResolverTypeWrapper<MessageStddevPopulationAggregates>;
  MessageStddevSampleAggregates: ResolverTypeWrapper<MessageStddevSampleAggregates>;
  MessageSumAggregates: ResolverTypeWrapper<MessageSumAggregates>;
  MessageVariancePopulationAggregates: ResolverTypeWrapper<MessageVariancePopulationAggregates>;
  MessageVarianceSampleAggregates: ResolverTypeWrapper<MessageVarianceSampleAggregates>;
  MessagesConnection: ResolverTypeWrapper<MessagesConnection>;
  MessagesEdge: ResolverTypeWrapper<MessagesEdge>;
  MessagesGroupBy: MessagesGroupBy;
  MessagesHavingAverageInput: MessagesHavingAverageInput;
  MessagesHavingDistinctCountInput: MessagesHavingDistinctCountInput;
  MessagesHavingInput: MessagesHavingInput;
  MessagesHavingMaxInput: MessagesHavingMaxInput;
  MessagesHavingMinInput: MessagesHavingMinInput;
  MessagesHavingStddevPopulationInput: MessagesHavingStddevPopulationInput;
  MessagesHavingStddevSampleInput: MessagesHavingStddevSampleInput;
  MessagesHavingSumInput: MessagesHavingSumInput;
  MessagesHavingVariancePopulationInput: MessagesHavingVariancePopulationInput;
  MessagesHavingVarianceSampleInput: MessagesHavingVarianceSampleInput;
  MessagesOrderBy: MessagesOrderBy;
  ModLog: ResolverTypeWrapper<ModLog>;
  ModLogAggregates: ResolverTypeWrapper<ModLogAggregates>;
  ModLogAverageAggregates: ResolverTypeWrapper<ModLogAverageAggregates>;
  ModLogCondition: ModLogCondition;
  ModLogDistinctCountAggregates: ResolverTypeWrapper<ModLogDistinctCountAggregates>;
  ModLogFilter: ModLogFilter;
  ModLogInput: ModLogInput;
  ModLogMaxAggregates: ResolverTypeWrapper<ModLogMaxAggregates>;
  ModLogMinAggregates: ResolverTypeWrapper<ModLogMinAggregates>;
  ModLogPatch: ModLogPatch;
  ModLogStddevPopulationAggregates: ResolverTypeWrapper<ModLogStddevPopulationAggregates>;
  ModLogStddevSampleAggregates: ResolverTypeWrapper<ModLogStddevSampleAggregates>;
  ModLogSumAggregates: ResolverTypeWrapper<ModLogSumAggregates>;
  ModLogVariancePopulationAggregates: ResolverTypeWrapper<ModLogVariancePopulationAggregates>;
  ModLogVarianceSampleAggregates: ResolverTypeWrapper<ModLogVarianceSampleAggregates>;
  ModLogsConnection: ResolverTypeWrapper<ModLogsConnection>;
  ModLogsEdge: ResolverTypeWrapper<ModLogsEdge>;
  ModLogsGroupBy: ModLogsGroupBy;
  ModLogsHavingAverageInput: ModLogsHavingAverageInput;
  ModLogsHavingDistinctCountInput: ModLogsHavingDistinctCountInput;
  ModLogsHavingInput: ModLogsHavingInput;
  ModLogsHavingMaxInput: ModLogsHavingMaxInput;
  ModLogsHavingMinInput: ModLogsHavingMinInput;
  ModLogsHavingStddevPopulationInput: ModLogsHavingStddevPopulationInput;
  ModLogsHavingStddevSampleInput: ModLogsHavingStddevSampleInput;
  ModLogsHavingSumInput: ModLogsHavingSumInput;
  ModLogsHavingVariancePopulationInput: ModLogsHavingVariancePopulationInput;
  ModLogsHavingVarianceSampleInput: ModLogsHavingVarianceSampleInput;
  ModLogsOrderBy: ModLogsOrderBy;
  Mutation: ResolverTypeWrapper<{}>;
  Mute: ResolverTypeWrapper<Mute>;
  MuteAggregates: ResolverTypeWrapper<MuteAggregates>;
  MuteAverageAggregates: ResolverTypeWrapper<MuteAverageAggregates>;
  MuteCondition: MuteCondition;
  MuteDistinctCountAggregates: ResolverTypeWrapper<MuteDistinctCountAggregates>;
  MuteFilter: MuteFilter;
  MuteInput: MuteInput;
  MuteMaxAggregates: ResolverTypeWrapper<MuteMaxAggregates>;
  MuteMinAggregates: ResolverTypeWrapper<MuteMinAggregates>;
  MutePatch: MutePatch;
  MuteStddevPopulationAggregates: ResolverTypeWrapper<MuteStddevPopulationAggregates>;
  MuteStddevSampleAggregates: ResolverTypeWrapper<MuteStddevSampleAggregates>;
  MuteSumAggregates: ResolverTypeWrapper<MuteSumAggregates>;
  MuteVariancePopulationAggregates: ResolverTypeWrapper<MuteVariancePopulationAggregates>;
  MuteVarianceSampleAggregates: ResolverTypeWrapper<MuteVarianceSampleAggregates>;
  MutesConnection: ResolverTypeWrapper<MutesConnection>;
  MutesEdge: ResolverTypeWrapper<MutesEdge>;
  MutesGroupBy: MutesGroupBy;
  MutesHavingAverageInput: MutesHavingAverageInput;
  MutesHavingDistinctCountInput: MutesHavingDistinctCountInput;
  MutesHavingInput: MutesHavingInput;
  MutesHavingMaxInput: MutesHavingMaxInput;
  MutesHavingMinInput: MutesHavingMinInput;
  MutesHavingStddevPopulationInput: MutesHavingStddevPopulationInput;
  MutesHavingStddevSampleInput: MutesHavingStddevSampleInput;
  MutesHavingSumInput: MutesHavingSumInput;
  MutesHavingVariancePopulationInput: MutesHavingVariancePopulationInput;
  MutesHavingVarianceSampleInput: MutesHavingVarianceSampleInput;
  MutesOrderBy: MutesOrderBy;
  Node: ResolversTypes['BotStat'] | ResolversTypes['CachedGuild'] | ResolversTypes['CachedUser'] | ResolversTypes['Feed'] | ResolversTypes['FeedItem'] | ResolversTypes['FeedSubscription'] | ResolversTypes['GuildBan'] | ResolversTypes['GuildConfig'] | ResolversTypes['Member'] | ResolversTypes['ModLog'] | ResolversTypes['Mute'] | ResolversTypes['Notification'] | ResolversTypes['Query'] | ResolversTypes['Reminder'] | ResolversTypes['RoleMenu'] | ResolversTypes['Tag'] | ResolversTypes['User'] | ResolversTypes['UserLevel'] | ResolversTypes['WebUser'] | ResolversTypes['WebUserGuild'];
  Notification: ResolverTypeWrapper<Notification>;
  NotificationAggregates: ResolverTypeWrapper<NotificationAggregates>;
  NotificationAverageAggregates: ResolverTypeWrapper<NotificationAverageAggregates>;
  NotificationCondition: NotificationCondition;
  NotificationDistinctCountAggregates: ResolverTypeWrapper<NotificationDistinctCountAggregates>;
  NotificationFilter: NotificationFilter;
  NotificationInput: NotificationInput;
  NotificationMaxAggregates: ResolverTypeWrapper<NotificationMaxAggregates>;
  NotificationMinAggregates: ResolverTypeWrapper<NotificationMinAggregates>;
  NotificationPatch: NotificationPatch;
  NotificationStddevPopulationAggregates: ResolverTypeWrapper<NotificationStddevPopulationAggregates>;
  NotificationStddevSampleAggregates: ResolverTypeWrapper<NotificationStddevSampleAggregates>;
  NotificationSumAggregates: ResolverTypeWrapper<NotificationSumAggregates>;
  NotificationVariancePopulationAggregates: ResolverTypeWrapper<NotificationVariancePopulationAggregates>;
  NotificationVarianceSampleAggregates: ResolverTypeWrapper<NotificationVarianceSampleAggregates>;
  NotificationsConnection: ResolverTypeWrapper<NotificationsConnection>;
  NotificationsEdge: ResolverTypeWrapper<NotificationsEdge>;
  NotificationsGroupBy: NotificationsGroupBy;
  NotificationsHavingAverageInput: NotificationsHavingAverageInput;
  NotificationsHavingDistinctCountInput: NotificationsHavingDistinctCountInput;
  NotificationsHavingInput: NotificationsHavingInput;
  NotificationsHavingMaxInput: NotificationsHavingMaxInput;
  NotificationsHavingMinInput: NotificationsHavingMinInput;
  NotificationsHavingStddevPopulationInput: NotificationsHavingStddevPopulationInput;
  NotificationsHavingStddevSampleInput: NotificationsHavingStddevSampleInput;
  NotificationsHavingSumInput: NotificationsHavingSumInput;
  NotificationsHavingVariancePopulationInput: NotificationsHavingVariancePopulationInput;
  NotificationsHavingVarianceSampleInput: NotificationsHavingVarianceSampleInput;
  NotificationsOrderBy: NotificationsOrderBy;
  NotificationsStartingWithConnection: ResolverTypeWrapper<NotificationsStartingWithConnection>;
  NotificationsStartingWithEdge: ResolverTypeWrapper<NotificationsStartingWithEdge>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Query: ResolverTypeWrapper<{}>;
  RedisGuild: ResolverTypeWrapper<RedisGuild>;
  RedisGuildRole: ResolverTypeWrapper<RedisGuildRole>;
  RedisRoleTags: ResolverTypeWrapper<RedisRoleTags>;
  Reminder: ResolverTypeWrapper<Reminder>;
  ReminderAggregates: ResolverTypeWrapper<ReminderAggregates>;
  ReminderAverageAggregates: ResolverTypeWrapper<ReminderAverageAggregates>;
  ReminderCondition: ReminderCondition;
  ReminderDistinctCountAggregates: ResolverTypeWrapper<ReminderDistinctCountAggregates>;
  ReminderFilter: ReminderFilter;
  ReminderInput: ReminderInput;
  ReminderMaxAggregates: ResolverTypeWrapper<ReminderMaxAggregates>;
  ReminderMinAggregates: ResolverTypeWrapper<ReminderMinAggregates>;
  ReminderPatch: ReminderPatch;
  ReminderStddevPopulationAggregates: ResolverTypeWrapper<ReminderStddevPopulationAggregates>;
  ReminderStddevSampleAggregates: ResolverTypeWrapper<ReminderStddevSampleAggregates>;
  ReminderSumAggregates: ResolverTypeWrapper<ReminderSumAggregates>;
  ReminderVariancePopulationAggregates: ResolverTypeWrapper<ReminderVariancePopulationAggregates>;
  ReminderVarianceSampleAggregates: ResolverTypeWrapper<ReminderVarianceSampleAggregates>;
  RemindersConnection: ResolverTypeWrapper<RemindersConnection>;
  RemindersEdge: ResolverTypeWrapper<RemindersEdge>;
  RemindersGroupBy: RemindersGroupBy;
  RemindersHavingAverageInput: RemindersHavingAverageInput;
  RemindersHavingDistinctCountInput: RemindersHavingDistinctCountInput;
  RemindersHavingInput: RemindersHavingInput;
  RemindersHavingMaxInput: RemindersHavingMaxInput;
  RemindersHavingMinInput: RemindersHavingMinInput;
  RemindersHavingStddevPopulationInput: RemindersHavingStddevPopulationInput;
  RemindersHavingStddevSampleInput: RemindersHavingStddevSampleInput;
  RemindersHavingSumInput: RemindersHavingSumInput;
  RemindersHavingVariancePopulationInput: RemindersHavingVariancePopulationInput;
  RemindersHavingVarianceSampleInput: RemindersHavingVarianceSampleInput;
  RemindersOrderBy: RemindersOrderBy;
  RoleMenu: ResolverTypeWrapper<RoleMenu>;
  RoleMenuAggregates: ResolverTypeWrapper<RoleMenuAggregates>;
  RoleMenuAverageAggregates: ResolverTypeWrapper<RoleMenuAverageAggregates>;
  RoleMenuCondition: RoleMenuCondition;
  RoleMenuDistinctCountAggregates: ResolverTypeWrapper<RoleMenuDistinctCountAggregates>;
  RoleMenuFilter: RoleMenuFilter;
  RoleMenuInput: RoleMenuInput;
  RoleMenuMaxAggregates: ResolverTypeWrapper<RoleMenuMaxAggregates>;
  RoleMenuMinAggregates: ResolverTypeWrapper<RoleMenuMinAggregates>;
  RoleMenuPatch: RoleMenuPatch;
  RoleMenuStddevPopulationAggregates: ResolverTypeWrapper<RoleMenuStddevPopulationAggregates>;
  RoleMenuStddevSampleAggregates: ResolverTypeWrapper<RoleMenuStddevSampleAggregates>;
  RoleMenuSumAggregates: ResolverTypeWrapper<RoleMenuSumAggregates>;
  RoleMenuVariancePopulationAggregates: ResolverTypeWrapper<RoleMenuVariancePopulationAggregates>;
  RoleMenuVarianceSampleAggregates: ResolverTypeWrapper<RoleMenuVarianceSampleAggregates>;
  RoleMenusConnection: ResolverTypeWrapper<RoleMenusConnection>;
  RoleMenusEdge: ResolverTypeWrapper<RoleMenusEdge>;
  RoleMenusGroupBy: RoleMenusGroupBy;
  RoleMenusHavingAverageInput: RoleMenusHavingAverageInput;
  RoleMenusHavingDistinctCountInput: RoleMenusHavingDistinctCountInput;
  RoleMenusHavingInput: RoleMenusHavingInput;
  RoleMenusHavingMaxInput: RoleMenusHavingMaxInput;
  RoleMenusHavingMinInput: RoleMenusHavingMinInput;
  RoleMenusHavingStddevPopulationInput: RoleMenusHavingStddevPopulationInput;
  RoleMenusHavingStddevSampleInput: RoleMenusHavingStddevSampleInput;
  RoleMenusHavingSumInput: RoleMenusHavingSumInput;
  RoleMenusHavingVariancePopulationInput: RoleMenusHavingVariancePopulationInput;
  RoleMenusHavingVarianceSampleInput: RoleMenusHavingVarianceSampleInput;
  RoleMenusOrderBy: RoleMenusOrderBy;
  String: ResolverTypeWrapper<Scalars['String']>;
  StringFilter: StringFilter;
  StringListFilter: StringListFilter;
  Tag: ResolverTypeWrapper<Tag>;
  TagAggregates: ResolverTypeWrapper<TagAggregates>;
  TagAverageAggregates: ResolverTypeWrapper<TagAverageAggregates>;
  TagCondition: TagCondition;
  TagDistinctCountAggregates: ResolverTypeWrapper<TagDistinctCountAggregates>;
  TagFilter: TagFilter;
  TagInput: TagInput;
  TagMaxAggregates: ResolverTypeWrapper<TagMaxAggregates>;
  TagMinAggregates: ResolverTypeWrapper<TagMinAggregates>;
  TagPatch: TagPatch;
  TagStddevPopulationAggregates: ResolverTypeWrapper<TagStddevPopulationAggregates>;
  TagStddevSampleAggregates: ResolverTypeWrapper<TagStddevSampleAggregates>;
  TagSumAggregates: ResolverTypeWrapper<TagSumAggregates>;
  TagVariancePopulationAggregates: ResolverTypeWrapper<TagVariancePopulationAggregates>;
  TagVarianceSampleAggregates: ResolverTypeWrapper<TagVarianceSampleAggregates>;
  TagsConnection: ResolverTypeWrapper<TagsConnection>;
  TagsEdge: ResolverTypeWrapper<TagsEdge>;
  TagsGroupBy: TagsGroupBy;
  TagsHavingAverageInput: TagsHavingAverageInput;
  TagsHavingDistinctCountInput: TagsHavingDistinctCountInput;
  TagsHavingInput: TagsHavingInput;
  TagsHavingMaxInput: TagsHavingMaxInput;
  TagsHavingMinInput: TagsHavingMinInput;
  TagsHavingStddevPopulationInput: TagsHavingStddevPopulationInput;
  TagsHavingStddevSampleInput: TagsHavingStddevSampleInput;
  TagsHavingSumInput: TagsHavingSumInput;
  TagsHavingVariancePopulationInput: TagsHavingVariancePopulationInput;
  TagsHavingVarianceSampleInput: TagsHavingVarianceSampleInput;
  TagsOrderBy: TagsOrderBy;
  TimeframeUserLevelEdge: ResolverTypeWrapper<TimeframeUserLevelEdge>;
  TimeframeUserLevelsConnection: ResolverTypeWrapper<TimeframeUserLevelsConnection>;
  TimeframeUserLevelsRecord: ResolverTypeWrapper<TimeframeUserLevelsRecord>;
  TimeframeUserLevelsRecordFilter: TimeframeUserLevelsRecordFilter;
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
  UpdateRoleMenuByGuildIdAndMenuNameInput: UpdateRoleMenuByGuildIdAndMenuNameInput;
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
  UserAggregates: ResolverTypeWrapper<UserAggregates>;
  UserAverageAggregates: ResolverTypeWrapper<UserAverageAggregates>;
  UserCondition: UserCondition;
  UserDistinctCountAggregates: ResolverTypeWrapper<UserDistinctCountAggregates>;
  UserFilter: UserFilter;
  UserGuildRankResult: ResolverTypeWrapper<UserGuildRankResult>;
  UserInput: UserInput;
  UserLevel: ResolverTypeWrapper<UserLevel>;
  UserLevelAggregates: ResolverTypeWrapper<UserLevelAggregates>;
  UserLevelAverageAggregates: ResolverTypeWrapper<UserLevelAverageAggregates>;
  UserLevelCondition: UserLevelCondition;
  UserLevelDistinctCountAggregates: ResolverTypeWrapper<UserLevelDistinctCountAggregates>;
  UserLevelFilter: UserLevelFilter;
  UserLevelInput: UserLevelInput;
  UserLevelMaxAggregates: ResolverTypeWrapper<UserLevelMaxAggregates>;
  UserLevelMinAggregates: ResolverTypeWrapper<UserLevelMinAggregates>;
  UserLevelPatch: UserLevelPatch;
  UserLevelStddevPopulationAggregates: ResolverTypeWrapper<UserLevelStddevPopulationAggregates>;
  UserLevelStddevSampleAggregates: ResolverTypeWrapper<UserLevelStddevSampleAggregates>;
  UserLevelSumAggregates: ResolverTypeWrapper<UserLevelSumAggregates>;
  UserLevelVariancePopulationAggregates: ResolverTypeWrapper<UserLevelVariancePopulationAggregates>;
  UserLevelVarianceSampleAggregates: ResolverTypeWrapper<UserLevelVarianceSampleAggregates>;
  UserLevelsConnection: ResolverTypeWrapper<UserLevelsConnection>;
  UserLevelsEdge: ResolverTypeWrapper<UserLevelsEdge>;
  UserLevelsGroupBy: UserLevelsGroupBy;
  UserLevelsHavingAverageInput: UserLevelsHavingAverageInput;
  UserLevelsHavingDistinctCountInput: UserLevelsHavingDistinctCountInput;
  UserLevelsHavingInput: UserLevelsHavingInput;
  UserLevelsHavingMaxInput: UserLevelsHavingMaxInput;
  UserLevelsHavingMinInput: UserLevelsHavingMinInput;
  UserLevelsHavingStddevPopulationInput: UserLevelsHavingStddevPopulationInput;
  UserLevelsHavingStddevSampleInput: UserLevelsHavingStddevSampleInput;
  UserLevelsHavingSumInput: UserLevelsHavingSumInput;
  UserLevelsHavingVariancePopulationInput: UserLevelsHavingVariancePopulationInput;
  UserLevelsHavingVarianceSampleInput: UserLevelsHavingVarianceSampleInput;
  UserLevelsOrderBy: UserLevelsOrderBy;
  UserMaxAggregates: ResolverTypeWrapper<UserMaxAggregates>;
  UserMinAggregates: ResolverTypeWrapper<UserMinAggregates>;
  UserPatch: UserPatch;
  UserStddevPopulationAggregates: ResolverTypeWrapper<UserStddevPopulationAggregates>;
  UserStddevSampleAggregates: ResolverTypeWrapper<UserStddevSampleAggregates>;
  UserSumAggregates: ResolverTypeWrapper<UserSumAggregates>;
  UserVariancePopulationAggregates: ResolverTypeWrapper<UserVariancePopulationAggregates>;
  UserVarianceSampleAggregates: ResolverTypeWrapper<UserVarianceSampleAggregates>;
  UsersConnection: ResolverTypeWrapper<UsersConnection>;
  UsersEdge: ResolverTypeWrapper<UsersEdge>;
  UsersGroupBy: UsersGroupBy;
  UsersHavingAverageInput: UsersHavingAverageInput;
  UsersHavingDistinctCountInput: UsersHavingDistinctCountInput;
  UsersHavingInput: UsersHavingInput;
  UsersHavingMaxInput: UsersHavingMaxInput;
  UsersHavingMinInput: UsersHavingMinInput;
  UsersHavingStddevPopulationInput: UsersHavingStddevPopulationInput;
  UsersHavingStddevSampleInput: UsersHavingStddevSampleInput;
  UsersHavingSumInput: UsersHavingSumInput;
  UsersHavingVariancePopulationInput: UsersHavingVariancePopulationInput;
  UsersHavingVarianceSampleInput: UsersHavingVarianceSampleInput;
  UsersOrderBy: UsersOrderBy;
  WebUser: ResolverTypeWrapper<WebUser>;
  WebUserAggregates: ResolverTypeWrapper<WebUserAggregates>;
  WebUserAverageAggregates: ResolverTypeWrapper<WebUserAverageAggregates>;
  WebUserCondition: WebUserCondition;
  WebUserDistinctCountAggregates: ResolverTypeWrapper<WebUserDistinctCountAggregates>;
  WebUserFilter: WebUserFilter;
  WebUserGuild: ResolverTypeWrapper<WebUserGuild>;
  WebUserGuildAggregates: ResolverTypeWrapper<WebUserGuildAggregates>;
  WebUserGuildAverageAggregates: ResolverTypeWrapper<WebUserGuildAverageAggregates>;
  WebUserGuildCondition: WebUserGuildCondition;
  WebUserGuildDistinctCountAggregates: ResolverTypeWrapper<WebUserGuildDistinctCountAggregates>;
  WebUserGuildFilter: WebUserGuildFilter;
  WebUserGuildInput: WebUserGuildInput;
  WebUserGuildMaxAggregates: ResolverTypeWrapper<WebUserGuildMaxAggregates>;
  WebUserGuildMinAggregates: ResolverTypeWrapper<WebUserGuildMinAggregates>;
  WebUserGuildPatch: WebUserGuildPatch;
  WebUserGuildStddevPopulationAggregates: ResolverTypeWrapper<WebUserGuildStddevPopulationAggregates>;
  WebUserGuildStddevSampleAggregates: ResolverTypeWrapper<WebUserGuildStddevSampleAggregates>;
  WebUserGuildSumAggregates: ResolverTypeWrapper<WebUserGuildSumAggregates>;
  WebUserGuildVariancePopulationAggregates: ResolverTypeWrapper<WebUserGuildVariancePopulationAggregates>;
  WebUserGuildVarianceSampleAggregates: ResolverTypeWrapper<WebUserGuildVarianceSampleAggregates>;
  WebUserGuildsConnection: ResolverTypeWrapper<WebUserGuildsConnection>;
  WebUserGuildsEdge: ResolverTypeWrapper<WebUserGuildsEdge>;
  WebUserGuildsGroupBy: WebUserGuildsGroupBy;
  WebUserGuildsHavingAverageInput: WebUserGuildsHavingAverageInput;
  WebUserGuildsHavingDistinctCountInput: WebUserGuildsHavingDistinctCountInput;
  WebUserGuildsHavingInput: WebUserGuildsHavingInput;
  WebUserGuildsHavingMaxInput: WebUserGuildsHavingMaxInput;
  WebUserGuildsHavingMinInput: WebUserGuildsHavingMinInput;
  WebUserGuildsHavingStddevPopulationInput: WebUserGuildsHavingStddevPopulationInput;
  WebUserGuildsHavingStddevSampleInput: WebUserGuildsHavingStddevSampleInput;
  WebUserGuildsHavingSumInput: WebUserGuildsHavingSumInput;
  WebUserGuildsHavingVariancePopulationInput: WebUserGuildsHavingVariancePopulationInput;
  WebUserGuildsHavingVarianceSampleInput: WebUserGuildsHavingVarianceSampleInput;
  WebUserGuildsOrderBy: WebUserGuildsOrderBy;
  WebUserInput: WebUserInput;
  WebUserMaxAggregates: ResolverTypeWrapper<WebUserMaxAggregates>;
  WebUserMinAggregates: ResolverTypeWrapper<WebUserMinAggregates>;
  WebUserPatch: WebUserPatch;
  WebUserStddevPopulationAggregates: ResolverTypeWrapper<WebUserStddevPopulationAggregates>;
  WebUserStddevSampleAggregates: ResolverTypeWrapper<WebUserStddevSampleAggregates>;
  WebUserSumAggregates: ResolverTypeWrapper<WebUserSumAggregates>;
  WebUserVariancePopulationAggregates: ResolverTypeWrapper<WebUserVariancePopulationAggregates>;
  WebUserVarianceSampleAggregates: ResolverTypeWrapper<WebUserVarianceSampleAggregates>;
  WebUsersConnection: ResolverTypeWrapper<WebUsersConnection>;
  WebUsersEdge: ResolverTypeWrapper<WebUsersEdge>;
  WebUsersGroupBy: WebUsersGroupBy;
  WebUsersHavingAverageInput: WebUsersHavingAverageInput;
  WebUsersHavingDistinctCountInput: WebUsersHavingDistinctCountInput;
  WebUsersHavingInput: WebUsersHavingInput;
  WebUsersHavingMaxInput: WebUsersHavingMaxInput;
  WebUsersHavingMinInput: WebUsersHavingMinInput;
  WebUsersHavingStddevPopulationInput: WebUsersHavingStddevPopulationInput;
  WebUsersHavingStddevSampleInput: WebUsersHavingStddevSampleInput;
  WebUsersHavingSumInput: WebUsersHavingSumInput;
  WebUsersHavingVariancePopulationInput: WebUsersHavingVariancePopulationInput;
  WebUsersHavingVarianceSampleInput: WebUsersHavingVarianceSampleInput;
  WebUsersOrderBy: WebUsersOrderBy;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  BigFloat: Scalars['BigFloat'];
  BigInt: Scalars['BigInt'];
  BigIntFilter: BigIntFilter;
  BigIntListFilter: BigIntListFilter;
  Boolean: Scalars['Boolean'];
  BooleanFilter: BooleanFilter;
  BotStat: BotStat;
  BotStatAggregates: BotStatAggregates;
  BotStatAverageAggregates: BotStatAverageAggregates;
  BotStatCondition: BotStatCondition;
  BotStatDistinctCountAggregates: BotStatDistinctCountAggregates;
  BotStatFilter: BotStatFilter;
  BotStatInput: BotStatInput;
  BotStatMaxAggregates: BotStatMaxAggregates;
  BotStatMinAggregates: BotStatMinAggregates;
  BotStatPatch: BotStatPatch;
  BotStatStddevPopulationAggregates: BotStatStddevPopulationAggregates;
  BotStatStddevSampleAggregates: BotStatStddevSampleAggregates;
  BotStatSumAggregates: BotStatSumAggregates;
  BotStatVariancePopulationAggregates: BotStatVariancePopulationAggregates;
  BotStatVarianceSampleAggregates: BotStatVarianceSampleAggregates;
  BotStatsConnection: BotStatsConnection;
  BotStatsEdge: BotStatsEdge;
  BotStatsHavingAverageInput: BotStatsHavingAverageInput;
  BotStatsHavingDistinctCountInput: BotStatsHavingDistinctCountInput;
  BotStatsHavingInput: BotStatsHavingInput;
  BotStatsHavingMaxInput: BotStatsHavingMaxInput;
  BotStatsHavingMinInput: BotStatsHavingMinInput;
  BotStatsHavingStddevPopulationInput: BotStatsHavingStddevPopulationInput;
  BotStatsHavingStddevSampleInput: BotStatsHavingStddevSampleInput;
  BotStatsHavingSumInput: BotStatsHavingSumInput;
  BotStatsHavingVariancePopulationInput: BotStatsHavingVariancePopulationInput;
  BotStatsHavingVarianceSampleInput: BotStatsHavingVarianceSampleInput;
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
  DatetimeFilter: DatetimeFilter;
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
  DeleteRoleMenuByGuildIdAndMenuNameInput: DeleteRoleMenuByGuildIdAndMenuNameInput;
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
  FeedAggregates: FeedAggregates;
  FeedCondition: FeedCondition;
  FeedDistinctCountAggregates: FeedDistinctCountAggregates;
  FeedFilter: FeedFilter;
  FeedInput: FeedInput;
  FeedItem: FeedItem;
  FeedItemAggregates: FeedItemAggregates;
  FeedItemCondition: FeedItemCondition;
  FeedItemDistinctCountAggregates: FeedItemDistinctCountAggregates;
  FeedItemFilter: FeedItemFilter;
  FeedItemInput: FeedItemInput;
  FeedItemPatch: FeedItemPatch;
  FeedItemsConnection: FeedItemsConnection;
  FeedItemsEdge: FeedItemsEdge;
  FeedItemsHavingInput: FeedItemsHavingInput;
  FeedPatch: FeedPatch;
  FeedSubscription: FeedSubscription;
  FeedSubscriptionAggregates: FeedSubscriptionAggregates;
  FeedSubscriptionAverageAggregates: FeedSubscriptionAverageAggregates;
  FeedSubscriptionCondition: FeedSubscriptionCondition;
  FeedSubscriptionDistinctCountAggregates: FeedSubscriptionDistinctCountAggregates;
  FeedSubscriptionFilter: FeedSubscriptionFilter;
  FeedSubscriptionInput: FeedSubscriptionInput;
  FeedSubscriptionMaxAggregates: FeedSubscriptionMaxAggregates;
  FeedSubscriptionMinAggregates: FeedSubscriptionMinAggregates;
  FeedSubscriptionPatch: FeedSubscriptionPatch;
  FeedSubscriptionStddevPopulationAggregates: FeedSubscriptionStddevPopulationAggregates;
  FeedSubscriptionStddevSampleAggregates: FeedSubscriptionStddevSampleAggregates;
  FeedSubscriptionSumAggregates: FeedSubscriptionSumAggregates;
  FeedSubscriptionVariancePopulationAggregates: FeedSubscriptionVariancePopulationAggregates;
  FeedSubscriptionVarianceSampleAggregates: FeedSubscriptionVarianceSampleAggregates;
  FeedSubscriptionsConnection: FeedSubscriptionsConnection;
  FeedSubscriptionsEdge: FeedSubscriptionsEdge;
  FeedSubscriptionsHavingAverageInput: FeedSubscriptionsHavingAverageInput;
  FeedSubscriptionsHavingDistinctCountInput: FeedSubscriptionsHavingDistinctCountInput;
  FeedSubscriptionsHavingInput: FeedSubscriptionsHavingInput;
  FeedSubscriptionsHavingMaxInput: FeedSubscriptionsHavingMaxInput;
  FeedSubscriptionsHavingMinInput: FeedSubscriptionsHavingMinInput;
  FeedSubscriptionsHavingStddevPopulationInput: FeedSubscriptionsHavingStddevPopulationInput;
  FeedSubscriptionsHavingStddevSampleInput: FeedSubscriptionsHavingStddevSampleInput;
  FeedSubscriptionsHavingSumInput: FeedSubscriptionsHavingSumInput;
  FeedSubscriptionsHavingVariancePopulationInput: FeedSubscriptionsHavingVariancePopulationInput;
  FeedSubscriptionsHavingVarianceSampleInput: FeedSubscriptionsHavingVarianceSampleInput;
  FeedsConnection: FeedsConnection;
  FeedsEdge: FeedsEdge;
  FeedsHavingInput: FeedsHavingInput;
  GraphqlInput: GraphqlInput;
  GraphqlPayload: GraphqlPayload;
  GuildBan: GuildBan;
  GuildBanAggregates: GuildBanAggregates;
  GuildBanAverageAggregates: GuildBanAverageAggregates;
  GuildBanCondition: GuildBanCondition;
  GuildBanDistinctCountAggregates: GuildBanDistinctCountAggregates;
  GuildBanFilter: GuildBanFilter;
  GuildBanInput: GuildBanInput;
  GuildBanMaxAggregates: GuildBanMaxAggregates;
  GuildBanMinAggregates: GuildBanMinAggregates;
  GuildBanPatch: GuildBanPatch;
  GuildBanStddevPopulationAggregates: GuildBanStddevPopulationAggregates;
  GuildBanStddevSampleAggregates: GuildBanStddevSampleAggregates;
  GuildBanSumAggregates: GuildBanSumAggregates;
  GuildBanVariancePopulationAggregates: GuildBanVariancePopulationAggregates;
  GuildBanVarianceSampleAggregates: GuildBanVarianceSampleAggregates;
  GuildBansConnection: GuildBansConnection;
  GuildBansEdge: GuildBansEdge;
  GuildBansHavingAverageInput: GuildBansHavingAverageInput;
  GuildBansHavingDistinctCountInput: GuildBansHavingDistinctCountInput;
  GuildBansHavingInput: GuildBansHavingInput;
  GuildBansHavingMaxInput: GuildBansHavingMaxInput;
  GuildBansHavingMinInput: GuildBansHavingMinInput;
  GuildBansHavingStddevPopulationInput: GuildBansHavingStddevPopulationInput;
  GuildBansHavingStddevSampleInput: GuildBansHavingStddevSampleInput;
  GuildBansHavingSumInput: GuildBansHavingSumInput;
  GuildBansHavingVariancePopulationInput: GuildBansHavingVariancePopulationInput;
  GuildBansHavingVarianceSampleInput: GuildBansHavingVarianceSampleInput;
  GuildConfig: GuildConfig;
  GuildConfigAggregates: GuildConfigAggregates;
  GuildConfigAverageAggregates: GuildConfigAverageAggregates;
  GuildConfigCondition: GuildConfigCondition;
  GuildConfigDistinctCountAggregates: GuildConfigDistinctCountAggregates;
  GuildConfigFilter: GuildConfigFilter;
  GuildConfigInput: GuildConfigInput;
  GuildConfigMaxAggregates: GuildConfigMaxAggregates;
  GuildConfigMinAggregates: GuildConfigMinAggregates;
  GuildConfigPatch: GuildConfigPatch;
  GuildConfigStddevPopulationAggregates: GuildConfigStddevPopulationAggregates;
  GuildConfigStddevSampleAggregates: GuildConfigStddevSampleAggregates;
  GuildConfigSumAggregates: GuildConfigSumAggregates;
  GuildConfigVariancePopulationAggregates: GuildConfigVariancePopulationAggregates;
  GuildConfigVarianceSampleAggregates: GuildConfigVarianceSampleAggregates;
  GuildConfigsConnection: GuildConfigsConnection;
  GuildConfigsEdge: GuildConfigsEdge;
  GuildConfigsHavingAverageInput: GuildConfigsHavingAverageInput;
  GuildConfigsHavingDistinctCountInput: GuildConfigsHavingDistinctCountInput;
  GuildConfigsHavingInput: GuildConfigsHavingInput;
  GuildConfigsHavingMaxInput: GuildConfigsHavingMaxInput;
  GuildConfigsHavingMinInput: GuildConfigsHavingMinInput;
  GuildConfigsHavingStddevPopulationInput: GuildConfigsHavingStddevPopulationInput;
  GuildConfigsHavingStddevSampleInput: GuildConfigsHavingStddevSampleInput;
  GuildConfigsHavingSumInput: GuildConfigsHavingSumInput;
  GuildConfigsHavingVariancePopulationInput: GuildConfigsHavingVariancePopulationInput;
  GuildConfigsHavingVarianceSampleInput: GuildConfigsHavingVarianceSampleInput;
  HavingBigintFilter: HavingBigintFilter;
  HavingDatetimeFilter: HavingDatetimeFilter;
  HavingIntFilter: HavingIntFilter;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  IntFilter: IntFilter;
  JSON: Scalars['JSON'];
  JSONFilter: JsonFilter;
  LogoutInput: LogoutInput;
  LogoutPayload: LogoutPayload;
  Member: Member;
  MemberAggregates: MemberAggregates;
  MemberAverageAggregates: MemberAverageAggregates;
  MemberCondition: MemberCondition;
  MemberDistinctCountAggregates: MemberDistinctCountAggregates;
  MemberFilter: MemberFilter;
  MemberInput: MemberInput;
  MemberMaxAggregates: MemberMaxAggregates;
  MemberMinAggregates: MemberMinAggregates;
  MemberPatch: MemberPatch;
  MemberStddevPopulationAggregates: MemberStddevPopulationAggregates;
  MemberStddevSampleAggregates: MemberStddevSampleAggregates;
  MemberSumAggregates: MemberSumAggregates;
  MemberVariancePopulationAggregates: MemberVariancePopulationAggregates;
  MemberVarianceSampleAggregates: MemberVarianceSampleAggregates;
  MembersConnection: MembersConnection;
  MembersEdge: MembersEdge;
  MembersHavingAverageInput: MembersHavingAverageInput;
  MembersHavingDistinctCountInput: MembersHavingDistinctCountInput;
  MembersHavingInput: MembersHavingInput;
  MembersHavingMaxInput: MembersHavingMaxInput;
  MembersHavingMinInput: MembersHavingMinInput;
  MembersHavingStddevPopulationInput: MembersHavingStddevPopulationInput;
  MembersHavingStddevSampleInput: MembersHavingStddevSampleInput;
  MembersHavingSumInput: MembersHavingSumInput;
  MembersHavingVariancePopulationInput: MembersHavingVariancePopulationInput;
  MembersHavingVarianceSampleInput: MembersHavingVarianceSampleInput;
  Message: Message;
  MessageAggregates: MessageAggregates;
  MessageAverageAggregates: MessageAverageAggregates;
  MessageCondition: MessageCondition;
  MessageDistinctCountAggregates: MessageDistinctCountAggregates;
  MessageFilter: MessageFilter;
  MessageInput: MessageInput;
  MessageMaxAggregates: MessageMaxAggregates;
  MessageMinAggregates: MessageMinAggregates;
  MessageStddevPopulationAggregates: MessageStddevPopulationAggregates;
  MessageStddevSampleAggregates: MessageStddevSampleAggregates;
  MessageSumAggregates: MessageSumAggregates;
  MessageVariancePopulationAggregates: MessageVariancePopulationAggregates;
  MessageVarianceSampleAggregates: MessageVarianceSampleAggregates;
  MessagesConnection: MessagesConnection;
  MessagesEdge: MessagesEdge;
  MessagesHavingAverageInput: MessagesHavingAverageInput;
  MessagesHavingDistinctCountInput: MessagesHavingDistinctCountInput;
  MessagesHavingInput: MessagesHavingInput;
  MessagesHavingMaxInput: MessagesHavingMaxInput;
  MessagesHavingMinInput: MessagesHavingMinInput;
  MessagesHavingStddevPopulationInput: MessagesHavingStddevPopulationInput;
  MessagesHavingStddevSampleInput: MessagesHavingStddevSampleInput;
  MessagesHavingSumInput: MessagesHavingSumInput;
  MessagesHavingVariancePopulationInput: MessagesHavingVariancePopulationInput;
  MessagesHavingVarianceSampleInput: MessagesHavingVarianceSampleInput;
  ModLog: ModLog;
  ModLogAggregates: ModLogAggregates;
  ModLogAverageAggregates: ModLogAverageAggregates;
  ModLogCondition: ModLogCondition;
  ModLogDistinctCountAggregates: ModLogDistinctCountAggregates;
  ModLogFilter: ModLogFilter;
  ModLogInput: ModLogInput;
  ModLogMaxAggregates: ModLogMaxAggregates;
  ModLogMinAggregates: ModLogMinAggregates;
  ModLogPatch: ModLogPatch;
  ModLogStddevPopulationAggregates: ModLogStddevPopulationAggregates;
  ModLogStddevSampleAggregates: ModLogStddevSampleAggregates;
  ModLogSumAggregates: ModLogSumAggregates;
  ModLogVariancePopulationAggregates: ModLogVariancePopulationAggregates;
  ModLogVarianceSampleAggregates: ModLogVarianceSampleAggregates;
  ModLogsConnection: ModLogsConnection;
  ModLogsEdge: ModLogsEdge;
  ModLogsHavingAverageInput: ModLogsHavingAverageInput;
  ModLogsHavingDistinctCountInput: ModLogsHavingDistinctCountInput;
  ModLogsHavingInput: ModLogsHavingInput;
  ModLogsHavingMaxInput: ModLogsHavingMaxInput;
  ModLogsHavingMinInput: ModLogsHavingMinInput;
  ModLogsHavingStddevPopulationInput: ModLogsHavingStddevPopulationInput;
  ModLogsHavingStddevSampleInput: ModLogsHavingStddevSampleInput;
  ModLogsHavingSumInput: ModLogsHavingSumInput;
  ModLogsHavingVariancePopulationInput: ModLogsHavingVariancePopulationInput;
  ModLogsHavingVarianceSampleInput: ModLogsHavingVarianceSampleInput;
  Mutation: {};
  Mute: Mute;
  MuteAggregates: MuteAggregates;
  MuteAverageAggregates: MuteAverageAggregates;
  MuteCondition: MuteCondition;
  MuteDistinctCountAggregates: MuteDistinctCountAggregates;
  MuteFilter: MuteFilter;
  MuteInput: MuteInput;
  MuteMaxAggregates: MuteMaxAggregates;
  MuteMinAggregates: MuteMinAggregates;
  MutePatch: MutePatch;
  MuteStddevPopulationAggregates: MuteStddevPopulationAggregates;
  MuteStddevSampleAggregates: MuteStddevSampleAggregates;
  MuteSumAggregates: MuteSumAggregates;
  MuteVariancePopulationAggregates: MuteVariancePopulationAggregates;
  MuteVarianceSampleAggregates: MuteVarianceSampleAggregates;
  MutesConnection: MutesConnection;
  MutesEdge: MutesEdge;
  MutesHavingAverageInput: MutesHavingAverageInput;
  MutesHavingDistinctCountInput: MutesHavingDistinctCountInput;
  MutesHavingInput: MutesHavingInput;
  MutesHavingMaxInput: MutesHavingMaxInput;
  MutesHavingMinInput: MutesHavingMinInput;
  MutesHavingStddevPopulationInput: MutesHavingStddevPopulationInput;
  MutesHavingStddevSampleInput: MutesHavingStddevSampleInput;
  MutesHavingSumInput: MutesHavingSumInput;
  MutesHavingVariancePopulationInput: MutesHavingVariancePopulationInput;
  MutesHavingVarianceSampleInput: MutesHavingVarianceSampleInput;
  Node: ResolversParentTypes['BotStat'] | ResolversParentTypes['CachedGuild'] | ResolversParentTypes['CachedUser'] | ResolversParentTypes['Feed'] | ResolversParentTypes['FeedItem'] | ResolversParentTypes['FeedSubscription'] | ResolversParentTypes['GuildBan'] | ResolversParentTypes['GuildConfig'] | ResolversParentTypes['Member'] | ResolversParentTypes['ModLog'] | ResolversParentTypes['Mute'] | ResolversParentTypes['Notification'] | ResolversParentTypes['Query'] | ResolversParentTypes['Reminder'] | ResolversParentTypes['RoleMenu'] | ResolversParentTypes['Tag'] | ResolversParentTypes['User'] | ResolversParentTypes['UserLevel'] | ResolversParentTypes['WebUser'] | ResolversParentTypes['WebUserGuild'];
  Notification: Notification;
  NotificationAggregates: NotificationAggregates;
  NotificationAverageAggregates: NotificationAverageAggregates;
  NotificationCondition: NotificationCondition;
  NotificationDistinctCountAggregates: NotificationDistinctCountAggregates;
  NotificationFilter: NotificationFilter;
  NotificationInput: NotificationInput;
  NotificationMaxAggregates: NotificationMaxAggregates;
  NotificationMinAggregates: NotificationMinAggregates;
  NotificationPatch: NotificationPatch;
  NotificationStddevPopulationAggregates: NotificationStddevPopulationAggregates;
  NotificationStddevSampleAggregates: NotificationStddevSampleAggregates;
  NotificationSumAggregates: NotificationSumAggregates;
  NotificationVariancePopulationAggregates: NotificationVariancePopulationAggregates;
  NotificationVarianceSampleAggregates: NotificationVarianceSampleAggregates;
  NotificationsConnection: NotificationsConnection;
  NotificationsEdge: NotificationsEdge;
  NotificationsHavingAverageInput: NotificationsHavingAverageInput;
  NotificationsHavingDistinctCountInput: NotificationsHavingDistinctCountInput;
  NotificationsHavingInput: NotificationsHavingInput;
  NotificationsHavingMaxInput: NotificationsHavingMaxInput;
  NotificationsHavingMinInput: NotificationsHavingMinInput;
  NotificationsHavingStddevPopulationInput: NotificationsHavingStddevPopulationInput;
  NotificationsHavingStddevSampleInput: NotificationsHavingStddevSampleInput;
  NotificationsHavingSumInput: NotificationsHavingSumInput;
  NotificationsHavingVariancePopulationInput: NotificationsHavingVariancePopulationInput;
  NotificationsHavingVarianceSampleInput: NotificationsHavingVarianceSampleInput;
  NotificationsStartingWithConnection: NotificationsStartingWithConnection;
  NotificationsStartingWithEdge: NotificationsStartingWithEdge;
  PageInfo: PageInfo;
  Query: {};
  RedisGuild: RedisGuild;
  RedisGuildRole: RedisGuildRole;
  RedisRoleTags: RedisRoleTags;
  Reminder: Reminder;
  ReminderAggregates: ReminderAggregates;
  ReminderAverageAggregates: ReminderAverageAggregates;
  ReminderCondition: ReminderCondition;
  ReminderDistinctCountAggregates: ReminderDistinctCountAggregates;
  ReminderFilter: ReminderFilter;
  ReminderInput: ReminderInput;
  ReminderMaxAggregates: ReminderMaxAggregates;
  ReminderMinAggregates: ReminderMinAggregates;
  ReminderPatch: ReminderPatch;
  ReminderStddevPopulationAggregates: ReminderStddevPopulationAggregates;
  ReminderStddevSampleAggregates: ReminderStddevSampleAggregates;
  ReminderSumAggregates: ReminderSumAggregates;
  ReminderVariancePopulationAggregates: ReminderVariancePopulationAggregates;
  ReminderVarianceSampleAggregates: ReminderVarianceSampleAggregates;
  RemindersConnection: RemindersConnection;
  RemindersEdge: RemindersEdge;
  RemindersHavingAverageInput: RemindersHavingAverageInput;
  RemindersHavingDistinctCountInput: RemindersHavingDistinctCountInput;
  RemindersHavingInput: RemindersHavingInput;
  RemindersHavingMaxInput: RemindersHavingMaxInput;
  RemindersHavingMinInput: RemindersHavingMinInput;
  RemindersHavingStddevPopulationInput: RemindersHavingStddevPopulationInput;
  RemindersHavingStddevSampleInput: RemindersHavingStddevSampleInput;
  RemindersHavingSumInput: RemindersHavingSumInput;
  RemindersHavingVariancePopulationInput: RemindersHavingVariancePopulationInput;
  RemindersHavingVarianceSampleInput: RemindersHavingVarianceSampleInput;
  RoleMenu: RoleMenu;
  RoleMenuAggregates: RoleMenuAggregates;
  RoleMenuAverageAggregates: RoleMenuAverageAggregates;
  RoleMenuCondition: RoleMenuCondition;
  RoleMenuDistinctCountAggregates: RoleMenuDistinctCountAggregates;
  RoleMenuFilter: RoleMenuFilter;
  RoleMenuInput: RoleMenuInput;
  RoleMenuMaxAggregates: RoleMenuMaxAggregates;
  RoleMenuMinAggregates: RoleMenuMinAggregates;
  RoleMenuPatch: RoleMenuPatch;
  RoleMenuStddevPopulationAggregates: RoleMenuStddevPopulationAggregates;
  RoleMenuStddevSampleAggregates: RoleMenuStddevSampleAggregates;
  RoleMenuSumAggregates: RoleMenuSumAggregates;
  RoleMenuVariancePopulationAggregates: RoleMenuVariancePopulationAggregates;
  RoleMenuVarianceSampleAggregates: RoleMenuVarianceSampleAggregates;
  RoleMenusConnection: RoleMenusConnection;
  RoleMenusEdge: RoleMenusEdge;
  RoleMenusHavingAverageInput: RoleMenusHavingAverageInput;
  RoleMenusHavingDistinctCountInput: RoleMenusHavingDistinctCountInput;
  RoleMenusHavingInput: RoleMenusHavingInput;
  RoleMenusHavingMaxInput: RoleMenusHavingMaxInput;
  RoleMenusHavingMinInput: RoleMenusHavingMinInput;
  RoleMenusHavingStddevPopulationInput: RoleMenusHavingStddevPopulationInput;
  RoleMenusHavingStddevSampleInput: RoleMenusHavingStddevSampleInput;
  RoleMenusHavingSumInput: RoleMenusHavingSumInput;
  RoleMenusHavingVariancePopulationInput: RoleMenusHavingVariancePopulationInput;
  RoleMenusHavingVarianceSampleInput: RoleMenusHavingVarianceSampleInput;
  String: Scalars['String'];
  StringFilter: StringFilter;
  StringListFilter: StringListFilter;
  Tag: Tag;
  TagAggregates: TagAggregates;
  TagAverageAggregates: TagAverageAggregates;
  TagCondition: TagCondition;
  TagDistinctCountAggregates: TagDistinctCountAggregates;
  TagFilter: TagFilter;
  TagInput: TagInput;
  TagMaxAggregates: TagMaxAggregates;
  TagMinAggregates: TagMinAggregates;
  TagPatch: TagPatch;
  TagStddevPopulationAggregates: TagStddevPopulationAggregates;
  TagStddevSampleAggregates: TagStddevSampleAggregates;
  TagSumAggregates: TagSumAggregates;
  TagVariancePopulationAggregates: TagVariancePopulationAggregates;
  TagVarianceSampleAggregates: TagVarianceSampleAggregates;
  TagsConnection: TagsConnection;
  TagsEdge: TagsEdge;
  TagsHavingAverageInput: TagsHavingAverageInput;
  TagsHavingDistinctCountInput: TagsHavingDistinctCountInput;
  TagsHavingInput: TagsHavingInput;
  TagsHavingMaxInput: TagsHavingMaxInput;
  TagsHavingMinInput: TagsHavingMinInput;
  TagsHavingStddevPopulationInput: TagsHavingStddevPopulationInput;
  TagsHavingStddevSampleInput: TagsHavingStddevSampleInput;
  TagsHavingSumInput: TagsHavingSumInput;
  TagsHavingVariancePopulationInput: TagsHavingVariancePopulationInput;
  TagsHavingVarianceSampleInput: TagsHavingVarianceSampleInput;
  TimeframeUserLevelEdge: TimeframeUserLevelEdge;
  TimeframeUserLevelsConnection: TimeframeUserLevelsConnection;
  TimeframeUserLevelsRecord: TimeframeUserLevelsRecord;
  TimeframeUserLevelsRecordFilter: TimeframeUserLevelsRecordFilter;
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
  UpdateRoleMenuByGuildIdAndMenuNameInput: UpdateRoleMenuByGuildIdAndMenuNameInput;
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
  UserAggregates: UserAggregates;
  UserAverageAggregates: UserAverageAggregates;
  UserCondition: UserCondition;
  UserDistinctCountAggregates: UserDistinctCountAggregates;
  UserFilter: UserFilter;
  UserGuildRankResult: UserGuildRankResult;
  UserInput: UserInput;
  UserLevel: UserLevel;
  UserLevelAggregates: UserLevelAggregates;
  UserLevelAverageAggregates: UserLevelAverageAggregates;
  UserLevelCondition: UserLevelCondition;
  UserLevelDistinctCountAggregates: UserLevelDistinctCountAggregates;
  UserLevelFilter: UserLevelFilter;
  UserLevelInput: UserLevelInput;
  UserLevelMaxAggregates: UserLevelMaxAggregates;
  UserLevelMinAggregates: UserLevelMinAggregates;
  UserLevelPatch: UserLevelPatch;
  UserLevelStddevPopulationAggregates: UserLevelStddevPopulationAggregates;
  UserLevelStddevSampleAggregates: UserLevelStddevSampleAggregates;
  UserLevelSumAggregates: UserLevelSumAggregates;
  UserLevelVariancePopulationAggregates: UserLevelVariancePopulationAggregates;
  UserLevelVarianceSampleAggregates: UserLevelVarianceSampleAggregates;
  UserLevelsConnection: UserLevelsConnection;
  UserLevelsEdge: UserLevelsEdge;
  UserLevelsHavingAverageInput: UserLevelsHavingAverageInput;
  UserLevelsHavingDistinctCountInput: UserLevelsHavingDistinctCountInput;
  UserLevelsHavingInput: UserLevelsHavingInput;
  UserLevelsHavingMaxInput: UserLevelsHavingMaxInput;
  UserLevelsHavingMinInput: UserLevelsHavingMinInput;
  UserLevelsHavingStddevPopulationInput: UserLevelsHavingStddevPopulationInput;
  UserLevelsHavingStddevSampleInput: UserLevelsHavingStddevSampleInput;
  UserLevelsHavingSumInput: UserLevelsHavingSumInput;
  UserLevelsHavingVariancePopulationInput: UserLevelsHavingVariancePopulationInput;
  UserLevelsHavingVarianceSampleInput: UserLevelsHavingVarianceSampleInput;
  UserMaxAggregates: UserMaxAggregates;
  UserMinAggregates: UserMinAggregates;
  UserPatch: UserPatch;
  UserStddevPopulationAggregates: UserStddevPopulationAggregates;
  UserStddevSampleAggregates: UserStddevSampleAggregates;
  UserSumAggregates: UserSumAggregates;
  UserVariancePopulationAggregates: UserVariancePopulationAggregates;
  UserVarianceSampleAggregates: UserVarianceSampleAggregates;
  UsersConnection: UsersConnection;
  UsersEdge: UsersEdge;
  UsersHavingAverageInput: UsersHavingAverageInput;
  UsersHavingDistinctCountInput: UsersHavingDistinctCountInput;
  UsersHavingInput: UsersHavingInput;
  UsersHavingMaxInput: UsersHavingMaxInput;
  UsersHavingMinInput: UsersHavingMinInput;
  UsersHavingStddevPopulationInput: UsersHavingStddevPopulationInput;
  UsersHavingStddevSampleInput: UsersHavingStddevSampleInput;
  UsersHavingSumInput: UsersHavingSumInput;
  UsersHavingVariancePopulationInput: UsersHavingVariancePopulationInput;
  UsersHavingVarianceSampleInput: UsersHavingVarianceSampleInput;
  WebUser: WebUser;
  WebUserAggregates: WebUserAggregates;
  WebUserAverageAggregates: WebUserAverageAggregates;
  WebUserCondition: WebUserCondition;
  WebUserDistinctCountAggregates: WebUserDistinctCountAggregates;
  WebUserFilter: WebUserFilter;
  WebUserGuild: WebUserGuild;
  WebUserGuildAggregates: WebUserGuildAggregates;
  WebUserGuildAverageAggregates: WebUserGuildAverageAggregates;
  WebUserGuildCondition: WebUserGuildCondition;
  WebUserGuildDistinctCountAggregates: WebUserGuildDistinctCountAggregates;
  WebUserGuildFilter: WebUserGuildFilter;
  WebUserGuildInput: WebUserGuildInput;
  WebUserGuildMaxAggregates: WebUserGuildMaxAggregates;
  WebUserGuildMinAggregates: WebUserGuildMinAggregates;
  WebUserGuildPatch: WebUserGuildPatch;
  WebUserGuildStddevPopulationAggregates: WebUserGuildStddevPopulationAggregates;
  WebUserGuildStddevSampleAggregates: WebUserGuildStddevSampleAggregates;
  WebUserGuildSumAggregates: WebUserGuildSumAggregates;
  WebUserGuildVariancePopulationAggregates: WebUserGuildVariancePopulationAggregates;
  WebUserGuildVarianceSampleAggregates: WebUserGuildVarianceSampleAggregates;
  WebUserGuildsConnection: WebUserGuildsConnection;
  WebUserGuildsEdge: WebUserGuildsEdge;
  WebUserGuildsHavingAverageInput: WebUserGuildsHavingAverageInput;
  WebUserGuildsHavingDistinctCountInput: WebUserGuildsHavingDistinctCountInput;
  WebUserGuildsHavingInput: WebUserGuildsHavingInput;
  WebUserGuildsHavingMaxInput: WebUserGuildsHavingMaxInput;
  WebUserGuildsHavingMinInput: WebUserGuildsHavingMinInput;
  WebUserGuildsHavingStddevPopulationInput: WebUserGuildsHavingStddevPopulationInput;
  WebUserGuildsHavingStddevSampleInput: WebUserGuildsHavingStddevSampleInput;
  WebUserGuildsHavingSumInput: WebUserGuildsHavingSumInput;
  WebUserGuildsHavingVariancePopulationInput: WebUserGuildsHavingVariancePopulationInput;
  WebUserGuildsHavingVarianceSampleInput: WebUserGuildsHavingVarianceSampleInput;
  WebUserInput: WebUserInput;
  WebUserMaxAggregates: WebUserMaxAggregates;
  WebUserMinAggregates: WebUserMinAggregates;
  WebUserPatch: WebUserPatch;
  WebUserStddevPopulationAggregates: WebUserStddevPopulationAggregates;
  WebUserStddevSampleAggregates: WebUserStddevSampleAggregates;
  WebUserSumAggregates: WebUserSumAggregates;
  WebUserVariancePopulationAggregates: WebUserVariancePopulationAggregates;
  WebUserVarianceSampleAggregates: WebUserVarianceSampleAggregates;
  WebUsersConnection: WebUsersConnection;
  WebUsersEdge: WebUsersEdge;
  WebUsersHavingAverageInput: WebUsersHavingAverageInput;
  WebUsersHavingDistinctCountInput: WebUsersHavingDistinctCountInput;
  WebUsersHavingInput: WebUsersHavingInput;
  WebUsersHavingMaxInput: WebUsersHavingMaxInput;
  WebUsersHavingMinInput: WebUsersHavingMinInput;
  WebUsersHavingStddevPopulationInput: WebUsersHavingStddevPopulationInput;
  WebUsersHavingStddevSampleInput: WebUsersHavingStddevSampleInput;
  WebUsersHavingSumInput: WebUsersHavingSumInput;
  WebUsersHavingVariancePopulationInput: WebUsersHavingVariancePopulationInput;
  WebUsersHavingVarianceSampleInput: WebUsersHavingVarianceSampleInput;
};

export interface BigFloatScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigFloat'], any> {
  name: 'BigFloat';
}

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

export type BotStatAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['BotStatAggregates'] = ResolversParentTypes['BotStatAggregates']> = {
  average?: Resolver<Maybe<ResolversTypes['BotStatAverageAggregates']>, ParentType, ContextType>;
  distinctCount?: Resolver<Maybe<ResolversTypes['BotStatDistinctCountAggregates']>, ParentType, ContextType>;
  keys?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  max?: Resolver<Maybe<ResolversTypes['BotStatMaxAggregates']>, ParentType, ContextType>;
  min?: Resolver<Maybe<ResolversTypes['BotStatMinAggregates']>, ParentType, ContextType>;
  stddevPopulation?: Resolver<Maybe<ResolversTypes['BotStatStddevPopulationAggregates']>, ParentType, ContextType>;
  stddevSample?: Resolver<Maybe<ResolversTypes['BotStatStddevSampleAggregates']>, ParentType, ContextType>;
  sum?: Resolver<Maybe<ResolversTypes['BotStatSumAggregates']>, ParentType, ContextType>;
  variancePopulation?: Resolver<Maybe<ResolversTypes['BotStatVariancePopulationAggregates']>, ParentType, ContextType>;
  varianceSample?: Resolver<Maybe<ResolversTypes['BotStatVarianceSampleAggregates']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BotStatAverageAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['BotStatAverageAggregates'] = ResolversParentTypes['BotStatAverageAggregates']> = {
  count?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BotStatDistinctCountAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['BotStatDistinctCountAggregates'] = ResolversParentTypes['BotStatDistinctCountAggregates']> = {
  category?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  count?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BotStatMaxAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['BotStatMaxAggregates'] = ResolversParentTypes['BotStatMaxAggregates']> = {
  count?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BotStatMinAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['BotStatMinAggregates'] = ResolversParentTypes['BotStatMinAggregates']> = {
  count?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BotStatStddevPopulationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['BotStatStddevPopulationAggregates'] = ResolversParentTypes['BotStatStddevPopulationAggregates']> = {
  count?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BotStatStddevSampleAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['BotStatStddevSampleAggregates'] = ResolversParentTypes['BotStatStddevSampleAggregates']> = {
  count?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BotStatSumAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['BotStatSumAggregates'] = ResolversParentTypes['BotStatSumAggregates']> = {
  count?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BotStatVariancePopulationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['BotStatVariancePopulationAggregates'] = ResolversParentTypes['BotStatVariancePopulationAggregates']> = {
  count?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BotStatVarianceSampleAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['BotStatVarianceSampleAggregates'] = ResolversParentTypes['BotStatVarianceSampleAggregates']> = {
  count?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BotStatsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['BotStatsConnection'] = ResolversParentTypes['BotStatsConnection']> = {
  aggregates?: Resolver<Maybe<ResolversTypes['BotStatAggregates']>, ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['BotStatsEdge']>, ParentType, ContextType>;
  groupedAggregates?: Resolver<Maybe<Array<ResolversTypes['BotStatAggregates']>>, ParentType, ContextType, RequireFields<BotStatsConnectionGroupedAggregatesArgs, 'groupBy'>>;
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

export type FeedAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedAggregates'] = ResolversParentTypes['FeedAggregates']> = {
  distinctCount?: Resolver<Maybe<ResolversTypes['FeedDistinctCountAggregates']>, ParentType, ContextType>;
  keys?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FeedDistinctCountAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedDistinctCountAggregates'] = ResolversParentTypes['FeedDistinctCountAggregates']> = {
  feedId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FeedItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedItem'] = ResolversParentTypes['FeedItem']> = {
  feedId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  itemId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FeedItemAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedItemAggregates'] = ResolversParentTypes['FeedItemAggregates']> = {
  distinctCount?: Resolver<Maybe<ResolversTypes['FeedItemDistinctCountAggregates']>, ParentType, ContextType>;
  keys?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FeedItemDistinctCountAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedItemDistinctCountAggregates'] = ResolversParentTypes['FeedItemDistinctCountAggregates']> = {
  feedId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  itemId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FeedItemsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedItemsConnection'] = ResolversParentTypes['FeedItemsConnection']> = {
  aggregates?: Resolver<Maybe<ResolversTypes['FeedItemAggregates']>, ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['FeedItemsEdge']>, ParentType, ContextType>;
  groupedAggregates?: Resolver<Maybe<Array<ResolversTypes['FeedItemAggregates']>>, ParentType, ContextType, RequireFields<FeedItemsConnectionGroupedAggregatesArgs, 'groupBy'>>;
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

export type FeedSubscriptionAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedSubscriptionAggregates'] = ResolversParentTypes['FeedSubscriptionAggregates']> = {
  average?: Resolver<Maybe<ResolversTypes['FeedSubscriptionAverageAggregates']>, ParentType, ContextType>;
  distinctCount?: Resolver<Maybe<ResolversTypes['FeedSubscriptionDistinctCountAggregates']>, ParentType, ContextType>;
  keys?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  max?: Resolver<Maybe<ResolversTypes['FeedSubscriptionMaxAggregates']>, ParentType, ContextType>;
  min?: Resolver<Maybe<ResolversTypes['FeedSubscriptionMinAggregates']>, ParentType, ContextType>;
  stddevPopulation?: Resolver<Maybe<ResolversTypes['FeedSubscriptionStddevPopulationAggregates']>, ParentType, ContextType>;
  stddevSample?: Resolver<Maybe<ResolversTypes['FeedSubscriptionStddevSampleAggregates']>, ParentType, ContextType>;
  sum?: Resolver<Maybe<ResolversTypes['FeedSubscriptionSumAggregates']>, ParentType, ContextType>;
  variancePopulation?: Resolver<Maybe<ResolversTypes['FeedSubscriptionVariancePopulationAggregates']>, ParentType, ContextType>;
  varianceSample?: Resolver<Maybe<ResolversTypes['FeedSubscriptionVarianceSampleAggregates']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FeedSubscriptionAverageAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedSubscriptionAverageAggregates'] = ResolversParentTypes['FeedSubscriptionAverageAggregates']> = {
  channelId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  mentionRole?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FeedSubscriptionDistinctCountAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedSubscriptionDistinctCountAggregates'] = ResolversParentTypes['FeedSubscriptionDistinctCountAggregates']> = {
  channelId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  feedId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  mentionRole?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FeedSubscriptionMaxAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedSubscriptionMaxAggregates'] = ResolversParentTypes['FeedSubscriptionMaxAggregates']> = {
  channelId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  mentionRole?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FeedSubscriptionMinAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedSubscriptionMinAggregates'] = ResolversParentTypes['FeedSubscriptionMinAggregates']> = {
  channelId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  mentionRole?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FeedSubscriptionStddevPopulationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedSubscriptionStddevPopulationAggregates'] = ResolversParentTypes['FeedSubscriptionStddevPopulationAggregates']> = {
  channelId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  mentionRole?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FeedSubscriptionStddevSampleAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedSubscriptionStddevSampleAggregates'] = ResolversParentTypes['FeedSubscriptionStddevSampleAggregates']> = {
  channelId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  mentionRole?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FeedSubscriptionSumAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedSubscriptionSumAggregates'] = ResolversParentTypes['FeedSubscriptionSumAggregates']> = {
  channelId?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  guildId?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  mentionRole?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FeedSubscriptionVariancePopulationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedSubscriptionVariancePopulationAggregates'] = ResolversParentTypes['FeedSubscriptionVariancePopulationAggregates']> = {
  channelId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  mentionRole?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FeedSubscriptionVarianceSampleAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedSubscriptionVarianceSampleAggregates'] = ResolversParentTypes['FeedSubscriptionVarianceSampleAggregates']> = {
  channelId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  mentionRole?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FeedSubscriptionsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedSubscriptionsConnection'] = ResolversParentTypes['FeedSubscriptionsConnection']> = {
  aggregates?: Resolver<Maybe<ResolversTypes['FeedSubscriptionAggregates']>, ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['FeedSubscriptionsEdge']>, ParentType, ContextType>;
  groupedAggregates?: Resolver<Maybe<Array<ResolversTypes['FeedSubscriptionAggregates']>>, ParentType, ContextType, RequireFields<FeedSubscriptionsConnectionGroupedAggregatesArgs, 'groupBy'>>;
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
  aggregates?: Resolver<Maybe<ResolversTypes['FeedAggregates']>, ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['FeedsEdge']>, ParentType, ContextType>;
  groupedAggregates?: Resolver<Maybe<Array<ResolversTypes['FeedAggregates']>>, ParentType, ContextType, RequireFields<FeedsConnectionGroupedAggregatesArgs, 'groupBy'>>;
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

export type GuildBanAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuildBanAggregates'] = ResolversParentTypes['GuildBanAggregates']> = {
  average?: Resolver<Maybe<ResolversTypes['GuildBanAverageAggregates']>, ParentType, ContextType>;
  distinctCount?: Resolver<Maybe<ResolversTypes['GuildBanDistinctCountAggregates']>, ParentType, ContextType>;
  keys?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  max?: Resolver<Maybe<ResolversTypes['GuildBanMaxAggregates']>, ParentType, ContextType>;
  min?: Resolver<Maybe<ResolversTypes['GuildBanMinAggregates']>, ParentType, ContextType>;
  stddevPopulation?: Resolver<Maybe<ResolversTypes['GuildBanStddevPopulationAggregates']>, ParentType, ContextType>;
  stddevSample?: Resolver<Maybe<ResolversTypes['GuildBanStddevSampleAggregates']>, ParentType, ContextType>;
  sum?: Resolver<Maybe<ResolversTypes['GuildBanSumAggregates']>, ParentType, ContextType>;
  variancePopulation?: Resolver<Maybe<ResolversTypes['GuildBanVariancePopulationAggregates']>, ParentType, ContextType>;
  varianceSample?: Resolver<Maybe<ResolversTypes['GuildBanVarianceSampleAggregates']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuildBanAverageAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuildBanAverageAggregates'] = ResolversParentTypes['GuildBanAverageAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuildBanDistinctCountAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuildBanDistinctCountAggregates'] = ResolversParentTypes['GuildBanDistinctCountAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuildBanMaxAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuildBanMaxAggregates'] = ResolversParentTypes['GuildBanMaxAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuildBanMinAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuildBanMinAggregates'] = ResolversParentTypes['GuildBanMinAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuildBanStddevPopulationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuildBanStddevPopulationAggregates'] = ResolversParentTypes['GuildBanStddevPopulationAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuildBanStddevSampleAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuildBanStddevSampleAggregates'] = ResolversParentTypes['GuildBanStddevSampleAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuildBanSumAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuildBanSumAggregates'] = ResolversParentTypes['GuildBanSumAggregates']> = {
  guildId?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuildBanVariancePopulationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuildBanVariancePopulationAggregates'] = ResolversParentTypes['GuildBanVariancePopulationAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuildBanVarianceSampleAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuildBanVarianceSampleAggregates'] = ResolversParentTypes['GuildBanVarianceSampleAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuildBansConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuildBansConnection'] = ResolversParentTypes['GuildBansConnection']> = {
  aggregates?: Resolver<Maybe<ResolversTypes['GuildBanAggregates']>, ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['GuildBansEdge']>, ParentType, ContextType>;
  groupedAggregates?: Resolver<Maybe<Array<ResolversTypes['GuildBanAggregates']>>, ParentType, ContextType, RequireFields<GuildBansConnectionGroupedAggregatesArgs, 'groupBy'>>;
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

export type GuildConfigAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuildConfigAggregates'] = ResolversParentTypes['GuildConfigAggregates']> = {
  average?: Resolver<Maybe<ResolversTypes['GuildConfigAverageAggregates']>, ParentType, ContextType>;
  distinctCount?: Resolver<Maybe<ResolversTypes['GuildConfigDistinctCountAggregates']>, ParentType, ContextType>;
  keys?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  max?: Resolver<Maybe<ResolversTypes['GuildConfigMaxAggregates']>, ParentType, ContextType>;
  min?: Resolver<Maybe<ResolversTypes['GuildConfigMinAggregates']>, ParentType, ContextType>;
  stddevPopulation?: Resolver<Maybe<ResolversTypes['GuildConfigStddevPopulationAggregates']>, ParentType, ContextType>;
  stddevSample?: Resolver<Maybe<ResolversTypes['GuildConfigStddevSampleAggregates']>, ParentType, ContextType>;
  sum?: Resolver<Maybe<ResolversTypes['GuildConfigSumAggregates']>, ParentType, ContextType>;
  variancePopulation?: Resolver<Maybe<ResolversTypes['GuildConfigVariancePopulationAggregates']>, ParentType, ContextType>;
  varianceSample?: Resolver<Maybe<ResolversTypes['GuildConfigVarianceSampleAggregates']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuildConfigAverageAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuildConfigAverageAggregates'] = ResolversParentTypes['GuildConfigAverageAggregates']> = {
  id?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  logMember?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  logMod?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  logMsg?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  maxMention?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  msgChannel?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  muteDuration?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  muteRole?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  roleChannel?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuildConfigDistinctCountAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuildConfigDistinctCountAggregates'] = ResolversParentTypes['GuildConfigDistinctCountAggregates']> = {
  data?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  disabledChannels?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  inviteGuard?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  joinMsg?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  joinMsgEnabled?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  joinReact?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  leaveMsg?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  leaveMsgEnabled?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  logMember?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  logMemberEnabled?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  logMod?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  logModEnabled?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  logMsg?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  logMsgEnabled?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  maxMention?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  msgChannel?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  muteDmEnabled?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  muteDmText?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  muteDuration?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  muteRole?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  prefix?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  roleChannel?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  roleConfig?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  roleEnabled?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  warnDmEnabled?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  warnDmText?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuildConfigMaxAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuildConfigMaxAggregates'] = ResolversParentTypes['GuildConfigMaxAggregates']> = {
  id?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  logMember?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  logMod?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  logMsg?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  maxMention?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  msgChannel?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  muteDuration?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  muteRole?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  roleChannel?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuildConfigMinAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuildConfigMinAggregates'] = ResolversParentTypes['GuildConfigMinAggregates']> = {
  id?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  logMember?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  logMod?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  logMsg?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  maxMention?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  msgChannel?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  muteDuration?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  muteRole?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  roleChannel?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuildConfigStddevPopulationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuildConfigStddevPopulationAggregates'] = ResolversParentTypes['GuildConfigStddevPopulationAggregates']> = {
  id?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  logMember?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  logMod?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  logMsg?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  maxMention?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  msgChannel?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  muteDuration?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  muteRole?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  roleChannel?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuildConfigStddevSampleAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuildConfigStddevSampleAggregates'] = ResolversParentTypes['GuildConfigStddevSampleAggregates']> = {
  id?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  logMember?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  logMod?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  logMsg?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  maxMention?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  msgChannel?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  muteDuration?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  muteRole?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  roleChannel?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuildConfigSumAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuildConfigSumAggregates'] = ResolversParentTypes['GuildConfigSumAggregates']> = {
  id?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  logMember?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  logMod?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  logMsg?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  maxMention?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  msgChannel?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  muteDuration?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  muteRole?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  roleChannel?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuildConfigVariancePopulationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuildConfigVariancePopulationAggregates'] = ResolversParentTypes['GuildConfigVariancePopulationAggregates']> = {
  id?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  logMember?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  logMod?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  logMsg?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  maxMention?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  msgChannel?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  muteDuration?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  muteRole?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  roleChannel?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuildConfigVarianceSampleAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuildConfigVarianceSampleAggregates'] = ResolversParentTypes['GuildConfigVarianceSampleAggregates']> = {
  id?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  logMember?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  logMod?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  logMsg?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  maxMention?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  msgChannel?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  muteDuration?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  muteRole?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  roleChannel?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuildConfigsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuildConfigsConnection'] = ResolversParentTypes['GuildConfigsConnection']> = {
  aggregates?: Resolver<Maybe<ResolversTypes['GuildConfigAggregates']>, ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['GuildConfigsEdge']>, ParentType, ContextType>;
  groupedAggregates?: Resolver<Maybe<Array<ResolversTypes['GuildConfigAggregates']>>, ParentType, ContextType, RequireFields<GuildConfigsConnectionGroupedAggregatesArgs, 'groupBy'>>;
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

export type MemberAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['MemberAggregates'] = ResolversParentTypes['MemberAggregates']> = {
  average?: Resolver<Maybe<ResolversTypes['MemberAverageAggregates']>, ParentType, ContextType>;
  distinctCount?: Resolver<Maybe<ResolversTypes['MemberDistinctCountAggregates']>, ParentType, ContextType>;
  keys?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  max?: Resolver<Maybe<ResolversTypes['MemberMaxAggregates']>, ParentType, ContextType>;
  min?: Resolver<Maybe<ResolversTypes['MemberMinAggregates']>, ParentType, ContextType>;
  stddevPopulation?: Resolver<Maybe<ResolversTypes['MemberStddevPopulationAggregates']>, ParentType, ContextType>;
  stddevSample?: Resolver<Maybe<ResolversTypes['MemberStddevSampleAggregates']>, ParentType, ContextType>;
  sum?: Resolver<Maybe<ResolversTypes['MemberSumAggregates']>, ParentType, ContextType>;
  variancePopulation?: Resolver<Maybe<ResolversTypes['MemberVariancePopulationAggregates']>, ParentType, ContextType>;
  varianceSample?: Resolver<Maybe<ResolversTypes['MemberVarianceSampleAggregates']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MemberAverageAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['MemberAverageAggregates'] = ResolversParentTypes['MemberAverageAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MemberDistinctCountAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['MemberDistinctCountAggregates'] = ResolversParentTypes['MemberDistinctCountAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  joinTime?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MemberMaxAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['MemberMaxAggregates'] = ResolversParentTypes['MemberMaxAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MemberMinAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['MemberMinAggregates'] = ResolversParentTypes['MemberMinAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MemberStddevPopulationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['MemberStddevPopulationAggregates'] = ResolversParentTypes['MemberStddevPopulationAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MemberStddevSampleAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['MemberStddevSampleAggregates'] = ResolversParentTypes['MemberStddevSampleAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MemberSumAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['MemberSumAggregates'] = ResolversParentTypes['MemberSumAggregates']> = {
  guildId?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MemberVariancePopulationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['MemberVariancePopulationAggregates'] = ResolversParentTypes['MemberVariancePopulationAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MemberVarianceSampleAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['MemberVarianceSampleAggregates'] = ResolversParentTypes['MemberVarianceSampleAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MembersConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['MembersConnection'] = ResolversParentTypes['MembersConnection']> = {
  aggregates?: Resolver<Maybe<ResolversTypes['MemberAggregates']>, ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['MembersEdge']>, ParentType, ContextType>;
  groupedAggregates?: Resolver<Maybe<Array<ResolversTypes['MemberAggregates']>>, ParentType, ContextType, RequireFields<MembersConnectionGroupedAggregatesArgs, 'groupBy'>>;
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

export type MessageAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['MessageAggregates'] = ResolversParentTypes['MessageAggregates']> = {
  average?: Resolver<Maybe<ResolversTypes['MessageAverageAggregates']>, ParentType, ContextType>;
  distinctCount?: Resolver<Maybe<ResolversTypes['MessageDistinctCountAggregates']>, ParentType, ContextType>;
  keys?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  max?: Resolver<Maybe<ResolversTypes['MessageMaxAggregates']>, ParentType, ContextType>;
  min?: Resolver<Maybe<ResolversTypes['MessageMinAggregates']>, ParentType, ContextType>;
  stddevPopulation?: Resolver<Maybe<ResolversTypes['MessageStddevPopulationAggregates']>, ParentType, ContextType>;
  stddevSample?: Resolver<Maybe<ResolversTypes['MessageStddevSampleAggregates']>, ParentType, ContextType>;
  sum?: Resolver<Maybe<ResolversTypes['MessageSumAggregates']>, ParentType, ContextType>;
  variancePopulation?: Resolver<Maybe<ResolversTypes['MessageVariancePopulationAggregates']>, ParentType, ContextType>;
  varianceSample?: Resolver<Maybe<ResolversTypes['MessageVarianceSampleAggregates']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MessageAverageAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['MessageAverageAggregates'] = ResolversParentTypes['MessageAverageAggregates']> = {
  authorId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  channelId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  messageId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MessageDistinctCountAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['MessageDistinctCountAggregates'] = ResolversParentTypes['MessageDistinctCountAggregates']> = {
  authorId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  channelId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  content?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  created?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  messageId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  msg?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MessageMaxAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['MessageMaxAggregates'] = ResolversParentTypes['MessageMaxAggregates']> = {
  authorId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  channelId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  messageId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MessageMinAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['MessageMinAggregates'] = ResolversParentTypes['MessageMinAggregates']> = {
  authorId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  channelId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  messageId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MessageStddevPopulationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['MessageStddevPopulationAggregates'] = ResolversParentTypes['MessageStddevPopulationAggregates']> = {
  authorId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  channelId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  messageId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MessageStddevSampleAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['MessageStddevSampleAggregates'] = ResolversParentTypes['MessageStddevSampleAggregates']> = {
  authorId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  channelId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  messageId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MessageSumAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['MessageSumAggregates'] = ResolversParentTypes['MessageSumAggregates']> = {
  authorId?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  channelId?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  guildId?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  messageId?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MessageVariancePopulationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['MessageVariancePopulationAggregates'] = ResolversParentTypes['MessageVariancePopulationAggregates']> = {
  authorId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  channelId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  messageId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MessageVarianceSampleAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['MessageVarianceSampleAggregates'] = ResolversParentTypes['MessageVarianceSampleAggregates']> = {
  authorId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  channelId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  messageId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MessagesConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['MessagesConnection'] = ResolversParentTypes['MessagesConnection']> = {
  aggregates?: Resolver<Maybe<ResolversTypes['MessageAggregates']>, ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['MessagesEdge']>, ParentType, ContextType>;
  groupedAggregates?: Resolver<Maybe<Array<ResolversTypes['MessageAggregates']>>, ParentType, ContextType, RequireFields<MessagesConnectionGroupedAggregatesArgs, 'groupBy'>>;
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

export type ModLogAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['ModLogAggregates'] = ResolversParentTypes['ModLogAggregates']> = {
  average?: Resolver<Maybe<ResolversTypes['ModLogAverageAggregates']>, ParentType, ContextType>;
  distinctCount?: Resolver<Maybe<ResolversTypes['ModLogDistinctCountAggregates']>, ParentType, ContextType>;
  keys?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  max?: Resolver<Maybe<ResolversTypes['ModLogMaxAggregates']>, ParentType, ContextType>;
  min?: Resolver<Maybe<ResolversTypes['ModLogMinAggregates']>, ParentType, ContextType>;
  stddevPopulation?: Resolver<Maybe<ResolversTypes['ModLogStddevPopulationAggregates']>, ParentType, ContextType>;
  stddevSample?: Resolver<Maybe<ResolversTypes['ModLogStddevSampleAggregates']>, ParentType, ContextType>;
  sum?: Resolver<Maybe<ResolversTypes['ModLogSumAggregates']>, ParentType, ContextType>;
  variancePopulation?: Resolver<Maybe<ResolversTypes['ModLogVariancePopulationAggregates']>, ParentType, ContextType>;
  varianceSample?: Resolver<Maybe<ResolversTypes['ModLogVarianceSampleAggregates']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ModLogAverageAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['ModLogAverageAggregates'] = ResolversParentTypes['ModLogAverageAggregates']> = {
  caseId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  executorId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  msgId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ModLogDistinctCountAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['ModLogDistinctCountAggregates'] = ResolversParentTypes['ModLogDistinctCountAggregates']> = {
  action?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  actionTime?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  attachments?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  caseId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  executorId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  msgId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  pending?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  userTag?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ModLogMaxAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['ModLogMaxAggregates'] = ResolversParentTypes['ModLogMaxAggregates']> = {
  caseId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  executorId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  msgId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ModLogMinAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['ModLogMinAggregates'] = ResolversParentTypes['ModLogMinAggregates']> = {
  caseId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  executorId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  msgId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ModLogStddevPopulationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['ModLogStddevPopulationAggregates'] = ResolversParentTypes['ModLogStddevPopulationAggregates']> = {
  caseId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  executorId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  msgId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ModLogStddevSampleAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['ModLogStddevSampleAggregates'] = ResolversParentTypes['ModLogStddevSampleAggregates']> = {
  caseId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  executorId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  msgId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ModLogSumAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['ModLogSumAggregates'] = ResolversParentTypes['ModLogSumAggregates']> = {
  caseId?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  executorId?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  guildId?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  msgId?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ModLogVariancePopulationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['ModLogVariancePopulationAggregates'] = ResolversParentTypes['ModLogVariancePopulationAggregates']> = {
  caseId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  executorId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  msgId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ModLogVarianceSampleAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['ModLogVarianceSampleAggregates'] = ResolversParentTypes['ModLogVarianceSampleAggregates']> = {
  caseId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  executorId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  msgId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ModLogsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['ModLogsConnection'] = ResolversParentTypes['ModLogsConnection']> = {
  aggregates?: Resolver<Maybe<ResolversTypes['ModLogAggregates']>, ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['ModLogsEdge']>, ParentType, ContextType>;
  groupedAggregates?: Resolver<Maybe<Array<ResolversTypes['ModLogAggregates']>>, ParentType, ContextType, RequireFields<ModLogsConnectionGroupedAggregatesArgs, 'groupBy'>>;
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
  deleteRoleMenuByGuildIdAndMenuName?: Resolver<Maybe<ResolversTypes['DeleteRoleMenuPayload']>, ParentType, ContextType, RequireFields<MutationDeleteRoleMenuByGuildIdAndMenuNameArgs, 'input'>>;
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
  updateRoleMenuByGuildIdAndMenuName?: Resolver<Maybe<ResolversTypes['UpdateRoleMenuPayload']>, ParentType, ContextType, RequireFields<MutationUpdateRoleMenuByGuildIdAndMenuNameArgs, 'input'>>;
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

export type MuteAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['MuteAggregates'] = ResolversParentTypes['MuteAggregates']> = {
  average?: Resolver<Maybe<ResolversTypes['MuteAverageAggregates']>, ParentType, ContextType>;
  distinctCount?: Resolver<Maybe<ResolversTypes['MuteDistinctCountAggregates']>, ParentType, ContextType>;
  keys?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  max?: Resolver<Maybe<ResolversTypes['MuteMaxAggregates']>, ParentType, ContextType>;
  min?: Resolver<Maybe<ResolversTypes['MuteMinAggregates']>, ParentType, ContextType>;
  stddevPopulation?: Resolver<Maybe<ResolversTypes['MuteStddevPopulationAggregates']>, ParentType, ContextType>;
  stddevSample?: Resolver<Maybe<ResolversTypes['MuteStddevSampleAggregates']>, ParentType, ContextType>;
  sum?: Resolver<Maybe<ResolversTypes['MuteSumAggregates']>, ParentType, ContextType>;
  variancePopulation?: Resolver<Maybe<ResolversTypes['MuteVariancePopulationAggregates']>, ParentType, ContextType>;
  varianceSample?: Resolver<Maybe<ResolversTypes['MuteVarianceSampleAggregates']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MuteAverageAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['MuteAverageAggregates'] = ResolversParentTypes['MuteAverageAggregates']> = {
  caseId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MuteDistinctCountAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['MuteDistinctCountAggregates'] = ResolversParentTypes['MuteDistinctCountAggregates']> = {
  caseId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  endTime?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  pending?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  startTime?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MuteMaxAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['MuteMaxAggregates'] = ResolversParentTypes['MuteMaxAggregates']> = {
  caseId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MuteMinAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['MuteMinAggregates'] = ResolversParentTypes['MuteMinAggregates']> = {
  caseId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MuteStddevPopulationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['MuteStddevPopulationAggregates'] = ResolversParentTypes['MuteStddevPopulationAggregates']> = {
  caseId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MuteStddevSampleAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['MuteStddevSampleAggregates'] = ResolversParentTypes['MuteStddevSampleAggregates']> = {
  caseId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MuteSumAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['MuteSumAggregates'] = ResolversParentTypes['MuteSumAggregates']> = {
  caseId?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  guildId?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MuteVariancePopulationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['MuteVariancePopulationAggregates'] = ResolversParentTypes['MuteVariancePopulationAggregates']> = {
  caseId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MuteVarianceSampleAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['MuteVarianceSampleAggregates'] = ResolversParentTypes['MuteVarianceSampleAggregates']> = {
  caseId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutesConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['MutesConnection'] = ResolversParentTypes['MutesConnection']> = {
  aggregates?: Resolver<Maybe<ResolversTypes['MuteAggregates']>, ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['MutesEdge']>, ParentType, ContextType>;
  groupedAggregates?: Resolver<Maybe<Array<ResolversTypes['MuteAggregates']>>, ParentType, ContextType, RequireFields<MutesConnectionGroupedAggregatesArgs, 'groupBy'>>;
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

export type NotificationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotificationAggregates'] = ResolversParentTypes['NotificationAggregates']> = {
  average?: Resolver<Maybe<ResolversTypes['NotificationAverageAggregates']>, ParentType, ContextType>;
  distinctCount?: Resolver<Maybe<ResolversTypes['NotificationDistinctCountAggregates']>, ParentType, ContextType>;
  keys?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  max?: Resolver<Maybe<ResolversTypes['NotificationMaxAggregates']>, ParentType, ContextType>;
  min?: Resolver<Maybe<ResolversTypes['NotificationMinAggregates']>, ParentType, ContextType>;
  stddevPopulation?: Resolver<Maybe<ResolversTypes['NotificationStddevPopulationAggregates']>, ParentType, ContextType>;
  stddevSample?: Resolver<Maybe<ResolversTypes['NotificationStddevSampleAggregates']>, ParentType, ContextType>;
  sum?: Resolver<Maybe<ResolversTypes['NotificationSumAggregates']>, ParentType, ContextType>;
  variancePopulation?: Resolver<Maybe<ResolversTypes['NotificationVariancePopulationAggregates']>, ParentType, ContextType>;
  varianceSample?: Resolver<Maybe<ResolversTypes['NotificationVarianceSampleAggregates']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NotificationAverageAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotificationAverageAggregates'] = ResolversParentTypes['NotificationAverageAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NotificationDistinctCountAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotificationDistinctCountAggregates'] = ResolversParentTypes['NotificationDistinctCountAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  keyword?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NotificationMaxAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotificationMaxAggregates'] = ResolversParentTypes['NotificationMaxAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NotificationMinAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotificationMinAggregates'] = ResolversParentTypes['NotificationMinAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NotificationStddevPopulationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotificationStddevPopulationAggregates'] = ResolversParentTypes['NotificationStddevPopulationAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NotificationStddevSampleAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotificationStddevSampleAggregates'] = ResolversParentTypes['NotificationStddevSampleAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NotificationSumAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotificationSumAggregates'] = ResolversParentTypes['NotificationSumAggregates']> = {
  guildId?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NotificationVariancePopulationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotificationVariancePopulationAggregates'] = ResolversParentTypes['NotificationVariancePopulationAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NotificationVarianceSampleAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotificationVarianceSampleAggregates'] = ResolversParentTypes['NotificationVarianceSampleAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NotificationsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotificationsConnection'] = ResolversParentTypes['NotificationsConnection']> = {
  aggregates?: Resolver<Maybe<ResolversTypes['NotificationAggregates']>, ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['NotificationsEdge']>, ParentType, ContextType>;
  groupedAggregates?: Resolver<Maybe<Array<ResolversTypes['NotificationAggregates']>>, ParentType, ContextType, RequireFields<NotificationsConnectionGroupedAggregatesArgs, 'groupBy'>>;
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

export type NotificationsStartingWithConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotificationsStartingWithConnection'] = ResolversParentTypes['NotificationsStartingWithConnection']> = {
  edges?: Resolver<Array<ResolversTypes['NotificationsStartingWithEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NotificationsStartingWithEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotificationsStartingWithEdge'] = ResolversParentTypes['NotificationsStartingWithEdge']> = {
  cursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  node?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  allRedisGuildIds?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
  allReminders?: Resolver<Maybe<ResolversTypes['RemindersConnection']>, ParentType, ContextType, RequireFields<QueryAllRemindersArgs, 'orderBy'>>;
  allRoleMenus?: Resolver<Maybe<ResolversTypes['RoleMenusConnection']>, ParentType, ContextType, RequireFields<QueryAllRoleMenusArgs, 'orderBy'>>;
  allTags?: Resolver<Maybe<ResolversTypes['TagsConnection']>, ParentType, ContextType, RequireFields<QueryAllTagsArgs, 'orderBy'>>;
  allUserLevels?: Resolver<Maybe<ResolversTypes['UserLevelsConnection']>, ParentType, ContextType, RequireFields<QueryAllUserLevelsArgs, 'orderBy'>>;
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
  nextCaseId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType, Partial<QueryNextCaseIdArgs>>;
  node?: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<QueryNodeArgs, 'nodeId'>>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  notification?: Resolver<Maybe<ResolversTypes['Notification']>, ParentType, ContextType, RequireFields<QueryNotificationArgs, 'nodeId'>>;
  notificationByUserIdAndGuildIdAndKeyword?: Resolver<Maybe<ResolversTypes['Notification']>, ParentType, ContextType, RequireFields<QueryNotificationByUserIdAndGuildIdAndKeywordArgs, 'guildId' | 'keyword' | 'userId'>>;
  notificationsStartingWith?: Resolver<Maybe<ResolversTypes['NotificationsStartingWithConnection']>, ParentType, ContextType, Partial<QueryNotificationsStartingWithArgs>>;
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  randomTag?: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType, Partial<QueryRandomTagArgs>>;
  redisGuildByGuildId?: Resolver<Maybe<ResolversTypes['RedisGuild']>, ParentType, ContextType, RequireFields<QueryRedisGuildByGuildIdArgs, 'guild_id'>>;
  reminder?: Resolver<Maybe<ResolversTypes['Reminder']>, ParentType, ContextType, RequireFields<QueryReminderArgs, 'nodeId'>>;
  reminderByUserIdAndSetAt?: Resolver<Maybe<ResolversTypes['Reminder']>, ParentType, ContextType, RequireFields<QueryReminderByUserIdAndSetAtArgs, 'setAt' | 'userId'>>;
  roleMenu?: Resolver<Maybe<ResolversTypes['RoleMenu']>, ParentType, ContextType, RequireFields<QueryRoleMenuArgs, 'nodeId'>>;
  roleMenuByGuildIdAndMenuName?: Resolver<Maybe<ResolversTypes['RoleMenu']>, ParentType, ContextType, RequireFields<QueryRoleMenuByGuildIdAndMenuNameArgs, 'guildId' | 'menuName'>>;
  tag?: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType, RequireFields<QueryTagArgs, 'nodeId'>>;
  tagByGuildIdAndTagName?: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType, RequireFields<QueryTagByGuildIdAndTagNameArgs, 'guildId' | 'tagName'>>;
  timeframeUserLevels?: Resolver<Maybe<ResolversTypes['TimeframeUserLevelsConnection']>, ParentType, ContextType, Partial<QueryTimeframeUserLevelsArgs>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'nodeId'>>;
  userById?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserByIdArgs, 'id'>>;
  userGuildRank?: Resolver<Maybe<ResolversTypes['UserGuildRankResult']>, ParentType, ContextType, RequireFields<QueryUserGuildRankArgs, 'guildId' | 'userId'>>;
  userLevel?: Resolver<Maybe<ResolversTypes['UserLevel']>, ParentType, ContextType, RequireFields<QueryUserLevelArgs, 'nodeId'>>;
  userLevelByUserIdAndGuildId?: Resolver<Maybe<ResolversTypes['UserLevel']>, ParentType, ContextType, RequireFields<QueryUserLevelByUserIdAndGuildIdArgs, 'guildId' | 'userId'>>;
  webUser?: Resolver<Maybe<ResolversTypes['WebUser']>, ParentType, ContextType, RequireFields<QueryWebUserArgs, 'nodeId'>>;
  webUserById?: Resolver<Maybe<ResolversTypes['WebUser']>, ParentType, ContextType, RequireFields<QueryWebUserByIdArgs, 'id'>>;
  webUserGuild?: Resolver<Maybe<ResolversTypes['WebUserGuild']>, ParentType, ContextType, RequireFields<QueryWebUserGuildArgs, 'nodeId'>>;
  webUserGuildByUserIdAndGuildId?: Resolver<Maybe<ResolversTypes['WebUserGuild']>, ParentType, ContextType, RequireFields<QueryWebUserGuildByUserIdAndGuildIdArgs, 'guildId' | 'userId'>>;
};

export type RedisGuildResolvers<ContextType = any, ParentType extends ResolversParentTypes['RedisGuild'] = ResolversParentTypes['RedisGuild']> = {
  afkChannelId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  afkTimeout?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  applicationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  banner?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  channels?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  defaultMessageNotifications?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  discoverySplash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  emojis?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  explicitContentFilter?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  features?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  joinedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  large?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  maxMembers?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  maxVideoChannelUsers?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  memberCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  members?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  mfaLevel?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nsfwLevel?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  ownerId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  preferredLocale?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  premiumSubscriptionCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  premiumTier?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  presences?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  roles?: Resolver<Maybe<Array<Maybe<ResolversTypes['RedisGuildRole']>>>, ParentType, ContextType>;
  rulesChannelId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  splash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  systemChannelFlags?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  systemChannelId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  unavailable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  vanityUrlCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  verificationLevel?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  voiceStates?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RedisGuildRoleResolvers<ContextType = any, ParentType extends ResolversParentTypes['RedisGuildRole'] = ResolversParentTypes['RedisGuildRole']> = {
  color?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  hoist?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  managed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  mentionable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  permissions?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tags?: Resolver<Maybe<ResolversTypes['RedisRoleTags']>, ParentType, ContextType>;
  unicode_emoji?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RedisRoleTagsResolvers<ContextType = any, ParentType extends ResolversParentTypes['RedisRoleTags'] = ResolversParentTypes['RedisRoleTags']> = {
  bot_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  integration_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReminderResolvers<ContextType = any, ParentType extends ResolversParentTypes['Reminder'] = ResolversParentTypes['Reminder']> = {
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expireAt?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  setAt?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReminderAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReminderAggregates'] = ResolversParentTypes['ReminderAggregates']> = {
  average?: Resolver<Maybe<ResolversTypes['ReminderAverageAggregates']>, ParentType, ContextType>;
  distinctCount?: Resolver<Maybe<ResolversTypes['ReminderDistinctCountAggregates']>, ParentType, ContextType>;
  keys?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  max?: Resolver<Maybe<ResolversTypes['ReminderMaxAggregates']>, ParentType, ContextType>;
  min?: Resolver<Maybe<ResolversTypes['ReminderMinAggregates']>, ParentType, ContextType>;
  stddevPopulation?: Resolver<Maybe<ResolversTypes['ReminderStddevPopulationAggregates']>, ParentType, ContextType>;
  stddevSample?: Resolver<Maybe<ResolversTypes['ReminderStddevSampleAggregates']>, ParentType, ContextType>;
  sum?: Resolver<Maybe<ResolversTypes['ReminderSumAggregates']>, ParentType, ContextType>;
  variancePopulation?: Resolver<Maybe<ResolversTypes['ReminderVariancePopulationAggregates']>, ParentType, ContextType>;
  varianceSample?: Resolver<Maybe<ResolversTypes['ReminderVarianceSampleAggregates']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReminderAverageAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReminderAverageAggregates'] = ResolversParentTypes['ReminderAverageAggregates']> = {
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReminderDistinctCountAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReminderDistinctCountAggregates'] = ResolversParentTypes['ReminderDistinctCountAggregates']> = {
  description?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  expireAt?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  setAt?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReminderMaxAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReminderMaxAggregates'] = ResolversParentTypes['ReminderMaxAggregates']> = {
  userId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReminderMinAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReminderMinAggregates'] = ResolversParentTypes['ReminderMinAggregates']> = {
  userId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReminderStddevPopulationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReminderStddevPopulationAggregates'] = ResolversParentTypes['ReminderStddevPopulationAggregates']> = {
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReminderStddevSampleAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReminderStddevSampleAggregates'] = ResolversParentTypes['ReminderStddevSampleAggregates']> = {
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReminderSumAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReminderSumAggregates'] = ResolversParentTypes['ReminderSumAggregates']> = {
  userId?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReminderVariancePopulationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReminderVariancePopulationAggregates'] = ResolversParentTypes['ReminderVariancePopulationAggregates']> = {
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReminderVarianceSampleAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReminderVarianceSampleAggregates'] = ResolversParentTypes['ReminderVarianceSampleAggregates']> = {
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RemindersConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['RemindersConnection'] = ResolversParentTypes['RemindersConnection']> = {
  aggregates?: Resolver<Maybe<ResolversTypes['ReminderAggregates']>, ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['RemindersEdge']>, ParentType, ContextType>;
  groupedAggregates?: Resolver<Maybe<Array<ResolversTypes['ReminderAggregates']>>, ParentType, ContextType, RequireFields<RemindersConnectionGroupedAggregatesArgs, 'groupBy'>>;
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
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  guildId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  maxCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  menuName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  requiredRole?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  roleIds?: Resolver<Maybe<Array<Maybe<ResolversTypes['BigInt']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoleMenuAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['RoleMenuAggregates'] = ResolversParentTypes['RoleMenuAggregates']> = {
  average?: Resolver<Maybe<ResolversTypes['RoleMenuAverageAggregates']>, ParentType, ContextType>;
  distinctCount?: Resolver<Maybe<ResolversTypes['RoleMenuDistinctCountAggregates']>, ParentType, ContextType>;
  keys?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  max?: Resolver<Maybe<ResolversTypes['RoleMenuMaxAggregates']>, ParentType, ContextType>;
  min?: Resolver<Maybe<ResolversTypes['RoleMenuMinAggregates']>, ParentType, ContextType>;
  stddevPopulation?: Resolver<Maybe<ResolversTypes['RoleMenuStddevPopulationAggregates']>, ParentType, ContextType>;
  stddevSample?: Resolver<Maybe<ResolversTypes['RoleMenuStddevSampleAggregates']>, ParentType, ContextType>;
  sum?: Resolver<Maybe<ResolversTypes['RoleMenuSumAggregates']>, ParentType, ContextType>;
  variancePopulation?: Resolver<Maybe<ResolversTypes['RoleMenuVariancePopulationAggregates']>, ParentType, ContextType>;
  varianceSample?: Resolver<Maybe<ResolversTypes['RoleMenuVarianceSampleAggregates']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoleMenuAverageAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['RoleMenuAverageAggregates'] = ResolversParentTypes['RoleMenuAverageAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  maxCount?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  requiredRole?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoleMenuDistinctCountAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['RoleMenuDistinctCountAggregates'] = ResolversParentTypes['RoleMenuDistinctCountAggregates']> = {
  description?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  maxCount?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  menuName?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  requiredRole?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  roleIds?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoleMenuMaxAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['RoleMenuMaxAggregates'] = ResolversParentTypes['RoleMenuMaxAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  maxCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  requiredRole?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoleMenuMinAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['RoleMenuMinAggregates'] = ResolversParentTypes['RoleMenuMinAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  maxCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  requiredRole?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoleMenuStddevPopulationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['RoleMenuStddevPopulationAggregates'] = ResolversParentTypes['RoleMenuStddevPopulationAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  maxCount?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  requiredRole?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoleMenuStddevSampleAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['RoleMenuStddevSampleAggregates'] = ResolversParentTypes['RoleMenuStddevSampleAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  maxCount?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  requiredRole?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoleMenuSumAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['RoleMenuSumAggregates'] = ResolversParentTypes['RoleMenuSumAggregates']> = {
  guildId?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  maxCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  requiredRole?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoleMenuVariancePopulationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['RoleMenuVariancePopulationAggregates'] = ResolversParentTypes['RoleMenuVariancePopulationAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  maxCount?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  requiredRole?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoleMenuVarianceSampleAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['RoleMenuVarianceSampleAggregates'] = ResolversParentTypes['RoleMenuVarianceSampleAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  maxCount?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  requiredRole?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoleMenusConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['RoleMenusConnection'] = ResolversParentTypes['RoleMenusConnection']> = {
  aggregates?: Resolver<Maybe<ResolversTypes['RoleMenuAggregates']>, ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['RoleMenusEdge']>, ParentType, ContextType>;
  groupedAggregates?: Resolver<Maybe<Array<ResolversTypes['RoleMenuAggregates']>>, ParentType, ContextType, RequireFields<RoleMenusConnectionGroupedAggregatesArgs, 'groupBy'>>;
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
  attachment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  guildId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ownerId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  tagName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  useCount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['TagAggregates'] = ResolversParentTypes['TagAggregates']> = {
  average?: Resolver<Maybe<ResolversTypes['TagAverageAggregates']>, ParentType, ContextType>;
  distinctCount?: Resolver<Maybe<ResolversTypes['TagDistinctCountAggregates']>, ParentType, ContextType>;
  keys?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  max?: Resolver<Maybe<ResolversTypes['TagMaxAggregates']>, ParentType, ContextType>;
  min?: Resolver<Maybe<ResolversTypes['TagMinAggregates']>, ParentType, ContextType>;
  stddevPopulation?: Resolver<Maybe<ResolversTypes['TagStddevPopulationAggregates']>, ParentType, ContextType>;
  stddevSample?: Resolver<Maybe<ResolversTypes['TagStddevSampleAggregates']>, ParentType, ContextType>;
  sum?: Resolver<Maybe<ResolversTypes['TagSumAggregates']>, ParentType, ContextType>;
  variancePopulation?: Resolver<Maybe<ResolversTypes['TagVariancePopulationAggregates']>, ParentType, ContextType>;
  varianceSample?: Resolver<Maybe<ResolversTypes['TagVarianceSampleAggregates']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagAverageAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['TagAverageAggregates'] = ResolversParentTypes['TagAverageAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  ownerId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  useCount?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagDistinctCountAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['TagDistinctCountAggregates'] = ResolversParentTypes['TagDistinctCountAggregates']> = {
  attachment?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  content?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  created?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  ownerId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  tagName?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  useCount?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagMaxAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['TagMaxAggregates'] = ResolversParentTypes['TagMaxAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  ownerId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  useCount?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagMinAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['TagMinAggregates'] = ResolversParentTypes['TagMinAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  ownerId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  useCount?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagStddevPopulationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['TagStddevPopulationAggregates'] = ResolversParentTypes['TagStddevPopulationAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  ownerId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  useCount?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagStddevSampleAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['TagStddevSampleAggregates'] = ResolversParentTypes['TagStddevSampleAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  ownerId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  useCount?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagSumAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['TagSumAggregates'] = ResolversParentTypes['TagSumAggregates']> = {
  guildId?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  ownerId?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  useCount?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagVariancePopulationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['TagVariancePopulationAggregates'] = ResolversParentTypes['TagVariancePopulationAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  ownerId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  useCount?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagVarianceSampleAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['TagVarianceSampleAggregates'] = ResolversParentTypes['TagVarianceSampleAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  ownerId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  useCount?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['TagsConnection'] = ResolversParentTypes['TagsConnection']> = {
  aggregates?: Resolver<Maybe<ResolversTypes['TagAggregates']>, ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['TagsEdge']>, ParentType, ContextType>;
  groupedAggregates?: Resolver<Maybe<Array<ResolversTypes['TagAggregates']>>, ParentType, ContextType, RequireFields<TagsConnectionGroupedAggregatesArgs, 'groupBy'>>;
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

export type UserAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserAggregates'] = ResolversParentTypes['UserAggregates']> = {
  average?: Resolver<Maybe<ResolversTypes['UserAverageAggregates']>, ParentType, ContextType>;
  distinctCount?: Resolver<Maybe<ResolversTypes['UserDistinctCountAggregates']>, ParentType, ContextType>;
  keys?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  max?: Resolver<Maybe<ResolversTypes['UserMaxAggregates']>, ParentType, ContextType>;
  min?: Resolver<Maybe<ResolversTypes['UserMinAggregates']>, ParentType, ContextType>;
  stddevPopulation?: Resolver<Maybe<ResolversTypes['UserStddevPopulationAggregates']>, ParentType, ContextType>;
  stddevSample?: Resolver<Maybe<ResolversTypes['UserStddevSampleAggregates']>, ParentType, ContextType>;
  sum?: Resolver<Maybe<ResolversTypes['UserSumAggregates']>, ParentType, ContextType>;
  variancePopulation?: Resolver<Maybe<ResolversTypes['UserVariancePopulationAggregates']>, ParentType, ContextType>;
  varianceSample?: Resolver<Maybe<ResolversTypes['UserVarianceSampleAggregates']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserAverageAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserAverageAggregates'] = ResolversParentTypes['UserAverageAggregates']> = {
  fishies?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  rep?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserDistinctCountAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserDistinctCountAggregates'] = ResolversParentTypes['UserDistinctCountAggregates']> = {
  fishies?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  isPatron?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  lastFishies?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  lastRep?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  lastfmUsername?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  patronEmoji?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  profileData?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  rep?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserGuildRankResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserGuildRankResult'] = ResolversParentTypes['UserGuildRankResult']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  lastMsg?: Resolver<Maybe<ResolversTypes['Datetime']>, ParentType, ContextType>;
  msgAllTime?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  msgAllTimeRank?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  msgAllTimeTotal?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  msgDay?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  msgDayRank?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  msgDayTotal?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  msgMonth?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  msgMonthRank?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  msgMonthTotal?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  msgWeek?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  msgWeekRank?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  msgWeekTotal?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
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

export type UserLevelAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserLevelAggregates'] = ResolversParentTypes['UserLevelAggregates']> = {
  average?: Resolver<Maybe<ResolversTypes['UserLevelAverageAggregates']>, ParentType, ContextType>;
  distinctCount?: Resolver<Maybe<ResolversTypes['UserLevelDistinctCountAggregates']>, ParentType, ContextType>;
  keys?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  max?: Resolver<Maybe<ResolversTypes['UserLevelMaxAggregates']>, ParentType, ContextType>;
  min?: Resolver<Maybe<ResolversTypes['UserLevelMinAggregates']>, ParentType, ContextType>;
  stddevPopulation?: Resolver<Maybe<ResolversTypes['UserLevelStddevPopulationAggregates']>, ParentType, ContextType>;
  stddevSample?: Resolver<Maybe<ResolversTypes['UserLevelStddevSampleAggregates']>, ParentType, ContextType>;
  sum?: Resolver<Maybe<ResolversTypes['UserLevelSumAggregates']>, ParentType, ContextType>;
  variancePopulation?: Resolver<Maybe<ResolversTypes['UserLevelVariancePopulationAggregates']>, ParentType, ContextType>;
  varianceSample?: Resolver<Maybe<ResolversTypes['UserLevelVarianceSampleAggregates']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserLevelAverageAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserLevelAverageAggregates'] = ResolversParentTypes['UserLevelAverageAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  msgAllTime?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  msgDay?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  msgMonth?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  msgWeek?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserLevelDistinctCountAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserLevelDistinctCountAggregates'] = ResolversParentTypes['UserLevelDistinctCountAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  lastMsg?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  msgAllTime?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  msgDay?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  msgMonth?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  msgWeek?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserLevelMaxAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserLevelMaxAggregates'] = ResolversParentTypes['UserLevelMaxAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  msgAllTime?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  msgDay?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  msgMonth?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  msgWeek?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserLevelMinAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserLevelMinAggregates'] = ResolversParentTypes['UserLevelMinAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  msgAllTime?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  msgDay?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  msgMonth?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  msgWeek?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserLevelStddevPopulationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserLevelStddevPopulationAggregates'] = ResolversParentTypes['UserLevelStddevPopulationAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  msgAllTime?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  msgDay?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  msgMonth?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  msgWeek?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserLevelStddevSampleAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserLevelStddevSampleAggregates'] = ResolversParentTypes['UserLevelStddevSampleAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  msgAllTime?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  msgDay?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  msgMonth?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  msgWeek?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserLevelSumAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserLevelSumAggregates'] = ResolversParentTypes['UserLevelSumAggregates']> = {
  guildId?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  msgAllTime?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  msgDay?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  msgMonth?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  msgWeek?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserLevelVariancePopulationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserLevelVariancePopulationAggregates'] = ResolversParentTypes['UserLevelVariancePopulationAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  msgAllTime?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  msgDay?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  msgMonth?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  msgWeek?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserLevelVarianceSampleAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserLevelVarianceSampleAggregates'] = ResolversParentTypes['UserLevelVarianceSampleAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  msgAllTime?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  msgDay?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  msgMonth?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  msgWeek?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserLevelsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserLevelsConnection'] = ResolversParentTypes['UserLevelsConnection']> = {
  aggregates?: Resolver<Maybe<ResolversTypes['UserLevelAggregates']>, ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['UserLevelsEdge']>, ParentType, ContextType>;
  groupedAggregates?: Resolver<Maybe<Array<ResolversTypes['UserLevelAggregates']>>, ParentType, ContextType, RequireFields<UserLevelsConnectionGroupedAggregatesArgs, 'groupBy'>>;
  nodes?: Resolver<Array<ResolversTypes['UserLevel']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserLevelsEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserLevelsEdge'] = ResolversParentTypes['UserLevelsEdge']> = {
  cursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['UserLevel'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserMaxAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserMaxAggregates'] = ResolversParentTypes['UserMaxAggregates']> = {
  fishies?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  rep?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserMinAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserMinAggregates'] = ResolversParentTypes['UserMinAggregates']> = {
  fishies?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  rep?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserStddevPopulationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserStddevPopulationAggregates'] = ResolversParentTypes['UserStddevPopulationAggregates']> = {
  fishies?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  rep?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserStddevSampleAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserStddevSampleAggregates'] = ResolversParentTypes['UserStddevSampleAggregates']> = {
  fishies?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  rep?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserSumAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserSumAggregates'] = ResolversParentTypes['UserSumAggregates']> = {
  fishies?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  rep?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserVariancePopulationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserVariancePopulationAggregates'] = ResolversParentTypes['UserVariancePopulationAggregates']> = {
  fishies?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  rep?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserVarianceSampleAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserVarianceSampleAggregates'] = ResolversParentTypes['UserVarianceSampleAggregates']> = {
  fishies?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  rep?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UsersConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['UsersConnection'] = ResolversParentTypes['UsersConnection']> = {
  aggregates?: Resolver<Maybe<ResolversTypes['UserAggregates']>, ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['UsersEdge']>, ParentType, ContextType>;
  groupedAggregates?: Resolver<Maybe<Array<ResolversTypes['UserAggregates']>>, ParentType, ContextType, RequireFields<UsersConnectionGroupedAggregatesArgs, 'groupBy'>>;
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

export type WebUserAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['WebUserAggregates'] = ResolversParentTypes['WebUserAggregates']> = {
  average?: Resolver<Maybe<ResolversTypes['WebUserAverageAggregates']>, ParentType, ContextType>;
  distinctCount?: Resolver<Maybe<ResolversTypes['WebUserDistinctCountAggregates']>, ParentType, ContextType>;
  keys?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  max?: Resolver<Maybe<ResolversTypes['WebUserMaxAggregates']>, ParentType, ContextType>;
  min?: Resolver<Maybe<ResolversTypes['WebUserMinAggregates']>, ParentType, ContextType>;
  stddevPopulation?: Resolver<Maybe<ResolversTypes['WebUserStddevPopulationAggregates']>, ParentType, ContextType>;
  stddevSample?: Resolver<Maybe<ResolversTypes['WebUserStddevSampleAggregates']>, ParentType, ContextType>;
  sum?: Resolver<Maybe<ResolversTypes['WebUserSumAggregates']>, ParentType, ContextType>;
  variancePopulation?: Resolver<Maybe<ResolversTypes['WebUserVariancePopulationAggregates']>, ParentType, ContextType>;
  varianceSample?: Resolver<Maybe<ResolversTypes['WebUserVarianceSampleAggregates']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WebUserAverageAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['WebUserAverageAggregates'] = ResolversParentTypes['WebUserAverageAggregates']> = {
  discriminator?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WebUserDistinctCountAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['WebUserDistinctCountAggregates'] = ResolversParentTypes['WebUserDistinctCountAggregates']> = {
  avatar?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  details?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  discriminator?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  isAdmin?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
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

export type WebUserGuildAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['WebUserGuildAggregates'] = ResolversParentTypes['WebUserGuildAggregates']> = {
  average?: Resolver<Maybe<ResolversTypes['WebUserGuildAverageAggregates']>, ParentType, ContextType>;
  distinctCount?: Resolver<Maybe<ResolversTypes['WebUserGuildDistinctCountAggregates']>, ParentType, ContextType>;
  keys?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  max?: Resolver<Maybe<ResolversTypes['WebUserGuildMaxAggregates']>, ParentType, ContextType>;
  min?: Resolver<Maybe<ResolversTypes['WebUserGuildMinAggregates']>, ParentType, ContextType>;
  stddevPopulation?: Resolver<Maybe<ResolversTypes['WebUserGuildStddevPopulationAggregates']>, ParentType, ContextType>;
  stddevSample?: Resolver<Maybe<ResolversTypes['WebUserGuildStddevSampleAggregates']>, ParentType, ContextType>;
  sum?: Resolver<Maybe<ResolversTypes['WebUserGuildSumAggregates']>, ParentType, ContextType>;
  variancePopulation?: Resolver<Maybe<ResolversTypes['WebUserGuildVariancePopulationAggregates']>, ParentType, ContextType>;
  varianceSample?: Resolver<Maybe<ResolversTypes['WebUserGuildVarianceSampleAggregates']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WebUserGuildAverageAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['WebUserGuildAverageAggregates'] = ResolversParentTypes['WebUserGuildAverageAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  permissions?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WebUserGuildDistinctCountAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['WebUserGuildDistinctCountAggregates'] = ResolversParentTypes['WebUserGuildDistinctCountAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  manageGuild?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  owner?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  permissions?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WebUserGuildMaxAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['WebUserGuildMaxAggregates'] = ResolversParentTypes['WebUserGuildMaxAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  permissions?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WebUserGuildMinAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['WebUserGuildMinAggregates'] = ResolversParentTypes['WebUserGuildMinAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  permissions?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WebUserGuildStddevPopulationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['WebUserGuildStddevPopulationAggregates'] = ResolversParentTypes['WebUserGuildStddevPopulationAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  permissions?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WebUserGuildStddevSampleAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['WebUserGuildStddevSampleAggregates'] = ResolversParentTypes['WebUserGuildStddevSampleAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  permissions?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WebUserGuildSumAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['WebUserGuildSumAggregates'] = ResolversParentTypes['WebUserGuildSumAggregates']> = {
  guildId?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  permissions?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WebUserGuildVariancePopulationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['WebUserGuildVariancePopulationAggregates'] = ResolversParentTypes['WebUserGuildVariancePopulationAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  permissions?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WebUserGuildVarianceSampleAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['WebUserGuildVarianceSampleAggregates'] = ResolversParentTypes['WebUserGuildVarianceSampleAggregates']> = {
  guildId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  permissions?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WebUserGuildsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['WebUserGuildsConnection'] = ResolversParentTypes['WebUserGuildsConnection']> = {
  aggregates?: Resolver<Maybe<ResolversTypes['WebUserGuildAggregates']>, ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['WebUserGuildsEdge']>, ParentType, ContextType>;
  groupedAggregates?: Resolver<Maybe<Array<ResolversTypes['WebUserGuildAggregates']>>, ParentType, ContextType, RequireFields<WebUserGuildsConnectionGroupedAggregatesArgs, 'groupBy'>>;
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

export type WebUserMaxAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['WebUserMaxAggregates'] = ResolversParentTypes['WebUserMaxAggregates']> = {
  discriminator?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WebUserMinAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['WebUserMinAggregates'] = ResolversParentTypes['WebUserMinAggregates']> = {
  discriminator?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WebUserStddevPopulationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['WebUserStddevPopulationAggregates'] = ResolversParentTypes['WebUserStddevPopulationAggregates']> = {
  discriminator?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WebUserStddevSampleAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['WebUserStddevSampleAggregates'] = ResolversParentTypes['WebUserStddevSampleAggregates']> = {
  discriminator?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WebUserSumAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['WebUserSumAggregates'] = ResolversParentTypes['WebUserSumAggregates']> = {
  discriminator?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['BigFloat'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WebUserVariancePopulationAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['WebUserVariancePopulationAggregates'] = ResolversParentTypes['WebUserVariancePopulationAggregates']> = {
  discriminator?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WebUserVarianceSampleAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['WebUserVarianceSampleAggregates'] = ResolversParentTypes['WebUserVarianceSampleAggregates']> = {
  discriminator?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['BigFloat']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WebUsersConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['WebUsersConnection'] = ResolversParentTypes['WebUsersConnection']> = {
  aggregates?: Resolver<Maybe<ResolversTypes['WebUserAggregates']>, ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['WebUsersEdge']>, ParentType, ContextType>;
  groupedAggregates?: Resolver<Maybe<Array<ResolversTypes['WebUserAggregates']>>, ParentType, ContextType, RequireFields<WebUsersConnectionGroupedAggregatesArgs, 'groupBy'>>;
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
  BigFloat?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  BotStat?: BotStatResolvers<ContextType>;
  BotStatAggregates?: BotStatAggregatesResolvers<ContextType>;
  BotStatAverageAggregates?: BotStatAverageAggregatesResolvers<ContextType>;
  BotStatDistinctCountAggregates?: BotStatDistinctCountAggregatesResolvers<ContextType>;
  BotStatMaxAggregates?: BotStatMaxAggregatesResolvers<ContextType>;
  BotStatMinAggregates?: BotStatMinAggregatesResolvers<ContextType>;
  BotStatStddevPopulationAggregates?: BotStatStddevPopulationAggregatesResolvers<ContextType>;
  BotStatStddevSampleAggregates?: BotStatStddevSampleAggregatesResolvers<ContextType>;
  BotStatSumAggregates?: BotStatSumAggregatesResolvers<ContextType>;
  BotStatVariancePopulationAggregates?: BotStatVariancePopulationAggregatesResolvers<ContextType>;
  BotStatVarianceSampleAggregates?: BotStatVarianceSampleAggregatesResolvers<ContextType>;
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
  FeedAggregates?: FeedAggregatesResolvers<ContextType>;
  FeedDistinctCountAggregates?: FeedDistinctCountAggregatesResolvers<ContextType>;
  FeedItem?: FeedItemResolvers<ContextType>;
  FeedItemAggregates?: FeedItemAggregatesResolvers<ContextType>;
  FeedItemDistinctCountAggregates?: FeedItemDistinctCountAggregatesResolvers<ContextType>;
  FeedItemsConnection?: FeedItemsConnectionResolvers<ContextType>;
  FeedItemsEdge?: FeedItemsEdgeResolvers<ContextType>;
  FeedSubscription?: FeedSubscriptionResolvers<ContextType>;
  FeedSubscriptionAggregates?: FeedSubscriptionAggregatesResolvers<ContextType>;
  FeedSubscriptionAverageAggregates?: FeedSubscriptionAverageAggregatesResolvers<ContextType>;
  FeedSubscriptionDistinctCountAggregates?: FeedSubscriptionDistinctCountAggregatesResolvers<ContextType>;
  FeedSubscriptionMaxAggregates?: FeedSubscriptionMaxAggregatesResolvers<ContextType>;
  FeedSubscriptionMinAggregates?: FeedSubscriptionMinAggregatesResolvers<ContextType>;
  FeedSubscriptionStddevPopulationAggregates?: FeedSubscriptionStddevPopulationAggregatesResolvers<ContextType>;
  FeedSubscriptionStddevSampleAggregates?: FeedSubscriptionStddevSampleAggregatesResolvers<ContextType>;
  FeedSubscriptionSumAggregates?: FeedSubscriptionSumAggregatesResolvers<ContextType>;
  FeedSubscriptionVariancePopulationAggregates?: FeedSubscriptionVariancePopulationAggregatesResolvers<ContextType>;
  FeedSubscriptionVarianceSampleAggregates?: FeedSubscriptionVarianceSampleAggregatesResolvers<ContextType>;
  FeedSubscriptionsConnection?: FeedSubscriptionsConnectionResolvers<ContextType>;
  FeedSubscriptionsEdge?: FeedSubscriptionsEdgeResolvers<ContextType>;
  FeedsConnection?: FeedsConnectionResolvers<ContextType>;
  FeedsEdge?: FeedsEdgeResolvers<ContextType>;
  GraphqlPayload?: GraphqlPayloadResolvers<ContextType>;
  GuildBan?: GuildBanResolvers<ContextType>;
  GuildBanAggregates?: GuildBanAggregatesResolvers<ContextType>;
  GuildBanAverageAggregates?: GuildBanAverageAggregatesResolvers<ContextType>;
  GuildBanDistinctCountAggregates?: GuildBanDistinctCountAggregatesResolvers<ContextType>;
  GuildBanMaxAggregates?: GuildBanMaxAggregatesResolvers<ContextType>;
  GuildBanMinAggregates?: GuildBanMinAggregatesResolvers<ContextType>;
  GuildBanStddevPopulationAggregates?: GuildBanStddevPopulationAggregatesResolvers<ContextType>;
  GuildBanStddevSampleAggregates?: GuildBanStddevSampleAggregatesResolvers<ContextType>;
  GuildBanSumAggregates?: GuildBanSumAggregatesResolvers<ContextType>;
  GuildBanVariancePopulationAggregates?: GuildBanVariancePopulationAggregatesResolvers<ContextType>;
  GuildBanVarianceSampleAggregates?: GuildBanVarianceSampleAggregatesResolvers<ContextType>;
  GuildBansConnection?: GuildBansConnectionResolvers<ContextType>;
  GuildBansEdge?: GuildBansEdgeResolvers<ContextType>;
  GuildConfig?: GuildConfigResolvers<ContextType>;
  GuildConfigAggregates?: GuildConfigAggregatesResolvers<ContextType>;
  GuildConfigAverageAggregates?: GuildConfigAverageAggregatesResolvers<ContextType>;
  GuildConfigDistinctCountAggregates?: GuildConfigDistinctCountAggregatesResolvers<ContextType>;
  GuildConfigMaxAggregates?: GuildConfigMaxAggregatesResolvers<ContextType>;
  GuildConfigMinAggregates?: GuildConfigMinAggregatesResolvers<ContextType>;
  GuildConfigStddevPopulationAggregates?: GuildConfigStddevPopulationAggregatesResolvers<ContextType>;
  GuildConfigStddevSampleAggregates?: GuildConfigStddevSampleAggregatesResolvers<ContextType>;
  GuildConfigSumAggregates?: GuildConfigSumAggregatesResolvers<ContextType>;
  GuildConfigVariancePopulationAggregates?: GuildConfigVariancePopulationAggregatesResolvers<ContextType>;
  GuildConfigVarianceSampleAggregates?: GuildConfigVarianceSampleAggregatesResolvers<ContextType>;
  GuildConfigsConnection?: GuildConfigsConnectionResolvers<ContextType>;
  GuildConfigsEdge?: GuildConfigsEdgeResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  LogoutPayload?: LogoutPayloadResolvers<ContextType>;
  Member?: MemberResolvers<ContextType>;
  MemberAggregates?: MemberAggregatesResolvers<ContextType>;
  MemberAverageAggregates?: MemberAverageAggregatesResolvers<ContextType>;
  MemberDistinctCountAggregates?: MemberDistinctCountAggregatesResolvers<ContextType>;
  MemberMaxAggregates?: MemberMaxAggregatesResolvers<ContextType>;
  MemberMinAggregates?: MemberMinAggregatesResolvers<ContextType>;
  MemberStddevPopulationAggregates?: MemberStddevPopulationAggregatesResolvers<ContextType>;
  MemberStddevSampleAggregates?: MemberStddevSampleAggregatesResolvers<ContextType>;
  MemberSumAggregates?: MemberSumAggregatesResolvers<ContextType>;
  MemberVariancePopulationAggregates?: MemberVariancePopulationAggregatesResolvers<ContextType>;
  MemberVarianceSampleAggregates?: MemberVarianceSampleAggregatesResolvers<ContextType>;
  MembersConnection?: MembersConnectionResolvers<ContextType>;
  MembersEdge?: MembersEdgeResolvers<ContextType>;
  Message?: MessageResolvers<ContextType>;
  MessageAggregates?: MessageAggregatesResolvers<ContextType>;
  MessageAverageAggregates?: MessageAverageAggregatesResolvers<ContextType>;
  MessageDistinctCountAggregates?: MessageDistinctCountAggregatesResolvers<ContextType>;
  MessageMaxAggregates?: MessageMaxAggregatesResolvers<ContextType>;
  MessageMinAggregates?: MessageMinAggregatesResolvers<ContextType>;
  MessageStddevPopulationAggregates?: MessageStddevPopulationAggregatesResolvers<ContextType>;
  MessageStddevSampleAggregates?: MessageStddevSampleAggregatesResolvers<ContextType>;
  MessageSumAggregates?: MessageSumAggregatesResolvers<ContextType>;
  MessageVariancePopulationAggregates?: MessageVariancePopulationAggregatesResolvers<ContextType>;
  MessageVarianceSampleAggregates?: MessageVarianceSampleAggregatesResolvers<ContextType>;
  MessagesConnection?: MessagesConnectionResolvers<ContextType>;
  MessagesEdge?: MessagesEdgeResolvers<ContextType>;
  ModLog?: ModLogResolvers<ContextType>;
  ModLogAggregates?: ModLogAggregatesResolvers<ContextType>;
  ModLogAverageAggregates?: ModLogAverageAggregatesResolvers<ContextType>;
  ModLogDistinctCountAggregates?: ModLogDistinctCountAggregatesResolvers<ContextType>;
  ModLogMaxAggregates?: ModLogMaxAggregatesResolvers<ContextType>;
  ModLogMinAggregates?: ModLogMinAggregatesResolvers<ContextType>;
  ModLogStddevPopulationAggregates?: ModLogStddevPopulationAggregatesResolvers<ContextType>;
  ModLogStddevSampleAggregates?: ModLogStddevSampleAggregatesResolvers<ContextType>;
  ModLogSumAggregates?: ModLogSumAggregatesResolvers<ContextType>;
  ModLogVariancePopulationAggregates?: ModLogVariancePopulationAggregatesResolvers<ContextType>;
  ModLogVarianceSampleAggregates?: ModLogVarianceSampleAggregatesResolvers<ContextType>;
  ModLogsConnection?: ModLogsConnectionResolvers<ContextType>;
  ModLogsEdge?: ModLogsEdgeResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Mute?: MuteResolvers<ContextType>;
  MuteAggregates?: MuteAggregatesResolvers<ContextType>;
  MuteAverageAggregates?: MuteAverageAggregatesResolvers<ContextType>;
  MuteDistinctCountAggregates?: MuteDistinctCountAggregatesResolvers<ContextType>;
  MuteMaxAggregates?: MuteMaxAggregatesResolvers<ContextType>;
  MuteMinAggregates?: MuteMinAggregatesResolvers<ContextType>;
  MuteStddevPopulationAggregates?: MuteStddevPopulationAggregatesResolvers<ContextType>;
  MuteStddevSampleAggregates?: MuteStddevSampleAggregatesResolvers<ContextType>;
  MuteSumAggregates?: MuteSumAggregatesResolvers<ContextType>;
  MuteVariancePopulationAggregates?: MuteVariancePopulationAggregatesResolvers<ContextType>;
  MuteVarianceSampleAggregates?: MuteVarianceSampleAggregatesResolvers<ContextType>;
  MutesConnection?: MutesConnectionResolvers<ContextType>;
  MutesEdge?: MutesEdgeResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  Notification?: NotificationResolvers<ContextType>;
  NotificationAggregates?: NotificationAggregatesResolvers<ContextType>;
  NotificationAverageAggregates?: NotificationAverageAggregatesResolvers<ContextType>;
  NotificationDistinctCountAggregates?: NotificationDistinctCountAggregatesResolvers<ContextType>;
  NotificationMaxAggregates?: NotificationMaxAggregatesResolvers<ContextType>;
  NotificationMinAggregates?: NotificationMinAggregatesResolvers<ContextType>;
  NotificationStddevPopulationAggregates?: NotificationStddevPopulationAggregatesResolvers<ContextType>;
  NotificationStddevSampleAggregates?: NotificationStddevSampleAggregatesResolvers<ContextType>;
  NotificationSumAggregates?: NotificationSumAggregatesResolvers<ContextType>;
  NotificationVariancePopulationAggregates?: NotificationVariancePopulationAggregatesResolvers<ContextType>;
  NotificationVarianceSampleAggregates?: NotificationVarianceSampleAggregatesResolvers<ContextType>;
  NotificationsConnection?: NotificationsConnectionResolvers<ContextType>;
  NotificationsEdge?: NotificationsEdgeResolvers<ContextType>;
  NotificationsStartingWithConnection?: NotificationsStartingWithConnectionResolvers<ContextType>;
  NotificationsStartingWithEdge?: NotificationsStartingWithEdgeResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RedisGuild?: RedisGuildResolvers<ContextType>;
  RedisGuildRole?: RedisGuildRoleResolvers<ContextType>;
  RedisRoleTags?: RedisRoleTagsResolvers<ContextType>;
  Reminder?: ReminderResolvers<ContextType>;
  ReminderAggregates?: ReminderAggregatesResolvers<ContextType>;
  ReminderAverageAggregates?: ReminderAverageAggregatesResolvers<ContextType>;
  ReminderDistinctCountAggregates?: ReminderDistinctCountAggregatesResolvers<ContextType>;
  ReminderMaxAggregates?: ReminderMaxAggregatesResolvers<ContextType>;
  ReminderMinAggregates?: ReminderMinAggregatesResolvers<ContextType>;
  ReminderStddevPopulationAggregates?: ReminderStddevPopulationAggregatesResolvers<ContextType>;
  ReminderStddevSampleAggregates?: ReminderStddevSampleAggregatesResolvers<ContextType>;
  ReminderSumAggregates?: ReminderSumAggregatesResolvers<ContextType>;
  ReminderVariancePopulationAggregates?: ReminderVariancePopulationAggregatesResolvers<ContextType>;
  ReminderVarianceSampleAggregates?: ReminderVarianceSampleAggregatesResolvers<ContextType>;
  RemindersConnection?: RemindersConnectionResolvers<ContextType>;
  RemindersEdge?: RemindersEdgeResolvers<ContextType>;
  RoleMenu?: RoleMenuResolvers<ContextType>;
  RoleMenuAggregates?: RoleMenuAggregatesResolvers<ContextType>;
  RoleMenuAverageAggregates?: RoleMenuAverageAggregatesResolvers<ContextType>;
  RoleMenuDistinctCountAggregates?: RoleMenuDistinctCountAggregatesResolvers<ContextType>;
  RoleMenuMaxAggregates?: RoleMenuMaxAggregatesResolvers<ContextType>;
  RoleMenuMinAggregates?: RoleMenuMinAggregatesResolvers<ContextType>;
  RoleMenuStddevPopulationAggregates?: RoleMenuStddevPopulationAggregatesResolvers<ContextType>;
  RoleMenuStddevSampleAggregates?: RoleMenuStddevSampleAggregatesResolvers<ContextType>;
  RoleMenuSumAggregates?: RoleMenuSumAggregatesResolvers<ContextType>;
  RoleMenuVariancePopulationAggregates?: RoleMenuVariancePopulationAggregatesResolvers<ContextType>;
  RoleMenuVarianceSampleAggregates?: RoleMenuVarianceSampleAggregatesResolvers<ContextType>;
  RoleMenusConnection?: RoleMenusConnectionResolvers<ContextType>;
  RoleMenusEdge?: RoleMenusEdgeResolvers<ContextType>;
  Tag?: TagResolvers<ContextType>;
  TagAggregates?: TagAggregatesResolvers<ContextType>;
  TagAverageAggregates?: TagAverageAggregatesResolvers<ContextType>;
  TagDistinctCountAggregates?: TagDistinctCountAggregatesResolvers<ContextType>;
  TagMaxAggregates?: TagMaxAggregatesResolvers<ContextType>;
  TagMinAggregates?: TagMinAggregatesResolvers<ContextType>;
  TagStddevPopulationAggregates?: TagStddevPopulationAggregatesResolvers<ContextType>;
  TagStddevSampleAggregates?: TagStddevSampleAggregatesResolvers<ContextType>;
  TagSumAggregates?: TagSumAggregatesResolvers<ContextType>;
  TagVariancePopulationAggregates?: TagVariancePopulationAggregatesResolvers<ContextType>;
  TagVarianceSampleAggregates?: TagVarianceSampleAggregatesResolvers<ContextType>;
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
  UserAggregates?: UserAggregatesResolvers<ContextType>;
  UserAverageAggregates?: UserAverageAggregatesResolvers<ContextType>;
  UserDistinctCountAggregates?: UserDistinctCountAggregatesResolvers<ContextType>;
  UserGuildRankResult?: UserGuildRankResultResolvers<ContextType>;
  UserLevel?: UserLevelResolvers<ContextType>;
  UserLevelAggregates?: UserLevelAggregatesResolvers<ContextType>;
  UserLevelAverageAggregates?: UserLevelAverageAggregatesResolvers<ContextType>;
  UserLevelDistinctCountAggregates?: UserLevelDistinctCountAggregatesResolvers<ContextType>;
  UserLevelMaxAggregates?: UserLevelMaxAggregatesResolvers<ContextType>;
  UserLevelMinAggregates?: UserLevelMinAggregatesResolvers<ContextType>;
  UserLevelStddevPopulationAggregates?: UserLevelStddevPopulationAggregatesResolvers<ContextType>;
  UserLevelStddevSampleAggregates?: UserLevelStddevSampleAggregatesResolvers<ContextType>;
  UserLevelSumAggregates?: UserLevelSumAggregatesResolvers<ContextType>;
  UserLevelVariancePopulationAggregates?: UserLevelVariancePopulationAggregatesResolvers<ContextType>;
  UserLevelVarianceSampleAggregates?: UserLevelVarianceSampleAggregatesResolvers<ContextType>;
  UserLevelsConnection?: UserLevelsConnectionResolvers<ContextType>;
  UserLevelsEdge?: UserLevelsEdgeResolvers<ContextType>;
  UserMaxAggregates?: UserMaxAggregatesResolvers<ContextType>;
  UserMinAggregates?: UserMinAggregatesResolvers<ContextType>;
  UserStddevPopulationAggregates?: UserStddevPopulationAggregatesResolvers<ContextType>;
  UserStddevSampleAggregates?: UserStddevSampleAggregatesResolvers<ContextType>;
  UserSumAggregates?: UserSumAggregatesResolvers<ContextType>;
  UserVariancePopulationAggregates?: UserVariancePopulationAggregatesResolvers<ContextType>;
  UserVarianceSampleAggregates?: UserVarianceSampleAggregatesResolvers<ContextType>;
  UsersConnection?: UsersConnectionResolvers<ContextType>;
  UsersEdge?: UsersEdgeResolvers<ContextType>;
  WebUser?: WebUserResolvers<ContextType>;
  WebUserAggregates?: WebUserAggregatesResolvers<ContextType>;
  WebUserAverageAggregates?: WebUserAverageAggregatesResolvers<ContextType>;
  WebUserDistinctCountAggregates?: WebUserDistinctCountAggregatesResolvers<ContextType>;
  WebUserGuild?: WebUserGuildResolvers<ContextType>;
  WebUserGuildAggregates?: WebUserGuildAggregatesResolvers<ContextType>;
  WebUserGuildAverageAggregates?: WebUserGuildAverageAggregatesResolvers<ContextType>;
  WebUserGuildDistinctCountAggregates?: WebUserGuildDistinctCountAggregatesResolvers<ContextType>;
  WebUserGuildMaxAggregates?: WebUserGuildMaxAggregatesResolvers<ContextType>;
  WebUserGuildMinAggregates?: WebUserGuildMinAggregatesResolvers<ContextType>;
  WebUserGuildStddevPopulationAggregates?: WebUserGuildStddevPopulationAggregatesResolvers<ContextType>;
  WebUserGuildStddevSampleAggregates?: WebUserGuildStddevSampleAggregatesResolvers<ContextType>;
  WebUserGuildSumAggregates?: WebUserGuildSumAggregatesResolvers<ContextType>;
  WebUserGuildVariancePopulationAggregates?: WebUserGuildVariancePopulationAggregatesResolvers<ContextType>;
  WebUserGuildVarianceSampleAggregates?: WebUserGuildVarianceSampleAggregatesResolvers<ContextType>;
  WebUserGuildsConnection?: WebUserGuildsConnectionResolvers<ContextType>;
  WebUserGuildsEdge?: WebUserGuildsEdgeResolvers<ContextType>;
  WebUserMaxAggregates?: WebUserMaxAggregatesResolvers<ContextType>;
  WebUserMinAggregates?: WebUserMinAggregatesResolvers<ContextType>;
  WebUserStddevPopulationAggregates?: WebUserStddevPopulationAggregatesResolvers<ContextType>;
  WebUserStddevSampleAggregates?: WebUserStddevSampleAggregatesResolvers<ContextType>;
  WebUserSumAggregates?: WebUserSumAggregatesResolvers<ContextType>;
  WebUserVariancePopulationAggregates?: WebUserVariancePopulationAggregatesResolvers<ContextType>;
  WebUserVarianceSampleAggregates?: WebUserVarianceSampleAggregatesResolvers<ContextType>;
  WebUsersConnection?: WebUsersConnectionResolvers<ContextType>;
  WebUsersEdge?: WebUsersEdgeResolvers<ContextType>;
};


export type BanDataFragment = { __typename?: 'GuildBan', guildId: string, nodeId: string, userId: string };

export type GetUserBansQueryVariables = Exact<{
  userId: Scalars['BigInt'];
}>;


export type GetUserBansQuery = { __typename?: 'Query', allGuildBans?: { __typename?: 'GuildBansConnection', totalCount: number, nodes: Array<{ __typename?: 'GuildBan', guildId: string, nodeId: string, userId: string }> } | null };

export type GetRedisGuildQueryVariables = Exact<{
  guild_id: Scalars['BigInt'];
}>;


export type GetRedisGuildQuery = { __typename?: 'Query', redisGuildByGuildId?: { __typename?: 'RedisGuild', afkChannelId?: string | null, afkTimeout: number, applicationId?: string | null, banner?: string | null, channels?: Array<string | null> | null, defaultMessageNotifications?: number | null, description?: string | null, discoverySplash?: string | null, emojis?: Array<string | null> | null, explicitContentFilter?: number | null, features?: Array<string | null> | null, icon?: string | null, id: string, joinedAt?: string | null, large?: boolean | null, maxMembers?: number | null, maxVideoChannelUsers?: number | null, memberCount?: number | null, members?: Array<string | null> | null, mfaLevel?: number | null, name: string, nsfwLevel: number, ownerId: string, preferredLocale?: string | null, premiumSubscriptionCount?: number | null, premiumTier: number, presences?: Array<string | null> | null, rulesChannelId?: string | null, splash?: string | null, systemChannelFlags?: number | null, systemChannelId?: string | null, unavailable?: boolean | null, vanityUrlCode?: string | null, verificationLevel?: number | null, voiceStates?: Array<string | null> | null, roles?: Array<{ __typename?: 'RedisGuildRole', id: string, color: number, hoist: boolean, icon?: string | null, managed: boolean, mentionable: boolean, position: number, name: string, permissions: string, unicode_emoji?: string | null } | null> | null } | null };

export type GuildConfigByIdQueryVariables = Exact<{
  guildId: Scalars['BigInt'];
}>;


export type GuildConfigByIdQuery = { __typename?: 'Query', guildConfigById?: { __typename?: 'GuildConfig', disabledChannels?: Array<string | null> | null, inviteGuard: boolean, joinMsg?: string | null, joinMsgEnabled: boolean, joinReact?: string | null, leaveMsg?: string | null, leaveMsgEnabled: boolean, logMember?: string | null, logMemberEnabled: boolean, logModEnabled: boolean, logMod?: string | null, logMsg?: string | null, logMsgEnabled: boolean, maxMention?: number | null, msgChannel?: string | null, muteDmEnabled: boolean, muteDmText?: string | null, muteDuration?: string | null, muteRole?: string | null, prefix?: string | null, roleChannel?: string | null, roleConfig?: { [key: string]: any } | null, roleEnabled: boolean, warnDmEnabled: boolean, warnDmText?: string | null } | null };

export type GuildConfigDataFragment = { __typename?: 'GuildConfig', disabledChannels?: Array<string | null> | null, inviteGuard: boolean, joinMsg?: string | null, joinMsgEnabled: boolean, joinReact?: string | null, leaveMsg?: string | null, leaveMsgEnabled: boolean, logMember?: string | null, logMemberEnabled: boolean, logModEnabled: boolean, logMod?: string | null, logMsg?: string | null, logMsgEnabled: boolean, maxMention?: number | null, msgChannel?: string | null, muteDmEnabled: boolean, muteDmText?: string | null, muteDuration?: string | null, muteRole?: string | null, prefix?: string | null, roleChannel?: string | null, roleConfig?: { [key: string]: any } | null, roleEnabled: boolean, warnDmEnabled: boolean, warnDmText?: string | null };

export type UpdateGuildConfigMutationVariables = Exact<{
  id: Scalars['BigInt'];
  patch: GuildConfigPatch;
}>;


export type UpdateGuildConfigMutation = { __typename?: 'Mutation', updateGuildConfigById?: { __typename?: 'UpdateGuildConfigPayload', guildConfig?: { __typename?: 'GuildConfig', disabledChannels?: Array<string | null> | null, inviteGuard: boolean, joinMsg?: string | null, joinMsgEnabled: boolean, joinReact?: string | null, leaveMsg?: string | null, leaveMsgEnabled: boolean, logMember?: string | null, logMemberEnabled: boolean, logModEnabled: boolean, logMod?: string | null, logMsg?: string | null, logMsgEnabled: boolean, maxMention?: number | null, msgChannel?: string | null, muteDmEnabled: boolean, muteDmText?: string | null, muteDuration?: string | null, muteRole?: string | null, prefix?: string | null, roleChannel?: string | null, roleConfig?: { [key: string]: any } | null, roleEnabled: boolean, warnDmEnabled: boolean, warnDmText?: string | null } | null } | null };

export type CreateModLogMutationVariables = Exact<{
  modLog: ModLogInput;
}>;


export type CreateModLogMutation = { __typename?: 'Mutation', createModLog?: { __typename?: 'CreateModLogPayload', modLog?: { __typename?: 'ModLog', action: string, actionTime: string, attachments: Array<string | null>, caseId: string, executorId?: string | null, guildId: string, msgId?: string | null, pending: boolean, reason?: string | null, userId: string, userTag: string } | null } | null };

export type DeleteModLogMutationVariables = Exact<{
  caseId: Scalars['BigInt'];
  guildId: Scalars['BigInt'];
}>;


export type DeleteModLogMutation = { __typename?: 'Mutation', deleteModLogByGuildIdAndCaseId?: { __typename?: 'DeleteModLogPayload', modLog?: { __typename?: 'ModLog', action: string, actionTime: string, attachments: Array<string | null>, caseId: string, executorId?: string | null, guildId: string, msgId?: string | null, pending: boolean, reason?: string | null, userId: string, userTag: string } | null } | null };

export type GetModLogQueryVariables = Exact<{
  caseId: Scalars['BigInt'];
  guildId: Scalars['BigInt'];
}>;


export type GetModLogQuery = { __typename?: 'Query', modLogByGuildIdAndCaseId?: { __typename?: 'ModLog', action: string, actionTime: string, attachments: Array<string | null>, caseId: string, executorId?: string | null, guildId: string, msgId?: string | null, pending: boolean, reason?: string | null, userId: string, userTag: string } | null };

export type GetNextCaseIdQueryVariables = Exact<{
  guildId: Scalars['BigInt'];
}>;


export type GetNextCaseIdQuery = { __typename?: 'Query', nextCaseId?: string | null };

export type GetUserModLogHistoryQueryVariables = Exact<{
  guildId: Scalars['BigInt'];
  userId: Scalars['BigInt'];
}>;


export type GetUserModLogHistoryQuery = { __typename?: 'Query', allModLogs?: { __typename?: 'ModLogsConnection', totalCount: number, nodes: Array<{ __typename?: 'ModLog', action: string, actionTime: string, attachments: Array<string | null>, caseId: string, executorId?: string | null, guildId: string, msgId?: string | null, pending: boolean, reason?: string | null, userId: string, userTag: string }> } | null };

export type ModLogDataFragment = { __typename?: 'ModLog', action: string, actionTime: string, attachments: Array<string | null>, caseId: string, executorId?: string | null, guildId: string, msgId?: string | null, pending: boolean, reason?: string | null, userId: string, userTag: string };

export type UpdateModLogMutationVariables = Exact<{
  caseId: Scalars['BigInt'];
  guildId: Scalars['BigInt'];
  modLogPatch: ModLogPatch;
}>;


export type UpdateModLogMutation = { __typename?: 'Mutation', updateModLogByGuildIdAndCaseId?: { __typename?: 'UpdateModLogPayload', modLog?: { __typename?: 'ModLog', action: string, actionTime: string, attachments: Array<string | null>, caseId: string, executorId?: string | null, guildId: string, msgId?: string | null, pending: boolean, reason?: string | null, userId: string, userTag: string } | null } | null };

export type CreateNotificationMutationVariables = Exact<{
  notification: NotificationInput;
}>;


export type CreateNotificationMutation = { __typename?: 'Mutation', createNotification?: { __typename?: 'CreateNotificationPayload', notification?: { __typename?: 'Notification', guildId: string, keyword: string, nodeId: string, userId: string } | null } | null };

export type DeleteNotificationMutationVariables = Exact<{
  guildId: Scalars['BigInt'];
  userId: Scalars['BigInt'];
  keyword: Scalars['String'];
}>;


export type DeleteNotificationMutation = { __typename?: 'Mutation', deleteNotificationByUserIdAndGuildIdAndKeyword?: { __typename?: 'DeleteNotificationPayload', notification?: { __typename?: 'Notification', guildId: string, keyword: string, nodeId: string, userId: string } | null } | null };

export type GetUserNotificationsQueryVariables = Exact<{
  userId: Scalars['BigInt'];
}>;


export type GetUserNotificationsQuery = { __typename?: 'Query', allNotifications?: { __typename?: 'NotificationsConnection', nodes: Array<{ __typename?: 'Notification', guildId: string, keyword: string, nodeId: string, userId: string }> } | null };

export type NotificationDataFragment = { __typename?: 'Notification', guildId: string, keyword: string, nodeId: string, userId: string };

export type SearchNotificationsStartingWithQueryVariables = Exact<{
  userId: Scalars['BigInt'];
  query: Scalars['String'];
}>;


export type SearchNotificationsStartingWithQuery = { __typename?: 'Query', notificationsStartingWith?: { __typename?: 'NotificationsStartingWithConnection', nodes: Array<string | null>, totalCount: number } | null };

export type CreateReminderMutationVariables = Exact<{
  reminder: ReminderInput;
}>;


export type CreateReminderMutation = { __typename?: 'Mutation', createReminder?: { __typename?: 'CreateReminderPayload', reminder?: { __typename?: 'Reminder', userId: string, description: string, expireAt: string, setAt: string } | null } | null };

export type DeleteReminderMutationVariables = Exact<{
  userId: Scalars['BigInt'];
  setAt: Scalars['Datetime'];
}>;


export type DeleteReminderMutation = { __typename?: 'Mutation', deleteReminderByUserIdAndSetAt?: { __typename?: 'DeleteReminderPayload', reminder?: { __typename?: 'Reminder', userId: string, description: string, expireAt: string, setAt: string } | null } | null };

export type GetUserRemindersQueryVariables = Exact<{
  userId: Scalars['BigInt'];
}>;


export type GetUserRemindersQuery = { __typename?: 'Query', allReminders?: { __typename?: 'RemindersConnection', totalCount: number, nodes: Array<{ __typename?: 'Reminder', userId: string, description: string, expireAt: string, setAt: string }> } | null };

export type ReminderDataFragment = { __typename?: 'Reminder', userId: string, description: string, expireAt: string, setAt: string };

export type CreateRoleMenuMutationVariables = Exact<{
  roleMenu: RoleMenuInput;
}>;


export type CreateRoleMenuMutation = { __typename?: 'Mutation', createRoleMenu?: { __typename?: 'CreateRoleMenuPayload', roleMenu?: { __typename?: 'RoleMenu', guildId: string, menuName: string, description?: string | null, maxCount?: number | null, roleIds?: Array<string | null> | null, requiredRole?: string | null } | null } | null };

export type GetRoleMenuQueryVariables = Exact<{
  guildId: Scalars['BigInt'];
  menuName: Scalars['String'];
}>;


export type GetRoleMenuQuery = { __typename?: 'Query', roleMenuByGuildIdAndMenuName?: { __typename?: 'RoleMenu', guildId: string, menuName: string, description?: string | null, maxCount?: number | null, roleIds?: Array<string | null> | null, requiredRole?: string | null } | null };

export type RoleMenuDataFragment = { __typename?: 'RoleMenu', guildId: string, menuName: string, description?: string | null, maxCount?: number | null, roleIds?: Array<string | null> | null, requiredRole?: string | null };

export type UpdateRoleMenuMutationVariables = Exact<{
  guildId: Scalars['BigInt'];
  menuName: Scalars['String'];
  roleMenuPatch: RoleMenuPatch;
}>;


export type UpdateRoleMenuMutation = { __typename?: 'Mutation', updateRoleMenuByGuildIdAndMenuName?: { __typename?: 'UpdateRoleMenuPayload', roleMenu?: { __typename?: 'RoleMenu', guildId: string, menuName: string, description?: string | null, maxCount?: number | null, roleIds?: Array<string | null> | null, requiredRole?: string | null } | null } | null };

export type CreateTagMutationVariables = Exact<{
  tag: TagInput;
}>;


export type CreateTagMutation = { __typename?: 'Mutation', createTag?: { __typename?: 'CreateTagPayload', tag?: { __typename?: 'Tag', content: string, attachment?: string | null, created: string, guildId: string, tagName: string, ownerId: string, useCount: string } | null } | null };

export type DeleteTagMutationVariables = Exact<{
  guildId: Scalars['BigInt'];
  tagName: Scalars['String'];
}>;


export type DeleteTagMutation = { __typename?: 'Mutation', deleteTagByGuildIdAndTagName?: { __typename?: 'DeleteTagPayload', tag?: { __typename?: 'Tag', content: string, attachment?: string | null, created: string, guildId: string, tagName: string, ownerId: string, useCount: string } | null } | null };

export type GetRandomTagQueryVariables = Exact<{
  guildId: Scalars['BigInt'];
  ownerId?: InputMaybe<Scalars['BigInt']>;
  query?: InputMaybe<Scalars['String']>;
  startsWith?: InputMaybe<Scalars['Boolean']>;
}>;


export type GetRandomTagQuery = { __typename?: 'Query', randomTag?: { __typename?: 'Tag', content: string, attachment?: string | null, created: string, guildId: string, tagName: string, ownerId: string, useCount: string } | null };

export type GetTagQueryVariables = Exact<{
  guildId: Scalars['BigInt'];
  tagName: Scalars['String'];
}>;


export type GetTagQuery = { __typename?: 'Query', tagByGuildIdAndTagName?: { __typename?: 'Tag', content: string, attachment?: string | null, created: string, guildId: string, tagName: string, ownerId: string, useCount: string } | null };

export type ListGuildTagsQueryVariables = Exact<{
  guildId: Scalars['BigInt'];
}>;


export type ListGuildTagsQuery = { __typename?: 'Query', allTags?: { __typename?: 'TagsConnection', totalCount: number, edges: Array<{ __typename?: 'TagsEdge', cursor?: any | null, node: { __typename?: 'Tag', content: string, attachment?: string | null, created: string, guildId: string, tagName: string, ownerId: string, useCount: string } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: any | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: any | null } } | null };

export type SearchTagsQueryVariables = Exact<{
  guildId?: InputMaybe<Scalars['BigInt']>;
  ownerId?: InputMaybe<Scalars['BigInt']>;
  filter?: InputMaybe<TagFilter>;
}>;


export type SearchTagsQuery = { __typename?: 'Query', allTags?: { __typename?: 'TagsConnection', totalCount: number, edges: Array<{ __typename?: 'TagsEdge', node: { __typename?: 'Tag', content: string, attachment?: string | null, created: string, guildId: string, tagName: string, ownerId: string, useCount: string } }> } | null };

export type TagDataFragment = { __typename?: 'Tag', content: string, attachment?: string | null, created: string, guildId: string, tagName: string, ownerId: string, useCount: string };

export type UpdateTagMutationVariables = Exact<{
  guildId: Scalars['BigInt'];
  tagName: Scalars['String'];
  tagPatch: TagPatch;
}>;


export type UpdateTagMutation = { __typename?: 'Mutation', updateTagByGuildIdAndTagName?: { __typename?: 'UpdateTagPayload', tag?: { __typename?: 'Tag', content: string, attachment?: string | null, created: string, guildId: string, tagName: string, ownerId: string, useCount: string } | null } | null };

export type CreateUserMutationVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser?: { __typename?: 'CreateUserPayload', user?: { __typename?: 'User', id: string, isPatron: boolean, rep: string, lastRep?: string | null, fishies: string, lastFishies?: string | null, lastfmUsername?: string | null, patronEmoji?: string | null, profileData?: { [key: string]: any } | null } | null } | null };

export type UserByIdQueryVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type UserByIdQuery = { __typename?: 'Query', userById?: { __typename?: 'User', id: string, isPatron: boolean, rep: string, lastRep?: string | null, fishies: string, lastFishies?: string | null, lastfmUsername?: string | null, patronEmoji?: string | null, profileData?: { [key: string]: any } | null } | null };

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['BigInt'];
  userPatch: UserPatch;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUserById?: { __typename?: 'UpdateUserPayload', user?: { __typename?: 'User', id: string, isPatron: boolean, rep: string, lastRep?: string | null, fishies: string, lastFishies?: string | null, lastfmUsername?: string | null, patronEmoji?: string | null, profileData?: { [key: string]: any } | null } | null } | null };

export type UserDataFragment = { __typename?: 'User', id: string, isPatron: boolean, rep: string, lastRep?: string | null, fishies: string, lastFishies?: string | null, lastfmUsername?: string | null, patronEmoji?: string | null, profileData?: { [key: string]: any } | null };

export type UserGlobalLevelQueryVariables = Exact<{
  userId: Scalars['BigInt'];
}>;


export type UserGlobalLevelQuery = { __typename?: 'Query', allUserLevels?: { __typename?: 'UserLevelsConnection', aggregates?: { __typename?: 'UserLevelAggregates', sum?: { __typename?: 'UserLevelSumAggregates', msgAllTime: any, msgDay: any, msgMonth: any, msgWeek: any } | null } | null, nodes: Array<{ __typename?: 'UserLevel', lastMsg: string }> } | null };

export type UserGuildLevelAndRankQueryVariables = Exact<{
  guildId: Scalars['BigInt'];
  userId: Scalars['BigInt'];
}>;


export type UserGuildLevelAndRankQuery = { __typename?: 'Query', userGuildRank?: { __typename?: 'UserGuildRankResult', lastMsg?: string | null, guildId?: string | null, msgAllTime?: string | null, msgAllTimeRank?: string | null, msgDay?: string | null, msgWeekRank?: string | null, msgWeekTotal?: string | null, msgWeek?: string | null, msgMonthTotal?: string | null, msgMonthRank?: string | null, msgMonth?: string | null, msgDayTotal?: string | null, msgDayRank?: string | null, msgAllTimeTotal?: string | null } | null };

export const BanDataFragmentDoc = gql`
    fragment BanData on GuildBan {
  guildId
  nodeId
  userId
}
    `;
export const GuildConfigDataFragmentDoc = gql`
    fragment GuildConfigData on GuildConfig {
  disabledChannels
  inviteGuard
  joinMsg
  joinMsgEnabled
  joinReact
  leaveMsg
  leaveMsgEnabled
  logMember
  logMemberEnabled
  logModEnabled
  logMod
  logMsg
  logMsgEnabled
  maxMention
  msgChannel
  muteDmEnabled
  muteDmText
  muteDuration
  muteRole
  prefix
  roleChannel
  roleConfig
  roleEnabled
  warnDmEnabled
  warnDmText
}
    `;
export const ModLogDataFragmentDoc = gql`
    fragment ModLogData on ModLog {
  action
  actionTime
  attachments
  caseId
  executorId
  guildId
  msgId
  pending
  reason
  userId
  userTag
}
    `;
export const NotificationDataFragmentDoc = gql`
    fragment NotificationData on Notification {
  guildId
  keyword
  nodeId
  userId
}
    `;
export const ReminderDataFragmentDoc = gql`
    fragment ReminderData on Reminder {
  userId
  description
  expireAt
  setAt
}
    `;
export const RoleMenuDataFragmentDoc = gql`
    fragment RoleMenuData on RoleMenu {
  guildId
  menuName
  description
  maxCount
  roleIds
  requiredRole
}
    `;
export const TagDataFragmentDoc = gql`
    fragment TagData on Tag {
  content
  attachment
  created
  guildId
  tagName
  ownerId
  useCount
}
    `;
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
export const GetUserBansDocument = gql`
    query getUserBans($userId: BigInt!) {
  allGuildBans(condition: {userId: $userId}) {
    nodes {
      ...BanData
    }
    totalCount
  }
}
    ${BanDataFragmentDoc}`;
export const GetRedisGuildDocument = gql`
    query getRedisGuild($guild_id: BigInt!) {
  redisGuildByGuildId(guild_id: $guild_id) {
    afkChannelId
    afkTimeout
    applicationId
    banner
    channels
    defaultMessageNotifications
    description
    discoverySplash
    emojis
    explicitContentFilter
    features
    icon
    id
    joinedAt
    large
    maxMembers
    maxVideoChannelUsers
    memberCount
    members
    mfaLevel
    name
    nsfwLevel
    ownerId
    preferredLocale
    premiumSubscriptionCount
    premiumTier
    presences
    roles {
      id
      color
      hoist
      icon
      managed
      mentionable
      position
      name
      permissions
      unicode_emoji
    }
    rulesChannelId
    splash
    systemChannelFlags
    systemChannelId
    unavailable
    vanityUrlCode
    verificationLevel
    voiceStates
  }
}
    `;
export const GuildConfigByIdDocument = gql`
    query guildConfigByID($guildId: BigInt!) {
  guildConfigById(id: $guildId) {
    ...GuildConfigData
  }
}
    ${GuildConfigDataFragmentDoc}`;
export const UpdateGuildConfigDocument = gql`
    mutation updateGuildConfig($id: BigInt!, $patch: GuildConfigPatch!) {
  updateGuildConfigById(input: {guildConfigPatch: $patch, id: $id}) {
    guildConfig {
      ...GuildConfigData
    }
  }
}
    ${GuildConfigDataFragmentDoc}`;
export const CreateModLogDocument = gql`
    mutation createModLog($modLog: ModLogInput!) {
  createModLog(input: {modLog: $modLog}) {
    modLog {
      ...ModLogData
    }
  }
}
    ${ModLogDataFragmentDoc}`;
export const DeleteModLogDocument = gql`
    mutation deleteModLog($caseId: BigInt!, $guildId: BigInt!) {
  deleteModLogByGuildIdAndCaseId(input: {guildId: $guildId, caseId: $caseId}) {
    modLog {
      ...ModLogData
    }
  }
}
    ${ModLogDataFragmentDoc}`;
export const GetModLogDocument = gql`
    query getModLog($caseId: BigInt!, $guildId: BigInt!) {
  modLogByGuildIdAndCaseId(caseId: $caseId, guildId: $guildId) {
    ...ModLogData
  }
}
    ${ModLogDataFragmentDoc}`;
export const GetNextCaseIdDocument = gql`
    query getNextCaseID($guildId: BigInt!) {
  nextCaseId(guildId: $guildId)
}
    `;
export const GetUserModLogHistoryDocument = gql`
    query getUserModLogHistory($guildId: BigInt!, $userId: BigInt!) {
  allModLogs(condition: {guildId: $guildId, userId: $userId}) {
    nodes {
      ...ModLogData
    }
    totalCount
  }
}
    ${ModLogDataFragmentDoc}`;
export const UpdateModLogDocument = gql`
    mutation updateModLog($caseId: BigInt!, $guildId: BigInt!, $modLogPatch: ModLogPatch!) {
  updateModLogByGuildIdAndCaseId(
    input: {modLogPatch: $modLogPatch, guildId: $guildId, caseId: $caseId}
  ) {
    modLog {
      ...ModLogData
    }
  }
}
    ${ModLogDataFragmentDoc}`;
export const CreateNotificationDocument = gql`
    mutation createNotification($notification: NotificationInput!) {
  createNotification(input: {notification: $notification}) {
    notification {
      ...NotificationData
    }
  }
}
    ${NotificationDataFragmentDoc}`;
export const DeleteNotificationDocument = gql`
    mutation deleteNotification($guildId: BigInt!, $userId: BigInt!, $keyword: String!) {
  deleteNotificationByUserIdAndGuildIdAndKeyword(
    input: {userId: $userId, guildId: $guildId, keyword: $keyword}
  ) {
    notification {
      ...NotificationData
    }
  }
}
    ${NotificationDataFragmentDoc}`;
export const GetUserNotificationsDocument = gql`
    query getUserNotifications($userId: BigInt!) {
  allNotifications(condition: {userId: $userId}) {
    nodes {
      ...NotificationData
    }
  }
}
    ${NotificationDataFragmentDoc}`;
export const SearchNotificationsStartingWithDocument = gql`
    query searchNotificationsStartingWith($userId: BigInt!, $query: String!) {
  notificationsStartingWith(userId: $userId, query: $query) {
    nodes
    totalCount
  }
}
    `;
export const CreateReminderDocument = gql`
    mutation createReminder($reminder: ReminderInput!) {
  createReminder(input: {reminder: $reminder}) {
    reminder {
      ...ReminderData
    }
  }
}
    ${ReminderDataFragmentDoc}`;
export const DeleteReminderDocument = gql`
    mutation deleteReminder($userId: BigInt!, $setAt: Datetime!) {
  deleteReminderByUserIdAndSetAt(input: {setAt: $setAt, userId: $userId}) {
    reminder {
      ...ReminderData
    }
  }
}
    ${ReminderDataFragmentDoc}`;
export const GetUserRemindersDocument = gql`
    query getUserReminders($userId: BigInt!) {
  allReminders(condition: {userId: $userId}) {
    nodes {
      ...ReminderData
    }
    totalCount
  }
}
    ${ReminderDataFragmentDoc}`;
export const CreateRoleMenuDocument = gql`
    mutation createRoleMenu($roleMenu: RoleMenuInput!) {
  createRoleMenu(input: {roleMenu: $roleMenu}) {
    roleMenu {
      ...RoleMenuData
    }
  }
}
    ${RoleMenuDataFragmentDoc}`;
export const GetRoleMenuDocument = gql`
    query getRoleMenu($guildId: BigInt!, $menuName: String!) {
  roleMenuByGuildIdAndMenuName(guildId: $guildId, menuName: $menuName) {
    ...RoleMenuData
  }
}
    ${RoleMenuDataFragmentDoc}`;
export const UpdateRoleMenuDocument = gql`
    mutation updateRoleMenu($guildId: BigInt!, $menuName: String!, $roleMenuPatch: RoleMenuPatch!) {
  updateRoleMenuByGuildIdAndMenuName(
    input: {guildId: $guildId, menuName: $menuName, roleMenuPatch: $roleMenuPatch}
  ) {
    roleMenu {
      ...RoleMenuData
    }
  }
}
    ${RoleMenuDataFragmentDoc}`;
export const CreateTagDocument = gql`
    mutation createTag($tag: TagInput!) {
  createTag(input: {tag: $tag}) {
    tag {
      ...TagData
    }
  }
}
    ${TagDataFragmentDoc}`;
export const DeleteTagDocument = gql`
    mutation deleteTag($guildId: BigInt!, $tagName: String!) {
  deleteTagByGuildIdAndTagName(input: {guildId: $guildId, tagName: $tagName}) {
    tag {
      ...TagData
    }
  }
}
    ${TagDataFragmentDoc}`;
export const GetRandomTagDocument = gql`
    query getRandomTag($guildId: BigInt!, $ownerId: BigInt, $query: String, $startsWith: Boolean) {
  randomTag(
    guildId: $guildId
    query: $query
    startsWith: $startsWith
    ownerId: $ownerId
  ) {
    ...TagData
  }
}
    ${TagDataFragmentDoc}`;
export const GetTagDocument = gql`
    query getTag($guildId: BigInt!, $tagName: String!) {
  tagByGuildIdAndTagName(guildId: $guildId, tagName: $tagName) {
    ...TagData
  }
}
    ${TagDataFragmentDoc}`;
export const ListGuildTagsDocument = gql`
    query listGuildTags($guildId: BigInt!) {
  allTags(condition: {guildId: $guildId}, orderBy: TAG_NAME_ASC) {
    edges {
      node {
        ...TagData
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
    totalCount
  }
}
    ${TagDataFragmentDoc}`;
export const SearchTagsDocument = gql`
    query searchTags($guildId: BigInt, $ownerId: BigInt, $filter: TagFilter) {
  allTags(
    filter: $filter
    condition: {guildId: $guildId, ownerId: $ownerId}
    orderBy: TAG_NAME_ASC
  ) {
    edges {
      node {
        ...TagData
      }
    }
    totalCount
  }
}
    ${TagDataFragmentDoc}`;
export const UpdateTagDocument = gql`
    mutation updateTag($guildId: BigInt!, $tagName: String!, $tagPatch: TagPatch!) {
  updateTagByGuildIdAndTagName(
    input: {tagPatch: $tagPatch, guildId: $guildId, tagName: $tagName}
  ) {
    tag {
      ...TagData
    }
  }
}
    ${TagDataFragmentDoc}`;
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
export const UserGlobalLevelDocument = gql`
    query userGlobalLevel($userId: BigInt!) {
  allUserLevels(condition: {userId: $userId}) {
    aggregates {
      sum {
        msgAllTime
        msgDay
        msgMonth
        msgWeek
      }
    }
    nodes {
      lastMsg
    }
  }
}
    `;
export const UserGuildLevelAndRankDocument = gql`
    query userGuildLevelAndRank($guildId: BigInt!, $userId: BigInt!) {
  userGuildRank(guildId: $guildId, userId: $userId) {
    lastMsg
    guildId
    msgAllTime
    msgAllTimeRank
    msgDay
    msgWeekRank
    msgWeekTotal
    msgWeek
    msgMonthTotal
    msgMonthRank
    msgMonth
    msgDayTotal
    msgDayRank
    msgAllTimeTotal
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getUserBans(variables: GetUserBansQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetUserBansQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetUserBansQuery>(GetUserBansDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getUserBans', 'query');
    },
    getRedisGuild(variables: GetRedisGuildQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetRedisGuildQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetRedisGuildQuery>(GetRedisGuildDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getRedisGuild', 'query');
    },
    guildConfigByID(variables: GuildConfigByIdQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GuildConfigByIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GuildConfigByIdQuery>(GuildConfigByIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'guildConfigByID', 'query');
    },
    updateGuildConfig(variables: UpdateGuildConfigMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateGuildConfigMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateGuildConfigMutation>(UpdateGuildConfigDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateGuildConfig', 'mutation');
    },
    createModLog(variables: CreateModLogMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateModLogMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateModLogMutation>(CreateModLogDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createModLog', 'mutation');
    },
    deleteModLog(variables: DeleteModLogMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteModLogMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteModLogMutation>(DeleteModLogDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteModLog', 'mutation');
    },
    getModLog(variables: GetModLogQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetModLogQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetModLogQuery>(GetModLogDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getModLog', 'query');
    },
    getNextCaseID(variables: GetNextCaseIdQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetNextCaseIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetNextCaseIdQuery>(GetNextCaseIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getNextCaseID', 'query');
    },
    getUserModLogHistory(variables: GetUserModLogHistoryQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetUserModLogHistoryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetUserModLogHistoryQuery>(GetUserModLogHistoryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getUserModLogHistory', 'query');
    },
    updateModLog(variables: UpdateModLogMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateModLogMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateModLogMutation>(UpdateModLogDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateModLog', 'mutation');
    },
    createNotification(variables: CreateNotificationMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateNotificationMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateNotificationMutation>(CreateNotificationDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createNotification', 'mutation');
    },
    deleteNotification(variables: DeleteNotificationMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteNotificationMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteNotificationMutation>(DeleteNotificationDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteNotification', 'mutation');
    },
    getUserNotifications(variables: GetUserNotificationsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetUserNotificationsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetUserNotificationsQuery>(GetUserNotificationsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getUserNotifications', 'query');
    },
    searchNotificationsStartingWith(variables: SearchNotificationsStartingWithQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SearchNotificationsStartingWithQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SearchNotificationsStartingWithQuery>(SearchNotificationsStartingWithDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'searchNotificationsStartingWith', 'query');
    },
    createReminder(variables: CreateReminderMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateReminderMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateReminderMutation>(CreateReminderDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createReminder', 'mutation');
    },
    deleteReminder(variables: DeleteReminderMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteReminderMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteReminderMutation>(DeleteReminderDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteReminder', 'mutation');
    },
    getUserReminders(variables: GetUserRemindersQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetUserRemindersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetUserRemindersQuery>(GetUserRemindersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getUserReminders', 'query');
    },
    createRoleMenu(variables: CreateRoleMenuMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateRoleMenuMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateRoleMenuMutation>(CreateRoleMenuDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createRoleMenu', 'mutation');
    },
    getRoleMenu(variables: GetRoleMenuQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetRoleMenuQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetRoleMenuQuery>(GetRoleMenuDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getRoleMenu', 'query');
    },
    updateRoleMenu(variables: UpdateRoleMenuMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateRoleMenuMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateRoleMenuMutation>(UpdateRoleMenuDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateRoleMenu', 'mutation');
    },
    createTag(variables: CreateTagMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateTagMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateTagMutation>(CreateTagDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createTag', 'mutation');
    },
    deleteTag(variables: DeleteTagMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteTagMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteTagMutation>(DeleteTagDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteTag', 'mutation');
    },
    getRandomTag(variables: GetRandomTagQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetRandomTagQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetRandomTagQuery>(GetRandomTagDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getRandomTag', 'query');
    },
    getTag(variables: GetTagQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetTagQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetTagQuery>(GetTagDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getTag', 'query');
    },
    listGuildTags(variables: ListGuildTagsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ListGuildTagsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListGuildTagsQuery>(ListGuildTagsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'listGuildTags', 'query');
    },
    searchTags(variables?: SearchTagsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SearchTagsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SearchTagsQuery>(SearchTagsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'searchTags', 'query');
    },
    updateTag(variables: UpdateTagMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateTagMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateTagMutation>(UpdateTagDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateTag', 'mutation');
    },
    createUser(variables: CreateUserMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateUserMutation>(CreateUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createUser', 'mutation');
    },
    userByID(variables: UserByIdQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UserByIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<UserByIdQuery>(UserByIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'userByID', 'query');
    },
    updateUser(variables: UpdateUserMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateUserMutation>(UpdateUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateUser', 'mutation');
    },
    userGlobalLevel(variables: UserGlobalLevelQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UserGlobalLevelQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<UserGlobalLevelQuery>(UserGlobalLevelDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'userGlobalLevel', 'query');
    },
    userGuildLevelAndRank(variables: UserGuildLevelAndRankQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UserGuildLevelAndRankQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<UserGuildLevelAndRankQuery>(UserGuildLevelAndRankDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'userGuildLevelAndRank', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;