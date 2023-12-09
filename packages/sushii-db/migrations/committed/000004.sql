--! Previous: sha1:9e15508976d950afce4f4635992e7d927d8b9065
--! Hash: sha1:6fe0e4aff8c5e2d5dfaabf1fb96fc8a9503dd27f

-- remove parts of cached_guilds that aren't in partial guild response
/* {
 *   "id": "381880193251409931",
 *   "name": "---",
 *   "icon": "a_6fa2306b017079a3a95be63d3ed9bf1a",
 *   "owner": false,
 *   "permissions": 104713920,
 *   "features": [
 *     "ANIMATED_ICON",
 *     "INVITE_SPLASH"
 *   ],
 *   "permissions_new": "6547164864"
 * },
 */

alter table app_public.cached_guilds
  drop column if exists icon,
  drop column if exists splash,
  drop column if exists banner,
  -- drop features since can't really do an idempotent alter
  drop column if exists features;

alter table app_public.cached_guilds
  -- member_count not given in partial guild data
  drop column if exists member_count cascade,
  -- remove the *_url and just use hashes to construct urls later
  drop column if exists icon_url     cascade,
  drop column if exists splash_url   cascade,
  drop column if exists banner_url   cascade,
  add column icon     text default null,
  add column splash   text default null,
  add column banner   text default null,
  add column features text[] not null default '{}';
