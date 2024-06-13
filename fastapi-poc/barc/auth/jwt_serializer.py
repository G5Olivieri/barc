import jwt


class JWTSerializer:
    def __init__(self, secret_key: str, algorithm: str):
        self.__secret_key = secret_key
        self.__algorithm = algorithm

    def decode(self, token: str) -> dict:
        return jwt.decode(token, key=self.__secret_key, algorithms=[self.__algorithm])

    def encode(self, payload: dict) -> str:
        return jwt.encode(
            algorithm=self.__algorithm, key=self.__secret_key, payload=payload
        )
