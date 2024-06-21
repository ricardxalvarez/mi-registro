import re
from pydantic import BaseModel, validator, EmailStr, Field, constr
from typing import Any, Optional

class Document(BaseModel):
    birth_certificate: Optional[Any] = None
    birth_warrant: Optional[Any] = None
    family_letter: Optional[Any] = None
    behavior_letter: Optional[Any] = None
    father_id: Optional[Any] = None
    mother_id: Optional[Any] = None
    evlc_sicometric: Optional[Any] = None
    photo: Optional[Any] = None
    form_inscription: Optional[Any] = None
    admission_test: Optional[Any] = None
    health_insurance: Optional[Any] = None
    vaccination_card: Optional[Any] = None
    id_card: Optional[Any] = None
    passport: Optional[Any] = None
