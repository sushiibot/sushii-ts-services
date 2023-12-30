--! Previous: sha1:98816fcc35fb195f822c1738f77a326a684da474
--! Hash: sha1:0e7642fc9365bd9b3fae2936581385042f58fb07

lock table app_public.reminders;

-- Add unique ID to reminders to make it easier to delete them
alter table app_public.reminders
  drop column if exists id;

alter table app_public.reminders
  drop constraint if exists reminders_pkey;

-- id is the ID that the user sees and references when deleting
-- a reminder. It's unique per user.
-- nullable first
alter table app_public.reminders
  add column id bigint;

-- Update the id column to have incrementing values for each user_id
WITH ordered_reminders AS (
  SELECT
    -- Old primary key (user_id, set_at)
    user_id,
    set_at,
    ROW_NUMBER() OVER(PARTITION BY user_id ORDER BY set_at) as new_id
  FROM app_public.reminders
)
UPDATE app_public.reminders
SET id = ordered_reminders.new_id
FROM ordered_reminders
WHERE app_public.reminders.user_id = ordered_reminders.user_id
  AND app_public.reminders.set_at = ordered_reminders.set_at;

-- Make id not null and add primary key after ids are set.
alter table app_public.reminders
  alter column id set not null,
  add primary key (user_id, id);
