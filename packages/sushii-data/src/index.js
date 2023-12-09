"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const postgraphile_1 = require("postgraphile");
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const pino_1 = __importDefault(require("pino"));
const pino_http_1 = __importDefault(require("pino-http"));
const http_1 = __importDefault(require("http"));
const body_parser_1 = __importDefault(require("body-parser"));
const terminus_1 = require("@godaddy/terminus");
const options_1 = require("./options");
const redis_1 = __importDefault(require("./extended_schema/redis"));
const logger = (0, pino_1.default)({
    name: "postgraphile",
    level: process.env.LOG_LEVEL || "info",
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const middleware = (0, postgraphile_1.postgraphile)(options_1.database, options_1.schemas, options_1.options);
        yield redis_1.default.connect();
        const app = (0, express_1.default)();
        // ---------------------------------------------------------------------------
        app.use((0, pino_http_1.default)({
            logger,
        }));
        app.use((0, compression_1.default)({ threshold: 0 }));
        app.use((0, helmet_1.default)());
        app.use(body_parser_1.default.json());
        app.use(body_parser_1.default.urlencoded({ extended: false }));
        app.use(body_parser_1.default.text({ type: "application/graphql" }));
        // ---------------------------------------------------------------------------
        app.use(middleware);
        const server = http_1.default.createServer(app);
        (0, terminus_1.createTerminus)(server, {
            healthChecks: {
                "/health": ({ state }) => __awaiter(this, void 0, void 0, function* () {
                    if (state.isShuttingDown) {
                        return Promise.reject(new Error("shutting down"));
                    }
                    if ((yield redis_1.default.ping()) !== "PONG") {
                        return Promise.reject(new Error("redis not available (ping failed or mismatch)"));
                    }
                    return Promise.resolve();
                }),
            },
            onShutdown: () => __awaiter(this, void 0, void 0, function* () {
                logger.info("bye!");
            }),
            beforeShutdown: () => __awaiter(this, void 0, void 0, function* () {
                logger.info("shutting down");
            }),
            signals: ["SIGINT", "SIGTERM"],
            logger: logger.error,
        });
        server.listen(options_1.port, () => {
            const address = server.address();
            if (address && typeof address !== "string") {
                const href = `http://localhost:${address.port}${options_1.options.graphiqlRoute || "/graphiql"}`;
                logger.info(`PostGraphiQL available at ${href} 🚀`);
            }
            else {
                logger.info(`PostGraphile listening on ${address} 🚀`);
            }
        });
    });
}
main().catch((e) => logger.error(e));
