--! Previous: sha1:b0528ecaca7c52883bb7d60123f571f87b6d91cd
--! Hash: sha1:ecbc16988ee3cdf2872b69d3f0415d640d09a67f

-- DM status for mod logs
alter table app_public.mod_logs
  drop column if exists dm_channel_id,
  drop column if exists dm_message_id,
  drop column if exists dm_message_error;

-- dm_message_id is message ID of DM reason, eg. when timeout or warn.
-- dm_message_id == null if DM was not sent or failed.
-- dm_message_id == null && dm_message_error != null if DM failed
-- dm_message_id == null && dm_message_error == null if no DM was sent
alter table app_public.mod_logs
  add column dm_channel_id bigint,
  add column dm_message_id bigint,
  add column dm_message_error text;
