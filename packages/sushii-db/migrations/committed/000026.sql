--! Previous: sha1:432158f950d6e11104d12c6690696f026c0e7523
--! Hash: sha1:645e5d53750a12eea578971c5210ce6945702eee

-- Rate limit users from contributing to emoji stats

drop table if exists app_public.emoji_sticker_stats_rate_limits cascade;

-- Limit user emoji stat metric contributions to 1 emoji/sticker per time period
-- Global limit for all guilds, as the same emoji used in different guilds is
-- still counted for the source guild.
create table app_public.emoji_sticker_stats_rate_limits (
  user_id     bigint not null,
  asset_id    bigint not null,
  action_type app_public.emoji_sticker_action_type not null,

  last_used timestamp not null default timezone('utc', now()),

  primary key (user_id, action_type, asset_id)
);

-- Create an index on last_used for faster purging of old entries
create index emoji_sticker_stats_rate_limits_idx_last_used on app_public.emoji_sticker_stats_rate_limits(last_used);
