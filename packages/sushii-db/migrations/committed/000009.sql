--! Previous: sha1:03693906cb6c52304b991a1ee928ca9bd379b018
--! Hash: sha1:50b2d43da8d174e8ec92118a94a926913d5cf480

-- Make message log into hyper table
select create_hypertable(
  'app_public.messages',
  'message_id',
  if_not_exists => true,
  migrate_data => true,
  chunk_time_interval => (86400000::bigint) << 22 -- 1 day in ms << 22
);

-- required for retention policy
create or replace function snowflake_now() returns bigint as $$
  select (extract(epoch from now())::bigint * 1000 - 1420070400000) << 22
$$ language sql stable;

select set_integer_now_func(
  'app_public.messages',
  'snowflake_now',
  replace_if_exists => true
);

-- retention policy
select remove_retention_policy(
  'app_public.messages',
  if_exists => true
);
select add_retention_policy(
  'app_public.messages',
  (86400000::bigint * 7) << 22, -- 1 week
  if_not_exists => true
);
