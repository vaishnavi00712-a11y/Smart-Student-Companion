import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  HelpCircle, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  BookOpen,
  Filter
} from 'lucide-react';
import { VIVA_QUESTIONS, VivaQuestion } from '../data/vivaQuestions';

export const VivaPrepView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<number[]>([1, 2, 8, 14]); // Pre-expand a few important ones

  const categories = ['All', 'FastAPI & Python', 'Core Concepts', 'MongoDB & Database', 'Academic Logic'];

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    setExpandedIds(VIVA_QUESTIONS.map(q => q.id));
  };

  const collapseAll = () => {
    setExpandedIds([]);
  };

  const filteredQuestions = VIVA_QUESTIONS.filter(q => {
    if (selectedCategory !== 'All' && q.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const qText = (q.question + ' ' + q.answer + ' ' + q.keyPoints.join(' ')).toLowerCase();
      if (!qText.includes(searchQuery.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#1A1D23] border border-[#2D3139] rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                Exam Preparation
              </span>
              <span className="text-xs text-slate-500 font-mono">20 Curated Questions & Direct Answers</span>
            </div>
            <h2 className="text-base font-bold text-white">College Examiner Viva Voice & Defense Kit</h2>
            <p className="text-xs text-slate-400 mt-1">
              Master the technical defense of your project: architectural decisions, FastAPI vs Django, MongoDB NoSQL advantages, 75% attendance logic, and REST best practices.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="px-3 py-1.5 text-xs text-slate-300 bg-[#111419] hover:bg-slate-800 border border-[#2D3139] rounded-lg transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-1.5 text-xs text-slate-300 bg-[#111419] hover:bg-slate-800 border border-[#2D3139] rounded-lg transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="mt-4 pt-4 border-t border-[#2D3139] flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search question, concept, or keywords (e.g., Swagger, CORS, Pydantic)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#111419] border border-[#2D3139] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[#111419] text-slate-400 hover:text-white border border-[#2D3139]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top 3 Quick Revision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1A1D23] p-4 rounded-xl border border-[#2D3139] shadow-sm">
          <div className="text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            #1 Viva Killer Question
          </div>
          <h4 className="text-xs font-bold text-white mb-1.5">
            "Why calculate attendance & grades in Python, not in React frontend?"
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            <strong>Key Defense:</strong> Frontend code is exposed in the browser DevTools and can be manipulated by students. The server is the single source of truth that guarantees data integrity and enables automated alerts.
          </p>
        </div>

        <div className="bg-[#1A1D23] p-4 rounded-xl border border-[#2D3139] shadow-sm">
          <div className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
            #2 Architectural Choice
          </div>
          <h4 className="text-xs font-bold text-white mb-1.5">
            "Why FastAPI over Django or Flask?"
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            <strong>Key Defense:</strong> FastAPI is native async (ASGI) with automatic OpenAPI/Swagger documentation generated at <code className="text-indigo-400 font-mono">/docs</code> and compile-time type validation through Pydantic.
          </p>
        </div>

        <div className="bg-[#1A1D23] p-4 rounded-xl border border-[#2D3139] shadow-sm">
          <div className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            #3 Database Rationale
          </div>
          <h4 className="text-xs font-bold text-white mb-1.5">
            "Why MongoDB NoSQL over relational SQL?"
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            <strong>Key Defense:</strong> Assignments and attendance records naturally map to JSON documents. MongoDB allows schema flexibility and fast index lookups by <code className="text-indigo-400 font-mono">student_id</code>.
          </p>
        </div>
      </div>

      {/* Accordion Questions List */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 bg-[#1A1D23] rounded-xl border border-[#2D3139]">
            <HelpCircle className="w-8 h-8 mx-auto mb-2 text-slate-500" />
            <p className="text-sm font-semibold text-slate-300">No questions found</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing your search query or selecting "All" categories.</p>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isExpanded = expandedIds.includes(q.id);
            return (
              <div
                key={q.id}
                className="bg-[#1A1D23] border border-[#2D3139] rounded-xl overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => toggleExpand(q.id)}
                  className="w-full px-5 py-4 text-left flex items-start justify-between gap-4 hover:bg-[#111419]/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {q.id}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-white leading-snug">{q.question}</h3>
                      <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                        {q.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-1 rounded text-slate-400 shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-[#2D3139] bg-[#111419]/40 space-y-3">
                    <div className="text-xs text-slate-300 leading-relaxed pl-9">
                      {q.answer}
                    </div>

                    {/* Bullet summary points */}
                    <div className="pl-9 pt-2">
                      <div className="text-[10px] uppercase font-bold text-indigo-400 mb-1.5 tracking-wider">
                        Key Points for Examiner:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {q.keyPoints.map((pt, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2.5 py-1 rounded-md bg-[#1A1D23] border border-[#2D3139] text-slate-300 flex items-center gap-1.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                            {pt}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
