--! Previous: sha1:59a11cb6e4a2c11f01131552a126a2f2446a48f1
--! Hash: sha1:98816fcc35fb195f822c1738f77a326a684da474

-- Add active deployment table

drop type if exists app_private.deployment_name cascade;
create type app_private.deployment_name as enum (
  'blue',
  'green'
);

drop table if exists app_private.active_deployment cascade;
create table app_private.active_deployment (
  -- enforce single row in this table
  id int not null generated always as (1) stored unique,
  name app_private.deployment_name not null
);
