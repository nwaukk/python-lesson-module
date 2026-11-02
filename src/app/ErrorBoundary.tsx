/**
 * Resilient Error Boundaries for App & Simulations
 * Section 7.4: Error boundaries around every simulation so one failure never blanks the page.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  isSimulation?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Avoid noisy external telemetry; retain localized debug trace in development
    console.error('Python Visual Lab ErrorBoundary caught:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.isSimulation) {
        return (
          <div className="p-4 my-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 flex flex-col gap-2">
            <div className="flex items-center gap-2 font-medium text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Simulation Visualiser Paused</span>
            </div>
            <p className="text-xs text-amber-300/80">
              This visual component encountered an unexpected error ({this.state.error?.message || 'Unknown'}). The rest of your workspace is unharmed.
            </p>
            <div>
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md bg-amber-500 text-slate-900 hover:bg-amber-400 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Retry Visualisation
              </button>
            </div>
          </div>
        );
      }

      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6">
          <div className="max-w-md w-full p-6 rounded-2xl border border-red-500/30 bg-slate-900 text-slate-100 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-lg">{this.props.fallbackTitle || 'Workspace Error'}</h2>
                <p className="text-xs text-slate-400">The application recovered gracefully</p>
              </div>
            </div>

            <p className="text-sm text-slate-300">
              An unexpected issue occurred while rendering this view. Your progress and notes are safely preserved.
            </p>

            {this.state.error && (
              <pre className="p-3 rounded-lg bg-black/50 text-red-300 text-xs font-mono overflow-x-auto border border-white/5">
                {this.state.error.message}
              </pre>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={this.handleReset}
                className="flex-1 py-2 px-4 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reload View
              </button>
              <button
                onClick={() => {
                  window.location.hash = '#/';
                  window.location.reload();
                }}
                className="py-2 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
