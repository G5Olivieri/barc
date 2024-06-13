from uuid import UUID, uuid4

from sqlalchemy.orm import Mapped, mapped_column

from barc.barber.domain.barber import Barber
from barc.barber.domain.time_range import TimeRange
from barc.database.base import Base


class SQLAlchemyBarber(Base):
    __tablename__ = "barber"
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column()
    weekdays: Mapped[str] = mapped_column()
    officehours: Mapped[str] = mapped_column()

    def to_domain(self) -> Barber:
        return Barber(
            id=self.id,
            name=self.name,
            weekdays=[int(x) for x in self.weekdays.split(",")],
            officehours=[TimeRange.from_string(h) for h in self.officehours.split(",")],
            services=[
                barber_service.service.to_domain()
                for barber_service in self.barber_service
            ],
        )
