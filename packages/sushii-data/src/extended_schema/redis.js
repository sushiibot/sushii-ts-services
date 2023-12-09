"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
const redis_1 = require("redis");
const logger = (0, pino_1.default)({
    name: "redis",
});
const client = (0, redis_1.createClient)({
    url: process.env.REDIS_URL,
});
client.on("error", (err) => logger.error(err, "redis client error"));
client.on("connect", () => logger.info("initiating connection to redis"));
client.on("reconnect", () => logger.info("reconnecting to redis"));
client.on("ready", () => logger.info("connected to redis"));
client.on("end", () => logger.info("disconnected from redis"));
exports.default = client;
