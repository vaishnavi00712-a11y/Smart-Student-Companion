export interface CodeFile {
  path: string;
  name: string;
  category: 'Entry & Config' | 'Schemas (Validation)' | 'Routes (APIs)' | 'Services (Business Logic)' | 'Models';
  description: string;
  code: string;
}

export const BACKEND_CODE_FILES: CodeFile[] = [
  {
    path: "backend/main.py",
    name: "main.py",
    category: "Entry & Config",
    description: "Application entry point, CORS configuration, route registration, and startup lifecycle handler.",
    code: `import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from backend.config.database import check_db_connection
from backend.routes.assignment_routes import router as assignment_router
from backend.routes.attendance_routes import router as attendance_router
from backend.routes.marks_routes import router as marks_router
from backend.routes.dashboard_routes import router as dashboard_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting Smart Student Companion Academic Backend...")
    await check_db_connection()
    yield
    print("🛑 Shutting down backend...")

app = FastAPI(
    title="Smart Student Companion - Academic Backend API",
    description="Backend for Assignment Management, Attendance Management, and Marks Analytics.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Setup for React/Next.js frontend
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(assignment_router)
app.include_router(attendance_router)
app.include_router(marks_router)
app.include_router(dashboard_router)

@app.get("/")
async def root():
    return {"status": "Online", "docs": "/docs"}

@app.get("/api/health")
async def health():
    return {"status": "healthy", "service": "academic-backend"}`
  },
  {
    path: "backend/config/database.py",
    name: "database.py",
    category: "Entry & Config",
    description: "Asynchronous Motor connection to MongoDB, collection references, and ObjectId string formatter.",
    code: `import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "smart_student_db")

client = AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=3000)
db = client[DATABASE_NAME]

assignments_collection = db["assignments"]
attendance_collection = db["attendance"]
marks_collection = db["marks"]

async def check_db_connection() -> bool:
    try:
        await client.admin.command("ping")
        print("✅ MongoDB connected successfully.")
        return True
    except Exception as e:
        print(f"⚠️ MongoDB Connection Notice: {e}")
        return False`
  },
  {
    path: "backend/schemas/assignment_schema.py",
    name: "assignment_schema.py",
    category: "Schemas (Validation)",
    description: "Pydantic models validating title, priority, status, and due_date for assignments.",
    code: `from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime
from enum import Enum

class PriorityEnum(str, Enum):
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

class StatusEnum(str, Enum):
    PENDING = "Pending"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"

class AssignmentCreate(BaseModel):
    student_id: str = Field(..., min_length=1)
    subject: str = Field(..., min_length=1)
    title: str = Field(..., min_length=2)
    description: Optional[str] = ""
    priority: PriorityEnum = PriorityEnum.MEDIUM
    due_date: str
    status: StatusEnum = StatusEnum.PENDING

    @field_validator("due_date")
    @classmethod
    def validate_date(cls, v):
        datetime.strptime(v, "%Y-%m-%d")
        return v`
  },
  {
    path: "backend/services/attendance_service.py",
    name: "attendance_service.py",
    category: "Services (Business Logic)",
    description: "Automated attendance percentage calculation, 75% shortage detector, and prediction formula.",
    code: `import math, os
from backend.config.database import attendance_collection

MIN_ATTENDANCE_PERCENTAGE = float(os.getenv("MIN_ATTENDANCE_PERCENTAGE", "75.0"))

class AttendanceService:
    @staticmethod
    def calculate_percentage(attended: int, total: int) -> float:
        if total <= 0:
            return 100.0
        return round((attended / total) * 100, 2)

    @staticmethod
    def get_status(percentage: float) -> str:
        return "Safe" if percentage >= MIN_ATTENDANCE_PERCENTAGE else "Shortage Warning"

    @staticmethod
    def calculate_classes_needed(attended: int, total: int, target: float = 75.0) -> int:
        """
        Formula: (A + x) / (T + x) >= P / 100
        x = ceil((P*T - 100*A) / (100 - P))
        For P = 75: x = ceil(3T - 4A)
        """
        current_pct = (attended / total) * 100.0 if total > 0 else 100.0
        if current_pct >= target:
            return 0
        num = (target * total) - (100.0 * attended)
        den = 100.0 - target
        return max(0, math.ceil(num / den))`
  },
  {
    path: "backend/services/marks_service.py",
    name: "marks_service.py",
    category: "Services (Business Logic)",
    description: "Calculates total marks, percentages, and modular letter grade mapping.",
    code: `GRADE_SCALE = [
    (90.0, 100.0, "A+"),
    (80.0, 89.99, "A"),
    (70.0, 79.99, "B+"),
    (60.0, 69.99, "B"),
    (50.0, 59.99, "C"),
    (40.0, 49.99, "D"),
    (0.0, 39.99, "F"),
]

def calculate_grade(percentage: float) -> str:
    pct = round(percentage, 2)
    for min_score, max_score, grade in GRADE_SCALE:
        if pct >= min_score:
            return grade
    return "F"

def calculate_total_and_percentage(internal: float, external: float, max_marks: float = 100.0):
    total = round(internal + external, 2)
    percentage = round((total / max_marks) * 100.0, 2)
    return total, percentage`
  },
  {
    path: "backend/services/analytics_service.py",
    name: "analytics_service.py",
    category: "Services (Business Logic)",
    description: "Computes overall averages, grade distributions, and the unified academic dashboard payload.",
    code: `from backend.services.marks_service import MarksService
from backend.services.attendance_service import AttendanceService
from backend.services.assignment_service import AssignmentService

class AnalyticsService:
    @staticmethod
    async def get_marks_analytics(student_id: str):
        marks = await MarksService.get_marks_by_student(student_id)
        if not marks:
            return {"average_percentage": 0.0, "highest_percentage": 0.0, "total_subjects": 0}
        percentages = [m["percentage"] for m in marks]
        distribution = {}
        for m in marks:
            distribution[m["grade"]] = distribution.get(m["grade"], 0) + 1
        return {
            "average_percentage": round(sum(percentages) / len(percentages), 2),
            "highest_percentage": max(percentages),
            "lowest_percentage": min(percentages),
            "total_subjects": len(marks),
            "grade_distribution": distribution,
            "subject_wise_performance": marks
        }`
  },
  {
    path: "backend/routes/assignment_routes.py",
    name: "assignment_routes.py",
    category: "Routes (APIs)",
    description: "Endpoints for POST /api/assignments, GET by student, GET single, PUT update, and DELETE.",
    code: `from fastapi import APIRouter, HTTPException, status
from backend.schemas.assignment_schema import AssignmentCreate, AssignmentUpdate
from backend.services.assignment_service import AssignmentService

router = APIRouter(prefix="/api/assignments", tags=["1. Assignment Management"])

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_assignment(payload: AssignmentCreate):
    return await AssignmentService.create_assignment(payload)

@router.get("/{student_id}")
async def get_assignments(student_id: str, status: str = None, priority: str = None):
    return await AssignmentService.get_assignments_by_student(student_id, status, priority)

@router.put("/{assignment_id}")
async def update_assignment(assignment_id: str, payload: AssignmentUpdate):
    updated = await AssignmentService.update_assignment(assignment_id, payload)
    if not updated:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return updated

@router.delete("/{assignment_id}")
async def delete_assignment(assignment_id: str):
    deleted = await AssignmentService.delete_assignment(assignment_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return {"message": "Assignment successfully deleted"}`
  },
  {
    path: "backend/routes/attendance_routes.py",
    name: "attendance_routes.py",
    category: "Routes (APIs)",
    description: "Endpoints for recording attendance, getting all records, and calculating predictions.",
    code: `from fastapi import APIRouter
from backend.schemas.attendance_schema import AttendanceCreate
from backend.services.attendance_service import AttendanceService

router = APIRouter(prefix="/api/attendance", tags=["2. Attendance Management"])

@router.post("")
async def record_attendance(payload: AttendanceCreate):
    return await AttendanceService.record_or_update_attendance(payload)

@router.get("/{student_id}")
async def get_attendance(student_id: str):
    return await AttendanceService.get_attendance_by_student(student_id)

@router.get("/{student_id}/prediction")
async def get_prediction(student_id: str, target_percentage: float = 75.0):
    return await AttendanceService.predict_attendance(student_id, target_percentage)`
  },
  {
    path: "backend/routes/marks_routes.py",
    name: "marks_routes.py",
    category: "Routes (APIs)",
    description: "Endpoints for POST /api/marks, GET student marks, and GET /analytics.",
    code: `from fastapi import APIRouter
from backend.schemas.marks_schema import MarksCreate
from backend.services.marks_service import MarksService
from backend.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/api/marks", tags=["3. Marks & Academic Analytics"])

@router.post("")
async def record_marks(payload: MarksCreate):
    return await MarksService.record_or_update_marks(payload)

@router.get("/{student_id}")
async def get_marks(student_id: str):
    return await MarksService.get_marks_by_student(student_id)

@router.get("/{student_id}/analytics")
async def get_analytics(student_id: str):
    return await AnalyticsService.get_marks_analytics(student_id)`
  },
  {
    path: "backend/routes/dashboard_routes.py",
    name: "dashboard_routes.py",
    category: "Routes (APIs)",
    description: "Unified endpoint GET /api/academic-dashboard/{student_id} returning all 3 modules in 1 call.",
    code: `from fastapi import APIRouter
from backend.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/api/academic-dashboard", tags=["4. Academic Dashboard"])

@router.get("/{student_id}")
async def get_dashboard(student_id: str):
    return await AnalyticsService.get_academic_dashboard(student_id)`
  },
  {
    path: "backend/requirements.txt",
    name: "requirements.txt",
    category: "Entry & Config",
    description: "Production dependencies: FastAPI, Uvicorn, Pydantic, Motor, PyMongo, Python-Dotenv.",
    code: `fastapi==0.110.0
uvicorn[standard]==0.28.0
pydantic==2.6.4
motor==3.3.2
pymongo==4.6.2
python-dotenv==1.0.1`
  },
  {
    path: "backend/.env.example",
    name: ".env.example",
    category: "Entry & Config",
    description: "Template for local and production environment variables without secrets.",
    code: `PORT=8000
HOST=0.0.0.0
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=smart_student_db
MIN_ATTENDANCE_PERCENTAGE=75
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000`
  }
];
