import React, { useState } from 'react';
import { 
  Layers, 
  BookOpen, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Code,
  Sparkles,
  TrendingUp,
  GraduationCap
} from 'lucide-react';
import { Assignment, AttendanceRecord, MarksRecord } from '../types';

interface DashboardViewProps {
  studentId: string;
  assignments: Assignment[];
  attendance: AttendanceRecord[];
  marks: MarksRecord[];
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  studentId,
  assignments,
  attendance,
  marks,
  onNavigateTab
}) => {
  const [showRawJson, setShowRawJson] = useState(false);

  // Compute aggregated stats
  const pendingCount = assignments.filter(a => a.status === 'Pending').length;
  const completedCount = assignments.filter(a => a.status === 'Completed').length;
  const inProgressCount = assignments.filter(a => a.status === 'In Progress').length;

  const totalClassesSum = attendance.reduce((sum, a) => sum + a.total_classes, 0);
  const attendedClassesSum = attendance.reduce((sum, a) => sum + a.attended_classes, 0);
  const avgAttendance = totalClassesSum > 0 
    ? Math.round((attendedClassesSum / totalClassesSum) * 100 * 10) / 10 
    : 100;
  
  const shortageSubjects = attendance.filter(a => a.attendance_percentage < 75);

  const marksPercentages = marks.map(m => m.percentage);
  const avgMarks = marksPercentages.length > 0
    ? Math.round((marksPercentages.reduce((a, b) => a + b, 0) / marksPercentages.length) * 10) / 10
    : 0;
  const highestMarks = marksPercentages.length > 0 ? Math.max(...marksPercentages) : 0;
  const topSubject = marks.find(m => m.percentage === highestMarks)?.subject || 'Python Core';

  // Unified Dashboard JSON Structure (matching GET /api/academic-dashboard/{student_id})
  const unifiedPayload = {
    student_id: studentId,
    assignments: {
      total: assignments.length,
      pending: pendingCount,
      completed: completedCount,
      in_progress: inProgressCount,
      upcoming_due: assignments.filter(a => a.status !== 'Completed').slice(0, 3)
    },
    attendance: {
      average_percentage: avgAttendance,
      total_subjects: attendance.length,
      shortage_subjects: shortageSubjects.map(s => s.subject),
      has_shortage_alert: shortageSubjects.length > 0
    },
    marks: {
      average_percentage: avgMarks,
      highest_percentage: highestMarks,
      total_subjects: marks.length,
      recent_marks: marks.slice(0, 3)
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Unified API Info */}
      <div className="bg-[#1A1D23] text-slate-300 rounded-xl p-6 shadow-xl border border-[#2D3139]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Unified Academic Gateway • Single Round-Trip
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Student Academic Dashboard
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Consolidates Assignment deadlines, Attendance threshold monitoring (75%), and Marks performance analytics in one HTTP call via <code className="bg-[#111419] px-2 py-0.5 rounded text-indigo-300 border border-[#2D3139]">GET /api/academic-dashboard/{studentId}</code>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="toggle-raw-json-btn"
              onClick={() => setShowRawJson(!showRawJson)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-sm"
            >
              <Code className="w-3.5 h-3.5" />
              {showRawJson ? 'Hide Raw API JSON' : 'Inspect API JSON Response'}
            </button>
          </div>
        </div>

        {/* Expandable Raw JSON View */}
        {showRawJson && (
          <div className="mt-4 pt-4 border-t border-[#2D3139] text-xs font-mono">
            <div className="text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Response: 200 OK • Content-Type: application/json</span>
              <span className="text-indigo-400">Endpoint: /api/academic-dashboard/{studentId}</span>
            </div>
            <pre className="bg-[#0F1115] p-3 rounded-lg overflow-x-auto text-emerald-400 border border-[#2D3139] text-[11px] max-h-60">
              {JSON.stringify(unifiedPayload, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* KPI Cards (Matches Sophisticated Dark theme exactly) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Module 1: Assignment Card */}
        <div className="bg-[#1A1D23] p-5 rounded-xl border border-[#2D3139] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Assignments</p>
              <span className="text-[10px] uppercase font-mono text-slate-500">Module 1</span>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-light text-white">{assignments.length}</h2>
              <span className="text-emerald-400 text-xs font-semibold">+{pendingCount} pending</span>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#2D3139] text-center">
              <div className="bg-[#111419] rounded-lg p-2 border border-[#2D3139]">
                <div className="text-xs font-bold text-amber-400">{pendingCount}</div>
                <div className="text-[10px] text-slate-500">Pending</div>
              </div>
              <div className="bg-[#111419] rounded-lg p-2 border border-[#2D3139]">
                <div className="text-xs font-bold text-indigo-400">{inProgressCount}</div>
                <div className="text-[10px] text-slate-500">In Progress</div>
              </div>
              <div className="bg-[#111419] rounded-lg p-2 border border-[#2D3139]">
                <div className="text-xs font-bold text-emerald-400">{completedCount}</div>
                <div className="text-[10px] text-slate-500">Completed</div>
              </div>
            </div>
          </div>

          <button
            id="manage-assignments-nav-btn"
            onClick={() => onNavigateTab('assignments')}
            className="mt-4 flex items-center justify-between text-xs font-semibold text-indigo-400 hover:text-indigo-300 pt-2 border-t border-[#2D3139]"
          >
            <span>Open Assignment CRUD</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Module 2: Attendance Card */}
        <div className="bg-[#1A1D23] p-5 rounded-xl border border-[#2D3139] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Attendance Avg</p>
              <span className="text-[10px] uppercase font-mono text-slate-500">Module 2</span>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-light text-white">{avgAttendance}%</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                avgAttendance >= 75 
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                  : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
              }`}>
                {avgAttendance >= 75 ? 'Safe (≥75%)' : 'Shortage'}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-[#2D3139] space-y-1.5">
              {shortageSubjects.length > 0 ? (
                <div className="flex items-center gap-2 p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>
                    Shortage in: <strong>{shortageSubjects.map(s => s.subject).join(', ')}</strong>
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>All subjects meet the minimum 75% requirement.</span>
                </div>
              )}
            </div>
          </div>

          <button
            id="manage-attendance-nav-btn"
            onClick={() => onNavigateTab('attendance')}
            className="mt-4 flex items-center justify-between text-xs font-semibold text-indigo-400 hover:text-indigo-300 pt-2 border-t border-[#2D3139]"
          >
            <span>Run Prediction Calculator</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Module 3: Marks & Analytics Card */}
        <div className="bg-[#1A1D23] p-5 rounded-xl border border-[#2D3139] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Top Grade</p>
              <span className="text-[10px] uppercase font-mono text-slate-500">Module 3</span>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-light text-white">{highestMarks}%</h2>
              <span className="text-slate-400 text-xs">{topSubject}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#2D3139] text-center">
              <div className="bg-[#111419] rounded-lg p-2 border border-[#2D3139]">
                <div className="text-xs font-bold text-white">
                  {marks.filter(m => m.grade === 'A+' || m.grade === 'A').length}
                </div>
                <div className="text-[10px] text-slate-500">A / A+ Courses</div>
              </div>
              <div className="bg-[#111419] rounded-lg p-2 border border-[#2D3139]">
                <div className="text-xs font-bold text-white">{avgMarks}%</div>
                <div className="text-[10px] text-slate-500">Overall Average</div>
              </div>
            </div>
          </div>

          <button
            id="manage-marks-nav-btn"
            onClick={() => onNavigateTab('marks')}
            className="mt-4 flex items-center justify-between text-xs font-semibold text-indigo-400 hover:text-indigo-300 pt-2 border-t border-[#2D3139]"
          >
            <span>View Marks Analytics</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Two Column Section: Active Endpoint Inspector & Subject Attendance Status */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Active Endpoint Code Block (Matching Design HTML) */}
        <div className="lg:col-span-3 bg-[#111419] rounded-xl border border-[#2D3139] flex flex-col shadow-inner">
          <div className="px-5 py-3 border-b border-[#2D3139] flex items-center justify-between">
            <h4 className="text-sm font-medium text-slate-300">
              Active Endpoint: <span className="text-indigo-400 font-mono">/api/marks/analytics</span>
            </h4>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-rose-500/40"></div>
              <div className="w-2 h-2 rounded-full bg-amber-500/40"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-500/40"></div>
            </div>
          </div>

          <div className="flex-1 p-6 font-mono text-xs leading-relaxed overflow-hidden">
            <div className="mb-4 flex items-center gap-4 text-xs">
              <span className="text-emerald-400 font-bold">GET</span>
              <span className="text-slate-400">200 OK • 38ms</span>
              <span className="text-slate-500">Python 3.11 / FastAPI</span>
            </div>

            <pre className="text-indigo-300 bg-[#0F1115] p-3 rounded-lg border border-[#2D3139] overflow-x-auto text-[11px]">
{`{
  "average_percentage": ${avgMarks},
  "highest_marks": ${highestMarks},
  "total_subjects": ${marks.length},
  "grade_distribution": {
    "A+": ${marks.filter(m => m.grade === 'A+').length},
    "A": ${marks.filter(m => m.grade === 'A').length},
    "B": ${marks.filter(m => m.grade === 'B').length}
  },
  "status": "${avgMarks >= 75 ? 'Distinction' : 'First Class'}"
}`}
            </pre>

            <div className="mt-6 pt-4 border-t border-[#2D3139]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400 text-xs">Logic: MarksService.calculate_grade()</span>
                <span className="text-indigo-400 text-[10px] font-mono">PY-8892</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.min(100, avgMarks)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Academic Architecture Flow (Matching Design HTML) */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="flex-1 bg-[#1A1D23] rounded-xl border border-[#2D3139] p-5">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-4">
              Academic Architecture Flow
            </h4>
            <div className="relative flex flex-col items-center gap-2 text-xs font-mono">
              <div className="w-full py-2 bg-slate-800/80 rounded text-center text-slate-200 border border-slate-700">
                React Frontend Client
              </div>
              <div className="h-3 w-px bg-slate-700"></div>
              <div className="w-full py-2 bg-indigo-600/20 rounded text-center border border-indigo-500/50 text-indigo-300 font-semibold">
                FastAPI Gateway (:8000)
              </div>
              <div className="h-3 w-px bg-slate-700"></div>
              <div className="w-full py-2 bg-indigo-600/20 rounded text-center border border-indigo-500/50 text-indigo-300 font-semibold">
                Pydantic Validation & Services
              </div>
              <div className="h-3 w-px bg-slate-700"></div>
              <div className="w-full py-2 bg-emerald-500/10 rounded text-center border border-emerald-500/30 text-emerald-400 font-semibold">
                MongoDB Atlas Collections
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-xl p-5 flex flex-col justify-between shadow-lg shadow-indigo-950/50">
            <span className="text-indigo-100/70 text-[10px] uppercase tracking-widest font-bold">
              Production Architecture
            </span>
            <h3 className="text-white text-base font-semibold leading-tight mt-1 mb-2">
              Ready for Windows Local Run & Cloud Deployment to Render
            </h3>
            <div className="flex justify-end">
              <button
                onClick={() => onNavigateTab('deployment')}
                className="bg-white text-indigo-900 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors shadow-sm"
              >
                VIEW DEPLOYMENT GUIDE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
