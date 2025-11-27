import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  // Explicitly typing props to fix TS error if Component inheritance is not inferred correctly
  public props: ErrorBoundaryProps;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Something went wrong</h2>
            <p className="text-slate-500 mb-6">
              We encountered an unexpected error in the clinic system. 
              The development team has been notified.
            </p>
            
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-left mb-6 overflow-auto max-h-32">
                <code className="text-xs text-slate-600 font-mono">
                    {this.state.error?.message || 'Unknown Error'}
                </code>
            </div>

            <div className="flex gap-3 justify-center">
                <button 
                    onClick={() => window.location.reload()}
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                    <RefreshCw size={18} className="mr-2" />
                    Reload System
                </button>
                <button 
                    onClick={() => window.location.href = '/'}
                    className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                    <Home size={18} className="mr-2" />
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