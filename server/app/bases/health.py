import re
from pydantic import BaseModel
from datetime import datetime

class Rotavirus(BaseModel):
    first: datetime | None = None
    second: datetime | None = None
    third: datetime | None = None

class Influenza(BaseModel):
    first: datetime | None = None
    second: datetime | None = None
    boost: datetime | None = None

class BOPV_DPT_TDAN(BaseModel):
    first: datetime | None = None
    boost: datetime | None = None

class BOPV_DPT_DT(BaseModel):
    second: datetime | None = None
    boost: datetime | None = None

class COVID_19(BaseModel):
    first: datetime | None = None
    second: datetime | None = None

class VPH(BaseModel):
    first: datetime | None = None
    second: datetime | None = None


class DT(BaseModel):
    third: datetime | None = None
    boost: datetime | None = None

class Health(BaseModel):
    emergency_name: str | None = None
    emergency_phone: str | None = None
    emergency_identification: str | None = None
    alergies: str | None = None
    medicines: str | None = None
    disabilities: str | None = None
    doctor_name: str | None = None
    doctor_phone: str | None = None
    doctor_exequatur: str | None = None
    tuberculosis: datetime | None = None
    hepatitis: datetime | None = None
    rotavirus: Rotavirus | None = None
    influenza: Influenza | None = None
    spr_12: datetime | None = None
    neumoco: datetime | None = None
    spr_18: datetime | None = None
    bopv_dpt_tdan: BOPV_DPT_TDAN | None = None
    bopv_dpt_dt: BOPV_DPT_DT | None = None
    covid: COVID_19 | None = None 
    vph: VPH | None = None
    dt: DT | None = None
    pregnant_tdan: datetime | None = None
    pregnant_dt: datetime | None = None
    pregnant_influenza: datetime | None = None
