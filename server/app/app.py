from fastapi import FastAPI, Depends
from app.routes import users, students, admins, parents, teachers, grade, section, attendance, period, plan
from app.config import settings
from app.db.base_class import Base
from sqlalchemy.exc import SQLAlchemyError
from fastapi.middleware.cors import CORSMiddleware
from app.db import get_database
import sys

app = FastAPI(
    title=settings.PROJECT_NAME, 
    version=settings.PROJECT_VERSION,
    dependencies=[Depends(get_database)]
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