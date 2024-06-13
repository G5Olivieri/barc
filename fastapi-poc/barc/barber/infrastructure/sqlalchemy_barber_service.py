from uuid import UUID, uuid4

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from barc.barber.infrastructure.sqlalchemy_barber import SQLAlchemyBarber
from barc.database.base import Base
from barc.service.infrastructure.sqlalchemy_service import SQLAlchemyService


class SQLAlchemyBarberService(Base):
    __tablename__ = "barber_service"
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    barber_id: Mapped[UUID] = mapped_column(ForeignKey("barber.id"))
    service_id: Mapped[UUID] = mapped_column(ForeignKey("service.id"))
    barber: Mapped[SQLAlchemyBarber] = relationship("SQLAlchemyBarber")
    service: Mapped[SQLAlchemyService] = relationship("SQLAlchemyService")
