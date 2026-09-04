import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  FolderTree, 
  FileCode, 
  Download, 
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { BACKEND_CODE_FILES, CodeFile } from '../data/backendCode';

export const CodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(BACKEND_CODE_FILES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    // Generate a single combined file or download the selected file
    const element = document.createElement("a");
    const file = new Blob([selectedFile.code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = selectedFile.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const categories = Array.from(new Set(BACKEND_CODE_FILES.map(f => f.category)));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#1A1D23] border border-[#2D3139] rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                FastAPI Source Code
              </span>
              <span className="text-xs text-slate-500 font-mono">Python 3.11+ • Clean Architecture</span>
            </div>
            <h2 className="text-base font-bold text-white">Modular Python Backend Source Code</h2>
            <p className="text-xs text-slate-400 mt-1">
              Organized into clean, production-standard layers: Entry configuration, Pydantic data schemas, REST route handlers, and business logic services.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 bg-[#111419] hover:bg-slate-800 border border-[#2D3139] rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied File' : 'Copy File'}</span>
            </button>

            <button
              onClick={handleDownloadAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {selectedFile.name}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: File Tree Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#1A1D23] border border-[#2D3139] rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#2D3139]">
              <FolderTree className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                Backend Architecture
              </span>
            </div>

            <div className="space-y-4">
              {categories.map((cat) => (
                <div key={cat} className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2">
                    {cat}
                  </div>
                  <div className="space-y-1">
                    {BACKEND_CODE_FILES.filter(f => f.category === cat).map((file) => {
                      const isSelected = selectedFile.path === file.path;
                      return (
                        <button
                          key={file.path}
                          onClick={() => setSelectedFile(file)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono flex items-center gap-2 transition-all ${
                            isSelected
                              ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/40 font-semibold'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-[#111419]'
                          }`}
                        >
                          <FileCode className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                          <span className="truncate">{file.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current File Info */}
          <div className="bg-[#111419] border border-[#2D3139] rounded-xl p-4 text-xs">
            <div className="text-slate-400 font-semibold mb-1">File Role & Responsibility:</div>
            <p className="text-slate-300 leading-relaxed">{selectedFile.description}</p>
            <div className="mt-3 pt-3 border-t border-[#2D3139] flex items-center justify-between text-[11px] text-slate-500">
              <span>Path: {selectedFile.path}</span>
              <span>{selectedFile.code.split('\n').length} lines</span>
            </div>
          </div>
        </div>

        {/* Right: Code Viewer Panel */}
        <div className="lg:col-span-8 bg-[#111419] border border-[#2D3139] rounded-xl overflow-hidden shadow-inner flex flex-col">
          {/* File Header Bar */}
          <div className="px-4 py-3 bg-[#15181E] border-b border-[#2D3139] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              <span className="text-xs font-mono font-bold text-white">{selectedFile.path}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 font-mono">Python 3.11</span>
              <button
                onClick={handleCopy}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-[#1A1D23] border border-[#2D3139] transition-colors"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Code Text Area with Line Numbers */}
          <div className="flex-1 overflow-x-auto p-4 font-mono text-xs leading-relaxed max-h-[640px] bg-[#0F1115]">
            <table className="w-full text-left border-collapse">
              <tbody>
                {selectedFile.code.split('\n').map((line, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="w-10 pr-4 text-right select-none text-slate-600 text-[11px] align-top">
                      {idx + 1}
                    </td>
                    <td className="text-slate-300 whitespace-pre">
                      {/* Simple highlighting helper */}
                      {line.startsWith('#') ? (
                        <span className="text-slate-500 italic">{line}</span>
                      ) : line.startsWith('import ') || line.startsWith('from ') ? (
                        <span className="text-indigo-400">{line}</span>
                      ) : line.startsWith('def ') || line.startsWith('async def ') || line.startsWith('class ') ? (
                        <span className="text-cyan-400 font-bold">{line}</span>
                      ) : line.includes('@') && line.trim().startsWith('@') ? (
                        <span className="text-amber-400">{line}</span>
                      ) : (
                        <span>{line}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
