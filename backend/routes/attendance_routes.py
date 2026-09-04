"""
Attendance Management API Routes.
Exposes REST endpoints for recording attendance, viewing attendance percentage,
shortage warnings (<75%), and attendance prediction calculations.
"""

from fastapi import APIRouter, HTTPException, Query, status
from typing import List
from backend.schemas.attendance_schema import (
    AttendanceCreate,
    AttendanceResponse,
    AttendancePredictionResponse
)
from backend.services.attendance_service import AttendanceService, MIN_ATTENDANCE_PERCENTAGE

router = APIRouter(prefix="/api/attendance", tags=["2. Attendance Management"])


@router.post(
    "",
    response_model=AttendanceResponse,
    status_code=status.HTTP_200_OK,
    summary="Create or update subject attendance",
    description="Submits total classes and attended classes. The backend automatically calculates percentage and shortage status."
)
async def record_attendance(payload: AttendanceCreate):
    """
    HTTP Status Codes:
    - 200 OK: Attendance recorded/updated and percentage calculated.
    - 400 Bad Request: Attended classes > total classes or negative numbers.
    - 500 Internal Server Error: Database failure.
    """
    try:
        recorded = await AttendanceService.record_or_update_attendance(payload)
        return recorded
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to record attendance: {str(e)}"
        )


@router.get(
    "/{student_id}",
    response_model=List[AttendanceResponse],
    status_code=status.HTTP_200_OK,
    summary="Get attendance for all subjects",
    description="Retrieves subject-wise attendance percentages and shortage warning flags for a given student."
)
async def get_student_attendance(student_id: str):
    """
    HTTP Status Codes:
    - 200 OK: List of subject attendance records returned.
    """
    records = await AttendanceService.get_attendance_by_student(student_id)
    return records


@router.get(
    "/{student_id}/prediction",
    response_model=AttendancePredictionResponse,
    status_code=status.HTTP_200_OK,
    summary="Calculate attendance prediction",
    description="Calculates how many consecutive upcoming classes a student must attend to reach the target attendance threshold (default 75%)."
)
async def get_attendance_prediction(
    student_id: str,
    target_percentage: float = Query(
        default=MIN_ATTENDANCE_PERCENTAGE,
        ge=1.0,
        le=100.0,
        description="Target attendance percentage requirement (default 75%)"
    )
):
    """
    HTTP Status Codes:
    - 200 OK: Prediction calculated and returned with mathematical explanation.
    """
    prediction = await AttendanceService.predict_attendance(
        student_id=student_id,
        target_percentage=target_percentage
    )
    return prediction
