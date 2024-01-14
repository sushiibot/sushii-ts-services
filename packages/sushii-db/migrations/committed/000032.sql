--! Previous: sha1:f1c1489375e7cc6925cadb989ecbcd2da60981cf
--! Hash: sha1:b0528ecaca7c52883bb7d60123f571f87b6d91cd

-- Temp bans

drop table if exists app_public.temp_bans cascade;

create table app_public.temp_bans (
  user_id bigint not null,
  guild_id bigint not null,

  expires_at timestamp not null,
  created_at timestamp not null default now(),

  primary key (user_id, guild_id)
);
