--! Previous: sha1:0c0c55c9d43a8099e0fc3d0b91faaec7beec3667
--! Hash: sha1:0d003169488f3f070edd4049b526d9782206577a

-- Enter migration here
-- /rolemenu edit with new name -- update menu roles as well instead of erroring
alter table app_public.role_menu_roles
  drop constraint role_menu_roles_guild_id_menu_name_fkey,
  add constraint role_menu_roles_guild_id_menu_name_fkey
    foreign key (guild_id, menu_name)
    references app_public.role_menus (guild_id, menu_name)
    on delete cascade
    on update cascade;
