--! Previous: sha1:4a8b50c1c2fae7f43a02a7c1e35d1e2e2d0c2059
--! Hash: sha1:fdefcc160e3a2108d8a822ae25f4a26e8617c042

-- Mod log reason case search
drop function if exists app_public.search_mod_logs(
  guild_id bigint,
  search_case_id bigint,
  max_results integer
) cascade;

-- search_case_id as a starts_with when searching for a case id
create function app_public.search_mod_logs(
  guild_id bigint,
  search_case_id bigint,
  max_results integer default 25
) returns setof app_public.mod_logs as $$
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
$$ language sql strict immutable;

--------------------------------------------------------------------------------

-- Bulk mod log reason update
drop function if exists app_public.bulk_update_mod_log_reason(
  guild_id bigint,
  start_case_id bigint,
  end_case_id bigint,
  executor_id bigint,
  reason text
) cascade;

create function app_public.bulk_update_mod_log_reason(
  guild_id bigint,
  start_case_id bigint,
  end_case_id bigint,
  executor_id bigint,
  reason text
) returns setof app_public.mod_logs as $$
  update app_public.mod_logs
    set
      reason = $5,
      executor_id = $4
  where guild_id = $1
    -- ignore pending cases
    and pending = false
    and case_id >= $2 -- start_case_id
    and case_id <= $3 -- end_case_id
  returning *;
$$ language sql strict;
