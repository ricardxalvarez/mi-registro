from pydantic import BaseModel, validator, EmailStr, Field, constr

class onChange(BaseModel):
    especific_competency_id: str = None
    indicator_id: str = None
    period_id: str 
    subject_id: str
    section_id: str

    key_content: str = None

    content_id: str = None
    fundamental_competency_id: str = None