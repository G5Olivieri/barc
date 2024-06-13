from typing import Annotated

from fastapi import Depends
from sqlalchemy import URL
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from barc.appointment.domain.appointment_repository import AppointmentRepository
from barc.appointment.infrastructure.sqlalchemy_appointment_repository import (
    SQLAlchemyAppointmentRepository,
)
from barc.barber.domain.barber_repository import BarberRepository
from barc.barber.infrastructure.sqlalchemy_barber_repository import (
    SQLAlchemyBarberRepository,
)
from barc.client.domain.client_repository import ClientRepository
from barc.client.infrastructure.sqlalchemy_client_repository import (
    SQLAlchemyClientRepository,
)
from barc.service.domain.service_repository import ServiceRepository
from barc.service.infrastructure.sqlalchemy_service_repository import (
    SQLAlchemyServiceRepository,
)
from barc.settings import Settings
from barc.user.domain.user_repository import UserRepository
from barc.user.infrastructure.sqlalchemy_user_repository import SQLAlchemyUserRepository

_settings = None
_async_session = None
_engine = None


def get_settings():
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings


def get_db_engine(settings: Annotated[Settings, Depends(get_settings)]) -> AsyncEngine:
    global _engine
    if _engine is None:
        _engine = create_async_engine(
            URL.create(
                "postgresql+asyncpg",
                username=settings.db_user,
                password=settings.db_pass,
                host=settings.db_host,
                port=settings.db_port,
                database=settings.db_name,
            ),
            echo=True,
        )
    return _engine


def get_db_session(
    engine: Annotated[AsyncEngine, Depends(get_db_engine)],
) -> async_sessionmaker[AsyncSession]:
    global _async_session
    if _async_session is None:
        _async_session = async_sessionmaker(engine, expire_on_commit=False)
    return _async_session


def get_user_repository(
    session: Annotated[async_sessionmaker[AsyncSession], Depends(get_db_session)],
) -> UserRepository:
    return SQLAlchemyUserRepository(session)


def get_barber_repository(
    session: Annotated[async_sessionmaker[AsyncSession], Depends(get_db_session)],
) -> BarberRepository:
    return SQLAlchemyBarberRepository(session)


def get_service_repository(
    session: Annotated[async_sessionmaker[AsyncSession], Depends(get_db_session)],
) -> ServiceRepository:
    return SQLAlchemyServiceRepository(session)


def get_appointment_repository(
    session: Annotated[async_sessionmaker[AsyncSession], Depends(get_db_session)],
) -> AppointmentRepository:
    return SQLAlchemyAppointmentRepository(session)


def get_client_repository(
    session: Annotated[async_sessionmaker[AsyncSession], Depends(get_db_session)],
) -> ClientRepository:
    return SQLAlchemyClientRepository(session)
