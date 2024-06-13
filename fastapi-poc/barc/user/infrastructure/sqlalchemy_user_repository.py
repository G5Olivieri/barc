from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker
from barc.user.domain.user import User
from barc.user.domain.user_repository import UserRepository
from barc.user.infrastructure.sqlalchemy_user import SQLAlchemyUser


class SQLAlchemyUserRepository(UserRepository):
    def __init__(self, sessionmaker: async_sessionmaker[AsyncSession]):
        self._sessionmaker = sessionmaker

    async def get_by_username(self, username: str) -> User:
        async with self._sessionmaker() as session:
            result = await session.execute(
                select(SQLAlchemyUser).filter(SQLAlchemyUser.username == username)
            )
            user = result.scalars().first()
            return user.to_domain() if user else None
