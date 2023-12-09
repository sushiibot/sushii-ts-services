--! Previous: sha1:f90ab5c79fdd3cf67cf5331b7106da7d465abbe6
--! Hash: sha1:e5fd7889920a0d1997492ef2649b28c327759d79

-- remove unused columns
alter table app_public.guild_configs
    drop column if exists mute_role,
    drop column if exists mute_duration,
    drop column if exists max_mention,
    drop column if exists invite_guard;
