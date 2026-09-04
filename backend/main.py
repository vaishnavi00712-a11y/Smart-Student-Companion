"""
Smart Student Companion - Academic Management Backend
FastAPI Main Application Entry Point.

This backend powers the 3 core academic modules:
1. Assignment Management (CRUD, Filtering, Deadlines)
2. Attendance Management (Calculation, Shortage Warning at 75%, Prediction)
3. Marks & Academic Analytics (Calculations, Letter Grades, Analytics, Unified Dashboard)
"""

import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Load environment variables
load_dotenv()

# Import database connection checker
from backend.config.database import check_db_connection

# Import modular API routers
from backend.routes.assignment_routes import router as assignment_router
from backend.routes.attendance_routes import router as attendance_router
from backend.routes.marks_routes import router as marks_router
from backend.routes.dashboard_routes import router as dashboard_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager that runs on application startup and shutdown.
    Verifies database connectivity on boot.
    """
    print("\nðŸš€ Starting Smart Student Companion Academic Backend...")
    # Attempt to ping MongoDB
    is_connected = await check_db_connection()
    if is_connected:
        print("ðŸ’¾ MongoDB connection established successfully.")
    else:
        print("âš ï¸   Notice: MongoDB server is not currently reachable.")
        print("   If you are testing locally, make sure MongoDB is running or check your MONGODB_URL in .env.")
    
    yield
    print("ðŸ›‘ Shutting down Smart Student Companion Backend...\n")


# Initialize the FastAPI App with metadata for Swagger UI
app = FastAPI(
    title="Smart Student Companion - Academic Backend API",
    description="""
    ## Academic Management Module Backend
    College project backend built with **FastAPI** and **MongoDB**.
    
    ### 3 Core Responsibilities:
    1. **Assignment Management**: Complete CRUD operations, filtering by status, priority, subject, and upcoming deadlines.
    2. **Attendance Management**: Auto-calculates attendance percentage, 75% shortage warnings, and attendance prediction formulas.
    3. **Marks & Academic Analytics**: Auto-computes total marks, percentage, letter grades, class analytics, and unified dashboard data.
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# -------------------------------------------------------------
# CORS Configuration (Cross-Origin Resource Sharing)
# -------------------------------------------------------------
# Why CORS is needed:
# Web browsers enforce the Same-Origin Policy. When your React frontend
# (running on http://localhost:3000) requests data from your FastAPI backend
# (running on http://localhost:8000), the browser blocks the request unless
# the backend explicitly allows that origin in its headers.
# -------------------------------------------------------------

raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
allowed_origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

# In development, also include localhost variants
development_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

all_allowed_origins = list(set(allowed_origins + development_origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=all_allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


# -------------------------------------------------------------
# Include Modular Routers
# -------------------------------------------------------------
app.include_router(assignment_router)
app.include_router(attendance_router)
app.include_router(marks_router)
app.include_router(dashboard_router)


# -------------------------------------------------------------
# Root & Health Check Endpoints
# -------------------------------------------------------------
@app.get("/", tags=["System"])
async def root():
    """
    Root endpoint providing welcome message and direct link to interactive Swagger docs.
    """
    return {
        "project": "Smart Student Companion - Academic Management Backend",
        "author": "vaishnavi00712",
        "status": "Online & Running",
        "documentation": "/docs",
        "modules": [
            "/api/assignments",
            "/api/attendance",
            "/api/marks",
            "/api/academic-dashboard"
        ]
    }


@app.get("/api/health", tags=["System"])
async def health_check():
    """
    Health check endpoint for Render, monitoring tools, or frontend status indicators.
    """
    return {
        "status": "healthy",
        "service": "academic-management-backend",
        "framework": "FastAPI",
        "database": "MongoDB"
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("backend.main:app", host=host, port=port, reload=True)
