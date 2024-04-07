from app.bases import teachers as TeacherBases
from sqlalchemy import update
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.db.models import *
from fastapi import HTTPException
import bcrypt

async def register(data: TeacherBases.Register, center_id: str, db: Session):
    try:
        salt = bcrypt.gensalt()
        hash = bcrypt.hashpw(data.password.encode('utf-8'), bytes(salt))
        user = Teachers(
            name=data.name,
            center_id=center_id,
            username=data.username,
            lastName=data.lastName,
            password=hash,
            identification=data.identification,
            pic=data.pic,
            gender=data.gender,
            email=data.email,
            age=data.age,
            nationality=data.nationality,
            civil_status=data.civil_status,
            address=data.address,
            # academic
            years_of_service=data.years_of_service,
            expertise=data.expertise,
            degree=data.degree,
            current_studies=data.current_studies,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        user.password = None
        return user
    except IntegrityError as error:
        print(error)
        raise HTTPException(status_code=422)
    finally:
        db.close()
    
async def me(id: str, db: Session):
    try:
        teacher = db.query(Teachers).where(Teachers.id == id).first()
        return teacher
    except IntegrityError as error:
        print(error)
        raise HTTPException(status_code=422)
    finally:
        db.close()
    
async def updateTeacher(id: str, data: TeacherBases.Training, db: Session):
    try:
        db.execute(
            update(Teachers)
            .where(Teachers.id == id)
            .values(
                years_of_service=data.years_of_service,
                expertise=data.expertise,
                degree=data.degree,
                current_studies=data.current_studies,
            )
        )
        db.commit()
        return 'Info updated'
    except IntegrityError as error:
        print(error)
        raise HTTPException(status_code=422)
    finally:
        db.close()