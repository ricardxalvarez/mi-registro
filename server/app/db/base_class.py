import uuid
from sqlalchemy.ext.declarative import declared_attr, DeclarativeMeta
from sqlalchemy import Column, Date, func
from sqlalchemy.orm import as_declarative, declarative_base
from sqlalchemy.dialects.postgresql import UUID


Base: DeclarativeMeta = declarative_base()

@as_declarative()
class Base:
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, index=True)
    created_at = Column(Date, default=func.now())
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()
