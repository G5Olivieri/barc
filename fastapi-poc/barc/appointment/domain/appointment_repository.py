from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import date, datetime
from typing import List
from uuid import UUID

from barc.appointment.domain.appointment import Appointment


@dataclass
class CreateAppointment:
    client_id: UUID
    service_id: UUID
    barber_id: UUID
    date_time: datetime


class AppointmentRepository(ABC):
    @abstractmethod
    async def get_all(self, skip=0, limit=10) -> List[Appointment]:
        raise RuntimeError("Method not implemented")

    @abstractmethod
    async def get_by_barber_id_on_date(
        self, barber_id: UUID, date: date
    ) -> List[Appointment]:
        raise RuntimeError("Method not implemented")

    @abstractmethod
    async def create(self, Appointment: CreateAppointment) -> UUID:
        raise RuntimeError("Method not implemented")
