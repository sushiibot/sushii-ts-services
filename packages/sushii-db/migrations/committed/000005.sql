--! Previous: sha1:6fe0e4aff8c5e2d5dfaabf1fb96fc8a9503dd27f
--! Hash: sha1:9be3da5aadbabc3371dd5c3101280ddadd5b742f

-- postgraphile auth stuff
-- and other stuff for reworked sushii-web with postgraphile

-- enable existing public stuff to be viewed
-- we don't directly use user_levels table, use view below to calculate levels stuff
-- alter table app_public.user_levels enable row level security;

-- anyone can view all
alter table app_public.cached_guilds enable row level security;
alter table app_public.user_levels   enable row level security;
alter table app_public.cached_users  enable row level security;
alter table app_public.tags          enable row level security;

drop policy if exists select_all on app_public.cached_guilds;
drop policy if exists select_all on app_public.user_levels;
drop policy if exists select_all on app_public.cached_users;
drop policy if exists select_all on app_public.tags;

create policy select_all on app_public.cached_guilds for select using (true);
create policy select_all on app_public.user_levels   for select using (true);
create policy select_all on app_public.cached_users  for select using (true);
create policy select_all on app_public.tags          for select using (true);

-- without grants, gets an rls error
-- "And in fact is likely a GRANT issue; e.g. you've used column-level select
-- grants. The error code is actually insufficient_privilege (42501)" 
grant select on app_public.cached_guilds to :DATABASE_VISITOR;
grant select on app_public.user_levels   to :DATABASE_VISITOR;
grant select on app_public.cached_users  to :DATABASE_VISITOR;
grant select on app_public.tags          to :DATABASE_VISITOR;

-- disable getting all at once, only allow getting by id
comment on table app_public.cached_guilds is E'@omit all,filter';
comment on table app_public.user_levels   is E'@omit all,filter';
comment on table app_public.cached_users  is E'@omit all,filter';
-- comment on table app_public.tags          is E'@omit all,filter';
-- tags table needs to use all and filter to get guild tags
comment on table app_public.tags          is NULL;

-- add views and stuff for calculating user XP for leaderboards

-- gets the user's current level from **total** xp
-- https://gamedev.stackexchange.com/questions/13638/algorithm-for-dynamically-calculating-a-level-based-on-experience-points#comment124885_13639
-- Equations for the linearly rising level gap. level = (sqrt(100(2experience+25))+50)/100
drop function if exists app_hidden.level_from_xp(xp bigint) cascade;
create function app_hidden.level_from_xp(xp bigint) returns bigint as $$
  select floor((sqrt(100 * (2 * xp + 25)) + 50) / 100)::bigint;
$$ language sql immutable;

-- experience =(level^2+level)/2*100-(level*100)
-- required xp to progress a given level
drop function if exists app_hidden.xp_from_level(level bigint) cascade;
create function app_hidden.xp_from_level(level bigint) returns bigint as $$
  select floor((pow(level, 2) + level) / 2 * 100 - (level * 100))::bigint;
$$ language sql immutable;

-- triangular number * 100
-- https://en.wikipedia.org/wiki/Triangular_number
-- level - 1 since we start at level 1 but triangular starts at 0
drop function if exists app_hidden.total_xp_from_level(level bigint) cascade;
create function app_hidden.total_xp_from_level(level bigint) returns bigint as $$
  select floor(((level - 1) * ((level - 1) + 1) / 2) * 100)::bigint;
$$ language sql immutable;

drop type if exists app_hidden.level_timeframe cascade;
create type app_hidden.level_timeframe as enum ('ALL_TIME', 'DAY', 'WEEK', 'MONTH');

-- function to get a list of user xps,
-- NOT used directly, it's just to get a list of users with their levels aggregated
drop function if exists app_hidden.user_levels_filtered(
  f_timeframe app_hidden.level_timeframe,
  f_guild_id bigint
) cascade;

create function app_hidden.user_levels_filtered(
  f_timeframe app_hidden.level_timeframe,
  f_guild_id bigint
) returns table (
  user_id bigint,
  xp bigint,
  xp_diff bigint
) as $$
begin
  -- Bruh I don't know what this is either, but it works I think?
  -- aggregates are only if global (f_guild_id not provided)
  if f_guild_id is null then
    return query
           -- xp_diff should be xp gained only in a given category
           -- xp should always be total xp
           select app_public.user_levels.user_id,
                  -- total xp
                  sum(msg_all_time)::bigint as xp,
                  -- xp in timeframe
                  case
                       when f_timeframe = 'ALL_TIME' then null
                       when f_timeframe = 'DAY'      then sum(msg_day)::bigint
                       when f_timeframe = 'WEEK'     then sum(msg_week)::bigint
                       when f_timeframe = 'MONTH'    then sum(msg_month)::bigint
                  end xp_diff
             from app_public.user_levels
            where case
                       -- no filter when all
                       when f_timeframe = 'ALL_TIME' then true
                       when f_timeframe = 'DAY'
                            then extract(DOY  from last_msg) = extract(DOY  from now())
                             and extract(YEAR from last_msg) = extract(YEAR from now())
                       when f_timeframe = 'WEEK'
                            then extract(WEEK from last_msg) = extract(WEEK from now())
                             and extract(YEAR from last_msg) = extract(YEAR from now())
                       when f_timeframe = 'MONTH'
                            then extract(MONTH from last_msg) = extract(MONTH from now())
                             and extract(YEAR  from last_msg) = extract(YEAR  from now())
                  end
         group by app_public.user_levels.user_id;
  else
    -- guild query, no aggregates
    return query
           select app_public.user_levels.user_id,
                  -- total xp
                  msg_all_time as xp,
                  -- xp only in timeframe
                  case
                       when f_timeframe = 'ALL_TIME' then null
                       when f_timeframe = 'DAY'      then msg_day
                       when f_timeframe = 'WEEK'     then msg_week
                       when f_timeframe = 'MONTH'    then msg_month
                  end xp_diff
             from app_public.user_levels
            where guild_id = f_guild_id
              and case
                       -- no filter when all
                       when f_timeframe = 'ALL_TIME' then true
                       when f_timeframe = 'DAY'
                            then extract(DOY  from last_msg) = extract(DOY  from now())
                             and extract(YEAR from last_msg) = extract(YEAR from now())
                       when f_timeframe = 'WEEK'
                            then extract(WEEK from last_msg) = extract(WEEK from now())
                             and extract(YEAR from last_msg) = extract(YEAR from now())
                       when f_timeframe = 'MONTH'
                            then extract(MONTH from last_msg) = extract(MONTH from now())
                             and extract(YEAR  from last_msg) = extract(YEAR  from now())
                  end;
  end if;
end;
$$ language plpgsql stable security definer set search_path to pg_catalog, public, app_public, pg_temp;

-- function to get either global/guild leaderboard with specified timeframe
-- this is to actually get the leaderboard with their cached user data added
drop function if exists app_public.timeframe_user_levels(
  timeframe app_hidden.level_timeframe,
  guild_id bigint
) cascade;

create function app_public.timeframe_user_levels(
  timeframe app_hidden.level_timeframe,
  guild_id bigint default null
) returns table (
  user_id bigint,
  avatar_url text,
  username text,
  discriminator int,
  xp bigint,
  xp_diff bigint,
  current_level bigint,
  gained_levels bigint,
  next_level_xp_required bigint,
  next_level_xp_progress bigint
) as $$
  select t.user_id,
         avatar_url,
         name as username,
         discriminator,
         t.xp,
         t.xp_diff,
         current_level,
         gained_levels,
         next_level_xp_required,
         next_level_xp_progress
    from app_hidden.user_levels_filtered(timeframe, guild_id) t
         -- join the cached users to get username/avatar/discrim
         left join app_public.cached_users
                on user_id = id,
         -- lateral joins to reuse calculations, prob not needed considering
         -- they're immutable functions which should be optimized
         lateral (select app_hidden.level_from_xp(xp)
                         as current_level
                 ) c,
         -- required xp to level up ie
         -- level 2 -> 3 = 200xp
         -- level 3 -> 4 = 300xp, etc
         lateral (select current_level * 100
                         as next_level_xp_required
                 ) r,
         -- how much xp a user has progressed in a single level
         -- ie if they are level 2 and they have 150 xp, level 1 required 100xp
         -- this will return 50xp
         lateral (select xp - app_hidden.total_xp_from_level(current_level)
                         as next_level_xp_progress
                 ) p,
         lateral (select (current_level - app_hidden.level_from_xp(xp - t.xp_diff))
                         as gained_levels
                 ) g
      order by xp_diff desc,
               -- if xp_diff is null, then it will sort by xp (i think)
               xp desc,
               user_id desc;
$$ language sql stable;

comment on function app_public.timeframe_user_levels is
  E'Leaderboard for given timeframe and optional guild. If guild is null, it is the global leaderboard';

/**********/

-- now auth stuff

/**********/
drop table if exists app_private.sessions cascade;
create table app_private.sessions (
  uuid        uuid        not null default gen_random_uuid() primary key,
  -- discord user id
  user_id     bigint      not null,
  -- You could add access restriction columns here if you want, e.g. for OAuth scopes.
  created_at  timestamptz not null default now(),
  last_active timestamptz not null default now()
);
alter table app_private.sessions enable row level security;

/**********/

drop function if exists app_public.current_session_id() cascade;
create function app_public.current_session_id() returns uuid as $$
  select nullif(pg_catalog.current_setting('jwt.claims.session_id', true), '')::uuid;
$$ language sql stable;
comment on function app_public.current_session_id() is
  E'Handy method to get the current session ID.';
-- We've put this in public, but omitted it, because it's often useful for debugging auth issues.

/**********/

drop function if exists app_public.current_user_id() cascade;
create function app_public.current_user_id() returns bigint as $$
  select user_id
    from app_private.sessions
   where uuid = app_public.current_session_id();
$$ language sql stable security definer set search_path to pg_catalog, public, pg_temp;
comment on function app_public.current_user_id() is
  E'Handy method to get the current user ID for use in RLS policies, etc; in GraphQL, use `currentUser{id}` instead.';

/**********/

drop function if exists app_private.tg__timestamps() cascade;
create function app_private.tg__timestamps() returns trigger as $$
begin
  NEW.created_at = (case when TG_OP = 'INSERT' then NOW() else OLD.created_at end);
  NEW.updated_at = (case when TG_OP = 'UPDATE' and OLD.updated_at >= NOW() then OLD.updated_at + interval '1 millisecond' else NOW() end);
  return NEW;
end;
$$ language plpgsql volatile set search_path to pg_catalog, public, pg_temp;
comment on function app_private.tg__timestamps() is
  E'This trigger should be called on all tables with created_at, updated_at - it ensures that they cannot be manipulated and that updated_at will always be larger than the previous updated_at.';

/**********/

-- users that logged into web ui
-- this is app_public.users and app_public.user_authentications from the graphile/starter merged
-- since we only care about a single oauth discord login we don't need an extra table for multiple auths
drop table if exists app_public.web_users cascade;
create table app_public.web_users (
    -- discord user ID
    id            bigint      primary key,
    -- discord username/discrim
    username      text        not null,
    discriminator int         not null,
    -- avatar hash
    avatar        text,
    -- just me, for future administrative uses
    is_admin      boolean     not null default false,
    -- oauth info
    details jsonb not null default '{}'::jsonb,
    created_at    timestamptz not null default now(),
    updated_at    timestamptz not null default now()
);
alter table app_public.web_users enable row level security;

-- add foriegn key and index to sessions
alter table app_private.sessions
add constraint sessions_user_id_fkey
   foreign key ("user_id")
    references app_public.web_users on delete cascade;

create index on app_private.sessions (user_id);

-- rls stuff
create policy select_self on app_public.web_users for select using (id = app_public.current_user_id());
create policy update_self on app_public.web_users for update using (id = app_public.current_user_id());
grant select on app_public.web_users to :DATABASE_VISITOR;
-- no update is granted since all attributes are to follow their discord user, do not want users to modify
-- grant update(username, name, avatar_url) on app_public.web_users to :DATABASE_VISITOR;

comment on table app_public.web_users is
  E'A user who can log in to the application.';
comment on column app_public.web_users.id is
  E'Unique identifier for the user. This should match their Discord ID.';
comment on column app_public.web_users.username is
  E'Discord username of the user.';
comment on column app_public.web_users.discriminator is
  E'Discord disciminator of the user.';
comment on column app_public.web_users.avatar is
  E'Discord avatar hash. Null if user does not have one.';
comment on column app_public.web_users.is_admin is
  E'If true, the user has elevated privileges.';
comment on column app_public.web_users.details is
  E'Additional profile details extracted from Discord oauth';
comment on column app_public.web_users.created_at is
  E'First registered on the application. Is not when a user created their Discord account.';

-- Update created_at, updated_at
create trigger _100_timestamps
  before insert or update on app_public.web_users
  for each row
  execute procedure app_private.tg__timestamps();

/**********/

-- edit existing cached_guild
alter table app_public.cached_guilds
  drop column if exists created_at cascade,
  drop column if exists updated_at cascade;

-- add timestamps
alter table app_public.cached_guilds
  add column created_at timestamptz not null default now(),
  add column updated_at timestamptz not null default now();

-- timestamps
create trigger _100_timestamps
  before insert or update on app_public.cached_guilds
  for each row
  execute procedure app_private.tg__timestamps();

/**********/

-- should only contain guilds with manage guild permissions
drop table if exists app_public.web_user_guilds cascade;
create table app_public.web_user_guilds (
    user_id     bigint  not null,
    guild_id    bigint  not null,
    -- if user is owner of guild
    owner       boolean not null,
    permissions bigint  not null,
    -- https://discord.com/developers/docs/topics/permissions#permissions
    -- true if user has manage_guild
    manage_guild boolean generated always
      as ((permissions & x'00000020'::bigint) = x'00000020'::bigint) stored,
    -- composite key
    primary key (user_id, guild_id)
);

create index on app_public.web_user_guilds(user_id);
create index on app_public.web_user_guilds(guild_id);
comment on table app_public.web_user_guilds is
  E'@foreignKey (user_id) references app_public.web_users (id)\n@foreignKey (guild_id) references app_public.cached_guilds (id)';

-- get all guild ids a user is in where user has managed_guild permission
-- ignores servers user doesn't have manage_guild in.
-- shouldn't be necessary since only guilds are added if user has permission
-- this is just in case i guess, if we want to expand permissions further in the future
-- to allow roles or something with access
drop function if exists app_public.current_user_managed_guild_ids() cascade;
create function app_public.current_user_managed_guild_ids() returns setof bigint as $$
  select guild_id
    from app_public.web_user_guilds
   where user_id = app_public.current_user_id()
     and manage_guild
      or owner;
$$ language sql stable security definer set search_path = pg_catalog, public, pg_temp;

alter table app_public.web_user_guilds enable row level security;
-- only allow owner or manage_guild users to view guild configs
create policy select_web_user_guilds on app_public.web_user_guilds
  for select using (manage_guild or owner);
grant select on app_public.web_user_guilds to :DATABASE_VISITOR;

-- enable rls to guild configs so it shows up
alter table app_public.guild_configs enable row level security;
-- only allow owner or manage_guild users to view guild configs
create policy select_managed_guild on app_public.guild_configs
  for select using (id in (select app_public.current_user_managed_guild_ids()));
create policy update_managed_guild on app_public.guild_configs
  for update using (id in (select app_public.current_user_managed_guild_ids()));
grant select on app_public.guild_configs to :DATABASE_VISITOR;
grant update(
  prefix,
  join_msg,
  join_msg_enabled,
  join_react,
  leave_msg,
  leave_msg_enabled,
  msg_channel,
  role_channel,
  role_config,
  role_enabled,
  invite_guard,
  log_msg,
  log_msg_enabled,
  log_mod,
  log_mod_enabled,
  log_member,
  log_member_enabled,
  mute_role,
  mute_duration,
  mute_dm_text,
  mute_dm_enabled,
  warn_dm_text,
  warn_dm_enabled,
  max_mention,
  disabled_channels
) on app_public.guild_configs to :DATABASE_VISITOR;

-- add fkey to guild configs to point to cached guild so we can get guild name etc
-- fake fkey since cached guild might not exist
comment on table app_public.guild_configs is
  E'@foreignKey (id) references app_public.cached_guilds (id)';

/**********/

drop function if exists app_public.current_user() cascade;
create function app_public.current_user() returns app_public.web_users as $$
  select web_users.*
    from app_public.web_users
   where id = app_public.current_user_id();
$$ language sql stable;
comment on function app_public.current_user() is
  E'The currently logged in user (or null if not logged in).';

/*******************/
/* main auth stuff */
/*******************/

-- This table contains secret information for each user_authentication; could
-- be things like access tokens, refresh tokens, profile information. Whatever
-- the passport strategy deems necessary.
drop table if exists app_private.user_authentication_secrets cascade;
create table app_private.user_authentication_secrets (
  user_id bigint not null primary key
    references app_public.web_users(id) on delete cascade,
  details jsonb not null default '{}'::jsonb
);
alter table app_private.user_authentication_secrets enable row level security;

/***********/

drop function if exists app_public.logout() cascade;
create function app_public.logout() returns void as $$
begin
  -- Delete the session
  delete from app_private.sessions
        where uuid = app_public.current_session_id();
  -- Clear the identifier from the transaction
  perform set_config('jwt.claims.session_id', '', true);
end;
$$ language plpgsql security definer volatile set search_path to pg_catalog, public, pg_temp;

/**********/

drop function if exists app_public.register_user(
  f_discord_user_id character varying,
  f_profile json,
  f_auth_details json
) cascade;
create function app_private.register_user(
  f_discord_user_id character varying,
  f_profile json,
  f_auth_details json
) returns app_public.web_users as $$
declare
  v_user app_public.web_users;
  v_username text;
  v_discriminator int;
  v_avatar text;
  v_user_guilds json;
begin
  -- Extract data from the user’s OAuth profile data.
  v_username := f_profile ->> 'username';
  v_discriminator := (f_profile ->> 'discriminator')::int;
  v_avatar := f_profile ->> 'avatar';
  v_user_guilds := f_profile -> 'guilds';

  -- Insert the new user
  insert into app_public.web_users (id, username, discriminator, avatar, details)
       values (f_discord_user_id::bigint, v_username, v_discriminator, v_avatar, f_profile)
    returning *
         into v_user;

  -- Insert guilds
  insert into app_public.cached_guilds (id, name, icon, features)
       select (value->>'id')::bigint as guild_id,
              value->>'name',
              value->>'icon',
              array(select json_array_elements_text(value->'features'))
         from json_array_elements(v_user_guilds)
              -- only save guilds where user has manage guild permissions
        where ((value->>'permissions')::bigint & x'00000020'::bigint) = x'00000020'::bigint
           or (value->>'owner')::boolean
           on conflict (id)
              do update
              set name = excluded.name,
                  icon = excluded.icon;

  -- Insert web guilds, should not conflict since new user means they will have no entries
  -- if this runs into error means it's re-registering a user I think
  insert into app_public.web_user_guilds (user_id, guild_id, owner, permissions)
       select f_discord_user_id::bigint as user_id,
              (value->>'id')::bigint,
              (value->>'owner')::boolean,
              (value->>'permissions')::bigint
         from json_array_elements(v_user_guilds)
        where ((value->>'permissions')::bigint & x'00000020'::bigint) = x'00000020'::bigint
           or (value->>'owner')::boolean;

  -- Insert the user’s private account data (e.g. OAuth tokens)
  insert into app_private.user_authentication_secrets (user_id, details)
       values (f_discord_user_id::bigint, f_auth_details);

  return v_user;
end;
$$ language plpgsql volatile security definer set search_path to pg_catalog, public, pg_temp;

comment on function app_private.register_user(f_discord_user_id character varying, f_profile json, f_auth_details json) is
  E'Used to register a user from information gleaned from OAuth. Primarily used by login_or_register_user';

/**********/

-- should not be called if logged in already. graphile/starter uses this to link
-- additional oauth accounts if user is already logged in but since we only care
-- about Discord, if user is already logged in then there is no reason for them
-- to link another account, there is no other accounts to link
drop function if exists app_private.login_or_register_user(
  f_discord_user_id character varying,
  f_profile json,
  f_auth_details json
);
create function app_private.login_or_register_user(
  -- discord id as string, in case any u64 overflows in JS
  f_discord_user_id character varying,
  f_profile json,
  f_auth_details json
) returns app_public.web_users as $$
declare
  v_matched_user_id bigint;
  v_username text;
  v_discriminator int;
  v_avatar text;
  v_user_guilds json;
  v_user app_public.web_users;
begin
  -- check if there is already a user
  select id
    into v_matched_user_id
    from app_public.web_users
   where id = f_discord_user_id::bigint
   limit 1;

  v_username := f_profile ->> 'username';
  v_discriminator := (f_profile ->> 'discriminator')::int;
  v_avatar := f_profile ->> 'avatar';
  v_user_guilds := f_profile -> 'guilds';

  -- v_matched_user_id is if user already registered, f_user_id is null if not logged in
  if v_matched_user_id is null then
    -- create and return new user account
    -- do not need to handle linking new external oauth accounts to existing
    -- accounts since we only care about Discord oauth, if user already has
    -- existing account then there isn't anything to link
    return app_private.register_user(f_discord_user_id, f_profile, f_auth_details);
  else
    -- user exists, update oauth info to keep details in sync
    update app_public.web_users
           -- coalese new value is first since it returns first non-null value
       set username = coalesce(v_username, app_public.web_users.username),
           discriminator = coalesce(v_discriminator, app_public.web_users.discriminator),
           avatar = coalesce(v_avatar, app_public.web_users.avatar),
           details = f_profile
     where id = v_matched_user_id
           returning * into v_user;

    update app_private.user_authentication_secrets
       set details = f_auth_details
     where user_id = v_matched_user_id;

    -- Update guild data
    insert into app_public.cached_guilds (id, name, icon, features)
         select (value->>'id')::bigint,
                value->>'name',
                value->>'icon',
                array(select json_array_elements_text(value->'features'))
           from json_array_elements(v_user_guilds)
          where ((value->>'permissions')::bigint & x'00000020'::bigint) = x'00000020'::bigint
             or (value->>'owner')::boolean
             on conflict (id)
                do update
                set name = excluded.name,
                    icon = excluded.icon;

    -- Delete user guilds that they left
    -- ensure guild_id not in is not nulls
    delete from app_public.web_user_guilds
          where user_id = v_matched_user_id
            and guild_id not in (
                select (value->>'id')::bigint
                  from json_array_elements(v_user_guilds)
                 where guild_id is not null);

    -- Update user guilds
    insert into app_public.web_user_guilds (user_id, guild_id, owner, permissions)
         select f_discord_user_id::bigint as user_id,
                (value->>'id')::bigint,
                (value->>'owner')::boolean,
                (value->>'permissions')::bigint
           from json_array_elements(v_user_guilds)
                -- only save guilds where user has manage guild permissions
                where ((value->>'permissions')::bigint & x'00000020'::bigint) = x'00000020'::bigint
                   or (value->>'owner')::boolean
                on conflict (user_id, guild_id)
                   do update
                   set permissions = excluded.permissions;

    return v_user;
  end if;
end;
$$ language plpgsql volatile security definer set search_path to pg_catalog, public, pg_temp;

comment on function app_private.login_or_register_user(f_discord_user_id character varying, f_profile json, f_auth_details json) is
  E'This will log you in if an account already exists (based on OAuth Discord user_id) and return that, or create a new user account.';
