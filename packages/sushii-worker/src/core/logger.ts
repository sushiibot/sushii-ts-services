import pino from "pino";
import config from "../model/config";

const logger = pino({
  level: config.LOG_LEVEL,
  formatters: {
    level(label) {
      return { level: label };
    },
  },
});

logger.info(
  {
    level: logger.level,
  },
  "Logger initialized",
);

export const newModuleLogger = (module: string): pino.Logger =>
  logger.child({ module });

export default logger;
