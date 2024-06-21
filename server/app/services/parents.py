from app.bases import parents as ParentBases
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.db.models import Parents, Students, ParentChildrenRelation
from fastapi import HTTPException
from app.utils.has_no_duplicates import has_no_duplicates
from ..utils.hash import hash

async def register(data: ParentBases.Register, db: Session):
    try:
        if not has_no_duplicates(data.children):
            raise HTTPException(status_code=422, detail=f"Cannot save same children to one parent")
        for child_username in data.children:
            student = db.query(Students.id).filter(Students.username == child_username).first()
            if not student:
                raise HTTPException(status_code=422, detail=f"No student with username {child_username}")
        
        user = Parents(
            name=data.name,
            username=data.username,
            lastName=data.lastName,
            password=hash(data.password),
            id_card=data.id_card,
            passport=data.passport,
            relationship=data.relationship,
            gender=data.gender,
            email=data.email,
            age=data.age,
            nationality=data.nationality,
            phone=data.phone,
            address=data.address,
            landline=data.landline,
            scholarship=data.scholarship,
            # job
            job=data.job,
            job_address=data.job_address,
            job_phone=data.job_phone
        )
        db.add(user)
        db.commit()
        for child_username in data.children:
            relation = ParentChildrenRelation(
                parent=user.username,
                child=child_username
            )
            db.add(relation)
            db.commit()
            # db.refresh(relation)
        db.refresh(user)
        user.password = None
        return user
    except IntegrityError as error:
        print(error)
        raise HTTPException(status_code=422)
    finally:
        db.close()