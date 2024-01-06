from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.db import get_database
import app.services.teachers as TeacherService
import app.bases.teachers as TeacherBase
from app.middlewares.auth import auth

router = APIRouter(
    prefix='/teachers'
)

@router.post('/register', tags=['Login'])
@auth(['administrador'])
async def register(request: Request, data: TeacherBase.Register, db: Session = Depends(get_database)):
    result = await TeacherService.register(data=data, db=db)
    return result