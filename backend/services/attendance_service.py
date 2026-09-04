"""
Attendance Service - Business Logic for Attendance Management & Prediction.
Calculates percentages, detects shortage warnings, and predicts classes needed.
"""

import math
import os
from typing import List, Dict, Any
from backend.config.database import attendance_collection
from backend.models.attendance import attendance_entity, attendance_list_entity
from backend.schemas.attendance_schema import AttendanceCreate

# Read minimum attendance threshold from environment variable (defaults to 75%)
MIN_ATTENDANCE_PERCENTAGE = float(os.getenv("MIN_ATTENDANCE_PERCENTAGE", "75.0"))


class AttendanceService:

    @staticmethod
    def calculate_percentage(attended: int, total: int) -> float:
        """
        Calculates attendance percentage: (attended / total) * 100.
        Returns 100.0 if total is 0 to avoid division by zero.
        """
        if total <= 0:
            return 100.0
        return round((attended / total) * 100, 2)

    @staticmethod
    def get_status(percentage: float, threshold: float = MIN_ATTENDANCE_PERCENTAGE) -> str:
        """
        Determines if attendance is safe or triggers a shortage warning.
        """
        return "Safe" if percentage >= threshold else "Shortage Warning"

    @staticmethod
    async def record_or_update_attendance(data: AttendanceCreate) -> Dict[str, Any]:
        """
        Saves or updates attendance for a student and subject.
        Automatically calculates percentage and status in the backend.
        """
        percentage = AttendanceService.calculate_percentage(
            data.attended_classes, data.total_classes
        )
        status = AttendanceService.get_status(percentage)

        doc_data = {
            "student_id": data.student_id,
            "subject": data.subject,
            "total_classes": data.total_classes,
            "attended_classes": data.attended_classes,
            "attendance_percentage": percentage,
            "status": status,
        }

        # Upsert: Update if matching (student_id, subject) exists, else insert
        result = await attendance_collection.find_one_and_update(
            {"student_id": data.student_id, "subject": data.subject},
            {"$set": doc_data},
            upsert=True,
            return_document=True,
        )

        # In case driver returns document or we fetch it
        if not result:
            result = await attendance_collection.find_one(
                {"student_id": data.student_id, "subject": data.subject}
            )

        return attendance_entity(result)

    @staticmethod
    async def get_attendance_by_student(student_id: str) -> List[Dict[str, Any]]:
        """
        Retrieves all subject attendance records for a given student.
        """
        cursor = attendance_collection.find({"student_id": student_id}).sort("subject", 1)
        documents = await cursor.to_list(length=100)
        return attendance_list_entity(documents)

    @staticmethod
    def calculate_classes_needed(attended: int, total: int, target_percentage: float = 75.0) -> int:
        """
        Mathematical Formula for Attendance Prediction:
        ----------------------------------------------
        Let:
          A = attended classes
          T = total classes
          P = target percentage (e.g. 75)
          x = number of consecutive upcoming classes the student must attend

        We need:
          (A + x) / (T + x) >= P / 100
          (A + x) * 100 >= P * (T + x)
          100 * A + 100 * x >= P * T + P * x
          x * (100 - P) >= P * T - 100 * A
          x >= (P * T - 100 * A) / (100 - P)

        For P = 75%:
          x = ceil((75 * T - 100 * A) / 25)
          x = ceil(3 * T - 4 * A)
        """
        if total <= 0:
            return 0

        current_pct = (attended / total) * 100.0
        if current_pct >= target_percentage:
            return 0

        numerator = (target_percentage * total) - (100.0 * attended)
        denominator = 100.0 - target_percentage

        if denominator <= 0:
            return 0

        needed = math.ceil(numerator / denominator)
        return max(0, needed)

    @staticmethod
    async def predict_attendance(
        student_id: str,
        target_percentage: float = MIN_ATTENDANCE_PERCENTAGE
    ) -> Dict[str, Any]:
        """
        Calculates prediction for each subject and overall attendance.
        """
        records = await AttendanceService.get_attendance_by_student(student_id)

        subject_predictions = []
        total_all_classes = 0
        attended_all_classes = 0

        for r in records:
            tot = r["total_classes"]
            att = r["attended_classes"]
            pct = r["attendance_percentage"]
            total_all_classes += tot
            attended_all_classes += att

            needed = AttendanceService.calculate_classes_needed(att, tot, target_percentage)
            
            if pct >= target_percentage:
                msg = f"Attendance is safe ({pct}%). No extra classes required to reach {target_percentage}%."
            else:
                msg = f"Current is {pct}%. You must attend the next {needed} consecutive class(es) without missing any to reach {target_percentage}%."

            subject_predictions.append({
                "subject": r["subject"],
                "total_classes": tot,
                "attended_classes": att,
                "current_percentage": pct,
                "target_percentage": target_percentage,
                "status": r["status"],
                "classes_needed": needed,
                "message": msg
            })

        overall_pct = AttendanceService.calculate_percentage(attended_all_classes, total_all_classes)

        return {
            "student_id": student_id,
            "target_percentage": target_percentage,
            "overall_percentage": overall_pct,
            "subjects": subject_predictions
        }
