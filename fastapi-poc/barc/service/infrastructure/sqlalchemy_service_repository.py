from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker
from barc.service.infrastructure.sqlalchemy_service import SQLAlchemyService
from barc.service.domain.service import Service
from barc.service.domain.service_repository import ServiceRepository, CreateService


class SQLAlchemyServiceRepository(ServiceRepository):
    def __init__(self, session: async_sessionmaker[AsyncSession]):
        self.__session = session

    async def get_all(self, skip=0, limit=10) -> list[Service]:
        async with self.__session() as session:
            stmt = select(SQLAlchemyService).limit(limit).offset(skip)
            result = await session.execute(stmt)
            return [
                Service(
                    id=row[0].id,
                    name=row[0].name,
                    duration=row[0].duration,
                    price=row[0].price,
                )
                for row in result
            ]

    async def get_by_id(self, service_id: UUID) -> Service:
        async with self.__session() as session:
            stmt = select(SQLAlchemyService).where(SQLAlchemyService.id == service_id)
            result = await session.execute(stmt)
            row = result.scalar_one()
            return Service(
                id=row.id,
                name=row.name,
                duration=row.duration,
                price=row.price,
            )

    async def create(self, create_service: CreateService) -> UUID:
        async with self.__session() as session:
            service = SQLAlchemyService(**create_service.dict())
            session.add(service)
            await session.commit()
            return service.id
