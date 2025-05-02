-- Add reaction logs
alter table app_public.guild_configs
    drop column if exists reaction_logs_channel;

alter table app_public.guild_configs 
    add column reaction_logs_channel bigint;
