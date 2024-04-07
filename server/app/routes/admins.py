from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.db import get_database
import app.services.admins as AdminService
import app.bases.admins as AdminBase
from app.middlewares.auth import auth

router = APIRouter(
    prefix='/admins'
)

@router.post('/register', tags=['Login'])
# @auth(['administrador'])
async def register(request: Request, data: AdminBase.Register, db: Session = Depends(get_database)):
    # print(request.state.user)
    result = await AdminService.register(data=data, db=db)
    return result