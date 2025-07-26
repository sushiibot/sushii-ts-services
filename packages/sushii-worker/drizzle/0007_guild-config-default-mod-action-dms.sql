ALTER TABLE "app_public"."guild_configs" RENAME COLUMN "mute_dm_text" TO "timeout_dm_text";
ALTER TABLE "app_public"."guild_configs" RENAME COLUMN "mute_dm_enabled" TO "timeout_dm_enabled";
ALTER TABLE "app_public"."guild_configs" ADD COLUMN "timeout_native_dm_enabled" boolean DEFAULT true NOT NULL;
ALTER TABLE "app_public"."guild_configs" ADD COLUMN "ban_dm_text" text;
ALTER TABLE "app_public"."guild_configs" ADD COLUMN "ban_dm_enabled" boolean DEFAULT true NOT NULL;
ALTER TABLE "app_public"."guild_configs" DROP COLUMN "warn_dm_enabled";