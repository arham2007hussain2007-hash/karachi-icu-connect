// ── Application-level Error Boundary (Step 11 Part 3) ──
// Catches unexpected React rendering errors anywhere in its children
// and renders a safe, on-brand fallback instead of a blank screen.
// Technical details are logged to the console for developers; the
// rendered UI intentionally exposes nothing sensitive (no stack trace,
// no internal file paths) and stays consistent with the existing
// Karachi ICU Connect visual identity.

import { Component } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log technical details for developers; do NOT expose them in the UI.
    // eslint-disable-next-line no-console
    console.error(
      "Karachi ICU Connect — render error:",
      error,
      errorInfo
    );
  }

  handleTryAgain = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReturnHome = () => {
    // Reset the boundary and navigate home. Using an in-page navigation
    // keeps the recovery inside the SPA without a full page reload.
    this.setState({ hasError: false, error: null });
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "/");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emergency-100 text-emergency-700 mb-4">
          <AlertTriangle className="w-9 h-9" />
        </div>
        <p className="text-[10px] font-bold text-navy-500 uppercase tracking-widest mb-1">
          Unexpected error
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-navy-900 mb-2">
          We hit an unexpected problem
        </h1>
        <p className="text-navy-500 mb-6 max-w-md mx-auto">
          A part of the application failed to render. You can try the page
          again, or return to the home page and continue from there.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={this.handleTryAgain}
            className="inline-flex items-center gap-2 bg-medical-500 hover:bg-medical-600 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Try again
          </button>
          <Link
            to="/"
            onClick={this.handleReturnHome}
            className="inline-flex items-center gap-2 bg-white border border-navy-200 hover:border-medical-400 hover:bg-medical-50 text-navy-700 hover:text-medical-700 font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors no-underline"
          >
            <Home className="w-4 h-4" />
            Return home
          </Link>
        </div>
        <p className="text-[10px] text-navy-400 mt-8">
          Karachi ICU Connect — DEMO DATA — please call the hospital to
          confirm availability.
        </p>
      </div>
    );
  }
}
