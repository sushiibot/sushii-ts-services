--! Previous: sha1:db54b8d829ca09309d19695865a2882770d24e04
--! Hash: sha1:03693906cb6c52304b991a1ee928ca9bd379b018

alter table app_public.mod_logs
  drop column if exists attachments;

alter table app_public.mod_logs
  add column attachments text[] not null default '{}';
