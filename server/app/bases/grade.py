import re
from pydantic import BaseModel, validator, EmailStr, Field, constr
from typing import Any

class ChangeGrade(BaseModel):
    period_id: str 
    indicator_kinder_id: str = None
    student_id: str
    subject_id: str = None
    # primario y secundario
    cp1: int | None = None
    rcp1: int | None = None
    cp2: int | None = None
    rcp2: int | None = None
    cp3: int | None = None
    rcp3: int | None = None
    # solo secundario
    cp4: int | None = None
    rcp4: int | None = None

    # inicial
    grade: str = None
