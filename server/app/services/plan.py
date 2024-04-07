from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.db.models.grades import *
from app.db.models import *
from fastapi import HTTPException
import app.bases.plan as PlanBase
from app.utils.ResultParser import ResultParser
from sqlalchemy import text, update

async def getPlan(section_id: str, subject_id: str, db: Session):
    try:
        query_planification = '''
        SELECT p.*,
        (
            SELECT json_build_object(
                'id', e.id,
                'subject_id', e.subject_id,
                'grade_id', e.grade_id,
                'cycle_id', e.cycle_id,
                'level_id', e.level_id,
                'modality_id', e.modality_id,
                'fundamental_competency_id', e.fundamental_competency_id,
                'name', e.name
            )
            FROM especific_competency e
            WHERE e.id = p.especific_competency_id
        ) AS especific_competency,
        (
            SELECT json_build_object(
                'level_id', i.level_id,
                'subject_id', i.subject_id,
                'grade_id', i.grade_id,
                'fundamental_competency_id', i.fundamental_competency_id,
                'name', i.name
            )
            FROM indicator i
            WHERE i.id = p.indicator_id
        ) AS indicator
        FROM planification p
        WHERE p.section_id = :section
        AND p.subject_id = :subject
        ORDER BY p.created_at DESC
        '''

        query_aspect_worked = '''
        SELECT a.*,
        (
            SELECT json_build_object(
                'id', e.id,
                'subject_id', e.subject_id,
                'grade_id', e.grade_id,
                'cycle_id', e.cycle_id,
                'level_id', e.level_id,
                'modality_id', e.modality_id,
                'fundamental_competency_id', e.fundamental_competency_id,
                'name', e.name
            )
            FROM especific_competency e
            WHERE e.id = a.especific_competency_id
        ) AS especific_competency,
        (
            SELECT json_build_object(
                'id', f.id,
                'subject_id', f.subject_id,
                'grade_id', f.grade_id,
                'cycle_id', f.cycle_id,
                'level_id', f.level_id,
                'modality_id', f.modality_id,
                'name', f.name
            )
            FROM fundamental_competency f
            WHERE f.id = a.fundamental_competency_id
        ) AS fundamental_competency,
        (
            SELECT json_build_object(
                'id', c.id,
                'especific_competency_id', c.especific_competency_id,
                'fundamental_competency_id', c.fundamental_competency_id,
                'subject_id', c.subject_id,
                'grade_id', c.grade_id,
                'level_id', c.level_id,
                'category', c.category,
                'description', c.description
            )
            FROM content c
            WHERE c.id = a.content_id
        ) AS content
        FROM aspect_worked a
        WHERE a.section_id = :section
        AND a.subject_id = :subject
        ORDER BY a.created_at DESC
        '''

        result_planification = db.execute(text(query_planification).bindparams(section=section_id, subject=subject_id))
        planifications = await ResultParser(result_planification).all()

        result_aspect_worked = db.execute(text(query_aspect_worked).bindparams(section=section_id, subject=subject_id))
        aspects_worked = await ResultParser(result_aspect_worked).all()
        response = [*planifications, *aspects_worked]

        periods = db.query(Period).filter(Period.section_id == section_id).all()

        fundamental_competency_query_especific = '''
        SELECT f.*,
        (
        CASE WHEN COUNT(DISTINCT e.id) > 0 THEN
            json_agg(
                json_build_object(
                    'id', e.id,
                    'fundamental_competency_id', e.fundamental_competency_id,
                    'subject_id', e.subject_id,
                    'grade_id', e.grade_id,
                    'cycle_id', e.cycle_id,
                    'level_id', e.level_id,
                    'modality_id', e.modality_id,
                    'name', e.name
                )
            )
        ELSE '[]'::json
        END
        ) as especific_competencies
        FROM fundamental_competency f
        LEFT JOIN especific_competency e ON e.fundamental_competency_id = f.id
        WHERE f.subject_id = :subject
        GROUP BY f.id
        ORDER BY f.created_at DESC
        ''' 

        fundamental_competency_query_indicator = '''
        SELECT f.*,
        (
        CASE WHEN COUNT(DISTINCT i.id) > 0 THEN
            json_agg(
                json_build_object(
                    'id', i.id,
                    'fundamental_competency_id', i.fundamental_competency_id,
                    'subject_id', i.subject_id,
                    'grade_id', i.grade_id,
                    'level_id', i.level_id,
                    'name', i.name
                )
            )
        ELSE '[]'::json
        END
        ) as indicators
        FROM fundamental_competency f
        LEFT JOIN indicator i ON i.fundamental_competency_id = f.id
        WHERE f.subject_id = :subject
        GROUP BY f.id
        ORDER BY f.created_at DESC
        ''' 
        
        fundamental_competency_query_content = '''
        SELECT f.*,
        (
        CASE WHEN COUNT(DISTINCT c.id) > 0 THEN
            json_agg(
                json_build_object(
                    'id', c.id,
                    'fundamental_competency_id', c.fundamental_competency_id,
                    'subject_id', c.subject_id,
                    'grade_id', c.grade_id,
                    'level_id', c.level_id,
                    'category', c.category,
                    'description', c.description
                )
            )
        ELSE '[]'::json
        END
        ) as contents
        FROM fundamental_competency f
        LEFT JOIN content c ON c.fundamental_competency_id = f.id
        WHERE f.subject_id = :subject
        GROUP BY f.id
        ORDER BY f.created_at DESC
        ''' 

        result_fundamental_especific = db.execute(text(fundamental_competency_query_especific).bindparams(subject=subject_id))
        result_fundamental_indicator = db.execute(text(fundamental_competency_query_indicator).bindparams(subject=subject_id))
        result_fundamental_content =  db.execute(text(fundamental_competency_query_content).bindparams(subject=subject_id))
        fundamental_competencies_especific = await ResultParser(result_fundamental_especific).all()
        fundamental_competencies_indicator = await ResultParser(result_fundamental_indicator).all()
        fundamental_competencies_content = await ResultParser(result_fundamental_content).all()
        fundamental_competencies = []

        for f in fundamental_competencies_especific:
            item_indicator = next(item for item in fundamental_competencies_indicator if item["id"] == f['id'])
            item_content = next(item for item in fundamental_competencies_content if item["id"] == f['id'])
            f['indicators'] = item_indicator['indicators']
            f['contents'] = item_content['contents']
            fundamental_competencies.append(f)

        return {'plan': response, 'periods': periods, 'fundamental_competencies': fundamental_competencies}
    except IntegrityError as error:
        print(error)
        raise HTTPException(status_code=422)
    finally:
        db.close()

async def onChange(data: PlanBase.onChange, db: Session):
    try:
        period = db.query(Period).where(Period.id == data.period_id).first()
        level = db.query(Level).where(Level.id == period.level_id).first()
        if (level.name == 'secundario'):
            plan = db.query(Planification).filter(
                Planification.subject_id == data.subject_id,
                Planification.period_id == data.period_id,
                Planification.section_id == data.section_id,
                ).first()
            if not plan:
                newPlan = Planification(
                    subject_id=data.subject_id,
                    period_id=data.period_id,
                    section_id=data.section_id,
                    especific_competency_id=data.especific_competency_id,
                    indicator_id=data.indicator_id,
                    key_content=data.key_content,
                )

                db.add(newPlan)
                db.commit()
                return 'Plan updated'
            else:
                db.execute(
                    update(Planification)
                    .where(Planification.id == plan.id)
                    .values(
                        especific_competency_id=data.especific_competency_id,
                        indicator_id=data.indicator_id,
                        key_content=data.key_content,
                    )
                )
                db.commit()
                return 'Plan updated'

        if (level.name == 'primario'):
            aspect = db.query(AspectWorked).filter(
                AspectWorked.subject_id == data.subject_id,
                AspectWorked.period_id == data.period_id,
                AspectWorked.section_id == data.section_id,
                ).first()
            if not aspect:
                newAspect = AspectWorked(
                    subject_id=data.subject_id,
                    period_id=data.period_id,
                    section_id=data.section_id,
                    especific_competency_id=data.especific_competency_id,
                    fundamental_competency_id=data.fundamental_competency_id,
                    content_id=data.content_id
                )
                db.add(newAspect)
                db.commit()
                return 'Plan updated'
            else:
                db.execute(
                    update(AspectWorked)
                    .where(AspectWorked.id == aspect.id)
                    .values(
                        indicator_id=data.indicator_id,
                        especific_competency_id=data.especific_competency_id,
                        fundamental_competency_id=data.fundamental_competency_id,
                        content_id=data.content_id
                    )
                )
                db.commit()
                return 'Plan updated'
    except IntegrityError as error:
        print(error)
        raise HTTPException(status_code=422)
    finally:
        db.close()