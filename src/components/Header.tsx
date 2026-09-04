import React from 'react';
import { BookOpen, Layers, Terminal, Code2, GraduationCap, Server, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  studentId: string;
  setStudentId: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  studentId,
  setStudentId
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Academic Dashboard', icon: Layers },
    { id: 'assignments', label: 'Assignments (CRUD)', icon: BookOpen },
    { id: 'attendance', label: 'Attendance & 75% Rule', icon: Layers },
    { id: 'marks', label: 'Marks & Analytics', icon: Layers },
    { id: 'api_explorer', label: 'Interactive Swagger UI', icon: Terminal },
    { id: 'code_viewer', label: 'Python Backend Code', icon: Code2 },
    { id: 'viva_prep', label: 'College Viva Q&A (20)', icon: GraduationCap },
    { id: 'deployment', label: 'Windows & Render Guide', icon: Server },
  ];

  return (
    <header className="border-b border-[#2D3139] bg-[#15181E] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          {/* Brand & Project Identity */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center font-bold text-white shadow-sm">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-medium tracking-tight text-white">
                  Smart Student Companion <span className="text-slate-500 mx-1.5 font-normal">/</span> <span className="text-indigo-400">Academic Backend</span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                FastAPI • MongoDB • Assignments, Attendance & Marks Management
              </p>
            </div>
          </div>

          {/* Student ID Switcher & API Status */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="flex items-center gap-2 bg-[#111419] px-3 py-1.5 rounded-lg border border-[#2D3139]">
              <label htmlFor="student-id-input" className="text-xs font-medium text-slate-400 whitespace-nowrap">
                Student ID:
              </label>
              <input
                id="student-id-input"
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value || 'student123')}
                className="w-24 text-xs font-mono font-semibold text-white bg-[#1A1D23] border border-[#2D3139] rounded px-2 py-1 focus:outline-none focus:border-indigo-500"
                placeholder="student123"
              />
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              API ONLINE
            </div>

            <div className="hidden sm:flex px-3 py-1 rounded-full bg-slate-800/80 text-slate-400 text-xs font-mono border border-slate-700">
              v1.0.4-stable
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 overflow-x-auto pb-2 pt-1 scrollbar-none border-t border-[#2D3139]/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-button-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1A1D23]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-200' : 'text-slate-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
