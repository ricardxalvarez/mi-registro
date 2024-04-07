from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.db import get_database
from app.middlewares.auth import auth
import app.services.period as PeriodService
import app.bases.period as PeriodBase

router = APIRouter(
    prefix='/period'
)

@router.get('/list/{section_id}')
@auth(['profesor'])
async def getPeriods(request: Request, section_id: str, db: Session = Depends(get_database)):
    user = request.state.user
    result = await PeriodService.getPeriods(section_id, user['id'], db)
    return result