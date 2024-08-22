import { Time } from "@/time";

describe("Time", () => {
  it("toString", () => {
    expect(newTime(8, 0).toString()).toBe("08:00");
    expect(newTime(9, 30).toString()).toBe("09:30");
    expect(newTime(9, 3).toString()).toBe("09:03");
    expect(newTime(19, 3).toString()).toBe("19:03");
  });

  it("fromString", () => {
    expect(buildTimeFromString("08:00")).toEqual(newTime(8, 0));
    expect(buildTimeFromString("8:0")).toEqual(newTime(8, 0));
    expect(buildTimeFromString("09:30")).toEqual(newTime(9, 30));
    expect(buildTimeFromString("9:30")).toEqual(newTime(9, 30));
    expect(buildTimeFromString("09:03")).toEqual(newTime(9, 3));
    expect(buildTimeFromString("9:3")).toEqual(newTime(9, 3));
    expect(buildTimeFromString("19:03")).toEqual(newTime(19, 3));
  });

  it("addMinutes", () => {
    const time = newTime(0, 0);
    expect(time.toString()).toBe("00:00");
    expect(addMinutes(time, 72 * 60).toString()).toBe("00:00");
    expect(addMinutes(time, 60).toString()).toBe("01:00");
    expect(addMinutes(time, 59).toString()).toBe("00:59");
  });

  it("isAfter", () => {
    const time = newTime(10, 0);
    expect(time.isAfter(time, newTime(0, 0))).toBe(true);
    expect(time.isAfter(time, newTime(9, 59))).toBe(true);
    expect(time.isAfter(time, newTime(10, 1))).toBe(false);
    expect(time.isAfter(time, newTime(23, 59))).toBe(false);
    expect(time.isAfter(time, newTime(10, 0))).toBe(false);
  });

  it("isBefore", () => {
    const time = newTime(10, 0);
    expect(time.isBefore(time, newTime(0, 0))).toBe(false);
    expect(time.isBefore(time, newTime(9, 59))).toBe(false);
    expect(time.isBefore(time, newTime(10, 1))).toBe(true);
    expect(time.isBefore(time, newTime(23, 59))).toBe(true);
    expect(time.isBefore(time, newTime(10, 0))).toBe(false);
  });

  it("toDate", () => {
    expect(
      newTime(12, 0)
        .toDate(new Date("2024-04-21T00:00:00.000Z"))
        .toISOString(),
    ).toEqual("2024-04-21T12:00:00.000Z");
  });

  it("invalid hour", () => {
    expect(() => newTime(-1, 0)).toThrow("Invalid hour");
    expect(() => newTime(24, 0)).toThrow("Invalid hour");
  });

  it("invalid minute", () => {
    expect(() => newTime(0, -1)).toThrow("Invalid minute");
    expect(() => newTime(0, 60)).toThrow("Invalid minute");
  });

  it("minusMinutes", () => {
    expect(newTime(12, 30).minusMinutes(30).toString()).toEqual("12:00")
    expect(newTime(0, 30).minusMinutes(45).toString()).toEqual("23:45")
  })
});
