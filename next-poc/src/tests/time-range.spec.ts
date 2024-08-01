import { Time } from "@/time";
import { TimeRange } from "@/time-range";

describe("Time", () => {
  it("spread", () => {
    const start = newTime(8, 0);
    const end = newTime(12, 0);
    const step = 30;
    const timeRange = newTimeRange(start, end);
    const result = timeRange.spread(step);
    expect(result).toHaveLength(8);
    expect(result[0].toString()).toBe("08:00");
    expect(result[1].toString()).toBe("08:30");
    expect(result[2].toString()).toBe("09:00");
    expect(result[3].toString()).toBe("09:30");
    expect(result[4].toString()).toBe("10:00");
    expect(result[5].toString()).toBe("10:30");
    expect(result[6].toString()).toBe("11:00");
    expect(result[7].toString()).toBe("11:30");
  });

  it("parseWorkTime", () => {
    const workTime = "08:00-12:00";
    const timeRange = TimeRange.fromString(workTime);
    expect(timeRange.start.toString()).toBe("08:00");
    expect(timeRange.end.toString()).toBe("12:00");
  });

  it("parseWorkTime whitespace", () => {
    const workTime = "08:00 - 12:00";
    const timeRange = TimeRange.fromString(workTime);
    expect(timeRange.start.toString()).toBe("08:00");
    expect(timeRange.end.toString()).toBe("12:00");
  });
});
