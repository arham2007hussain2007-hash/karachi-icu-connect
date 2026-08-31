// ── 404 Not Found (Step 11 Part 1 production-readiness) ──
// Safe, on-brand fallback for unknown routes so a mistyped URL or a
// broken link never renders a blank page. Reuses the existing visual
// identity (navy/medical/amber) and the project-wide demo disclaimer.

import { Link } from "react-router-dom";
import { AlertCircle, Home, Search } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-700 mb-4">
        <AlertCircle className="w-9 h-9" />
      </div>
      <p className="text-[10px] font-bold text-navy-500 uppercase tracking-widest mb-1">
        404 — Page Not Found
      </p>
      <h1 className="text-3xl md:text-4xl font-bold text-navy-900 mb-2">
        We couldn't find that page
      </h1>
      <p className="text-navy-500 mb-6 max-w-md mx-auto">
        The page you're looking for doesn't exist or may have been moved.
        Please check the URL, or use one of the links below.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-medical-500 hover:bg-medical-600 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-colors no-underline"
        >
          <Home className="w-4 h-4" />
          Go to Home
        </Link>
        <Link
          to="/search"
          className="inline-flex items-center gap-2 bg-white border border-navy-200 hover:border-medical-400 hover:bg-medical-50 text-navy-700 hover:text-medical-700 font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors no-underline"
        >
          <Search className="w-4 h-4" />
          Find ICU Beds
        </Link>
      </div>
      <p className="text-[10px] text-navy-400 mt-8">
        Karachi ICU Connect — DEMO DATA — please call the hospital to confirm availability.
      </p>
    </div>
  );
}
