from pydantic import BaseModel, Field

class User(BaseModel):
    id: str
    name: str
    password: str

class Login(BaseModel):
    username: str = Field(min_length=4, pattern=r"^[a-zA-Z0-9_.-]+$")
    password: str = Field(min_length=8, pattern=r"^[^\s\p{L}]*$")