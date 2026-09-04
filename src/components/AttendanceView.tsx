import React, { useState } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Calculator, 
  Plus, 
  Info
} from 'lucide-react';
import { AttendanceRecord } from '../types';

interface AttendanceViewProps {
  studentId: string;
  attendance: AttendanceRecord[];
  onUpdateAttendance: (record: Omit<AttendanceRecord, 'id' | 'attendance_percentage' | 'status'>) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  studentId,
  attendance,
  onUpdateAttendance
}) => {
  // Form State
  const [subject, setSubject] = useState('Operating Systems');
  const [totalClasses, setTotalClasses] = useState(40);
  const [attendedClasses, setAttendedClasses] = useState(26);
  const [formError, setFormError] = useState('');

  // Standalone Interactive Prediction Sandbox State
  const [simTotal, setSimTotal] = useState(40);
  const [simAttended, setSimAttended] = useState(28);
  const [targetPct, setTargetPct] = useState(75);

  // Prediction formula calculator:
  // (Attended + x) / (Total + x) >= P / 100
  // x = ceil((P*T - 100*A) / (100 - P))
  const calculatePrediction = (att: number, tot: number, target: number) => {
    if (tot <= 0) return { currentPct: 100, needed: 0, isSafe: true };
    const currentPct = Math.round((att / tot) * 100 * 10) / 10;
    if (currentPct >= target) {
      return { currentPct, needed: 0, isSafe: true };
    }
    const num = (target * tot) - (100 * att);
    const den = 100 - target;
    const needed = Math.max(0, Math.ceil(num / den));
    return { currentPct, needed, isSafe: false };
  };

  const simResult = calculatePrediction(simAttended, simTotal, targetPct);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      setFormError('Subject name is required.');
      return;
    }
    if (totalClasses < 0 || attendedClasses < 0) {
      setFormError('Class counts cannot be negative.');
      return;
    }
    if (attendedClasses > totalClasses) {
      setFormError(`Attended classes (${attendedClasses}) cannot exceed total classes (${totalClasses}).`);
      return;
    }

    setFormError('');
    onUpdateAttendance({
      student_id: studentId,
      subject,
      total_classes: Number(totalClasses),
      attended_classes: Number(attendedClasses)
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Explainer Banner */}
      <div className="bg-[#1A1D23] border border-[#2D3139] rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            Module 2
          </span>
          <h2 className="text-base font-bold text-white">Attendance Management & Mathematical Recovery Prediction</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Frontend submits raw counts (<code className="text-indigo-400 bg-[#111419] px-1 py-0.5 rounded border border-[#2D3139]">student_id</code>, <code className="text-indigo-400 bg-[#111419] px-1 py-0.5 rounded border border-[#2D3139]">subject</code>, <code className="text-indigo-400 bg-[#111419] px-1 py-0.5 rounded border border-[#2D3139]">total_classes</code>, <code className="text-indigo-400 bg-[#111419] px-1 py-0.5 rounded border border-[#2D3139]">attended_classes</code>). The Python backend automatically derives the percentage, enforces the 75% shortage threshold, and calculates attendance recovery targets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Subject Attendance Cards & Entry Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Attendance Table / Cards */}
          <div className="bg-[#1A1D23] border border-[#2D3139] rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
              <span>Current Subject Attendance Records</span>
              <span className="text-xs font-normal text-slate-400">
                Minimum Required: <strong className="text-white">75%</strong>
              </span>
            </h3>

            <div className="space-y-3">
              {attendance.map((record) => {
                const pred = calculatePrediction(record.attended_classes, record.total_classes, 75);
                const isShortage = record.attendance_percentage < 75;

                return (
                  <div
                    key={record.subject}
                    className={`p-4 rounded-xl border transition-all ${
                      isShortage 
                        ? 'border-rose-500/30 bg-[#1A1518]' 
                        : 'border-[#2D3139] bg-[#111419]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{record.subject}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isShortage ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                        }`}>
                          {isShortage ? 'Shortage Warning (<75%)' : 'Safe Attendance'}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-xs text-slate-400">
                          {record.attended_classes} of {record.total_classes} attended
                        </span>
                        <span className={`text-base font-black ${isShortage ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {record.attendance_percentage}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#0F1115] rounded-full h-2 overflow-hidden mb-3 border border-[#2D3139]">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isShortage ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, record.attendance_percentage)}%` }}
                      />
                    </div>

                    {/* Prediction Advice Box */}
                    <div className={`text-xs p-2.5 rounded-lg flex items-start gap-2 ${
                      isShortage ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' : 'bg-[#1A1D23] text-slate-300 border border-[#2D3139]'
                    }`}>
                      {isShortage ? (
                        <>
                          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          <div>
                            <strong>Recovery Prediction:</strong> Must attend next{' '}
                            <span className="font-bold text-rose-400 underline underline-offset-2">
                              {pred.needed} consecutive classes
                            </span>{' '}
                            without missing any class to reach 75%.
                          </div>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>
                            Attendance is in good standing. You can miss up to{' '}
                            {Math.floor((record.attended_classes - 0.75 * record.total_classes) / 0.75)}{' '}
                            class(es) and still remain above 75%.
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Record / Update Attendance Form */}
          <div className="bg-[#1A1D23] border border-[#2D3139] rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-400" />
              <span>Record or Update Subject Attendance (POST /api/attendance)</span>
            </h3>

            {formError && (
              <div className="mb-4 p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. DBMS"
                  className="w-full text-xs bg-[#111419] border border-[#2D3139] rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Total Classes</label>
                <input
                  type="number"
                  min={0}
                  value={totalClasses}
                  onChange={(e) => setTotalClasses(Number(e.target.value))}
                  className="w-full text-xs bg-[#111419] border border-[#2D3139] rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Attended Classes</label>
                <input
                  type="number"
                  min={0}
                  max={totalClasses}
                  value={attendedClasses}
                  onChange={(e) => setAttendedClasses(Number(e.target.value))}
                  className="w-full text-xs bg-[#111419] border border-[#2D3139] rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                Save Attendance
              </button>
            </form>
          </div>
        </div>

        {/* Right Col: Mathematical Prediction Sandbox & Viva Theory */}
        <div className="space-y-6">
          {/* Prediction Formula Sandbox */}
          <div className="bg-[#1A1D23] text-white rounded-xl p-5 shadow-sm border border-[#2D3139]">
            <div className="flex items-center gap-2 mb-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Calculator className="w-4 h-4" />
              API: GET /api/attendance/{studentId}/prediction
            </div>
            <h3 className="text-sm font-bold text-white mb-3">
              Attendance Recovery Prediction Formula
            </h3>

            <div className="bg-[#111419] p-3 rounded-lg border border-[#2D3139] text-[11px] font-mono text-indigo-300 mb-4 space-y-1">
              <div className="text-slate-500">// Mathematical Derivation:</div>
              <div>(Attended + x) / (Total + x) ≥ 0.75</div>
              <div>x ≥ (0.75·T - A) / 0.25</div>
              <div className="text-emerald-400 font-bold">x = ⌈3·Total - 4·Attended⌉</div>
            </div>

            {/* Interactive Sliders */}
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Total Classes (T):</span>
                  <span className="font-bold text-white">{simTotal}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={simTotal}
                  onChange={(e) => {
                    const newTot = Number(e.target.value);
                    setSimTotal(newTot);
                    if (simAttended > newTot) setSimAttended(newTot);
                  }}
                  className="w-full accent-indigo-500 h-1.5 bg-[#111419] rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Attended Classes (A):</span>
                  <span className="font-bold text-white">{simAttended}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={simTotal}
                  value={simAttended}
                  onChange={(e) => setSimAttended(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-[#111419] rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Target Threshold (P%):</span>
                  <span className="font-bold text-white">{targetPct}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={targetPct}
                  onChange={(e) => setTargetPct(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-[#111419] rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Prediction Result Display */}
            <div className="mt-5 p-3 rounded-lg bg-[#111419] border border-[#2D3139] text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-400">Current Percentage:</span>
                <span className={`font-bold ${simResult.currentPct >= targetPct ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {simResult.currentPct}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Classes Needed (x):</span>
                <span className="text-lg font-black text-amber-300">
                  {simResult.needed} classes
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 border-t border-[#2D3139] pt-2">
                {simResult.needed === 0 
                  ? 'Current attendance meets or exceeds your requirement.' 
                  : `Attend the next ${simResult.needed} classes consecutively without absence to achieve ${targetPct}%.`}
              </p>
            </div>
          </div>

          {/* Quick Viva Note Card */}
          <div className="bg-[#111419] border border-[#2D3139] rounded-xl p-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 font-bold text-indigo-400 mb-1">
              <Info className="w-4 h-4 text-indigo-400" />
              <span>Examiner Q&A Tip</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              If asked: <em>"Why calculate attendance in the backend?"</em> Answer: To ensure data integrity, prevent client-side tampering with graduation requirements, and allow automated shortage notifications to be dispatched.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
