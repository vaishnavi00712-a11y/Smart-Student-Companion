"""
Assignment Data Model Definition.
Represents the exact document structure stored in the MongoDB 'assignments' collection.
"""

from typing import Dict, Any, Optional
from datetime import datetime


def assignment_entity(doc: Dict[str, Any]) -> Dict[str, Any]:
    """
    Transforms a raw MongoDB document dictionary into an API-friendly dictionary.
    Converts ObjectId into a string representation.
    """
    return {
        "id": str(doc.get("_id", "")),
        "student_id": str(doc.get("student_id", "")),
        "subject": str(doc.get("subject", "")),
        "title": str(doc.get("title", "")),
        "description": str(doc.get("description", "")),
        "priority": str(doc.get("priority", "Medium")),
        "due_date": str(doc.get("due_date", "")),
        "status": str(doc.get("status", "Pending")),
        "created_at": doc.get("created_at", datetime.utcnow().isoformat())
    }


def assignment_list_entity(docs) -> list:
    """Transforms an iterable of MongoDB documents into a list of clean dictionaries."""
    return [assignment_entity(doc) for doc in docs]
