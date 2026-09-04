"""
Pydantic Schemas for Assignment Management.
Handles data validation, serialization, and Swagger documentation models.
"""

from pydantic import BaseModel, Field, field_validator
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
    """Schema for creating a new assignment (POST request)."""
    student_id: str = Field(..., min_length=1, description="Unique ID of the student", example="student123")
    subject: str = Field(..., min_length=1, max_length=100, description="Academic subject name", example="Python")
    title: str = Field(..., min_length=2, max_length=200, description="Title of the assignment", example="Python Functions & Loops")
    description: Optional[str] = Field(default="", description="Detailed description of requirements", example="Complete recursion and loop exercises")
    priority: PriorityEnum = Field(default=PriorityEnum.MEDIUM, description="Priority level: High, Medium, or Low", example="High")
    due_date: str = Field(..., description="Due date in YYYY-MM-DD format", example="2026-09-10")
    status: StatusEnum = Field(default=StatusEnum.PENDING, description="Status of the assignment", example="Pending")

    @field_validator("due_date")
    @classmethod
    def validate_due_date(cls, value: str) -> str:
        """Validates that due_date is in valid YYYY-MM-DD format."""
        try:
            datetime.strptime(value, "%Y-%m-%d")
        except ValueError:
            raise ValueError("due_date must be in valid YYYY-MM-DD format (e.g. 2026-09-10)")
        return value


class AssignmentUpdate(BaseModel):
    """Schema for updating an existing assignment (PUT request). All fields are optional."""
    title: Optional[str] = Field(None, min_length=2, max_length=200, example="Updated Assignment Title")
    description: Optional[str] = Field(None, example="Updated description")
    priority: Optional[PriorityEnum] = Field(None, example="High")
    due_date: Optional[str] = Field(None, example="2026-09-15")
    status: Optional[StatusEnum] = Field(None, example="Completed")

    @field_validator("due_date")
    @classmethod
    def validate_due_date(cls, value: Optional[str]) -> Optional[str]:
        if value is not None:
            try:
                datetime.strptime(value, "%Y-%m-%d")
            except ValueError:
                raise ValueError("due_date must be in valid YYYY-MM-DD format (e.g. 2026-09-15)")
        return value


class AssignmentResponse(BaseModel):
    """Schema for returning an assignment to the client."""
    id: str = Field(..., description="Unique assignment ID from MongoDB", example="65e8a1f87c4f1a2b3c4d5e6f")
    student_id: str
    subject: str
    title: str
    description: str
    priority: str
    due_date: str
    status: str
    created_at: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "id": "65e8a1f87c4f1a2b3c4d5e6f",
                "student_id": "student123",
                "subject": "Python",
                "title": "Python Assignment 1",
                "description": "Complete functions and loops questions",
                "priority": "High",
                "due_date": "2026-09-10",
                "status": "Pending",
                "created_at": "2026-09-04T12:00:00"
            }
        }
