# backend/app/schemas.py
from typing import Optional
from pydantic import BaseModel

# Example of a Pydantic model for data validation/serialization
class UserCreate(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    is_active: bool = True

    class Config:
        from_attributes = True # for SQLAlchemy/SQLModel integration