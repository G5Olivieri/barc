from uuid import UUID, uuid4
from sqlalchemy.orm import Mapped, mapped_column
from barc.database.base import Base
from barc.client.domain.client import Client


class SQLAlchemyClient(Base):
    __tablename__ = "client"
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column()
    phone: Mapped[str] = mapped_column()

    def to_domain(self) -> Client:
        return Client(id=self.id, name=self.name, phone=self.phone)
