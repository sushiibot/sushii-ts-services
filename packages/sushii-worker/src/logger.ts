import pino from "pino";
import config from "./model/config";

export default pino({
  level: config.LOG_LEVEL,
});
