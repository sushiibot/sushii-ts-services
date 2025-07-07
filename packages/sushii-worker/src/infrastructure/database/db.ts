import { Pool } from "pg";
// or `import * as Cursor from 'pg-cursor'` depending on your tsconfig
import Cursor from "pg-cursor";
import { Kysely, PostgresDialect } from "kysely";
import { drizzle } from "drizzle-orm/node-postgres";
import logger from "../../core/logger";
import { DB } from "./dbTypes";
import { config } from "@/core/config";

const dbLogger = logger.child({ module: "db" });

export function initDatabase(url: string, maxConnections: number) {
  const pool = new Pool({
    connectionString: url,
    // PER shard cluster, as each cluster has its own process (hybrid-sharding)
    max: maxConnections,
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

  // For new drizzle ORM to replace Kysely
  const drizzleDb = drizzle({ client: pool });

  dbLogger.info("pg connected");

  return { db, drizzleDb };
}

// Initialize globally for backwards compatibility
const { db: globalDb, drizzleDb: globalDrizzleDb } = initDatabase(
  config.database.url,
  3,
);

export { globalDrizzleDb as drizzleDb };
export default globalDb;
