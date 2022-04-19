import type { Pool } from "pg";
import pino from "pino";
import { PostGraphileOptions } from "postgraphile";

const logger = pino({ name: "options" });

function mustGetEnvVar(value: string): string {
  const val = process.env[value];

  if (!val) {
    throw new Error(`missing environment variable ${value}`);
  }

  return val;
}

// Connection string (or pg.Pool) for PostGraphile to use
export const database: string | Pool =
  process.env.DATABASE_URL || "postgraphile";

// Database schemas to use
export const schemas: string | string[] = ["app_public"];

logger.debug("using database schemas: ", schemas);

// PostGraphile options; see https://www.graphile.org/postgraphile/usage-library/#api-postgraphilepgconfig-schemaname-options
export const options: PostGraphileOptions = {
  appendPlugins: [],
  pgSettings(req) {
    // Adding this to ensure that all servers pass through the request in a
    // good enough way that we can extract headers.
    // CREATE FUNCTION current_user_id() RETURNS text AS $$ SELECT current_setting('graphile.test.x-user-id', TRUE); $$ LANGUAGE sql STABLE;
    return {
      "graphile.test.x-user-id":
        req.headers["x-user-id"] ||
        // `normalizedConnectionParams` comes from websocket connections, where
        // the headers often cannot be customized by the client.
        (req as any).normalizedConnectionParams?.["x-user-id"],
    };
  },
  retryOnInitFail: true,
  watchPg: true,
  graphiql: true,
  enhanceGraphiql: true,
  subscriptions: true,
  dynamicJson: true,
  setofFunctionsContainNulls: false,
  ignoreRBAC: false,
  showErrorStack: "json",
  extendedErrors: ["hint", "detail", "errcode"],
  allowExplain: true,
  legacyRelations: "omit",
  exportGqlSchemaPath: `${__dirname}/schema.graphql`,
  sortExport: true,
  jwtPublicKey: mustGetEnvVar("JWT_PUB_KEY"),
  jwtVerifyOptions: {
    algorithms: ["RS256", "ES512"],
    audience: process.env.JWT_VERIFY_AUDIENCE,
  },
  // Path in jwt to extract postgres role. All roles will be
  jwtRole: ["role"],
};

export const port: number = process.env.PORT
  ? parseInt(process.env.PORT, 10)
  : 8080;
