import { Time } from "@/time";

describe("Time", () => {
  it("toString", () => {
    expect(new Time(8, 0).toString()).toBe("08:00");
    expect(new Time(9, 30).toString()).toBe("09:30");
    expect(new Time(9, 3).toString()).toBe("09:03");
    expect(new Time(19, 3).toString()).toBe("19:03");
  });

  it("fromString", () => {
    expect(Time.fromString("08:00")).toEqual(new Time(8, 0));
    expect(Time.fromString("8:0")).toEqual(new Time(8, 0));
    expect(Time.fromString("09:30")).toEqual(new Time(9, 30));
    expect(Time.fromString("9:30")).toEqual(new Time(9, 30));
    expect(Time.fromString("09:03")).toEqual(new Time(9, 3));
    expect(Time.fromString("9:3")).toEqual(new Time(9, 3));
    expect(Time.fromString("19:03")).toEqual(new Time(19, 3));
  });

  it("addMinutes", () => {
    const time = new Time(0, 0);
    expect(time.toString()).toBe("00:00");
    expect(time.addMinutes(72 * 60).toString()).toBe("00:00");
    expect(time.addMinutes(60).toString()).toBe("01:00");
    expect(time.addMinutes(59).toString()).toBe("00:59");
  });

  it("isAfter", () => {
    const time = new Time(10, 0);
    expect(time.isAfter(new Time(0, 0))).toBe(true);
    expect(time.isAfter(new Time(9, 59))).toBe(true);
    expect(time.isAfter(new Time(10, 1))).toBe(false);
    expect(time.isAfter(new Time(23, 59))).toBe(false);
    expect(time.isAfter(new Time(10, 0))).toBe(false);
  });

  it("isBefore", () => {
    const time = new Time(10, 0);
    expect(time.isBefore(new Time(0, 0))).toBe(false);
    expect(time.isBefore(new Time(9, 59))).toBe(false);
    expect(time.isBefore(new Time(10, 1))).toBe(true);
    expect(time.isBefore(new Time(23, 59))).toBe(true);
    expect(time.isBefore(new Time(10, 0))).toBe(false);
  });

  it("toDate", () => {
    expect(
      new Time(12, 0)
        .toDate(new Date("2024-04-21T00:00:00.000Z"))
        .toISOString(),
    ).toEqual("2024-04-21T12:00:00.000Z");
  });

  it("invalid hour", () => {
    expect(() => new Time(-1, 0)).toThrow("Invalid hour");
    expect(() => new Time(24, 0)).toThrow("Invalid hour");
  });

  it("invalid minute", () => {
    expect(() => new Time(0, -1)).toThrow("Invalid minute");
    expect(() => new Time(0, 60)).toThrow("Invalid minute");
  });

  it("minusMinutes", () => {
    expect(new Time(12, 30).minusMinutes(30).toString()).toEqual("12:00")
    expect(new Time(0, 30).minusMinutes(45).toString()).toEqual("23:45")
  })
});
