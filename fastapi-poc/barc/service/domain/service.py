from uuid import UUID
from dataclasses import dataclass
from decimal import Decimal


@dataclass
class Service:
    id: UUID
    name: str
    price: Decimal
    duration: int
