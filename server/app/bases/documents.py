import re
from pydantic import BaseModel, validator, EmailStr, Field, constr
from typing import Any

class Document(BaseModel):
    birth_certificate: Any | None = None
    birth_warrant: Any | None = None
    family_letter: Any | None = None
    behavior_letter: Any | None = None
    father_id: Any | None = None
    mother_id: Any | None = None
    evlc_sicometric: Any | None = None
    photo: Any | None = None
    form_inscription: Any | None = None
    admission_test: Any | None = None
    health_insurance: Any | None = None
    vaccination_card: Any | None = None
    id_card: Any | None = None
    passport: Any | None = None
