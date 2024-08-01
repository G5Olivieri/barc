export type Time = {
  hour: number;
  minute: number;
};

export function totalMinutes(time: Time): number {
  return time.hour * 60 + time.minute;
}

export function fromMinutes(minutes: number): Time {
  const hour = Math.floor(minutes / 60) % 24;
  const minute = minutes % 60;
  return { hour, minute };
}

export function minusMinutes(time: Time, minutes: number): Time {
  if (totalMinutes(time) < minutes) {
    return fromMinutes(24 * 60 + totalMinutes(time) - minutes);
  }
  return fromMinutes(totalMinutes(time) - minutes);
}

export function addMinutes(time: Time, minutes: number): Time {
  return fromMinutes(totalMinutes(time) + minutes);
}

export function equals(a: Time, b: Time): boolean {
  return a.hour === b.hour && a.minute === b.minute;
}

export function timeToDate(time: Time, date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(time.hour, time.minute, 0, 0);
  return newDate;
}

export function isAfter(a: Time, b: Time): boolean {
  return totalMinutes(a) > totalMinutes(b);
}

export function isBefore(a: Time, b: Time): boolean {
  return totalMinutes(a) < totalMinutes(b);
}

export function buildTimeFromString(time: string): Time {
  const [hour, minute] = time.split(":").map(Number);
  return { hour, minute };
}

export function timeToString(time: Time): string {
  return `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}`;
}

export function newTime(hour: number, minute: number): Time {
  return { hour, minute };
}
