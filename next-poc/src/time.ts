export class Time {
  constructor(
    public readonly hour: number,
    public readonly minute: number,
  ) {
    if (hour < 0 || hour > 23) {
      throw new Error("Invalid hour");
    }
    if (minute < 0 || minute > 59) {
      throw new Error("Invalid minute");
    }
  }

  public minusMinutes(minutes: number) {
    if (this.totalMinutes < minutes) {
      return Time.fromMinutes(24 * 60 + this.totalMinutes - minutes);
    }
    return Time.fromMinutes(this.totalMinutes - minutes);
  }

  public addMinutes(minutes: number) {
    return Time.fromMinutes(this.totalMinutes + minutes);
  }

  public equals(other: Time) {
    return this.hour === other.hour && this.minute === other.minute;
  }

  public toDate(date: Date) {
    const newDate = new Date(date);
    newDate.setUTCHours(this.hour, this.minute, 0, 0);
    return newDate;
  }

  public isAfter(other: Time) {
    return this.totalMinutes > other.totalMinutes;
  }

  public isBefore(other: Time) {
    return this.totalMinutes < other.totalMinutes;
  }

  public get totalMinutes() {
    return this.hour * 60 + this.minute;
  }

  public clone() {
    return new Time(this.hour, this.minute);
  }

  public toString() {
    return `${this.hour.toString().padStart(2, "0")}:${this.minute.toString().padStart(2, "0")}`;
  }

  public static fromString(str: string) {
    const [hour, minute] = str.split(":").map(Number);
    return new Time(hour, minute);
  }

  public static fromMinutes(minutes: number) {
    return new Time(Math.floor(minutes / 60) % 24, minutes % 60);
  }
}
