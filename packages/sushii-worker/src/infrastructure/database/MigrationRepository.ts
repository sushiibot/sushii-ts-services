import { migrate } from "drizzle-orm/node-postgres/migrator";
import { sql } from "drizzle-orm";
import { IMigrationRepository } from "@/shared/domain/IMigrationRepository";
import { drizzleDb } from "./db";
import log from "@/core/logger";

export class MigrationRepository implements IMigrationRepository {
  async runMigrations(): Promise<void> {
    // Skip initial migration if on production
    if (
      process.env.NODE_ENV === "production" ||
      process.env.SKIP_INITIAL_MIGRATION === "true"
    ) {
      log.info("Marking initial migration as done in production");

      // Manually mark the initial migration as done
      // Must match the values in the migration file
      await drizzleDb.execute(
        sql`INSERT INTO drizzle.__drizzle_migrations (created_at, hash) VALUES (1751085422925, '0000_initial');`,
      );
    }

    // Run database migrations
    try {
      await migrate(drizzleDb, {
        migrationsFolder: "./drizzle",
      });
    } catch (err) {
      log.error({ err }, "Error running database migrations");
      throw err;
    }
  }
}
