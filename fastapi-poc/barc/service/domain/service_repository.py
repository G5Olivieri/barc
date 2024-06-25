from uuid import UUID
from abc import ABC, abstractmethod
from typing import List
from barc.service.domain.service import Service


class ServiceRepository(ABC):
    @abstractmethod
    async def get_all(self, skip=0, limit=10) -> List[Service]:
        raise RuntimeError("Method not implemented")

    @abstractmethod
    async def get_by_id(self, service_id: UUID) -> Service:
        raise RuntimeError("Method not implemented")

    @abstractmethod
    async def save(self, service: Service) -> UUID:
        raise RuntimeError("Method not implemented")
