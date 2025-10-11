from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship # Import Relationship
from pydantic import EmailStr, BaseModel
from datetime import datetime, date
from uuid import uuid4 # Import uuid4 for generating UUIDs

# --- User Models ---

# This is our database model for users
class User(SQLModel, table=True):
    id: Optional[str] = Field(default=None, primary_key=True, nullable=False) # Use str for UUIDs
    email: EmailStr = Field(unique=True, index=True) # Email must be unique and indexed for fast lookup
    hashed_password: str # Store the hashed password
    is_active: bool = Field(default=True) # Field is for SQLModel specific column options
    
    # NEW: Define relationship to SessionLog and Task
    sessions: List["SessionLog"] = Relationship(back_populates="user")
    tasks: List["Task"] = Relationship(back_populates="owner")


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

    model_config = {"from_attributes": True}


# Schema for JWT token response
class Token(BaseModel): # Inherit from BaseModel
    access_token: str
    token_type: str = "bearer"

# Schema for generic messages (e.g., error messages)
class Message(BaseModel): # Inherit from BaseModel
    content: str

# --- Pomodoro Session Log Models (NEW) ---

class SessionLog(SQLModel, table=True):
    """Database model to store completed Pomodoro sessions for progress tracking."""
    id: Optional[str] = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    
    # Time spent in minutes for this session (e.g., 25 for a focus session)
    minutes_spent: int = Field(default=0, nullable=False)
    
    # Type of session: 'focus', 'short_break', or 'long_break'
    session_type: str = Field(nullable=False, max_length=20)
    
    # Timestamp when the session was completed (for daily grouping)
    completion_time: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    
    # Foreign Key to link the session log back to the User
    user_id: str = Field(foreign_key="user.id", index=True, nullable=False) 

    # Define relationship back to the User
    user: Optional[User] = Relationship(back_populates="sessions")

# Pydantic model for receiving data to create a log
class SessionLogCreate(BaseModel):
    minutes_spent: int
    session_type: str

# Pydantic model for responding with the created log
class SessionLogResponse(BaseModel):
    id: str
    minutes_spent: int
    session_type: str
    completion_time: datetime
    user_id: str
    
    model_config = {"from_attributes": True}

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
    owner: Optional[User] = Relationship(back_populates="tasks") # Changed relationship name to 'owner' for clarity

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
