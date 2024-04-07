from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.db import get_database
import app.services.attendance as AttendanceService
from app.middlewares.auth import auth
import app.bases.attendance as AttendanceBase

router = APIRouter(
    prefix='/attendance'
)

@router.post('/list')
@auth(['profesor'])
async def getAttendance(request: Request, data: AttendanceBase.getAttendance, db: Session = Depends(get_database)):
    user = request.state.user
    result = await AttendanceService.getAttendance(data, user['id'], db)
    return result

@router.post('/')
@auth(['profesor'])
async def postAttendance(request: Request, data: AttendanceBase.newAttendance, db: Session = Depends(get_database)):
    result = await AttendanceService.postAttendance(data, db)
    return result