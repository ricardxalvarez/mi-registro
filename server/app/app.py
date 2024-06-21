from fastapi import FastAPI, Depends
from app.routes import users, students, admins, parents, teachers, grade, section, attendance, period, plan
from app.config import settings
from app.db.base_class import Base
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import event
from fastapi.middleware.cors import CORSMiddleware
from app.db import get_database
from app.db.models import *
from app.db.models.location import *
import sys

app = FastAPI(
    title=settings.PROJECT_NAME, 
    version=settings.PROJECT_VERSION,
    dependencies=[Depends(get_database)],
    redirect_slashes=False
    )

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sys.setrecursionlimit(1500)

event.listen(Region.__table__, 'after_create', initialize_tables)
event.listen(Province.__table__, 'after_create', initialize_tables)
event.listen(Municipality.__table__, 'after_create', initialize_tables)
event.listen(MunicipalDistrict.__table__, 'after_create', initialize_tables)
event.listen(Neighborhood.__table__, 'after_create', initialize_tables)
event.listen(Subneighborhood.__table__, 'after_create', initialize_tables)
event.listen(Regional.__table__, 'after_create', initialize_tables)
event.listen(EducationalDistrict.__table__, 'after_create', initialize_tables)
event.listen(Center.__table__, 'after_create', initialize_tables)
event.listen(Admins.__table__, 'after_create', initialize_tables)
event.listen(Modality.__table__, 'after_create', initialize_tables)
event.listen(Level.__table__, 'after_create', initialize_tables)
event.listen(Cycle.__table__, 'after_create', initialize_tables)
event.listen(Grade.__table__, 'after_create', initialize_tables)
event.listen(Teachers.__table__, 'after_create', initialize_tables)
event.listen(Section.__table__, 'after_create', initialize_tables)
event.listen(Subject.__table__, 'after_create', initialize_tables)
event.listen(Period.__table__, 'after_create', initialize_tables)
event.listen(Students.__table__, 'after_create', initialize_tables)
event.listen(Documents.__table__, 'after_create', initialize_tables)
event.listen(Health.__table__, 'after_create', initialize_tables)
event.listen(StudentSectionRelation.__table__, 'after_create', initialize_tables)

@app.on_event("startup")
async def startup_event():
    try:
        print('Connecting to db')
        with get_database() as db:
            Base.metadata.create_all(bind=db.bind)
    except SQLAlchemyError as e:
        print(f'Failed connecting to db: {e}')

@app.get("/", tags=['ROOT'])
def root() -> str:
    return 'Welcome to mi registro'

app.include_router(users.router)
app.include_router(students.router)
app.include_router(parents.router)
app.include_router(teachers.router)
app.include_router(admins.router)
app.include_router(grade.router)
app.include_router(section.router)
app.include_router(attendance.router)
app.include_router(period.router)
app.include_router(plan.router)