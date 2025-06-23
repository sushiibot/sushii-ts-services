import { Pool } from "pg";
// or `import * as Cursor from 'pg-cursor'` depending on your tsconfig
import Cursor from "pg-cursor";
import { Kysely, PostgresDialect } from "kysely";
import logger from "../logger";
import config from "./config";
import { DB } from "./dbTypes";

const dbLogger = logger.child({ module: "db" });

const pool = new Pool({
  connectionString: config.DATABASE_URL,
  // PER shard, as each shard has its own process
  max: 3,
});

pool.on("error", (err) => {
  dbLogger.error(err, "pg pool error");
});

const db = new Kysely<DB>({
  // PostgresDialect requires the Cursor dependency
  dialect: new PostgresDialect({
    pool,
    cursor: Cursor,
  }),
});

dbLogger.info("pg connected");

export default db;
