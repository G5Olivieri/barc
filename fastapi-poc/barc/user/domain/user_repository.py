from typing import Optional
from abc import ABC, abstractmethod
from barc.user.domain.user import User


class UserRepository(ABC):
    @abstractmethod
    async def get_by_username(self, username: str) -> Optional[User]:
        raise RuntimeError("Not Implemented")
