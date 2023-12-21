-- ban pools

drop type if exists app_public.ban_pool_visibility    cascade;
drop type if exists app_public.ban_pool_permission    cascade;
drop type if exists app_public.ban_pool_add_mode      cascade;
drop type if exists app_public.ban_pool_remove_mode   cascade;
drop type if exists app_public.ban_pool_add_action    cascade;
drop type if exists app_public.ban_pool_remove_action cascade;

drop table if exists app_public.ban_pool_guild_settings cascade;
drop table if exists app_public.ban_pools        cascade;
drop table if exists app_public.ban_pool_members cascade;
drop table if exists app_public.ban_pool_entries cascade;
drop table if exists app_public.ban_pool_invites cascade;

-- Whether or not a guild can view or edit another guild's ban pool.
-- Blocked guilds can't view or edit the pool.
create type app_public.ban_pool_permission as enum (
  'owner',
  'edit',
  'view',
  'blocked'
);

-- BAN IN CURRENT GUILD: When users are added to ban pools for owners/editors:
-- 1. Auto add for all banned users
-- 2. Manually add users with command or mod log
-- 3. Nothing, no display on modlogs or prompts - lookup reasons only
create type app_public.ban_pool_add_mode as enum (
  'all_bans',
  'manual',
  'nothing'
);

-- UNBAN IN CURRENT GUILD: When to remove users from pool:
-- 1. Auto remove for all unbanned users in current server.
-- 2. Only manually removed from pool with command.
-- 3. Nothing, no display on modlogs or prompts - lookup reasons only
create type app_public.ban_pool_remove_mode as enum (
  'all_unbans',
  'manual',
  'nothing'
);

-- POOL ADD BY OTHER GUILD: What to do when a user is added to  a pool by another guild, either as follower or owner:
-- 1. Ban users automatically when a user is added to a pool.
-- 2. Timeout, then ask what to do when a user is added to a pool.
-- 3. Ask what to do when a user is added to a pool.
-- 4. Nothing - lookup reasons only
create type app_public.ban_pool_add_action as enum (
  'ban',
  'timeout_and_ask',
  'ask',
  'nothing'
);

-- POOL REMOVE BY OTHER GUILD: What to do when a user is removed from a pool by another guild:
-- 1. Unban users automatically when a user is removed from a pool.
-- 2. Send a prompt to ask what to do when a user is removed from a pool.
-- 3. Nothing - lookup reasons only
create type app_public.ban_pool_remove_action as enum (
  'unban',
  'ask',
  'nothing'
);

create table app_public.ban_pool_guild_settings (
  guild_id         bigint not null,
  -- Send prompts for ask actions
  alert_channel_id bigint
);

create table app_public.ban_pools (
  -- Unique identifier just for referencing in commands when there's duplicate names
  id          serial unique,

  guild_id    bigint not null,
  pool_name   text   not null,
  description text,

  -- User id of who made this, just useful info for contact purposes
  creator_id bigint not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  primary key (guild_id, pool_name)
);

create trigger _100_timestamps
  before insert or update on app_public.ban_pools
  for each row
  execute procedure app_private.tg__timestamps();

-- Other servers can join ban pools by invitation or public pools
create table app_public.ban_pool_members (
  owner_guild_id  bigint not null,
  pool_name       text   not null,
  member_guild_id bigint not null,

  -- Invited guilds can view the pool, but not edit it.
  -- Can be changed to 'edit' by pool owner, which lets them add bans.
  permission  app_public.ban_pool_permission  not null default 'view',

  -- Only for pool members with edit permissions.
  add_mode    app_public.ban_pool_add_mode    not null default 'all_bans',
  remove_mode app_public.ban_pool_remove_mode not null default 'all_unbans',

  -- For all pool members with edit/view permissions.
  add_action    app_public.ban_pool_add_action    not null default 'ban',
  remove_action app_public.ban_pool_remove_action not null default 'unban',

  foreign key (owner_guild_id, pool_name)
    references app_public.ban_pools(guild_id, pool_name)
    on delete cascade,

  primary key (owner_guild_id, pool_name, member_guild_id)
);

-- Keep track of all users in a ban pool, potential future use of banning all
-- existing ban pool users when joining an existing pool
create table app_public.ban_pool_entries (
  owner_guild_id bigint not null,
  pool_name      text   not null,

  -- Guild the entry was added from, could be owner or editor
  source_guild_id bigint not null,

  -- Banned user
  user_id bigint not null,
  -- Additional reason for ban pool, does not use mod log reason unless imported ?
  reason  text,

  foreign key (owner_guild_id, pool_name)
    references app_public.ban_pools(guild_id, pool_name)
    on delete cascade,

  primary key (owner_guild_id, pool_name, user_id)
);

-- from lookup groups -- make lookups private within groups
-- to join a group, owner creates an invite code
create table app_public.ban_pool_invites (
  owner_guild_id bigint not null,
  pool_name      text   not null,

  invite_code text      not null unique,
  expires_at  timestamptz,
  -- null for unlimited uses
  max_uses    int,
  -- count of how many times this invite has been used
  uses        int      not null default 0,

  foreign key (owner_guild_id, pool_name)
    references app_public.ban_pools(guild_id, pool_name)
    on delete cascade,

  -- 1 invite code per group per guild
  primary key (owner_guild_id, pool_name, invite_code)
)
