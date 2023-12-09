--! Previous: sha1:f08437dbca59b35b13d0320809d955eb8c625927
--! Hash: sha1:0bcea54449d5164cbcf5fbcfb5120f59ee553382

alter table app_public.role_menu_roles
    drop column if exists position;
alter table app_public.role_menu_roles
    add column position integer;

-- Function to update the position of all the roles in a menu
drop function if exists app_public.set_role_menu_role_order(
  guild_id bigint,
  menu_name text,
  role_ids bigint[]
) cascade;
create function app_public.set_role_menu_role_order(
  guild_id bigint,
  menu_name text,
  role_ids bigint[]
) returns setof app_public.role_menu_roles as $$
  update app_public.role_menu_roles
    set position = u.position
    from (select
            unnest(role_ids) as role_id,
            generate_series(1, array_length(role_ids, 1)) as position
          ) as u(role_id, position)
    where app_public.role_menu_roles.role_id = u.role_id
    -- need to return only the role_menu_roles table, and not the temporary u table
    returning app_public.role_menu_roles.*;
$$ language sql;

-- Update bulk insert to set the role order
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
  insert into app_public.role_menu_roles (guild_id, menu_name, role_id, position)
    select guild_id, menu_name, u.role_id, u.position
      from (select
          unnest(role_ids) as role_id,
          -- start at the previous max
          generate_series(
            (
            -- start at 1 if there is currently no max, must be 1 to generate correct series length
            select coalesce(max(position) + 1, 1)
              from app_public.role_menu_roles
              where guild_id = $1
                and menu_name = $2
            ),
            -- end series at length of array
            array_length(role_ids, 1)
          ) as position
      ) as u(role_id, position)
     on conflict do nothing
    returning *;
$$ language sql;
