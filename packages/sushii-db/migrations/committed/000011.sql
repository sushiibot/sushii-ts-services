--! Previous: sha1:fee51a23cc8250d0b382bdf5a24ea0ff0327d6b2
--! Hash: sha1:769e05d02518ebe767e7841fc44208441c16bc09

-- Enter migration here
---

-- fix guild_id = guild_id query
drop function if exists app_public.random_tag(
  guild_id bigint,
  query text,
  starts_with boolean,
  owner_id bigint
) cascade;
create function app_public.random_tag(
  guild_id bigint,
  query text,
  starts_with boolean, -- if false, use contains, if null, no query
  owner_id bigint -- if not null, only return tags owned by this user
) returns app_public.tags as $$
  select *
    from app_public.tags
   where guild_id = random_tag.guild_id
         -- query is **not** required, query is either starts with or contains
         and (
           -- if query not provided
           (query is null or starts_with is null)
           or
           -- query starts with
           (query is not null and starts_with and tag_name like query || '%')
           or
           -- query contains
           (query is not null and not starts_with and tag_name like '%' || query || '%')
         )
         -- owner_id is optional
         and (random_tag.owner_id is null or owner_id = random_tag.owner_id)
    -- requires seq scan, not optimized
    order by random()
    limit 1;
$$ language sql immutable;
