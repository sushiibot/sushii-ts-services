--! Previous: sha1:fea2c80c01826bfc2787f90ba252be0fad85dc91
--! Hash: sha1:db54b8d829ca09309d19695865a2882770d24e04

drop table if exists app_public.guild_bans cascade;
create table app_public.guild_bans (
    guild_id   bigint    not null,
    user_id    bigint    not null,
    primary key (guild_id, user_id)
);

-- Lookups via single user_id
create index on app_public.guild_bans(user_id);

alter table app_public.guild_configs
  drop column if exists data;

alter table app_public.guild_configs
  add column data jsonb not null default '{}';
