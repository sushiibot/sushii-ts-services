import { Pool } from "pg";
// or `import * as Cursor from 'pg-cursor'` depending on your tsconfig
import Cursor from "pg-cursor";
import { Kysely, PostgresDialect } from "kysely";
import logger from "../logger";
import config from "./config";
import { DB } from "./dbTypes";

const db = new Kysely<DB>({
  // PostgresDialect requires the Cursor dependency
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: config.DATABASE_URL,
    }),
    cursor: Cursor,
  }),
});

logger.info("pg connected");

export default db;
