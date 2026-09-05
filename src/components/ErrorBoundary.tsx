import React, { ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  override state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught runtime error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0F1115] text-[#D1D5DB] flex items-center justify-center p-6 font-sans">
          <div className="max-w-lg w-full bg-[#1A1D23] border border-rose-500/40 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Application Render Notice</h2>
                <p className="text-xs text-slate-400">An unexpected error occurred while mounting the component tree.</p>
              </div>
            </div>

            <div className="p-3 bg-[#0F1115] rounded-lg border border-[#2D3139] text-xs font-mono text-rose-300 overflow-x-auto">
              {this.state.error?.toString() || 'Unknown error occurred'}
            </div>

            {this.state.errorInfo && (
              <details className="text-[11px] text-slate-400 font-mono">
                <summary className="cursor-pointer hover:text-white py-1">Component Stack Trace</summary>
                <pre className="mt-2 p-2.5 bg-[#0F1115] rounded border border-[#2D3139] overflow-x-auto text-[10px] leading-relaxed">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reload Application
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
