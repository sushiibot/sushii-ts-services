--! Previous: sha1:384f0b30d900ff836fa72b6650d20433e2573ba0
--! Hash: sha1:b3b6c937077deba7c86106014a5c939ee0a6d2b6

-- Update bulk_update_mod_log_reason to allow for option to only modify cases without reason

-- Delete old one
drop function if exists app_public.bulk_update_mod_log_reason(
  guild_id bigint,
  start_case_id bigint,
  end_case_id bigint,
  executor_id bigint,
  reason text
) cascade;

-- Delete new one
drop function if exists app_public.bulk_update_mod_log_reason(
  guild_id bigint,
  start_case_id bigint,
  end_case_id bigint,
  executor_id bigint,
  reason text,
  only_empty_reason boolean
) cascade;

create function app_public.bulk_update_mod_log_reason(
  guild_id bigint,
  start_case_id bigint,
  end_case_id bigint,
  executor_id bigint,
  reason text,
  only_empty_reason boolean default false
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
    -- only modify cases without reason if only_empty_reason is true
    -- only_empty_reason: true - (reason is null)
    and (not $6 or reason is null)
  returning *;
$$ language sql strict;
