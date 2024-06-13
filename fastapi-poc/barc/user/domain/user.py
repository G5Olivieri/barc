from uuid import UUID
from dataclasses import dataclass


@dataclass
class User:
    id: UUID
    username: str
    password: str
