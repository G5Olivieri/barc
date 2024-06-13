from datetime import datetime
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi.responses import Response
from pydantic import BaseModel

from barc.client.domain.client_repository import ClientRepository
from barc.appointment.domain.appointment_repository import (
    AppointmentRepository,
    CreateAppointment,
)
from barc.auth.dependencies import get_current_user
from barc.dependencies import get_appointment_repository, get_client_repository
from barc.user.domain.user import User

routers = APIRouter(prefix="/appointments", tags=["appointments"])


@routers.get("")
async def get_appointments(
    appointment_repository: Annotated[
        AppointmentRepository, Depends(get_appointment_repository)
    ],
):
    return await appointment_repository.get_all()


class CreateClientRequest(BaseModel):
    name: str
    phone: str


class CreateAppointmentRequest(BaseModel):
    client: CreateClientRequest
    service_id: UUID
    barber_id: UUID
    date_time: datetime


@routers.post("")
async def create_appointment(
    appointment: CreateAppointmentRequest,
    appointment_repository: Annotated[
        AppointmentRepository, Depends(get_appointment_repository)
    ],
    client_repository: Annotated[ClientRepository, Depends(get_client_repository)],
):
    client_id = await client_repository.create(appointment.client)
    appointment_id = await appointment_repository.create(
        CreateAppointment(
            service_id=appointment.service_id,
            barber_id=appointment.barber_id,
            client_id=client_id,
            date_time=appointment.date_time,
        )
    )
    return Response(
        status_code=201, headers={"location": f"/appointments/{str(appointment_id)}"}
    )
