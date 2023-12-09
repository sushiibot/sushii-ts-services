--! Previous: sha1:0d003169488f3f070edd4049b526d9782206577a
--! Hash: sha1:c5bd859bb54169fd8eb03abfce4e6ff5d6e46d77

drop type if exists app_public.msg_log_block_type cascade;
create type app_public.msg_log_block_type as enum (
  'edits',
  'deletes',
  'all'
);

-- Table for blocked channels for message log
drop table if exists app_public.msg_log_blocks cascade;
create table if not exists app_public.msg_log_blocks (
  guild_id   bigint not null,
  -- channel to block
  channel_id bigint not null,
  block_type app_public.msg_log_block_type not null,
  primary key (guild_id, channel_id)
);
