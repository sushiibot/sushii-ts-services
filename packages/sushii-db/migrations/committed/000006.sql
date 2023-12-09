--! Previous: sha1:9be3da5aadbabc3371dd5c3101280ddadd5b742f
--! Hash: sha1:fea2c80c01826bfc2787f90ba252be0fad85dc91

drop table if exists app_public.bot_stats cascade;
create table app_public.bot_stats (
    name     text   not null,
    category text   not null,
    count    bigint not null,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now(),
    primary key (name, category)
);

create index on app_public.bot_stats(category);

alter table app_public.bot_stats enable row level security;
create policy select_stats on app_public.bot_stats
  for select using (true);

grant select on app_public.bot_stats to :DATABASE_VISITOR;

create trigger _100_timestamps
  before insert or update on app_public.bot_stats
  for each row
  execute procedure app_private.tg__timestamps();
