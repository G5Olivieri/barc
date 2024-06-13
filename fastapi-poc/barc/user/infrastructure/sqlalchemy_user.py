from datetime import datetime
from uuid import UUID, uuid4
from sqlalchemy.orm import mapped_column, Mapped
from barc.database.base import Base
from barc.user.domain.user import User


class SQLAlchemyUser(Base):
    __tablename__ = "user"
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    username: Mapped[str] = mapped_column(nullable=False, unique=True)
    password: Mapped[str] = mapped_column(nullable=False)

    created_at: Mapped[datetime] = mapped_column(default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(
        default=datetime.now, onupdate=datetime.now
    )

    @classmethod
    def from_domain(cls, user: User) -> "SQLAlchemyUser":
        return cls(user)

    def to_domain(self) -> User:
        return User(
            id=self.id,
            username=self.username,
            password=self.password,
        )
