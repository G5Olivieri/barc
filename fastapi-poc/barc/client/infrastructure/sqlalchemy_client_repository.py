from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from barc.client.domain.client import Client
from barc.client.domain.client_repository import (
    ClientRepository,
    CreateClient,
)
from barc.client.infrastructure.sqlalchemy_client import SQLAlchemyClient


class SQLAlchemyClientRepository(ClientRepository):
    def __init__(self, session: async_sessionmaker[AsyncSession]):
        self.__session = session

    async def get_all(self, skip=0, limit=10) -> list[Client]:
        async with self.__session() as session:
            stmt = select(SQLAlchemyClient).limit(limit).offset(skip)
            result = await session.execute(stmt)
            return [row[0].to_domain() for row in result]

    async def create(self, create_client: CreateClient) -> UUID:
        async with self.__session() as session:
            client = SQLAlchemyClient(**create_client.dict())
            session.add(client)
            await session.commit()
            return client.id
