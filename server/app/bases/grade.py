import re
from pydantic import BaseModel, validator, EmailStr, Field, constr
from typing import Any, Optional

class ChangeGrade(BaseModel):
    period_id: str 
    indicator_kinder_id: str = None
    student_id: str
    subject_id: str = None
    # primario y secundario
    cp1: Optional[int] = None
    rcp1: Optional[int] = None
    cp2: Optional[int] = None
    rcp2: Optional[int] = None
    cp3: Optional[int] = None
    rcp3: Optional[int] = None
    # solo secundario
    cp4: Optional[int] = None
    rcp4: Optional[int] = None

    # inicial
    grade: str = None
