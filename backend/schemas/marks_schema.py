"""
Pydantic Schemas for Marks Management & Academic Analytics.
Handles input validation, automatic calculation results, and analytics structures.
"""

from pydantic import BaseModel, Field, model_validator
from typing import Optional, Dict, List


class MarksCreate(BaseModel):
    """Schema for submitting student marks."""
    student_id: str = Field(..., min_length=1, description="Student ID", example="student123")
    subject: str = Field(..., min_length=1, max_length=100, description="Subject name", example="Python")
    internal_marks: float = Field(..., ge=0, le=100, description="Internal evaluation marks (e.g. out of 20 or 30)", example=18.0)
    external_marks: float = Field(..., ge=0, le=100, description="External / semester exam marks (e.g. out of 70 or 80)", example=72.0)
    max_marks: Optional[float] = Field(default=100.0, gt=0, description="Maximum total possible marks", example=100.0)

    @model_validator(mode="after")
    def validate_marks_total(self):
        """Ensures that internal + external does not exceed max_marks."""
        total = self.internal_marks + self.external_marks
        if total > self.max_marks:
            raise ValueError(
                f"Total marks ({total}) cannot exceed maximum allowed marks ({self.max_marks})."
            )
        return self


class MarksResponse(BaseModel):
    """Schema returned with calculated totals, percentages, and grade."""
    id: Optional[str] = None
    student_id: str
    subject: str
    internal_marks: float
    external_marks: float
    total_marks: float = Field(..., description="Calculated automatically by backend: internal + external", example=90.0)
    percentage: float = Field(..., description="Calculated automatically: (total / max) * 100", example=90.0)
    grade: str = Field(..., description="Calculated automatically using configurable grading scale", example="A+")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "65e8a1f87c4f1a2b3c4d5e71",
                "student_id": "student123",
                "subject": "Python",
                "internal_marks": 18.0,
                "external_marks": 72.0,
                "total_marks": 90.0,
                "percentage": 90.0,
                "grade": "A+"
            }
        }


class MarksAnalyticsResponse(BaseModel):
    """Schema for student academic performance analytics."""
    student_id: str
    average_percentage: float = Field(..., description="Overall average percentage across all subjects", example=82.5)
    highest_percentage: float = Field(..., description="Highest percentage obtained in any subject", example=94.0)
    lowest_percentage: float = Field(..., description="Lowest percentage obtained in any subject", example=68.0)
    total_subjects: int = Field(..., description="Total number of evaluated subjects", example=5)
    grade_distribution: Dict[str, int] = Field(..., description="Count of subjects per grade letter", example={"A+": 2, "A": 2, "B+": 1})
    subject_wise_performance: List[MarksResponse] = Field(default=[], description="List of all subject marks and grades")
