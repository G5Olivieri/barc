from uuid import UUID, uuid4
from datetime import datetime
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from barc.barber.infrastructure.sqlalchemy_barber import SQLAlchemyBarber
from barc.client.infrastructure.sqlalchemy_client import SQLAlchemyClient
from barc.service.infrastructure.sqlalchemy_service import SQLAlchemyService
from barc.database.base import Base
from barc.appointment.domain.appointment import Appointment


class SQLAlchemyAppointment(Base):
    __tablename__ = "appointment"
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    client_id: Mapped[UUID] = mapped_column(ForeignKey("client.id"))
    barber_id: Mapped[UUID] = mapped_column(ForeignKey("barber.id"))
    service_id: Mapped[UUID] = mapped_column(ForeignKey("service.id"))
    date_time: Mapped[datetime] = mapped_column()

    client: Mapped[SQLAlchemyClient] = relationship("SQLAlchemyClient")
    service: Mapped[SQLAlchemyService] = relationship("SQLAlchemyService")
    barber: Mapped[SQLAlchemyBarber] = relationship("SQLAlchemyBarber")

    def to_domain(self) -> Appointment:
        return Appointment(
            id=self.id,
            client=self.client.to_domain(),
            barber=self.barber.to_domain(),
            service=self.service.to_domain(),
            date_time=self.date_time,
        )
