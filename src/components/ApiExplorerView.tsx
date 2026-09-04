import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  Copy, 
  Check, 
  Code, 
  Globe, 
  Clock, 
  Send,
  Layers,
  Sparkles
} from 'lucide-react';
import { Assignment, AttendanceRecord, MarksRecord } from '../types';

interface ApiExplorerViewProps {
  studentId: string;
  assignments: Assignment[];
  attendance: AttendanceRecord[];
  marks: MarksRecord[];
  onAddAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  onUpdateAttendance: (record: Omit<AttendanceRecord, 'id' | 'attendance_percentage' | 'status'>) => void;
  onAddMarks: (record: Omit<MarksRecord, 'id' | 'percentage' | 'grade' | 'total_marks'>) => void;
}

interface EndpointDef {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  module: 'Dashboard' | 'Assignment' | 'Attendance' | 'Marks' | 'System';
  summary: string;
  description: string;
  defaultBody?: any;
  defaultQueryParams?: Record<string, string>;
}

export const ApiExplorerView: React.FC<ApiExplorerViewProps> = ({
  studentId,
  assignments,
  attendance,
  marks,
  onAddAssignment,
  onUpdateAttendance,
  onAddMarks
}) => {
  const endpoints: EndpointDef[] = [
    {
      id: 'dashboard_unified',
      method: 'GET',
      path: `/api/academic-dashboard/${studentId}`,
      module: 'Dashboard',
      summary: 'Fetch Consolidated Academic Dashboard (Single Round-Trip)',
      description: 'Aggregates assignments, attendance status (with 75% shortage alert), and marks performance statistics into a single structured response.'
    },
    {
      id: 'assignment_list',
      method: 'GET',
      path: `/api/assignments/${studentId}`,
      module: 'Assignment',
      summary: 'Get Student Assignments (Filterable)',
      description: 'Returns list of assignments with status, priority, due date, sorted by deadline.'
    },
    {
      id: 'assignment_create',
      method: 'POST',
      path: '/api/assignments',
      module: 'Assignment',
      summary: 'Create New Assignment',
      description: 'Inserts assignment with Pydantic validation for title, subject, priority, and ISO date.',
      defaultBody: {
        student_id: studentId,
        subject: 'Database Systems',
        title: 'Normalize 3NF and BCNF schemas',
        description: 'Complete relation decomposition exercises from chapter 7',
        priority: 'High',
        due_date: '2026-09-20',
        status: 'Pending'
      }
    },
    {
      id: 'attendance_get',
      method: 'GET',
      path: `/api/attendance/${studentId}`,
      module: 'Attendance',
      summary: 'Get Subject Attendance Records',
      description: 'Returns all registered subjects with attended, total, calculated percentage, and shortage flag.'
    },
    {
      id: 'attendance_predict',
      method: 'GET',
      path: `/api/attendance/${studentId}/prediction`,
      module: 'Attendance',
      summary: 'Attendance 75% Recovery Prediction',
      description: 'Calculates the mathematical number of consecutive classes required to reach or maintain 75% attendance.',
      defaultQueryParams: { target_percentage: '75' }
    },
    {
      id: 'attendance_record',
      method: 'POST',
      path: '/api/attendance',
      module: 'Attendance',
      summary: 'Record or Update Attendance',
      description: 'Accepts raw attendance counts and computes percentage and status automatically.',
      defaultBody: {
        student_id: studentId,
        subject: 'Cloud Computing',
        total_classes: 35,
        attended_classes: 24
      }
    },
    {
      id: 'marks_analytics',
      method: 'GET',
      path: `/api/marks/${studentId}/analytics`,
      module: 'Marks',
      summary: 'Marks Performance Analytics & Distribution',
      description: 'Computes overall average percentage, highest/lowest marks, and grade distribution across registered subjects.'
    },
    {
      id: 'marks_create',
      method: 'POST',
      path: '/api/marks',
      module: 'Marks',
      summary: 'Record Subject Marks',
      description: 'Validates internal (0-30) and external (0-70) marks, calculates total and letter grade.',
      defaultBody: {
        student_id: studentId,
        subject: 'Data Structures',
        internal_marks: 27,
        external_marks: 61
      }
    },
    {
      id: 'system_health',
      method: 'GET',
      path: '/health',
      module: 'System',
      summary: 'Backend Health Check',
      description: 'Returns server status, uptime, and database connection status.'
    }
  ];

  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDef>(endpoints[0]);
  const [requestBody, setRequestBody] = useState<string>(
    endpoints[0].defaultBody ? JSON.stringify(endpoints[0].defaultBody, null, 2) : ''
  );
  const [activeFilterModule, setActiveFilterModule] = useState<string>('All');
  
  // Execution Simulation State
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<{
    status: number;
    statusText: string;
    durationMs: number;
    headers: Record<string, string>;
    data: any;
  } | null>(null);

  const [copiedCurl, setCopiedCurl] = useState(false);

  const handleSelectEndpoint = (ep: EndpointDef) => {
    setSelectedEndpoint(ep);
    setRequestBody(ep.defaultBody ? JSON.stringify(ep.defaultBody, null, 2) : '');
    setExecutionResult(null);
  };

  const handleExecute = () => {
    setIsExecuting(true);
    setExecutionResult(null);

    setTimeout(() => {
      let responsePayload: any = {};
      let status = 200;
      let statusText = 'OK';

      // Live payload generation based on current student data in memory
      switch (selectedEndpoint.id) {
        case 'dashboard_unified': {
          const totalAttClasses = attendance.reduce((s, a) => s + a.total_classes, 0);
          const totalAttended = attendance.reduce((s, a) => s + a.attended_classes, 0);
          const avgAtt = totalAttClasses > 0 ? Math.round((totalAttended / totalAttClasses) * 100 * 10) / 10 : 100;
          const shortages = attendance.filter(a => a.attendance_percentage < 75);
          const pcts = marks.map(m => m.percentage);
          const avgM = pcts.length > 0 ? Math.round((pcts.reduce((a, b) => a + b, 0) / pcts.length) * 10) / 10 : 0;

          responsePayload = {
            status: "success",
            timestamp: new Date().toISOString(),
            student_id: studentId,
            assignments: {
              total: assignments.length,
              pending: assignments.filter(a => a.status === 'Pending').length,
              completed: assignments.filter(a => a.status === 'Completed').length,
              in_progress: assignments.filter(a => a.status === 'In Progress').length,
              upcoming_due: assignments.filter(a => a.status !== 'Completed').slice(0, 3)
            },
            attendance: {
              average_percentage: avgAtt,
              total_subjects: attendance.length,
              shortage_subjects: shortages.map(s => s.subject),
              has_shortage_alert: shortages.length > 0
            },
            marks: {
              average_percentage: avgM,
              highest_percentage: pcts.length > 0 ? Math.max(...pcts) : 0,
              total_subjects: marks.length,
              recent_marks: marks.slice(0, 3)
            }
          };
          break;
        }

        case 'assignment_list':
          responsePayload = {
            student_id: studentId,
            count: assignments.length,
            assignments
          };
          break;

        case 'assignment_create': {
          status = 201;
          statusText = 'Created';
          try {
            const parsed = JSON.parse(requestBody);
            onAddAssignment({
              student_id: parsed.student_id || studentId,
              subject: parsed.subject || 'Sample Subject',
              title: parsed.title || 'Sample Title',
              description: parsed.description || '',
              priority: parsed.priority || 'High',
              due_date: parsed.due_date || '2026-09-30',
              status: parsed.status || 'Pending',
              created_at: new Date().toISOString()
            });
            responsePayload = {
              status: "success",
              message: "Assignment created successfully in MongoDB",
              assignment_id: `asg_${Date.now()}`,
              data: parsed
            };
          } catch (err) {
            status = 422;
            statusText = 'Unprocessable Entity';
            responsePayload = { detail: [{ loc: ["body"], msg: "Invalid JSON format", type: "value_error" }] };
          }
          break;
        }

        case 'attendance_get':
          responsePayload = {
            student_id: studentId,
            records: attendance,
            overall_attendance: attendance.length > 0
              ? Math.round((attendance.reduce((s, a) => s + a.attended_classes, 0) / attendance.reduce((s, a) => s + a.total_classes, 0)) * 100 * 10) / 10
              : 100
          };
          break;

        case 'attendance_predict': {
          const target = 75;
          const predictions = attendance.map(att => {
            const num = (target * att.total_classes) - (100 * att.attended_classes);
            const den = 100 - target;
            const needed = Math.max(0, Math.ceil(num / den));
            return {
              subject: att.subject,
              current_percentage: att.attendance_percentage,
              target_percentage: target,
              classes_needed: needed,
              status: att.attendance_percentage >= target ? 'Safe' : 'Shortage',
              message: needed === 0 
                ? 'Attendance meets requirement'
                : `Attend next ${needed} classes consecutively without absence`
            };
          });
          responsePayload = {
            student_id: studentId,
            target_percentage: target,
            predictions
          };
          break;
        }

        case 'attendance_record': {
          status = 200;
          try {
            const parsed = JSON.parse(requestBody);
            onUpdateAttendance({
              student_id: parsed.student_id || studentId,
              subject: parsed.subject || 'New Subject',
              total_classes: Number(parsed.total_classes || 30),
              attended_classes: Number(parsed.attended_classes || 25)
            });
            const pct = Math.round((parsed.attended_classes / parsed.total_classes) * 100 * 10) / 10;
            responsePayload = {
              status: "success",
              message: "Attendance recorded and percentage recalculated",
              data: {
                ...parsed,
                attendance_percentage: pct,
                status: pct >= 75 ? 'Safe' : 'Shortage Warning'
              }
            };
          } catch (err) {
            status = 422;
            statusText = 'Unprocessable Entity';
            responsePayload = { detail: [{ loc: ["body"], msg: "Invalid JSON format", type: "value_error" }] };
          }
          break;
        }

        case 'marks_analytics': {
          const pcts = marks.map(m => m.percentage);
          const avg = pcts.length > 0 ? Math.round((pcts.reduce((a, b) => a + b, 0) / pcts.length) * 10) / 10 : 0;
          const grades: Record<string, number> = {};
          marks.forEach(m => { grades[m.grade] = (grades[m.grade] || 0) + 1; });

          responsePayload = {
            student_id: studentId,
            average_percentage: avg,
            highest_percentage: pcts.length > 0 ? Math.max(...pcts) : 0,
            lowest_percentage: pcts.length > 0 ? Math.min(...pcts) : 0,
            total_subjects: marks.length,
            grade_distribution: grades,
            academic_standing: avg >= 75 ? 'Distinction' : avg >= 60 ? 'First Class' : 'Pass'
          };
          break;
        }

        case 'marks_create': {
          status = 201;
          statusText = 'Created';
          try {
            const parsed = JSON.parse(requestBody);
            onAddMarks({
              student_id: parsed.student_id || studentId,
              subject: parsed.subject || 'New Subject',
              internal_marks: Number(parsed.internal_marks || 20),
              external_marks: Number(parsed.external_marks || 50)
            });
            const tot = Number(parsed.internal_marks) + Number(parsed.external_marks);
            responsePayload = {
              status: "success",
              message: "Marks saved and grade assigned",
              data: {
                ...parsed,
                total_marks: tot,
                percentage: tot,
                grade: tot >= 90 ? 'A+' : tot >= 80 ? 'A' : tot >= 70 ? 'B' : 'C'
              }
            };
          } catch (err) {
            status = 422;
            statusText = 'Unprocessable Entity';
            responsePayload = { detail: [{ loc: ["body"], msg: "Invalid JSON", type: "value_error" }] };
          }
          break;
        }

        case 'system_health':
          responsePayload = {
            status: "healthy",
            version: "1.0.0",
            framework: "FastAPI 0.111.0",
            database: "MongoDB Atlas (motor async connected)",
            server_time: new Date().toISOString()
          };
          break;

        default:
          responsePayload = { message: "Endpoint executed" };
      }

      setExecutionResult({
        status,
        statusText,
        durationMs: Math.floor(Math.random() * 25) + 15,
        headers: {
          'content-type': 'application/json',
          'server': 'uvicorn / Python 3.11',
          'x-process-time': '0.018s'
        },
        data: responsePayload
      });
      setIsExecuting(false);
    }, 280);
  };

  const curlCommand = selectedEndpoint.method === 'GET'
    ? `curl -X GET "http://localhost:8000${selectedEndpoint.path}" \\\n  -H "Accept: application/json"`
    : `curl -X ${selectedEndpoint.method} "http://localhost:8000${selectedEndpoint.path}" \\\n  -H "Content-Type: application/json" \\\n  -d '${requestBody.replace(/\n\s*/g, ' ')}'`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const filteredEndpoints = endpoints.filter(ep => 
    activeFilterModule === 'All' || ep.module === activeFilterModule
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#1A1D23] border border-[#2D3139] rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                Interactive OpenAPI / Swagger UI
              </span>
              <span className="text-xs text-slate-500 font-mono">FastAPI :8000/docs</span>
            </div>
            <h2 className="text-base font-bold text-white">Live Academic API Sandbox</h2>
            <p className="text-xs text-slate-400 mt-1">
              Test and execute Python backend REST endpoints directly in the browser with live JSON request payloads and structured responses.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {['All', 'Dashboard', 'Assignment', 'Attendance', 'Marks'].map((mod) => (
              <button
                key={mod}
                onClick={() => setActiveFilterModule(mod)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                  activeFilterModule === mod
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[#111419] text-slate-400 hover:text-white border border-[#2D3139]'
                }`}
              >
                {mod}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Endpoint List */}
        <div className="lg:col-span-5 space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
            Available Endpoints ({filteredEndpoints.length})
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredEndpoints.map((ep) => {
              const isSelected = selectedEndpoint.id === ep.id;
              return (
                <button
                  key={ep.id}
                  onClick={() => handleSelectEndpoint(ep)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-[#1A1D23] border-indigo-500 shadow-sm'
                      : 'bg-[#111419] border-[#2D3139] hover:bg-[#1A1D23]/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        ep.method === 'GET' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        ep.method === 'POST' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                        ep.method === 'PUT' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {ep.method}
                      </span>
                      <span className="text-[11px] font-mono text-slate-300 truncate max-w-[210px]">
                        {ep.path}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500">{ep.module}</span>
                  </div>
                  <p className="text-xs font-semibold text-white leading-snug">{ep.summary}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Request & Response Inspector */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Endpoint Header Bar */}
          <div className="bg-[#1A1D23] border border-[#2D3139] rounded-xl p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                  selectedEndpoint.method === 'GET' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  selectedEndpoint.method === 'POST' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                  selectedEndpoint.method === 'PUT' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {selectedEndpoint.method}
                </span>
                <span className="text-sm font-mono font-bold text-white">
                  {selectedEndpoint.path}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCurl}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 bg-[#111419] hover:bg-slate-800 border border-[#2D3139] rounded-lg transition-colors"
                >
                  {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCurl ? 'Copied cURL' : 'Copy cURL'}</span>
                </button>

                <button
                  id="send-request-btn"
                  onClick={handleExecute}
                  disabled={isExecuting}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  {isExecuting ? (
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>{isExecuting ? 'Sending...' : 'Send Request'}</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-2">{selectedEndpoint.description}</p>
          </div>

          {/* Request Payload Editor (if POST or PUT) */}
          {(selectedEndpoint.method === 'POST' || selectedEndpoint.method === 'PUT') && (
            <div className="bg-[#111419] border border-[#2D3139] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Request Body (application/json)
                </span>
                <span className="text-[11px] text-indigo-400 font-mono">Editable JSON</span>
              </div>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                rows={6}
                className="w-full text-xs font-mono bg-[#0F1115] border border-[#2D3139] rounded-lg p-3 text-emerald-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {/* Response Inspector */}
          <div className="bg-[#111419] border border-[#2D3139] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Live Response
              </span>

              {executionResult && (
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-0.5 rounded font-mono font-bold ${
                    executionResult.status >= 200 && executionResult.status < 300
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {executionResult.status} {executionResult.statusText}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {executionResult.durationMs} ms
                  </span>
                </div>
              )}
            </div>

            {executionResult ? (
              <div className="space-y-3">
                <pre className="bg-[#0F1115] p-4 rounded-lg overflow-x-auto text-indigo-300 border border-[#2D3139] text-xs font-mono max-h-80">
                  {JSON.stringify(executionResult.data, null, 2)}
                </pre>

                {/* Headers breakdown */}
                <div className="text-[11px] text-slate-500 font-mono flex items-center gap-4">
                  <span>server: {executionResult.headers.server}</span>
                  <span>time: {executionResult.headers['x-process-time']}</span>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs">
                <Code className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p>Click <strong className="text-slate-400">"Send Request"</strong> to execute this endpoint and inspect the live response.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
