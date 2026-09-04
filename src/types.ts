export interface Assignment {
  id: string;
  student_id: string;
  subject: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  due_date: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  created_at?: string;
}

export interface AttendanceRecord {
  id?: string;
  student_id: string;
  subject: string;
  total_classes: int;
  attended_classes: int;
  attendance_percentage: number;
  status: 'Safe' | 'Shortage Warning';
}

type int = number;

export interface SubjectPrediction {
  subject: string;
  total_classes: number;
  attended_classes: number;
  current_percentage: number;
  target_percentage: number;
  status: string;
  classes_needed: number;
  message: string;
}

export interface MarksRecord {
  id?: string;
  student_id: string;
  subject: string;
  internal_marks: number;
  external_marks: number;
  total_marks: number;
  percentage: number;
  grade: string;
}

export interface MarksAnalytics {
  student_id: string;
  average_percentage: number;
  highest_percentage: number;
  lowest_percentage: number;
  total_subjects: number;
  grade_distribution: Record<string, number>;
  subject_wise_performance: MarksRecord[];
}

export interface AcademicDashboardData {
  student_id: string;
  assignments: {
    total: number;
    pending: number;
    completed: number;
    in_progress: number;
    upcoming_due: Assignment[];
  };
  attendance: {
    average_percentage: number;
    total_subjects: number;
    shortage_subjects: string[];
    has_shortage_alert: boolean;
  };
  marks: {
    average_percentage: number;
    highest_percentage: number;
    total_subjects: number;
    recent_marks: MarksRecord[];
  };
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  title: string;
  module: 'Assignment' | 'Attendance' | 'Marks' | 'Dashboard';
  description: string;
  defaultPayload?: any;
  defaultParams?: Record<string, string>;
  expectedStatus: number;
}
