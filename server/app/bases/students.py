import re
from pydantic import BaseModel, validator, EmailStr, Field, constr
from datetime import datetime
from .health import Health
from .documents import Document

class Students(BaseModel):
    id: str
    name: str
    section_id: str
    lastName: str
    password: str
    username: str
    identification: str
    gender: str
    RNE: str
    pic: str
    address: str
    nationality: str
    civil_status: str
    birth: datetime
    email: EmailStr
    documents: Document
    birth_place: str
    lives_with: str 
        # lives_with is "otro"
    lives_with_name: str = None
    lives_with_lastName: str = None
    lives_with_relationship: str = None
    lives_with_address: str = None
    lives_with_phone: str = None
    lives_with_email: str = None
    lives_with_job: str = None
    lives_with_job_address: str = None
    health: Health
    # if level is "inicial"
    siblings_quantity: int = None
        # array of numbers, length must be equal to brothers_quantity
    siblings_ages: list[int] = None
    sibling_place: int = None
    
    # if level is 'primario' or 'secundario'
    student_status: str = None
    enrolled_at: datetime = None
    removed_at: datetime = None
    promoted: bool = None
    created_at: datetime
    @validator("lives_with", pre=True, always=True)
    def check_lives_with(cls, lives_with, values):
        if lives_with == 'otro':
            # Check other keys starting with 'lives'
            for key in values:
                if key.startswith('lives') and key != 'lives_with':
                    if not values[key]:
                        raise ValueError(f"{key} is required when lives_with is 'otro'")
        return lives_with
    

class Register(BaseModel):
    name: str
    lastName: str
    password: str
    section_id: str
    # password: constr(min_length=8, max_length=255) = Field(
    #     ...,
    #     description="Password must be 8-255 characters long, include upper and lower case letters, numbers, and certain special characters."
    # )
    username: str = Field(min_length=4, pattern=r"^[a-zA-Z0-9_.-]+$")
    identification: str
    RNE: str
    pic: str | None = None
    address: str
    nationality: str
    civil_status: str
    birth: str
    gender: str
    email: EmailStr
    documents: Document
    birth_place: str
        # lives_with is "otro"
    lives_with_name: str | None = None
    lives_with_lastName: str | None = None
    lives_with_relationship: str | None = None
    lives_with_address: str | None = None
    lives_with_phone: str | None = None
    lives_with_email: str | None = None
    lives_with_job: str | None = None
    lives_with_job_address: str | None = None
    lives_with: str | None
    health: Health 
    # if level is "inicial"
    siblings_quantity: int | None = None 
        # array of numbers, length must be equal to brothers_quantity
    siblings_ages: list[int] | None = None
    sibling_place: int | None = None
    # if student level is 'primario' or 'secundario'
    student_status: str | None = None
    enrolled_at: str | None = None
    removed_at: str | None = None
    promoted: bool | None = False

    # @validator('password')
    # def password_complexity(cls, value: str):
    #     if not re.match(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d`~!@#$%^&*()-_=+\[\]{}|;:'\",.<>/?]+$", value):
    #         raise ValueError("Password must include upper and lower case letters, numbers, and certain special characters.")
    #     return value
    @validator("lives_with", pre=True, always=True)
    def check_lives_with(cls, lives_with, values):
        if lives_with == 'otro':
            # Check other keys starting with 'lives'
            for key in values:
                if key.startswith('lives') and key != 'lives_with':
                    if not values[key]:
                        raise ValueError(f"{key} is required when lives_with is 'otro'")
        return lives_with