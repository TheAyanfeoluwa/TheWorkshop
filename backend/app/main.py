# backend/app/main.py
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel, EmailStr
import os
from dotenv import load_dotenv
from uuid import uuid4 # To generate unique IDs for users
from datetime import datetime, timedelta

# Import models from our schemas file
from .schemas import UserCreate, UserLogin, UserResponse, Token, Message

# Password hashing
from passlib.context import CryptContext

# JWT
from jose import JWTError, jwt

# Load environment variables from .env file
load_dotenv()

# --- Configuration Settings ---
class Settings(BaseModel):
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key") # Change this in production!
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30 # Token expiration time

settings = Settings()

# --- Password Hashing Context ---
# This is where we tell passlib what hashing algorithm to use
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

# Initialize FastAPI app
app = FastAPI(
    title="WorkShop Backend API",
    description="API for WorkShop SaaS application",
    version="0.1.0",
)

# --- CORS Configuration ---
origins = [
    os.getenv("FRONTEND_URL", "http://localhost:5173"), # Default to Vite dev server
    # Add other origins if needed, e.g., your production frontend domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Dummy Data (Replace with Database in a real app) ---
# For now, we'll store users in memory. Each user will be a dictionary.
fake_users_db = [] # Stores user dicts with 'id', 'email', 'hashed_password', 'is_active'

# --- API Endpoints (Routes) ---

@app.get("/", summary="Root endpoint")
async def read_root():
    return {"message": "Welcome to the WorkShop Backend API!"}

@app.get("/api/message", response_model=Message, summary="Get a simple message")
async def get_simple_message():
    """
    Returns a simple greeting message from the backend.
    """
    return {"content": "Hello from the FastAPI Python backend!"}

# --- User Authentication Endpoints ---

@app.post("/api/v1/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED, summary="Register a new user")
async def register_user(user_data: UserCreate):
    """
    Registers a new user with the provided email and password.
    Hashes the password before storing.
    """
    # Check if user with this email already exists
    for user_in_db in fake_users_db:
        if user_in_db["email"] == user_data.email:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered"
            )

    hashed_password = get_password_hash(user_data.password)
    
    new_user = {
        "id": str(uuid4()), # Generate a unique ID for the user
        "email": user_data.email,
        "hashed_password": hashed_password,
        "is_active": True
    }
    fake_users_db.append(new_user)
    
    # Return a UserResponse model (without the hashed password)
    return UserResponse(id=new_user["id"], email=new_user["email"], is_active=new_user["is_active"])

@app.post("/api/v1/auth/login", response_model=Token, summary="Login user and get access token")
async def login_for_access_token(user_data: UserLogin):
    """
    Authenticates a user with email and password, returning an access token upon success.
    """
    user = None
    for user_in_db in fake_users_db:
        if user_in_db["email"] == user_data.email:
            user = user_in_db
            break
            
    if not user or not verify_password(user_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# --- Basic Item Endpoints (Kept from your original main.py) ---
# Pydantic Model for Item (should probably be in schemas.py eventually)
class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None

fake_items_db = [] # This will be reset every time the server restarts

@app.post("/api/items/", response_model=Item, status_code=201, summary="Create a new item")
async def create_item(item: Item):
    """
    Creates a new item in the (dummy) database.
    """
    fake_items_db.append(item.dict()) # Store the item (in memory, not persistent)
    return item

@app.get("/api/items/", response_model=List[Item], summary="Get all items")
async def read_items():
    """
    Retrieves all items from the (dummy) database.
    """
    return fake_items_db

@app.get("/api/items/{item_name}", response_model=Item, summary="Get item by name")
async def read_item(item_name: str):
    """
    Retrieves a single item by its name.
    """
    for item_dict in fake_items_db:
        if item_dict["name"] == item_name:
            return item_dict
    raise HTTPException(status_code=404, detail="Item not found")