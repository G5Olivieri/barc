from uuid import UUID
from dataclasses import dataclass
from abc import ABC, abstractmethod
from typing import List
from barc.barber.domain.barber import Barber
from barc.barber.domain.time_range import TimeRange


@dataclass
class CreateBarber:
    name: str
    weekdays: List[int]
    officehours: List[TimeRange]
    services: List[UUID]


class BarberRepository(ABC):
    @abstractmethod
    async def get_all(self, skip=0, limit=10) -> List[Barber]:
        raise RuntimeError("Method not implemented")

    @abstractmethod
    async def get_by_id(self, barber_id: UUID) -> Barber:
        raise RuntimeError("Method not implemented")

    @abstractmethod
    async def create(self, barber: CreateBarber) -> UUID:
        raise RuntimeError("Method not implemented")
