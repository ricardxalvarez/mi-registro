from app.db.base_class import Base
import app.db.enums as Enums
from sqlalchemy import Column, or_, and_, DATE, JSON, String, LargeBinary, ARRAY, ForeignKey, VARCHAR, Boolean, Date, SMALLINT, DOUBLE_PRECISION, CheckConstraint, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

class Region(Base):
    __tablename__ = 'region'
    
    region_name = Column(VARCHAR(20), nullable=False)

class Province(Base):
    __tablename__ = 'province'
    
    region_id = Column(UUID(as_uuid=True), ForeignKey('region.id'), nullable=False)
    province_name = Column(VARCHAR(30), nullable=False)
    
    region = relationship("Region")

class Municipality(Base):
    __tablename__ = 'municipality'
    
    province_id = Column(UUID(as_uuid=True), ForeignKey('province.id'), nullable=False)
    region_id = Column(UUID(as_uuid=True), ForeignKey('region.id'), nullable=False)
    municipality_name = Column(VARCHAR(30), nullable=False)
    
    province = relationship("Province")
    region = relationship("Region")

class MunicipalDistrict(Base):
    __tablename__ = 'municipal_district'
    
    region_id = Column(UUID(as_uuid=True), ForeignKey('region.id'), nullable=False)
    municipality_id = Column(UUID(as_uuid=True), ForeignKey('municipality.id'), nullable=False)
    province_id = Column(UUID(as_uuid=True), ForeignKey('province.id'), nullable=False)
    municipal_district_name = Column(VARCHAR(40), nullable=False)
    
    region = relationship("Region")
    municipality = relationship("Municipality")
    province = relationship("Province")

class Neighborhood(Base):
    __tablename__ = 'neighborhood'
    
    region_id = Column(UUID(as_uuid=True), ForeignKey('region.id'), nullable=False)
    municipality_id = Column(UUID(as_uuid=True), ForeignKey('municipality.id'), nullable=False)
    province_id = Column(UUID(as_uuid=True), ForeignKey('province.id'), nullable=False)
    municipal_district_id = Column(UUID(as_uuid=True), ForeignKey('municipal_district.id'), nullable=False)
    neighborhood_name = Column(VARCHAR(40), nullable=False)

    region = relationship("Region")
    municipality = relationship("Municipality")
    province = relationship("Province")
    municipal_district = relationship("MunicipalDistrict")

class Subneighborhood(Base):
    __tablename__ = 'subneighborhood'
    
    region_id = Column(UUID(as_uuid=True), ForeignKey('region.id'), nullable=False)
    municipality_id = Column(UUID(as_uuid=True), ForeignKey('municipality.id'), nullable=False)
    province_id = Column(UUID(as_uuid=True), ForeignKey('province.id'), nullable=False)
    municipal_district_id = Column(UUID(as_uuid=True), ForeignKey('municipal_district.id'), nullable=False)
    neighborhood_id = Column(UUID(as_uuid=True), ForeignKey('neighborhood.id'), nullable=False)
    subneighborhood_name = Column(VARCHAR(40), nullable=False)

    region = relationship("Region")
    municipality = relationship("Municipality")
    province = relationship("Province")
    municipal_district = relationship("MunicipalDistrict")
    neighborhood = relationship('Neighborhood')

class Regional(Base):
    __tablename__ = 'regional'

    regional = Column(VARCHAR(20), nullable=False)

class EducationalDistrict(Base):
    __tablename__ = 'educational_district'

    regional_id = Column(UUID(as_uuid=True), ForeignKey('regional.id'), nullable=False)
    educational_district = Column(VARCHAR(20), nullable=False)

    regional = relationship('Regional')