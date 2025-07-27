import { afterAll, describe, expect, test } from "bun:test";
import { sql } from "drizzle-orm";

import { PostgresTestDatabase } from "./PostgresTestDatabase";

describe("PostgresTestDatabase", () => {
  let testDb: PostgresTestDatabase;

  afterAll(async () => {
    await testDb?.close();
  });

  test("connects to PostgreSQL container", async () => {
    testDb = new PostgresTestDatabase();
    const db = await testDb.initialize();

    // Simple query to verify connection
    const result = await db.execute(sql`SELECT 1 as test`);
    expect(result.rows[0]).toEqual({ test: 1 });
  });
});
