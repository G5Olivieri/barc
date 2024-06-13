import asyncio
import uuid
from argon2 import PasswordHasher
from sqlalchemy import insert
from sqlalchemy.ext.asyncio import create_async_engine
from barc.user.infrastructure.sqlalchemy_user import SQLAlchemyUser


async def main():
    engine = create_async_engine(
        "postgresql+asyncpg://barc:barc@postgres/barc_dev", echo=True
    )
    ph = PasswordHasher()
    stmt = insert(SQLAlchemyUser).values(
        id=uuid.uuid4(), username="glayson", password=ph.hash("Glayson")
    )
    async with engine.begin() as conn:
        await conn.execute(stmt)
    await engine.dispose()


asyncio.run(main())
