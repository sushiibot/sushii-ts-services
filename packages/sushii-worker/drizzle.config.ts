import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  schemaFilter: ["app_public", "app_private", "app_hidden"],
  dialect: "postgresql",
  // Not necessary for postgres, only for databases that don't support multiple
  // DDL alteration statements in one transaction
  breakpoints: false,
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
