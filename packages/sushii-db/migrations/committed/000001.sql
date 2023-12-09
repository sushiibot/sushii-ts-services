--! Previous: -
--! Hash: sha1:43217d7c90df076f71443ebd3e51d30d9aa63194

drop schema if exists app_public cascade;
drop schema if exists app_hidden cascade;
drop schema if exists app_private cascade;

revoke all on schema public from public;

alter default privileges revoke all on sequences from public;
alter default privileges revoke all on functions from public;

-- Of course we want our database owner to be able to do anything inside the
-- database, so we grant access to the `public` schema:
grant all on schema public to :DATABASE_OWNER;

create schema app_public;
create schema app_hidden;
create schema app_private;

-- The 'visitor' role (used by PostGraphile to represent an end user) may
-- access the public, app_public and app_hidden schemas (but _NOT_ the
-- app_private schema).
grant usage on schema public, app_public, app_hidden to :DATABASE_VISITOR;

-- We want the `visitor` role to be able to insert rows (`serial` data type
-- creates sequences, so we need to grant access to that).
alter default privileges in schema public, app_public, app_hidden
  grant usage, select on sequences to :DATABASE_VISITOR;

-- And the `visitor` role should be able to call functions too.
alter default privileges in schema public, app_public, app_hidden
  grant execute on functions to :DATABASE_VISITOR;

CREATE TABLE app_public.guild_configs (
    id                  BIGINT PRIMARY KEY,
    prefix              TEXT,

    -- Join message text
    join_msg            TEXT,
    join_msg_enabled    BOOLEAN DEFAULT TRUE NOT NULL,

    -- Join message reaction
    join_react          TEXT,

    -- Leave message text
    leave_msg           TEXT,
    leave_msg_enabled   BOOLEAN DEFAULT TRUE NOT NULL,

    -- Join / leave messages channel
    msg_channel         BIGINT,

    -- Role assignments
    role_channel        BIGINT,
    role_config         JSONB,
    role_enabled        BOOLEAN DEFAULT TRUE NOT NULL,

    -- Auto delete invite links, default off
    invite_guard        BOOLEAN DEFAULT FALSE NOT NULL,

    -- Message deleted / edited log channel
    log_msg             BIGINT,
    log_msg_enabled     BOOLEAN DEFAULT TRUE NOT NULL,

    -- Moderation actions log channel
    log_mod             BIGINT,
    log_mod_enabled     BOOLEAN DEFAULT TRUE NOT NULL,

    -- Member join / leave log channel
    log_member          BIGINT,
    log_member_enabled  BOOLEAN DEFAULT TRUE NOT NULL,

    -- Mute role ID
    mute_role           BIGINT,
    -- Duration in seconds
    mute_duration       BIGINT,

    -- Should DM user on mute
    mute_dm_text        TEXT,
    mute_dm_enabled     BOOLEAN DEFAULT TRUE NOT NULL,

    warn_dm_text        TEXT,
    warn_dm_enabled     BOOLEAN DEFAULT TRUE NOT NULL,

    -- Max number of unique mentions in a single message to auto mute
    max_mention         INTEGER,

    -- Channels that won't respond to commands/tags
    disabled_channels   BIGINT[]
);

CREATE TABLE app_public.mod_logs (
    guild_id    BIGINT    NOT NULL,
    case_id     BIGINT    NOT NULL,
    action      TEXT      NOT NULL,
    action_time TIMESTAMP NOT NULL,
    pending     BOOLEAN   NOT NULL,
    user_id     BIGINT    NOT NULL,
    user_tag    TEXT      NOT NULL,
    executor_id BIGINT,
    reason      TEXT,
    msg_id      BIGINT,
    PRIMARY KEY (guild_id, case_id)
);

CREATE TABLE app_public.mutes (
    guild_id   BIGINT    NOT NULL,
    user_id    BIGINT    NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time   TIMESTAMP,
    pending BOOLEAN NOT NULL DEFAULT FALSE,
    case_id BIGINT,
    PRIMARY KEY (guild_id, user_id),
    CONSTRAINT fk_mod_action
    FOREIGN KEY (guild_id, case_id)
     REFERENCES app_public.mod_logs(guild_id, case_id)
);

CREATE TABLE app_public.members (
    guild_id  BIGINT    NOT NULL,
    user_id   BIGINT    NOT NULL,
    join_time TIMESTAMP NOT NULL,
    PRIMARY KEY (guild_id, user_id)
);

CREATE TABLE app_public.user_levels (
    user_id      BIGINT    NOT NULL,
    guild_id     BIGINT    NOT NULL,
    msg_all_time BIGINT    NOT NULL,
    msg_month    BIGINT    NOT NULL,
    msg_week     BIGINT    NOT NULL,
    msg_day      BIGINT    NOT NULL,
    last_msg     TIMESTAMP NOT NULL,
    PRIMARY KEY (user_id, guild_id)
);

CREATE TABLE app_public.users (
    id              BIGINT    PRIMARY KEY,
    is_patron       BOOLEAN   NOT NULL,
    patron_emoji    TEXT,
    rep             BIGINT    NOT NULL,
    fishies         BIGINT    NOT NULL,
    last_rep        TIMESTAMP,
    last_fishies    TIMESTAMP,
    lastfm_username TEXT,
    profile_data    JSONB
);

CREATE TABLE app_public.tags (
    owner_id  BIGINT    NOT NULL,
    guild_id  BIGINT    NOT NULL,
    tag_name  TEXT      NOT NULL,
    content   TEXT      NOT NULL,
    use_count BIGINT    NOT NULL,
    created   TIMESTAMP NOT NULL,
    PRIMARY KEY (guild_id, tag_name)
);

CREATE INDEX tag_name_idx
          ON app_public.tags
       USING GIN(tag_name gin_trgm_ops);

CREATE TABLE app_public.messages (
    message_id   BIGINT    PRIMARY KEY,
    author_id    BIGINT    NOT NULL,
    channel_id   BIGINT    NOT NULL,
    guild_id     BIGINT    NOT NULL,
    created      TIMESTAMP NOT NULL,
    content      TEXT      NOT NULL,
    msg          JSONB     NOT NULL
);

CREATE TABLE app_public.cached_users (
    id            BIGINT    PRIMARY KEY,
    avatar_url    TEXT      NOT NULL,
    name          TEXT      NOT NULL,
    discriminator INTEGER   NOT NULL,
    -- Seen user, updated once per day
    last_checked  TIMESTAMP NOT NULL
);

CREATE TABLE app_public.cached_guilds (
    id            BIGINT PRIMARY KEY,
    name          TEXT   NOT NULL,
    member_count  BIGINT NOT NULL,
    icon_url      TEXT,
    -- Array but converted to comma sep string
    features      TEXT   NOT NULL,
    splash_url    TEXT,
    banner_url    TEXT
);

CREATE TABLE app_public.notifications (
    user_id  BIGINT NOT NULL,
    guild_id BIGINT NOT NULL,
    keyword  TEXT   NOT NULL,
    PRIMARY KEY (user_id, guild_id, keyword)
);

CREATE INDEX notification_keyword_idx
          ON app_public.notifications (keyword);
CREATE INDEX notification_guild_id_idx
          ON app_public.notifications (guild_id);

CREATE TABLE app_public.reminders (
    user_id     BIGINT    NOT NULL,
    description TEXT      NOT NULL,
    set_at      TIMESTAMP NOT NULL,
    expire_at   TIMESTAMP NOT NULL,
    PRIMARY KEY (user_id, set_at)
);

CREATE TABLE app_public.feeds (
    feed_id  TEXT PRIMARY KEY,
    metadata JSONB
);

CREATE TABLE app_public.feed_subscriptions (
    feed_id      TEXT   NOT NULL,
    guild_id     BIGINT NOT NULL,
    channel_id   BIGINT NOT NULL,
    mention_role BIGINT,
    PRIMARY KEY (feed_id, channel_id),
    CONSTRAINT fk_feed_subscription_feed_id
        FOREIGN KEY(feed_id)
            REFERENCES app_public.feeds(feed_id)
            ON DELETE CASCADE
);

CREATE TABLE app_public.feed_items (
    feed_id TEXT NOT NULL,
    item_id TEXT NOT NULL,
    PRIMARY KEY (feed_id, item_id),
    CONSTRAINT fk_feed_item_feed_id
        FOREIGN KEY(feed_id)
            REFERENCES app_public.feeds(feed_id)
            ON DELETE CASCADE
);
