import uuid
import os
from datetime import datetime
from app.db.base_class import Base
import app.db.enums as Enums
from sqlalchemy import Column, or_, and_, DATE, DateTime, JSON, String, LargeBinary, ARRAY, ForeignKey, VARCHAR, Boolean, Date, SMALLINT, DOUBLE_PRECISION, CheckConstraint, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.models.location import *
from app.db.models.grades import *
from app.db.models.grades_artec import *
from app.db.models.utils import *

class Admins(Base):
    __tablename__ = "admins"

    center_id = Column(UUID(as_uuid=True), ForeignKey('center.id'), nullable=False)

    name = Column(VARCHAR(40), nullable=False)
    role = Column(Enums.AdminRole, nullable=False)
    username = Column(VARCHAR(75), unique=True, nullable=False, index=True)
    lastName = Column(VARCHAR(40), nullable=False)
    password = Column(LargeBinary, nullable=False)
    identification = Column(String, nullable=False)
    pic = Column(String)
    gender = Column(Enums.Gender, nullable=False)
    email = Column(VARCHAR(70), unique=True, nullable=False)
    age = Column(DOUBLE_PRECISION)
    nationality = Column(Enums.Country, nullable=False)
    civil_status = Column(Enums.CivilStatus, nullable=False)
    address = Column(VARCHAR(500), nullable=False)
    # academic
    years_of_service = Column(DOUBLE_PRECISION)
    expertise = Column(VARCHAR(120))
    degree = Column(VARCHAR(175))
    current_studies = Column(VARCHAR(125))
    # labor
    rank = Column(VARCHAR(125))
    __table_args__ = (
        CheckConstraint('age >= 18 AND age <= 120', name='admin_check_age'),
    )

class Teachers(Base):
    __tablename__ = "teachers"

    center_id = Column(UUID(as_uuid=True), ForeignKey('center.id'), nullable=False)

    name = Column(VARCHAR(40), nullable=False)
    lastName = Column(VARCHAR(40), nullable=False)
    password = Column(LargeBinary, nullable=False)
    username = Column(VARCHAR(75), nullable=False, unique=True, index=True)
    identification = Column(String, nullable=False)
    pic = Column(String)
    gender = Column(Enums.Gender, nullable=False)
    email = Column(VARCHAR(70), nullable=False, unique=True)
    age = Column(DOUBLE_PRECISION)
    nationality = Column(Enums.Country, nullable=False)
    civil_status = Column(Enums.CivilStatus, nullable=False)
    address = Column(VARCHAR(500), nullable=False)
    # academic
    years_of_service = Column(DOUBLE_PRECISION)
    expertise = Column(VARCHAR(120))
    degree = Column(VARCHAR(175))
    current_studies = Column(VARCHAR(125))
    __table_args__ = (
        CheckConstraint('age >= 18 AND age <= 120', name='teacher_check_age'),
        CheckConstraint('years_of_service >= 0 AND years_of_service <= 80', name='admi_check_years'),
    )

class Students(Base):
    __tablename__ = "students"

    center_id = Column(UUID(as_uuid=True), ForeignKey('center.id'), nullable=False)

    name = Column(VARCHAR(40), nullable=False)
    lastName = Column(VARCHAR(40), nullable=False)
    password = Column(LargeBinary, nullable=False)
    username = Column(VARCHAR(75), nullable=False, unique=True, index=True)
    identification = Column(String, nullable=False)
    RNE = Column(VARCHAR(255), nullable=False)
    pic = Column(String)
    gender = Column(Enums.Gender, nullable=False)
    address = Column(VARCHAR(500), nullable=False)
    nationality = Column(Enums.Country, nullable=False)
    civil_status = Column(Enums.CivilStatus, nullable=False)
    birth = Column(Date, nullable=False)
    email = Column(String, index=True, unique=True)
    birth_place = Column(VARCHAR(255), nullable=False)
    lives_with = Column(Enums.LivesWith, nullable=False)
        # lives_with is "otro"
    lives_with_name = Column(VARCHAR(75))
    lives_with_lastName = Column(VARCHAR(75))
    lives_with_relationship = Column(VARCHAR(75))
    lives_with_address = Column(VARCHAR(255))
    lives_with_phone = Column(VARCHAR(75))
    lives_with_email = Column(VARCHAR(75))
    lives_with_job = Column(VARCHAR(155))
    lives_with_job_address = Column(VARCHAR(255))
        # array of numbers, length must be equal to brothers_quantity
    siblings_quantity = Column(SMALLINT)
    siblings_ages = Column(ARRAY(DOUBLE_PRECISION))
    sibling_place = Column(VARCHAR(255))
    
    # if level is 'primario' or 'secundario'
    student_status = Column(Enums.StudentStatus)
    enrolled_at = Column(Date)
    removed_at = Column(Date)
    promoted = Column(Boolean)

    document = relationship('Documents')
    health = relationship('Health')
    __table_args__ = (
        CheckConstraint(
            or_(
                lives_with != 'otro',
                and_(
                    lives_with == 'otro',
                    lives_with_name.isnot(None),
                    lives_with_lastName.isnot(None),
                    lives_with_relationship.isnot(None),
                    lives_with_address.isnot(None),
                    lives_with_phone.isnot(None),
                    lives_with_email.isnot(None),
                    lives_with_job.isnot(None),
                    lives_with_job_address.isnot(None),
                )
            ),
            name='check_lives_with_columns'
        ),
    )


class Documents(Base):
    __tablename__ = 'documents'

    student_id = Column(UUID(as_uuid=True), ForeignKey('students.id'), unique=True, nullable=False)

    birth_certificate = Column(String)
    birth_warrant = Column(String)
    family_letter = Column(String)
    behavior_letter = Column(String)
    father_id = Column(String)
    mother_id = Column(String)
    evlc_sicometric = Column(String)
    photo = Column(String)
    form_inscription = Column(String)
    admission_test = Column(String)
    health_insurance = Column(String)
    vaccination_card = Column(String)
    id_card = Column(String)
    passport = Column(String)

class Health(Base):
    __tablename__ = 'health'

    student_id = Column(UUID(as_uuid=True), ForeignKey('students.id'), unique=True, nullable=False)

    emergency_name = Column(VARCHAR(75), nullable=False)
    emergency_phone = Column(VARCHAR(75), nullable=False)
    emergency_identification = Column(VARCHAR(155), nullable=False)
    alergies = Column(VARCHAR(255), nullable=False)
    medicines = Column(VARCHAR(255), nullable=False)
    disabilities = Column(VARCHAR(255), nullable=False)
    doctor_name = Column(VARCHAR(75))
    doctor_phone = Column(VARCHAR(75))
    doctor_exequatur = Column(VARCHAR(255))
        # vaccines
    tuberculosis = Column(DATE)
    hepatitis = Column(DATE)
    rotavirus = Column(JSON)
    influenza = Column(JSON)
    spr_12 = Column(DATE)
    neumoco = Column(DATE)
    spr_18 = Column(DATE)
    bopv_dpt_tdan = Column(JSON)
    bopv_dpt_dt = Column(JSON)
    covid = Column(JSON)
    vph = Column(JSON)
    dt = Column(JSON)
    pregnant_tdan = Column(DATE)
    pregnant_dt = Column(DATE)
    pregnant_influenza = Column(DATE)


class Parents(Base):
    __tablename__ = "parents"

    center_id = Column(UUID(as_uuid=True), ForeignKey('center.id'), nullable=False)

    name = Column(VARCHAR(40), nullable=False)
    lastName = Column(VARCHAR(40), nullable=False)
    password = Column(LargeBinary, nullable=False)
    username = Column(VARCHAR(75), nullable=False, unique=True, index=True)
    id_card = Column(String)
    passport = Column(String)
    gender = Column(Enums.Gender, nullable=False)
    relationship = Column(VARCHAR(125), nullable=False)
    email = Column(String, index=True, unique=True)
    nationality = Column(Enums.Country, nullable=False)
    age = Column(DOUBLE_PRECISION, nullable=False)
    address = Column(VARCHAR(500), nullable=False)
    phone = Column(VARCHAR(70), nullable=False)
    # telefono fijo
    landline = Column(VARCHAR(70), nullable=False)
    scholarship = Column(VARCHAR(155), nullable=False)
    # job
    job = Column(VARCHAR(155), nullable=False)
    job_address = Column(VARCHAR(255), nullable=False)
    job_phone = Column(VARCHAR(75), nullable=False)
    __table_args__ = (
        CheckConstraint('age >= 18 AND age <= 120', name='teacher_check_age'),
    )

class ParentChildrenRelation(Base):
    __tablename__ = "parent_children_relation"
    parent_id = Column(UUID(as_uuid=True), ForeignKey(Parents.id), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey(Students.id), nullable=False)

    parent = relationship('Parents')
    student = relationship('Students')

    __table_args__ = (
        UniqueConstraint(parent_id, student_id, name='check_unique_relation_parent_children'),
    )

# for educative center
class Center(Base):
    __tablename__ = 'center'

    center_code = Column(VARCHAR(10), nullable=False) #cod_centro
    school_code = Column(VARCHAR(10), nullable=False) #cod_plantel
    phone = Column(VARCHAR(12), nullable=False)
    email = Column(VARCHAR(50), nullable=False)
    address = Column(VARCHAR(50), nullable=False)

    region_id = Column(UUID(as_uuid=True), ForeignKey('region.id'), nullable=False)
    province_id = Column(UUID(as_uuid=True), ForeignKey('province.id'), nullable=False)
    municipality_id = Column(UUID(as_uuid=True), ForeignKey('municipality.id'), nullable=False)
    municipal_district_id = Column(UUID(as_uuid=True), ForeignKey('municipal_district.id'), nullable=False)
    neighborhood_id = Column(UUID(as_uuid=True), ForeignKey('neighborhood.id'), nullable=False)
    subneighborhood_id = Column(UUID(as_uuid=True), ForeignKey('subneighborhood.id'), nullable=False)
    regional_id = Column(UUID(as_uuid=True), ForeignKey('regional.id'), nullable=False)
    educational_district_id = Column(UUID(as_uuid=True), ForeignKey('educational_district.id'), nullable=False)

    working_day = Column(VARCHAR(15), nullable=False) #jornada
    name = Column(VARCHAR(50), nullable=False)
    educative_sector = Column(VARCHAR(15), nullable=False) #sector educativo
    batch = Column(VARCHAR(20), nullable=False) # tanda
    type = Column(VARCHAR(25), nullable=False)
    zone = Column(VARCHAR(20), nullable=False)

    region = relationship('Region')
    province = relationship('Province')
    municipality =  relationship('Municipality')
    municipal_district = relationship('MunicipalDistrict')
    neighborhood = relationship('Neighborhood')
    subneighborhood = relationship('Subneighborhood')
    regional = relationship('Regional')
    educational_district = relationship('EducationalDistrict')

class Section(Base):
    __tablename__ = 'section'

    center_id =  Column(UUID(as_uuid=True), ForeignKey('center.id'), nullable=False) 
    grade_id = Column(UUID(as_uuid=True), ForeignKey('grade.id'), nullable=False)
    modality_id = Column(UUID(as_uuid=True), ForeignKey('modality.id'), nullable=False)
    cycle_id = Column(UUID(as_uuid=True), ForeignKey('cycle.id'), nullable=False)
    level_id = Column(UUID(as_uuid=True), ForeignKey('level.id'), nullable=False)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey('teachers.id'), nullable=False)

    center = relationship('Center')
    grade = relationship('Grade')
    modality = relationship('Modality')
    cycle = relationship('Cycle')
    level = relationship('Level')
    teacher = relationship('Teachers')

    name = Column(VARCHAR(15), nullable=False)
    year_start = Column(DateTime, nullable=False)
    year_end = Column(DateTime, nullable=False)

class StudentSectionRelation(Base):
    __tablename__ = 'student_section_relation'

    section_id = Column(UUID(as_uuid=True), ForeignKey(Section.id), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey(Students.id), nullable=False)

    section = relationship('Section')
    student = relationship('Students')

    __table_args__ = (
        UniqueConstraint(section_id, student_id, name='check_unique_relation_student_section'),
    )

# grado
class Grade(Base):
    __tablename__ = 'grade'

    modality_id = Column(UUID(as_uuid=True), ForeignKey('modality.id'), nullable=False)
    level_id = Column(UUID(as_uuid=True), ForeignKey('level.id'), nullable=False)
    cycle_id = Column(UUID(as_uuid=True), ForeignKey('cycle.id'), nullable=False)
    name = Column(VARCHAR(10), nullable=False)

    cycle = relationship('Cycle')
    level = relationship('Level')
    modality = relationship('Modality')

class Cycle(Base):
    __tablename__ = 'cycle'

    modality_id = Column(UUID(as_uuid=True), ForeignKey('modality.id'), nullable=False)
    level_id = Column(UUID(as_uuid=True), ForeignKey('level.id'), nullable=False)
    name = Column(VARCHAR(15), nullable=False)

    level = relationship('Level')
    modality = relationship('Modality')

class Level(Base):
    __tablename__ = 'level'

    modality_id = Column(UUID(as_uuid=True), ForeignKey('modality.id'), nullable=False)
    name = Column(VARCHAR(10), nullable=False)

    modality = relationship('Modality')

class Modality(Base):
    __tablename__ = 'modality'

    name = Column(VARCHAR(20), nullable=False)
