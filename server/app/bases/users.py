from pydantic import BaseModel, Field
from pydantic import BaseModel, EmailStr, Field, constr, validator

class User(BaseModel):
    id: str
    name: str
    password: str

class Login(BaseModel):
    username: str = Field(min_length=4, pattern=r"^[a-zA-Z0-9_.-]+$")
    password: constr(min_length=8, max_length=255) = Field(
        ...,
        description="Password must be 8-255 characters long, include upper and lower case letters, numbers, and certain special characters."
    )