from uuid import UUID

from sqlalchemy import insert, select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from barc.barber.domain.barber import Barber
from barc.barber.domain.barber_repository import BarberRepository, CreateBarber
from barc.barber.domain.time_range import TimeRange
from barc.barber.infrastructure.sqlalchemy_barber import SQLAlchemyBarber
from barc.barber.infrastructure.sqlalchemy_barber_service import (
    SQLAlchemyBarberService,
)
from barc.service.domain.service import Service
from barc.service.infrastructure.sqlalchemy_service import SQLAlchemyService


class SQLAlchemyBarberRepository(BarberRepository):
    def __init__(self, session: async_sessionmaker[AsyncSession]):
        self.__session = session

    async def get_all(self, skip=0, limit=10) -> list[Barber]:
        async with self.__session() as session:
            stmt = (
                select(
                    SQLAlchemyBarber.id,
                    SQLAlchemyBarber.name,
                    SQLAlchemyBarber.weekdays,
                    SQLAlchemyBarber.officehours,
                    SQLAlchemyService.id,
                    SQLAlchemyService.name,
                    SQLAlchemyService.price,
                    SQLAlchemyService.duration,
                )
                .select_from(SQLAlchemyBarber)
                .join(SQLAlchemyBarberService)
                .join(SQLAlchemyBarberService.service)
                .limit(limit)
                .offset(skip)
            )
            result = await session.execute(stmt)
            data = {}
            for row in result:
                barber = data.get(row[0])
                barber = (
                    Barber(
                        id=row[0],
                        name=row[1],
                        weekdays=[int(x) for x in row[2].split(",")],
                        officehours=[
                            TimeRange.from_string(x) for x in row[3].split(",")
                        ],
                        services=[],
                    )
                    if barber is None
                    else barber
                )
                barber.services.append(
                    Service(id=row[4], name=row[5], price=row[6], duration=row[7])
                )
                data[row[0]] = barber
            return list(data.values())

    async def get_by_id(self, barber_id: UUID) -> Barber:
        async with self.__session() as session:
            stmt = (
                select(
                    SQLAlchemyBarber.id,
                    SQLAlchemyBarber.name,
                    SQLAlchemyBarber.weekdays,
                    SQLAlchemyBarber.officehours,
                    SQLAlchemyService.id,
                    SQLAlchemyService.name,
                    SQLAlchemyService.price,
                    SQLAlchemyService.duration,
                )
                .select_from(SQLAlchemyBarber)
                .join(SQLAlchemyBarberService)
                .join(SQLAlchemyBarberService.service)
                .where(SQLAlchemyBarber.id == barber_id)
            )
            result = await session.execute(stmt)
            barber = None
            for row in result:
                barber = (
                    Barber(
                        id=row[0],
                        name=row[1],
                        weekdays=[int(x) for x in row[2].split(",")],
                        officehours=[
                            TimeRange.from_string(x) for x in row[3].split(",")
                        ],
                        services=[],
                    )
                    if barber is None
                    else barber
                )
                barber.services.append(
                    Service(id=row[4], name=row[5], price=row[6], duration=row[7])
                )
            return barber

    async def create(self, barber: CreateBarber) -> UUID:
        async with self.__session() as session:
            stmt = (
                insert(SQLAlchemyBarber)
                .values(
                    name=barber.name,
                    weekdays=",".join(str(x) for x in barber.weekdays),
                    officehours=",".join(str(x) for x in barber.officehours),
                )
                .returning(SQLAlchemyBarber.id)
                .execution_options(synchronize_session="fetch")
            )
            result = await session.execute(stmt)
            inserted_id = result.scalar()
            if not inserted_id:
                return False
            stmt = insert(SQLAlchemyBarberService).values(
                [
                    {
                        "barber_id": inserted_id,
                        "service_id": service_id,
                    }
                    for service_id in barber.services
                ]
            )
            await session.execute(stmt)
            await session.commit()
            return inserted_id
