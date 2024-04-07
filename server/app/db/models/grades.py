from app.db.base_class import Base
from sqlalchemy import Column, Integer, JSON, Date, UniqueConstraint, Boolean, ForeignKey, VARCHAR  
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import app.db.enums as Enums

# kinder

# ambito
class ScopeKinder(Base):
    __tablename__ = 'scope_kinder'

    li = Column(VARCHAR(50), nullable=False)
    rsia = Column(VARCHAR(50), nullable=False)

class IndicatorKinder(Base):
    __tablename__ = 'indicator_kinder'

    indicator = Column(VARCHAR(70), nullable=False)
    scope_id = Column(UUID(as_uuid=True), ForeignKey('scope_kinder.id'), nullable=False)

class GradesKinder(Base):
    __tablename__ = 'grades_kinder'

    scope_id = Column(UUID(as_uuid=True), ForeignKey('scope_kinder.id'), nullable=False)
    indicator_kinder_id = Column(UUID(as_uuid=True), ForeignKey('indicator_kinder.id'), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey('students.id'), nullable=False)
    section_id = Column(UUID(as_uuid=True), ForeignKey('section.id'), nullable=False)
    center_id = Column(UUID(as_uuid=True), ForeignKey('center.id'), nullable=False)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey('teachers.id'), nullable=False)
    period_id = Column(UUID(as_uuid=True), ForeignKey('kinder_period.id'), nullable=False)

    grade = Column(Enums.KinderGrades, nullable=False)

class KinderPeriod(Base):
    __tablename__ = 'kinder_period'

    section_id = Column(UUID(as_uuid=True), ForeignKey('section.id'), nullable=False)
    center_id = Column(UUID(as_uuid=True), ForeignKey('center.id'), nullable=False)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey('teachers.id'), nullable=False)
    level_id = Column(UUID(as_uuid=True), ForeignKey('level.id'), nullable=False)

    period = Column(VARCHAR(10), nullable=False)

class Period(Base):
    __tablename__ = 'period'

    included_months = Column(VARCHAR(100))
    specific_month = Column(VARCHAR(20))
    type = Column(VARCHAR(5), nullable=False)
    section_id = Column(UUID(as_uuid=True), ForeignKey('section.id'), nullable=False)
    grade_id = Column(UUID(as_uuid=True), ForeignKey('grade.id'), nullable=False)
    level_id = Column(UUID(as_uuid=True), ForeignKey('level.id'), nullable=False)
    center_id = Column(UUID(as_uuid=True), ForeignKey('center.id'), nullable=False)
    year_gnl = Column(VARCHAR(9), nullable=False)

class Planification(Base):
    __tablename__ = 'planification'

    especific_competency_id = Column(UUID(as_uuid=True), ForeignKey('especific_competency.id'))
    indicator_id = Column(UUID(as_uuid=True), ForeignKey('indicator.id'))
    period_id = Column(UUID(as_uuid=True), ForeignKey('period.id'), nullable=False)
    subject_id = Column(UUID(as_uuid=True), ForeignKey('subject.id'), nullable=False)
    section_id = Column(UUID(as_uuid=True), ForeignKey('section.id'), nullable=False)

    key_content = Column(VARCHAR(255))

# aspectos trabajados (nivel primario)
class AspectWorked(Base):
    __tablename__ = 'aspect_worked'

    content_id = Column(UUID(as_uuid=True), ForeignKey('content.id'))
    especific_competency_id = Column(UUID(as_uuid=True), ForeignKey('especific_competency.id'))
    fundamental_competency_id = Column(UUID(as_uuid=True), ForeignKey('fundamental_competency.id'))
    period_id = Column(UUID(as_uuid=True), ForeignKey('period.id'), nullable=False)
    indicator_id = Column(UUID(as_uuid=True), ForeignKey('indicator.id'))
    subject_id = Column(UUID(as_uuid=True), ForeignKey('subject.id'), nullable=False)
    section_id = Column(UUID(as_uuid=True), ForeignKey('section.id'), nullable=False)

# asignatura

class Subject(Base):
    __tablename__ = 'subject'

    grade_id = Column(UUID(as_uuid=True), ForeignKey('grade.id'), nullable=False)
    cycle_id = Column(UUID(as_uuid=True), ForeignKey('cycle.id'), nullable=False)
    level_id = Column(UUID(as_uuid=True), ForeignKey('level.id'), nullable=False)
    modality_id = Column(UUID(as_uuid=True), ForeignKey('modality.id'), nullable=False)
    center_id = Column(UUID(as_uuid=True), ForeignKey('center.id'), nullable=False)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey('teachers.id'), nullable=False)
    section_id = Column(UUID(as_uuid=True), ForeignKey('section.id'), nullable=False)

    name = Column(VARCHAR(40), nullable=False)

# ejes de contenido
class Content(Base):
    __tablename__ = 'content'

    especific_competency_id = Column(UUID(as_uuid=True), ForeignKey('especific_competency.id'))
    fundamental_competency_id = Column(UUID(as_uuid=True), ForeignKey('fundamental_competency.id'))
    subject_id = Column(UUID(as_uuid=True), ForeignKey('subject.id'), nullable=False)
    grade_id = Column(UUID(as_uuid=True), ForeignKey('grade.id'), nullable=False)
    level_id = Column(UUID(as_uuid=True), ForeignKey('level.id'), nullable=False)

    # change to enum
    category = Column(VARCHAR(30), nullable=False)
    description = Column(VARCHAR(255), nullable=False)

class Indicator(Base):
    __tablename__ = 'indicator'

    fundamental_competency_id = Column(UUID(as_uuid=True), ForeignKey('fundamental_competency.id'), nullable=False)
    subject_id = Column(UUID(as_uuid=True), ForeignKey('subject.id'), nullable=False)
    grade_id = Column(UUID(as_uuid=True), ForeignKey('grade.id'), nullable=False)
    level_id = Column(UUID(as_uuid=True), ForeignKey('level.id'), nullable=False)

    name = Column(VARCHAR(10), nullable=False)

class EspecificCompetency(Base):
    __tablename__ = 'especific_competency'

    fundamental_competency_id = Column(UUID(as_uuid=True), ForeignKey('fundamental_competency.id'), nullable=False)
    subject_id = Column(UUID(as_uuid=True), ForeignKey('subject.id'), nullable=False)
    grade_id = Column(UUID(as_uuid=True), ForeignKey('grade.id'), nullable=False)
    cycle_id = Column(UUID(as_uuid=True), ForeignKey('cycle.id'), nullable=False)
    level_id = Column(UUID(as_uuid=True), ForeignKey('level.id'), nullable=False)
    modality_id = Column(UUID(as_uuid=True), ForeignKey('modality.id'), nullable=False)

    name = Column(VARCHAR(40), nullable=False)

class FundamentalCompetency(Base):
    __tablename__ = 'fundamental_competency'

    name = Column(VARCHAR(20), nullable=False)
    subject_id = Column(UUID(as_uuid=True), ForeignKey('subject.id'), nullable=False)
    grade_id = Column(UUID(as_uuid=True), ForeignKey('grade.id'), nullable=False)
    cycle_id = Column(UUID(as_uuid=True), ForeignKey('cycle.id'), nullable=False)
    level_id = Column(UUID(as_uuid=True), ForeignKey('level.id'), nullable=False)
    modality_id = Column(UUID(as_uuid=True), ForeignKey('modality.id'), nullable=False)

class TestSTD(Base):
    __tablename__ = 'test_std'

    center_id = Column(UUID(as_uuid=True), ForeignKey('center.id'), nullable=False)
    section_id = Column(UUID(as_uuid=True), ForeignKey('section.id'), nullable=False)
    grade_id = Column(UUID(as_uuid=True), ForeignKey('grade.id'), nullable=False)
    level_id = Column(UUID(as_uuid=True), ForeignKey('level.id'), nullable=False)
    modality_id = Column(UUID(as_uuid=True), ForeignKey('modality.id'), nullable=False)
    subject_id = Column(UUID(as_uuid=True), ForeignKey('subject.id'), nullable=False)
    period_id = Column(UUID(as_uuid=True), ForeignKey('period.id'), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey('students.id'), nullable=False)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey('teachers.id'), nullable=False)

    items = Column(JSON, nullable=False)
    name = Column(VARCHAR(15), nullable=False)
    type = Column(VARCHAR(15), nullable=False)

class GradePs(Base):
    __tablename__ = 'grade_ps'

    cp1 = Column(Integer)
    rcp1 = Column(Integer)
    cp2 = Column(Integer)
    rcp2 = Column(Integer)
    cp3 = Column(Integer)
    rcp3 = Column(Integer)
    cp4 = Column(Integer)
    rcp4 = Column(Integer)
    type = Column(VARCHAR(10), nullable=False)

    section_id = Column(UUID(as_uuid=True), ForeignKey('section.id'), nullable=False)
    grade_id = Column(UUID(as_uuid=True), ForeignKey('grade.id'), nullable=False)
    level_id = Column(UUID(as_uuid=True), ForeignKey('level.id'), nullable=False)
    modality_id = Column(UUID(as_uuid=True), ForeignKey('modality.id'), nullable=False)
    center_id = Column(UUID(as_uuid=True), ForeignKey('center.id'), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey('students.id'), nullable=False)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey('teachers.id'), nullable=False)
    subject_id = Column(UUID(as_uuid=True), ForeignKey('subject.id'), nullable=False)
    period_id = Column(UUID(as_uuid=True), ForeignKey('period.id'), nullable=False)

class Attendance(Base):
    __tablename__ = 'attendance'

    attendant = Column(Boolean, server_default='t', nullable=False)
    day = Column(Date, nullable=False)

    section_id = Column(UUID(as_uuid=True), ForeignKey('section.id'), nullable=False)
    grade_id = Column(UUID(as_uuid=True), ForeignKey('grade.id'), nullable=False)
    level_id = Column(UUID(as_uuid=True), ForeignKey('level.id'), nullable=False)
    modality_id = Column(UUID(as_uuid=True), ForeignKey('modality.id'), nullable=False)
    center_id = Column(UUID(as_uuid=True), ForeignKey('center.id'), nullable=False)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey('teachers.id'), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey('students.id'),  nullable=False)

    # when student section level is 'secundario'
    subject_id = Column(UUID(as_uuid=True), ForeignKey('subject.id'))

    __table_args__ = (
        UniqueConstraint(attendant, day, student_id, name='check_unique_attendance'),
    )