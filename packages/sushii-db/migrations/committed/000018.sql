--! Previous: sha1:c5bd859bb54169fd8eb03abfce4e6ff5d6e46d77
--! Hash: sha1:ed42ccfcda79bd900ae90b3185c73330cd2b8069

-- recreate the table as a regular one instead of timescale hypertable
drop table if exists app_public.messages;
create table app_public.messages (
  message_id bigint    primary key,
  author_id  bigint    not null,
  channel_id bigint    not null,
  guild_id   bigint    not null,
  created    timestamp not null,
  content    text      not null,
  msg        jsonb     not null
);

-- Index on created timestamp used when deleting the oldest messages
drop index if exists app_public.messages_created_idx;
create index messages_created_idx on app_public.messages(created);

-- Must be called periodically to keep the table from growing indefinitely
drop function if exists app_public.delete_messages_before(
  before timestamp
) cascade;
create function app_public.delete_messages_before(
  before timestamp
) returns bigint as $$
  with deleted as (
    delete from app_public.messages
    where created < $1
    returning *
  )
  select count(*)
  from deleted
$$ language sql;
