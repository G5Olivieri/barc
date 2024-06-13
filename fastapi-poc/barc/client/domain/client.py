from uuid import UUID
from dataclasses import dataclass


@dataclass
class Client:
    id: UUID
    name: str
    phone: str
