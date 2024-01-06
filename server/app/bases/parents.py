import re
from pydantic import BaseModel, validator, EmailStr, Field, constr
class Parents(BaseModel):
    name: str
    lastName: str
    password: str
    username: str
    id_card: str
    passport: str
    gender: str
    relationship: str
    email: str
    nationality: str
    age: float
    address: str
    phone: str
    # telefono fijo
    landline: str
    scholarship: str
    # job
    job: str
    job_address: str
    job_phone: str

class Register(BaseModel):
    name: str
    lastName: str
    password: constr(min_length=8, max_length=255) = Field(
        ...,
        description="Password must be 8-255 characters long, include upper and lower case letters, numbers, and certain special characters."
    )
    username: str = Field(min_length=4, pattern=r"^[a-zA-Z0-9_.-]+$")
    id_card: str = None
    passport: str = None
    gender: str
    relationship: str
    email: str
    nationality: str
    age: float
    address: str
    phone: str
    children: list[str]
    # telefono fijo
    landline: str
    scholarship: str
    # job
    job: str
    job_address: str
    job_phone: str
    @validator('password')
    def password_complexity(cls, value: str):
        if not re.match(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d`~!@#$%^&*()-_=+\[\]{}|;:'\",.<>/?]+$", value):
            raise ValueError("Password must include upper and lower case letters, numbers, and certain special characters.")
        return value
    
    @classmethod
    @validator('id_card', 'passport', pre=True, always=True)
    def check_id_card_or_passport(cls, value, values):
        if not any((values.get('id_card'), values.get('passport'))):
            raise ValueError("Either 'id_card' or 'passport' must be defined.")
        return value