import re
from pydantic import BaseModel, validator, EmailStr, Field, constr
from datetime import datetime

class Students(BaseModel):
    id: str
    name: str
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
    # folio
    # libro
    # acta
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
    # health
    emergency_name: str
    emergency_phone: str
    emergency_identification: str
    alergies: str
    medicines: str
    disabilities: str
    level: str
    # if level is "inicial"
    siblings_quantity: int = None
        # array of numbers, length must be equal to brothers_quantity
    siblings_ages: list[int] = None
    sibling_place: int = None
    doctor_name: str = None
    doctor_phone: str = None
    doctor_exequatur: str = None
        # vaccines
    tuberculosis: bool = None
    influenza: str = None
    spr: str = None
    neumoco: str = None
    bopv: str = None
    covid: str = None
    vph: str = None
    dt: str = None
    pregnant_tdan: str = None
    pregnant_dt: str = None
    pregnant_influenza: str = None
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
    
    @validator("level", pre=True, always=True)
    def check_level(cls, level, values):
        if level == 'inicial':
            required_keys = (
                'siblings_quantity'
                'siblings_ages', 
                'sibling_place', 
                'doctor_name', 
                'doctor_phone', 
                'doctor_exequatur',
                'tuberculosis',
                'influenza',
                'spr',
                'neumoco',
                'bopv',
                'covid',
                'dt',
                'pregnant_tdan',
                'pregnant_influenza',
                'pregnant_dt'
                )
            for key in required_keys:
                if not values[key]:
                    raise ValueError(f"{key} is required when level is 'inicial'")
        if level == 'primario' or level == 'secundario':
            required_keys = (
                'stundent_status',
                'enrolled_at',
                'removed_at',
                'promoted'
                )
            for key in required_keys:
                if not values[key]:
                    raise ValueError(f"{key} is required when level is '{level}'")

class Register(BaseModel):
    name: str
    lastName: str
    password: constr(min_length=8, max_length=255) = Field(
        ...,
        description="Password must be 8-255 characters long, include upper and lower case letters, numbers, and certain special characters."
    )
    username: str = Field(min_length=4, pattern=r"^[a-zA-Z0-9_.-]+$")
    identification: str
    RNE: str
    pic: str = None
    address: str
    nationality: str
    civil_status: str
    birth: str
    gender: str
    email: EmailStr
    # folio
    # libro
    # acta
    birth_place: str
        # lives_with is "otro"
    lives_with_name: str = None
    lives_with_lastName: str = None
    lives_with_relationship: str = None
    lives_with_address: str = None
    lives_with_phone: str = None
    lives_with_email: str = None
    lives_with_job: str = None
    lives_with_job_address: str = None
    lives_with: str 
    # health
    emergency_name: str 
    emergency_phone: str
    emergency_identification: str
    alergies: str
    medicines: str
    disabilities: str
    # if level is "inicial"
    siblings_quantity: int = None
        # array of numbers, length must be equal to brothers_quantity
    siblings_ages: list[int] = None
    sibling_place: int = None
    doctor_name: str = None
    doctor_phone: str = None
    doctor_exequatur: str = None
        # vaccines
    tuberculosis: bool = False
    influenza: str = None
    spr: str = None
    neumoco: str = None
    bopv: str = None
    hepatitis: str = None
    covid: str = None
    vph: str = None
    dpt: str = None
    dt: str = None
    pregnant_tdan: str = None
    pregnant_dt: bool = None
    pregnant_influenza: str = None
    # if level is 'primario' or 'secundario'
    student_status: str = None
    enrolled_at: str = None
    removed_at: str = None
    promoted: bool = False
    level: str
    @validator('password')
    def password_complexity(cls, value: str):
        if not re.match(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d`~!@#$%^&*()-_=+\[\]{}|;:'\",.<>/?]+$", value):
            raise ValueError("Password must include upper and lower case letters, numbers, and certain special characters.")
        return value
    @validator("lives_with", pre=True, always=True)
    def check_lives_with(cls, lives_with, values):
        if lives_with == 'otro':
            # Check other keys starting with 'lives'
            for key in values:
                if key.startswith('lives') and key != 'lives_with':
                    if not values[key]:
                        raise ValueError(f"{key} is required when lives_with is 'otro'")
        return lives_with
    
    @validator("level", pre=True, always=True)
    def check_level(cls, level, values):
        if values.get('level') == 'inicial':
            required_keys = (
                'siblings_quantity',
                'siblings_ages', 
                'sibling_place', 
                'doctor_name', 
                'doctor_phone', 
                'doctor_exequatur',
                'hepatitis',
                'influenza',
                'spr',
                'dpt',
                'neumoco',
                'bopv',
                'covid',
                'dt',
                'pregnant_tdan',
                'pregnant_influenza',
            )
            for key in required_keys:
                if values.get(key) is None:
                    raise ValueError(f"{key} is required when level is 'inicial'")
        if values.get('level') in ('primario', 'secundario'):
            required_keys = (
                'student_status',
                'enrolled_at',
                'promoted'
            )
            
            for key in required_keys:
                if values.get(key) is None:
                    raise ValueError(f"{key} is required when level is '{level}'")
        return level