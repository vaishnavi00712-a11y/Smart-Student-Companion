"""
Assignment Service - Business Logic for Assignment Management.
Handles MongoDB database operations, filtering, and data transformations.
"""

from bson import ObjectId
from datetime import datetime
from typing import List, Optional, Dict, Any
from backend.config.database import assignments_collection
from backend.models.assignment import assignment_entity, assignment_list_entity
from backend.schemas.assignment_schema import AssignmentCreate, AssignmentUpdate


class AssignmentService:

    @staticmethod
    async def create_assignment(data: AssignmentCreate) -> Dict[str, Any]:
        """
        Creates a new assignment record in MongoDB.
        """
        document = data.model_dump()
        document["created_at"] = datetime.utcnow().isoformat()
        
        # Insert into MongoDB
        result = await assignments_collection.insert_one(document)
        
        # Retrieve the created document
        created = await assignments_collection.find_one({"_id": result.inserted_id})
        return assignment_entity(created)

    @staticmethod
    async def get_assignments_by_student(
        student_id: str,
        status: Optional[str] = None,
        priority: Optional[str] = None,
        subject: Optional[str] = None,
        upcoming: Optional[bool] = None
    ) -> List[Dict[str, Any]]:
        """
        Retrieves all assignments for a student with optional query filters.
        Supports filtering by status, priority, subject, and upcoming due dates.
        """
        query: Dict[str, Any] = {"student_id": student_id}

        if status:
            query["status"] = status
        if priority:
            query["priority"] = priority
        if subject:
            # Case-insensitive subject search
            query["subject"] = {"$regex": f"^{subject}$", "$options": "i"}
        if upcoming:
            today_str = datetime.utcnow().strftime("%Y-%m-%d")
            query["due_date"] = {"$gte": today_str}
            query["status"] = {"$ne": "Completed"}

        cursor = assignments_collection.find(query).sort("due_date", 1)
        documents = await cursor.to_list(length=500)
        return assignment_list_entity(documents)

    @staticmethod
    async def get_assignment_by_id(assignment_id: str) -> Optional[Dict[str, Any]]:
        """
        Fetches a single assignment by its MongoDB ObjectId.
        Returns None if ID format is invalid or document does not exist.
        """
        if not ObjectId.is_valid(assignment_id):
            return None

        doc = await assignments_collection.find_one({"_id": ObjectId(assignment_id)})
        if not doc:
            return None
        return assignment_entity(doc)

    @staticmethod
    async def update_assignment(assignment_id: str, update_data: AssignmentUpdate) -> Optional[Dict[str, Any]]:
        """
        Updates fields of an existing assignment in MongoDB.
        """
        if not ObjectId.is_valid(assignment_id):
            return None

        # Extract only fields that were explicitly sent (non-None)
        fields_to_update = {k: v for k, v in update_data.model_dump().items() if v is not None}
        if not fields_to_update:
            # Nothing to update, return existing document
            return await AssignmentService.get_assignment_by_id(assignment_id)

        fields_to_update["updated_at"] = datetime.utcnow().isoformat()

        result = await assignments_collection.update_one(
            {"_id": ObjectId(assignment_id)},
            {"$set": fields_to_update}
        )

        if result.matched_count == 0:
            return None

        return await AssignmentService.get_assignment_by_id(assignment_id)

    @staticmethod
    async def delete_assignment(assignment_id: str) -> bool:
        """
        Deletes an assignment from MongoDB by its ObjectId.
        Returns True if deleted, False if not found.
        """
        if not ObjectId.is_valid(assignment_id):
            return False

        result = await assignments_collection.delete_one({"_id": ObjectId(assignment_id)})
        return result.deleted_count > 0
