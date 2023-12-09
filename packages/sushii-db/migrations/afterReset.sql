BEGIN;

GRANT :DATABASE_VISITOR to :DATABASE_ADMIN;

GRANT CONNECT ON DATABASE :DATABASE_NAME TO :DATABASE_OWNER;
GRANT ALL ON DATABASE :DATABASE_NAME TO :DATABASE_OWNER;
-- This is the no-access role that PostGraphile will run as by default, allow connecting
GRANT CONNECT ON DATABASE :DATABASE_NAME TO :DATABASE_AUTHENTICATOR;
-- Enables authenticator to switch to visitor role
GRANT :DATABASE_VISITOR TO :DATABASE_AUTHENTICATOR;

-- Some extensions require superuser privileges, so we create them before migration time.
CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;
-- trigram index
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;
-- enable uuids
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

-- timescaledb
CREATE EXTENSION IF NOT EXISTS timescaledb;

COMMIT;
