from app.db.models.grades import *
from app.db.models import *
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy import text, update
from app.utils.ResultParser import ResultParser
import app.bases.attendance as AttendanceBase

async def getAttendance(data: AttendanceBase.getAttendance, teacher_id: str, db: Session):

    try:
        if data.subject_id == '':
            data.subject_id = None
        query = '''
        SELECT a.*
        FROM attendance a
        WHERE a.section_id = :section
        AND a.day = :day
        AND (a.subject_id = :subject OR a.subject_id IS NULL)
        AND a.teacher_id = :teacher
        '''
        print(data.subject_id)
        result = db.execute(text(query).bindparams(
            section=data.section_id,
            day=data.day,
            subject=data.subject_id,
            teacher=teacher_id
            ))
        attendance = await ResultParser(result).all()
        return attendance
    except IntegrityError as error:
        print(error)
        raise HTTPException(status_code=422)
    finally:
        db.close()

async def postAttendance(data: AttendanceBase.newAttendance, db: Session):
    try:
        if data.subject_id == '':
            data.subject_id = None
        attendance = db.query(Attendance).filter(
            Attendance.student_id == data.student_id,
            Attendance.day == data.day,
            Attendance.subject_id == data.subject_id
        ).first()

        section = db.query(Section).filter(Section.id == data.section_id).first()
        level = db.query(Level).filter(Level.id == section.level_id).first()

        if level.name == 'secundario' and not data.subject_id:
            raise HTTPException(status_code=422)

        if not attendance:
            newAttendance = Attendance(
                attendant=data.attendant,
                day=data.day,
                section_id=data.section_id,
                grade_id=section.grade_id,
                level_id=section.level_id,
                modality_id=section.modality_id,
                center_id=section.center_id,
                teacher_id=section.teacher_id,
                subject_id=data.subject_id,
                student_id=data.student_id
            )

            db.add(newAttendance)
            db.commit()
            return 'Attendance added successfully'
        else:
            db.execute(
                update(Attendance).
                where(Attendance.id == attendance.id).
                # where(Attendance.day == data.day).
                # where(Attendance.subject_id == data.subject_id).
                values(attendant=data.attendant)
            )
            db.commit()
            return 'Attendance updated successfully'
    except IntegrityError as error:
        print(error)
        raise HTTPException(status_code=422)
    finally:
        db.close()