--
-- PostgreSQL database dump
--

-- Dumped from database version 14.4
-- Dumped by pg_dump version 14.4 (Ubuntu 14.4-1.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: timescaledb; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS timescaledb WITH SCHEMA public;


--
-- Name: EXTENSION timescaledb; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION timescaledb IS 'Enables scalable inserts and complex queries for time-series data';


--
-- Name: app_hidden; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA app_hidden;


--
-- Name: app_private; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA app_private;


--
-- Name: app_public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA app_public;


--
-- Name: postgraphile_watch; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA postgraphile_watch;


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: tsm_system_rows; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS tsm_system_rows WITH SCHEMA public;


--
-- Name: EXTENSION tsm_system_rows; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION tsm_system_rows IS 'TABLESAMPLE method which accepts number of rows as a limit';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: level_timeframe; Type: TYPE; Schema: app_hidden; Owner: -
--

CREATE TYPE app_hidden.level_timeframe AS ENUM (
    'ALL_TIME',
    'DAY',
    'WEEK',
    'MONTH'
);


--
-- Name: block_type; Type: TYPE; Schema: app_public; Owner: -
--

CREATE TYPE app_public.block_type AS ENUM (
    'channel',
    'role'
);


--
-- Name: eligible_level_role; Type: TYPE; Schema: app_public; Owner: -
--

CREATE TYPE app_public.eligible_level_role AS (
	user_id bigint,
	role_ids bigint[]
);


--
-- Name: emoji_sticker_action_type; Type: TYPE; Schema: app_public; Owner: -
--

CREATE TYPE app_public.emoji_sticker_action_type AS ENUM (
    'message',
    'reaction'
);


--
-- Name: guild_asset_type; Type: TYPE; Schema: app_public; Owner: -
--

CREATE TYPE app_public.guild_asset_type AS ENUM (
    'emoji',
    'sticker'
);


--
-- Name: emoji_sticker_stat_increment_data; Type: TYPE; Schema: app_public; Owner: -
--

CREATE TYPE app_public.emoji_sticker_stat_increment_data AS (
	asset_id bigint,
	asset_type app_public.guild_asset_type
);


--
-- Name: level_role_override_type; Type: TYPE; Schema: app_public; Owner: -
--

CREATE TYPE app_public.level_role_override_type AS ENUM (
    'grant',
    'block'
);


--
-- Name: msg_log_block_type; Type: TYPE; Schema: app_public; Owner: -
--

CREATE TYPE app_public.msg_log_block_type AS ENUM (
    'edits',
    'deletes',
    'all'
);


--
-- Name: user_guild_rank_result; Type: TYPE; Schema: app_public; Owner: -
--

CREATE TYPE app_public.user_guild_rank_result AS (
	user_id bigint,
	guild_id bigint,
	msg_all_time bigint,
	msg_month bigint,
	msg_week bigint,
	msg_day bigint,
	last_msg timestamp without time zone,
	msg_all_time_rank bigint,
	msg_all_time_total bigint,
	msg_month_rank bigint,
	msg_month_total bigint,
	msg_week_rank bigint,
	msg_week_total bigint,
	msg_day_rank bigint,
	msg_day_total bigint
);


--
-- Name: user_xp_update_result; Type: TYPE; Schema: app_public; Owner: -
--

CREATE TYPE app_public.user_xp_update_result AS (
	old_level bigint,
	new_level bigint,
	add_role_ids bigint[],
	remove_role_ids bigint[]
);


--
-- Name: level_from_xp(bigint); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.level_from_xp(xp bigint) RETURNS bigint
    LANGUAGE sql IMMUTABLE
    AS $$
  select floor((sqrt(100 * (2 * xp + 25)) + 50) / 100)::bigint;
$$;


--
-- Name: total_xp_from_level(bigint); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.total_xp_from_level(level bigint) RETURNS bigint
    LANGUAGE sql IMMUTABLE
    AS $$
  select floor(((level - 1) * ((level - 1) + 1) / 2) * 100)::bigint;
$$;


--
-- Name: user_levels_filtered(app_hidden.level_timeframe, bigint); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.user_levels_filtered(f_timeframe app_hidden.level_timeframe, f_guild_id bigint) RETURNS TABLE(user_id bigint, xp bigint, xp_diff bigint)
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO 'pg_catalog', 'public', 'app_public', 'pg_temp'
    AS $$
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
$$;


--
-- Name: xp_from_level(bigint); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.xp_from_level(level bigint) RETURNS bigint
    LANGUAGE sql IMMUTABLE
    AS $$
  select floor((pow(level, 2) + level) / 2 * 100 - (level * 100))::bigint;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: web_users; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.web_users (
    id bigint NOT NULL,
    username text NOT NULL,
    discriminator integer NOT NULL,
    avatar text,
    is_admin boolean DEFAULT false NOT NULL,
    details jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE web_users; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.web_users IS 'A user who can log in to the application.';


--
-- Name: COLUMN web_users.id; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.web_users.id IS 'Unique identifier for the user. This should match their Discord ID.';


--
-- Name: COLUMN web_users.username; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.web_users.username IS 'Discord username of the user.';


--
-- Name: COLUMN web_users.discriminator; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.web_users.discriminator IS 'Discord disciminator of the user.';


--
-- Name: COLUMN web_users.avatar; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.web_users.avatar IS 'Discord avatar hash. Null if user does not have one.';


--
-- Name: COLUMN web_users.is_admin; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.web_users.is_admin IS 'If true, the user has elevated privileges.';


--
-- Name: COLUMN web_users.details; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.web_users.details IS 'Additional profile details extracted from Discord oauth';


--
-- Name: COLUMN web_users.created_at; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.web_users.created_at IS 'First registered on the application. Is not when a user created their Discord account.';


--
-- Name: login_or_register_user(character varying, json, json); Type: FUNCTION; Schema: app_private; Owner: -
--

CREATE FUNCTION app_private.login_or_register_user(f_discord_user_id character varying, f_profile json, f_auth_details json) RETURNS app_public.web_users
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_catalog', 'public', 'pg_temp'
    AS $$
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
$$;


--
-- Name: FUNCTION login_or_register_user(f_discord_user_id character varying, f_profile json, f_auth_details json); Type: COMMENT; Schema: app_private; Owner: -
--

COMMENT ON FUNCTION app_private.login_or_register_user(f_discord_user_id character varying, f_profile json, f_auth_details json) IS 'This will log you in if an account already exists (based on OAuth Discord user_id) and return that, or create a new user account.';


--
-- Name: register_user(character varying, json, json); Type: FUNCTION; Schema: app_private; Owner: -
--

CREATE FUNCTION app_private.register_user(f_discord_user_id character varying, f_profile json, f_auth_details json) RETURNS app_public.web_users
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_catalog', 'public', 'pg_temp'
    AS $$
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
$$;


--
-- Name: FUNCTION register_user(f_discord_user_id character varying, f_profile json, f_auth_details json); Type: COMMENT; Schema: app_private; Owner: -
--

COMMENT ON FUNCTION app_private.register_user(f_discord_user_id character varying, f_profile json, f_auth_details json) IS 'Used to register a user from information gleaned from OAuth. Primarily used by login_or_register_user';


--
-- Name: tg__timestamps(); Type: FUNCTION; Schema: app_private; Owner: -
--

CREATE FUNCTION app_private.tg__timestamps() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'pg_catalog', 'public', 'pg_temp'
    AS $$
begin
  NEW.created_at = (case when TG_OP = 'INSERT' then NOW() else OLD.created_at end);
  NEW.updated_at = (case when TG_OP = 'UPDATE' and OLD.updated_at >= NOW() then OLD.updated_at + interval '1 millisecond' else NOW() end);
  return NEW;
end;
$$;


--
-- Name: FUNCTION tg__timestamps(); Type: COMMENT; Schema: app_private; Owner: -
--

COMMENT ON FUNCTION app_private.tg__timestamps() IS 'This trigger should be called on all tables with created_at, updated_at - it ensures that they cannot be manipulated and that updated_at will always be larger than the previous updated_at.';


--
-- Name: role_menu_roles; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.role_menu_roles (
    guild_id bigint NOT NULL,
    menu_name text NOT NULL,
    role_id bigint NOT NULL,
    emoji text,
    description character varying(100),
    "position" integer
);


--
-- Name: add_role_menu_roles(bigint, text, bigint[]); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.add_role_menu_roles(guild_id bigint, menu_name text, role_ids bigint[]) RETURNS SETOF app_public.role_menu_roles
    LANGUAGE sql
    AS $_$
  insert into app_public.role_menu_roles (guild_id, menu_name, role_id, position)
    select guild_id, menu_name, u.role_id, u.position
      from (select
          unnest(role_ids) as role_id,
          -- start at the previous max
          generate_series(
            (
            -- start at 1 if there is currently no max, must be 1 to generate correct series length
            select coalesce(max(position) + 1, 1)
              from app_public.role_menu_roles
              where guild_id = $1
                and menu_name = $2
            ),
            -- end series at length of array
            array_length(role_ids, 1)
          ) as position
      ) as u(role_id, position)
     on conflict do nothing
    returning *;
$_$;


--
-- Name: mod_logs; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.mod_logs (
    guild_id bigint NOT NULL,
    case_id bigint NOT NULL,
    action text NOT NULL,
    action_time timestamp without time zone NOT NULL,
    pending boolean NOT NULL,
    user_id bigint NOT NULL,
    user_tag text NOT NULL,
    executor_id bigint,
    reason text,
    msg_id bigint,
    attachments text[] DEFAULT '{}'::text[] NOT NULL
);


--
-- Name: bulk_delete_mod_log(bigint, bigint, bigint); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.bulk_delete_mod_log(guild_id bigint, start_case_id bigint, end_case_id bigint) RETURNS SETOF app_public.mod_logs
    LANGUAGE sql STRICT
    AS $_$
  delete from app_public.mod_logs
  where guild_id = $1
    and case_id >= $2 -- start_case_id
    and case_id <= $3 -- end_case_id
  returning *;
$_$;


--
-- Name: bulk_update_mod_log_reason(bigint, bigint, bigint, bigint, text, boolean); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.bulk_update_mod_log_reason(guild_id bigint, start_case_id bigint, end_case_id bigint, executor_id bigint, reason text, only_empty_reason boolean DEFAULT false) RETURNS SETOF app_public.mod_logs
    LANGUAGE sql STRICT
    AS $_$
  update app_public.mod_logs
    set
      reason = $5,
      executor_id = $4
  where guild_id = $1
    -- ignore pending cases
    and pending = false
    and case_id >= $2 -- start_case_id
    and case_id <= $3 -- end_case_id
    -- only modify cases without reason if only_empty_reason is true
    -- only_empty_reason: true - (reason is null)
    and (not $6 or reason is null)
  returning *;
$_$;


--
-- Name: current_session_id(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.current_session_id() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select nullif(pg_catalog.current_setting('jwt.claims.session_id', true), '')::uuid;
$$;


--
-- Name: FUNCTION current_session_id(); Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON FUNCTION app_public.current_session_id() IS 'Handy method to get the current session ID.';


--
-- Name: current_user(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public."current_user"() RETURNS app_public.web_users
    LANGUAGE sql STABLE
    AS $$
  select web_users.*
    from app_public.web_users
   where id = app_public.current_user_id();
$$;


--
-- Name: FUNCTION "current_user"(); Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON FUNCTION app_public."current_user"() IS 'The currently logged in user (or null if not logged in).';


--
-- Name: current_user_discord_id(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.current_user_discord_id() RETURNS bigint
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'pg_catalog', 'public', 'pg_temp'
    AS $$
    -- PostgREST format
    select nullif(pg_catalog.current_setting('request.jwt.claim.discord_user_id', true), '')::bigint;
$$;


--
-- Name: current_user_id(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.current_user_id() RETURNS bigint
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'pg_catalog', 'public', 'pg_temp'
    AS $$
  select user_id
    from app_private.sessions
   where uuid = app_public.current_session_id();
$$;


--
-- Name: FUNCTION current_user_id(); Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON FUNCTION app_public.current_user_id() IS 'Handy method to get the current user ID for use in RLS policies, etc; in GraphQL, use `currentUser{id}` instead.';


--
-- Name: current_user_managed_guild_ids(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.current_user_managed_guild_ids() RETURNS SETOF bigint
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'pg_catalog', 'public', 'pg_temp'
    AS $$
  select guild_id
    from app_public.web_user_guilds
   where user_id = app_public.current_user_id()
     and manage_guild
      or owner;
$$;


--
-- Name: delete_messages_before(timestamp without time zone); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.delete_messages_before(before timestamp without time zone) RETURNS bigint
    LANGUAGE sql
    AS $_$
  with deleted as (
    delete from app_public.messages
    where created < $1
    returning *
  )
  select count(*)
  from deleted
$_$;


--
-- Name: delete_role_menu_roles(bigint, text, bigint[]); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.delete_role_menu_roles(guild_id bigint, menu_name text, role_ids bigint[]) RETURNS SETOF app_public.role_menu_roles
    LANGUAGE sql
    AS $_$
  delete from app_public.role_menu_roles
      where guild_id = $1
        and menu_name = $2
        and role_id = any($3)
  returning *;
$_$;


--
-- Name: get_eligible_level_roles(bigint, bigint[]); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.get_eligible_level_roles(guild_id bigint, user_ids bigint[]) RETURNS SETOF app_public.eligible_level_role
    LANGUAGE sql STABLE
    AS $_$
  select user_id, array_agg(role_id) as role_ids
    from app_public.user_levels
    join app_public.level_roles
      on app_public.user_levels.guild_id = app_public.level_roles.guild_id
    where app_public.user_levels.guild_id = $1
      -- Only find roles that are eligible to be added
      and app_public.user_levels.level >= app_public.level_roles.add_level
      and (
        -- remove_level is optional
        app_public.level_roles.remove_level is null
        or
        app_public.user_levels.level <  app_public.level_roles.remove_level
      )
      and (
        -- user_ids is optional
        $2 is null
        or
        app_public.user_levels.user_id = any($2)
      )
    group by user_id;
$_$;


--
-- Name: graphql(text, text, jsonb, jsonb); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.graphql("operationName" text DEFAULT NULL::text, query text DEFAULT NULL::text, variables jsonb DEFAULT NULL::jsonb, extensions jsonb DEFAULT NULL::jsonb) RETURNS jsonb
    LANGUAGE sql
    AS $$
    select graphql.resolve(
        query := query,
        variables := coalesce(variables, '{}'),
        "operationName" := "operationName",
        extensions := extensions
    );
$$;


--
-- Name: logout(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.logout() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_catalog', 'public', 'pg_temp'
    AS $$
begin
  -- Delete the session
  delete from app_private.sessions
        where uuid = app_public.current_session_id();
  -- Clear the identifier from the transaction
  perform set_config('jwt.claims.session_id', '', true);
end;
$$;


--
-- Name: next_case_id(bigint); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.next_case_id(guild_id bigint) RETURNS bigint
    LANGUAGE sql IMMUTABLE
    AS $$
  select coalesce(max(case_id), 0) + 1 from app_public.mod_logs where guild_id = guild_id;
$$;


--
-- Name: notifications_starting_with(bigint, text); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.notifications_starting_with(user_id bigint, query text) RETURNS SETOF text
    LANGUAGE sql IMMUTABLE
    AS $$
  select keyword
    from app_public.notifications
   where user_id = user_id
         and keyword like query || '%'
  order by keyword;
$$;


--
-- Name: tags; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.tags (
    owner_id bigint NOT NULL,
    guild_id bigint NOT NULL,
    tag_name text NOT NULL,
    content text NOT NULL,
    use_count bigint NOT NULL,
    created timestamp without time zone NOT NULL,
    attachment text
);


--
-- Name: random_tag(bigint, text, boolean, bigint); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.random_tag(guild_id bigint, query text, starts_with boolean, owner_id bigint) RETURNS app_public.tags
    LANGUAGE sql IMMUTABLE
    AS $$
  select *
    from app_public.tags
   where guild_id = random_tag.guild_id
         -- query is **not** required, query is either starts with or contains
         and (
           -- if query not provided
           (query is null or starts_with is null)
           or
           -- query starts with
           (query is not null and starts_with and tag_name like query || '%')
           or
           -- query contains
           (query is not null and not starts_with and tag_name like '%' || query || '%')
         )
         -- owner_id is optional
         and (random_tag.owner_id is null or owner_id = random_tag.owner_id)
    -- requires seq scan, not optimized
    order by random()
    limit 1;
$$;


--
-- Name: search_mod_logs(bigint, bigint, integer); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.search_mod_logs(guild_id bigint, search_case_id bigint, max_results integer DEFAULT 25) RETURNS SETOF app_public.mod_logs
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
  select *
    from app_public.mod_logs
  where guild_id = $1
    -- ignore pending cases
    and pending = false
    -- starts_with search for case_id
    and case_id::text like $2 || '%'
  order by
    -- sort by case_id desc so that the most recent case is first
    case_id desc
  limit $3;
$_$;


--
-- Name: set_role_menu_role_order(bigint, text, bigint[]); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.set_role_menu_role_order(guild_id bigint, menu_name text, role_ids bigint[]) RETURNS SETOF app_public.role_menu_roles
    LANGUAGE sql
    AS $$
  update app_public.role_menu_roles
    set position = u.position
    from (select
            unnest(role_ids) as role_id,
            generate_series(1, array_length(role_ids, 1)) as position
          ) as u(role_id, position)
    where app_public.role_menu_roles.role_id = u.role_id
    -- need to return only the role_menu_roles table, and not the temporary u table
    returning app_public.role_menu_roles.*;
$$;


--
-- Name: timeframe_user_levels(app_hidden.level_timeframe, bigint); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.timeframe_user_levels(timeframe app_hidden.level_timeframe, guild_id bigint DEFAULT NULL::bigint) RETURNS TABLE(user_id bigint, avatar_url text, username text, discriminator integer, xp bigint, xp_diff bigint, current_level bigint, gained_levels bigint, next_level_xp_required bigint, next_level_xp_progress bigint)
    LANGUAGE sql STABLE
    AS $$
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
$$;


--
-- Name: FUNCTION timeframe_user_levels(timeframe app_hidden.level_timeframe, guild_id bigint); Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON FUNCTION app_public.timeframe_user_levels(timeframe app_hidden.level_timeframe, guild_id bigint) IS 'Leaderboard for given timeframe and optional guild. If guild is null, it is the global leaderboard';


--
-- Name: update_user_xp(bigint, bigint, bigint, bigint[]); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.update_user_xp(guild_id bigint, channel_id bigint, user_id bigint, role_ids bigint[]) RETURNS app_public.user_xp_update_result
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_catalog', 'public', 'app_public', 'pg_temp'
    AS $_$
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
            -- Fix using msg_week instead of msg_month
            then app_public.user_levels.msg_week + 5
          else 5
        end
      ),
      msg_day = (
        case
          when extract(DAY  from app_public.user_levels.last_msg) = extract(DAY  from now())
           and extract(YEAR from app_public.user_levels.last_msg) = extract(YEAR from now())
            then app_public.user_levels.msg_day + 5
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

  -- new_level will be null if the user was not updated.
  -- If the user is updated, new_level could be the same as old_level if the
  -- user did not level up
  if new_level is null then
    raise notice 'user % in guild % was not updated (already gained xp within last minute)', $3, $1;

    return (old_level, new_level, '{}'::bigint[], '{}'::bigint[]);
  end if;

  raise notice 'added xp for member %: new_level %, old_level %', user_id, new_level, old_level;

  -- Log level ups but still continue if user did not level up
  if new_level != old_level then
    raise notice 'user % in guild % leveled up from % to %', $3, $1, old_level, new_level;
  end if;

  -- Eligible roles
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
      app_public.level_roles.add_level <= new_level
      and
      -- Don't add level roles that should be removed
      (
        app_public.level_roles.remove_level is null
        or
        app_public.level_roles.remove_level > new_level
      );

  -- Remove roles, do not need to check for if add_level is < since remove_level
  -- should be greater than add_level
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
      app_public.level_roles.remove_level < new_level;

  return (old_level, new_level, add_role_ids, remove_role_ids);
end;
$_$;


--
-- Name: user_guild_rank(bigint, bigint); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.user_guild_rank(guild_id bigint, user_id bigint) RETURNS app_public.user_guild_rank_result
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  select user_id,
         guild_id,
         msg_all_time,
         msg_month,
         msg_week,
         msg_day,
         last_msg,
         msg_all_time_rank,
         msg_all_time_total,
         msg_month_rank,
         msg_month_total,
         msg_week_rank,
         msg_week_total,
         msg_day_rank,
         msg_day_total
      from (
          select *,
              row_number() over(
                  partition by extract(doy from last_msg),
                                extract(year from last_msg)
                                order by msg_day desc
              ) as msg_day_rank,
              (
                  select count(*)
                    from app_public.user_levels
                    where extract(doy  from last_msg) = extract(doy  from now())
                      and extract(year from last_msg) = extract(year from now())
                      and guild_id = guild_id
              ) as msg_day_total,

              row_number() over(
                  partition by extract(week from last_msg),
                                extract(year from last_msg)
                                order by msg_week desc
              ) as msg_week_rank,
              (
                  select count(*)
                    from app_public.user_levels
                    where extract(week from last_msg) = extract(week from now())
                      and extract(year from last_msg) = extract(year from now())
                      and guild_id = guild_id
              ) as msg_week_total,

              row_number() over(
                  partition by extract(month from last_msg),
                                extract(year from last_msg)
                                order by msg_month desc
              ) as msg_month_rank,
              (
                  select count(*)
                    from app_public.user_levels
                    where extract(month from last_msg) = extract(month from now())
                      and extract(year  from last_msg) = extract(year  from now())
                      and guild_id = guild_id
              ) as msg_month_total,

              row_number() over(order by msg_all_time desc) as msg_all_time_rank,
              count(*) over() as msg_all_time_total
          from app_public.user_levels where guild_id = guild_id
      ) t
  where t.user_id = user_id
  limit 1;
$$;


--
-- Name: notify_watchers_ddl(); Type: FUNCTION; Schema: postgraphile_watch; Owner: -
--

CREATE FUNCTION postgraphile_watch.notify_watchers_ddl() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
begin
  perform pg_notify(
    'postgraphile_watch',
    json_build_object(
      'type',
      'ddl',
      'payload',
      (select json_agg(json_build_object('schema', schema_name, 'command', command_tag)) from pg_event_trigger_ddl_commands() as x)
    )::text
  );
end;
$$;


--
-- Name: notify_watchers_drop(); Type: FUNCTION; Schema: postgraphile_watch; Owner: -
--

CREATE FUNCTION postgraphile_watch.notify_watchers_drop() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
begin
  perform pg_notify(
    'postgraphile_watch',
    json_build_object(
      'type',
      'drop',
      'payload',
      (select json_agg(distinct x.schema_name) from pg_event_trigger_dropped_objects() as x)
    )::text
  );
end;
$$;


--
-- Name: graphql(text, text, jsonb, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.graphql("operationName" text DEFAULT NULL::text, query text DEFAULT NULL::text, variables jsonb DEFAULT NULL::jsonb, extensions jsonb DEFAULT NULL::jsonb) RETURNS jsonb
    LANGUAGE sql
    AS $$
    select graphql.resolve(
        query := query,
        variables := coalesce(variables, '{}'),
        "operationName" := "operationName",
        extensions := extensions
    );
$$;


--
-- Name: snowflake_now(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.snowflake_now() RETURNS bigint
    LANGUAGE sql STABLE
    AS $$
  select (extract(epoch from now())::bigint * 1000 - 1420070400000) << 22
$$;


--
-- Name: failures; Type: TABLE; Schema: app_hidden; Owner: -
--

CREATE TABLE app_hidden.failures (
    failure_id text NOT NULL,
    max_attempts integer DEFAULT 25 NOT NULL,
    attempt_count integer NOT NULL,
    last_attempt timestamp without time zone NOT NULL,
    next_attempt timestamp without time zone GENERATED ALWAYS AS ((last_attempt + (exp((LEAST(10, attempt_count))::double precision) * '00:00:01'::interval))) STORED NOT NULL
);


--
-- Name: sessions; Type: TABLE; Schema: app_private; Owner: -
--

CREATE TABLE app_private.sessions (
    uuid uuid DEFAULT public.gen_random_uuid() NOT NULL,
    user_id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    last_active timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_authentication_secrets; Type: TABLE; Schema: app_private; Owner: -
--

CREATE TABLE app_private.user_authentication_secrets (
    user_id bigint NOT NULL,
    details jsonb DEFAULT '{}'::jsonb NOT NULL
);


--
-- Name: bot_stats; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.bot_stats (
    name text NOT NULL,
    category text NOT NULL,
    count bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: cached_guilds; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.cached_guilds (
    id bigint NOT NULL,
    name text NOT NULL,
    icon text,
    splash text,
    banner text,
    features text[] DEFAULT '{}'::text[] NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE cached_guilds; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.cached_guilds IS '@omit all,filter';


--
-- Name: cached_users; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.cached_users (
    id bigint NOT NULL,
    avatar_url text NOT NULL,
    name text NOT NULL,
    discriminator integer NOT NULL,
    last_checked timestamp without time zone NOT NULL
);


--
-- Name: TABLE cached_users; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.cached_users IS '@omit all,filter';


--
-- Name: emoji_sticker_stats; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.emoji_sticker_stats (
    "time" timestamp(0) without time zone DEFAULT date_trunc('day'::text, timezone('utc'::text, now())) NOT NULL,
    guild_id bigint NOT NULL,
    asset_id bigint NOT NULL,
    action_type app_public.emoji_sticker_action_type NOT NULL,
    count bigint NOT NULL,
    count_external bigint DEFAULT 0 NOT NULL,
    CONSTRAINT emoji_sticker_stats_time_check CHECK (("time" = date_trunc('day'::text, "time")))
);


--
-- Name: emoji_sticker_stats_rate_limits; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.emoji_sticker_stats_rate_limits (
    user_id bigint NOT NULL,
    asset_id bigint NOT NULL,
    action_type app_public.emoji_sticker_action_type NOT NULL,
    last_used timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: feed_items; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.feed_items (
    feed_id text NOT NULL,
    item_id text NOT NULL
);


--
-- Name: feed_subscriptions; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.feed_subscriptions (
    feed_id text NOT NULL,
    guild_id bigint NOT NULL,
    channel_id bigint NOT NULL,
    mention_role bigint
);


--
-- Name: feeds; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.feeds (
    feed_id text NOT NULL,
    metadata jsonb
);


--
-- Name: guild_bans; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.guild_bans (
    guild_id bigint NOT NULL,
    user_id bigint NOT NULL
);


--
-- Name: guild_configs; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.guild_configs (
    id bigint NOT NULL,
    prefix text,
    join_msg text,
    join_msg_enabled boolean DEFAULT true NOT NULL,
    join_react text,
    leave_msg text,
    leave_msg_enabled boolean DEFAULT true NOT NULL,
    msg_channel bigint,
    role_channel bigint,
    role_config jsonb,
    role_enabled boolean DEFAULT true NOT NULL,
    log_msg bigint,
    log_msg_enabled boolean DEFAULT true NOT NULL,
    log_mod bigint,
    log_mod_enabled boolean DEFAULT true NOT NULL,
    log_member bigint,
    log_member_enabled boolean DEFAULT true NOT NULL,
    mute_dm_text text,
    mute_dm_enabled boolean DEFAULT true NOT NULL,
    warn_dm_text text,
    warn_dm_enabled boolean DEFAULT true NOT NULL,
    disabled_channels bigint[],
    data jsonb DEFAULT '{}'::jsonb NOT NULL,
    lookup_details_opt_in boolean DEFAULT false NOT NULL,
    lookup_prompted boolean DEFAULT false NOT NULL
);


--
-- Name: TABLE guild_configs; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.guild_configs IS '@foreignKey (id) references app_public.cached_guilds (id)';


--
-- Name: guild_emojis_and_stickers; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.guild_emojis_and_stickers (
    id bigint NOT NULL,
    guild_id bigint NOT NULL,
    name text NOT NULL,
    type app_public.guild_asset_type NOT NULL
);


--
-- Name: level_role_apply_jobs; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.level_role_apply_jobs (
    guild_id bigint NOT NULL,
    interaction_id bigint NOT NULL,
    notify_user_id bigint NOT NULL,
    channel_id bigint NOT NULL,
    message_id bigint NOT NULL,
    requests_total bigint,
    requests_processed bigint DEFAULT 0 NOT NULL,
    members_total bigint NOT NULL,
    members_skipped bigint DEFAULT 0 NOT NULL,
    members_applied bigint DEFAULT 0 NOT NULL,
    members_not_found bigint DEFAULT 0 NOT NULL,
    members_total_processed bigint GENERATED ALWAYS AS (((members_skipped + members_applied) + members_not_found)) STORED NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: level_role_overrides; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.level_role_overrides (
    guild_id bigint NOT NULL,
    role_id bigint NOT NULL,
    user_id bigint NOT NULL,
    type app_public.level_role_override_type NOT NULL
);


--
-- Name: level_roles; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.level_roles (
    guild_id bigint NOT NULL,
    role_id bigint NOT NULL,
    add_level bigint,
    remove_level bigint,
    CONSTRAINT chk_add_before_remove CHECK ((add_level < remove_level)),
    CONSTRAINT chk_at_least_one_level CHECK ((num_nonnulls(add_level, remove_level) >= 1))
);


--
-- Name: members; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.members (
    guild_id bigint NOT NULL,
    user_id bigint NOT NULL,
    join_time timestamp without time zone NOT NULL
);


--
-- Name: messages; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.messages (
    message_id bigint NOT NULL,
    author_id bigint NOT NULL,
    channel_id bigint NOT NULL,
    guild_id bigint NOT NULL,
    created timestamp without time zone NOT NULL,
    content text NOT NULL,
    msg jsonb NOT NULL
);


--
-- Name: msg_log_blocks; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.msg_log_blocks (
    guild_id bigint NOT NULL,
    channel_id bigint NOT NULL,
    block_type app_public.msg_log_block_type NOT NULL
);


--
-- Name: mutes; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.mutes (
    guild_id bigint NOT NULL,
    user_id bigint NOT NULL,
    start_time timestamp without time zone NOT NULL,
    end_time timestamp without time zone,
    pending boolean DEFAULT false NOT NULL,
    case_id bigint
);


--
-- Name: notifications; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.notifications (
    user_id bigint NOT NULL,
    guild_id bigint NOT NULL,
    keyword text NOT NULL
);


--
-- Name: reminders; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.reminders (
    user_id bigint NOT NULL,
    description text NOT NULL,
    set_at timestamp without time zone NOT NULL,
    expire_at timestamp without time zone NOT NULL
);


--
-- Name: role_menus; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.role_menus (
    guild_id bigint NOT NULL,
    menu_name text NOT NULL,
    description text,
    max_count integer,
    required_role bigint
);


--
-- Name: user_levels; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.user_levels (
    user_id bigint NOT NULL,
    guild_id bigint NOT NULL,
    msg_all_time bigint NOT NULL,
    msg_month bigint NOT NULL,
    msg_week bigint NOT NULL,
    msg_day bigint NOT NULL,
    last_msg timestamp without time zone NOT NULL,
    level bigint GENERATED ALWAYS AS (app_hidden.level_from_xp(msg_all_time)) STORED NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.users (
    id bigint NOT NULL,
    is_patron boolean NOT NULL,
    patron_emoji text,
    rep bigint NOT NULL,
    fishies bigint NOT NULL,
    last_rep timestamp without time zone,
    last_fishies timestamp without time zone,
    lastfm_username text,
    profile_data jsonb
);


--
-- Name: web_user_guilds; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.web_user_guilds (
    user_id bigint NOT NULL,
    guild_id bigint NOT NULL,
    owner boolean NOT NULL,
    permissions bigint NOT NULL,
    manage_guild boolean GENERATED ALWAYS AS (((permissions & ('00000000000000000000000000100000'::"bit")::bigint) = ('00000000000000000000000000100000'::"bit")::bigint)) STORED
);


--
-- Name: TABLE web_user_guilds; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.web_user_guilds IS '@foreignKey (user_id) references app_public.web_users (id)
@foreignKey (guild_id) references app_public.cached_guilds (id)';


--
-- Name: xp_blocks; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.xp_blocks (
    guild_id bigint NOT NULL,
    block_id bigint NOT NULL,
    block_type app_public.block_type NOT NULL
);


--
-- Name: failures failures_pkey; Type: CONSTRAINT; Schema: app_hidden; Owner: -
--

ALTER TABLE ONLY app_hidden.failures
    ADD CONSTRAINT failures_pkey PRIMARY KEY (failure_id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: app_private; Owner: -
--

ALTER TABLE ONLY app_private.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (uuid);


--
-- Name: user_authentication_secrets user_authentication_secrets_pkey; Type: CONSTRAINT; Schema: app_private; Owner: -
--

ALTER TABLE ONLY app_private.user_authentication_secrets
    ADD CONSTRAINT user_authentication_secrets_pkey PRIMARY KEY (user_id);


--
-- Name: bot_stats bot_stats_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.bot_stats
    ADD CONSTRAINT bot_stats_pkey PRIMARY KEY (name, category);


--
-- Name: cached_guilds cached_guilds_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.cached_guilds
    ADD CONSTRAINT cached_guilds_pkey PRIMARY KEY (id);


--
-- Name: cached_users cached_users_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.cached_users
    ADD CONSTRAINT cached_users_pkey PRIMARY KEY (id);


--
-- Name: emoji_sticker_stats emoji_sticker_stats_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.emoji_sticker_stats
    ADD CONSTRAINT emoji_sticker_stats_pkey PRIMARY KEY ("time", asset_id, action_type);


--
-- Name: emoji_sticker_stats_rate_limits emoji_sticker_stats_rate_limits_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.emoji_sticker_stats_rate_limits
    ADD CONSTRAINT emoji_sticker_stats_rate_limits_pkey PRIMARY KEY (user_id, action_type, asset_id);


--
-- Name: feed_items feed_items_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.feed_items
    ADD CONSTRAINT feed_items_pkey PRIMARY KEY (feed_id, item_id);


--
-- Name: feed_subscriptions feed_subscriptions_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.feed_subscriptions
    ADD CONSTRAINT feed_subscriptions_pkey PRIMARY KEY (feed_id, channel_id);


--
-- Name: feeds feeds_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.feeds
    ADD CONSTRAINT feeds_pkey PRIMARY KEY (feed_id);


--
-- Name: guild_bans guild_bans_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.guild_bans
    ADD CONSTRAINT guild_bans_pkey PRIMARY KEY (guild_id, user_id);


--
-- Name: guild_configs guild_configs_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.guild_configs
    ADD CONSTRAINT guild_configs_pkey PRIMARY KEY (id);


--
-- Name: guild_emojis_and_stickers guild_emojis_and_stickers_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.guild_emojis_and_stickers
    ADD CONSTRAINT guild_emojis_and_stickers_pkey PRIMARY KEY (id);


--
-- Name: level_role_apply_jobs level_role_apply_jobs_interaction_id_key; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.level_role_apply_jobs
    ADD CONSTRAINT level_role_apply_jobs_interaction_id_key UNIQUE (interaction_id);


--
-- Name: level_role_apply_jobs level_role_apply_jobs_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.level_role_apply_jobs
    ADD CONSTRAINT level_role_apply_jobs_pkey PRIMARY KEY (guild_id);


--
-- Name: level_role_overrides level_role_overrides_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.level_role_overrides
    ADD CONSTRAINT level_role_overrides_pkey PRIMARY KEY (guild_id, role_id, user_id);


--
-- Name: level_roles level_roles_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.level_roles
    ADD CONSTRAINT level_roles_pkey PRIMARY KEY (guild_id, role_id);


--
-- Name: members members_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.members
    ADD CONSTRAINT members_pkey PRIMARY KEY (guild_id, user_id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (message_id);


--
-- Name: mod_logs mod_logs_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.mod_logs
    ADD CONSTRAINT mod_logs_pkey PRIMARY KEY (guild_id, case_id);


--
-- Name: msg_log_blocks msg_log_blocks_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.msg_log_blocks
    ADD CONSTRAINT msg_log_blocks_pkey PRIMARY KEY (guild_id, channel_id);


--
-- Name: mutes mutes_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.mutes
    ADD CONSTRAINT mutes_pkey PRIMARY KEY (guild_id, user_id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (user_id, guild_id, keyword);


--
-- Name: reminders reminders_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.reminders
    ADD CONSTRAINT reminders_pkey PRIMARY KEY (user_id, set_at);


--
-- Name: role_menu_roles role_menu_roles_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.role_menu_roles
    ADD CONSTRAINT role_menu_roles_pkey PRIMARY KEY (guild_id, menu_name, role_id);


--
-- Name: role_menus role_menus_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.role_menus
    ADD CONSTRAINT role_menus_pkey PRIMARY KEY (guild_id, menu_name);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (guild_id, tag_name);


--
-- Name: user_levels user_levels_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.user_levels
    ADD CONSTRAINT user_levels_pkey PRIMARY KEY (user_id, guild_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: web_user_guilds web_user_guilds_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.web_user_guilds
    ADD CONSTRAINT web_user_guilds_pkey PRIMARY KEY (user_id, guild_id);


--
-- Name: web_users web_users_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.web_users
    ADD CONSTRAINT web_users_pkey PRIMARY KEY (id);


--
-- Name: xp_blocks xp_blocks_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.xp_blocks
    ADD CONSTRAINT xp_blocks_pkey PRIMARY KEY (guild_id, block_id);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: app_private; Owner: -
--

CREATE INDEX sessions_user_id_idx ON app_private.sessions USING btree (user_id);


--
-- Name: bot_stats_category_idx; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX bot_stats_category_idx ON app_public.bot_stats USING btree (category);


--
-- Name: emoji_sticker_stats_rate_limits_idx_last_used; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX emoji_sticker_stats_rate_limits_idx_last_used ON app_public.emoji_sticker_stats_rate_limits USING btree (last_used);


--
-- Name: guild_bans_user_id_idx; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX guild_bans_user_id_idx ON app_public.guild_bans USING btree (user_id);


--
-- Name: idx_action_type; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_action_type ON app_public.emoji_sticker_stats USING btree (action_type, "time");


--
-- Name: idx_by_guild_emojis; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_by_guild_emojis ON app_public.emoji_sticker_stats USING btree (asset_id);


--
-- Name: level_roles_guild_id_add_level_idx; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX level_roles_guild_id_add_level_idx ON app_public.level_roles USING btree (guild_id, add_level);


--
-- Name: level_roles_guild_id_remove_level_idx; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX level_roles_guild_id_remove_level_idx ON app_public.level_roles USING btree (guild_id, remove_level);


--
-- Name: messages_created_idx; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX messages_created_idx ON app_public.messages USING btree (created);


--
-- Name: notification_guild_id_idx; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX notification_guild_id_idx ON app_public.notifications USING btree (guild_id);


--
-- Name: notification_keyword_idx; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX notification_keyword_idx ON app_public.notifications USING btree (keyword);


--
-- Name: notifications_user_id_idx; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX notifications_user_id_idx ON app_public.notifications USING btree (user_id);


--
-- Name: rolemenu_guildid_idx; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX rolemenu_guildid_idx ON app_public.role_menus USING btree (guild_id);


--
-- Name: rolemenu_name_idx; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX rolemenu_name_idx ON app_public.role_menus USING btree (menu_name text_pattern_ops);


--
-- Name: tag_name_idx; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX tag_name_idx ON app_public.tags USING gin (tag_name public.gin_trgm_ops);


--
-- Name: web_user_guilds_guild_id_idx; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX web_user_guilds_guild_id_idx ON app_public.web_user_guilds USING btree (guild_id);


--
-- Name: web_user_guilds_user_id_idx; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX web_user_guilds_user_id_idx ON app_public.web_user_guilds USING btree (user_id);


--
-- Name: bot_stats _100_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_timestamps BEFORE INSERT OR UPDATE ON app_public.bot_stats FOR EACH ROW EXECUTE FUNCTION app_private.tg__timestamps();


--
-- Name: cached_guilds _100_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_timestamps BEFORE INSERT OR UPDATE ON app_public.cached_guilds FOR EACH ROW EXECUTE FUNCTION app_private.tg__timestamps();


--
-- Name: level_role_apply_jobs _100_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_timestamps BEFORE INSERT OR UPDATE ON app_public.level_role_apply_jobs FOR EACH ROW EXECUTE FUNCTION app_private.tg__timestamps();


--
-- Name: web_users _100_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_timestamps BEFORE INSERT OR UPDATE ON app_public.web_users FOR EACH ROW EXECUTE FUNCTION app_private.tg__timestamps();


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: app_private; Owner: -
--

ALTER TABLE ONLY app_private.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES app_public.web_users(id) ON DELETE CASCADE;


--
-- Name: user_authentication_secrets user_authentication_secrets_user_id_fkey; Type: FK CONSTRAINT; Schema: app_private; Owner: -
--

ALTER TABLE ONLY app_private.user_authentication_secrets
    ADD CONSTRAINT user_authentication_secrets_user_id_fkey FOREIGN KEY (user_id) REFERENCES app_public.web_users(id) ON DELETE CASCADE;


--
-- Name: feed_subscriptions fk_feed_subscription_feed_id; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.feed_subscriptions
    ADD CONSTRAINT fk_feed_subscription_feed_id FOREIGN KEY (feed_id) REFERENCES app_public.feeds(feed_id) ON DELETE CASCADE;


--
-- Name: mutes fk_mod_action; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.mutes
    ADD CONSTRAINT fk_mod_action FOREIGN KEY (guild_id, case_id) REFERENCES app_public.mod_logs(guild_id, case_id);


--
-- Name: role_menu_roles role_menu_roles_guild_id_menu_name_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.role_menu_roles
    ADD CONSTRAINT role_menu_roles_guild_id_menu_name_fkey FOREIGN KEY (guild_id, menu_name) REFERENCES app_public.role_menus(guild_id, menu_name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sessions; Type: ROW SECURITY; Schema: app_private; Owner: -
--

ALTER TABLE app_private.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: user_authentication_secrets; Type: ROW SECURITY; Schema: app_private; Owner: -
--

ALTER TABLE app_private.user_authentication_secrets ENABLE ROW LEVEL SECURITY;

--
-- Name: guild_configs admin_access; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY admin_access ON app_public.guild_configs TO sushii_admin USING (true);


--
-- Name: level_roles admin_access; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY admin_access ON app_public.level_roles TO sushii_admin USING (true);


--
-- Name: mod_logs admin_access; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY admin_access ON app_public.mod_logs TO sushii_admin USING (true);


--
-- Name: mutes admin_access; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY admin_access ON app_public.mutes TO sushii_admin USING (true);


--
-- Name: notifications admin_access; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY admin_access ON app_public.notifications TO sushii_admin USING (true);


--
-- Name: reminders admin_access; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY admin_access ON app_public.reminders TO sushii_admin USING (true);


--
-- Name: role_menu_roles admin_access; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY admin_access ON app_public.role_menu_roles TO sushii_admin USING (true);


--
-- Name: role_menus admin_access; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY admin_access ON app_public.role_menus TO sushii_admin USING (true);


--
-- Name: tags admin_access; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY admin_access ON app_public.tags TO sushii_admin USING (true);


--
-- Name: user_levels admin_access; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY admin_access ON app_public.user_levels TO sushii_admin USING (true);


--
-- Name: users admin_access; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY admin_access ON app_public.users TO sushii_admin USING (true);


--
-- Name: xp_blocks admin_access; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY admin_access ON app_public.xp_blocks TO sushii_admin USING (true);


--
-- Name: bot_stats; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.bot_stats ENABLE ROW LEVEL SECURITY;

--
-- Name: cached_guilds; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.cached_guilds ENABLE ROW LEVEL SECURITY;

--
-- Name: cached_users; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.cached_users ENABLE ROW LEVEL SECURITY;

--
-- Name: guild_configs; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.guild_configs ENABLE ROW LEVEL SECURITY;

--
-- Name: level_roles; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.level_roles ENABLE ROW LEVEL SECURITY;

--
-- Name: mod_logs; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.mod_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: mutes; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.mutes ENABLE ROW LEVEL SECURITY;

--
-- Name: role_menu_roles; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.role_menu_roles ENABLE ROW LEVEL SECURITY;

--
-- Name: role_menus; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.role_menus ENABLE ROW LEVEL SECURITY;

--
-- Name: cached_guilds select_all; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY select_all ON app_public.cached_guilds FOR SELECT USING (true);


--
-- Name: cached_users select_all; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY select_all ON app_public.cached_users FOR SELECT USING (true);


--
-- Name: tags select_all; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY select_all ON app_public.tags FOR SELECT USING (true);


--
-- Name: user_levels select_all; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY select_all ON app_public.user_levels FOR SELECT USING (true);


--
-- Name: guild_configs select_managed_guild; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY select_managed_guild ON app_public.guild_configs FOR SELECT USING ((id IN ( SELECT app_public.current_user_managed_guild_ids() AS current_user_managed_guild_ids)));


--
-- Name: web_users select_self; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY select_self ON app_public.web_users FOR SELECT USING ((id = app_public.current_user_id()));


--
-- Name: bot_stats select_stats; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY select_stats ON app_public.bot_stats FOR SELECT USING (true);


--
-- Name: web_user_guilds select_web_user_guilds; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY select_web_user_guilds ON app_public.web_user_guilds FOR SELECT USING ((manage_guild OR owner));


--
-- Name: tags; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.tags ENABLE ROW LEVEL SECURITY;

--
-- Name: guild_configs update_managed_guild; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY update_managed_guild ON app_public.guild_configs FOR UPDATE USING ((id IN ( SELECT app_public.current_user_managed_guild_ids() AS current_user_managed_guild_ids)));


--
-- Name: web_users update_self; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY update_self ON app_public.web_users FOR UPDATE USING ((id = app_public.current_user_id()));


--
-- Name: user_levels; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.user_levels ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.users ENABLE ROW LEVEL SECURITY;

--
-- Name: web_user_guilds; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.web_user_guilds ENABLE ROW LEVEL SECURITY;

--
-- Name: web_users; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.web_users ENABLE ROW LEVEL SECURITY;

--
-- Name: xp_blocks; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.xp_blocks ENABLE ROW LEVEL SECURITY;

--
-- Name: SCHEMA app_hidden; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA app_hidden TO sushii_visitor;
GRANT USAGE ON SCHEMA app_hidden TO sushii_admin;


--
-- Name: SCHEMA app_public; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA app_public TO sushii_visitor;
GRANT USAGE ON SCHEMA app_public TO sushii_admin;


--
-- Name: FUNCTION level_from_xp(xp bigint); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.level_from_xp(xp bigint) FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.level_from_xp(xp bigint) TO sushii_visitor;


--
-- Name: FUNCTION total_xp_from_level(level bigint); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.total_xp_from_level(level bigint) FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.total_xp_from_level(level bigint) TO sushii_visitor;


--
-- Name: FUNCTION user_levels_filtered(f_timeframe app_hidden.level_timeframe, f_guild_id bigint); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.user_levels_filtered(f_timeframe app_hidden.level_timeframe, f_guild_id bigint) FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.user_levels_filtered(f_timeframe app_hidden.level_timeframe, f_guild_id bigint) TO sushii_visitor;


--
-- Name: FUNCTION xp_from_level(level bigint); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.xp_from_level(level bigint) FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.xp_from_level(level bigint) TO sushii_visitor;


--
-- Name: TABLE web_users; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT ON TABLE app_public.web_users TO sushii_visitor;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.web_users TO sushii_admin;


--
-- Name: FUNCTION login_or_register_user(f_discord_user_id character varying, f_profile json, f_auth_details json); Type: ACL; Schema: app_private; Owner: -
--

REVOKE ALL ON FUNCTION app_private.login_or_register_user(f_discord_user_id character varying, f_profile json, f_auth_details json) FROM PUBLIC;


--
-- Name: FUNCTION register_user(f_discord_user_id character varying, f_profile json, f_auth_details json); Type: ACL; Schema: app_private; Owner: -
--

REVOKE ALL ON FUNCTION app_private.register_user(f_discord_user_id character varying, f_profile json, f_auth_details json) FROM PUBLIC;


--
-- Name: FUNCTION tg__timestamps(); Type: ACL; Schema: app_private; Owner: -
--

REVOKE ALL ON FUNCTION app_private.tg__timestamps() FROM PUBLIC;


--
-- Name: TABLE role_menu_roles; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.role_menu_roles TO sushii_admin;


--
-- Name: FUNCTION add_role_menu_roles(guild_id bigint, menu_name text, role_ids bigint[]); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.add_role_menu_roles(guild_id bigint, menu_name text, role_ids bigint[]) FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.add_role_menu_roles(guild_id bigint, menu_name text, role_ids bigint[]) TO sushii_visitor;
GRANT ALL ON FUNCTION app_public.add_role_menu_roles(guild_id bigint, menu_name text, role_ids bigint[]) TO sushii_admin;


--
-- Name: TABLE mod_logs; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.mod_logs TO sushii_admin;


--
-- Name: FUNCTION bulk_delete_mod_log(guild_id bigint, start_case_id bigint, end_case_id bigint); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.bulk_delete_mod_log(guild_id bigint, start_case_id bigint, end_case_id bigint) FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.bulk_delete_mod_log(guild_id bigint, start_case_id bigint, end_case_id bigint) TO sushii_visitor;
GRANT ALL ON FUNCTION app_public.bulk_delete_mod_log(guild_id bigint, start_case_id bigint, end_case_id bigint) TO sushii_admin;


--
-- Name: FUNCTION bulk_update_mod_log_reason(guild_id bigint, start_case_id bigint, end_case_id bigint, executor_id bigint, reason text, only_empty_reason boolean); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.bulk_update_mod_log_reason(guild_id bigint, start_case_id bigint, end_case_id bigint, executor_id bigint, reason text, only_empty_reason boolean) FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.bulk_update_mod_log_reason(guild_id bigint, start_case_id bigint, end_case_id bigint, executor_id bigint, reason text, only_empty_reason boolean) TO sushii_visitor;
GRANT ALL ON FUNCTION app_public.bulk_update_mod_log_reason(guild_id bigint, start_case_id bigint, end_case_id bigint, executor_id bigint, reason text, only_empty_reason boolean) TO sushii_admin;


--
-- Name: FUNCTION current_session_id(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.current_session_id() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.current_session_id() TO sushii_visitor;


--
-- Name: FUNCTION "current_user"(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public."current_user"() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public."current_user"() TO sushii_visitor;


--
-- Name: FUNCTION current_user_discord_id(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.current_user_discord_id() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.current_user_discord_id() TO sushii_visitor;


--
-- Name: FUNCTION current_user_id(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.current_user_id() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.current_user_id() TO sushii_visitor;


--
-- Name: FUNCTION current_user_managed_guild_ids(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.current_user_managed_guild_ids() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.current_user_managed_guild_ids() TO sushii_visitor;


--
-- Name: FUNCTION delete_messages_before(before timestamp without time zone); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.delete_messages_before(before timestamp without time zone) FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.delete_messages_before(before timestamp without time zone) TO sushii_visitor;
GRANT ALL ON FUNCTION app_public.delete_messages_before(before timestamp without time zone) TO sushii_admin;


--
-- Name: FUNCTION delete_role_menu_roles(guild_id bigint, menu_name text, role_ids bigint[]); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.delete_role_menu_roles(guild_id bigint, menu_name text, role_ids bigint[]) FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.delete_role_menu_roles(guild_id bigint, menu_name text, role_ids bigint[]) TO sushii_visitor;
GRANT ALL ON FUNCTION app_public.delete_role_menu_roles(guild_id bigint, menu_name text, role_ids bigint[]) TO sushii_admin;


--
-- Name: FUNCTION get_eligible_level_roles(guild_id bigint, user_ids bigint[]); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.get_eligible_level_roles(guild_id bigint, user_ids bigint[]) FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.get_eligible_level_roles(guild_id bigint, user_ids bigint[]) TO sushii_visitor;
GRANT ALL ON FUNCTION app_public.get_eligible_level_roles(guild_id bigint, user_ids bigint[]) TO sushii_admin;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO sushii_visitor;


--
-- Name: FUNCTION logout(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.logout() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.logout() TO sushii_visitor;


--
-- Name: FUNCTION next_case_id(guild_id bigint); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.next_case_id(guild_id bigint) FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.next_case_id(guild_id bigint) TO sushii_visitor;
GRANT ALL ON FUNCTION app_public.next_case_id(guild_id bigint) TO sushii_admin;


--
-- Name: FUNCTION notifications_starting_with(user_id bigint, query text); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.notifications_starting_with(user_id bigint, query text) FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.notifications_starting_with(user_id bigint, query text) TO sushii_visitor;
GRANT ALL ON FUNCTION app_public.notifications_starting_with(user_id bigint, query text) TO sushii_admin;


--
-- Name: TABLE tags; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT ON TABLE app_public.tags TO sushii_visitor;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.tags TO sushii_admin;


--
-- Name: FUNCTION random_tag(guild_id bigint, query text, starts_with boolean, owner_id bigint); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.random_tag(guild_id bigint, query text, starts_with boolean, owner_id bigint) FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.random_tag(guild_id bigint, query text, starts_with boolean, owner_id bigint) TO sushii_visitor;
GRANT ALL ON FUNCTION app_public.random_tag(guild_id bigint, query text, starts_with boolean, owner_id bigint) TO sushii_admin;


--
-- Name: FUNCTION search_mod_logs(guild_id bigint, search_case_id bigint, max_results integer); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.search_mod_logs(guild_id bigint, search_case_id bigint, max_results integer) FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.search_mod_logs(guild_id bigint, search_case_id bigint, max_results integer) TO sushii_visitor;
GRANT ALL ON FUNCTION app_public.search_mod_logs(guild_id bigint, search_case_id bigint, max_results integer) TO sushii_admin;


--
-- Name: FUNCTION set_role_menu_role_order(guild_id bigint, menu_name text, role_ids bigint[]); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.set_role_menu_role_order(guild_id bigint, menu_name text, role_ids bigint[]) FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.set_role_menu_role_order(guild_id bigint, menu_name text, role_ids bigint[]) TO sushii_visitor;
GRANT ALL ON FUNCTION app_public.set_role_menu_role_order(guild_id bigint, menu_name text, role_ids bigint[]) TO sushii_admin;


--
-- Name: FUNCTION timeframe_user_levels(timeframe app_hidden.level_timeframe, guild_id bigint); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.timeframe_user_levels(timeframe app_hidden.level_timeframe, guild_id bigint) FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.timeframe_user_levels(timeframe app_hidden.level_timeframe, guild_id bigint) TO sushii_visitor;


--
-- Name: FUNCTION user_guild_rank(guild_id bigint, user_id bigint); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.user_guild_rank(guild_id bigint, user_id bigint) FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.user_guild_rank(guild_id bigint, user_id bigint) TO sushii_visitor;
GRANT ALL ON FUNCTION app_public.user_guild_rank(guild_id bigint, user_id bigint) TO sushii_admin;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) FROM PUBLIC;
GRANT ALL ON FUNCTION public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO sushii_visitor;


--
-- Name: FUNCTION snowflake_now(); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.snowflake_now() FROM PUBLIC;
GRANT ALL ON FUNCTION public.snowflake_now() TO sushii_visitor;


--
-- Name: TABLE bot_stats; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT ON TABLE app_public.bot_stats TO sushii_visitor;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.bot_stats TO sushii_admin;


--
-- Name: TABLE cached_guilds; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT ON TABLE app_public.cached_guilds TO sushii_visitor;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.cached_guilds TO sushii_admin;


--
-- Name: TABLE cached_users; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT ON TABLE app_public.cached_users TO sushii_visitor;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.cached_users TO sushii_admin;


--
-- Name: TABLE emoji_sticker_stats; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.emoji_sticker_stats TO sushii_admin;


--
-- Name: TABLE emoji_sticker_stats_rate_limits; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.emoji_sticker_stats_rate_limits TO sushii_admin;


--
-- Name: TABLE feed_items; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.feed_items TO sushii_admin;


--
-- Name: TABLE feed_subscriptions; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.feed_subscriptions TO sushii_admin;


--
-- Name: TABLE feeds; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.feeds TO sushii_admin;


--
-- Name: TABLE guild_bans; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.guild_bans TO sushii_admin;


--
-- Name: TABLE guild_configs; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT ON TABLE app_public.guild_configs TO sushii_visitor;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.guild_configs TO sushii_admin;


--
-- Name: COLUMN guild_configs.prefix; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(prefix) ON TABLE app_public.guild_configs TO sushii_visitor;


--
-- Name: COLUMN guild_configs.join_msg; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(join_msg) ON TABLE app_public.guild_configs TO sushii_visitor;


--
-- Name: COLUMN guild_configs.join_msg_enabled; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(join_msg_enabled) ON TABLE app_public.guild_configs TO sushii_visitor;


--
-- Name: COLUMN guild_configs.join_react; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(join_react) ON TABLE app_public.guild_configs TO sushii_visitor;


--
-- Name: COLUMN guild_configs.leave_msg; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(leave_msg) ON TABLE app_public.guild_configs TO sushii_visitor;


--
-- Name: COLUMN guild_configs.leave_msg_enabled; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(leave_msg_enabled) ON TABLE app_public.guild_configs TO sushii_visitor;


--
-- Name: COLUMN guild_configs.msg_channel; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(msg_channel) ON TABLE app_public.guild_configs TO sushii_visitor;


--
-- Name: COLUMN guild_configs.role_channel; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(role_channel) ON TABLE app_public.guild_configs TO sushii_visitor;


--
-- Name: COLUMN guild_configs.role_config; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(role_config) ON TABLE app_public.guild_configs TO sushii_visitor;


--
-- Name: COLUMN guild_configs.role_enabled; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(role_enabled) ON TABLE app_public.guild_configs TO sushii_visitor;


--
-- Name: COLUMN guild_configs.log_msg; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(log_msg) ON TABLE app_public.guild_configs TO sushii_visitor;


--
-- Name: COLUMN guild_configs.log_msg_enabled; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(log_msg_enabled) ON TABLE app_public.guild_configs TO sushii_visitor;


--
-- Name: COLUMN guild_configs.log_mod; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(log_mod) ON TABLE app_public.guild_configs TO sushii_visitor;


--
-- Name: COLUMN guild_configs.log_mod_enabled; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(log_mod_enabled) ON TABLE app_public.guild_configs TO sushii_visitor;


--
-- Name: COLUMN guild_configs.log_member; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(log_member) ON TABLE app_public.guild_configs TO sushii_visitor;


--
-- Name: COLUMN guild_configs.log_member_enabled; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(log_member_enabled) ON TABLE app_public.guild_configs TO sushii_visitor;


--
-- Name: COLUMN guild_configs.mute_dm_text; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(mute_dm_text) ON TABLE app_public.guild_configs TO sushii_visitor;


--
-- Name: COLUMN guild_configs.mute_dm_enabled; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(mute_dm_enabled) ON TABLE app_public.guild_configs TO sushii_visitor;


--
-- Name: COLUMN guild_configs.warn_dm_text; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(warn_dm_text) ON TABLE app_public.guild_configs TO sushii_visitor;


--
-- Name: COLUMN guild_configs.warn_dm_enabled; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(warn_dm_enabled) ON TABLE app_public.guild_configs TO sushii_visitor;


--
-- Name: COLUMN guild_configs.disabled_channels; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(disabled_channels) ON TABLE app_public.guild_configs TO sushii_visitor;


--
-- Name: TABLE guild_emojis_and_stickers; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.guild_emojis_and_stickers TO sushii_admin;


--
-- Name: TABLE level_role_apply_jobs; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.level_role_apply_jobs TO sushii_admin;


--
-- Name: TABLE level_role_overrides; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.level_role_overrides TO sushii_admin;


--
-- Name: TABLE level_roles; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.level_roles TO sushii_admin;
GRANT SELECT ON TABLE app_public.level_roles TO sushii_visitor;


--
-- Name: TABLE members; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.members TO sushii_admin;


--
-- Name: TABLE messages; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.messages TO sushii_admin;


--
-- Name: TABLE msg_log_blocks; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.msg_log_blocks TO sushii_admin;


--
-- Name: TABLE mutes; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.mutes TO sushii_admin;


--
-- Name: TABLE notifications; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.notifications TO sushii_admin;


--
-- Name: TABLE reminders; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.reminders TO sushii_admin;


--
-- Name: TABLE role_menus; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.role_menus TO sushii_admin;


--
-- Name: TABLE user_levels; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT ON TABLE app_public.user_levels TO sushii_visitor;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.user_levels TO sushii_admin;


--
-- Name: TABLE users; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.users TO sushii_admin;


--
-- Name: TABLE web_user_guilds; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT ON TABLE app_public.web_user_guilds TO sushii_visitor;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.web_user_guilds TO sushii_admin;


--
-- Name: TABLE xp_blocks; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.xp_blocks TO sushii_admin;
GRANT SELECT ON TABLE app_public.xp_blocks TO sushii_visitor;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: app_hidden; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE sushii IN SCHEMA app_hidden GRANT SELECT,USAGE ON SEQUENCES  TO sushii_visitor;
ALTER DEFAULT PRIVILEGES FOR ROLE sushii IN SCHEMA app_hidden GRANT SELECT,USAGE ON SEQUENCES  TO sushii_admin;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: app_hidden; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE sushii IN SCHEMA app_hidden GRANT ALL ON FUNCTIONS  TO sushii_visitor;
ALTER DEFAULT PRIVILEGES FOR ROLE sushii IN SCHEMA app_hidden GRANT ALL ON FUNCTIONS  TO sushii_admin;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: app_hidden; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE sushii IN SCHEMA app_hidden GRANT SELECT,INSERT,DELETE,UPDATE ON TABLES  TO sushii_admin;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: app_public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE sushii IN SCHEMA app_public GRANT SELECT,USAGE ON SEQUENCES  TO sushii_visitor;
ALTER DEFAULT PRIVILEGES FOR ROLE sushii IN SCHEMA app_public GRANT SELECT,USAGE ON SEQUENCES  TO sushii_admin;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: app_public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE sushii IN SCHEMA app_public GRANT ALL ON FUNCTIONS  TO sushii_visitor;
ALTER DEFAULT PRIVILEGES FOR ROLE sushii IN SCHEMA app_public GRANT ALL ON FUNCTIONS  TO sushii_admin;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: app_public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE sushii IN SCHEMA app_public GRANT SELECT,INSERT,DELETE,UPDATE ON TABLES  TO sushii_admin;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE sushii IN SCHEMA public GRANT SELECT,USAGE ON SEQUENCES  TO sushii_visitor;
ALTER DEFAULT PRIVILEGES FOR ROLE sushii IN SCHEMA public GRANT SELECT,USAGE ON SEQUENCES  TO sushii_admin;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE sushii IN SCHEMA public GRANT ALL ON FUNCTIONS  TO sushii_visitor;
ALTER DEFAULT PRIVILEGES FOR ROLE sushii IN SCHEMA public GRANT ALL ON FUNCTIONS  TO sushii_admin;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE sushii IN SCHEMA public GRANT SELECT,INSERT,DELETE,UPDATE ON TABLES  TO sushii_admin;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE sushii REVOKE ALL ON FUNCTIONS  FROM PUBLIC;


--
-- Name: postgraphile_watch_ddl; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER postgraphile_watch_ddl ON ddl_command_end
         WHEN TAG IN ('ALTER AGGREGATE', 'ALTER DOMAIN', 'ALTER EXTENSION', 'ALTER FOREIGN TABLE', 'ALTER FUNCTION', 'ALTER POLICY', 'ALTER SCHEMA', 'ALTER TABLE', 'ALTER TYPE', 'ALTER VIEW', 'COMMENT', 'CREATE AGGREGATE', 'CREATE DOMAIN', 'CREATE EXTENSION', 'CREATE FOREIGN TABLE', 'CREATE FUNCTION', 'CREATE INDEX', 'CREATE POLICY', 'CREATE RULE', 'CREATE SCHEMA', 'CREATE TABLE', 'CREATE TABLE AS', 'CREATE VIEW', 'DROP AGGREGATE', 'DROP DOMAIN', 'DROP EXTENSION', 'DROP FOREIGN TABLE', 'DROP FUNCTION', 'DROP INDEX', 'DROP OWNED', 'DROP POLICY', 'DROP RULE', 'DROP SCHEMA', 'DROP TABLE', 'DROP TYPE', 'DROP VIEW', 'GRANT', 'REVOKE', 'SELECT INTO')
   EXECUTE FUNCTION postgraphile_watch.notify_watchers_ddl();


--
-- Name: postgraphile_watch_drop; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER postgraphile_watch_drop ON sql_drop
   EXECUTE FUNCTION postgraphile_watch.notify_watchers_drop();


--
-- PostgreSQL database dump complete
--

