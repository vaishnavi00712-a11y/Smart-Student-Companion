"""
Marks Data Model Definition.
Represents the MongoDB document structure for student subject marks and grades.
"""

from typing import Dict, Any


def marks_entity(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Transforms a raw MongoDB marks document into a clean API response dictionary."""
    return {
        "id": str(doc.get("_id", "")),
        "student_id": str(doc.get("student_id", "")),
        "subject": str(doc.get("subject", "")),
        "internal_marks": float(doc.get("internal_marks", 0.0)),
        "external_marks": float(doc.get("external_marks", 0.0)),
        "total_marks": float(doc.get("total_marks", 0.0)),
        "percentage": float(doc.get("percentage", 0.0)),
        "grade": str(doc.get("grade", "F"))
    }


def marks_list_entity(docs) -> list:
    """Transforms an iterable of MongoDB marks documents into a list."""
    return [marks_entity(doc) for doc in docs]
