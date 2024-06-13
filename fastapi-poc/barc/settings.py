from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    db_host: str
    db_port: str
    db_pass: str
    db_user: str
    db_name: str
    db_port: int
    jwt_secret: str
    jwt_algorithm: str