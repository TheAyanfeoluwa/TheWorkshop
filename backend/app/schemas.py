# backend/app/schemas.py
from typing import Optional
from sqlmodel import Field, SQLModel # Import SQLModel and Field
from pydantic import EmailStr

# This is our database model
# It inherits from SQLModel (for ORM mapping) and defines table properties
class User(SQLModel, table=True): # table=True makes it a SQLAlchemy table
    id: Optional[str] = Field(default=None, primary_key=True, nullable=False) # Use str for UUIDs
    email: EmailStr = Field(unique=True, index=True) # Email must be unique and indexed for fast lookup
    hashed_password: str # Store the hashed password
    is_active: bool = Field(default=True) # Field is for SQLModel specific column options

# Schema for user creation (what the frontend sends for registration)
# It inherits from User, but excludes id, hashed_password, is_active for input
class UserCreate(SQLModel): # Also inherit from SQLModel for consistency, but not table=True
    email: EmailStr
    password: str

# Schema for user login (what the frontend sends for login)
class UserLogin(SQLModel): # Also inherit from SQLModel
    email: EmailStr
    password: str

# Schema for user response (what the backend sends back after creation/retrieval)
# This inherits directly from User to get the fields, but excludes hashed_password
class UserResponse(SQLModel): # No table=True, as this is just for API response
    id: str
    email: EmailStr
    is_active: bool

    # We don't need Config.from_attributes = True anymore as SQLModel handles this
    # through its base SQLModel class directly when used in response_model.

# Schema for JWT token response
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"

# Schema for generic messages (e.g., error messages)
class Message(SQLModel):
    content: str