from uuid import UUID, uuid4
from decimal import Decimal
from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.responses import Response
from pydantic import BaseModel

from barc.auth.dependencies import get_current_user
from barc.user.domain.user import User
from barc.service.domain.service import Service
from barc.dependencies import get_service_repository
from barc.service.domain.service_repository import ServiceRepository

routers = APIRouter(prefix="/services", tags=["services"])


class CreateServiceRequest(BaseModel):
    name: str
    price: Decimal
    duration: int


class UpdateServiceRequest(BaseModel):
    name: str
    price: Decimal
    duration: int


@routers.get("")
async def get_services(
    service_repository: Annotated[ServiceRepository, Depends(get_service_repository)],
):
    return await service_repository.get_all()


@routers.post("")
async def create_service(
    create_service_request: CreateServiceRequest,
    user: Annotated[User, Depends(get_current_user)],
    service_repository: Annotated[ServiceRepository, Depends(get_service_repository)],
):
    service = Service(
        id=uuid4(),
        name=create_service_request.name,
        price=create_service_request.price,
        duration=create_service_request.duration,
    )
    service_id = await service_repository.save(service)
    return Response(
        status_code=201,
        headers={"location": f"/appointments/services/{str(service_id)}"},
    )


@routers.get("/{service_id}")
async def get_service(
    service_id: UUID,
    service_repository: Annotated[ServiceRepository, Depends(get_service_repository)],
):
    return await service_repository.get_by_id(service_id)


@routers.put("/{service_id}")
async def update_service(
    service_id: UUID,
    update_service: UpdateServiceRequest,
    user: Annotated[User, Depends(get_current_user)],
    service_repository: Annotated[ServiceRepository, Depends(get_service_repository)],
):
    service = await service_repository.get_by_id(service_id)
    if not service:
        return Response(status_code=404)
    service.name = update_service.name
    service.price = update_service.price
    service.duration = update_service.duration
    await service_repository.save(service)
    return Response(
        status_code=201,
        headers={"location": f"/appointments/services/{str(service_id)}"},
    )
    return {"service_id": service_id}


@routers.delete("/{service_id}")
async def delete_service(service_id: int):
    return {"service_id": service_id}
