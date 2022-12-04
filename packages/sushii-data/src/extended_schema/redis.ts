import pino from "pino";
import { createClient } from "redis";

const logger = pino({
  name: "redis",
});

const client = createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (err) => logger.error(err, "redis client error"));
client.on("connect", () => logger.info("initiating connection to redis"));
client.on("reconnect", () => logger.info("reconnecting to redis"));
client.on("ready", () => logger.info("connected to redis"));
client.on("end", () => logger.info("disconnected from redis"));

export default client;
