--! Previous: sha1:0bcea54449d5164cbcf5fbcfb5120f59ee553382
--! Hash: sha1:ac2d0eb12898fe116526947c0807f7b2372b0007

-- Levels roles!

-- Add generated level column to user rank row for convenience
alter table app_public.user_levels
  drop column if exists level;
alter table app_public.user_levels
  add column level bigint not null generated always as (
    app_hidden.level_from_xp(msg_all_time)
  ) stored;


-- Add table for level roles
drop table if exists app_public.level_roles cascade;
create table if not exists app_public.level_roles (
  guild_id     bigint not null,
  role_id      bigint not null,
  add_level    bigint,
  remove_level bigint,

  primary key (guild_id, role_id),
  constraint chk_at_least_one_level check (num_nonnulls(add_level, remove_level) >= 1),
  constraint chk_add_before_remove  check (add_level < remove_level)
);

-- query specific levels for guilds
create index level_roles_guild_id_add_level_idx on app_public.level_roles(guild_id, add_level);
create index level_roles_guild_id_remove_level_idx on app_public.level_roles(guild_id, remove_level);

drop type if exists app_public.block_type cascade;
create type app_public.block_type as enum (
  'channel',
  'role'
);

-- Table for blocked channels and roles
drop table if exists app_public.xp_blocks cascade;
create table if not exists app_public.xp_blocks (
  guild_id   bigint not null,
  -- channel or role id
  block_id   bigint not null,
  block_type app_public.block_type not null,

  -- technically @everyone and first channel in a server can have the same id
  -- but you cannot add @everyone as a block, so there will be no conflict
  primary key (guild_id, block_id)
);

-- Custom type for level role response for process to know which roles were
-- granted or removed
drop type if exists app_public.user_xp_update_result cascade;
create type app_public.user_xp_update_result as (
  old_level       bigint,
  new_level       bigint,
  -- level roles to add/remove
  add_role_ids    bigint[],
  remove_role_ids bigint[]
);

-- Updates a user's XP, resetting any relevant counters and returns any roles to add or to remove
drop function if exists app_public.update_user_xp(
  guild_id   bigint,
  channel_id bigint,
  user_id    bigint,
  role_ids   bigint[]
) cascade;
create function app_public.update_user_xp(
  guild_id   bigint,
  channel_id bigint,
  user_id    bigint,
  role_ids   bigint[]
) returns app_public.user_xp_update_result as $$
#variable_conflict use_column
declare
  old_level bigint;
  new_level bigint;
  new_last_msg timestamp;

  -- level roles to add/remove
  add_role_ids    bigint[];
  remove_role_ids bigint[];
begin
  -- Ignore any channels or roles that are blocked
  if exists (
    select from app_public.xp_blocks
      where 
        guild_id = $1
        and
        (
          block_id = $2
          or
          block_id = any($4)
        )
  ) then
    raise notice 'Ignoring XP gain in channel/role % in guild %', $2, $1;
    return (old_level, new_level, '{}'::bigint[], '{}'::bigint[]);
  end if;

  insert into app_public.user_levels (
    guild_id,
    user_id,
    msg_all_time,
    msg_month,
    msg_week,
    msg_day,
    last_msg
  )
    values ($1, $3, 5, 5, 5, 5, now())
    on conflict (guild_id, user_id) do update
      set last_msg = now(),
      msg_all_time = app_public.user_levels.msg_all_time + 5,
      msg_month = (
        case
          when extract(MONTH from app_public.user_levels.last_msg) = extract(MONTH from now())
           and extract(YEAR  from app_public.user_levels.last_msg) = extract(YEAR  from now())
            then app_public.user_levels.msg_month + 5
          else 5
        end
      ),
      msg_week = (
        case
          when extract(WEEK from app_public.user_levels.last_msg) = extract(WEEK from now())
           and extract(YEAR from app_public.user_levels.last_msg) = extract(YEAR from now())
            then app_public.user_levels.msg_month + 5
          else 5
        end
      ),
      msg_day = (
        case
          when extract(DAY  from app_public.user_levels.last_msg) = extract(DAY  from now())
           and extract(YEAR from app_public.user_levels.last_msg) = extract(YEAR from now())
            then app_public.user_levels.msg_month + 5
          else 5
        end
      )
      where app_public.user_levels.last_msg < (now() - interval '1 minute')
    returning
      level,
      (select level
        from app_public.user_levels
        where guild_id = $1
          and user_id = $3
      ) as old_level
      into
      new_level,
      old_level;

  -- new_level will be null if the user was not updated
  if new_level is null then
    raise notice 'user % in guild % was not updated (already gained xp within last minute)', $3, $1;

    return (old_level, new_level, '{}'::bigint[], '{}'::bigint[]);
  end if;

  raise notice 'added xp for member %: new_level %, old_level %', user_id, new_level, old_level;

  -- User did not level up, just return
  if new_level = old_level then
    return (old_level, new_level, '{}'::bigint[], '{}'::bigint[]);
  end if;

  raise notice 'user % in guild % leveled up from % to %', $3, $1, old_level, new_level;

  -- Add roles
  select
    coalesce(array_agg(role_id), '{}')
  into
    add_role_ids
  from app_public.level_roles
    where
      app_public.level_roles.guild_id = $1
      and
      app_public.level_roles.add_level is not null
      and
      app_public.level_roles.add_level = new_level;

  -- Remove roles
  select
    coalesce(array_agg(role_id), '{}')
  into
    remove_role_ids
  from app_public.level_roles
    where
      app_public.level_roles.guild_id = $1
      and
      app_public.level_roles.remove_level is not null
      and
      app_public.level_roles.remove_level = new_level;

  return (old_level, new_level, add_role_ids, remove_role_ids);
end;
$$ language plpgsql volatile security definer set search_path to pg_catalog, public, app_public, pg_temp;

-- 42501 error without this
grant select on app_public.level_roles to :DATABASE_VISITOR;
grant select on app_public.xp_blocks   to :DATABASE_VISITOR;

grant select, insert, update, delete on app_public.level_roles to :DATABASE_ADMIN;
grant select, insert, update, delete on app_public.xp_blocks   to :DATABASE_ADMIN;

alter table app_public.level_roles enable row level security;
alter table app_public.xp_blocks enable row level security;

-- does not include policy for visitor role
drop policy if exists admin_access on app_public.level_roles;
drop policy if exists admin_access on app_public.xp_blocks;

create policy admin_access on app_public.level_roles
  for all to :DATABASE_ADMIN using (true);
create policy admin_access on app_public.xp_blocks
  for all to :DATABASE_ADMIN using (true);
