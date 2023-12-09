"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.options = exports.schemas = exports.database = void 0;
const pino_1 = __importDefault(require("pino"));
const pg_aggregates_1 = __importDefault(require("@graphile/pg-aggregates"));
const postgraphile_plugin_connection_filter_1 = __importDefault(require("postgraphile-plugin-connection-filter"));
const postgraphile_upsert_plugin_1 = require("postgraphile-upsert-plugin");
const guildCache_1 = __importDefault(require("./extended_schema/guildCache"));
const logger = (0, pino_1.default)({ name: "options" });
function mustGetEnvVar(value) {
    const val = process.env[value];
    if (!val) {
        throw new Error(`missing environment variable ${value}`);
    }
    return val;
}
// Connection string (or pg.Pool) for PostGraphile to use
exports.database = process.env.DATABASE_URL || "postgraphile";
// Database schemas to use
exports.schemas = ["app_public"];
logger.debug("using database schemas: ", exports.schemas);
// PostGraphile options; see https://www.graphile.org/postgraphile/usage-library/#api-postgraphilepgconfig-schemaname-options
exports.options = {
    ownerConnectionString: process.env.OWNER_DATABASE_URL,
    appendPlugins: [
        postgraphile_plugin_connection_filter_1.default,
        pg_aggregates_1.default,
        guildCache_1.default,
        postgraphile_upsert_plugin_1.PgMutationUpsertPlugin,
    ],
    // pgSettings assigned in JWT token
    retryOnInitFail: false,
    watchPg: true,
    graphiql: true,
    enhanceGraphiql: true,
    subscriptions: true,
    websocketOperations: "all",
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
exports.port = process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : 8080;
