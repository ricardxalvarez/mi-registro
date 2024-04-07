from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.db.models.grades import *
from fastapi import HTTPException
import app.bases.period as PeriodBase
from app.utils.ResultParser import ResultParser
from sqlalchemy import text

async def getPeriods(section_id: str, teacher_id: str, db: Session):
    try:
        query = '''
        SELECT p.*,
        (
            SELECT json_build_object(
                'id', l.id,
                'name', l.name,
                'modality_id', l.modality_id,
                'created_at', l.created_at
            ) FROM level l WHERE l.id = p.level_id
        ) AS level,
        (
        CASE WHEN COUNT(g.id) > 0 THEN
            json_agg(
                json_build_object(
                    'id', g.id,
                    'cp1', g.cp1,
                    'rcp1', g.rcp1,
                    'cp2', g.cp2,
                    'rcp2', g.rcp2,
                    'cp3', g.cp3,
                    'rcp3', g.rcp3,
                    'cp4', g.cp4,
                    'rcp4', g.rcp4,
                    'student_id', g.student_id,
                    'grade_id', g.grade_id,
                    'level_id', g.level_id,
                    'modality_id', g.modality_id,
                    'section_id', g.section_id,
                    'center_id', g.center_id,
                    'teacher_id', g.teacher_id,
                    'period_id', g.period_id,
                    'subject_id', g.subject_id
                )
            )
        ELSE '[]'::json
        END
        ) as grades
        FROM 
        period p
        LEFT JOIN grade_ps g ON g.period_id = p.id
        WHERE p.section_id = :section
        
        GROUP BY p.id
        '''
        query_kinder = '''
        SELECT p.*,
        (
            SELECT json_build_object(
                'id', l.id,
                'name', l.name,
                'modality_id', l.modality_id,
                'created_at', l.created_at
            ) FROM level l WHERE l.id = p.level_id
        ) AS level,
        (
        CASE WHEN COUNT(g.id) > 0 THEN
            json_agg(
                json_build_object(
                    'id', g.id,
                    'scope_id', g.scope_id,
                    'indicator_kinder_id', g.indicator_kinder_id,
                    'student_id', g.student_id,
                    'section_id', g.section_id,
                    'center_id', g.center_id,
                    'teacher_id', g.teacher_id,
                    'period_id', g.period_id,
                    'grade', g.grade,
                    'scope', 
                    (
                        SELECT 
                            json_build_object (
                                'id', s.id,
                                'li', s.li,
                                'rsia', s.rsia
                            )
                        FROM 
                            scope_kinder s 
                        WHERE 
                            s.id = g.scope_id
                    ),
                    'indicator', 
                    (
                        SELECT 
                            json_build_object (
                                'id', i.id,
                                'indicator', i.indicator,
                                'scope_id', i.scope_id
                            )
                        FROM 
                            indicator_kinder i 
                        WHERE 
                            i.id = g.indicator_kinder_id
                    )
                )
            )
        ELSE '[]'::json
        END
        ) as grades
        FROM 
        kinder_period p
        LEFT JOIN grades_kinder g ON g.period_id = p.id
        WHERE p.section_id = :section
        GROUP BY p.id
        ORDER BY p.created_at DESC
        '''
        result = db.execute(text(query).bindparams(section=section_id))
        period = await ResultParser(result).all()
        result_kinder = db.execute(text(query_kinder).bindparams(section=section_id))
        period_kinder = await ResultParser(result_kinder).all()
        periods_response = [*period, *period_kinder]
        
        query_subject = '''
        SELECT s.*
        FROM subject s
        WHERE s.section_id = :section
        AND s.teacher_id = :teacher
        '''
        result_subject = db.execute(text(query_subject).bindparams(section=section_id, teacher=teacher_id))
        subjects = await ResultParser(result_subject).all() 
        subjects_response = [*subjects]
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
        return {'periods': periods_response, 'subjects': subjects_response, 'scopes': scopes}
    except IntegrityError as error:
        print(error)
        raise HTTPException(status_code=422)
    finally:
        db.close()

