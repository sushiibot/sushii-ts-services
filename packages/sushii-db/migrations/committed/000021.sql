--! Previous: sha1:fdefcc160e3a2108d8a822ae25f4a26e8617c042
--! Hash: sha1:384f0b30d900ff836fa72b6650d20433e2573ba0

-- Bulk mod log delete
drop function if exists app_public.bulk_delete_mod_log(
  guild_id bigint,
  start_case_id bigint,
  end_case_id bigint
) cascade;

create function app_public.bulk_delete_mod_log(
  guild_id bigint,
  start_case_id bigint,
  end_case_id bigint
) returns setof app_public.mod_logs as $$
  delete from app_public.mod_logs
  where guild_id = $1
    and case_id >= $2 -- start_case_id
    and case_id <= $3 -- end_case_id
  returning *;
$$ language sql strict;
