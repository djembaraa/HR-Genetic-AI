import React from 'react';

export class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen gap-4 text-center px-4">
          <h1 className="text-2xl font-bold text-primary">Something went wrong</h1>
          <p className="text-text-secondary max-w-md">{this.state.error?.message || "An unexpected error occurred."}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-accent text-white rounded-xl font-medium">
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
