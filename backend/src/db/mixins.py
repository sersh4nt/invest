import uuid
from datetime import datetime

from sqlalchemy import BigInteger, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column


class AuditMixin:
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class IntegerIDPKMixin:
    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, index=True)


class UUIDPKMixin:
    id: Mapped[uuid.UUID] = mapped_column(UUID, primary_key=True, index=True)
