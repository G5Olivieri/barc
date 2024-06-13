import { Time } from "./time";

export class TimeRange {
  constructor(
    public start: Time,
    public end: Time,
  ) {}

  spread(step = 30): Time[] {
    const hours = [];
    let current = this.start.clone();
    while (current.isBefore(this.end)) {
      hours.push(current.clone());
      current = current.addMinutes(step);
      if (hours.length > (24 * 60) / step) {
        return hours;
      }
    }
    return hours;
  }

  public static fromString(str: string): TimeRange {
    const [start, end] = str.split("-").map(Time.fromString);
    return new TimeRange(start, end);
  }

  public toString() {
    return `${this.start.toString()}-${this.end.toString()}`;
  }
}
