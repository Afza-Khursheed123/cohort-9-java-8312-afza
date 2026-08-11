import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
          <p className="text-gray-600">Please try loading the application again.</p>
          <button type="button" onClick={() => window.location.reload()} className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white">
            Reload
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
