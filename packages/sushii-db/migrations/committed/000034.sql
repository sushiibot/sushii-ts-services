--! Previous: sha1:ecbc16988ee3cdf2872b69d3f0415d640d09a67f
--! Hash: sha1:d02f0791c28f7ce6610caa22ada1f08f20975d5d

-- Notification blocks
drop table if exists app_public.notification_blocks;
drop type if exists app_public.notification_block_type;

create type app_public.notification_block_type as enum (
  'user',
  'channel'
);

create table app_public.notification_blocks (
  user_id    bigint not null,
  block_id   bigint not null,
  -- Just for display purposes
  block_type app_public.notification_block_type not null,

  primary key (user_id, block_id)
);
