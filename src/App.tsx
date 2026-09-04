import React, { useState } from 'react';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { AssignmentView } from './components/AssignmentView';
import { AttendanceView } from './components/AttendanceView';
import { MarksView } from './components/MarksView';
import { ApiExplorerView } from './components/ApiExplorerView';
import { CodeViewer } from './components/CodeViewer';
import { VivaPrepView } from './components/VivaPrepView';
import { DeploymentGuideView } from './components/DeploymentGuideView';
import { Assignment, AttendanceRecord, MarksRecord } from './types';
import { CheckCircle2, Terminal, ExternalLink, Heart } from 'lucide-react';

const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: "asg_1",
    student_id: "student123",
    subject: "Python Programming",
    title: "Binary Search Tree Implementation",
    description: "Write an async recursive and iterative binary search tree in Python with traversal methods.",
    priority: "High",
    due_date: "2026-09-12",
    status: "In Progress",
    created_at: "2026-09-01T10:00:00Z"
  },
  {
    id: "asg_2",
    student_id: "student123",
    subject: "Database Management Systems",
    title: "ER Diagram & Schema Normalization (3NF)",
    description: "Design relational schema for hospital database and decompose into Boyce-Codd Normal Form.",
    priority: "High",
    due_date: "2026-09-15",
    status: "Pending",
    created_at: "2026-09-02T11:30:00Z"
  },
  {
    id: "asg_3",
    student_id: "student123",
    subject: "Operating Systems",
    title: "Page Replacement Algorithms Simulator",
    description: "Simulate FIFO, LRU, and Optimal page replacement algorithms and graph fault rates.",
    priority: "Medium",
    due_date: "2026-09-22",
    status: "Pending",
    created_at: "2026-09-03T09:15:00Z"
  },
  {
    id: "asg_4",
    student_id: "student123",
    subject: "Computer Networks",
    title: "Socket Programming Client-Server Chat",
    description: "Multi-threaded TCP chat room in Python using select and socket modules.",
    priority: "Low",
    due_date: "2026-09-05",
    status: "Completed",
    created_at: "2026-08-28T14:00:00Z"
  }
];

const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: "att_1",
    student_id: "student123",
    subject: "Python Programming",
    total_classes: 40,
    attended_classes: 35,
    attendance_percentage: 87.5,
    status: "Safe"
  },
  {
    id: "att_2",
    student_id: "student123",
    subject: "Database Management Systems",
    total_classes: 36,
    attended_classes: 25,
    attendance_percentage: 69.4,
    status: "Shortage Warning"
  },
  {
    id: "att_3",
    student_id: "student123",
    subject: "Operating Systems",
    total_classes: 38,
    attended_classes: 26,
    attendance_percentage: 68.4,
    status: "Shortage Warning"
  },
  {
    id: "att_4",
    student_id: "student123",
    subject: "Computer Networks",
    total_classes: 34,
    attended_classes: 29,
    attendance_percentage: 85.3,
    status: "Safe"
  }
];

const INITIAL_MARKS: MarksRecord[] = [
  {
    id: "mrk_1",
    student_id: "student123",
    subject: "Python Programming",
    internal_marks: 28,
    external_marks: 66,
    total_marks: 94,
    percentage: 94,
    grade: "A+"
  },
  {
    id: "mrk_2",
    student_id: "student123",
    subject: "Database Management Systems",
    internal_marks: 25,
    external_marks: 58,
    total_marks: 83,
    percentage: 83,
    grade: "A"
  },
  {
    id: "mrk_3",
    student_id: "student123",
    subject: "Operating Systems",
    internal_marks: 22,
    external_marks: 53,
    total_marks: 75,
    percentage: 75,
    grade: "B"
  },
  {
    id: "mrk_4",
    student_id: "student123",
    subject: "Computer Networks",
    internal_marks: 26,
    external_marks: 62,
    total_marks: 88,
    percentage: 88,
    grade: "A"
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [studentId, setStudentId] = useState<string>('student123');

  // Core Datasets
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [marks, setMarks] = useState<MarksRecord[]>(INITIAL_MARKS);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Assignment CRUD Handlers
  const handleAddAssignment = (newAssignment: Omit<Assignment, 'id'>) => {
    const created: Assignment = {
      ...newAssignment,
      id: `asg_${Date.now()}`
    };
    setAssignments(prev => [created, ...prev]);
    showToast(`Created assignment: "${created.title}"`);
  };

  const handleUpdateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    showToast(`Updated assignment successfully.`);
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
    showToast(`Assignment deleted.`);
  };

  // Attendance Handlers
  const handleUpdateAttendance = (record: Omit<AttendanceRecord, 'id' | 'attendance_percentage' | 'status'>) => {
    const pct = record.total_classes > 0 
      ? Math.round((record.attended_classes / record.total_classes) * 100 * 10) / 10 
      : 100;
    const status = pct >= 75 ? 'Safe' : 'Shortage Warning';

    setAttendance(prev => {
      const existingIndex = prev.findIndex(a => a.subject.toLowerCase() === record.subject.toLowerCase());
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          total_classes: record.total_classes,
          attended_classes: record.attended_classes,
          attendance_percentage: pct,
          status
        };
        return updated;
      } else {
        const newRecord: AttendanceRecord = {
          id: `att_${Date.now()}`,
          student_id: record.student_id,
          subject: record.subject,
          total_classes: record.total_classes,
          attended_classes: record.attended_classes,
          attendance_percentage: pct,
          status
        };
        return [...prev, newRecord];
      }
    });

    showToast(`Attendance updated for ${record.subject}: ${pct}%`);
  };

  // Marks Handlers
  const handleAddMarks = (record: Omit<MarksRecord, 'id' | 'percentage' | 'grade' | 'total_marks'>) => {
    const total = record.internal_marks + record.external_marks;
    const pct = Math.round((total / 100) * 100 * 10) / 10;
    let grade = 'F';
    if (pct >= 90) grade = 'A+';
    else if (pct >= 80) grade = 'A';
    else if (pct >= 70) grade = 'B';
    else if (pct >= 60) grade = 'C';
    else if (pct >= 50) grade = 'D';

    const newMark: MarksRecord = {
      id: `mrk_${Date.now()}`,
      student_id: record.student_id,
      subject: record.subject,
      internal_marks: record.internal_marks,
      external_marks: record.external_marks,
      total_marks: total,
      percentage: pct,
      grade
    };

    setMarks(prev => {
      const idx = prev.findIndex(m => m.subject.toLowerCase() === record.subject.toLowerCase());
      if (idx >= 0) {
        const clone = [...prev];
        clone[idx] = newMark;
        return clone;
      }
      return [...prev, newMark];
    });

    showToast(`Marks recorded for ${record.subject}: Grade ${grade} (${pct}%)`);
  };

  const handleDeleteMarks = (id: string) => {
    setMarks(prev => prev.filter(m => m.id !== id));
    showToast(`Marks record deleted.`);
  };

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#D1D5DB] flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-[#1A1D23] border border-indigo-500/50 text-white rounded-xl shadow-2xl animate-fade-in text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        studentId={studentId}
        setStudentId={setStudentId}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            studentId={studentId}
            assignments={assignments}
            attendance={attendance}
            marks={marks}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'assignments' && (
          <AssignmentView
            studentId={studentId}
            assignments={assignments}
            onAddAssignment={handleAddAssignment}
            onUpdateAssignment={handleUpdateAssignment}
            onDeleteAssignment={handleDeleteAssignment}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceView
            studentId={studentId}
            attendance={attendance}
            onUpdateAttendance={handleUpdateAttendance}
          />
        )}

        {activeTab === 'marks' && (
          <MarksView
            studentId={studentId}
            marks={marks}
            onAddMarks={handleAddMarks}
            onDeleteMarks={handleDeleteMarks}
          />
        )}

        {activeTab === 'api_explorer' && (
          <ApiExplorerView
            studentId={studentId}
            assignments={assignments}
            attendance={attendance}
            marks={marks}
            onAddAssignment={handleAddAssignment}
            onUpdateAttendance={handleUpdateAttendance}
            onAddMarks={handleAddMarks}
          />
        )}

        {activeTab === 'code_viewer' && <CodeViewer />}

        {activeTab === 'viva_prep' && <VivaPrepView />}

        {activeTab === 'deployment' && <DeploymentGuideView />}
      </main>

      {/* Sophisticated Dark Footer */}
      <footer className="border-t border-[#2D3139] bg-[#15181E] text-slate-400 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-white font-medium">Smart Student Companion</span>
            <span className="text-slate-600">|</span>
            <span>Python FastAPI & MongoDB Backend Architecture</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>FastAPI 0.111.0</span>
            <span>Pydantic v2</span>
            <span>Motor Async MongoDB</span>
            <button
              onClick={() => setActiveTab('api_explorer')}
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Swagger /docs
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
