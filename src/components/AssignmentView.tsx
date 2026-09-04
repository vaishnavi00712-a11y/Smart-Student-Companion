import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  AlertCircle
} from 'lucide-react';
import { Assignment } from '../types';

interface AssignmentViewProps {
  studentId: string;
  assignments: Assignment[];
  onAddAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  onUpdateAssignment: (id: string, updates: Partial<Assignment>) => void;
  onDeleteAssignment: (id: string) => void;
}

export const AssignmentView: React.FC<AssignmentViewProps> = ({
  studentId,
  assignments,
  onAddAssignment,
  onUpdateAssignment,
  onDeleteAssignment
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [dueDate, setDueDate] = useState('2026-09-15');
  const [status, setStatus] = useState<'Pending' | 'In Progress' | 'Completed'>('Pending');
  const [formError, setFormError] = useState('');

  // Filter State
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterSubject, setFilterSubject] = useState<string>('');

  const handleOpenAdd = () => {
    setEditingId(null);
    setSubject('Python');
    setTitle('');
    setDescription('');
    setPriority('High');
    setDueDate('2026-09-15');
    setStatus('Pending');
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEdit = (assignment: Assignment) => {
    setEditingId(assignment.id);
    setSubject(assignment.subject);
    setTitle(assignment.title);
    setDescription(assignment.description);
    setPriority(assignment.priority);
    setDueDate(assignment.due_date);
    setStatus(assignment.status);
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Assignment title is required.');
      return;
    }
    if (!subject.trim()) {
      setFormError('Subject name is required.');
      return;
    }
    if (!dueDate) {
      setFormError('Due date is required in YYYY-MM-DD format.');
      return;
    }

    if (editingId) {
      onUpdateAssignment(editingId, {
        subject,
        title,
        description,
        priority,
        due_date: dueDate,
        status
      });
    } else {
      onAddAssignment({
        student_id: studentId,
        subject,
        title,
        description,
        priority,
        due_date: dueDate,
        status,
        created_at: new Date().toISOString()
      });
    }

    setShowModal(false);
  };

  // Filter logic
  const filteredAssignments = assignments.filter(a => {
    if (filterStatus !== 'All' && a.status !== filterStatus) return false;
    if (filterPriority !== 'All' && a.priority !== filterPriority) return false;
    if (filterSubject.trim() && !a.subject.toLowerCase().includes(filterSubject.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Module Explainer Banner */}
      <div className="bg-[#1A1D23] border border-[#2D3139] rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                Module 1
              </span>
              <h2 className="text-base font-bold text-white">Assignment Management (CRUD APIs)</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Full REST lifecycle: <code className="text-indigo-400 bg-[#111419] px-1 py-0.5 rounded border border-[#2D3139]">POST /api/assignments</code>, <code className="text-indigo-400 bg-[#111419] px-1 py-0.5 rounded border border-[#2D3139]">GET /api/assignments/{studentId}</code>, <code className="text-indigo-400 bg-[#111419] px-1 py-0.5 rounded border border-[#2D3139]">PUT /api/assignments/:id</code>, and <code className="text-indigo-400 bg-[#111419] px-1 py-0.5 rounded border border-[#2D3139]">DELETE /api/assignments/:id</code>.
            </p>
          </div>

          <button
            id="create-assignment-modal-btn"
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            New Assignment
          </button>
        </div>

        {/* Filters Bar */}
        <div className="mt-4 pt-4 border-t border-[#2D3139] grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Status Filter</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full text-xs bg-[#111419] border border-[#2D3139] rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Priority Filter</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full text-xs bg-[#111419] border border-[#2D3139] rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Filter by Subject</label>
            <input
              type="text"
              placeholder="e.g. Python, DBMS"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="w-full text-xs bg-[#111419] border border-[#2D3139] rounded-lg p-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Assignment List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssignments.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-[#1A1D23] rounded-xl border border-dashed border-[#2D3139]">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No assignments match your filter</p>
            <p className="text-xs text-slate-500 mt-1">Click "New Assignment" to create one or clear filters.</p>
          </div>
        ) : (
          filteredAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-[#1A1D23] border border-[#2D3139] rounded-xl p-4 shadow-sm hover:border-slate-600 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#111419] text-indigo-300 border border-[#2D3139]">
                    {assignment.subject}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    assignment.priority === 'High' ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400' :
                    assignment.priority === 'Medium' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {assignment.priority} Priority
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug">{assignment.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {assignment.description || 'No detailed instructions provided.'}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3 pt-3 border-t border-[#2D3139]">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Due: {assignment.due_date}</span>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#2D3139]">
                <select
                  value={assignment.status}
                  onChange={(e) => onUpdateAssignment(assignment.id, { status: e.target.value as any })}
                  className={`text-[11px] font-bold rounded px-2.5 py-1 border cursor-pointer focus:outline-none ${
                    assignment.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    assignment.status === 'In Progress' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}
                >
                  <option value="Pending" className="bg-[#1A1D23] text-amber-400">Pending</option>
                  <option value="In Progress" className="bg-[#1A1D23] text-indigo-400">In Progress</option>
                  <option value="Completed" className="bg-[#1A1D23] text-emerald-400">Completed</option>
                </select>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(assignment)}
                    className="p-1.5 text-slate-400 hover:text-indigo-400 rounded hover:bg-[#111419] transition-colors"
                    title="Edit Assignment"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteAssignment(assignment.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-[#111419] transition-colors"
                    title="Delete Assignment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#1A1D23] rounded-xl p-6 max-w-md w-full shadow-2xl border border-[#2D3139]">
            <h3 className="text-base font-bold text-white mb-4">
              {editingId ? 'Edit Assignment' : 'Create New Assignment'}
            </h3>

            {formError && (
              <div className="mb-4 p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Python, DBMS, Operating Systems"
                  className="w-full text-xs bg-[#111419] border border-[#2D3139] rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Python Loops and Recursion Problems"
                  className="w-full text-xs bg-[#111419] border border-[#2D3139] rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of requirements..."
                  rows={3}
                  className="w-full text-xs bg-[#111419] border border-[#2D3139] rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full text-xs bg-[#111419] border border-[#2D3139] rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full text-xs bg-[#111419] border border-[#2D3139] rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Due Date (YYYY-MM-DD)</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full text-xs bg-[#111419] border border-[#2D3139] rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#2D3139]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-[#111419] rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-sm"
                >
                  {editingId ? 'Save Changes' : 'Create Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
