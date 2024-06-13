from abc import ABC, abstractmethod


class PasswordService(ABC):
    @abstractmethod
    def hash(self, password: str) -> str:
        raise RuntimeError("Not Implemented")

    @abstractmethod
    def verify(self, hashed: str, password: str) -> bool:
        raise RuntimeError("Not Implemented")
