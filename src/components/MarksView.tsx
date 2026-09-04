import React, { useState } from 'react';
import { 
  Award, 
  TrendingUp, 
  Plus, 
  Trash2, 
  BarChart2, 
  PieChart as PieIcon, 
  CheckCircle2, 
  AlertCircle,
  Calculator
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';
import { MarksRecord, MarksAnalytics } from '../types';

interface MarksViewProps {
  studentId: string;
  marks: MarksRecord[];
  onAddMarks: (record: Omit<MarksRecord, 'id' | 'percentage' | 'grade' | 'total_marks'>) => void;
  onDeleteMarks: (id: string) => void;
}

export const MarksView: React.FC<MarksViewProps> = ({
  studentId,
  marks,
  onAddMarks,
  onDeleteMarks
}) => {
  // Form State
  const [subject, setSubject] = useState('Operating Systems');
  const [internalMarks, setInternalMarks] = useState(24);
  const [externalMarks, setExternalMarks] = useState(65);
  const [formError, setFormError] = useState('');

  // Python grading logic simulation matching backend MarksService
  const computeGrade = (pct: number) => {
    if (pct >= 90) return 'A+';
    if (pct >= 80) return 'A';
    if (pct >= 70) return 'B';
    if (pct >= 60) return 'C';
    if (pct >= 50) return 'D';
    return 'F';
  };

  const previewTotal = Number(internalMarks) + Number(externalMarks);
  const previewPct = Math.round((previewTotal / 100) * 100 * 10) / 10;
  const previewGrade = computeGrade(previewPct);

  // Compute Analytics
  const marksPercentages = marks.map(m => m.percentage);
  const avgMarks = marksPercentages.length > 0
    ? Math.round((marksPercentages.reduce((a, b) => a + b, 0) / marksPercentages.length) * 10) / 10
    : 0;
  const highestMarks = marksPercentages.length > 0 ? Math.max(...marksPercentages) : 0;
  const lowestMarks = marksPercentages.length > 0 ? Math.min(...marksPercentages) : 0;

  // Grade breakdown
  const gradeCounts: Record<string, number> = { 'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 };
  marks.forEach(m => {
    gradeCounts[m.grade] = (gradeCounts[m.grade] || 0) + 1;
  });

  const chartData = marks.map(m => ({
    subject: m.subject,
    marks: m.total_marks,
    internal: m.internal_marks,
    external: m.external_marks,
    percentage: m.percentage
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      setFormError('Subject name is required.');
      return;
    }
    if (internalMarks < 0 || internalMarks > 30) {
      setFormError('Internal marks must be between 0 and 30.');
      return;
    }
    if (externalMarks < 0 || externalMarks > 70) {
      setFormError('External marks must be between 0 and 70.');
      return;
    }

    setFormError('');
    onAddMarks({
      student_id: studentId,
      subject,
      internal_marks: Number(internalMarks),
      external_marks: Number(externalMarks)
    });
  };

  return (
    <div className="space-y-6">
      {/* Module Explainer Banner */}
      <div className="bg-[#1A1D23] border border-[#2D3139] rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-amber-500/10 border border-amber-500/20 text-amber-400">
                Module 3
              </span>
              <h2 className="text-base font-bold text-white">Marks Management & Performance Analytics</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Backend handles business validation (Internal ≤ 30, External ≤ 70), derives total marks out of 100, assigns letter grades, and aggregates performance analytics via <code className="text-indigo-400 bg-[#111419] px-1 py-0.5 rounded border border-[#2D3139]">GET /api/marks/{studentId}/analytics</code>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono bg-[#111419] px-3 py-1.5 rounded-lg border border-[#2D3139]">
              Scale: 30 Internal + 70 External = 100 Total
            </span>
          </div>
        </div>
      </div>

      {/* Analytics KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1A1D23] p-5 rounded-xl border border-[#2D3139] shadow-sm">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Average Percentage</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-light text-white">{avgMarks}%</h3>
            <span className="text-emerald-400 text-xs font-semibold">
              {avgMarks >= 75 ? 'Distinction' : avgMarks >= 60 ? 'First Class' : 'Pass'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Calculated over {marks.length} registered subjects</p>
        </div>

        <div className="bg-[#1A1D23] p-5 rounded-xl border border-[#2D3139] shadow-sm">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Peak Score</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-light text-white">{highestMarks}%</h3>
            <span className="text-indigo-400 text-xs font-semibold">Highest</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Top scoring subject</p>
        </div>

        <div className="bg-[#1A1D23] p-5 rounded-xl border border-[#2D3139] shadow-sm">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Lowest Score</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-light text-white">{lowestMarks}%</h3>
            <span className="text-amber-400 text-xs font-semibold">Needs Focus</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Minimum subject percentage</p>
        </div>

        <div className="bg-[#1A1D23] p-5 rounded-xl border border-[#2D3139] shadow-sm">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Grade Distribution</p>
          <div className="flex items-center gap-1.5 mt-2">
            {Object.entries(gradeCounts).filter(([_, count]) => count > 0).map(([grade, count]) => (
              <span key={grade} className="px-2 py-0.5 text-xs font-bold rounded bg-[#111419] border border-[#2D3139] text-indigo-300">
                {grade}: {count}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">{marks.filter(m => m.grade === 'A+' || m.grade === 'A').length} courses with grade A/A+</p>
        </div>
      </div>

      {/* Main Grid: Visual Subject Performance Chart & Subject Marks Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Bar Chart */}
        <div className="lg:col-span-2 bg-[#111419] rounded-xl border border-[#2D3139] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">Subject-wise Marks Breakdown (Internal vs External)</h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">Max: 100</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3139" vertical={false} />
                <XAxis 
                  dataKey="subject" 
                  stroke="#64748B" 
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis 
                  domain={[0, 100]} 
                  stroke="#64748B" 
                  fontSize={11}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1D23', borderColor: '#2D3139', color: '#D1D5DB', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="internal" fill="#4F46E5" name="Internal (Max 30)" radius={[0, 0, 0, 0]} stackId="a" />
                <Bar dataKey="external" fill="#06B6D4" name="External (Max 70)" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 mt-2 pt-3 border-t border-[#2D3139] text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-600 rounded"></div>
              <span>Internal Marks (Max 30)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-500 rounded"></div>
              <span>External Marks (Max 70)</span>
            </div>
          </div>
        </div>

        {/* Input Form: Add or Update Marks */}
        <div className="bg-[#1A1D23] rounded-xl border border-[#2D3139] p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">Record Subject Marks</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Enter marks to simulate backend Pydantic validation and grade assignment.
            </p>

            {formError && (
              <div className="mb-4 p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Subject Name</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Cloud Computing"
                  className="w-full text-xs bg-[#111419] border border-[#2D3139] rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Internal (0-30)</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={internalMarks}
                    onChange={(e) => setInternalMarks(Number(e.target.value))}
                    className="w-full text-xs bg-[#111419] border border-[#2D3139] rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">External (0-70)</label>
                  <input
                    type="number"
                    min="0"
                    max="70"
                    value={externalMarks}
                    onChange={(e) => setExternalMarks(Number(e.target.value))}
                    className="w-full text-xs bg-[#111419] border border-[#2D3139] rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Dynamic Live Calculation Preview */}
              <div className="bg-[#111419] p-3 rounded-lg border border-[#2D3139] space-y-1 text-xs">
                <div className="text-slate-500 text-[10px] font-mono">// Live Backend Derivation:</div>
                <div className="flex justify-between text-slate-300">
                  <span>Computed Total:</span>
                  <span className="font-bold text-white">{previewTotal} / 100</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Percentage:</span>
                  <span className="font-bold text-indigo-400">{previewPct}%</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Calculated Grade:</span>
                  <span className={`font-bold px-1.5 py-0.2 rounded text-[11px] ${
                    previewGrade === 'A+' ? 'bg-emerald-500/20 text-emerald-400' :
                    previewGrade === 'A' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {previewGrade}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors mt-2"
              >
                Save Marks Record
              </button>
            </form>
          </div>

          <div className="mt-4 pt-3 border-t border-[#2D3139] text-[11px] text-slate-500">
            Validated by <code className="text-indigo-400">MarksCreate</code> Pydantic schema
          </div>
        </div>
      </div>

      {/* Marks List Table */}
      <div className="bg-[#1A1D23] border border-[#2D3139] rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-[#2D3139] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Registered Subject Grade Sheet</h3>
          <span className="text-xs text-slate-400">Showing {marks.length} subjects</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#111419] text-slate-400 uppercase text-[10px] tracking-wider border-b border-[#2D3139]">
              <tr>
                <th className="px-5 py-3 font-semibold">Subject</th>
                <th className="px-5 py-3 font-semibold">Internal (30)</th>
                <th className="px-5 py-3 font-semibold">External (70)</th>
                <th className="px-5 py-3 font-semibold">Total (100)</th>
                <th className="px-5 py-3 font-semibold">Percentage</th>
                <th className="px-5 py-3 font-semibold">Grade</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D3139]">
              {marks.map((record) => (
                <tr key={record.id || record.subject} className="hover:bg-[#111419]/60 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-white">{record.subject}</td>
                  <td className="px-5 py-3.5 text-slate-300">{record.internal_marks} / 30</td>
                  <td className="px-5 py-3.5 text-slate-300">{record.external_marks} / 70</td>
                  <td className="px-5 py-3.5 font-semibold text-white">{record.total_marks} / 100</td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono font-bold text-indigo-400">{record.percentage}%</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      record.grade === 'A+' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' :
                      record.grade === 'A' ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400' :
                      record.grade === 'B' ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400' :
                      'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                    }`}>
                      {record.grade}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {record.id && (
                      <button
                        onClick={() => onDeleteMarks(record.id!)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1 rounded hover:bg-[#111419]"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
