from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.db import get_database
from app.middlewares.auth import auth
import app.services.plan as PlanService
import app.bases.plan as PlanBase

router = APIRouter(
    prefix='/plan'
)

@router.get('/section/{section_id}/subject/{subject_id}')
@auth(['profesor'])
async def getPlan(request: Request, section_id: str, subject_id: str, db: Session = Depends(get_database)):
    response = await PlanService.getPlan(section_id, subject_id, db)
    return response

@router.post('/change')
@auth(['profesor'])
async def changePlan(request: Request, data: PlanBase.onChange, db: Session = Depends(get_database)):
    response = await PlanService.onChange(data, db)
    return response