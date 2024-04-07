from app.bases import students as StudentBases
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.db.models import *
from app.utils.checkKeys import check_keys
from app.utils.parsetime import parseTime
from fastapi import HTTPException
import bcrypt
from datetime import datetime
import secrets
import string
from app.config import settings

def generate_random_string(length):
    characters = string.ascii_letters + string.digits
    return ''.join(secrets.choice(characters) for _ in range(length))

async def register(data: StudentBases.Register, center_id: str, db: Session):
    try:
        section = db.query(Section).where(Section.id == data.section_id ).first()
        level = db.query(Level).where(Level.id == section.level_id).first()
        print(data)
        if (level.name == 'inicial'):
            print('error primario')
            required_keys_health = ['doctor_name', 'doctor_phone', 
            'doctor_exequatur', 'tuberculosis', 'hepatitis', 
            'rotavirus', 'influenza','spr_12', 'neumoco', 'spr_18', 
            'bopv_dpt_tdan', 'bopv_dpt_dt', 'covid', 'vph', 'dt', 
            'pregnant_tdan', 'pregnant_dt', 'pregnant_influenza',
            ]
            required_keys = [
            'siblings_quantity', 'siblings_ages', 'sibling_place'
            ]
            if not check_keys(required_keys_health, data.health.dict()):
                raise HTTPException(status_code=422)
            if not check_keys(required_keys, data.dict()):
                raise HTTPException(status_code=422)
        
        if (level.name == 'primario' or level.name == 'secundario'):
            required_keys = ['student_status', 'enrolled_at', 'promoted']
            if not check_keys(required_keys, data.dict()):
                raise HTTPException(status_code=422)

        salt = bcrypt.gensalt()
        hash = bcrypt.hashpw(data.password.encode('utf-8'), bytes(salt))
        user = Students(
            center_id=center_id,
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
            birth=parseTime(data.birth),
            email=data.email,
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
            # if level is "inicial"
            siblings_quantity=data.siblings_quantity,
                # array of numbers, length must be equal to brothers_quantity
            siblings_ages=data.siblings_ages,
            sibling_place=data.sibling_place,
            # if level is 'primario' or 'secundario'
            student_status=data.student_status,
            enrolled_at=parseTime(data.enrolled_at),
            removed_at=parseTime(data.removed_at),
            promoted=data.promoted,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        if data.health:
            print(data.health.rotavirus)
            health = Health(
                student_id=user.id,
                emergency_name=data.health.emergency_name,
                emergency_phone=data.health.emergency_phone,
                emergency_identification=data.health.emergency_identification,
                alergies=data.health.alergies,
                medicines=data.health.medicines,
                disabilities=data.health.disabilities,
                doctor_name=data.health.doctor_name,
                doctor_phone=data.health.doctor_phone,
                doctor_exequatur=data.health.doctor_exequatur,
                tuberculosis=data.health.tuberculosis,
                hepatitis=data.health.hepatitis, 
                rotavirus=data.health.rotavirus.json(), 
                influenza=data.health.influenza.json(), 
                spr_12=data.health.spr_12,
                neumoco=data.health.neumoco,
                spr_18=data.health.spr_18,
                bopv_dpt_tdan=data.health.bopv_dpt_tdan.json(),
                bopv_dpt_dt=data.health.bopv_dpt_dt.json(),
                covid=data.health.covid.json(),
                vph=data.health.vph.json(),
                dt=data.health.dt.json(),
                pregnant_tdan=data.health.pregnant_tdan,
                pregnant_dt=data.health.pregnant_dt,
                pregnant_influenza=data.health.pregnant_influenza 
            )
            db.add(health)

        relation = StudentSectionRelation(
            student_id=user.id,
            section_id=data.section_id
        )
        
        uploaded_documents = {}

        if not os.path.exists(settings.DIST_FOLDER):
            os.makedirs(settings.DIST_FOLDER)
        # Save the additional file received

        for doc_name, file_obj in data.documents.dict().items():
        # Save each document provided in the request body
            print(file_obj)
            if not file_obj:
                continue
            current_date = datetime.now().strftime("%Y-%m-%d")
            random_chars = generate_random_string(4)
            original_filename, file_extension = os.path.splitext(file_obj.filename)
            new_filename = f"{original_filename}-{current_date}-{random_chars}{file_extension}"
            file_content = await file_obj.read()
            file_path = os.path.join(settings.DIST_FOLDER, new_filename)
            with open(file_path, "wb") as f:
                f.write(file_content)
            uploaded_documents[doc_name] = new_filename

        documents = Documents(
            student_id=user.id,
            birth_certificate=uploaded_documents.get('birth_certificate'),
            birth_warrant=uploaded_documents.get('birth_warrant'),
            family_letter=uploaded_documents.get('family_letter'),
            behavior_letter=uploaded_documents.get('behavior_letter'),
            father_id=uploaded_documents.get('father_id'),
            mother_id=uploaded_documents.get('mother_id'),
            evlc_sicometric=uploaded_documents.get('evlc_sicometric'),
            photo=uploaded_documents.get('photo'),
            form_inscription=uploaded_documents.get('form_inscription'),
            admission_test=uploaded_documents.get('admission_test'),
            health_insurance=uploaded_documents.get('health_insurance'),
            vaccination_card=uploaded_documents.get('vaccination_card'),
            id_card=uploaded_documents.get('id_card'),
            passport=uploaded_documents.get('passport')
        )

        db.add(relation)
        db.add(documents)
        db.commit()

        user.password = None
        return user
    except IntegrityError as error:
        print(error)
        raise HTTPException(status_code=422)
    finally:
        db.close()