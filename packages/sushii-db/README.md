# sushii-db

sushii database migrations and database setup.

## Setup

1. Add roles and databases.
    ```bash
    # If in docker container
    docker exec -it container_id /bin/bash

    createuser --pwprompt sushii
    # low permission role for querying as a user
    createuser --pwprompt sushii_visitor
    # connects to db, can switch to visitor role
    createuser --pwprompt sushii_authenticator

    createdb sushii --owner=sushii

    # only required in local dev
    createdb sushii_shadow --owner=sushii
    ```
2. `yarn run graphile-migrate init`
3. Source .env file and run
    ```bash
    . ./.env
    graphile-migrate watch
    ```

## postgraphile support

Need to create sushii_authenticator role for postgraphile, requires admin role to
grant permissions but we can't use `afterReset.sql` since

```sql
-- This is the no-access role that PostGraphile will run as by default, allow connecting
GRANT CONNECT ON DATABASE :DATABASE_NAME TO :DATABASE_AUTHENTICATOR;
-- Enables authenticator to switch to visitor role
GRANT :DATABASE_VISITOR TO :DATABASE_AUTHENTICATOR;

-- enable uuids
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
```

# timescaledb support

```sql
CREATE EXTENSION IF NOT EXISTS timescaledb;
```

# admin role support

```sql
create role sushii_admin with nologin;
grant sushii_visitor to sushii_admin;
```

# enable optimized random select

```sql
create extension tsm_system_rows;
```
