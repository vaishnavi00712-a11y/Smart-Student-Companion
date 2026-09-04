"""
Marks Service - Business Logic for Marks Management & Grade Calculation.
Handles grade determination, percentage computation, and MongoDB storage.
"""

from typing import List, Dict, Any, Tuple
from backend.config.database import marks_collection
from backend.models.marks import marks_entity, marks_list_entity
from backend.schemas.marks_schema import MarksCreate

# Configurable Grade Scale (easily customizable for college criteria)
GRADE_SCALE = [
    (90.0, 100.0, "A+"),
    (80.0, 89.99, "A"),
    (70.0, 79.99, "B+"),
    (60.0, 69.99, "B"),
    (50.0, 59.99, "C"),
    (40.0, 49.99, "D"),
    (0.0, 39.99, "F"),
]


def calculate_grade(percentage: float) -> str:
    """
    Reusable function for grade calculation based on percentage.
    Iterates through the configurable GRADE_SCALE boundaries.
    """
    pct = round(percentage, 2)
    for min_score, max_score, grade in GRADE_SCALE:
        if pct >= min_score:
            return grade
    return "F"


def calculate_total_and_percentage(
    internal: float, external: float, max_marks: float = 100.0
) -> Tuple[float, float]:
    """
    Computes total marks and percentage automatically.
    """
    total = round(internal + external, 2)
    percentage = round((total / max_marks) * 100.0, 2) if max_marks > 0 else 0.0
    return total, percentage


class MarksService:

    @staticmethod
    async def record_or_update_marks(data: MarksCreate) -> Dict[str, Any]:
        """
        Calculates total, percentage, and grade, then upserts the record into MongoDB.
        """
        max_marks = data.max_marks or 100.0
        total, percentage = calculate_total_and_percentage(
            data.internal_marks, data.external_marks, max_marks
        )
        grade = calculate_grade(percentage)

        doc_data = {
            "student_id": data.student_id,
            "subject": data.subject,
            "internal_marks": data.internal_marks,
            "external_marks": data.external_marks,
            "total_marks": total,
            "percentage": percentage,
            "grade": grade,
        }

        # Upsert: update existing student-subject record or create new
        result = await marks_collection.find_one_and_update(
            {"student_id": data.student_id, "subject": data.subject},
            {"$set": doc_data},
            upsert=True,
            return_document=True,
        )

        if not result:
            result = await marks_collection.find_one(
                {"student_id": data.student_id, "subject": data.subject}
            )

        return marks_entity(result)

    @staticmethod
    async def get_marks_by_student(student_id: str) -> List[Dict[str, Any]]:
        """
        Retrieves all subject marks for a student.
        """
        cursor = marks_collection.find({"student_id": student_id}).sort("subject", 1)
        documents = await cursor.to_list(length=100)
        return marks_list_entity(documents)
