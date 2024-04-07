from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.db import get_database
from app.middlewares.auth import auth
import app.services.grade as GradeService
import app.bases.grade as GradeBase

router = APIRouter(
    prefix='/grade'
)

@router.get('/list', tags=['Login'])
@auth(['administrador'])
async def getGrades(request: Request, db: Session = Depends(get_database)):
    result = await GradeService.getGrades(db=db)
    return result

@router.get('/section/{grade}')
@auth(['administrador'])
async def getSectionsByGrade(request: Request, grade: str, db: Session = Depends(get_database)):
    result = await GradeService.getSectionsByGrade(grade_id=grade, db=db)
    return result

@router.post('/change')
@auth(['profesor'])
async def changeGrade(request: Request, data: GradeBase.ChangeGrade, db: Session = Depends(get_database)):
    result = await GradeService.changeGrade(data, db)
    return result