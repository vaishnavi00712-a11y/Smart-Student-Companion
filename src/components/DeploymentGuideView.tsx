import React, { useState } from 'react';
import { 
  Server, 
  Terminal, 
  GitBranch, 
  Cloud, 
  Copy, 
  Check, 
  AlertTriangle, 
  CheckCircle2 
} from 'lucide-react';

export const DeploymentGuideView: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copySnippet = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-slate-900 text-white">
            Phase 9 & 10
          </span>
          <h2 className="text-base font-bold text-slate-900">
            Windows PowerShell Setup & Render Cloud Deployment
          </h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Exact beginner-friendly commands to run your backend locally on Windows VS Code and deploy it live to Render connected to MongoDB Atlas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Col: Windows PowerShell Step-by-Step */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm pb-2 border-b border-slate-100">
            <Terminal className="w-4 h-4 text-indigo-600" />
            <span>Local Setup on Windows (PowerShell)</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="font-semibold text-slate-700 block mb-1">
                1. Navigate into the backend folder:
              </span>
              <div className="flex items-center justify-between bg-slate-900 text-slate-100 p-2.5 rounded-lg font-mono text-[11px]">
                <code>cd backend</code>
                <button
                  onClick={() => copySnippet('cd', 'cd backend')}
                  className="text-slate-400 hover:text-white"
                >
                  {copiedId === 'cd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <span className="font-semibold text-slate-700 block mb-1">
                2. Create Python virtual environment:
              </span>
              <div className="flex items-center justify-between bg-slate-900 text-slate-100 p-2.5 rounded-lg font-mono text-[11px]">
                <code>python -m venv venv</code>
                <button
                  onClick={() => copySnippet('venv', 'python -m venv venv')}
                  className="text-slate-400 hover:text-white"
                >
                  {copiedId === 'venv' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <span className="font-semibold text-slate-700 block mb-1">
                3. Activate virtual environment (PowerShell):
              </span>
              <div className="flex items-center justify-between bg-slate-900 text-slate-100 p-2.5 rounded-lg font-mono text-[11px]">
                <code>.\venv\Scripts\Activate.ps1</code>
                <button
                  onClick={() => copySnippet('act', '.\\venv\\Scripts\\Activate.ps1')}
                  className="text-slate-400 hover:text-white"
                >
                  {copiedId === 'act' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                * If PowerShell gives a script execution policy error, run: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass</code>
              </p>
            </div>

            <div>
              <span className="font-semibold text-slate-700 block mb-1">
                4. Install required packages:
              </span>
              <div className="flex items-center justify-between bg-slate-900 text-slate-100 p-2.5 rounded-lg font-mono text-[11px]">
                <code>pip install -r requirements.txt</code>
                <button
                  onClick={() => copySnippet('pip', 'pip install -r requirements.txt')}
                  className="text-slate-400 hover:text-white"
                >
                  {copiedId === 'pip' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <span className="font-semibold text-slate-700 block mb-1">
                5. Launch the FastAPI development server:
              </span>
              <div className="flex items-center justify-between bg-slate-900 text-slate-100 p-2.5 rounded-lg font-mono text-[11px]">
                <code>uvicorn main:app --reload --port 8000</code>
                <button
                  onClick={() => copySnippet('run', 'uvicorn main:app --reload --port 8000')}
                  className="text-slate-400 hover:text-white"
                >
                  {copiedId === 'run' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Render Cloud Deployment & Git */}
        <div className="space-y-6">
          {/* Render Config */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm pb-2 border-b border-slate-100">
              <Cloud className="w-4 h-4 text-emerald-600" />
              <span>Deploy to Render (Free Web Service)</span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-500">Service Type:</span>
                <span className="font-bold text-slate-900">Web Service (Python 3)</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-500">Root Directory:</span>
                <span className="font-mono text-slate-900">backend</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-500">Build Command:</span>
                <span className="font-mono text-slate-900">pip install -r requirements.txt</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-500">Start Command:</span>
                <span className="font-mono text-slate-900">uvicorn main:app --host 0.0.0.0 --port $PORT</span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Render Environment Variables to set:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                <li><code>MONGODB_URL</code> = your cloud MongoDB Atlas connection string</li>
                <li><code>DATABASE_NAME</code> = <code>smart_student_db</code></li>
                <li><code>ALLOWED_ORIGINS</code> = URL of your deployed frontend on Vercel</li>
              </ul>
            </div>
          </div>

          {/* GitHub Commit Checklist */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm pb-2 border-b border-slate-100">
              <GitBranch className="w-4 h-4 text-slate-700" />
              <span>Git & Team Integration Safety</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>DO Commit:</strong> main.py, schemas, routes, services, requirements.txt, .env.example, README.md</span>
              </div>
              <div className="flex items-center gap-2 text-rose-700">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span><strong>NEVER Commit:</strong> .env (contains real database password/URL) or venv/ folder</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
