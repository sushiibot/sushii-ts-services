import type { ColumnType } from "kysely";
import type { IPostgresInterval } from "postgres-interval";

export type AppPublicBlockType = "channel" | "role";

export type AppPublicEmojiStickerActionType = "message" | "reaction";

export type AppPublicGuildAssetType = "emoji" | "sticker";

export type AppPublicLevelRoleOverrideType = "block" | "grant";

export type AppPublicMsgLogBlockType = "all" | "deletes" | "edits";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Int8 = ColumnType<string, string | number | bigint, string | number | bigint>;

export type Interval = ColumnType<IPostgresInterval, IPostgresInterval | number, IPostgresInterval | number>;

export type Json = ColumnType<JsonValue, string, string>;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [K in string]?: JsonValue;
};

export type JsonPrimitive = boolean | null | number | string;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface _TimescaledbCatalogChunk {
  id: Generated<number>;
  hypertable_id: number;
  schema_name: string;
  table_name: string;
  compressed_chunk_id: number | null;
  dropped: Generated<boolean>;
  status: Generated<number>;
}

export interface _TimescaledbCatalogChunkConstraint {
  chunk_id: number;
  dimension_slice_id: number | null;
  constraint_name: string;
  hypertable_constraint_name: string | null;
}

export interface _TimescaledbCatalogChunkCopyOperation {
  operation_id: string;
  backend_pid: number;
  completed_stage: string;
  time_start: Generated<Timestamp>;
  chunk_id: number;
  source_node_name: string;
  dest_node_name: string;
  delete_on_source_node: boolean;
}

export interface _TimescaledbCatalogChunkDataNode {
  chunk_id: number;
  node_chunk_id: number;
  node_name: string;
}

export interface _TimescaledbCatalogChunkIndex {
  chunk_id: number;
  index_name: string;
  hypertable_id: number;
  hypertable_index_name: string;
}

export interface _TimescaledbCatalogCompressionAlgorithm {
  id: number;
  version: number;
  name: string;
  description: string | null;
}

export interface _TimescaledbCatalogCompressionChunkSize {
  chunk_id: number;
  compressed_chunk_id: number;
  uncompressed_heap_size: Int8;
  uncompressed_toast_size: Int8;
  uncompressed_index_size: Int8;
  compressed_heap_size: Int8;
  compressed_toast_size: Int8;
  compressed_index_size: Int8;
  numrows_pre_compression: Int8 | null;
  numrows_post_compression: Int8 | null;
}

export interface _TimescaledbCatalogContinuousAgg {
  mat_hypertable_id: number;
  raw_hypertable_id: number;
  user_view_schema: string;
  user_view_name: string;
  partial_view_schema: string;
  partial_view_name: string;
  bucket_width: Int8;
  direct_view_schema: string;
  direct_view_name: string;
  materialized_only: Generated<boolean>;
}

export interface _TimescaledbCatalogContinuousAggsBucketFunction {
  mat_hypertable_id: number;
  experimental: boolean;
  name: string;
  bucket_width: string;
  origin: string;
  timezone: string;
}

export interface _TimescaledbCatalogContinuousAggsHypertableInvalidationLog {
  hypertable_id: number;
  lowest_modified_value: Int8;
  greatest_modified_value: Int8;
}

export interface _TimescaledbCatalogContinuousAggsInvalidationThreshold {
  hypertable_id: number;
  watermark: Int8;
}

export interface _TimescaledbCatalogContinuousAggsMaterializationInvalidationLog {
  materialization_id: number | null;
  lowest_modified_value: Int8;
  greatest_modified_value: Int8;
}

export interface _TimescaledbCatalogDimension {
  id: Generated<number>;
  hypertable_id: number;
  column_name: string;
  column_type: string;
  aligned: boolean;
  num_slices: number | null;
  partitioning_func_schema: string | null;
  partitioning_func: string | null;
  interval_length: Int8 | null;
  integer_now_func_schema: string | null;
  integer_now_func: string | null;
}

export interface _TimescaledbCatalogDimensionSlice {
  id: Generated<number>;
  dimension_id: number;
  range_start: Int8;
  range_end: Int8;
}

export interface _TimescaledbCatalogHypertable {
  id: Generated<number>;
  schema_name: string;
  table_name: string;
  associated_schema_name: string;
  associated_table_prefix: string;
  num_dimensions: number;
  chunk_sizing_func_schema: string;
  chunk_sizing_func_name: string;
  chunk_target_size: Int8;
  compression_state: Generated<number>;
  compressed_hypertable_id: number | null;
  replication_factor: number | null;
}

export interface _TimescaledbCatalogHypertableCompression {
  hypertable_id: number;
  attname: string;
  compression_algorithm_id: number | null;
  segmentby_column_index: number | null;
  orderby_column_index: number | null;
  orderby_asc: boolean | null;
  orderby_nullsfirst: boolean | null;
}

export interface _TimescaledbCatalogHypertableDataNode {
  hypertable_id: number;
  node_hypertable_id: number | null;
  node_name: string;
  block_chunks: boolean;
}

export interface _TimescaledbCatalogMetadata {
  key: string;
  value: string;
  include_in_telemetry: boolean;
}

export interface _TimescaledbCatalogRemoteTxn {
  data_node_name: string | null;
  remote_transaction_id: string;
}

export interface _TimescaledbCatalogTablespace {
  id: Generated<number>;
  hypertable_id: number;
  tablespace_name: string;
}

export interface _TimescaledbConfigBgwJob {
  id: Generated<number>;
  application_name: string;
  schedule_interval: Interval;
  max_runtime: Interval;
  max_retries: number;
  retry_period: Interval;
  proc_schema: string;
  proc_name: string;
  owner: Generated<string>;
  scheduled: Generated<boolean>;
  hypertable_id: number | null;
  config: Json | null;
}

export interface _TimescaledbInternalBgwJobStat {
  job_id: number;
  last_start: Generated<Timestamp>;
  last_finish: Timestamp;
  next_start: Timestamp;
  last_successful_finish: Timestamp;
  last_run_success: boolean;
  total_runs: Int8;
  total_duration: Interval;
  total_successes: Int8;
  total_failures: Int8;
  total_crashes: Int8;
  consecutive_failures: number;
  consecutive_crashes: number;
}

export interface _TimescaledbInternalBgwPolicyChunkStats {
  job_id: number;
  chunk_id: number;
  num_times_job_run: number | null;
  last_time_job_run: Timestamp | null;
}

export interface _TimescaledbInternalCompressedChunkStats {
  hypertable_schema: string | null;
  hypertable_name: string | null;
  chunk_schema: string | null;
  chunk_name: string | null;
  compression_status: string | null;
  uncompressed_heap_size: Int8 | null;
  uncompressed_index_size: Int8 | null;
  uncompressed_toast_size: Int8 | null;
  uncompressed_total_size: Int8 | null;
  compressed_heap_size: Int8 | null;
  compressed_index_size: Int8 | null;
  compressed_toast_size: Int8 | null;
  compressed_total_size: Int8 | null;
}

export interface _TimescaledbInternalHypertableChunkLocalSize {
  hypertable_schema: string | null;
  hypertable_name: string | null;
  hypertable_id: number | null;
  chunk_id: number | null;
  chunk_schema: string | null;
  chunk_name: string | null;
  total_bytes: Int8 | null;
  index_bytes: Int8 | null;
  toast_bytes: Int8 | null;
  compressed_total_size: Int8 | null;
  compressed_index_size: Int8 | null;
  compressed_toast_size: Int8 | null;
  compressed_heap_size: Int8 | null;
}

export interface AppHiddenFailures {
  failure_id: string;
  max_attempts: Generated<number>;
  attempt_count: number;
  last_attempt: Timestamp;
  next_attempt: Generated<Timestamp>;
}

export interface AppPrivateSessions {
  uuid: Generated<string>;
  user_id: Int8;
  created_at: Generated<Timestamp>;
  last_active: Generated<Timestamp>;
}

export interface AppPrivateUserAuthenticationSecrets {
  user_id: Int8;
  details: Generated<Json>;
}

export interface AppPublicBotStats {
  name: string;
  category: string;
  count: Int8;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}

export interface AppPublicCachedGuilds {
  id: Int8;
  name: string;
  icon: string | null;
  splash: string | null;
  banner: string | null;
  features: Generated<string[]>;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}

export interface AppPublicCachedUsers {
  id: Int8;
  avatar_url: string;
  name: string;
  discriminator: number;
  last_checked: Timestamp;
}

export interface AppPublicEmojiStickerStats {
  time: Generated<Timestamp>;
  guild_id: Int8;
  asset_id: Int8;
  action_type: AppPublicEmojiStickerActionType;
  asset_type: AppPublicGuildAssetType;
  count: Int8;
  count_external: Generated<Int8>;
}

export interface AppPublicEmojiStickerStatsRateLimits {
  user_id: Int8;
  asset_id: Int8;
  action_type: AppPublicEmojiStickerActionType;
  last_used: Generated<Timestamp>;
}

export interface AppPublicFeedItems {
  feed_id: string;
  item_id: string;
}

export interface AppPublicFeeds {
  feed_id: string;
  metadata: Json | null;
}

export interface AppPublicFeedSubscriptions {
  feed_id: string;
  guild_id: Int8;
  channel_id: Int8;
  mention_role: Int8 | null;
}

export interface AppPublicGuildBans {
  guild_id: Int8;
  user_id: Int8;
}

export interface AppPublicGuildConfigs {
  id: Int8;
  prefix: string | null;
  join_msg: string | null;
  join_msg_enabled: Generated<boolean>;
  join_react: string | null;
  leave_msg: string | null;
  leave_msg_enabled: Generated<boolean>;
  msg_channel: Int8 | null;
  role_channel: Int8 | null;
  role_config: Json | null;
  role_enabled: Generated<boolean>;
  log_msg: Int8 | null;
  log_msg_enabled: Generated<boolean>;
  log_mod: Int8 | null;
  log_mod_enabled: Generated<boolean>;
  log_member: Int8 | null;
  log_member_enabled: Generated<boolean>;
  mute_dm_text: string | null;
  mute_dm_enabled: Generated<boolean>;
  warn_dm_text: string | null;
  warn_dm_enabled: Generated<boolean>;
  disabled_channels: Int8[] | null;
  data: Generated<Json>;
  lookup_details_opt_in: Generated<boolean>;
  lookup_prompted: Generated<boolean>;
}

export interface AppPublicGuildEmojisAndStickers {
  id: Int8;
  guild_id: Int8;
  name: string;
  type: AppPublicGuildAssetType;
}

export interface AppPublicLevelRoleApplyJobs {
  guild_id: Int8;
  interaction_id: Int8;
  notify_user_id: Int8;
  channel_id: Int8;
  message_id: Int8;
  requests_total: Int8 | null;
  requests_processed: Generated<Int8>;
  members_total: Int8;
  members_skipped: Generated<Int8>;
  members_applied: Generated<Int8>;
  members_not_found: Generated<Int8>;
  members_total_processed: Generated<Int8>;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}

export interface AppPublicLevelRoleOverrides {
  guild_id: Int8;
  role_id: Int8;
  user_id: Int8;
  type: AppPublicLevelRoleOverrideType;
}

export interface AppPublicLevelRoles {
  guild_id: Int8;
  role_id: Int8;
  add_level: Int8 | null;
  remove_level: Int8 | null;
}

export interface AppPublicMembers {
  guild_id: Int8;
  user_id: Int8;
  join_time: Timestamp;
}

export interface AppPublicMessages {
  message_id: Int8;
  author_id: Int8;
  channel_id: Int8;
  guild_id: Int8;
  created: Timestamp;
  content: string;
  msg: Json;
}

export interface AppPublicModLogs {
  guild_id: Int8;
  case_id: Int8;
  action: string;
  action_time: Timestamp;
  pending: boolean;
  user_id: Int8;
  user_tag: string;
  executor_id: Int8 | null;
  reason: string | null;
  msg_id: Int8 | null;
  attachments: Generated<string[]>;
}

export interface AppPublicMsgLogBlocks {
  guild_id: Int8;
  channel_id: Int8;
  block_type: AppPublicMsgLogBlockType;
}

export interface AppPublicMutes {
  guild_id: Int8;
  user_id: Int8;
  start_time: Timestamp;
  end_time: Timestamp | null;
  pending: Generated<boolean>;
  case_id: Int8 | null;
}

export interface AppPublicNotifications {
  user_id: Int8;
  guild_id: Int8;
  keyword: string;
}

export interface AppPublicReminders {
  user_id: Int8;
  description: string;
  set_at: Timestamp;
  expire_at: Timestamp;
}

export interface AppPublicRoleMenuRoles {
  guild_id: Int8;
  menu_name: string;
  role_id: Int8;
  emoji: string | null;
  description: string | null;
  position: number | null;
}

export interface AppPublicRoleMenus {
  guild_id: Int8;
  menu_name: string;
  description: string | null;
  max_count: number | null;
  required_role: Int8 | null;
}

export interface AppPublicTags {
  owner_id: Int8;
  guild_id: Int8;
  tag_name: string;
  content: string;
  use_count: Int8;
  created: Timestamp;
  attachment: string | null;
}

export interface AppPublicUserLevels {
  user_id: Int8;
  guild_id: Int8;
  msg_all_time: Int8;
  msg_month: Int8;
  msg_week: Int8;
  msg_day: Int8;
  last_msg: Timestamp;
  level: Generated<Int8>;
}

export interface AppPublicUsers {
  id: Int8;
  is_patron: boolean;
  patron_emoji: string | null;
  rep: Int8;
  fishies: Int8;
  last_rep: Timestamp | null;
  last_fishies: Timestamp | null;
  lastfm_username: string | null;
  profile_data: Json | null;
}

export interface AppPublicWebUserGuilds {
  user_id: Int8;
  guild_id: Int8;
  owner: boolean;
  permissions: Int8;
  manage_guild: Generated<boolean | null>;
}

export interface AppPublicWebUsers {
  id: Int8;
  username: string;
  discriminator: number;
  avatar: string | null;
  is_admin: Generated<boolean>;
  details: Generated<Json>;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}

export interface AppPublicXpBlocks {
  guild_id: Int8;
  block_id: Int8;
  block_type: AppPublicBlockType;
}

export interface GraphileMigrateCurrent {
  filename: Generated<string>;
  content: string;
  date: Generated<Timestamp>;
}

export interface GraphileMigrateMigrations {
  hash: string;
  previous_hash: string | null;
  filename: string;
  date: Generated<Timestamp>;
}

export interface TimescaledbExperimentalChunkReplicationStatus {
  hypertable_schema: string | null;
  hypertable_name: string | null;
  chunk_schema: string | null;
  chunk_name: string | null;
  desired_num_replicas: number | null;
  num_replicas: Int8 | null;
  replica_nodes: string[] | null;
  non_replica_nodes: string[] | null;
}

export interface TimescaledbInformationChunks {
  hypertable_schema: string | null;
  hypertable_name: string | null;
  chunk_schema: string | null;
  chunk_name: string | null;
  primary_dimension: string | null;
  primary_dimension_type: string | null;
  range_start: Timestamp | null;
  range_end: Timestamp | null;
  range_start_integer: Int8 | null;
  range_end_integer: Int8 | null;
  is_compressed: boolean | null;
  chunk_tablespace: string | null;
  data_nodes: string[] | null;
}

export interface TimescaledbInformationCompressionSettings {
  hypertable_schema: string | null;
  hypertable_name: string | null;
  attname: string | null;
  segmentby_column_index: number | null;
  orderby_column_index: number | null;
  orderby_asc: boolean | null;
  orderby_nullsfirst: boolean | null;
}

export interface TimescaledbInformationContinuousAggregates {
  hypertable_schema: string | null;
  hypertable_name: string | null;
  view_schema: string | null;
  view_name: string | null;
  view_owner: string | null;
  materialized_only: boolean | null;
  compression_enabled: boolean | null;
  materialization_hypertable_schema: string | null;
  materialization_hypertable_name: string | null;
  view_definition: string | null;
}

export interface TimescaledbInformationDataNodes {
  node_name: string | null;
  owner: string | null;
  options: string[] | null;
}

export interface TimescaledbInformationDimensions {
  hypertable_schema: string | null;
  hypertable_name: string | null;
  dimension_number: Int8 | null;
  column_name: string | null;
  column_type: string | null;
  dimension_type: string | null;
  time_interval: Interval | null;
  integer_interval: Int8 | null;
  integer_now_func: string | null;
  num_partitions: number | null;
}

export interface TimescaledbInformationHypertables {
  hypertable_schema: string | null;
  hypertable_name: string | null;
  owner: string | null;
  num_dimensions: number | null;
  num_chunks: Int8 | null;
  compression_enabled: boolean | null;
  is_distributed: boolean | null;
  replication_factor: number | null;
  data_nodes: string[] | null;
  tablespaces: string[] | null;
}

export interface TimescaledbInformationJobs {
  job_id: number | null;
  application_name: string | null;
  schedule_interval: Interval | null;
  max_runtime: Interval | null;
  max_retries: number | null;
  retry_period: Interval | null;
  proc_schema: string | null;
  proc_name: string | null;
  owner: string | null;
  scheduled: boolean | null;
  config: Json | null;
  next_start: Timestamp | null;
  hypertable_schema: string | null;
  hypertable_name: string | null;
}

export interface TimescaledbInformationJobStats {
  hypertable_schema: string | null;
  hypertable_name: string | null;
  job_id: number | null;
  last_run_started_at: Timestamp | null;
  last_successful_finish: Timestamp | null;
  last_run_status: string | null;
  job_status: string | null;
  last_run_duration: Interval | null;
  next_start: Timestamp | null;
  total_runs: Int8 | null;
  total_successes: Int8 | null;
  total_failures: Int8 | null;
}

export interface DB {
  "_timescaledb_catalog.chunk": _TimescaledbCatalogChunk;
  "_timescaledb_catalog.chunk_constraint": _TimescaledbCatalogChunkConstraint;
  "_timescaledb_catalog.chunk_copy_operation": _TimescaledbCatalogChunkCopyOperation;
  "_timescaledb_catalog.chunk_data_node": _TimescaledbCatalogChunkDataNode;
  "_timescaledb_catalog.chunk_index": _TimescaledbCatalogChunkIndex;
  "_timescaledb_catalog.compression_algorithm": _TimescaledbCatalogCompressionAlgorithm;
  "_timescaledb_catalog.compression_chunk_size": _TimescaledbCatalogCompressionChunkSize;
  "_timescaledb_catalog.continuous_agg": _TimescaledbCatalogContinuousAgg;
  "_timescaledb_catalog.continuous_aggs_bucket_function": _TimescaledbCatalogContinuousAggsBucketFunction;
  "_timescaledb_catalog.continuous_aggs_hypertable_invalidation_log": _TimescaledbCatalogContinuousAggsHypertableInvalidationLog;
  "_timescaledb_catalog.continuous_aggs_invalidation_threshold": _TimescaledbCatalogContinuousAggsInvalidationThreshold;
  "_timescaledb_catalog.continuous_aggs_materialization_invalidation_log": _TimescaledbCatalogContinuousAggsMaterializationInvalidationLog;
  "_timescaledb_catalog.dimension": _TimescaledbCatalogDimension;
  "_timescaledb_catalog.dimension_slice": _TimescaledbCatalogDimensionSlice;
  "_timescaledb_catalog.hypertable": _TimescaledbCatalogHypertable;
  "_timescaledb_catalog.hypertable_compression": _TimescaledbCatalogHypertableCompression;
  "_timescaledb_catalog.hypertable_data_node": _TimescaledbCatalogHypertableDataNode;
  "_timescaledb_catalog.metadata": _TimescaledbCatalogMetadata;
  "_timescaledb_catalog.remote_txn": _TimescaledbCatalogRemoteTxn;
  "_timescaledb_catalog.tablespace": _TimescaledbCatalogTablespace;
  "_timescaledb_config.bgw_job": _TimescaledbConfigBgwJob;
  "_timescaledb_internal.bgw_job_stat": _TimescaledbInternalBgwJobStat;
  "_timescaledb_internal.bgw_policy_chunk_stats": _TimescaledbInternalBgwPolicyChunkStats;
  "_timescaledb_internal.compressed_chunk_stats": _TimescaledbInternalCompressedChunkStats;
  "_timescaledb_internal.hypertable_chunk_local_size": _TimescaledbInternalHypertableChunkLocalSize;
  "app_hidden.failures": AppHiddenFailures;
  "app_private.sessions": AppPrivateSessions;
  "app_private.user_authentication_secrets": AppPrivateUserAuthenticationSecrets;
  "app_public.bot_stats": AppPublicBotStats;
  "app_public.cached_guilds": AppPublicCachedGuilds;
  "app_public.cached_users": AppPublicCachedUsers;
  "app_public.emoji_sticker_stats": AppPublicEmojiStickerStats;
  "app_public.emoji_sticker_stats_rate_limits": AppPublicEmojiStickerStatsRateLimits;
  "app_public.feed_items": AppPublicFeedItems;
  "app_public.feed_subscriptions": AppPublicFeedSubscriptions;
  "app_public.feeds": AppPublicFeeds;
  "app_public.guild_bans": AppPublicGuildBans;
  "app_public.guild_configs": AppPublicGuildConfigs;
  "app_public.guild_emojis_and_stickers": AppPublicGuildEmojisAndStickers;
  "app_public.level_role_apply_jobs": AppPublicLevelRoleApplyJobs;
  "app_public.level_role_overrides": AppPublicLevelRoleOverrides;
  "app_public.level_roles": AppPublicLevelRoles;
  "app_public.members": AppPublicMembers;
  "app_public.messages": AppPublicMessages;
  "app_public.mod_logs": AppPublicModLogs;
  "app_public.msg_log_blocks": AppPublicMsgLogBlocks;
  "app_public.mutes": AppPublicMutes;
  "app_public.notifications": AppPublicNotifications;
  "app_public.reminders": AppPublicReminders;
  "app_public.role_menu_roles": AppPublicRoleMenuRoles;
  "app_public.role_menus": AppPublicRoleMenus;
  "app_public.tags": AppPublicTags;
  "app_public.user_levels": AppPublicUserLevels;
  "app_public.users": AppPublicUsers;
  "app_public.web_user_guilds": AppPublicWebUserGuilds;
  "app_public.web_users": AppPublicWebUsers;
  "app_public.xp_blocks": AppPublicXpBlocks;
  "graphile_migrate.current": GraphileMigrateCurrent;
  "graphile_migrate.migrations": GraphileMigrateMigrations;
  "timescaledb_experimental.chunk_replication_status": TimescaledbExperimentalChunkReplicationStatus;
  "timescaledb_information.chunks": TimescaledbInformationChunks;
  "timescaledb_information.compression_settings": TimescaledbInformationCompressionSettings;
  "timescaledb_information.continuous_aggregates": TimescaledbInformationContinuousAggregates;
  "timescaledb_information.data_nodes": TimescaledbInformationDataNodes;
  "timescaledb_information.dimensions": TimescaledbInformationDimensions;
  "timescaledb_information.hypertables": TimescaledbInformationHypertables;
  "timescaledb_information.job_stats": TimescaledbInformationJobStats;
  "timescaledb_information.jobs": TimescaledbInformationJobs;
}
