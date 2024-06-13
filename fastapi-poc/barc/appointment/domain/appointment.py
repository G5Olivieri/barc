from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

from barc.barber.domain.barber import Barber
from barc.client.domain.client import Client
from barc.service.domain.service import Service


@dataclass
class Appointment:
    id: UUID
    client: Client
    service: Service
    barber: Barber
    date_time: datetime


class LazyAppointment(Appointment):
    def __init__(
        self,
        id: UUID,
    ):
        self.id = id