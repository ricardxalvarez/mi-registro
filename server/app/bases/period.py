from pydantic import BaseModel, validator, EmailStr, Field, constr

class getPeriods(BaseModel):
    section_id: str