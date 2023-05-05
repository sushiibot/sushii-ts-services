import { Pool } from "pg";
// or `import * as Cursor from 'pg-cursor'` depending on your tsconfig
import Cursor from "pg-cursor";
import { Kysely, PostgresDialect } from "kysely";
import logger from "../logger";
import config from "./config";
import { DB } from "./dbTypes";

const dbLogger = logger.child({ module: "db" });

const db = new Kysely<DB>({
  // PostgresDialect requires the Cursor dependency
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: config.DATABASE_URL,
    }),
    cursor: Cursor,
  }),
  log(event): void {
    if (event.level === "query") {
      dbLogger.debug(
        {
          durationMs: event.queryDurationMillis,
          parameters: event.query.parameters,
        },
        event.query.sql
      );
    }
  },
});

dbLogger.info("pg connected");

export default db;
