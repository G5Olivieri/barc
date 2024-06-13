from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import List
from uuid import UUID

from barc.client.domain.client import Client


@dataclass
class CreateClient:
    name: str
    phone: str


class ClientRepository(ABC):
    @abstractmethod
    async def get_all(self, skip=0, limit=10) -> List[Client]:
        raise RuntimeError("Method not implemented")

    @abstractmethod
    async def create(self, Client: CreateClient) -> UUID:
        raise RuntimeError("Method not implemented")
