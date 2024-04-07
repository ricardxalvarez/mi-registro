from app.db.base_class import Base
from sqlalchemy import Column, Integer, DATE, JSON, LargeBinary, ForeignKey, VARCHAR  
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

# tec
class RaeTec(Base):
    __tablename__= 'rae_tec'

    subject_tec_id = Column(UUID(as_uuid=True), ForeignKey('subject_tec.id'), nullable=False)
    center_id = Column(UUID(as_uuid=True), ForeignKey('center.id'), nullable=False)
    section_id = Column(UUID(as_uuid=True), ForeignKey('section.id'), nullable=False)
    cycle_id = Column(UUID(as_uuid=True), ForeignKey('cycle.id'), nullable=False)
    grade_id = Column(UUID(as_uuid=True), ForeignKey('grade.id'), nullable=False)
    level_id = Column(UUID(as_uuid=True), ForeignKey('level.id'), nullable=False)
    modality_id = Column(UUID(as_uuid=True), ForeignKey('modality.id'), nullable=False)

    name = Column(VARCHAR(100), nullable=False)

class SubjectTec(Base):
    __tablename__ = 'subject_tec'

    center_id = Column(UUID(as_uuid=True), ForeignKey('center.id'), nullable=False)
    section_id = Column(UUID(as_uuid=True), ForeignKey('section.id'), nullable=False)
    cycle_id = Column(UUID(as_uuid=True), ForeignKey('cycle.id'), nullable=False)
    grade_id = Column(UUID(as_uuid=True), ForeignKey('grade.id'), nullable=False)
    level_id = Column(UUID(as_uuid=True), ForeignKey('level.id'), nullable=False)
    modality_id = Column(UUID(as_uuid=True), ForeignKey('modality.id'), nullable=False)
    mod_tec_id = Column(UUID(as_uuid=True), ForeignKey('mod_tec.id'), nullable=False)

    name = Column(VARCHAR(30), nullable=False)

class ModTec(Base):
    __tablename__ = 'mod_tec'

    subject_tec_id = Column(UUID(as_uuid=True), ForeignKey('subject_tec.id'), nullable=False)
    section_id = Column(UUID(as_uuid=True), ForeignKey('section.id'), nullable=False)
    cycle_id = Column(UUID(as_uuid=True), ForeignKey('cycle.id'), nullable=False)
    grade_id = Column(UUID(as_uuid=True), ForeignKey('grade.id'), nullable=False)
    level_id = Column(UUID(as_uuid=True), ForeignKey('level.id'), nullable=False)
    modality_id = Column(UUID(as_uuid=True), ForeignKey('modality.id'), nullable=False)

    administration = Column(VARCHAR(50), nullable=False)
    accounting = Column(VARCHAR(50), nullable=False)
    electronic = Column(VARCHAR(50), nullable=False)

class VFMCT(Base):
    __tablename__ = 'vfmct'

    student_id = Column(UUID(as_uuid=True), ForeignKey('students.id'), nullable=False)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey('teachers.id'), nullable=False)
    period_id = Column(UUID(as_uuid=True), ForeignKey('period.id'), nullable=False)
    subject_tec_id = Column(UUID(as_uuid=True), ForeignKey('subject_tec.id'), nullable=False)
    mod_tec_id = Column(UUID(as_uuid=True), ForeignKey('mod_tec.id'), nullable=False)
    section_id = Column(UUID(as_uuid=True), ForeignKey('section.id'), nullable=False)
    cycle_id = Column(UUID(as_uuid=True), ForeignKey('cycle.id'), nullable=False)
    grade_id = Column(UUID(as_uuid=True), ForeignKey('grade.id'), nullable=False)
    level_id = Column(UUID(as_uuid=True), ForeignKey('level.id'), nullable=False)
    modality_id = Column(UUID(as_uuid=True), ForeignKey('modality.id'), nullable=False)
    center_id = Column(UUID(as_uuid=True), ForeignKey('center.id'), nullable=False)

    grade = Column(Integer, nullable=False)

# art

class ModArt(Base):
    __tablename__ = 'mod_art'

    section_id = Column(UUID(as_uuid=True), ForeignKey('section.id'), nullable=False)
    cycle_id = Column(UUID(as_uuid=True), ForeignKey('cycle.id'), nullable=False)
    grade_id = Column(UUID(as_uuid=True), ForeignKey('grade.id'), nullable=False)
    level_id = Column(UUID(as_uuid=True), ForeignKey('level.id'), nullable=False)
    modality_id = Column(UUID(as_uuid=True), ForeignKey('modality.id'), nullable=False)
    center_id = Column(UUID(as_uuid=True), ForeignKey('center.id'), nullable=False)
    rae_art_id = Column(UUID(as_uuid=True), ForeignKey('rae_art.id'))
    subject_art_id = Column(UUID(as_uuid=True), ForeignKey('subject_art.id'))

    name = Column(VARCHAR(40))

class SubjectArt(Base):
    __tablename__ = 'subject_art'

    section_id = Column(UUID(as_uuid=True), ForeignKey('section.id'))
    cycle_id = Column(UUID(as_uuid=True), ForeignKey('cycle.id'))
    grade_id = Column(UUID(as_uuid=True), ForeignKey('grade.id'))
    level_id = Column(UUID(as_uuid=True), ForeignKey('level.id'))
    modality_id = Column(UUID(as_uuid=True), ForeignKey('modality.id'))
    center_id = Column(UUID(as_uuid=True), ForeignKey('center.id'))
    rae_art_id = Column(UUID(as_uuid=True), ForeignKey('rae_art.id'))
    mod_art_id = Column(UUID(as_uuid=True), ForeignKey('mod_art.id'))

    name = Column(VARCHAR(50))


class RaeArt(Base):
    __tablename__ = 'rae_art'

    section_id = Column(UUID(as_uuid=True), ForeignKey('section.id'))
    cycle_id = Column(UUID(as_uuid=True), ForeignKey('cycle.id'))
    grade_id = Column(UUID(as_uuid=True), ForeignKey('grade.id'))
    level_id = Column(UUID(as_uuid=True), ForeignKey('level.id'))
    modality_id = Column(UUID(as_uuid=True), ForeignKey('modality.id'))
    center_id = Column(UUID(as_uuid=True), ForeignKey('center.id'))
    mod_art_id = Column(UUID(as_uuid=True), ForeignKey('mod_art.id'))
    subject_art_id = Column(UUID(as_uuid=True), ForeignKey('subject_art.id'))

    name = Column(VARCHAR(100))

# grades

class GradeArtec(Base):
    __tablename__ = 'grade_artec'

    vfmct_id = Column(UUID(as_uuid=True), ForeignKey('vfmct.id'))
    mod_tec_id = Column(UUID(as_uuid=True), ForeignKey('mod_tec.id'))
    subject_tec_id = Column(UUID(as_uuid=True), ForeignKey('subject_tec.id'))
    rae_tec_id = Column(UUID(as_uuid=True), ForeignKey('rae_tec.id'))
    mod_art_id = Column(UUID(as_uuid=True), ForeignKey('mod_art.id'))
    subject_art_id = Column(UUID(as_uuid=True), ForeignKey('subject_art.id'))
    rae_art_id = Column(UUID(as_uuid=True), ForeignKey('rae_art.id'))
    period_id = Column(UUID(as_uuid=True), ForeignKey('period.id'))
    section_id = Column(UUID(as_uuid=True), ForeignKey('section.id'))
    center_id = Column(UUID(as_uuid=True), ForeignKey('center.id'))

    type = Column(VARCHAR(20))

# plan
class PlanTec(Base):
    __tablename__ = 'plan_tec'

    # cod_mod_tec
    # id_instrumento_evaluacion
    period_id = Column(UUID(as_uuid=True), ForeignKey('period.id'))
    section_id = Column(UUID(as_uuid=True), ForeignKey('section.id'))
    center_id = Column(UUID(as_uuid=True), ForeignKey('center.id'))
    level_id = Column(UUID(as_uuid=True), ForeignKey('level.id'))
    modality_id = Column(UUID(as_uuid=True), ForeignKey('modality.id'))
    grade_id = Column(UUID(as_uuid=True), ForeignKey('grade.id'))
    mod_tec_id = Column(UUID(as_uuid=True), ForeignKey('mod_tec.id'))
    rae_tec_id = Column(UUID(as_uuid=True), ForeignKey('rae_tec.id'))
    subject_tec_id = Column(UUID(as_uuid=True), ForeignKey('subject_tec.id'), nullable=False)
    teacher_id =  Column(UUID(as_uuid=True), ForeignKey('teachers.id'), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey('students.id'), nullable=False)

    activity = Column(VARCHAR(100), nullable=False)
    utterance = Column(VARCHAR(100), nullable=False) # enunciado
    date = Column(DATE, nullable=False)