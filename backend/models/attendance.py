"""
Attendance Data Model Definition.
Represents the MongoDB document structure for student subject attendance records.
"""

from typing import Dict, Any


def attendance_entity(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Transforms a raw MongoDB attendance document into a clean API response dictionary."""
    return {
        "id": str(doc.get("_id", "")),
        "student_id": str(doc.get("student_id", "")),
        "subject": str(doc.get("subject", "")),
        "total_classes": int(doc.get("total_classes", 0)),
        "attended_classes": int(doc.get("attended_classes", 0)),
        "attendance_percentage": float(doc.get("attendance_percentage", 0.0)),
        "status": str(doc.get("status", "Safe"))
    }


def attendance_list_entity(docs) -> list:
    """Transforms an iterable of MongoDB attendance documents into a list."""
    return [attendance_entity(doc) for doc in docs]
