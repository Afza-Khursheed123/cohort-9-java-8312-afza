import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#E0FBFC] p-6 text-center">
          <h1 className="text-2xl font-bold text-[#293241]">Something went wrong</h1>
          <p className="text-[#3D5A80]">Please try loading the application again.</p>
          <button type="button" onClick={() => window.location.reload()} className="rounded-lg bg-[#16425B] px-4 py-2 font-semibold text-white hover:bg-[#3D5A80]">
            Reload
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
