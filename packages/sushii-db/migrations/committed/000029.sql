--! Previous: sha1:59a11cb6e4a2c11f01131552a126a2f2446a48f1
--! Hash: sha1:f5a72240aae003218d2840000997aae898c574ae

-- Add active deployment table

drop table if exists app_private.active_deployment cascade;
create table app_private.active_deployment (
  -- enforce single row in this table
  id int not null generated always as (1) stored unique,
  name text not null
);
