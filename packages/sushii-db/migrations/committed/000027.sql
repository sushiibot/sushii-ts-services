--! Previous: sha1:645e5d53750a12eea578971c5210ce6945702eee
--! Hash: sha1:095a6944aa6c704a47ef5d6b2c7c869046ba0d81

-- Add prereqs to emoji stats restructure

-- Contains all guild emojis and stickers
drop table if exists app_public.guild_emojis_and_stickers cascade;
create table app_public.guild_emojis_and_stickers (
  id       bigint not null primary key,
  guild_id bigint not null,
  name     text not null,
  type     app_public.guild_asset_type not null
);
