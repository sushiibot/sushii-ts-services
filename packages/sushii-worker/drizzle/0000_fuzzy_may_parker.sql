-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations

CREATE SCHEMA "app_public";
--> statement-breakpoint
CREATE SCHEMA "app_hidden";
--> statement-breakpoint
CREATE SCHEMA "app_private";
--> statement-breakpoint
CREATE TYPE "app_hidden"."level_timeframe" AS ENUM('ALL_TIME', 'DAY', 'WEEK', 'MONTH');--> statement-breakpoint
CREATE TYPE "app_private"."deployment_name" AS ENUM('blue', 'green');--> statement-breakpoint
CREATE TYPE "app_public"."block_type" AS ENUM('channel', 'role');--> statement-breakpoint
CREATE TYPE "app_public"."emoji_sticker_action_type" AS ENUM('message', 'reaction');--> statement-breakpoint
CREATE TYPE "app_public"."giveaway_nitro_type" AS ENUM('none', 'nitro');--> statement-breakpoint
CREATE TYPE "app_public"."guild_asset_type" AS ENUM('emoji', 'sticker');--> statement-breakpoint
CREATE TYPE "app_public"."msg_log_block_type" AS ENUM('edits', 'deletes', 'all');--> statement-breakpoint
CREATE TYPE "app_public"."notification_block_type" AS ENUM('user', 'channel', 'category');--> statement-breakpoint
CREATE TABLE "app_public"."cached_users" (
	"id" bigint PRIMARY KEY NOT NULL,
	"avatar_url" text NOT NULL,
	"name" text NOT NULL,
	"discriminator" integer NOT NULL,
	"last_checked" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app_public"."cached_users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "app_public"."feeds" (
	"feed_id" text PRIMARY KEY NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "app_hidden"."failures" (
	"failure_id" text PRIMARY KEY NOT NULL,
	"max_attempts" integer DEFAULT 25 NOT NULL,
	"attempt_count" integer NOT NULL,
	"last_attempt" timestamp NOT NULL,
	"next_attempt" timestamp GENERATED ALWAYS AS ((last_attempt + (exp((LEAST(10, attempt_count))::double precision) * '00:00:01'::interval))) STORED NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app_private"."sessions" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_active" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app_private"."sessions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "app_private"."user_authentication_secrets" (
	"user_id" bigint PRIMARY KEY NOT NULL,
	"details" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app_private"."user_authentication_secrets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "app_public"."users" (
	"id" bigint PRIMARY KEY NOT NULL,
	"is_patron" boolean NOT NULL,
	"patron_emoji" text,
	"rep" bigint NOT NULL,
	"fishies" bigint NOT NULL,
	"last_rep" timestamp,
	"last_fishies" timestamp,
	"lastfm_username" text,
	"profile_data" jsonb
);
--> statement-breakpoint
ALTER TABLE "app_public"."users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "app_public"."web_users" (
	"id" bigint PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"discriminator" integer NOT NULL,
	"avatar" text,
	"is_admin" boolean DEFAULT false NOT NULL,
	"details" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app_public"."web_users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "app_public"."cached_guilds" (
	"id" bigint PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"icon" text,
	"splash" text,
	"banner" text,
	"features" text[] DEFAULT '{""}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app_public"."cached_guilds" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "app_public"."messages" (
	"message_id" bigint PRIMARY KEY NOT NULL,
	"author_id" bigint NOT NULL,
	"channel_id" bigint NOT NULL,
	"guild_id" bigint NOT NULL,
	"created" timestamp NOT NULL,
	"content" text NOT NULL,
	"msg" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app_public"."guild_configs" (
	"id" bigint PRIMARY KEY NOT NULL,
	"prefix" text,
	"join_msg" text,
	"join_msg_enabled" boolean DEFAULT true NOT NULL,
	"join_react" text,
	"leave_msg" text,
	"leave_msg_enabled" boolean DEFAULT true NOT NULL,
	"msg_channel" bigint,
	"role_channel" bigint,
	"role_config" jsonb,
	"role_enabled" boolean DEFAULT true NOT NULL,
	"log_msg" bigint,
	"log_msg_enabled" boolean DEFAULT true NOT NULL,
	"log_mod" bigint,
	"log_mod_enabled" boolean DEFAULT true NOT NULL,
	"log_member" bigint,
	"log_member_enabled" boolean DEFAULT true NOT NULL,
	"mute_dm_text" text,
	"mute_dm_enabled" boolean DEFAULT true NOT NULL,
	"warn_dm_text" text,
	"warn_dm_enabled" boolean DEFAULT true NOT NULL,
	"disabled_channels" bigint[],
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"lookup_details_opt_in" boolean DEFAULT false NOT NULL,
	"lookup_prompted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app_public"."guild_configs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "app_public"."guild_emojis_and_stickers" (
	"id" bigint PRIMARY KEY NOT NULL,
	"guild_id" bigint NOT NULL,
	"name" text NOT NULL,
	"type" "app_public"."guild_asset_type" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app_private"."active_deployment" (
	"id" integer GENERATED ALWAYS AS (1) STORED NOT NULL,
	"name" "app_private"."deployment_name" NOT NULL,
	CONSTRAINT "active_deployment_id_key" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "app_public"."giveaways" (
	"id" bigint PRIMARY KEY NOT NULL,
	"channel_id" bigint NOT NULL,
	"guild_id" bigint NOT NULL,
	"host_user_id" bigint NOT NULL,
	"prize" text NOT NULL,
	"num_winners" integer NOT NULL,
	"required_role_id" bigint,
	"required_min_level" integer,
	"required_max_level" integer,
	"required_nitro_state" "app_public"."giveaway_nitro_type",
	"required_boosting" boolean,
	"is_ended" boolean DEFAULT false NOT NULL,
	"start_at" timestamp NOT NULL,
	"end_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app_public"."feed_items" (
	"feed_id" text NOT NULL,
	"item_id" text NOT NULL,
	CONSTRAINT "feed_items_pkey" PRIMARY KEY("feed_id","item_id")
);
--> statement-breakpoint
CREATE TABLE "app_public"."guild_bans" (
	"guild_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	CONSTRAINT "guild_bans_pkey" PRIMARY KEY("guild_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "app_public"."members" (
	"guild_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"join_time" timestamp NOT NULL,
	CONSTRAINT "members_pkey" PRIMARY KEY("guild_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "app_public"."notifications" (
	"user_id" bigint NOT NULL,
	"guild_id" bigint NOT NULL,
	"keyword" text NOT NULL,
	CONSTRAINT "notifications_pkey" PRIMARY KEY("user_id","guild_id","keyword")
);
--> statement-breakpoint
ALTER TABLE "app_public"."notifications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "app_public"."xp_blocks" (
	"guild_id" bigint NOT NULL,
	"block_id" bigint NOT NULL,
	"block_type" "app_public"."block_type" NOT NULL,
	CONSTRAINT "xp_blocks_pkey" PRIMARY KEY("guild_id","block_id")
);
--> statement-breakpoint
ALTER TABLE "app_public"."xp_blocks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "app_public"."msg_log_blocks" (
	"guild_id" bigint NOT NULL,
	"channel_id" bigint NOT NULL,
	"block_type" "app_public"."msg_log_block_type" NOT NULL,
	CONSTRAINT "msg_log_blocks_pkey" PRIMARY KEY("guild_id","channel_id")
);
--> statement-breakpoint
CREATE TABLE "app_public"."notification_blocks" (
	"user_id" bigint NOT NULL,
	"block_id" bigint NOT NULL,
	"block_type" "app_public"."notification_block_type" NOT NULL,
	CONSTRAINT "notification_blocks_pkey" PRIMARY KEY("user_id","block_id")
);
--> statement-breakpoint
CREATE TABLE "app_public"."feed_subscriptions" (
	"feed_id" text NOT NULL,
	"guild_id" bigint NOT NULL,
	"channel_id" bigint NOT NULL,
	"mention_role" bigint,
	CONSTRAINT "feed_subscriptions_pkey" PRIMARY KEY("feed_id","channel_id")
);
--> statement-breakpoint
CREATE TABLE "app_public"."level_roles" (
	"guild_id" bigint NOT NULL,
	"role_id" bigint NOT NULL,
	"add_level" bigint,
	"remove_level" bigint,
	CONSTRAINT "level_roles_pkey" PRIMARY KEY("guild_id","role_id"),
	CONSTRAINT "chk_add_before_remove" CHECK (add_level < remove_level),
	CONSTRAINT "chk_at_least_one_level" CHECK (num_nonnulls(add_level, remove_level) >= 1)
);
--> statement-breakpoint
ALTER TABLE "app_public"."level_roles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "app_public"."emoji_sticker_stats_rate_limits" (
	"user_id" bigint NOT NULL,
	"asset_id" bigint NOT NULL,
	"action_type" "app_public"."emoji_sticker_action_type" NOT NULL,
	"last_used" timestamp DEFAULT timezone('utc'::text, now()) NOT NULL,
	CONSTRAINT "emoji_sticker_stats_rate_limits_pkey" PRIMARY KEY("user_id","asset_id","action_type")
);
--> statement-breakpoint
CREATE TABLE "app_public"."giveaway_entries" (
	"giveaway_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"is_picked" boolean DEFAULT false NOT NULL,
	CONSTRAINT "giveaway_entries_pkey" PRIMARY KEY("giveaway_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "app_public"."temp_bans" (
	"user_id" bigint NOT NULL,
	"guild_id" bigint NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "temp_bans_pkey" PRIMARY KEY("user_id","guild_id")
);
--> statement-breakpoint
CREATE TABLE "app_public"."reminders" (
	"user_id" bigint NOT NULL,
	"description" text NOT NULL,
	"set_at" timestamp NOT NULL,
	"expire_at" timestamp NOT NULL,
	"id" bigint NOT NULL,
	CONSTRAINT "reminders_pkey" PRIMARY KEY("user_id","id")
);
--> statement-breakpoint
ALTER TABLE "app_public"."reminders" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "app_public"."web_user_guilds" (
	"user_id" bigint NOT NULL,
	"guild_id" bigint NOT NULL,
	"owner" boolean NOT NULL,
	"permissions" bigint NOT NULL,
	"manage_guild" boolean GENERATED ALWAYS AS (((permissions & ('00000000000000000000000000100000'::"bit")::bigint) = ('00000000000000000000000000100000'::"bit")::bigint)) STORED,
	CONSTRAINT "web_user_guilds_pkey" PRIMARY KEY("user_id","guild_id")
);
--> statement-breakpoint
ALTER TABLE "app_public"."web_user_guilds" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "app_public"."bot_stats" (
	"name" text NOT NULL,
	"category" text NOT NULL,
	"count" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bot_stats_pkey" PRIMARY KEY("name","category")
);
--> statement-breakpoint
ALTER TABLE "app_public"."bot_stats" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "app_public"."role_menus" (
	"guild_id" bigint NOT NULL,
	"menu_name" text NOT NULL,
	"description" text,
	"max_count" integer,
	"required_role" bigint,
	CONSTRAINT "role_menus_pkey" PRIMARY KEY("guild_id","menu_name")
);
--> statement-breakpoint
ALTER TABLE "app_public"."role_menus" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "app_public"."mutes" (
	"guild_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp,
	"pending" boolean DEFAULT false NOT NULL,
	"case_id" bigint,
	CONSTRAINT "mutes_pkey" PRIMARY KEY("guild_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "app_public"."mutes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "app_public"."role_menu_roles" (
	"guild_id" bigint NOT NULL,
	"menu_name" text NOT NULL,
	"role_id" bigint NOT NULL,
	"emoji" text,
	"description" varchar(100),
	"position" integer,
	CONSTRAINT "role_menu_roles_pkey" PRIMARY KEY("guild_id","menu_name","role_id")
);
--> statement-breakpoint
ALTER TABLE "app_public"."role_menu_roles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "app_public"."emoji_sticker_stats" (
	"time" timestamp(0) DEFAULT date_trunc('day'::text, timezone('utc'::text, now())) NOT NULL,
	"guild_id" bigint NOT NULL,
	"asset_id" bigint NOT NULL,
	"action_type" "app_public"."emoji_sticker_action_type" NOT NULL,
	"count" bigint NOT NULL,
	"count_external" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "emoji_sticker_stats_pkey" PRIMARY KEY("time","asset_id","action_type"),
	CONSTRAINT "emoji_sticker_stats_time_check" CHECK ("time" = date_trunc('day'::text, "time"))
);
--> statement-breakpoint
CREATE TABLE "app_public"."tags" (
	"owner_id" bigint NOT NULL,
	"guild_id" bigint NOT NULL,
	"tag_name" text NOT NULL,
	"content" text NOT NULL,
	"use_count" bigint NOT NULL,
	"created" timestamp NOT NULL,
	"attachment" text,
	CONSTRAINT "tags_pkey" PRIMARY KEY("guild_id","tag_name")
);
--> statement-breakpoint
ALTER TABLE "app_public"."tags" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "app_public"."user_levels" (
	"user_id" bigint NOT NULL,
	"guild_id" bigint NOT NULL,
	"msg_all_time" bigint NOT NULL,
	"msg_month" bigint NOT NULL,
	"msg_week" bigint NOT NULL,
	"msg_day" bigint NOT NULL,
	"last_msg" timestamp NOT NULL,
	"level" bigint GENERATED ALWAYS AS (app_hidden.level_from_xp(msg_all_time)) STORED NOT NULL,
	CONSTRAINT "user_levels_pkey" PRIMARY KEY("user_id","guild_id")
);
--> statement-breakpoint
ALTER TABLE "app_public"."user_levels" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "app_public"."mod_logs" (
	"guild_id" bigint NOT NULL,
	"case_id" bigint NOT NULL,
	"action" text NOT NULL,
	"action_time" timestamp NOT NULL,
	"pending" boolean NOT NULL,
	"user_id" bigint NOT NULL,
	"user_tag" text NOT NULL,
	"executor_id" bigint,
	"reason" text,
	"msg_id" bigint,
	"attachments" text[] DEFAULT '{""}' NOT NULL,
	"dm_channel_id" bigint,
	"dm_message_id" bigint,
	"dm_message_error" text,
	CONSTRAINT "mod_logs_pkey" PRIMARY KEY("guild_id","case_id")
);
--> statement-breakpoint
ALTER TABLE "app_public"."mod_logs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "app_private"."sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_public"."web_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_private"."user_authentication_secrets" ADD CONSTRAINT "user_authentication_secrets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_public"."web_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_public"."feed_subscriptions" ADD CONSTRAINT "fk_feed_subscription_feed_id" FOREIGN KEY ("feed_id") REFERENCES "app_public"."feeds"("feed_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_public"."giveaway_entries" ADD CONSTRAINT "giveaway_entries_giveaway_id_fkey" FOREIGN KEY ("giveaway_id") REFERENCES "app_public"."giveaways"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_public"."mutes" ADD CONSTRAINT "fk_mod_action" FOREIGN KEY ("guild_id","case_id") REFERENCES "app_public"."mod_logs"("guild_id","case_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_public"."role_menu_roles" ADD CONSTRAINT "role_menu_roles_guild_id_menu_name_fkey" FOREIGN KEY ("guild_id","menu_name") REFERENCES "app_public"."role_menus"("guild_id","menu_name") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "app_private"."sessions" USING btree ("user_id" int8_ops);--> statement-breakpoint
CREATE INDEX "messages_created_idx" ON "app_public"."messages" USING btree ("created" timestamp_ops);--> statement-breakpoint
CREATE INDEX "guild_bans_user_id_idx" ON "app_public"."guild_bans" USING btree ("user_id" int8_ops);--> statement-breakpoint
CREATE INDEX "notification_guild_id_idx" ON "app_public"."notifications" USING btree ("guild_id" int8_ops);--> statement-breakpoint
CREATE INDEX "notification_keyword_idx" ON "app_public"."notifications" USING btree ("keyword" text_ops);--> statement-breakpoint
CREATE INDEX "notifications_user_id_idx" ON "app_public"."notifications" USING btree ("user_id" int8_ops);--> statement-breakpoint
CREATE INDEX "level_roles_guild_id_add_level_idx" ON "app_public"."level_roles" USING btree ("guild_id" int8_ops,"add_level" int8_ops);--> statement-breakpoint
CREATE INDEX "level_roles_guild_id_remove_level_idx" ON "app_public"."level_roles" USING btree ("guild_id" int8_ops,"remove_level" int8_ops);--> statement-breakpoint
CREATE INDEX "emoji_sticker_stats_rate_limits_idx_last_used" ON "app_public"."emoji_sticker_stats_rate_limits" USING btree ("last_used" timestamp_ops);--> statement-breakpoint
CREATE INDEX "web_user_guilds_guild_id_idx" ON "app_public"."web_user_guilds" USING btree ("guild_id" int8_ops);--> statement-breakpoint
CREATE INDEX "web_user_guilds_user_id_idx" ON "app_public"."web_user_guilds" USING btree ("user_id" int8_ops);--> statement-breakpoint
CREATE INDEX "bot_stats_category_idx" ON "app_public"."bot_stats" USING btree ("category" text_ops);--> statement-breakpoint
CREATE INDEX "rolemenu_guildid_idx" ON "app_public"."role_menus" USING btree ("guild_id" int8_ops);--> statement-breakpoint
CREATE INDEX "rolemenu_name_idx" ON "app_public"."role_menus" USING btree ("menu_name" text_pattern_ops);--> statement-breakpoint
CREATE INDEX "idx_action_type" ON "app_public"."emoji_sticker_stats" USING btree ("action_type" enum_ops,"time" timestamp_ops);--> statement-breakpoint
CREATE INDEX "idx_by_guild_emojis" ON "app_public"."emoji_sticker_stats" USING btree ("asset_id" int8_ops);--> statement-breakpoint
CREATE INDEX "tag_name_idx" ON "app_public"."tags" USING gin ("tag_name" gin_trgm_ops);--> statement-breakpoint
CREATE POLICY "select_all" ON "app_public"."cached_users" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "admin_access" ON "app_public"."users" AS PERMISSIVE FOR ALL TO "sushii_admin" USING (true);--> statement-breakpoint
CREATE POLICY "update_self" ON "app_public"."web_users" AS PERMISSIVE FOR UPDATE TO public USING ((id = app_public.current_user_id()));--> statement-breakpoint
CREATE POLICY "select_self" ON "app_public"."web_users" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "select_all" ON "app_public"."cached_guilds" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "admin_access" ON "app_public"."guild_configs" AS PERMISSIVE FOR ALL TO "sushii_admin" USING (true);--> statement-breakpoint
CREATE POLICY "update_managed_guild" ON "app_public"."guild_configs" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "select_managed_guild" ON "app_public"."guild_configs" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "admin_access" ON "app_public"."notifications" AS PERMISSIVE FOR ALL TO "sushii_admin" USING (true);--> statement-breakpoint
CREATE POLICY "admin_access" ON "app_public"."xp_blocks" AS PERMISSIVE FOR ALL TO "sushii_admin" USING (true);--> statement-breakpoint
CREATE POLICY "admin_access" ON "app_public"."level_roles" AS PERMISSIVE FOR ALL TO "sushii_admin" USING (true);--> statement-breakpoint
CREATE POLICY "admin_access" ON "app_public"."reminders" AS PERMISSIVE FOR ALL TO "sushii_admin" USING (true);--> statement-breakpoint
CREATE POLICY "select_web_user_guilds" ON "app_public"."web_user_guilds" AS PERMISSIVE FOR SELECT TO public USING ((manage_guild OR owner));--> statement-breakpoint
CREATE POLICY "select_stats" ON "app_public"."bot_stats" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "admin_access" ON "app_public"."role_menus" AS PERMISSIVE FOR ALL TO "sushii_admin" USING (true);--> statement-breakpoint
CREATE POLICY "admin_access" ON "app_public"."mutes" AS PERMISSIVE FOR ALL TO "sushii_admin" USING (true);--> statement-breakpoint
CREATE POLICY "admin_access" ON "app_public"."role_menu_roles" AS PERMISSIVE FOR ALL TO "sushii_admin" USING (true);--> statement-breakpoint
CREATE POLICY "admin_access" ON "app_public"."tags" AS PERMISSIVE FOR ALL TO "sushii_admin" USING (true);--> statement-breakpoint
CREATE POLICY "select_all" ON "app_public"."tags" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "admin_access" ON "app_public"."user_levels" AS PERMISSIVE FOR ALL TO "sushii_admin" USING (true);--> statement-breakpoint
CREATE POLICY "select_all" ON "app_public"."user_levels" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "admin_access" ON "app_public"."mod_logs" AS PERMISSIVE FOR ALL TO "sushii_admin" USING (true);
