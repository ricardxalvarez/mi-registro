from app.bases import admins as AdminBases
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.db.models import Admins
from fastapi import HTTPException
from ..utils.hash import hash

async def register(data: AdminBases.Register, db: Session):
    try:
        
        user = Admins(
            name=data.name,
            center_id=data.center_id,
            role=data.role,
            username=data.username,
            lastName=data.lastName,
            password=hash(data.password),
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