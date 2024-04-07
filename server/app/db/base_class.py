import uuid
from sqlalchemy.ext.declarative import declared_attr, DeclarativeMeta
from sqlalchemy import Column, Date, func
from sqlalchemy.orm import as_declarative, declarative_base
from sqlalchemy.dialects.postgresql import UUID

@as_declarative()
class Base:
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.uuid_generate_v4(), unique=True, index=True)
    created_at = Column(Date, server_default=func.now())  # Added parentheses
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()