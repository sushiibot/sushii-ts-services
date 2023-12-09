--! Previous: sha1:095a6944aa6c704a47ef5d6b2c7c869046ba0d81
--! Hash: sha1:59a11cb6e4a2c11f01131552a126a2f2446a48f1

-- Add external count for emoji use
alter table app_public.emoji_sticker_stats
  add column if not exists count_external bigint not null default 0;

-- Update count_external to the total count
with t as (
    -- Used in a guild that isn't the same as the guild_id of the emoji
    select
        time,
        asset_id,
        emojis_t.guild_id, -- source guild_id
        action_type,
        coalesce(sum(count), 0) as external_total
      from app_public.emoji_sticker_stats as stats_t
      left join app_public.guild_emojis_and_stickers as emojis_t
        on stats_t.asset_id = emojis_t.id
      where
          stats_t.guild_id != emojis_t.guild_id
      group by time, asset_id, emojis_t.guild_id, action_type
  )
update app_public.emoji_sticker_stats
  set count_external = t.external_total
from t
  where
    app_public.emoji_sticker_stats.time = t.time
  and
    app_public.emoji_sticker_stats.asset_id = t.asset_id
  and
    -- Only updates the metrics row that has the correct guild_id
    app_public.emoji_sticker_stats.guild_id = t.guild_id
  and
    app_public.emoji_sticker_stats.action_type = t.action_type;

-- Delete all the external rows
delete from app_public.emoji_sticker_stats as stats_t
  using app_public.guild_emojis_and_stickers as guild_emojis_t
  where
    stats_t.asset_id = guild_emojis_t.id
  and
    guild_emojis_t.guild_id != stats_t.guild_id;

-- Delete emojis that don't sushii doesn't know of
delete from app_public.emoji_sticker_stats 
  where asset_id not in (
    select id
      from app_public.guild_emojis_and_stickers
  );

-- Remove guild_id from primary key
alter table app_public.emoji_sticker_stats
  drop constraint emoji_sticker_stats_pkey,
  add primary key (time, asset_id, action_type);

-- Delete guild_id in a later migration so this one can run repeatedly

-- Fine to delete asset_type from this table because it's not used anywhere previously
alter table app_public.emoji_sticker_stats
  drop column if exists asset_type;
