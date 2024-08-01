import {
  Time,
  addMinutes,
  buildTimeFromString,
  isBefore,
  timeToString,
} from "./time";

export type TimeRange = {
  start: Time;
  end: Time;
};

export function spread(timeRange: TimeRange, step = 30): Time[] {
  const hours = [];
  let current = timeRange.start;
  while (isBefore(current, timeRange.end)) {
    hours.push(current);
    current = addMinutes(current, step);
    if (hours.length > (24 * 60) / step) {
      return hours;
    }
  }
  return hours;
}

export function newTimeRange(start: Time, end: Time) {
  return { start, end };
}

export function fromString(str: string): TimeRange {
  const [start, end] = str.split("-").map(buildTimeFromString);
  return newTimeRange(start, end);
}

export function timeRangeToString(timeRange: TimeRange): string {
  return `${timeToString(timeRange.start)}-${timeToString(timeRange.end)}`;
}
