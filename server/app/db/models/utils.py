from app.db.base_class import Base
from sqlalchemy import Column, DATE, Boolean, LargeBinary, ForeignKey, VARCHAR  
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

class NEAE(Base):
    __tablename__ = 'neae'

    setting = Column(VARCHAR(100), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey('students.id'), nullable=False)


class DAD(Base):
    __tablename__ = 'dad'

    adm_id = Column(UUID(as_uuid=True), ForeignKey('admins.id'), nullable=False)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey('teachers.id'), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey('students.id'), nullable=False)
    neae_id = Column(UUID(as_uuid=True), ForeignKey('neae.id'), nullable=False)
    help_name_ex = Column(VARCHAR(50), nullable=False)
    recomendation_help_ci = Column(VARCHAR(50), nullable=False)

class DA(Base):
    __tablename__ = 'da'

    section_id = Column(UUID(as_uuid=True), ForeignKey('section.id'), nullable=False)
    center_id = Column(UUID(as_uuid=True), ForeignKey('center.id'), nullable=False)
    stundent_id = Column(UUID(as_uuid=True), ForeignKey('students.id'), nullable=False)
    grade_id = Column(UUID(as_uuid=True), ForeignKey('grade.id'), nullable=False)
    cycle_id = Column(UUID(as_uuid=True), ForeignKey('cycle.id'), nullable=False)
    level_id = Column(UUID(as_uuid=True), ForeignKey('level.id'), nullable=False)
    modality_id = Column(UUID(as_uuid=True), ForeignKey('modality.id'), nullable=False)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey('teachers.id'), nullable=False)

    event = Column(VARCHAR(60), nullable=False)
    comment = Column((VARCHAR(60)), nullable=False)
    date = Column(DATE, nullable=False)

class CHAD(Base):
    __tablename__ = 'chad'

    section_id = Column(UUID(as_uuid=True), ForeignKey('section.id'), nullable=False)
    center_id = Column(UUID(as_uuid=True), ForeignKey('center.id'), nullable=False)
    grade_id = Column(UUID(as_uuid=True), ForeignKey('grade.id'), nullable=False)
    level_id = Column(UUID(as_uuid=True), ForeignKey('level.id'), nullable=False)
    modality_id = Column(UUID(as_uuid=True), ForeignKey('modality.id'), nullable=False)
    # period_id = Column(UUID(as_uuid=True), ForeignKey('period.id'))
    teacher_id = Column(UUID(as_uuid=True), ForeignKey('teachers.id'), nullable=False)
    stundent_id = Column(UUID(as_uuid=True), ForeignKey('students.id'), nullable=False)

    aspect = Column(VARCHAR(50), nullable=False)
    qualities = Column(VARCHAR(50), nullable=False)

class Difficulties(Base):
    __tablename__ = 'difficulties'

    section_id = Column(UUID(as_uuid=True), ForeignKey('section.id'), nullable=False)
    center_id = Column(UUID(as_uuid=True), ForeignKey('center.id'), nullable=False)
    grade_id = Column(UUID(as_uuid=True), ForeignKey('grade.id'), nullable=False)
    level_id = Column(UUID(as_uuid=True), ForeignKey('level.id'), nullable=False)
    modality_id = Column(UUID(as_uuid=True), ForeignKey('modality.id'), nullable=False)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey('teachers.id'), nullable=False)
    stundent_id = Column(UUID(as_uuid=True), ForeignKey('students.id'), nullable=False)

    alternatives = Column(VARCHAR(50), nullable=False)

class PedagogicalGroup(Base):
    __tablename__ = 'pedagogical_group'

    section_id = Column(UUID(as_uuid=True), ForeignKey('section.id'), nullable=False)
    center_id = Column(UUID(as_uuid=True), ForeignKey('center.id'), nullable=False)
    grade_id = Column(UUID(as_uuid=True), ForeignKey('grade.id'), nullable=False)
    level_id = Column(UUID(as_uuid=True), ForeignKey('level.id'), nullable=False)
    modality_id = Column(UUID(as_uuid=True), ForeignKey('modality.id'), nullable=False)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey('teachers.id'), nullable=False)

    comment = Column(VARCHAR(50), nullable=False)
    date = Column(DATE, nullable=False)
    purpose = Column(VARCHAR(50), nullable=False)
    topic = Column(VARCHAR(60), nullable=False)

class RMPD(Base):
    __tablename__ = 'rmpd'

    section_id = Column(UUID(as_uuid=True), ForeignKey('section.id'), nullable=False)
    center_id = Column(UUID(as_uuid=True), ForeignKey('center.id'), nullable=False)
    grade_id = Column(UUID(as_uuid=True), ForeignKey('grade.id'), nullable=False)
    level_id = Column(UUID(as_uuid=True), ForeignKey('level.id'), nullable=False)
    modality_id = Column(UUID(as_uuid=True), ForeignKey('modality.id'), nullable=False)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey('teachers.id'), nullable=False)

    date = Column(DATE, nullable=False)
    strength = Column(VARCHAR(100), nullable=False)
    improvements = Column(VARCHAR(100), nullable=False)
    feeling = Column(VARCHAR(100), nullable=False)

class RP(Base):
    __tablename__ = 'rp'

    competency_achived = Column(Boolean, server_default='f', nullable=False)
    strategy = Column(VARCHAR(60), nullable=False)
    evidence = Column(VARCHAR(60), nullable=False)

    student_id = Column(UUID(as_uuid=True), ForeignKey('students.id'), nullable=False)
    especific_competency_id = Column(UUID(as_uuid=True), ForeignKey('especific_competency.id'), nullable=False)
    fundamental_competency_id = Column(UUID(as_uuid=True), ForeignKey('fundamental_competency.id'), nullable=False)
    period_id = Column(UUID(as_uuid=True), ForeignKey('period.id'), nullable=False)

class ALFB(Base):
    __tablename__ = 'alfb'

    teacher_id = Column(UUID(as_uuid=True), ForeignKey('teachers.id'), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey('students.id'), nullable=False)
    section_id = Column(UUID(as_uuid=True), ForeignKey('section.id'), nullable=False)
    center_id = Column(UUID(as_uuid=True), ForeignKey('center.id'), nullable=False)
    grade_id = Column(UUID(as_uuid=True), ForeignKey('grade.id'), nullable=False)
    level_id = Column(UUID(as_uuid=True), ForeignKey('level.id'), nullable=False)

    obs_alfbt = Column(VARCHAR(100), nullable=False)

class CurricularComponents(Base):
    __tablename__ = 'curricular_components'

    evidence = Column(VARCHAR(50), nullable=False)
    strategy = Column(VARCHAR(50), nullable=False)
    evaluation_instrument = Column(VARCHAR(50), nullable=False)
    methodology = Column(VARCHAR(50), nullable=False)

class EC(Base):
    __tablename__ = 'ec'

    section_id = Column(UUID(as_uuid=True), ForeignKey('section.id'), nullable=False)
    center_id = Column(UUID(as_uuid=True), ForeignKey('center.id'), nullable=False)
    grade_id = Column(UUID(as_uuid=True), ForeignKey('grade.id'), nullable=False)
    modality_id = Column(UUID(as_uuid=True), ForeignKey('modality.id'), nullable=False)
    level_id = Column(UUID(as_uuid=True), ForeignKey('level.id'), nullable=False)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey('teachers.id'), nullable=False)
    period_id = Column(UUID(as_uuid=True), ForeignKey('period.id'), nullable=False)
    subject_id = Column(UUID(as_uuid=True), ForeignKey('subject.id'), nullable=False)
    content_id = Column(UUID(as_uuid=True), ForeignKey('content.id'), nullable=False)
    especific_competency_id = Column(UUID(as_uuid=True), ForeignKey('especific_competency.id'), nullable=False)
    fundamental_competency_id = Column(UUID(as_uuid=True), ForeignKey('fundamental_competency.id'), nullable=False)
    indicator_id = Column(UUID(as_uuid=True), ForeignKey('indicator.id'), nullable=False)

    strategy = Column(VARCHAR(50), nullable=False)

class RE(Base):
    __tablename__ = 're'

    section_id = Column(UUID(as_uuid=True), ForeignKey('section.id'), nullable=False)
    center_id = Column(UUID(as_uuid=True), ForeignKey('center.id'), nullable=False)
    grade_id = Column(UUID(as_uuid=True), ForeignKey('grade.id'), nullable=False)
    modality_id = Column(UUID(as_uuid=True), ForeignKey('modality.id'), nullable=False)
    level_id = Column(UUID(as_uuid=True), ForeignKey('level.id'), nullable=False)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey('teachers.id'), nullable=False)

    activity = Column(VARCHAR(50), nullable=False)
    comment = Column(VARCHAR(60), nullable=False)
    date = Column(DATE, nullable=False)
    hour = Column(VARCHAR(5), nullable=False)
    institution = Column(VARCHAR(40), nullable=False)
    place = Column(VARCHAR(40), nullable=False)
    visit_reason = Column(VARCHAR(40), nullable=False)
    visit_name = Column(VARCHAR(25), nullable=False)

class ACM(Base):
    __tablename__ = 'acm'

    section_id = Column(UUID(as_uuid=True), ForeignKey('section.id'), nullable=False)
    center_id = Column(UUID(as_uuid=True), ForeignKey('center.id'), nullable=False)
    grade_id = Column(UUID(as_uuid=True), ForeignKey('grade.id'), nullable=False)
    modality_id = Column(UUID(as_uuid=True), ForeignKey('modality.id'), nullable=False)
    level_id = Column(UUID(as_uuid=True), ForeignKey('level.id'), nullable=False)
    cycle_id = Column(UUID(as_uuid=True), ForeignKey('cycle.id'), nullable=False)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey('teachers.id'), nullable=False)
    period_id = Column(UUID(as_uuid=True), ForeignKey('period.id'), nullable=False)
    # id tecnico distrital

    date = Column(DATE, nullable=False)
    remarks = Column(VARCHAR(100), nullable=False)
    recommendations = Column(VARCHAR(100), nullable=False)