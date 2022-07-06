import dayjs from "dayjs";
import { Duration } from "dayjs/plugin/duration";

export default function getDuration(a: dayjs.Dayjs, b: dayjs.Dayjs): Duration {
  const ms = a.diff(b);
  return dayjs.duration({ milliseconds: ms });
}

export function getDurationFromNow(d: dayjs.Dayjs): Duration {
  return getDuration(dayjs.utc(), d);
}
