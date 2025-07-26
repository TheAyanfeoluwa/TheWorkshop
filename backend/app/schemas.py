# backend/app/schemas.py
from typing import Optional, List
from sqlmodel import Field, SQLModel # Import SQLModel and Field
from pydantic import EmailStr, BaseModel
from datetime import datetime, date # Import date for due_date if you want just date

# --- User Models ---

# This is our database model for users
class User(SQLModel, table=True):
    id: Optional[str] = Field(default=None, primary_key=True, nullable=False) # Use str for UUIDs
    email: EmailStr = Field(unique=True, index=True) # Email must be unique and indexed for fast lookup
    hashed_password: str # Store the hashed password
    is_active: bool = Field(default=True) # Field is for SQLModel specific column options

# Schema for user creation (what the frontend sends for registration)
class UserCreate(BaseModel): # Inherit from BaseModel for input validation
    email: EmailStr
    password: str

# Schema for user login (what the frontend sends for login)
class UserLogin(BaseModel): # Inherit from BaseModel
    email: EmailStr
    password: str

# Schema for user response (what the backend sends back after creation/retrieval)
class UserResponse(BaseModel): # Inherit from BaseModel for API response
    id: str
    email: EmailStr
    is_active: bool

    # Pydantic v2 automatically handles creation from ORM objects with `from_attributes = True`
    # when used with response_model in FastAPI, but explicitly setting it is clearer.
    model_config = {"from_attributes": True}


# Schema for JWT token response
class Token(BaseModel): # Inherit from BaseModel
    access_token: str
    token_type: str = "bearer"

# Schema for generic messages (e.g., error messages)
class Message(BaseModel): # Inherit from BaseModel
    content: str


# --- Task Models ---

# This is our database model for tasks
class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True) # Auto-incrementing integer ID
    title: str = Field(index=True) # Index for faster lookup
    description: Optional[str] = None
    completed: bool = Field(default=False)
    priority: str = Field(default="medium", max_length=50) # Added max_length
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False) # Store creation time
    due_date: Optional[datetime] = None # Can be null

    # Foreign key relationship to User
    owner_id: str = Field(foreign_key="user.id", index=True, nullable=False) # Link to User.id

    # Optional: If you want to load the owner object directly
    # owner: Optional[User] = Relationship(back_populates="tasks")


# Schema for creating a task (what the frontend sends for creating a task)
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    completed: Optional[bool] = False
    priority: Optional[str] = "medium"
    due_date: Optional[datetime] = None # Use datetime for consistency

# Schema for updating a task (what the frontend sends for updating a task)
class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None

# Schema for responding with a task (what the backend sends back)
class TaskResponse(BaseModel): # Use TaskResponse for clarity instead of TaskInDB
    id: int
    title: str
    description: Optional[str] = None
    completed: bool
    priority: str
    created_at: datetime
    due_date: Optional[datetime] = None
    owner_id: str # Include owner_id in the response

    model_config = {"from_attributes": True} # Enable Pydantic to read from ORM models