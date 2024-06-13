from datetime import date
from typing import List
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from barc.appointment.domain.appointment import Appointment
from barc.appointment.domain.appointment_repository import (
    AppointmentRepository,
    CreateAppointment,
)
from barc.appointment.infrastructure.sqlalchemy_appointment import SQLAlchemyAppointment
from barc.barber.domain.barber import Barber
from barc.barber.infrastructure.sqlalchemy_barber import SQLAlchemyBarber
from barc.client.domain.client import Client
from barc.client.infrastructure.sqlalchemy_client import SQLAlchemyClient
from barc.service.domain.service import Service
from barc.service.infrastructure.sqlalchemy_service import SQLAlchemyService


class SQLAlchemyAppointmentRepository(AppointmentRepository):
    def __init__(self, session: async_sessionmaker[AsyncSession]):
        self.__session = session

    def __full_appointment_query(self):
        return (
            select(
                SQLAlchemyAppointment.id.label("appointment_id"),
                SQLAlchemyService.id.label("service_id"),
                SQLAlchemyService.name.label("service_name"),
                SQLAlchemyService.duration.label("service_duration"),
                SQLAlchemyService.price.label("service_price"),
                SQLAlchemyClient.id.label("client_id"),
                SQLAlchemyClient.name.label("client_name"),
                SQLAlchemyClient.phone.label("client_phone"),
                SQLAlchemyBarber.id.label("barber_id"),
                SQLAlchemyBarber.name.label("barber_name"),
                SQLAlchemyAppointment.date_time.label("appointment_date_time"),
            )
            .join(SQLAlchemyAppointment.service)
            .join(SQLAlchemyAppointment.client)
            .join(SQLAlchemyAppointment.barber)
        )

    def __map_from_full_query(self, row):
        return Appointment(
            id=row.appointment_id,
            service=Service(
                id=row.service_id,
                name=row.service_name,
                duration=row.service_duration,
                price=row.service_price,
            ),
            client=Client(
                id=row.client_id, name=row.client_name, phone=row.client_phone
            ),
            barber=Barber(
                id=row.barber_id,
                name=row.barber_name,
                weekdays=[],
                officehours=[],
                services=[],
            ),
            date_time=row.appointment_date_time,
        )

    async def get_all(self, skip=0, limit=10) -> list[Appointment]:
        async with self.__session() as session:
            stmt = self.__full_appointment_query().limit(limit).offset(skip)
            result = await session.execute(stmt)
            return [self.__map_from_full_query(row) for row in result]

    async def get_by_barber_id_on_date(
        self, barber_id: UUID, date: date
    ) -> List[Appointment]:
        async with self.__session() as session:
            stmt = (
                self.__full_appointment_query()
                .where(SQLAlchemyAppointment.barber_id == barber_id)
                .where(func.date(SQLAlchemyAppointment.date_time) == date)
            )
            result = await session.execute(stmt)
            return [self.__map_from_full_query(row) for row in result]

    async def create(self, create_appointment: CreateAppointment) -> UUID:
        async with self.__session() as session:
            appointment = SQLAlchemyAppointment(
                client_id=create_appointment.client_id,
                service_id=create_appointment.service_id,
                barber_id=create_appointment.barber_id,
                date_time=create_appointment.date_time.replace(tzinfo=None),
            )
            session.add(appointment)
            await session.commit()
            return appointment.id
