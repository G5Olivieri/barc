from uuid import UUID
from datetime import date
from dataclasses import dataclass
from barc.barber.domain.time_range import TimeRange
from barc.service.domain.service import Service


@dataclass
class Barber:
    id: UUID
    name: str
    weekdays: list[int]
    officehours: list[TimeRange]
    services: list[Service]