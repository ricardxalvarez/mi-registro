from app.db.models import *
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy import text, update
from app.utils.ResultParser import ResultParser
import app.bases.grade as GradeBase
from app.utils.checkKeys import check_keys

async def getGrades(db: Session):
    try:
        query = '''
        SELECT grade.*, 
        (
            SELECT json_build_object(
                'id', l.id,
                'name', l.name,
                'modality_id', l.modality_id,
                'created_at', l.created_at
            )
            FROM level l
            WHERE l.id = grade.level_id
        ) AS level,
        (
            SELECT json_build_object(
                'id', m.id,
                'name', m.name,
                'created_at', m.created_at
            )
            FROM modality m
            WHERE m.id = grade.modality_id
        ) AS modality,
        (
            SELECT json_build_object(
                'id', c.id,
                'name', c.name,
                'level_id', c.level_id,
                'modality_id', c.modality_id,
                'created_at', c.created_at
            )
            FROM cycle c
            WHERE c.id = grade.cycle_id
        ) AS cycle
        FROM grade
        '''
        result = db.execute(text(query))
        grades = await ResultParser(result).all()
        return grades
    except IntegrityError as error:
        print(error)
        raise HTTPException(status_code=422)
    finally:
        db.close()
    
async def getSectionsByGrade(db: Session, grade_id: str):
    try:
        query = '''
        SELECT section.*
        FROM section 
        WHERE section.grade_id = :grade
        '''
        result = db.execute(text(query).bindparams(grade=grade_id))
        sections = await ResultParser(result).all()
        return sections
    except IntegrityError as error:
        print(error)
        raise HTTPException(status_code=422)
    finally:
        db.close()

async def changeGrade(data: GradeBase.ChangeGrade, db: Session):
    try:
        period = db.query(Period).where(Period.id == data.period_id).first()
        if not period:
            period = db.query(KinderPeriod).where(KinderPeriod.id == data.period_id).first()
        level = db.query(Level).where(Level.id == period.level_id).first()
        section = db.query(Section).where(Section.id == period.section_id).first()
        if level.name == 'secundario' or level.name == 'primario':
            subject = db.query(Subject).where(Subject.section_id == section.id).first()
            required_keys = ['subject_id']
            if not check_keys(required_keys, data.dict()):
                raise HTTPException(status_code=422)
            grade = db.query(GradePs).filter(
            GradePs.student_id == data.student_id,
            GradePs.period_id == data.period_id,
            GradePs.subject_id == data.subject_id
            ).first()
            if not grade:
                new_grade = GradePs(
                    cp1=data.cp1,
                    rcp1=data.rcp1,
                    cp2=data.cp2,
                    rcp2=data.rcp2,
                    cp3=data.cp3,
                    rcp3=data.rcp3,
                    cp4=data.cp4,
                    rcp4=data.rcp4,
                    type='std',
                    section_id=period.section_id,
                    grade_id=section.grade_id,
                    level_id=section.level_id,
                    center_id=section.center_id,
                    modality_id=section.modality_id,
                    subject_id=data.subject_id,
                    period_id=data.period_id,
                    student_id=data.student_id,
                    teacher_id=subject.teacher_id
                )
                db.add(new_grade)
                db.commit()
                return 'Grades updated'
            else:
                db.execute(
                    update(GradePs)
                    .where(GradePs.id == grade.id)
                    .values(
                        cp1=data.cp1,
                        rcp1=data.rcp1,
                        cp2=data.cp2,
                        rcp2=data.rcp2,
                        cp3=data.cp3,
                        rcp3=data.rcp3,
                        cp4=data.cp4,
                        rcp4=data.rcp4,
                    )
                )
                db.commit()
                return 'Grades updated'
        if level.name == 'inicial':
            required_keys = ['indicator_kinder_id', 'grade']
            if not check_keys(required_keys, data.dict()):
                raise HTTPException(status_code=422)
            grade = db.query(GradesKinder).filter(
                GradesKinder.indicator_kinder_id == data.indicator_kinder_id,
                GradesKinder.section_id == period.section_id,
                GradesKinder.period_id == data.period_id,
                GradesKinder.student_id == data.student_id,
                
            ).first()
            indicator = db.query(IndicatorKinder).where(IndicatorKinder.id == data.indicator_kinder_id).first()
            if not grade:
                new_grade = GradesKinder(
                    scope_id=indicator.scope_id,
                    indicator_kinder_id=data.indicator_kinder_id,
                    student_id=data.student_id,
                    section_id=period.section_id,
                    center_id=period.center_id,
                    teacher_id=period.teacher_id,
                    period_id=data.period_id,
                    grade=data.grade
                )
                db.add(new_grade)
                db.commit()
                return 'Grades updated'
            else:
                db.execute(
                    update(GradesKinder)
                    .where(GradesKinder.id == grade.id)
                    .values(grade=data.grade)
                )
                db.commit()
                return 'Grades updated'
    except IntegrityError as error:
        print(error)
        raise HTTPException(status_code=422)
    finally:
        db.close()