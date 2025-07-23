ALTER TABLE "app_public"."users" ALTER COLUMN "is_patron" SET DEFAULT false;
ALTER TABLE "app_public"."users" ALTER COLUMN "rep" SET DEFAULT '0'::bigint;
ALTER TABLE "app_public"."users" ALTER COLUMN "fishies" SET DEFAULT '0'::bigint;
ALTER TABLE "app_public"."guild_configs" DROP COLUMN "role_channel";
ALTER TABLE "app_public"."guild_configs" DROP COLUMN "role_config";
ALTER TABLE "app_public"."guild_configs" DROP COLUMN "role_enabled";
ALTER TABLE "app_public"."guild_configs" DROP COLUMN "data";