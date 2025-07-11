export enum TimeFrame {
  DAY = "day",
  WEEK = "week", 
  MONTH = "month",
  ALL_TIME = "all_time",
}

export function timeFrameToString(timeFrame: TimeFrame): string {
  switch (timeFrame) {
    case TimeFrame.DAY:
      return "Day";
    case TimeFrame.WEEK:
      return "Week";
    case TimeFrame.MONTH:
      return "Month";
    case TimeFrame.ALL_TIME:
      return "All Time";
  }
}

export function isValidTimeFrame(value: string): value is TimeFrame {
  return Object.values(TimeFrame).includes(value as TimeFrame);
}