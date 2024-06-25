from uuid import UUID, uuid4
from decimal import Decimal

from sqlalchemy.orm import Mapped, mapped_column, relationship
from barc.database.base import Base
from barc.service.domain.service import Service


class SQLAlchemyService(Base):
    __tablename__ = "service"
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column()
    price: Mapped[Decimal] = mapped_column()
    duration: Mapped[int] = mapped_column()

    def to_domain(self) -> Service:
        return Service(
            id=self.id, name=self.name, price=self.price, duration=self.duration
        )

    @classmethod
    def from_domain(cls, service: Service) -> "SQLAlchemyService":
        return cls(
            id=service.id,
            name=service.name,
            price=service.price,
            duration=service.duration,
        )
