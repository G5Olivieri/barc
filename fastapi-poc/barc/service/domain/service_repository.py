from uuid import UUID
from decimal import Decimal
from dataclasses import dataclass
from abc import ABC, abstractmethod
from typing import List
from barc.service.domain.service import Service


@dataclass
class CreateService:
    name: str
    duration: int
    price: Decimal


class ServiceRepository(ABC):
    @abstractmethod
    async def get_all(self, skip=0, limit=10) -> List[Service]:
        raise RuntimeError("Method not implemented")

    @abstractmethod
    async def get_by_id(self, service_id: UUID) -> Service:
        raise RuntimeError("Method not implemented")

    @abstractmethod
    async def create(self, service: CreateService) -> UUID:
        raise RuntimeError("Method not implemented")
