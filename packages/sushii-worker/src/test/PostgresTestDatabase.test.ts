import { describe, expect, test, afterAll } from "bun:test";
import { PostgresTestDatabase } from "./PostgresTestDatabase";
import { sql } from "drizzle-orm";

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
