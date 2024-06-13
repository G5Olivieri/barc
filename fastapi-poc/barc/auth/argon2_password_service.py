import argon2
from barc.auth.password_service import PasswordService


class Argon2PasswordService(PasswordService):
    def __init__(self, hasher: argon2.PasswordHasher) -> None:
        self.__hasher = hasher

    def hash(self, password: str) -> str:
        return self.__hasher.hash(password)

    def verify(self, hash: str, password: str) -> bool:
        try:
            return self.__hasher.verify(hash, password)
        except argon2.exceptions.VerifyMismatchError:
            return False
