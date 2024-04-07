from app.db.models import *
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.utils.ResultParser import ResultParser

async def listSectionsByTeacher(teacher_id: str, db: Session):
    try:
        query = '''
        SELECT section.*, 
        (
        CASE WHEN COUNT(subject.id) > 0 THEN
            json_agg(
                json_build_object(
                    'id', subject.id,
                    'grade_id', subject.grade_id,
                    'cycle_id', subject.cycle_id,
                    'level_id', subject.level_id,
                    'modality_id', subject.modality_id,
                    'center_id', subject.center_id,
                    'teacher_id', subject.teacher_id,
                    'section_id', subject.section_id,
                    'name', subject.name
                )
            )
        ELSE '[]'::json
        END
        ) as subjects,
        (
            SELECT json_build_object(
                'id', g.id,
                'name', g.name,
                'level_id', g.level_id,
                'cycle_id', g.cycle_id,
                'modality_id', g.modality_id,
                'created_at', g.created_at
            )
            FROM grade g
            WHERE g.id = section.grade_id
        ) AS grade,
        (
            SELECT json_build_object(
                'id', l.id,
                'name', l.name,
                'modality_id', l.modality_id,
                'created_at', l.created_at
            )
            FROM level l
            WHERE l.id = section.level_id
        ) AS level,
        (
            SELECT json_build_object(
                'id', m.id,
                'name', m.name,
                'created_at', m.created_at
            )
            FROM modality m
            WHERE m.id = section.modality_id
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
            WHERE c.id = section.cycle_id
        ) AS cycle
        FROM section
        LEFT JOIN subject ON (subject.section_id = section.id AND subject.teacher_id = :teacher)
        WHERE section.teacher_id = :teacher
        GROUP BY section.id
        '''

        query_scope = '''
        SELECT s.*,
        (
        CASE WHEN COUNT(i.id) > 0 THEN
            json_agg(
                json_build_object(
                    'id', i.id,
                    'indicator', i.indicator,
                    'scope_id', i.scope_id
                )
            )
        ELSE '[]'::json
        END
        ) as indicators
        FROM scope_kinder s
        LEFT JOIN indicator_kinder i
        ON i.scope_id = s.id
        GROUP BY s.id
        '''
        result_scope = db.execute(text(query_scope))
        # for kinder
        scopes = await ResultParser(result_scope).all()
        result = db.execute(text(query).bindparams(teacher=teacher_id))
        sections = await ResultParser(result).all()
        return {'sections': sections, 'kinder_scopes': scopes}
    except IntegrityError as error:
        print(error)
        raise HTTPException(status_code=422)
    finally:
        db.close()

async def listStudentsBySection(section_id: str, db: Session):
    try:
        query = '''
        SELECT 
        (
            SELECT json_build_object(
                'id', section.id,
                'grade_id', section.grade_id,
                'cycle_id', section.cycle_id,
                'level_id', section.level_id,
                'modality_id', section.modality_id,
                'name', section.name
            ) FROM section WHERE section.id = rel.section_id
        ) AS section,
        (
        CASE WHEN COUNT(s.id) > 0 THEN
            json_agg(
                json_build_object(
                    'id', s.id,
                    'name', s.name,
                    'lastName', s."lastName",
                    'username', s.username,
                    'identification', s.identification,
                    'RNE', s."RNE",
                    'gender', s.gender,
                    'address', s.address,
                    'nationality', s.nationality,
                    'civil_status', s.civil_status,
                    'birth', s.birth,
                    'email', s.email,
                    'birth_place', s.birth_place,
                    'lives_with', s.lives_with,
                    'lives_with_name', s.lives_with_name,
                    'lives_with_lastName', s."lives_with_lastName",
                    'lives_with_relationship', s.lives_with_relationship,
                    'lives_with_address', s.lives_with_address,
                    'lives_with_phone', s.lives_with_phone,
                    'lives_with_email', s.lives_with_email,
                    'lives_with_job', s.lives_with_job,
                    'lives_with_job_address', s.lives_with_job_address
                ) ORDER BY s."lastName" DESC
            )
            ELSE '[]'::json
            END
        ) as students
        FROM student_section_relation rel
        JOIN students s ON s.id = rel.student_id
        WHERE rel.section_id = :section
        GROUP BY rel.section_id
        '''
        result = db.execute(text(query).bindparams(section=section_id))
        students = await ResultParser(result).first()
        return students
    except IntegrityError as error:
        print(error)
        raise HTTPException(status_code=422)
    finally:
        db.close()

async def listSubjectsByTeacher(section_id: str, teacher_id: str, db: Session):
    try:
        query = '''
        SELECT s.*
        FROM subject s
        WHERE s.section_id = :section
        AND s.teacher_id = :teacher
        '''
        result = db.execute(text(query).bindparams(section=section_id, teacher=teacher_id))
        subjects = await ResultParser(result).all()
        return subjects
    except IntegrityError as error:
        print(error)
        raise HTTPException(status_code=422)
    finally:
        db.close()