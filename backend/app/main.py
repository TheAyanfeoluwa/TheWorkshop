# backend/app/main.py
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI app
app = FastAPI(  # <--- THIS IS THE CRUCIAL LINE Uvicorn is looking for!
    title="WorkShop Backend API",
    description="API for WorkShop SaaS application",
    version="0.1.0",
)

# --- CORS Configuration ---
# IMPORTANT: Adjust 'origins' for your production deployment!
# For development, you can use your React development server URL.
# For production, list your deployed frontend domain(s).
origins = [
    os.getenv("FRONTEND_URL", "http://localhost:5173"), # Default to Vite dev server
    # Add other origins if needed, e.g., your production frontend domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # List of allowed origins
    allow_credentials=True,      # Allow cookies to be sent
    allow_methods=["*"],         # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],         # Allow all headers
)

# --- Pydantic Models (Data Schemas) ---
# Define how data for your API requests/responses should look
class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None

class Message(BaseModel):
    content: str

# --- Dummy Data (Replace with Database in a real app) ---
# In a real application, you'd use a database (e.g., PostgreSQL with SQLModel/SQLAlchemy)
fake_items_db = [] # This will be reset every time the server restarts

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

# --- Database Setup (Placeholder for real integration) ---
# You'll define your database models and connection here using SQLModel or SQLAlchemy.
# For example:
# from sqlmodel import Field, Session, SQLModel, create_engine
#
# sqlite_file_name = "database.db"
# sqlite_url = f"sqlite:///{sqlite_file_name}"
# engine = create_engine(sqlite_url, echo=True)
#
# def create_db_and_tables():
#     SQLModel.metadata.create_all(engine)
#
# @app.on_event("startup")
# def on_startup():
#     create_db_and_tables()
#
# def get_session():
#     with Session(engine) as session:
#         yield session
#
# # Then you can use 'session: Session = Depends(get_session)' in your routes
# # and interact with your database.