"""
Pydantic Schemas for Attendance Management.
Validates class counts, prevents invalid entries, and defines response types.
"""

from pydantic import BaseModel, Field, model_validator
from typing import Optional, List


class AttendanceCreate(BaseModel):
    """Schema for submitting or updating attendance for a subject."""
    student_id: str = Field(..., min_length=1, description="Student ID", example="student123")
    subject: str = Field(..., min_length=1, max_length=100, description="Subject name", example="DBMS")
    total_classes: int = Field(..., ge=0, description="Total number of classes conducted", example=40)
    attended_classes: int = Field(..., ge=0, description="Total number of classes attended", example=34)

    @model_validator(mode="after")
    def validate_classes(self):
        """Ensures that attended classes cannot exceed total classes conducted."""
        if self.attended_classes > self.total_classes:
            raise ValueError(
                f"Attended classes ({self.attended_classes}) cannot be greater than total classes ({self.total_classes})."
            )
        return self


class AttendanceResponse(BaseModel):
    """Schema returned after attendance is recorded and percentage calculated."""
    id: Optional[str] = None
    student_id: str
    subject: str
    total_classes: int
    attended_classes: int
    attendance_percentage: float = Field(..., description="Calculated automatically by backend", example=85.0)
    status: str = Field(..., description="'Safe' if >= 75%, otherwise 'Shortage Warning'", example="Safe")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "65e8a1f87c4f1a2b3c4d5e70",
                "student_id": "student123",
                "subject": "DBMS",
                "total_classes": 40,
                "attended_classes": 34,
                "attendance_percentage": 85.0,
                "status": "Safe"
            }
        }


class SubjectPrediction(BaseModel):
    """Detailed prediction for a single subject."""
    subject: str
    total_classes: int
    attended_classes: int
    current_percentage: float
    target_percentage: float
    status: str
    classes_needed: int = Field(
        ...,
        description="Number of consecutive upcoming classes the student must attend to reach the target percentage"
    )
    message: str


class AttendancePredictionResponse(BaseModel):
    """Prediction summary for a student across their subjects."""
    student_id: str
    target_percentage: float
    overall_percentage: float
    subjects: List[SubjectPrediction]
