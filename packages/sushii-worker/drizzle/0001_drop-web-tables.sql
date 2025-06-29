ALTER TABLE "app_public"."users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "app_private"."sessions" CASCADE;--> statement-breakpoint
DROP TABLE "app_private"."user_authentication_secrets" CASCADE;--> statement-breakpoint
DROP POLICY "admin_access" ON "app_public"."users" CASCADE;--> statement-breakpoint
DROP TABLE "app_public"."users" CASCADE;--> statement-breakpoint
DROP POLICY "update_self" ON "app_public"."web_users" CASCADE;--> statement-breakpoint
DROP POLICY "select_self" ON "app_public"."web_users" CASCADE;--> statement-breakpoint
DROP TABLE "app_public"."web_users" CASCADE;--> statement-breakpoint
DROP POLICY "select_web_user_guilds" ON "app_public"."web_user_guilds" CASCADE;--> statement-breakpoint
DROP TABLE "app_public"."web_user_guilds" CASCADE;