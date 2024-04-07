from pydantic import BaseModel
from datetime import datetime

class newAttendance(BaseModel):
    section_id: str
    day: datetime
    student_id: str
    attendant: bool
    subject_id: str = None

class getAttendance(BaseModel):
    section_id: str
    day: datetime
    subject_id: str = None