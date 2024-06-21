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
from app.utils.hash import hash

INITIAL_DATA = {
    # localizaciones
    'region': [
        {'id': '89198347-9d82-4e30-800e-98ea940e905a', 'region_name': 'nombre de la region'}
    ],
    'province': [
        {'id': 'ee25f757-1b44-49fc-b0c9-15abf2b58d4d', 'region_id': '89198347-9d82-4e30-800e-98ea940e905a', 'province_name': 'nombre de la provincia'}
    ],
    'municipality': [
        {'id': '89a40b2b-235e-45e6-85f3-eef952807e48', 'province_id': 'ee25f757-1b44-49fc-b0c9-15abf2b58d4d', 'region_id': '89198347-9d82-4e30-800e-98ea940e905a', 'municipality_name': 'nombre de la provincia'}
    ],
    'municipal_district': [
        {'id': 'e489b568-f2e9-4fba-9496-8d7076734d8c', 'region_id': '89198347-9d82-4e30-800e-98ea940e905a', 'province_id': 'ee25f757-1b44-49fc-b0c9-15abf2b58d4d', 'municipality_id': '89a40b2b-235e-45e6-85f3-eef952807e48', 'municipal_district_name': 'nombre del distrito municipal'}
    ],
    'neighborhood': [
        {'id': 'e62ded7b-c044-48d4-9d5f-0b43a48761ef', 'region_id': '89198347-9d82-4e30-800e-98ea940e905a', 'province_id': 'ee25f757-1b44-49fc-b0c9-15abf2b58d4d', 'municipality_id': '89a40b2b-235e-45e6-85f3-eef952807e48', 'municipal_district_id': 'e489b568-f2e9-4fba-9496-8d7076734d8c', 'neighborhood_name': 'nombre del barrio'}
    ],
    'subneighborhood': [
        {'id': 'f766c10f-8bbf-424e-8cba-c3f119e90754', 'region_id': '89198347-9d82-4e30-800e-98ea940e905a', 'province_id': 'ee25f757-1b44-49fc-b0c9-15abf2b58d4d', 'municipality_id': '89a40b2b-235e-45e6-85f3-eef952807e48', 'municipal_district_id': 'e489b568-f2e9-4fba-9496-8d7076734d8c', 'neighborhood_id':'e62ded7b-c044-48d4-9d5f-0b43a48761ef', 'subneighborhood_name': 'nombre del subbarrio'}
    ],
    'regional': [
        {'id': '64337f0d-e08d-4259-9fe3-cd9bb6487559', 'regional': 'nombre del regional'}
    ],
    'educational_district': [
        {'id': '05656965-8a43-48b4-90e6-7464eefb9d89', 'regional_id': '64337f0d-e08d-4259-9fe3-cd9bb6487559', 'educational_district': 'nombre de dist educ'}
    ],
    # creacion de centro educativo
    'center': [
        {'id': '0e2d22bb-acf2-414b-87d0-020baa15d8ea', 'working_day': 'jornada', 'name': 'nombre de la institucion', 'educative_sector': 'sectoreducativo', 'batch': 'tanda', 'type': 'tipo', 'zone': 'zona', 'center_code': 'codigo', 'school_code': 'codigo', 'phone': 'telefono', 'email': 'centro@gmail.com', 'address': 'direccion', 'region_id': '89198347-9d82-4e30-800e-98ea940e905a', 'province_id': 'ee25f757-1b44-49fc-b0c9-15abf2b58d4d', 'municipality_id': '89a40b2b-235e-45e6-85f3-eef952807e48', 'municipal_district_id': 'e489b568-f2e9-4fba-9496-8d7076734d8c', 'neighborhood_id': 'e62ded7b-c044-48d4-9d5f-0b43a48761ef', 'subneighborhood_id': 'f766c10f-8bbf-424e-8cba-c3f119e90754', 'regional_id': '64337f0d-e08d-4259-9fe3-cd9bb6487559', 'educational_district_id': '05656965-8a43-48b4-90e6-7464eefb9d89'}
    ],
    'admins': [
        {
            "name": "Ricardo",
            "center_id": "0e2d22bb-acf2-414b-87d0-020baa15d8ea",
            "role": "coordinador_de_area",
            "lastName": "Alvarez",
            "username": "admin",
            "password": hash("12345678"),
            "identification": "V-30604048",
            "gender": "masculino",
            "email": "ricard@gmail.com",
            "age": 18,
            "nationality": "VE",
            "civil_status": "casado",
            "address": "Urb. San Antonio",
            "years_of_service": 10,
            "expertise": "administracion",
            "degree": "administracion",
            "id": "1a6cf6c3-b584-47b7-8ef5-e4a5bf8790fb",
            "rank": "director"
        }
    ], 
    'modality': [
        {
            'name': 'std',
            'id': '08105225-dfa1-44d6-99f4-a87dd64e05f7'
        }
    ],
    'level': [
        {
            "modality_id": "08105225-dfa1-44d6-99f4-a87dd64e05f7",
            "name": "primario",
            "id": "4bec85fc-e2a8-49cd-9ebf-b33610e9f96f"
        }
    ],
    'cycle': [
        {
            "modality_id": "08105225-dfa1-44d6-99f4-a87dd64e05f7",
            "level_id": "4bec85fc-e2a8-49cd-9ebf-b33610e9f96f",
            "name": "1ero",
            "id": "d13d800d-1a44-4570-a864-a547ef6d1c24"
        }
    ],
    "grade": [
        {
            "modality_id": "08105225-dfa1-44d6-99f4-a87dd64e05f7",
            "level_id": "4bec85fc-e2a8-49cd-9ebf-b33610e9f96f",
            "cycle_id": "d13d800d-1a44-4570-a864-a547ef6d1c24",
            "name": "1ero",
            "id": "b61e5c22-5253-440d-ba61-e95dfd7dcf91",
        }
    ],
    "teachers": [
        {
            "center_id": "0e2d22bb-acf2-414b-87d0-020baa15d8ea",
            "name": "Ricardo",
            "lastName": "Alvarez",
            "password": hash('12345678'),
            "username": "teacher",
            "identification": "V-30604048",
            "gender": "masculino",
            "email": "ricard@gmail.com",
            "age": 18,
            "nationality": "VE",
            "civil_status": "casado",
            "address": "Urb. San Antonio",
            "years_of_service": 10,
            "expertise": "administracion",
            "degree": "administracion",
            "id": "5e8b85d5-2523-4c01-bdf6-4ef9ffae0e17",
        }
    ],
    "section": [
        {
            "center_id": "0e2d22bb-acf2-414b-87d0-020baa15d8ea",
            "grade_id": "b61e5c22-5253-440d-ba61-e95dfd7dcf91",
            "modality_id":"08105225-dfa1-44d6-99f4-a87dd64e05f7",
            "cycle_id": "d13d800d-1a44-4570-a864-a547ef6d1c24",
            "level_id": "4bec85fc-e2a8-49cd-9ebf-b33610e9f96f",
            "teacher_id": "5e8b85d5-2523-4c01-bdf6-4ef9ffae0e17",
            "name": "A",
            "year_start": datetime.strptime('01-05-2024', "%d-%m-%Y"),
            "year_end": datetime.strptime('01-05-2025', "%d-%m-%Y"),
            "id": "152c0854-8c3a-4e47-a8c7-fe62d5bd3a93"
        }
    ],
    "subject": [
        {
            "grade_id": "b61e5c22-5253-440d-ba61-e95dfd7dcf91",
            "cycle_id": "d13d800d-1a44-4570-a864-a547ef6d1c24",
            "level_id": "4bec85fc-e2a8-49cd-9ebf-b33610e9f96f",
            "modality_id": "08105225-dfa1-44d6-99f4-a87dd64e05f7",
            "center_id": "0e2d22bb-acf2-414b-87d0-020baa15d8ea",
            "teacher_id": "5e8b85d5-2523-4c01-bdf6-4ef9ffae0e17",
            "section_id": "152c0854-8c3a-4e47-a8c7-fe62d5bd3a93",
            "name": "matematicas",
            "id": "5c2ea72f-fdfe-45f8-b1e0-cb49a76e8e00"
        }
    ],
    "period": [
        {
            "included_months": "may, june",
            "specific_month": "may",
            "type": "1",
            "section_id": "152c0854-8c3a-4e47-a8c7-fe62d5bd3a93",
            "grade_id": "b61e5c22-5253-440d-ba61-e95dfd7dcf91",
            "level_id": "4bec85fc-e2a8-49cd-9ebf-b33610e9f96f",
            "center_id": "0e2d22bb-acf2-414b-87d0-020baa15d8ea",
            "year_gnl": "2024",
            "id": "61f72b06-2329-416d-9fe4-d9cb5600c4bf"
        },
        {
            "included_months": "may, june",
            "specific_month": "may",
            "type": "2",
            "section_id": "152c0854-8c3a-4e47-a8c7-fe62d5bd3a93",
            "grade_id": "b61e5c22-5253-440d-ba61-e95dfd7dcf91",
            "level_id": "4bec85fc-e2a8-49cd-9ebf-b33610e9f96f",
            "center_id": "0e2d22bb-acf2-414b-87d0-020baa15d8ea",
            "year_gnl": "2024",
            "id": "139a6c67-ec02-49b3-afbd-6b66ec9b9ff8"
        },
        {
            "included_months": "may, june",
            "specific_month": "may",
            "type": "3",
            "section_id": "152c0854-8c3a-4e47-a8c7-fe62d5bd3a93",
            "grade_id": "b61e5c22-5253-440d-ba61-e95dfd7dcf91",
            "level_id": "4bec85fc-e2a8-49cd-9ebf-b33610e9f96f",
            "center_id": "0e2d22bb-acf2-414b-87d0-020baa15d8ea",
            "year_gnl": "2024",
            "id": "56185371-8523-4af3-8668-384da6bd0a21"
        },
    ],
    "students": [
        {
            "center_id": "0e2d22bb-acf2-414b-87d0-020baa15d8ea",
            "name": "Ricardo",
            "lastName": "Alvarez",
            "password": hash('12345678'),
            "username": "student",
            "identification": "23r23t4t4g4eger",
            "RNE": "23r23f24",
            "gender": "masculino",
            "address": "Los Frailes TH19",
            "nationality": "DO",
            "civil_status": "casado",
            "birth": "2015-05-10",
            "email": "ricardoandresalvarez62341@gmail.com",
            "birth_place": "ewfergrwg",
            "lives_with": "papa",
            "student_status": "nuevo inscrito",
            "enrolled_at": datetime.strptime("24-05-2024", "%d-%m-%Y"),
            "id": "c32332ef-2c96-49fa-80dd-bfcac5026351"
        }
    ],
    "documents": [
        {
            "student_id": "c32332ef-2c96-49fa-80dd-bfcac5026351",
            "id": "88cba3dd-6e35-47cd-a6a0-cc40db2c51ef"
        }
    ],
    "health": [
        {
            "student_id": "c32332ef-2c96-49fa-80dd-bfcac5026351",
            "emergency_name": "ferfwergwetg",
            "emergency_phone": "+584149420523",
            "emergency_identification": "fwrferwfw",
            "alergies": "gerge",
            "medicines": "235g45g245",
            "disabilities": "bserb",
            "id": "4fa2cf69-cfa3-4420-b6ad-6bd7e7f2dc86"
        }
    ],
    "student_section_relation": [
        {
            "section_id": "152c0854-8c3a-4e47-a8c7-fe62d5bd3a93",
            "student_id": "c32332ef-2c96-49fa-80dd-bfcac5026351",
            "id": "db173329-bc2c-4ef5-9342-b9d9a00a3926"
        }
    ]
}

def initialize_tables(target, connection, **kw):
    tablename = str(target)
    if tablename in INITIAL_DATA and len(INITIAL_DATA[tablename]) > 0:
        connection.execute(target.insert(), INITIAL_DATA[tablename])

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

# tabla auxiliar para relacionar secciones y estudiantes
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
