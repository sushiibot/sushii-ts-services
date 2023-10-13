import pino from "pino";
import config from "./model/config";

const logger = pino({
  level: config.LOG_LEVEL,
});

logger.info(
  {
    level: logger.level,
  },
  "Logger initialized",
);

export default logger;
