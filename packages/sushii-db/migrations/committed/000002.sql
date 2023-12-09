--! Previous: sha1:43217d7c90df076f71443ebd3e51d30d9aa63194
--! Hash: sha1:f92c347a0456fa4e67bdd540eeadb4d755e4ace2

DROP TABLE IF EXISTS app_hidden.failures cascade;
CREATE TABLE app_hidden.failures (
    failure_id    TEXT      PRIMARY KEY,
    max_attempts  INTEGER   NOT NULL DEFAULT 25,
    attempt_count INTEGER   NOT NULL,
    last_attempt  TIMESTAMP NOT NULL,
    next_attempt  TIMESTAMP NOT NULL GENERATED ALWAYS AS
        (last_attempt + EXP(LEAST(10, attempt_count)) * INTERVAL '1 second') STORED
);
