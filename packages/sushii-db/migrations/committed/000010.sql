--! Previous: sha1:50b2d43da8d174e8ec92118a94a926913d5cf480
--! Hash: sha1:fee51a23cc8250d0b382bdf5a24ea0ff0327d6b2

-- The 'admin' role (used by PostGraphile to represent sushii services) may
-- access the public, app_public and app_hidden schemas (but _NOT_ the
-- app_private schema).
grant usage on schema public, app_public, app_hidden to :DATABASE_ADMIN;

-- We want the `admin` role to be able to insert rows (`serial` data type
-- creates sequences, so we need to grant access to that).
alter default privileges in schema public, app_public, app_hidden
  grant usage, select on sequences to :DATABASE_ADMIN;

-- And the `admin` role should be able to call functions too.
alter default privileges in schema public, app_public, app_hidden
  grant execute on functions to :DATABASE_ADMIN;

alter default privileges in schema public, app_public, app_hidden
  grant select, insert, update, delete
    on tables to :DATABASE_ADMIN;

grant select, insert, update, delete on all tables in
  schema app_public to :DATABASE_ADMIN;

--- Add permissions for admin role to access existing app_public tables

alter table app_public.guild_configs enable row level security;
drop policy if exists admin_access on app_public.guild_configs;
create policy admin_access on app_public.guild_configs
  for all to :DATABASE_ADMIN using (true);

alter table app_public.mod_logs enable row level security;
drop policy if exists admin_access on app_public.mod_logs;
create policy admin_access on app_public.mod_logs
  for all to :DATABASE_ADMIN using (true);

alter table app_public.mutes enable row level security;
drop policy if exists admin_access on app_public.mutes;
create policy admin_access on app_public.mutes
  for all to :DATABASE_ADMIN using (true);

-- re-enable filters and aggregates
comment on table app_public.user_levels is null;
drop policy if exists admin_access on app_public.user_levels;
create policy admin_access on app_public.user_levels
  for all to :DATABASE_ADMIN using (true);

drop policy if exists admin_access on app_public.users;
create policy admin_access on app_public.users
  for all to :DATABASE_ADMIN using (true);

drop policy if exists admin_access on app_public.tags;
create policy admin_access on app_public.tags
  for all to :DATABASE_ADMIN using (true);

drop policy if exists admin_access on app_public.messages;
create policy admin_access on app_public.messages
  for all to :DATABASE_ADMIN using (true);

drop policy if exists admin_access on app_public.notifications;
create policy admin_access on app_public.notifications
  for all to :DATABASE_ADMIN using (true);

drop policy if exists admin_access on app_public.reminders;
create policy admin_access on app_public.reminders
  for all to :DATABASE_ADMIN using (true);



---

-- mod case ID
drop function if exists app_public.next_case_id(guild_id bigint) cascade;
create function app_public.next_case_id(guild_id bigint) returns bigint as $$
  select coalesce(max(case_id), 0) + 1 from app_public.mod_logs where guild_id = guild_id;
$$ language sql immutable;

-- keyword search for /notification delete
drop function if exists app_public.notifications_starting_with(user_id bigint, query text) cascade;
create function app_public.notifications_starting_with(user_id bigint, query text) returns setof text as $$
  select keyword
    from app_public.notifications
   where user_id = user_id
         and keyword like query || '%'
  order by keyword;
$$ language sql immutable;

-- add index for user_id to list notifications by user
drop index if exists app_public.notifications_user_id_idx;
CREATE INDEX notifications_user_id_idx
          ON app_public.notifications (user_id);

----

-- TAGS add attachments as separate column to not have to do string concats
alter table app_public.tags
  drop column if exists attachment;
alter table app_public.tags
  add column attachment text;

---

-- TAGS get random tag
drop function if exists app_public.random_tag(
  guild_id bigint,
  query text,
  starts_with boolean,
  owner_id bigint
) cascade;
create function app_public.random_tag(
  guild_id bigint,
  query text,
  starts_with boolean, -- if false, use contains, if null, no query
  owner_id bigint -- if not null, only return tags owned by this user
) returns app_public.tags as $$
  select *
    from app_public.tags
   where guild_id = guild_id
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
         and (owner_id = 0 or owner_id = owner_id)
    -- requires seq scan, not optimized
    order by random()
    limit 1;
$$ language sql immutable;

drop type if exists app_public.user_guild_rank_result cascade;
create type app_public.user_guild_rank_result as (
  user_id bigint,
  guild_id bigint,
  msg_all_time bigint,
  msg_month bigint,
  msg_week bigint,
  msg_day bigint,
  last_msg timestamp,
  msg_all_time_rank bigint,
  msg_all_time_total bigint,
  msg_month_rank bigint,
  msg_month_total bigint,
  msg_week_rank bigint,
  msg_week_total bigint,
  msg_day_rank bigint,
  msg_day_total bigint
);

-- user rank
drop function if exists app_public.user_guild_rank(
  guild_id bigint,
  user_id bigint
) cascade;
create function app_public.user_guild_rank(
  guild_id bigint,
  user_id bigint
) returns app_public.user_guild_rank_result as $$
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
$$ language sql immutable strict;
