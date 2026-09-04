"""
Pydantic Schema for the Unified Academic Dashboard.
Combines assignments, attendance, and marks into one comprehensive response.
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from backend.schemas.assignment_schema import AssignmentResponse
from backend.schemas.marks_schema import MarksResponse


class AssignmentSummary(BaseModel):
    total: int = Field(..., example=10)
    pending: int = Field(..., example=4)
    completed: int = Field(..., example=6)
    in_progress: int = Field(default=0, example=1)
    upcoming_due: List[AssignmentResponse] = Field(default=[])


class AttendanceSummary(BaseModel):
    average_percentage: float = Field(..., example=82.5)
    total_subjects: int = Field(..., example=4)
    shortage_subjects: List[str] = Field(..., description="Subjects where attendance < 75%", example=["DBMS"])
    has_shortage_alert: bool = Field(..., example=True)


class MarksSummary(BaseModel):
    average_percentage: float = Field(..., example=84.2)
    highest_percentage: float = Field(..., example=92.0)
    total_subjects: int = Field(..., example=4)
    recent_marks: List[MarksResponse] = Field(default=[])


class AcademicDashboardResponse(BaseModel):
    """Unified payload returned to student dashboard in a single efficient HTTP call."""
    student_id: str
    assignments: AssignmentSummary
    attendance: AttendanceSummary
    marks: MarksSummary
