import dayjs from "dayjs";
import "dayjs/plugin/utc";
import "dayjs/plugin/duration";
import "dayjs/plugin/relativeTime";

dayjs.extend(require("dayjs/plugin/utc"));
dayjs.extend(require("dayjs/plugin/duration"));
dayjs.extend(require("dayjs/plugin/relativeTime"));
