# backend/app/main.py
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import os
from dotenv import load_dotenv
from uuid import uuid4
from datetime import datetime, timedelta

# SQLModel imports
from sqlmodel import Session, create_engine, select # New imports for database ops

# Password hashing
from passlib.context import CryptContext

# JWT
from jose import JWTError, jwt

# Import all models from our schemas file
from .schemas import UserCreate, UserLogin, UserResponse, Token, Message, User # Import User model

# Load environment variables from .env file
load_dotenv()

# --- Configuration Settings ---
class Settings(BaseModel): # Keeping BaseModel for Settings, as it's not a database model
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-key-change-this-for-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./database.db") # SQLite database file

settings = Settings()

# --- Password Hashing Context ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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

# --- Database Engine and Session Setup ---
# The engine is the central connection point to the database
engine = create_engine(settings.DATABASE_URL, echo=True) # echo=True for logging SQL queries (good for debugging)

def create_db_and_tables():
    # This function creates all tables defined as SQLModel(table=True)
    SQLModel.metadata.create_all(engine)

# Dependency to get a database session
def get_session():
    with Session(engine) as session:
        yield session

# Initialize FastAPI app
app = FastAPI(
    title="WorkShop Backend API",
    description="API for WorkShop SaaS application",
    version="0.1.0",
)

# --- CORS Configuration ---
origins = [
    os.getenv("FRONTEND_URL", "http://localhost:5173"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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

# --- User Authentication Endpoints (Now using Database) ---

@app.post("/api/v1/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED, summary="Register a new user")
async def register_user(user_data: UserCreate, session: Session = Depends(get_session)):
    """
    Registers a new user with the provided email and password, storing in the database.
    """
    # Check if user with this email already exists
    existing_user = session.exec(select(User).where(User.email == user_data.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    hashed_password = get_password_hash(user_data.password)
    
    # Create a new User instance (SQLModel object)
    db_user = User(
        id=str(uuid4()), # Generate a unique ID for the user
        email=user_data.email,
        hashed_password=hashed_password,
        is_active=True # Default is_active to True
    )

    session.add(db_user) # Add the new user to the session
    session.commit()     # Commit the transaction to save to the database
    session.refresh(db_user) # Refresh the instance to get any database-generated values (like default id, though we generate it here)
    
    # Return a UserResponse model (without the hashed password)
    return UserResponse(id=db_user.id, email=db_user.email, is_active=db_user.is_active)

@app.post("/api/v1/auth/login", response_model=Token, summary="Login user and get access token")
async def login_for_access_token(user_data: UserLogin, session: Session = Depends(get_session)):
    """
    Authenticates a user with email and password from the database, returning an access token upon success.
    """
    # Query the database for the user by email
    user = session.exec(select(User).where(User.email == user_data.email)).first()
            
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Ensure the user is active if you have that requirement
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

# --- Dummy Item Endpoints (Removed from here, move to a separate module or proper DB) ---
# Removed Item class and fake_items_db to streamline.
# You would define Item as a SQLModel in schemas.py and create dedicated CRUD endpoints for it.
# For now, keeping only the root and message endpoints along with auth.