# backend/app/main.py

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict # Added Dict for fake_tasks_db
import os
from dotenv import load_dotenv
from uuid import uuid4
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import ValidationError, BaseModel, EmailStr

# Password hashing
from passlib.context import CryptContext

# SQLModel imports
from sqlmodel import Field, Session, SQLModel, create_engine, select

# --- IMPORTANT: Ensure you have a 'schemas.py' file in the same directory (app/)
# --- that defines your User, UserCreate, UserLogin, UserResponse, Token, and Message models.
# --- For example, your User model might look like this in schemas.py:
# from sqlmodel import Field, SQLModel
# from typing import Optional
# from pydantic import EmailStr
# class User(SQLModel, table=True):
#     id: Optional[str] = Field(default_factory=lambda: str(uuid4()), primary_key=True)
#     email: EmailStr = Field(unique=True, index=True)
#     hashed_password: str
#     is_active: bool = True
# class UserCreate(BaseModel): ... etc.
from .schemas import UserCreate, UserLogin, UserResponse, Token, Message, User


# Load environment variables from .env file
load_dotenv()

# --- Configuration Settings ---
class Settings(BaseModel):
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-key-change-this-for-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./database.db") # SQLite database file
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173") # Frontend URL for CORS

settings = Settings()

# --- Password Hashing Context ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- OAuth2PasswordBearer for token extraction ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

# --- Password Utility Functions ---
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# --- JWT Utility Functions ---
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

# --- Database Engine and Session Setup (for Users) ---
engine = create_engine(settings.DATABASE_URL, echo=True) # echo=True for logging SQL queries (good for debugging)

def create_db_and_tables():
    # This function creates all tables defined as SQLModel(table=True)
    SQLModel.metadata.create_all(engine)

# Dependency to get a database session
def get_session():
    with Session(engine) as session:
        yield session

# --- Dependency to get the current user from the token ---
async def get_current_user(
    session: Session = Depends(get_session),
    token: str = Depends(oauth2_scheme)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except (JWTError, ValidationError): # ValidationError if token structure is wrong
        raise credentials_exception

    user = session.exec(select(User).where(User.email == email)).first()
    if user is None:
        raise credentials_exception
    return user


# --- FastAPI App Initialization ---
app = FastAPI(
    title="WorkShop Backend API",
    description="API for WorkShop SaaS application",
    version="0.1.0",
)

# --- CORS Configuration ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL], # Allow your frontend origin from settings
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- FastAPI Lifespan Events ---
@app.on_event("startup")
def on_startup():
    print("Application startup - Creating database tables...")
    create_db_and_tables()
    print("Database tables created/checked.")

# --- API Endpoints (Routes) ---

@app.get("/", summary="Root endpoint")
async def read_root():
    return {"message": "Welcome to the WorkShop Backend API!"}

@app.get("/api/message", response_model=Message, summary="Get a simple message")
async def get_simple_message():
    return {"content": "Hello from the FastAPI Python backend!"}

# --- User Authentication Endpoints (Using Database) ---

@app.post("/api/v1/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED, summary="Register a new user")
async def register_user(user_data: UserCreate, session: Session = Depends(get_session)):
    """
    Registers a new user with the provided email and password, storing in the database.
    """
    existing_user = session.exec(select(User).where(User.email == user_data.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    hashed_password = get_password_hash(user_data.password)
    
    db_user = User(
        id=str(uuid4()), # Generate a unique ID for the user
        email=user_data.email,
        hashed_password=hashed_password,
        is_active=True # Default is_active to True
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    
    return UserResponse(id=db_user.id, email=db_user.email, is_active=db_user.is_active)

@app.post("/api/v1/auth/login", response_model=Token, summary="Login user and get access token")
async def login_for_access_token(user_data: UserLogin, session: Session = Depends(get_session)):
    """
    Authenticates a user with email and password from the database, returning an access token upon success.
    """
    user = session.exec(select(User).where(User.email == user_data.email)).first()
            
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/v1/users/me", response_model=UserResponse, summary="Get current authenticated user")
async def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Retrieves the details of the currently authenticated user. Requires a valid JWT token.
    """
    return current_user # current_user is already a User model instance from the database

# --- Task Management Endpoints (In-memory storage for now) ---
# NOTE: This task storage is temporary and will reset when the server restarts.
# For persistent tasks, you would define Task as a SQLModel in schemas.py
# and modify these endpoints to use a database session (similar to User endpoints).

# In-memory storage for tasks
# Key: user_email, Value: List of tasks for that user
fake_tasks_db: Dict[str, List[Dict]] = {}
next_task_id: int = 1 # Simple ID counter

# Pydantic Models for Tasks
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False
    priority: str = "medium" # Added priority field
    due_date: Optional[datetime] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[str] = None # Added priority to update model
    due_date: Optional[datetime] = None

class TaskInDB(TaskBase):
    id: int
    owner_email: EmailStr
    created_at: datetime # Auto-generated timestamp

    class Config:
        from_attributes = True # For Pydantic v2: allows creation from ORM objects

# Task CRUD Endpoints
@app.post("/api/v1/tasks/", response_model=TaskInDB, status_code=status.HTTP_201_CREATED, summary="Create a new task")
async def create_task(task: TaskCreate, current_user: User = Depends(get_current_user)):
    global next_task_id
    
    if current_user.email not in fake_tasks_db:
        fake_tasks_db[current_user.email] = []

    db_task = TaskInDB(
        id=next_task_id,
        owner_email=current_user.email,
        title=task.title,
        description=task.description,
        completed=task.completed,
        priority=task.priority, # Save priority
        due_date=task.due_date,
        created_at=datetime.now()
    )
    fake_tasks_db[current_user.email].append(db_task.model_dump(mode='json')) # Use model_dump(mode='json') for better datetime serialization
    next_task_id += 1
    return db_task

@app.get("/api/v1/tasks/", response_model=List[TaskInDB], summary="Get all tasks for the current user")
async def get_user_tasks(current_user: User = Depends(get_current_user)):
    tasks = fake_tasks_db.get(current_user.email, [])
    # Convert string datetimes back to datetime objects for Pydantic validation
    return [
        TaskInDB(**{
            **task_data,
            'created_at': datetime.fromisoformat(task_data['created_at']) if isinstance(task_data.get('created_at'), str) else task_data.get('created_at'),
            'due_date': datetime.fromisoformat(task_data['due_date']) if isinstance(task_data.get('due_date'), str) else task_data.get('due_date')
        })
        for task_data in tasks
    ]

@app.get("/api/v1/tasks/{task_id}", response_model=TaskInDB, summary="Get a single task by ID")
async def get_task(task_id: int, current_user: User = Depends(get_current_user)):
    tasks = fake_tasks_db.get(current_user.email, [])
    for task_data in tasks:
        if task_data["id"] == task_id:
            return TaskInDB(**{
                **task_data,
                'created_at': datetime.fromisoformat(task_data['created_at']) if isinstance(task_data.get('created_at'), str) else task_data.get('created_at'),
                'due_date': datetime.fromisoformat(task_data['due_date']) if isinstance(task_data.get('due_date'), str) else task_data.get('due_date')
            })
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Task not found or you don't have access to it"
    )

@app.put("/api/v1/tasks/{task_id}", response_model=TaskInDB, summary="Update an existing task")
async def update_task(
    task_id: int, 
    task_update: TaskUpdate, 
    current_user: User = Depends(get_current_user)
):
    tasks = fake_tasks_db.get(current_user.email, [])
    for idx, task_data in enumerate(tasks):
        if task_data["id"] == task_id:
            update_data = task_update.model_dump(exclude_unset=True, mode='json') # Use mode='json' here too
            updated_task_data = {**task_data, **update_data}
            
            # Ensure datetime fields are handled correctly upon retrieval
            if isinstance(updated_task_data.get('created_at'), str):
                updated_task_data['created_at'] = datetime.fromisoformat(updated_task_data['created_at'])
            if isinstance(updated_task_data.get('due_date'), str):
                updated_task_data['due_date'] = datetime.fromisoformat(updated_task_data['due_date'])

            fake_tasks_db[current_user.email][idx] = updated_task_data
            return TaskInDB(**updated_task_data)
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Task not found or you don't have access to it"
    )

@app.delete("/api/v1/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a task")
async def delete_task(task_id: int, current_user: User = Depends(get_current_user)):
    tasks = fake_tasks_db.get(current_user.email, [])
    initial_len = len(tasks)
    fake_tasks_db[current_user.email] = [
        task for task in tasks if task["id"] != task_id
    ]
    if len(fake_tasks_db[current_user.email]) == initial_len:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or you don't have access to it"
        )
    return {"message": "Task deleted successfully"}