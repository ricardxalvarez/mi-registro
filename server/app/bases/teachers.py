import re
from pydantic import BaseModel, EmailStr, Field, constr, validator

class Teachers(BaseModel):
    id: str
    name: str
    lastName: str
    password: str
    username: str
    identification: str
    pic: str
    gender: str
    email: EmailStr
    age: float
    nationality: str
    civil_status: str
    address: str
    # academic
    years_of_service: float
    expertise: str
    degree: str
    current_studies: str
    # labor
    rank: str

class Register(BaseModel):
    name: str
    username: str = Field(min_length=4, pattern=r"^[a-zA-Z0-9_.-]+$")
    lastName: str
    password: constr(min_length=8, max_length=255) = Field(
        ...,
        description="Password must be 8-255 characters long, include upper and lower case letters, numbers, and certain special characters."
    )
    identification: str
    pic: str = None
    gender: str
    email: EmailStr
    age: float
    nationality: str
    civil_status: str
    address: str
    # academic
    years_of_service: float = None
    expertise: str = None
    degree: str = None
    current_studies: str = None
    # labor
    rank: str = None
    @validator('password')
    def password_complexity(cls, value: str):
        if not re.match(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d`~!@#$%^&*()-_=+\[\]{}|;:'\",.<>/?]+$", value):
            raise ValueError("Password must include upper and lower case letters, numbers, and certain special characters.")
        return value