"""
Marks Management & Analytics API Routes.
Exposes REST endpoints for recording student marks, calculating grades,
and computing comprehensive academic performance analytics.
"""

from fastapi import APIRouter, HTTPException, status
from typing import List
from backend.schemas.marks_schema import (
    MarksCreate,
    MarksResponse,
    MarksAnalyticsResponse
)
from backend.services.marks_service import MarksService
from backend.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/api/marks", tags=["3. Marks & Academic Analytics"])


@router.post(
    "",
    response_model=MarksResponse,
    status_code=status.HTTP_200_OK,
    summary="Submit student marks",
    description="Submits internal and external marks. The backend automatically calculates total marks, percentage, and grade."
)
async def record_marks(payload: MarksCreate):
    """
    HTTP Status Codes:
    - 200 OK: Marks recorded, total calculated, grade assigned.
    - 400 Bad Request: Marks negative or exceeding max_marks.
    - 500 Internal Server Error: Storage failure.
    """
    try:
        recorded = await MarksService.record_or_update_marks(payload)
        return recorded
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to record marks: {str(e)}"
        )


@router.get(
    "/{student_id}",
    response_model=List[MarksResponse],
    status_code=status.HTTP_200_OK,
    summary="Get marks for all subjects",
    description="Retrieves subject marks, percentages, and letter grades for a student."
)
async def get_student_marks(student_id: str):
    """
    HTTP Status Codes:
    - 200 OK: List of marks documents.
    """
    marks = await MarksService.get_marks_by_student(student_id)
    return marks


@router.get(
    "/{student_id}/analytics",
    response_model=MarksAnalyticsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get marks analytics",
    description="Computes overall average percentage, highest/lowest marks, total subjects, and letter grade distribution."
)
async def get_marks_analytics(student_id: str):
    """
    HTTP Status Codes:
    - 200 OK: Analytics metrics computed successfully.
    """
    analytics = await AnalyticsService.get_marks_analytics(student_id)
    return analytics
