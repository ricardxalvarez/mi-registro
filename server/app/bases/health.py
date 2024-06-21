import re
from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class Rotavirus(BaseModel):
    first: Optional[datetime] = None
    second: Optional[datetime] = None
    third: Optional[datetime] = None

class Influenza(BaseModel):
    first: Optional[datetime] = None
    second: Optional[datetime] = None
    boost: Optional[datetime] = None

class BOPV_DPT_TDAN(BaseModel):
    first: Optional[datetime] = None
    boost: Optional[datetime] = None

class BOPV_DPT_DT(BaseModel):
    second: Optional[datetime] = None
    boost: Optional[datetime] = None

class COVID_19(BaseModel):
    first: Optional[datetime] = None
    second: Optional[datetime] = None

class VPH(BaseModel):
    first: Optional[datetime] = None
    second: Optional[datetime] = None


class DT(BaseModel):
    third: Optional[datetime] = None
    boost: Optional[datetime] = None

class Health(BaseModel):
    emergency_name: Optional[str] = None
    emergency_phone: Optional[str] = None
    emergency_identification: Optional[str] = None
    alergies: Optional[str] = None
    medicines: Optional[str] = None
    disabilities: Optional[str] = None
    doctor_name: Optional[str] = None
    doctor_phone: Optional[str] = None
    doctor_exequatur: Optional[str] = None
    tuberculosis: Optional[datetime] = None
    hepatitis: Optional[datetime] = None
    rotavirus: Optional[Rotavirus] = None
    influenza: Optional[Influenza] = None
    spr_12: Optional[datetime] = None
    neumoco: Optional[datetime] = None
    spr_18: Optional[datetime] = None
    bopv_dpt_tdan: Optional[BOPV_DPT_TDAN] = None
    bopv_dpt_dt: Optional[BOPV_DPT_DT] = None
    covid: Optional[COVID_19] = None 
    vph: Optional[VPH] = None
    dt: Optional[DT] = None
    pregnant_tdan: Optional[datetime] = None
    pregnant_dt: Optional[datetime] = None
    pregnant_influenza: Optional[datetime] = None
