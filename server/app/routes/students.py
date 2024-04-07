from fastapi import APIRouter, Depends, Request, Form, UploadFile, File
from typing import List
import app.services.students as StudentsService
import app.bases.students as StudentBase
from app.bases.documents import Document
from app.bases.health import Health, Rotavirus, BOPV_DPT_DT, BOPV_DPT_TDAN, Influenza, COVID_19, VPH, DT
from sqlalchemy.orm import Session
from app.db import get_database
from app.middlewares.auth import auth
from app.utils.parsetime import parseTime
import ast

router = APIRouter(
    prefix='/students'
)

@router.post('/register', tags=['Login'])
@auth(['administrador'])
async def register(request: Request, 
        name: str = Form(...),
        lastName: str = Form(...),
        password: str = Form(...),
        section_id: str = Form(...),
        username: str = Form(...),
        identification: str = Form(...),
        RNE: str = Form(...),
        pic: UploadFile = File(None),
        address: str = Form(...),
        nationality: str = Form(...),
        civil_status: str = Form(...),
        birth: str = Form(...),
        gender: str = Form(...),
        email: str = Form(...),
        birth_place: str = Form(...),
        lives_with_name: str = Form(None),
        lives_with_lastName: str = Form(None),
        lives_with_relationship: str = Form(None),
        lives_with_address: str = Form(None),
        lives_with_phone: str = Form(None),
        lives_with_email: str = Form(None),
        lives_with_job: str = Form(None),
        lives_with_job_address: str = Form(None),
        lives_with: str = Form(...),
        emergency_phone: str = Form(...),
        emergency_name: str = Form(...),
        emergency_identification: str = Form(...),
        alergies: str = Form(...),
        disabilities: str = Form(...),
        medicines: str = Form(...),
        siblings_quantity: int = Form(None),
        siblings_ages: str = Form(None),
        sibling_place: int = Form(None),
        student_status: str = Form(None),
        enrolled_at: str = Form(None),
        removed_at: str = Form(None),
        promoted: bool = Form(False),
        # documents
        birth_certificate: UploadFile = File(None),
        birth_warrant: UploadFile = File(None),
        family_letter: UploadFile = File(None),
        behavior_letter: UploadFile = File(None),
        father_id: UploadFile = File(None),
        mother_id: UploadFile = File(None),
        evlc_sicometric: UploadFile = File(None),
        photo: UploadFile = File(None),
        form_inscription: UploadFile = File(None),
        admission_test: UploadFile = File(None),
        health_insurance: UploadFile = File(None),
        vaccination_card: UploadFile = File(None),
        id_card: UploadFile = File(None),
        passport: UploadFile = File(None),
        # vaccines
        doctor_name: str = Form(None),
        doctor_phone: str = Form(None),
        doctor_exequatur: str = Form(None),
        tuberculosis: str = Form(None),
        hepatitis: str = Form(None),
        rotavirus_first: str = Form(None),
        rotavirus_second: str = Form(None),
        rotavirus_third: str = Form(None),
        influenza_first: str = Form(None),
        influenza_second: str = Form(None),
        influenza_boost: str = Form(None),
        spr_12: str = Form(None),
        neumoco: str = Form(None),
        spr_18: str = Form(None),
        bopv_dpt_tdan_first: str = Form(None),
        bopv_dpt_tdan_boost: str = Form(None),
        bopv_dpt_dt_second: str = Form(None),
        bopv_dpt_dt_boost: str = Form(None),
        covid_first: str = Form(None),
        covid_second: str = Form(None),
        vph_first: str = Form(None),
        vph_second: str = Form(None),
        dt_third: str = Form(None),
        dt_boost: str = Form(None),
        pregnant_tdan: str = Form(None),
        pregnant_dt: str = Form(None),
        pregnant_influenza: str = Form(None),
        db: Session = Depends(get_database)):
            siblings_ages_list = []
            if siblings_ages:
                for age in ast.literal_eval(siblings_ages):
                    try:
                        siblings_ages_list.append(int(age))
                    except ValueError:
                        continue
            print(siblings_ages_list)
            data = StudentBase.Register(
                name=name,
                lastName=lastName,
                password=password,
                section_id=section_id,
                username=username,
                identification=identification,
                RNE=RNE,
                pic=pic,
                address=address,
                nationality=nationality,
                civil_status=civil_status,
                birth=birth,
                gender=gender,
                email=email,
                birth_place=birth_place,
                lives_with_name=lives_with_name,
                lives_with_lastName=lives_with_lastName,
                lives_with_relationship=lives_with_relationship,
                lives_with_address=lives_with_address,
                lives_with_phone=lives_with_phone,
                lives_with_email=lives_with_email,
                lives_with_job=lives_with_job,
                lives_with_job_address=lives_with_job_address,
                lives_with=lives_with,
                health=Health(
                    emergency_phone=emergency_phone,
                    emergency_name=emergency_name,
                    emergency_identification=emergency_identification,
                    alergies=alergies,
                    disabilities=disabilities,
                    medicines=medicines,
                    doctor_name=doctor_name,
                    doctor_phone=doctor_phone,
                    doctor_exequatur=doctor_exequatur,
                    tuberculosis=parseTime(tuberculosis),
                    hepatitis=parseTime(hepatitis),
                    rotavirus=Rotavirus(
                        first=parseTime(rotavirus_first),
                        second=parseTime(rotavirus_second),
                        third=parseTime(rotavirus_third),
                    ),
                    influenza=Influenza(
                        first=parseTime(influenza_first),
                        second=parseTime(influenza_second),
                        boost=parseTime(influenza_boost)
                    ),
                    spr_12=parseTime(spr_12),
                    neumoco=parseTime(neumoco),
                    spr_18=parseTime(spr_18),
                    bopv_dpt_tdan=BOPV_DPT_TDAN(
                        first=parseTime(bopv_dpt_tdan_first),
                        boost=parseTime(bopv_dpt_tdan_boost)
                    ),
                    bopv_dpt_dt=BOPV_DPT_DT(
                        second=parseTime(bopv_dpt_dt_second),
                        boost=parseTime(bopv_dpt_dt_boost)
                    ),
                    covid=COVID_19(
                        first=parseTime(covid_first),
                        second=parseTime(covid_second)
                    ),
                    vph=VPH(
                        first=parseTime(vph_first),
                        second=parseTime(vph_second)
                    ),
                    dt=DT(
                        third=parseTime(dt_third),
                        boost=parseTime(dt_boost)
                    ),
                    pregnant_tdan=parseTime(pregnant_tdan),
                    pregnant_dt=parseTime(pregnant_dt),
                    pregnant_influenza=parseTime(pregnant_influenza)
                ),
                documents=Document(
                    birth_certificate=birth_certificate,
                    birth_warrant=birth_warrant,
                    family_letter=family_letter,
                    behavior_letter=behavior_letter,
                    father_id=father_id,
                    mother_id=mother_id,
                    evlc_sicometric=evlc_sicometric,
                    photo=photo,
                    form_inscription=form_inscription,
                    admission_test=admission_test,
                    health_insurance=health_insurance,
                    vaccination_card=vaccination_card,
                    id_card=id_card,
                    passport=passport
                ),
                siblings_quantity=siblings_quantity,
                siblings_ages=siblings_ages_list,
                sibling_place=sibling_place,
                student_status=student_status,
                enrolled_at=enrolled_at,
                removed_at=removed_at,
                promoted=promoted
            )

            user = request.state.user
            result = await StudentsService.register(data=data, center_id=user['center_id'], db=db)
            return result