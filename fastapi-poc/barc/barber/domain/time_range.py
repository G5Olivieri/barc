from typing import Iterator
from dataclasses import dataclass
from barc.barber.domain.time_of_day import TimeOfDay


@dataclass
class TimeRange:
    start: TimeOfDay
    end: TimeOfDay

    @classmethod
    def from_string(cls, x: str) -> "TimeRange":
        start, end = x.split("-")
        return cls(TimeOfDay.from_string(start), TimeOfDay.from_string(end))

    def spread(self, step=30) -> Iterator[TimeOfDay]:
        current = self.start
        times = []
        while current < self.end:
            times.append(current)
            current = current.add_minutes(step)
            if len(times) > 24 * 60 / step:
                return times
        return times

    def is_between(self, time: TimeOfDay) -> bool:
        return self.start < time < self.end

    def __str__(self) -> str:
        return f"{self.start}-{self.end}"
