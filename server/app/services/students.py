from app.bases import students as StudentBases
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.db.models import Students
from fastapi import HTTPException
import bcrypt

async def register(data: StudentBases.Register, db: Session):
    try:
        salt = bcrypt.gensalt()
        hash = bcrypt.hashpw(data.password.encode('utf-8'), bytes(salt))
        user = Students(
            name=data.name,
            lastName=data.lastName,
            password=hash,
            username=data.username,
            identification=data.identification,
            RNE=data.RNE,
            gender=data.gender,
            pic=data.pic,
            address=data.address,
            nationality=data.nationality,
            civil_status=data.civil_status,
            birth=data.birth,
            email=data.email,
            # folio
            # libro
            # acta
            birth_place=data.birth_place,
            lives_with=data.lives_with,
                # lives_with is "otro"
            lives_with_name=data.lives_with_name,
            lives_with_lastName=data.lives_with_lastName,
            lives_with_relationship=data.lives_with_relationship,
            lives_with_address=data.lives_with_address, 
            lives_with_phone=data.lives_with_phone, 
            lives_with_email=data.lives_with_email, 
            lives_with_job=data.lives_with_job,
            lives_with_job_address=data.lives_with_job_address,
            # health
            emergency_name=data.emergency_name,
            emergency_phone=data.emergency_phone,
            emergency_identification=data.emergency_identification,
            alergies=data.alergies,
            medicines=data.medicines,
            disabilities=data.disabilities,
            level=data.level,
            # if level is "inicial"
            siblings_quantity=data.siblings_quantity,
                # array of numbers, length must be equal to brothers_quantity
            siblings_ages=data.siblings_ages,
            sibling_place=data.sibling_place,
            doctor_name=data.doctor_name,
            doctor_phone=data.doctor_phone,
            doctor_exequatur=data.doctor_exequatur,
                # vaccines
            tuberculosis=data.tuberculosis,
            influenza=data.influenza,
            spr=data.spr,
            neumoco=data.neumoco,
            hepatitis=data.hepatitis,
            bopv=data.bopv,
            covid=data.covid,
            vph=data.vph,
            dt=data.dt,
            pregnant_tdan=data.pregnant_tdan,
            pregnant_dt=data.pregnant_dt,
            pregnant_influenza=data.pregnant_influenza,
            # if level is 'primario' or 'secundario'
            student_status=data.student_status,
            enrolled_at=data.enrolled_at,
            removed_at=data.removed_at,
            promoted=data.promoted
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        user.password = None
        return user
    except IntegrityError as error:
        print(error)
        raise HTTPException(status_code=422)