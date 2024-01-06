from app.db.base_class import Base
import app.db.enums as Enums
from sqlalchemy import Column, or_, and_, String, LargeBinary, ARRAY, ForeignKey, VARCHAR, Boolean, Date, SMALLINT, DOUBLE_PRECISION, CheckConstraint, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID

class Admins(Base):
    __tablename__ = "admins"
    name = Column(VARCHAR(40), nullable=False)
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
    # labor
    rank = Column(VARCHAR(125))
    __table_args__ = (
        CheckConstraint('age >= 18 AND age <= 120', name='teacher_check_age'),
        CheckConstraint('years_of_service >= 0 AND years_of_service <= 80', name='admi_check_years'),
    )

class Students(Base):
    __tablename__ = "students"
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
    # folio
    # libro
    # acta
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
    # health
    emergency_name = Column(VARCHAR(75))
    emergency_phone = Column(VARCHAR(75))
    emergency_identification = Column(VARCHAR(155))
    alergies = Column(VARCHAR(255))
    medicines = Column(VARCHAR(255))
    disabilities = Column(VARCHAR(255))
    level = Column(Enums.StudentLevels)
    # if level is "inicial"
        # array of numbers, length must be equal to brothers_quantity
    siblings_quantity = Column(SMALLINT)
    siblings_ages = Column(ARRAY(DOUBLE_PRECISION))
    sibling_place = Column(VARCHAR(255))
    doctor_name = Column(VARCHAR(75))
    doctor_phone = Column(VARCHAR(75))
    doctor_exequatur = Column(VARCHAR(255))
        # vaccines
    tuberculosis = Column(Boolean)
    influenza = Column(Enums.Influenza)
    hepatitis = Column(Enums.Hepatitis)
    spr = Column(Enums.SPR)
    neumoco = Column(Enums.Neumoco)
    bopv = Column(Enums.Bopv)
    dpt = Column(Enums.DPT)
    covid = Column(Enums.Covid)
    vph = Column(Enums.VPH)
    dt = Column(Enums.DT)
    pregnant_tdan = Column(Enums.PregnantTDAN)
    pregnant_dt = Column(Boolean)
    pregnant_influenza = Column(Enums.PregnantInfluenza)
    # if level is 'primario' or 'secundario'
    student_status = Column(Enums.StudentStatus)
    enrolled_at = Column(Date)
    removed_at = Column(Date)
    promoted = Column(Boolean)
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
        CheckConstraint(
            or_(
                level != 'inicial',
                and_(
                    level == 'inicial',
                    siblings_ages.isnot(None),
                    sibling_place.isnot(None),
                    doctor_name.isnot(None),
                    doctor_phone.isnot(None),
                    doctor_exequatur.isnot(None),
                    tuberculosis.isnot(None),
                    influenza.isnot(None),
                    spr.isnot(None),
                    neumoco.isnot(None),
                    bopv.isnot(None),
                    covid.isnot(None),
                    vph.isnot(None),
                    dt.isnot(None),
                    pregnant_tdan.isnot(None),
                    pregnant_influenza.isnot(None),
                    pregnant_dt.isnot(None),
                )
            ),
            name='check_fields_inicial'
        ),
        CheckConstraint(
            or_(
                level != 'primario' and level != 'secundario',
                and_(
                    level == 'primario' or level == 'secundario',
                    enrolled_at.isnot(None),
                    removed_at.isnot(None),
                    promoted.isnot(None)
                )
            ),
            name='check_fields_primario_secundario'
        )
    )


class Parents(Base):
    __tablename__ = "parents"
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
    parent = Column(String, ForeignKey(Parents.username), nullable=False)
    child = Column(String, ForeignKey(Students.username), nullable=False)
    __table_args__ = (
        UniqueConstraint(parent, child, name='check_unique_relation'),
    )