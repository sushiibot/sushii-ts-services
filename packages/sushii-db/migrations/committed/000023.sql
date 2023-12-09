--! Previous: sha1:b3b6c937077deba7c86106014a5c939ee0a6d2b6
--! Hash: sha1:f90ab5c79fdd3cf67cf5331b7106da7d465abbe6

-- move guild_configs.data.lookup_details_opt_in to it's own column

alter table app_public.guild_configs
drop column if exists lookup_details_opt_in,
drop column if exists lookup_prompted;

alter table app_public.guild_configs 
add column lookup_details_opt_in boolean not null default false,
add column lookup_prompted boolean not null default false;

update app_public.guild_configs
set
    lookup_details_opt_in = coalesce((data->>'lookup_details_opt_in')::boolean, false),
    lookup_prompted = coalesce((data->>'lookup_prompted')::boolean, false);
