from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.db import get_database
from app.middlewares.auth import auth
import app.services.section as SectionService

router = APIRouter(
    prefix='/section'
)

@router.get('/list/teacher/')
@auth(['profesor'])
async def listSectionsByTeacher(request: Request, db: Session = Depends(get_database)):
    user = request.state.user
    result = await SectionService.listSectionsByTeacher(teacher_id=user['id'], db=db)
    return result

@router.get('/list/students/{section_id}')
@auth(['profesor'])
async def listStudentsBySection(request: Request, section_id: str, db: Session = Depends(get_database)):
    result = await SectionService.listStudentsBySection(section_id, db)
    return result

@router.get('/list/subject/{section_id}/teacher/')
@auth(['profesor'])
async def listSubjectsByTeacher(request: Request, section_id: str, db: Session = Depends(get_database)):
    user = request.state.user
    result = await SectionService.listSubjectsByTeacher(section_id, user['id'], db)
    return result