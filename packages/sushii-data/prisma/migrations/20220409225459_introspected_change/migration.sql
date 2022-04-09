-- CreateEnum
CREATE TYPE "rule_scope" AS ENUM ('GUILD', 'CHANNEL', 'USER');

-- CreateTable
CREATE TABLE "bans" (
    "guild_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "reason" TEXT,

    CONSTRAINT "bans_pkey" PRIMARY KEY ("guild_id","user_id")
);

-- CreateTable
CREATE TABLE "bot_stats" (
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "count" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bot_stats_pkey" PRIMARY KEY ("name","category")
);

-- CreateTable
CREATE TABLE "cached_guilds" (
    "id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "splash" TEXT,
    "banner" TEXT,
    "features" TEXT[],
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cached_guilds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cached_users" (
    "id" BIGINT NOT NULL,
    "avatar_url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "discriminator" INTEGER NOT NULL,
    "last_checked" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "cached_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feed_items" (
    "feed_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,

    CONSTRAINT "feed_items_pkey" PRIMARY KEY ("feed_id","item_id")
);

-- CreateTable
CREATE TABLE "feed_subscriptions" (
    "feed_id" TEXT NOT NULL,
    "guild_id" BIGINT NOT NULL,
    "channel_id" BIGINT NOT NULL,
    "mention_role" BIGINT,

    CONSTRAINT "feed_subscriptions_pkey" PRIMARY KEY ("feed_id","channel_id")
);

-- CreateTable
CREATE TABLE "feeds" (
    "feed_id" TEXT NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "feeds_pkey" PRIMARY KEY ("feed_id")
);

-- CreateTable
CREATE TABLE "guild_bans" (
    "guild_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,

    CONSTRAINT "guild_bans_pkey" PRIMARY KEY ("guild_id","user_id")
);

-- CreateTable
CREATE TABLE "guild_configs" (
    "id" BIGINT NOT NULL,
    "prefix" TEXT,
    "join_msg" TEXT,
    "join_msg_enabled" BOOLEAN NOT NULL DEFAULT true,
    "join_react" TEXT,
    "leave_msg" TEXT,
    "leave_msg_enabled" BOOLEAN NOT NULL DEFAULT true,
    "msg_channel" BIGINT,
    "role_channel" BIGINT,
    "role_config" JSONB,
    "role_enabled" BOOLEAN NOT NULL DEFAULT true,
    "invite_guard" BOOLEAN NOT NULL DEFAULT false,
    "log_msg" BIGINT,
    "log_msg_enabled" BOOLEAN NOT NULL DEFAULT true,
    "log_mod" BIGINT,
    "log_mod_enabled" BOOLEAN NOT NULL DEFAULT true,
    "log_member" BIGINT,
    "log_member_enabled" BOOLEAN NOT NULL DEFAULT true,
    "mute_role" BIGINT,
    "mute_duration" BIGINT,
    "mute_dm_text" TEXT,
    "mute_dm_enabled" BOOLEAN NOT NULL DEFAULT true,
    "warn_dm_text" TEXT,
    "warn_dm_enabled" BOOLEAN NOT NULL DEFAULT true,
    "max_mention" INTEGER,
    "disabled_channels" BIGINT[],
    "data" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "guild_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guild_feeds" (
    "guild_id" BIGINT NOT NULL,
    "channel_id" BIGINT NOT NULL,
    "mention_role" BIGINT,
    "feed_name" TEXT NOT NULL,
    "feed_source" TEXT NOT NULL,
    "feed_hash" TEXT NOT NULL,
    "feed_metadata" JSONB NOT NULL,

    CONSTRAINT "guild_feeds_pkey" PRIMARY KEY ("feed_hash","channel_id")
);

-- CreateTable
CREATE TABLE "messages" (
    "message_id" BIGINT NOT NULL,
    "author_id" BIGINT NOT NULL,
    "channel_id" BIGINT NOT NULL,
    "guild_id" BIGINT NOT NULL,
    "created" TIMESTAMP(6) NOT NULL,
    "content" TEXT NOT NULL,
    "msg" JSONB NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("message_id")
);

-- CreateTable
CREATE TABLE "mod_logs" (
    "guild_id" BIGINT NOT NULL,
    "case_id" BIGINT NOT NULL,
    "action" TEXT NOT NULL,
    "action_time" TIMESTAMP(6) NOT NULL,
    "pending" BOOLEAN NOT NULL,
    "user_id" BIGINT NOT NULL,
    "user_tag" TEXT NOT NULL,
    "executor_id" BIGINT,
    "reason" TEXT,
    "msg_id" BIGINT,
    "attachments" TEXT[],

    CONSTRAINT "mod_logs_pkey" PRIMARY KEY ("guild_id","case_id")
);

-- CreateTable
CREATE TABLE "mutes" (
    "guild_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "start_time" TIMESTAMP(6) NOT NULL,
    "end_time" TIMESTAMP(6),
    "pending" BOOLEAN NOT NULL DEFAULT false,
    "case_id" BIGINT,

    CONSTRAINT "mutes_pkey" PRIMARY KEY ("guild_id","user_id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "user_id" BIGINT NOT NULL,
    "guild_id" BIGINT NOT NULL,
    "keyword" TEXT NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("user_id","guild_id","keyword")
);

-- CreateTable
CREATE TABLE "reminders" (
    "user_id" BIGINT NOT NULL,
    "description" TEXT NOT NULL,
    "set_at" TIMESTAMP(6) NOT NULL,
    "expire_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "reminders_pkey" PRIMARY KEY ("user_id","set_at")
);

-- CreateTable
CREATE TABLE "tags" (
    "owner_id" BIGINT NOT NULL,
    "guild_id" BIGINT NOT NULL,
    "tag_name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "use_count" BIGINT NOT NULL,
    "created" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("guild_id","tag_name")
);

-- CreateTable
CREATE TABLE "user_levels" (
    "user_id" BIGINT NOT NULL,
    "guild_id" BIGINT NOT NULL,
    "msg_all_time" BIGINT NOT NULL,
    "msg_month" BIGINT NOT NULL,
    "msg_week" BIGINT NOT NULL,
    "msg_day" BIGINT NOT NULL,
    "last_msg" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "user_levels_pkey" PRIMARY KEY ("user_id","guild_id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" BIGINT NOT NULL,
    "is_patron" BOOLEAN NOT NULL,
    "patron_emoji" TEXT,
    "rep" BIGINT NOT NULL,
    "fishies" BIGINT NOT NULL,
    "last_rep" TIMESTAMP(6),
    "last_fishies" TIMESTAMP(6),
    "lastfm_username" TEXT,
    "profile_data" JSONB,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guild_rule_set_configs" (
    "set_id" BIGINT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "config" JSON NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guild_rule_set_configs_pkey" PRIMARY KEY ("set_id")
);

-- CreateTable
CREATE TABLE "guild_rule_sets" (
    "id" BIGSERIAL NOT NULL,
    "guild_id" BIGINT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "editable" BOOLEAN NOT NULL DEFAULT true,
    "author" BIGINT,
    "category" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guild_rule_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guild_rules" (
    "id" BIGSERIAL NOT NULL,
    "set_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "trigger" JSONB NOT NULL,
    "conditions" JSONB NOT NULL,
    "actions" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guild_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "guild_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "join_time" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("guild_id","user_id")
);

-- CreateTable
CREATE TABLE "rule_counters" (
    "time" TIMESTAMPTZ(6) NOT NULL,
    "guild_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "rule_counters_pkey" PRIMARY KEY ("time","guild_id","name")
);

-- CreateTable
CREATE TABLE "rule_gauges" (
    "time" TIMESTAMPTZ(6) NOT NULL,
    "guild_id" BIGINT NOT NULL,
    "scope" "rule_scope" NOT NULL,
    "scope_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "value" BIGINT NOT NULL,

    CONSTRAINT "rule_gauges_pkey" PRIMARY KEY ("time","guild_id","scope","scope_id","name")
);

-- CreateTable
CREATE TABLE "rule_persistence" (
    "guild_id" BIGINT NOT NULL,
    "scope" "rule_scope" NOT NULL,
    "scope_id" BIGINT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "rule_persistence_pkey" PRIMARY KEY ("guild_id","scope","scope_id")
);

-- CreateTable
CREATE TABLE "web_guilds" (
    "id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "web_guilds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "web_user_guilds" (
    "user_id" BIGINT NOT NULL,
    "guild_id" BIGINT NOT NULL,
    "owner" BOOLEAN NOT NULL,
    "permissions" BIGINT NOT NULL,
    "manage_guild" BOOLEAN,

    CONSTRAINT "web_user_guilds_pkey" PRIMARY KEY ("user_id","guild_id")
);

-- CreateTable
CREATE TABLE "web_users" (
    "id" BIGINT NOT NULL,
    "username" TEXT NOT NULL,
    "discriminator" INTEGER NOT NULL,
    "avatar" TEXT,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "details" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "web_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "bans_guild_id_idx" ON "bans"("guild_id");

-- CreateIndex
CREATE INDEX "bans_user_id_idx" ON "bans"("user_id");

-- CreateIndex
CREATE INDEX "bot_stats_category_idx" ON "bot_stats"("category");

-- CreateIndex
CREATE INDEX "cached_guilds_features_idx" ON "cached_guilds"("features");

-- CreateIndex
CREATE INDEX "guild_bans_user_id_idx" ON "guild_bans"("user_id");

-- CreateIndex
CREATE INDEX "guild_feeds_guild_id_idx" ON "guild_feeds"("guild_id");

-- CreateIndex
CREATE INDEX "message_id_idx" ON "messages"("message_id");

-- CreateIndex
CREATE INDEX "notification_guild_id_idx" ON "notifications"("guild_id");

-- CreateIndex
CREATE INDEX "notification_keyword_idx" ON "notifications"("keyword");

-- CreateIndex
CREATE INDEX "tag_name_idx" ON "tags"("tag_name");

-- CreateIndex
CREATE INDEX "guild_rule_set_configs_set_id_idx" ON "guild_rule_set_configs"("set_id");

-- CreateIndex
CREATE INDEX "guild_rule_sets_guild_id_idx" ON "guild_rule_sets"("guild_id");

-- CreateIndex
CREATE INDEX "guild_rules_set_id_idx" ON "guild_rules"("set_id");

-- CreateIndex
CREATE INDEX "rule_counters_guild_id_name_time_idx" ON "rule_counters"("guild_id", "name", "time");

-- CreateIndex
CREATE INDEX "rule_counters_time_idx" ON "rule_counters"("time");

-- CreateIndex
CREATE INDEX "rule_gauges_guild_id_scope_scope_id_name_time_idx" ON "rule_gauges"("guild_id", "scope", "scope_id", "name", "time");

-- CreateIndex
CREATE INDEX "rule_gauges_time_idx" ON "rule_gauges"("time");

-- CreateIndex
CREATE INDEX "web_user_guilds_guild_id_idx" ON "web_user_guilds"("guild_id");

-- CreateIndex
CREATE INDEX "web_user_guilds_user_id_idx" ON "web_user_guilds"("user_id");

-- AddForeignKey
ALTER TABLE "feed_subscriptions" ADD CONSTRAINT "fk_feed_subscription_feed_id" FOREIGN KEY ("feed_id") REFERENCES "feeds"("feed_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mutes" ADD CONSTRAINT "fk_mod_action" FOREIGN KEY ("guild_id", "case_id") REFERENCES "mod_logs"("guild_id", "case_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "guild_rule_set_configs" ADD CONSTRAINT "guild_rule_set_configs_set_id_fkey" FOREIGN KEY ("set_id") REFERENCES "guild_rule_sets"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "guild_rules" ADD CONSTRAINT "guild_rules_set_id_fkey" FOREIGN KEY ("set_id") REFERENCES "guild_rule_sets"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
