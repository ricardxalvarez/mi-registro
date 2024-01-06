from fastapi import APIRouter, Depends, Request
import app.services.parents as ParentsService
import app.bases.parents as ParentBase
from sqlalchemy.orm import Session
from app.db import get_database
from app.middlewares.auth import auth

router = APIRouter(
    prefix='/parents'
)

@router.post('/register', tags=['Login'])
@auth(['administrador'])
async def register(request: Request, data: ParentBase.Register, db: Session = Depends(get_database)):
    result = await ParentsService.register(data=data, db=db)
    return result