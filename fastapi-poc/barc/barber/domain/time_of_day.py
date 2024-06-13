from datetime import datetime
from dataclasses import dataclass


@dataclass
class TimeOfDay:
    hour: int
    minute: int

    def __init__(self, hour: int, minute: int):
        if hour < 0 or hour > 23:
            raise ValueError("hour must be between 0 and 23")
        if minute < 0 or minute > 59:
            raise ValueError("minute must be between 0 and 59")
        self.hour = hour
        self.minute = minute

    @classmethod
    def from_string(cls, x: str) -> "TimeOfDay":
        hour, minute = x.split(":")
        return cls(int(hour), int(minute))

    @classmethod
    def from_datetime(cls, x: datetime) -> "TimeOfDay":
        return cls(x.hour, x.minute)

    def add_minutes(self, minutes: int) -> "TimeOfDay":
        total_minutes = self.hour * 60 + self.minute + minutes
        return TimeOfDay((total_minutes // 60) % 24, total_minutes % 60)

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, TimeOfDay):
            return False
        return self.hour == other.hour and self.minute == other.minute

    def __lt__(self, other: object) -> bool:
        if not isinstance(other, TimeOfDay):
            return False
        return self.hour < other.hour or (
            self.hour == other.hour and self.minute < other.minute
        )

    def __gt__(self, other: object) -> bool:
        if not isinstance(other, TimeOfDay):
            return False
        return self.hour > other.hour or (
            self.hour == other.hour and self.minute > other.minute
        )

    def __hash__(self) -> int:
        return hash((self.hour, self.minute))

    def __str__(self) -> str:
        return f"{self.hour:02d}:{self.minute:02d}"
