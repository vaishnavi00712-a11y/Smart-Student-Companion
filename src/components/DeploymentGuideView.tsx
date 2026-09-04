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
  AlertTriangle
} from 'lucide-react';

export const DeploymentGuideView: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const githubPagesSteps = [
    {
      step: "Root Cause Solved",
      title: "Why GitHub Pages shows a blank white page",
      desc: "By default, Vite compiles asset paths with an absolute root slash (/assets/index.js). GitHub Pages hosts repositories in a subfolder (https://<username>.github.io/<repo-name>/), causing the browser to search for assets at the domain root, triggering 404 Not Found errors. We fixed this by adding `base: './'` to `vite.config.ts` so all assets use relative paths.",
      status: "Fixed in codebase"
    },
    {
      step: "Option A: 1-Click Automated",
      title: "GitHub Actions Workflow (.github/workflows/deploy.yml)",
      desc: "We added a GitHub Actions deployment workflow. In your GitHub repository: Go to Settings -> Pages -> Under 'Build and deployment' -> Set Source to 'GitHub Actions'. Pushing your code will automatically build and publish the site!",
      command: "git add .\ngit commit -m \"Deploy to GitHub Pages with relative base path\"\ngit push origin main"
    },
    {
      step: "Option B: Manual gh-pages Branch",
      title: "Build & Deploy using the gh-pages CLI tool",
      desc: "If you prefer deploying the built dist/ folder directly to a gh-pages branch:",
      command: "npm run build\nnpx gh-pages -d dist"
    }
  ];

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
              <span className="text-xs text-slate-500 font-mono">Windows 11/10 • GitHub Pages • Render PaaS</span>
            </div>
            <h2 className="text-base font-bold text-white">Production Deployment & GitHub Pages Guide</h2>
            <p className="text-xs text-slate-400 mt-1">
              Instructions for deploying the frontend to GitHub Pages (blank screen issue resolved), running the FastAPI backend locally on Windows, and deploying to Render.com.
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

      {/* GitHub Pages Blank Screen Fix Banner */}
      <div className="bg-[#1A1D23] border border-emerald-500/30 rounded-xl p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">GitHub Pages Blank White Page Issue Fixed</h3>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Resolved
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                The blank white page on GitHub Pages occurs because Vite defaults to absolute asset URLs (<code className="text-indigo-300">/assets/...</code>) which fails when GitHub Pages serves your site from a repository subpath (<code className="text-indigo-300">username.github.io/repo-name/</code>).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="bg-[#111419] p-3 rounded-lg border border-[#2D3139] text-xs space-y-1">
                <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">Before (Broken)</span>
                <code className="text-[11px] text-slate-400 block font-mono">
                  &lt;script src=&quot;/assets/index.js&quot;&gt;
                </code>
                <p className="text-[11px] text-slate-500">
                  Browser requests root path: <span className="text-rose-400">username.github.io/assets/... (404 Not Found)</span>
                </p>
              </div>

              <div className="bg-[#111419] p-3 rounded-lg border border-[#2D3139] text-xs space-y-1">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">Now Fixed with base: &apos;./&apos;</span>
                <code className="text-[11px] text-emerald-300 block font-mono">
                  &lt;script src=&quot;./assets/index.js&quot;&gt;
                </code>
                <p className="text-[11px] text-slate-400">
                  Browser correctly resolves inside the repository: <span className="text-emerald-400">username.github.io/repo-name/assets/... (200 OK)</span>
                </p>
              </div>
            </div>

            <div className="pt-2">
              <div className="text-xs font-semibold text-white mb-2">How to deploy to GitHub Pages now:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#111419] p-3 rounded-lg border border-[#2D3139]">
                  <div className="text-xs font-bold text-indigo-400 mb-1">Method 1: GitHub Actions (Recommended)</div>
                  <ol className="text-[11px] text-slate-400 list-decimal list-inside space-y-1">
                    <li>Go to your repo on <strong>GitHub.com</strong></li>
                    <li>Click <strong>Settings &rarr; Pages</strong></li>
                    <li>Under <strong>Source</strong>, select <strong>GitHub Actions</strong></li>
                    <li>Commit and push — the created <code className="text-indigo-300 font-mono">.github/workflows/deploy.yml</code> deploys automatically!</li>
                  </ol>
                </div>

                <div className="bg-[#111419] p-3 rounded-lg border border-[#2D3139]">
                  <div className="text-xs font-bold text-cyan-400 mb-1">Method 2: Command Line (gh-pages)</div>
                  <pre className="bg-[#0F1115] p-2 rounded text-emerald-400 font-mono text-[11px] border border-[#2D3139] overflow-x-auto">
{`npm run build
npx gh-pages -d dist`}
                  </pre>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Deploys the compiled relative assets directly to the gh-pages branch.
                  </p>
                </div>
              </div>
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
            <h3 className="text-sm font-bold text-white">Running on Windows (Local Machine)</h3>
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
            <h3 className="text-sm font-bold text-white">Deploying to Free Cloud (Render.com)</h3>
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
