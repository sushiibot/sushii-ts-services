--! Previous: sha1:e5fd7889920a0d1997492ef2649b28c327759d79
--! Hash: sha1:432158f950d6e11104d12c6690696f026c0e7523

-- Emoji stats
-- time series of emoji usage grouped by day. Emoji logs does NOT use this
-- table, it is only used for long term stats.

drop type if exists app_public.guild_asset_type cascade;
create type app_public.guild_asset_type as enum (
  'emoji',
  'sticker'
);

drop type if exists app_public.emoji_sticker_action_type cascade;
create type app_public.emoji_sticker_action_type as enum (
  'message',
  'reaction'
);

drop table if exists app_public.emoji_sticker_stats cascade;
create table app_public.emoji_sticker_stats(
  -- time is the start of day
  time        timestamp(0) not null check (time = date_trunc('day', time)) default date_trunc('day', timezone('utc', now())),
  -- guild_id this emoji is **used** in, not where it is from
  guild_id    bigint not null,
  asset_id    bigint not null,
  -- If this was used in a message or as a reaction, part of the primary key
  -- as we want to keep track of the different usage separately.
  action_type app_public.emoji_sticker_action_type not null,

  -- Metadata
  -- If this is an emoji or sticker for easy filtering, not part of the primary key
  asset_type  app_public.guild_asset_type not null,
  -- How many times this was used in this day
  count       bigint not null,

  -- guild_id is part of the primary key, as we want to keep track of usage
  -- of the same emoji in different guilds separately
  primary key (time, guild_id, asset_id, action_type)
);

drop type if exists app_public.emoji_sticker_stat_increment_data cascade;
create type app_public.emoji_sticker_stat_increment_data as (
  asset_id    bigint,
  asset_type  app_public.guild_asset_type
);

create index idx_action_type on app_public.emoji_sticker_stats(action_type, time);

-- Selecting all with asset_ids of a guilds emojis/stickers
-- e.g. asset_id in listOfGuildEmojiIds
create index idx_by_guild_emojis on app_public.emoji_sticker_stats(asset_id);
