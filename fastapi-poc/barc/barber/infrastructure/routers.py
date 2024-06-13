from datetime import date, datetime, timezone 
from typing import Annotated, List
from uuid import UUID

from fastapi import APIRouter, Depends, Response
from pydantic import BaseModel

from barc.appointment.domain.appointment_repository import AppointmentRepository
from barc.auth.dependencies import get_current_user
from barc.barber.domain.barber_repository import BarberRepository
from barc.barber.domain.time_of_day import TimeOfDay
from barc.barber.domain.time_range import TimeRange
from barc.dependencies import (
    get_appointment_repository,
    get_barber_repository,
    get_service_repository,
)
from barc.user.domain.user import User
from barc.service.domain.service_repository import ServiceRepository
from barc.service.domain.service import Service
from barc.appointment.domain.appointment import Appointment

routers = APIRouter(prefix="/barbers", tags=["barbers"])


@routers.get("")
async def get_barbers(
    barber_repository: Annotated[BarberRepository, Depends(get_barber_repository)],
):
    return await barber_repository.get_all()


class CreateBarberRequest(BaseModel):
    name: str
    weekdays: List[int]
    officehours: List[TimeRange]
    services: List[UUID]


@routers.post("")
async def create_barber(
    create_barber_request: CreateBarberRequest,
    user: Annotated[User, Depends(get_current_user)],
    barber_repository: Annotated[BarberRepository, Depends(get_barber_repository)],
):
    barber_id = await barber_repository.create(create_barber_request)
    return Response(
        status_code=201,
        headers={"location": f"/appointments//barbers/{str(barber_id)}"},
    )


@routers.get("/{barber_id}")
async def get_barber(
    barber_id: UUID,
    barber_repository: Annotated[BarberRepository, Depends(get_barber_repository)],
):
    return await barber_repository.get_by_id(barber_id)


def validate_from_appointment(
    time: TimeOfDay, time_range_end: TimeOfDay, appointment: Appointment, service: Service
):
    if time_range_end < time.add_minutes(service.duration):
        return False
    appointment_time = TimeOfDay.from_datetime(appointment.date_time)
    if (
        time == appointment_time
        and time.add_minutes(service.duration) == appointment_time
    ):
        return False
    if TimeRange(time, time.add_minutes(service.duration)).is_between(appointment_time):
        return False
    if TimeRange(
        appointment_time, appointment_time.add_minutes(appointment.service.duration)
    ).is_between(time):
        return False
    return True


def validate_availability(
    time: TimeOfDay, time_range_end: TimeOfDay, appointments: List[Appointment], service: Service
):
    return all([validate_from_appointment(time, time_range_end, a, service) for a in appointments])


@routers.get("/{barber_id}/availability")
async def get_barber_availability(
    barber_id: UUID,
    service_id: UUID,
    date: date,
    barber_repository: Annotated[BarberRepository, Depends(get_barber_repository)],
    service_repository: Annotated[ServiceRepository, Depends(get_service_repository)],
    appointment_repository: Annotated[
        AppointmentRepository, Depends(get_appointment_repository)
    ],
):
    barber = await barber_repository.get_by_id(barber_id)
    if barber is None:
        return Response(status_code=404)
    service = await service_repository.get_by_id(service_id)
    if service is None:
        return Response(status_code=404)
    appointments = await appointment_repository.get_by_barber_id_on_date(
        barber_id, date
    )
    weekday = date.weekday() + 1
    if weekday == 7:
        weekday = 0
    if weekday not in barber.weekdays:
        return []
    availabilities = []
    now = datetime.now(timezone.utc)
    time_of_day = TimeOfDay(now.hour - 3, 0)
    for time_range in barber.officehours:
        if time_range.end < time_of_day:
            continue
        if time_range.start < time_of_day:
            time_range.start = time_of_day
        availabilities.extend(
            [
                t
                for t in time_range.spread(30)
                if validate_availability(t, time_range.end, appointments, service)
            ]
        )
    return availabilities


@routers.put("/{barber_id}")
async def update_barber(barber_id: int):
    return {"barber_id": barber_id}


@routers.delete("/{barber_id}")
async def delete_barber(barber_id: int):
    return {"barber_id": barber_id}
