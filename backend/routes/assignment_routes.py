"""
Assignment Management API Routes.
Exposes REST endpoints for Creating, Reading, Updating, and Deleting student assignments.
"""

from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
from bson import ObjectId
from backend.schemas.assignment_schema import (
    AssignmentCreate,
    AssignmentUpdate,
    AssignmentResponse,
    PriorityEnum,
    StatusEnum,
)
from backend.services.assignment_service import AssignmentService

router = APIRouter(prefix="/api/assignments", tags=["1. Assignment Management"])


@router.post(
    "",
    response_model=AssignmentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new assignment",
    description="Validates student input, stores the assignment in MongoDB, and returns the created document."
)
async def create_assignment(payload: AssignmentCreate):
    """
    HTTP Status Codes:
    - 201 Created: Assignment successfully validated and saved in MongoDB.
    - 400 Bad Request: Validation failed (e.g. invalid date or missing required field).
    - 500 Internal Server Error: Database operation failed.
    """
    try:
        created = await AssignmentService.create_assignment(payload)
        return created
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create assignment: {str(e)}"
        )


@router.get(
    "/item/{assignment_id}",
    response_model=AssignmentResponse,
    status_code=status.HTTP_200_OK,
    summary="Get single assignment by ID",
    description="Returns full details of a specific assignment by its MongoDB ID."
)
async def get_single_assignment(assignment_id: str):
    """
    HTTP Status Codes:
    - 200 OK: Found assignment.
    - 404 Not Found: No assignment exists with this ID.
    """
    assignment = await AssignmentService.get_assignment_by_id(assignment_id)
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assignment with ID '{assignment_id}' not found."
        )
    return assignment


@router.get(
    "/{student_id}",
    response_model=List[AssignmentResponse],
    status_code=status.HTTP_200_OK,
    summary="Get all assignments for a student (with optional filters)",
    description="Fetches all assignments for a student. Supports optional filtering by status, priority, subject, and upcoming."
)
async def get_student_assignments(
    student_id: str,
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status: Pending, In Progress, Completed"),
    priority_filter: Optional[str] = Query(None, alias="priority", description="Filter by priority: High, Medium, Low"),
    subject_filter: Optional[str] = Query(None, alias="subject", description="Filter by subject name (case-insensitive)"),
    upcoming: Optional[bool] = Query(None, description="If true, returns only upcoming incomplete assignments")
):
    """
    Note: If the student_id parameter happens to be a valid 24-character ObjectId
    and exists as a single assignment, it also safely checks single lookup to maintain
    flexible URL compatibility.
    """
    # If the user passed an assignment ObjectId directly into /api/assignments/{id}
    if ObjectId.is_valid(student_id):
        single = await AssignmentService.get_assignment_by_id(student_id)
        if single and not (status_filter or priority_filter or subject_filter or upcoming):
            return [single]

    assignments = await AssignmentService.get_assignments_by_student(
        student_id=student_id,
        status=status_filter,
        priority=priority_filter,
        subject=subject_filter,
        upcoming=upcoming
    )
    return assignments


@router.put(
    "/{assignment_id}",
    response_model=AssignmentResponse,
    status_code=status.HTTP_200_OK,
    summary="Update an existing assignment",
    description="Allows updating title, description, priority, due date, and status of an assignment."
)
async def update_assignment(assignment_id: str, payload: AssignmentUpdate):
    """
    HTTP Status Codes:
    - 200 OK: Updated assignment returned.
    - 404 Not Found: Assignment does not exist.
    """
    updated = await AssignmentService.update_assignment(assignment_id, payload)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assignment with ID '{assignment_id}' not found."
        )
    return updated


@router.delete(
    "/{assignment_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete an assignment",
    description="Deletes an assignment from MongoDB by its ID."
)
async def delete_assignment(assignment_id: str):
    """
    HTTP Status Codes:
    - 200 OK: Assignment successfully removed.
    - 404 Not Found: Assignment with specified ID could not be found.
    """
    deleted = await AssignmentService.delete_assignment(assignment_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assignment with ID '{assignment_id}' not found or already deleted."
        )
    return {"message": "Assignment successfully deleted", "id": assignment_id}
