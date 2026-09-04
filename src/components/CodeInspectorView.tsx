import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  FileText, 
  FolderTree, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { BACKEND_CODE_FILES, CodeFile } from '../data/backendCode';

export const CodeInspectorView: React.FC = () => {
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Entry & Config', 'Schemas (Validation)', 'Routes (APIs)', 'Services (Business Logic)'];

  const filteredFiles = activeCategory === 'All'
    ? BACKEND_CODE_FILES
    : BACKEND_CODE_FILES.filter(f => f.category === activeCategory);

  const currentFile = BACKEND_CODE_FILES[selectedFileIdx] || BACKEND_CODE_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-slate-900 text-white">
                Python Codebase
              </span>
              <h2 className="text-base font-bold text-slate-900">Source Code Inspector & Explanations</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Browse all modular files created in the <code className="text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">backend/</code> directory. Copy any file directly into your local project.
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm self-start sm:self-auto"
          >
            {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied File!' : `Copy ${currentFile.name}`}
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex gap-1.5 overflow-x-auto mt-4 pt-3 border-t border-slate-100 pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: File List (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-3 shadow-sm space-y-1.5 max-h-[640px] overflow-y-auto">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
            <FolderTree className="w-3.5 h-3.5" />
            Backend Files ({filteredFiles.length})
          </div>

          {filteredFiles.map((file) => {
            const actualIdx = BACKEND_CODE_FILES.findIndex(f => f.path === file.path);
            const isSelected = actualIdx === selectedFileIdx;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFileIdx(actualIdx)}
                className={`w-full text-left p-2.5 rounded-lg border transition-all flex flex-col gap-0.5 ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50/60 shadow-xs'
                    : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold text-slate-800">{file.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">.py</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 truncate pl-5">
                  {file.path}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Col: Code Viewer & Explanation (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* File Header */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold font-mono text-slate-900">
                {currentFile.path}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                {currentFile.category}
              </span>
            </div>
            <p className="text-xs text-slate-500">{currentFile.description}</p>
          </div>

          {/* Code Container */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
              <span className="font-mono text-[11px] text-indigo-300">{currentFile.name}</span>
              <span>Python 3.10+ / FastAPI</span>
            </div>

            <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-[500px]">
              <code>{currentFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
