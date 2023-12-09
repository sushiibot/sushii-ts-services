--! Previous: sha1:f92c347a0456fa4e67bdd540eeadb4d755e4ace2
--! Hash: sha1:9e15508976d950afce4f4635992e7d927d8b9065

alter table app_public.feed_items
drop constraint if exists fk_feed_item_feed_id;
