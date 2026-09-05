import React, { useState } from 'react';
import { 
  Server, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink, 
  CheckCircle2, 
  Laptop, 
  Cloud, 
  FileText,
  Layers,
  ArrowRight,
  Globe,
  AlertTriangle,
  FolderCheck,
  Rocket
} from 'lucide-react';

export const DeploymentGuideView: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const windowsSteps = [
    {
      step: "Step 1",
      title: "Clone Repository & Open Terminal in Windows",
      desc: "Open Command Prompt (cmd) or PowerShell and navigate to your project directory:",
      command: `cd smart-student-companion`
    },
    {
      step: "Step 2",
      title: "Create and Activate Python Virtual Environment (.venv)",
      desc: "Isolates packages so they don't interfere with other Python installations on your Windows machine:",
      command: `python -m venv .venv\n.venv\\Scripts\\activate`
    },
    {
      step: "Step 3",
      title: "Install Dependencies from requirements.txt",
      desc: "Installs FastAPI, Uvicorn, Motor (Async MongoDB), Pydantic, and python-dotenv:",
      command: `pip install -r requirements.txt`
    },
    {
      step: "Step 4",
      title: "Configure Environment Variables (.env)",
      desc: "Create a .env file in the root folder with your MongoDB connection string (Local or MongoDB Atlas):",
      command: `MONGO_URI=mongodb://localhost:27017\nDATABASE_NAME=student_companion\nPORT=8000\nENV=development`
    },
    {
      step: "Step 5",
      title: "Launch FastAPI Server with Hot Reload",
      desc: "Starts the Uvicorn ASGI server on port 8000:",
      command: `uvicorn backend.main:app --reload --port 8000`
    }
  ];

  const renderSteps = [
    {
      step: "Step 1",
      title: "Push Code to GitHub",
      desc: "Create a new private or public repository on GitHub and push the backend code."
    },
    {
      step: "Step 2",
      title: "Create Free Web Service on Render.com",
      desc: "Sign up at render.com, click 'New +' -> 'Web Service', and link your GitHub repository."
    },
    {
      step: "Step 3",
      title: "Configure Build & Start Settings",
      desc: "Set the runtime to Python 3 with the following commands:",
      buildCmd: "pip install -r requirements.txt",
      startCmd: "uvicorn backend.main:app --host 0.0.0.0 --port $PORT"
    },
    {
      step: "Step 4",
      title: "Set Environment Variables in Render Dashboard",
      desc: "Add MONGO_URI pointing to your free MongoDB Atlas cluster and set DATABASE_NAME=student_companion."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#1A1D23] border border-[#2D3139] rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                Setup & Deployment
              </span>
              <span className="text-xs text-slate-500 font-mono">GitHub Pages • Windows 11/10 • Render Cloud</span>
            </div>
            <h2 className="text-base font-bold text-white">GitHub Pages Deployment & Blank Screen Troubleshooting</h2>
            <p className="text-xs text-slate-400 mt-1">
              Everything you need to successfully host your frontend on GitHub Pages, run your Python FastAPI backend on Windows, and deploy to Render.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-[#111419] border border-[#2D3139] text-xs font-mono text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Swagger: http://localhost:8000/docs
            </span>
          </div>
        </div>
      </div>

      {/* GitHub Pages Blank Screen Root Cause & Instant Fixes */}
      <div className="bg-[#1A1D23] border border-indigo-500/40 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0 mt-0.5">
            <Globe className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-white">Why Did GitHub Pages Show a Blank White Screen?</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              GitHub Pages is a <strong>static HTML file host</strong>. When you select <code className="text-indigo-300 font-mono">Branch: main, Folder: / (root)</code>, GitHub Pages serves the root <code className="text-indigo-300 font-mono">index.html</code> which references <code className="text-indigo-300 font-mono">/src/main.tsx</code>. Because browsers cannot parse raw TypeScript files directly, the browser throws an error and shows a blank white page.
            </p>
            <p className="text-xs text-emerald-400 mt-1.5 font-medium">
              We have generated the compiled production build into the <code className="font-mono bg-[#111419] px-1.5 py-0.5 rounded border border-[#2D3139]">/docs</code> folder with relative asset paths (<code className="font-mono">base: &apos;./&apos;</code>), <code className="font-mono">.nojekyll</code>, and <code className="font-mono">404.html</code>!
            </p>
          </div>
        </div>

        {/* 3 Simple Options to Deploy */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Option 1: /docs folder */}
          <div className="bg-[#111419] border border-emerald-500/30 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Option 1 (Easiest)
                </span>
                <span className="text-xs font-bold text-white">The /docs Folder</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                The pre-built production files are already in the <code className="text-emerald-400 font-mono">docs/</code> directory inside your repo.
              </p>
              <ol className="text-[11px] text-slate-300 list-decimal list-inside space-y-1.5 mt-3 pt-2 border-t border-[#2D3139]">
                <li>Go to GitHub &rarr; <strong>Settings &rarr; Pages</strong></li>
                <li>Under <strong>Branch:</strong> select <strong>main</strong></li>
                <li>Under <strong>Folder:</strong> select <strong>/docs</strong></li>
                <li>Click <strong>Save</strong>!</li>
              </ol>
            </div>
            <div className="mt-3 pt-2 border-t border-[#2D3139] text-[10px] text-emerald-400 font-medium">
              ✓ Ready immediately &mdash; no build required on GitHub
            </div>
          </div>

          {/* Option 2: npm run deploy */}
          <div className="bg-[#111419] border border-indigo-500/30 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Option 2 (CLI)
                </span>
                <span className="text-xs font-bold text-white">npm run deploy</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                We installed the standard <code className="text-indigo-300 font-mono">gh-pages</code> package. Run this single command in your terminal:
              </p>
              <div className="mt-2">
                <pre className="bg-[#0F1115] p-2 rounded text-indigo-300 font-mono text-[11px] border border-[#2D3139] overflow-x-auto">
npm run deploy
                </pre>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                This compiles Vite and pushes the clean production build to a <code className="text-indigo-300 font-mono">gh-pages</code> branch.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#2D3139] text-[10px] text-indigo-400 font-medium">
              ✓ GitHub Pages detects gh-pages branch automatically
            </div>
          </div>

          {/* Option 3: GitHub Actions */}
          <div className="bg-[#111419] border border-cyan-500/30 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Option 3 (CI/CD)
                </span>
                <span className="text-xs font-bold text-white">GitHub Actions</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                We included <code className="text-cyan-300 font-mono">.github/workflows/deploy.yml</code>:
              </p>
              <ol className="text-[11px] text-slate-300 list-decimal list-inside space-y-1.5 mt-2 pt-2 border-t border-[#2D3139]">
                <li>Go to GitHub &rarr; <strong>Settings &rarr; Pages</strong></li>
                <li>Under <strong>Build and deployment &rarr; Source</strong></li>
                <li>Change dropdown to <strong>GitHub Actions</strong></li>
                <li>Push code &mdash; builds &amp; deploys automatically</li>
              </ol>
            </div>
            <div className="mt-3 pt-2 border-t border-[#2D3139] text-[10px] text-cyan-400 font-medium">
              ✓ Auto-deploys on every git push
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Guide: Windows Local vs Render Cloud */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Windows Local Run Guide */}
        <div className="bg-[#1A1D23] border border-[#2D3139] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#2D3139]">
            <Laptop className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Running Backend on Windows (Local Machine)</h3>
          </div>

          <div className="space-y-4">
            {windowsSteps.map((ws, i) => (
              <div key={i} className="bg-[#111419] rounded-xl p-4 border border-[#2D3139] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                    {ws.step}
                  </span>
                  <button
                    onClick={() => copyToClipboard(ws.command, `win-${i}`)}
                    className="text-slate-400 hover:text-white p-1 rounded transition-colors flex items-center gap-1 text-[11px]"
                  >
                    {copiedIndex === `win-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIndex === `win-${i}` ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <h4 className="text-xs font-semibold text-white">{ws.title}</h4>
                <p className="text-[11px] text-slate-400">{ws.desc}</p>

                <pre className="bg-[#0F1115] p-2.5 rounded-lg text-emerald-400 font-mono text-xs overflow-x-auto border border-[#2D3139]">
                  {ws.command}
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* Render Cloud Deployment Guide */}
        <div className="bg-[#1A1D23] border border-[#2D3139] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#2D3139]">
            <Cloud className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Deploying Backend to Free Cloud (Render.com)</h3>
          </div>

          <div className="space-y-4">
            {renderSteps.map((rs, i) => (
              <div key={i} className="bg-[#111419] rounded-xl p-4 border border-[#2D3139] space-y-2">
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                  {rs.step}
                </span>
                <h4 className="text-xs font-semibold text-white">{rs.title}</h4>
                <p className="text-[11px] text-slate-400">{rs.desc}</p>

                {rs.buildCmd && (
                  <div className="space-y-2 pt-1">
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono">Build Command:</span>
                      <pre className="bg-[#0F1115] p-2 rounded text-indigo-300 font-mono text-xs border border-[#2D3139]">
                        {rs.buildCmd}
                      </pre>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono">Start Command:</span>
                      <pre className="bg-[#0F1115] p-2 rounded text-emerald-400 font-mono text-xs border border-[#2D3139]">
                        {rs.startCmd}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Procfile & Dockerfile Reference */}
            <div className="bg-[#111419] rounded-xl p-4 border border-[#2D3139] space-y-2">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                Production Config File
              </span>
              <h4 className="text-xs font-semibold text-white">Procfile (for Heroku / Render)</h4>
              <pre className="bg-[#0F1115] p-2.5 rounded text-amber-300 font-mono text-xs border border-[#2D3139]">
                web: uvicorn backend.main:app --host 0.0.0.0 --port $PORT
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
