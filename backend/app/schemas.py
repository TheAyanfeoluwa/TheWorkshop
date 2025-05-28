# backend/app/schemas.py
from typing import Optional
from pydantic import BaseModel, EmailStr

# Schema for user creation (what the frontend sends for registration)
class UserCreate(BaseModel):
    email: EmailStr # Use EmailStr for email format validation
    password: str

# Schema for user login (what the frontend sends for login)
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Schema for user response (what the backend sends back after creation/retrieval)
class UserResponse(BaseModel):
    id: str # We'll use UUIDs for IDs later, for now just a string
    email: EmailStr
    is_active: bool = True # Default to True for new users

    class Config:
        from_attributes = True # Important for ORM mode if you integrate with SQLAlchemy/SQLModel

# Schema for JWT token response
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Schema for generic messages (e.g., error messages)
class Message(BaseModel):
    content: str