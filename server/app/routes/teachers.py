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
    user = request.state.user
    result = await TeacherService.register(data=data, center_id=user['center_id'], db=db)
    return result

@router.get('/me')
@auth(['profesor'])
async def me(request: Request, db: Session = Depends(get_database)):
    user = request.state.user
    result = await TeacherService.me(user['id'], db)
    return result

@router.put('/update')
@auth(['profesor'])
async def update(request: Request, data: TeacherBase.Training, db: Session = Depends(get_database)):
    user = request.state.user
    result = await TeacherService.updateTeacher(user['id'], data, db)
    return result