"""
Analytics Service - Computes Academic Performance Metrics and Unified Dashboard.
Aggregates data across Assignments, Attendance, and Marks collections.
"""

from typing import Dict, Any, List
from datetime import datetime
from backend.services.marks_service import MarksService
from backend.services.attendance_service import AttendanceService, MIN_ATTENDANCE_PERCENTAGE
from backend.services.assignment_service import AssignmentService


class AnalyticsService:

    @staticmethod
    async def get_marks_analytics(student_id: str) -> Dict[str, Any]:
        """
        Calculates marks statistics:
        - Overall average percentage
        - Highest score
        - Lowest score
        - Total subjects
        - Grade distribution count
        """
        marks = await MarksService.get_marks_by_student(student_id)

        if not marks:
            return {
                "student_id": student_id,
                "average_percentage": 0.0,
                "highest_percentage": 0.0,
                "lowest_percentage": 0.0,
                "total_subjects": 0,
                "grade_distribution": {},
                "subject_wise_performance": []
            }

        percentages = [m["percentage"] for m in marks]
        avg_pct = round(sum(percentages) / len(percentages), 2)
        high_pct = max(percentages)
        low_pct = min(percentages)

        # Count frequencies of each grade
        distribution: Dict[str, int] = {}
        for m in marks:
            g = m["grade"]
            distribution[g] = distribution.get(g, 0) + 1

        return {
            "student_id": student_id,
            "average_percentage": avg_pct,
            "highest_percentage": high_pct,
            "lowest_percentage": low_pct,
            "total_subjects": len(marks),
            "grade_distribution": distribution,
            "subject_wise_performance": marks
        }

    @staticmethod
    async def get_academic_dashboard(student_id: str) -> Dict[str, Any]:
        """
        Single unified API endpoint giving the student dashboard all required academic metrics:
        - Assignments breakdown (total, pending, completed, in progress)
        - Attendance overview (average, list of subjects facing shortage warning)
        - Marks overview (overall percentage, highest percentage, recent marks)
        """
        # 1. Fetch all student assignments
        assignments = await AssignmentService.get_assignments_by_student(student_id)
        total_assignments = len(assignments)
        pending_assignments = sum(1 for a in assignments if a.get("status") == "Pending")
        completed_assignments = sum(1 for a in assignments if a.get("status") == "Completed")
        in_progress_assignments = sum(1 for a in assignments if a.get("status") == "In Progress")

        # Upcoming assignments (not completed, sorted by due date)
        today_str = datetime.utcnow().strftime("%Y-%m-%d")
        upcoming = [
            a for a in assignments 
            if a.get("status") != "Completed" and a.get("due_date", "") >= today_str
        ][:5]

        # 2. Fetch all student attendance records
        attendance_records = await AttendanceService.get_attendance_by_student(student_id)
        shortage_subjects: List[str] = []
        tot_classes = 0
        att_classes = 0

        for att in attendance_records:
            tot_classes += att["total_classes"]
            att_classes += att["attended_classes"]
            if att["attendance_percentage"] < MIN_ATTENDANCE_PERCENTAGE:
                shortage_subjects.append(att["subject"])

        avg_attendance = (
            round((att_classes / tot_classes) * 100.0, 2) if tot_classes > 0 else 0.0
        )

        # 3. Fetch all student marks
        marks_records = await MarksService.get_marks_by_student(student_id)
        if marks_records:
            percentages = [m["percentage"] for m in marks_records]
            avg_marks_pct = round(sum(percentages) / len(percentages), 2)
            high_marks_pct = max(percentages)
        else:
            avg_marks_pct = 0.0
            high_marks_pct = 0.0

        return {
            "student_id": student_id,
            "assignments": {
                "total": total_assignments,
                "pending": pending_assignments,
                "completed": completed_assignments,
                "in_progress": in_progress_assignments,
                "upcoming_due": upcoming
            },
            "attendance": {
                "average_percentage": avg_attendance,
                "total_subjects": len(attendance_records),
                "shortage_subjects": shortage_subjects,
                "has_shortage_alert": len(shortage_subjects) > 0
            },
            "marks": {
                "average_percentage": avg_marks_pct,
                "highest_percentage": high_marks_pct,
                "total_subjects": len(marks_records),
                "recent_marks": marks_records[:5]
            }
        }
