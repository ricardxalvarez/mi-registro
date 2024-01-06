from fastapi import APIRouter, Depends, Request
import app.services.students as StudentsService
import app.bases.students as StudentBase
from sqlalchemy.orm import Session
from app.db import get_database
from app.middlewares.auth import auth

router = APIRouter(
    prefix='/students'
)

@router.post('/register', tags=['Login'])
@auth(['administrador'])
async def register(request: Request, data: StudentBase.Register, db: Session = Depends(get_database)):
    result = await StudentsService.register(data=data, db=db)
    return result