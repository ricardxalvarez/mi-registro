from fastapi import APIRouter, Depends
import app.services.users as UsersService
import app.bases.users as UserBase
from sqlalchemy.orm import Session
from app.db import get_database

router = APIRouter(
    prefix='/users'
)

@router.post('/login', tags=['Login'])
async def login(data: UserBase.Login, db: Session = Depends(get_database)):
    result = await UsersService.login(data=data, db=db)
    return result