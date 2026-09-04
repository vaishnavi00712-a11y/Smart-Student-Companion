"""
Academic Dashboard API Route.
Provides an all-in-one consolidated endpoint for frontend dashboard cards.
"""

from fastapi import APIRouter, HTTPException, status
from backend.schemas.dashboard_schema import AcademicDashboardResponse
from backend.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/api/academic-dashboard", tags=["4. Academic Dashboard"])


@router.get(
    "/{student_id}",
    response_model=AcademicDashboardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get unified academic dashboard data",
    description="Returns assignment counts, attendance average & shortage warnings, and marks performance in a single round-trip HTTP request."
)
async def get_dashboard_summary(student_id: str):
    """
    HTTP Status Codes:
    - 200 OK: Consolidated dashboard information returned.
    """
    try:
        data = await AnalyticsService.get_academic_dashboard(student_id)
        return data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to compile academic dashboard: {str(e)}"
        )
