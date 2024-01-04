-- Giveaways

drop table if exists app_public.giveaways cascade;
drop table if exists app_public.giveaway_entries cascade;
drop type if exists  app_public.giveaway_nitro_type cascade;

-- Nitro for class, basic, and nitro, currently not supporting separation of
-- basic and nitro as the slash command UI currently does not make it easy to 
-- pick multiple options, e.g. allowing "none" and "basic" but not "nitro" would
-- be difficult without a select menu.
create type app_public.giveaway_nitro_type as enum(
  'none',
  'nitro'
);

create table app_public.giveaways (
  -- Message ID of the giveaway message
  id           bigint  not null primary key,
  -- Channel ID of the giveaway message
  channel_id   bigint  not null,
  -- Guild ID this giveaway belongs to
  guild_id     bigint  not null,
  -- User ID of the giveaway host
  host_user_id bigint  not null,
  prize        text    not null,
  num_winners  integer not null,

  -- Optional requirements
  required_role_id     bigint,
  required_min_level   integer,
  required_max_level   integer,
  required_nitro_state app_public.giveaway_nitro_type,
  required_boosting    boolean,

  -- If giveaway was manually ended with /giveaway end, it shouldn't trigger
  -- winners again when end_at is reached.
  manually_ended boolean not null default false,

  start_at timestamp not null,
  end_at   timestamp not null
);

create table app_public.giveaway_entries (
  giveaway_id bigint not null references app_public.giveaways(id) on delete cascade,
  user_id     bigint not null,

  created_at timestamp not null default now(),
  -- True either when: initial winner or re-roll winner. Marked as true to prevent
  -- re-rolls from picking the same user.
  is_picked  boolean   not null default false,

  primary key (giveaway_id, user_id)
);
