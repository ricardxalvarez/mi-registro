from app.bases import admins as AdminBases
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.db.models import Admins
from fastapi import HTTPException
import bcrypt

async def register(data: AdminBases.Register, db: Session):
    try:
        salt = bcrypt.gensalt()
        hash = bcrypt.hashpw(data.password.encode('utf-8'), bytes(salt))
        user = Admins(
            name=data.name,
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
            # labor
            rank=data.rank
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        user.password = None
        return user
    except IntegrityError as error:
        print(error)
        raise HTTPException(status_code=422)