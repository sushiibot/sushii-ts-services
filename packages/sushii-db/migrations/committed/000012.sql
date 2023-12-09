--! Previous: sha1:769e05d02518ebe767e7841fc44208441c16bc09
--! Hash: sha1:f08437dbca59b35b13d0320809d955eb8c625927

-- Enter migration here
---

-- menu

drop table if exists app_public.role_menus cascade;
create table app_public.role_menus (
  guild_id      bigint not null,
  menu_name     text   not null,
  description   text,
  max_count     int,
  required_role bigint,

  primary key (guild_id, menu_name)
);

create index rolemenu_guildid_idx on app_public.role_menus(guild_id);
-- for searching role menu autocomplete
create index rolemenu_name_idx on app_public.role_menus (menu_name text_pattern_ops);

alter table app_public.role_menus enable row level security;

-- does not include policy for visitor role
drop policy if exists admin_access on app_public.role_menus;
create policy admin_access on app_public.role_menus
  for all to :DATABASE_ADMIN using (true);

-- roles for role menu

drop table if exists app_public.role_menu_roles cascade;
create table app_public.role_menu_roles (
  guild_id      bigint not null,
  menu_name     text   not null,
  role_id       bigint not null,
  emoji         text,
  description   varchar(100),

  foreign key (guild_id, menu_name) references app_public.role_menus (guild_id, menu_name) on delete cascade,
  primary key (guild_id, menu_name, role_id)
);

alter table app_public.role_menu_roles enable row level security;

-- does not include policy for visitor role
drop policy if exists admin_access on app_public.role_menu_roles;
create policy admin_access on app_public.role_menu_roles
  for all to :DATABASE_ADMIN using (true);

-- functions to add/remove roles

drop function if exists app_public.add_role_menu_roles(
  guild_id bigint,
  menu_name text,
  role_ids bigint[]
) cascade;
create function app_public.add_role_menu_roles(
  guild_id bigint,
  menu_name text,
  role_ids bigint[]
) returns setof app_public.role_menu_roles as $$
  insert into app_public.role_menu_roles (guild_id, menu_name, role_id)
    select guild_id, menu_name, u.role_id
      from unnest(role_ids) as u(role_id)
     on conflict do nothing
    returning *;
$$ language sql;

-- bulk delete roles
drop function if exists app_public.delete_role_menu_roles(
  guild_id bigint,
  menu_name text,
  role_ids bigint[]
) cascade;
create function app_public.delete_role_menu_roles(
  guild_id bigint,
  menu_name text,
  role_ids bigint[]
) returns setof app_public.role_menu_roles as $$
  delete from app_public.role_menu_roles
      where guild_id = $1
        and menu_name = $2
        and role_id = any($3)
  returning *;
$$ language sql;
