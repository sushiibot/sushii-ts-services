import {
  pgSchema,
  pgPolicy,
  bigint,
  text,
  integer,
  timestamp,
  jsonb,
  index,
  foreignKey,
  boolean,
  unique,
  primaryKey,
  check,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const appPublic = pgSchema("app_public");
export const appHidden = pgSchema("app_hidden");
export const appPrivate = pgSchema("app_private");
export const levelTimeframeInAppHidden = appHidden.enum("level_timeframe", [
  "ALL_TIME",
  "DAY",
  "WEEK",
  "MONTH",
]);
export const deploymentNameInAppPrivate = appPrivate.enum("deployment_name", [
  "blue",
  "green",
]);
export const blockTypeInAppPublic = appPublic.enum("block_type", [
  "channel",
  "role",
]);
export const emojiStickerActionTypeInAppPublic = appPublic.enum(
  "emoji_sticker_action_type",
  ["message", "reaction"],
);
export const giveawayNitroTypeInAppPublic = appPublic.enum(
  "giveaway_nitro_type",
  ["none", "nitro"],
);
export const guildAssetTypeInAppPublic = appPublic.enum("guild_asset_type", [
  "emoji",
  "sticker",
]);
export const msgLogBlockTypeInAppPublic = appPublic.enum("msg_log_block_type", [
  "edits",
  "deletes",
  "all",
]);
export const notificationBlockTypeInAppPublic = appPublic.enum(
  "notification_block_type",
  ["user", "channel", "category"],
);

export const cachedUsersInAppPublic = appPublic.table(
  "cached_users",
  {
    id: bigint({ mode: "bigint" }).primaryKey().notNull(),
    avatarUrl: text("avatar_url").notNull(),
    name: text().notNull(),
    discriminator: integer().notNull(),
    lastChecked: timestamp("last_checked", { mode: "string" }).notNull(),
  },
  () => [
    pgPolicy("select_all", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`true`,
    }),
  ],
);

export const failuresInAppHidden = appHidden.table("failures", {
  failureId: text("failure_id").primaryKey().notNull(),
  maxAttempts: integer("max_attempts").default(25).notNull(),
  attemptCount: integer("attempt_count").notNull(),
  lastAttempt: timestamp("last_attempt", { mode: "string" }).notNull(),
  nextAttempt: timestamp("next_attempt", { mode: "string" })
    .notNull()
    .generatedAlwaysAs(
      sql`(last_attempt + (exp((LEAST(10, attempt_count))::double precision) * '00:00:01'::interval))`,
    ),
});

export const cachedGuildsInAppPublic = appPublic.table(
  "cached_guilds",
  {
    id: bigint({ mode: "bigint" }).primaryKey().notNull(),
    name: text().notNull(),
    icon: text(),
    splash: text(),
    banner: text(),
    features: text().array().default([""]).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  () => [
    pgPolicy("select_all", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`true`,
    }),
  ],
);

export const messagesInAppPublic = appPublic.table(
  "messages",
  {
    messageId: bigint("message_id", { mode: "bigint" }).primaryKey().notNull(),
    authorId: bigint("author_id", { mode: "bigint" }).notNull(),
    channelId: bigint("channel_id", { mode: "bigint" }).notNull(),
    guildId: bigint("guild_id", { mode: "bigint" }).notNull(),
    created: timestamp({ mode: "string" }).notNull(),
    content: text().notNull(),
    msg: jsonb().notNull(),
  },
  (table) => [
    index("messages_created_idx").using(
      "btree",
      table.created.asc().nullsLast().op("timestamp_ops"),
    ),
  ],
);

export const guildConfigsInAppPublic = appPublic.table(
  "guild_configs",
  {
    id: bigint({ mode: "bigint" }).primaryKey().notNull(),
    prefix: text(),
    joinMsg: text("join_msg"),
    joinMsgEnabled: boolean("join_msg_enabled").default(true).notNull(),
    joinReact: text("join_react"),
    leaveMsg: text("leave_msg"),
    leaveMsgEnabled: boolean("leave_msg_enabled").default(true).notNull(),
    msgChannel: bigint("msg_channel", { mode: "bigint" }),
    roleChannel: bigint("role_channel", { mode: "bigint" }),
    roleConfig: jsonb("role_config"),
    roleEnabled: boolean("role_enabled").default(true).notNull(),
    logMsg: bigint("log_msg", { mode: "bigint" }),
    logMsgEnabled: boolean("log_msg_enabled").default(true).notNull(),
    logMod: bigint("log_mod", { mode: "bigint" }),
    logModEnabled: boolean("log_mod_enabled").default(true).notNull(),
    logMember: bigint("log_member", { mode: "bigint" }),
    logMemberEnabled: boolean("log_member_enabled").default(true).notNull(),
    muteDmText: text("mute_dm_text"),
    muteDmEnabled: boolean("mute_dm_enabled").default(true).notNull(),
    warnDmText: text("warn_dm_text"),
    warnDmEnabled: boolean("warn_dm_enabled").default(true).notNull(),
    disabledChannels: bigint("disabled_channels", { mode: "bigint" }).array(),
    data: jsonb().default({}).notNull(),
    lookupDetailsOptIn: boolean("lookup_details_opt_in")
      .default(false)
      .notNull(),
    lookupPrompted: boolean("lookup_prompted").default(false).notNull(),
  },
  () => [
    pgPolicy("admin_access", {
      as: "permissive",
      for: "all",
      to: ["sushii_admin"],
      using: sql`true`,
    }),
    pgPolicy("update_managed_guild", {
      as: "permissive",
      for: "update",
      to: ["public"],
    }),
    pgPolicy("select_managed_guild", {
      as: "permissive",
      for: "select",
      to: ["public"],
    }),
  ],
);

export const guildEmojisAndStickersInAppPublic = appPublic.table(
  "guild_emojis_and_stickers",
  {
    id: bigint({ mode: "bigint" }).primaryKey().notNull(),
    guildId: bigint("guild_id", { mode: "bigint" }).notNull(),
    name: text().notNull(),
    type: guildAssetTypeInAppPublic().notNull(),
  },
);

export const activeDeploymentInAppPrivate = appPrivate.table(
  "active_deployment",
  {
    id: integer()
      .notNull()
      .generatedAlwaysAs(sql`1`),
    name: deploymentNameInAppPrivate().notNull(),
  },
  (table) => [unique("active_deployment_id_key").on(table.id)],
);

export const giveawaysInAppPublic = appPublic.table("giveaways", {
  id: bigint({ mode: "bigint" }).primaryKey().notNull(),
  channelId: bigint("channel_id", { mode: "bigint" }).notNull(),
  guildId: bigint("guild_id", { mode: "bigint" }).notNull(),
  hostUserId: bigint("host_user_id", { mode: "bigint" }).notNull(),
  prize: text().notNull(),
  numWinners: integer("num_winners").notNull(),
  requiredRoleId: bigint("required_role_id", { mode: "bigint" }),
  requiredMinLevel: integer("required_min_level"),
  requiredMaxLevel: integer("required_max_level"),
  requiredNitroState: giveawayNitroTypeInAppPublic("required_nitro_state"),
  requiredBoosting: boolean("required_boosting"),
  isEnded: boolean("is_ended").default(false).notNull(),
  startAt: timestamp("start_at", { mode: "string" }).notNull(),
  endAt: timestamp("end_at", { mode: "string" }).notNull(),
});

export const guildBansInAppPublic = appPublic.table(
  "guild_bans",
  {
    guildId: bigint("guild_id", { mode: "bigint" }).notNull(),
    userId: bigint("user_id", { mode: "bigint" }).notNull(),
  },
  (table) => [
    index("guild_bans_user_id_idx").using(
      "btree",
      table.userId.asc().nullsLast().op("int8_ops"),
    ),
    primaryKey({
      columns: [table.guildId, table.userId],
      name: "guild_bans_pkey",
    }),
  ],
);

export const membersInAppPublic = appPublic.table(
  "members",
  {
    guildId: bigint("guild_id", { mode: "bigint" }).notNull(),
    userId: bigint("user_id", { mode: "bigint" }).notNull(),
    joinTime: timestamp("join_time", { mode: "string" }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.guildId, table.userId],
      name: "members_pkey",
    }),
  ],
);

export const notificationsInAppPublic = appPublic.table(
  "notifications",
  {
    userId: bigint("user_id", { mode: "bigint" }).notNull(),
    guildId: bigint("guild_id", { mode: "bigint" }).notNull(),
    keyword: text().notNull(),
  },
  (table) => [
    index("notification_guild_id_idx").using(
      "btree",
      table.guildId.asc().nullsLast().op("int8_ops"),
    ),
    index("notification_keyword_idx").using(
      "btree",
      table.keyword.asc().nullsLast().op("text_ops"),
    ),
    index("notifications_user_id_idx").using(
      "btree",
      table.userId.asc().nullsLast().op("int8_ops"),
    ),
    primaryKey({
      columns: [table.userId, table.guildId, table.keyword],
      name: "notifications_pkey",
    }),
    pgPolicy("admin_access", {
      as: "permissive",
      for: "all",
      to: ["sushii_admin"],
      using: sql`true`,
    }),
  ],
);

export const xpBlocksInAppPublic = appPublic.table(
  "xp_blocks",
  {
    guildId: bigint("guild_id", { mode: "bigint" }).notNull(),
    blockId: bigint("block_id", { mode: "bigint" }).notNull(),
    blockType: blockTypeInAppPublic("block_type").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.guildId, table.blockId],
      name: "xp_blocks_pkey",
    }),
    pgPolicy("admin_access", {
      as: "permissive",
      for: "all",
      to: ["sushii_admin"],
      using: sql`true`,
    }),
  ],
);

export const msgLogBlocksInAppPublic = appPublic.table(
  "msg_log_blocks",
  {
    guildId: bigint("guild_id", { mode: "bigint" }).notNull(),
    channelId: bigint("channel_id", { mode: "bigint" }).notNull(),
    blockType: msgLogBlockTypeInAppPublic("block_type").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.guildId, table.channelId],
      name: "msg_log_blocks_pkey",
    }),
  ],
);

export const notificationBlocksInAppPublic = appPublic.table(
  "notification_blocks",
  {
    userId: bigint("user_id", { mode: "bigint" }).notNull(),
    blockId: bigint("block_id", { mode: "bigint" }).notNull(),
    blockType: notificationBlockTypeInAppPublic("block_type").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.userId, table.blockId],
      name: "notification_blocks_pkey",
    }),
  ],
);

export const levelRolesInAppPublic = appPublic.table(
  "level_roles",
  {
    guildId: bigint("guild_id", { mode: "bigint" }).notNull(),
    roleId: bigint("role_id", { mode: "bigint" }).notNull(),
    addLevel: bigint("add_level", { mode: "bigint" }),
    removeLevel: bigint("remove_level", { mode: "bigint" }),
  },
  (table) => [
    index("level_roles_guild_id_add_level_idx").using(
      "btree",
      table.guildId.asc().nullsLast().op("int8_ops"),
      table.addLevel.asc().nullsLast().op("int8_ops"),
    ),
    index("level_roles_guild_id_remove_level_idx").using(
      "btree",
      table.guildId.asc().nullsLast().op("int8_ops"),
      table.removeLevel.asc().nullsLast().op("int8_ops"),
    ),
    primaryKey({
      columns: [table.guildId, table.roleId],
      name: "level_roles_pkey",
    }),
    pgPolicy("admin_access", {
      as: "permissive",
      for: "all",
      to: ["sushii_admin"],
      using: sql`true`,
    }),
    check("chk_add_before_remove", sql`add_level < remove_level`),
    check(
      "chk_at_least_one_level",
      sql`num_nonnulls(add_level, remove_level) >= 1`,
    ),
  ],
);

export const emojiStickerStatsRateLimitsInAppPublic = appPublic.table(
  "emoji_sticker_stats_rate_limits",
  {
    userId: bigint("user_id", { mode: "bigint" }).notNull(),
    assetId: bigint("asset_id", { mode: "bigint" }).notNull(),
    actionType: emojiStickerActionTypeInAppPublic("action_type").notNull(),
    lastUsed: timestamp("last_used", { mode: "string" })
      .default(sql`timezone('utc'::text, now())`)
      .notNull(),
  },
  (table) => [
    index("emoji_sticker_stats_rate_limits_idx_last_used").using(
      "btree",
      table.lastUsed.asc().nullsLast().op("timestamp_ops"),
    ),
    primaryKey({
      columns: [table.userId, table.assetId, table.actionType],
      name: "emoji_sticker_stats_rate_limits_pkey",
    }),
  ],
);

export const giveawayEntriesInAppPublic = appPublic.table(
  "giveaway_entries",
  {
    giveawayId: bigint("giveaway_id", { mode: "bigint" }).notNull(),
    userId: bigint("user_id", { mode: "bigint" }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    isPicked: boolean("is_picked").default(false).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.giveawayId],
      foreignColumns: [giveawaysInAppPublic.id],
      name: "giveaway_entries_giveaway_id_fkey",
    }).onDelete("cascade"),
    primaryKey({
      columns: [table.giveawayId, table.userId],
      name: "giveaway_entries_pkey",
    }),
  ],
);

export const tempBansInAppPublic = appPublic.table(
  "temp_bans",
  {
    userId: bigint("user_id", { mode: "bigint" }).notNull(),
    guildId: bigint("guild_id", { mode: "bigint" }).notNull(),
    expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.userId, table.guildId],
      name: "temp_bans_pkey",
    }),
  ],
);

export const remindersInAppPublic = appPublic.table(
  "reminders",
  {
    userId: bigint("user_id", { mode: "bigint" }).notNull(),
    description: text().notNull(),
    setAt: timestamp("set_at", { mode: "string" }).notNull(),
    expireAt: timestamp("expire_at", { mode: "string" }).notNull(),
    id: bigint({ mode: "bigint" }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.id], name: "reminders_pkey" }),
    pgPolicy("admin_access", {
      as: "permissive",
      for: "all",
      to: ["sushii_admin"],
      using: sql`true`,
    }),
  ],
);

export const botStatsInAppPublic = appPublic.table(
  "bot_stats",
  {
    name: text().notNull(),
    category: text().notNull(),
    count: bigint({ mode: "bigint" }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("bot_stats_category_idx").using(
      "btree",
      table.category.asc().nullsLast().op("text_ops"),
    ),
    primaryKey({
      columns: [table.name, table.category],
      name: "bot_stats_pkey",
    }),
    pgPolicy("select_stats", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`true`,
    }),
  ],
);

export const roleMenusInAppPublic = appPublic.table(
  "role_menus",
  {
    guildId: bigint("guild_id", { mode: "bigint" }).notNull(),
    menuName: text("menu_name").notNull(),
    description: text(),
    maxCount: integer("max_count"),
    requiredRole: bigint("required_role", { mode: "bigint" }),
  },
  (table) => [
    index("rolemenu_guildid_idx").using(
      "btree",
      table.guildId.asc().nullsLast().op("int8_ops"),
    ),
    index("rolemenu_name_idx").using(
      "btree",
      table.menuName.asc().nullsLast().op("text_pattern_ops"),
    ),
    primaryKey({
      columns: [table.guildId, table.menuName],
      name: "role_menus_pkey",
    }),
    pgPolicy("admin_access", {
      as: "permissive",
      for: "all",
      to: ["sushii_admin"],
      using: sql`true`,
    }),
  ],
);

export const roleMenuRolesInAppPublic = appPublic.table(
  "role_menu_roles",
  {
    guildId: bigint("guild_id", { mode: "bigint" }).notNull(),
    menuName: text("menu_name").notNull(),
    roleId: bigint("role_id", { mode: "bigint" }).notNull(),
    emoji: text(),
    description: varchar({ length: 100 }),
    position: integer(),
  },
  (table) => [
    foreignKey({
      columns: [table.guildId, table.menuName],
      foreignColumns: [
        roleMenusInAppPublic.guildId,
        roleMenusInAppPublic.menuName,
      ],
      name: "role_menu_roles_guild_id_menu_name_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    primaryKey({
      columns: [table.guildId, table.menuName, table.roleId],
      name: "role_menu_roles_pkey",
    }),
    pgPolicy("admin_access", {
      as: "permissive",
      for: "all",
      to: ["sushii_admin"],
      using: sql`true`,
    }),
  ],
);

export const emojiStickerStatsInAppPublic = appPublic.table(
  "emoji_sticker_stats",
  {
    time: timestamp({ mode: "string", precision: 0 })
      // Truncate time to day precision
      .default(sql`date_trunc('day'::text, timezone('utc'::text, now()))`)
      .notNull(),
    guildId: bigint("guild_id", { mode: "bigint" }).notNull(),
    assetId: bigint("asset_id", { mode: "bigint" }).notNull(),
    actionType: emojiStickerActionTypeInAppPublic("action_type").notNull(),
    count: bigint({ mode: "bigint" }).notNull(),
    countExternal: bigint("count_external", { mode: "bigint" })
      .default(sql`0::bigint`)
      .notNull(),
  },
  (table) => [
    index("idx_action_type").using(
      "btree",
      table.actionType.asc().nullsLast().op("enum_ops"),
      table.time.asc().nullsLast().op("timestamp_ops"),
    ),
    index("idx_by_guild_emojis").using(
      "btree",
      table.assetId.asc().nullsLast().op("int8_ops"),
    ),
    primaryKey({
      columns: [table.time, table.assetId, table.actionType],
      name: "emoji_sticker_stats_pkey",
    }),
    check(
      "emoji_sticker_stats_time_check",
      sql`"time" = date_trunc('day'::text, "time")`,
    ),
  ],
);

export const tagsInAppPublic = appPublic.table(
  "tags",
  {
    ownerId: bigint("owner_id", { mode: "bigint" }).notNull(),
    guildId: bigint("guild_id", { mode: "bigint" }).notNull(),
    tagName: text("tag_name").notNull(),
    content: text().notNull(),
    useCount: bigint("use_count", { mode: "bigint" }).notNull(),
    created: timestamp({ mode: "string" }).notNull(),
    attachment: text(),
  },
  (table) => [
    index("tag_name_idx").using(
      "gin",
      table.tagName.asc().nullsLast().op("gin_trgm_ops"),
    ),
    primaryKey({ columns: [table.guildId, table.tagName], name: "tags_pkey" }),
    pgPolicy("admin_access", {
      as: "permissive",
      for: "all",
      to: ["sushii_admin"],
      using: sql`true`,
    }),
    pgPolicy("select_all", { as: "permissive", for: "select", to: ["public"] }),
  ],
);

export const userLevelsInAppPublic = appPublic.table(
  "user_levels",
  {
    userId: bigint("user_id", { mode: "bigint" }).notNull(),
    guildId: bigint("guild_id", { mode: "bigint" }).notNull(),
    msgAllTime: bigint("msg_all_time", { mode: "bigint" }).notNull(),
    msgMonth: bigint("msg_month", { mode: "bigint" }).notNull(),
    msgWeek: bigint("msg_week", { mode: "bigint" }).notNull(),
    msgDay: bigint("msg_day", { mode: "bigint" }).notNull(),
    lastMsg: timestamp("last_msg", { mode: "date" }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.userId, table.guildId],
      name: "user_levels_pkey",
    }),
    pgPolicy("admin_access", {
      as: "permissive",
      for: "all",
      to: ["sushii_admin"],
      using: sql`true`,
    }),
    pgPolicy("select_all", { as: "permissive", for: "select", to: ["public"] }),
  ],
);

export const modLogsInAppPublic = appPublic.table(
  "mod_logs",
  {
    guildId: bigint("guild_id", { mode: "bigint" }).notNull(),
    caseId: bigint("case_id", { mode: "bigint" }).notNull(),
    action: text().notNull(),
    actionTime: timestamp("action_time", { mode: "string" }).notNull(),
    pending: boolean().notNull(),
    userId: bigint("user_id", { mode: "bigint" }).notNull(),
    userTag: text("user_tag").notNull(),
    executorId: bigint("executor_id", { mode: "bigint" }),
    reason: text(),
    msgId: bigint("msg_id", { mode: "bigint" }),
    attachments: text().array().default([""]).notNull(),
    dmChannelId: bigint("dm_channel_id", { mode: "bigint" }),
    dmMessageId: bigint("dm_message_id", { mode: "bigint" }),
    dmMessageError: text("dm_message_error"),
  },
  (table) => [
    primaryKey({
      columns: [table.guildId, table.caseId],
      name: "mod_logs_pkey",
    }),
    pgPolicy("admin_access", {
      as: "permissive",
      for: "all",
      to: ["sushii_admin"],
      using: sql`true`,
    }),
  ],
);

export const mutesInAppPublic = appPublic.table(
  "mutes",
  {
    guildId: bigint("guild_id", { mode: "bigint" }).notNull(),
    userId: bigint("user_id", { mode: "bigint" }).notNull(),
    startTime: timestamp("start_time", { mode: "string" }).notNull(),
    endTime: timestamp("end_time", { mode: "string" }),
    pending: boolean().default(false).notNull(),
    caseId: bigint("case_id", { mode: "bigint" }),
  },
  (table) => [
    foreignKey({
      columns: [table.guildId, table.caseId],
      foreignColumns: [modLogsInAppPublic.guildId, modLogsInAppPublic.caseId],
      name: "fk_mod_action",
    }),
    primaryKey({ columns: [table.guildId, table.userId], name: "mutes_pkey" }),
    pgPolicy("admin_access", {
      as: "permissive",
      for: "all",
      to: ["sushii_admin"],
      using: sql`true`,
    }),
  ],
);
