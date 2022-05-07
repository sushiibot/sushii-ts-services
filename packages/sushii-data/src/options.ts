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
  ownerConnectionString: process.env.OWNER_DATABASE_URL,
  appendPlugins: [],
  // pgSettings assigned in JWT token
  retryOnInitFail: false,
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
  pgDefaultRole: mustGetEnvVar("DATABASE_VISITOR"),
  jwtPublicKey: mustGetEnvVar("JWT_PUB_KEY"),
  jwtVerifyOptions: {
    algorithms: ["RS256", "ES512"],
    audience: process.env.JWT_VERIFY_AUDIENCE,
  },
  // Path in jwt to extract postgres role.
  jwtRole: ["role"],
};

export const port: number = process.env.PORT
  ? parseInt(process.env.PORT, 10)
  : 8080;
