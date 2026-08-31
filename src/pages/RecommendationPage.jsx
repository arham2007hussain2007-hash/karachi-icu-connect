import { useState, useMemo, useCallback, useRef } from "react";
import {
  Sparkles,
  Shield,
  Loader2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from "lucide-react";
import RecommendationForm from "../components/RecommendationForm";
import RecommendationResults from "../components/RecommendationResults";
import RecommendationSummary from "../components/RecommendationSummary";
import HospitalComparison from "../components/HospitalComparison";
import { useHospitals } from "../context/HospitalDataContext";
import { useDemoMode } from "../context/DemoModeContext";
import recommendationService from "../services/recommendationService";
import {
  getRecommendations,
  DEFAULT_SMART_MATCH_PREFS,
} from "../utils/recommendation";

const MAX_COMPARE = 3;

// Brief, meaningful analysis steps shown while the service "runs"
// (spec §18 — no fake AI animations, just a short checklist).
const ANALYSIS_STEPS = [
  "Analyzing ICU requirements",
  "Checking live bed availability",
  "Matching ICU types & ventilators",
  "Ranking hospitals",
];

export default function RecommendationPage() {
  const { hospitals } = useHospitals();
  const { reportDemoEvent } = useDemoMode();

  // Form state is lifted here so "Start New Search" can reset both the
  // inputs and the results (spec §20).
  const [formPrefs, setFormPrefs] = useState({ ...DEFAULT_SMART_MATCH_PREFS });
  const [prefs, setPrefs] = useState(null); // submitted preferences
  const [loading, setLoading] = useState(false);
  const [comparedIds, setComparedIds] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const resultsRef = useRef(null);

  // ── Live recommendations ──
  // Rankings are DERIVED from the live hospital list, so when hospital
  // staff update availability (Step 7 → HospitalDataContext), the
  // displayed recommendations re-rank immediately without a new search.
  // The engine is deterministic, so this always matches what the
  // recommendationService returns for the same input.
  const results = useMemo(
    () => (prefs ? getRecommendations(hospitals, prefs) : null),
    [prefs, hospitals]
  );

  const handleSubmit = useCallback(
    async (submittedPrefs) => {
      setLoading(true);
      setPrefs(submittedPrefs);
      setComparedIds([]);
      setShowComparison(false);
      // recommendationService is the swappable gateway: mock latency today
      // (services/recommendationService.js), a real AI/API later. The UI
      // does not change when the service is replaced.
      await recommendationService.getRecommendations(submittedPrefs, hospitals);
      setLoading(false);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 60);
    },
    [hospitals]
  );

  // No-match fallbacks (spec §15): relax one requirement and re-rank
  // instantly — no loading state needed for a local re-derivation.
  const handleRelaxArea = useCallback(() => {
    setPrefs((p) => (p ? { ...p, area: "Any Area" } : p));
  }, []);

  const handleRelaxVentilator = useCallback(() => {
    setPrefs((p) => (p ? { ...p, ventilator: "No" } : p));
  }, []);

  // Start New Search (spec §20): clears inputs AND results.
  const handleStartNew = useCallback(() => {
    setFormPrefs({ ...DEFAULT_SMART_MATCH_PREFS });
    setPrefs(null);
    setComparedIds([]);
    setShowComparison(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleToggleCompare = useCallback((id) => {
    setComparedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  }, []);

  const handleRemoveCompare = useCallback((id) => {
    setComparedIds((prev) => prev.filter((x) => x !== id));
  }, []);

  // Build comparison data from the live ranked results
  const comparisonHospitals = useMemo(() => {
    if (comparedIds.length === 0) return [];
    return comparedIds
      .map((id) => {
        const item = results?.all?.find((r) => r.hospital.id === id);
        return item
          ? item.hospital
          : hospitals.find((h) => h.id === id);
      })
      .filter(Boolean);
  }, [comparedIds, results, hospitals]);

  const comparisonScores = useMemo(() => {
    const map = {};
    comparedIds.forEach((id) => {
      const item = results?.all?.find((r) => r.hospital.id === id);
      if (item) map[id] = item.matchPct;
    });
    return map;
  }, [comparedIds, results]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-medical-50 text-medical-700 text-xs font-bold px-3 py-1.5 rounded-full mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          SMART MATCH — AI-READY RECOMMENDATION ENGINE
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-navy-900 mb-2">
          Find the Best ICU Match
        </h1>
        <p className="text-navy-500 max-w-lg mx-auto">
          Tell us what you need and we'll rank the strongest available ICU
          options across Karachi — with a clear reason for every
          recommendation.
        </p>
      </div>

      {/* Safety disclaimer (spec §14) */}
      <div className="flex items-start gap-2 mb-6 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 max-w-3xl mx-auto">
        <Shield className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <div className="text-xs text-amber-700">
          <p>
            <strong>IMPORTANT:</strong> Smart Match is a decision-support
            tool using available demo/mock information. It does not
            guarantee ICU availability. Always call the hospital to confirm
            before traveling.
          </p>
          <p className="mt-1">
            In a life-threatening emergency, contact your local emergency
            services immediately — do not wait for app results.
          </p>
        </div>
      </div>

      {/* Layout: form left, results right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Form Column */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-navy-100 rounded-xl p-6 shadow-sm sticky top-20">
            <h2 className="text-lg font-bold text-navy-900 mb-4">
              What does the patient need?
            </h2>
            <RecommendationForm
              prefs={formPrefs}
              onChange={setFormPrefs}
              onSubmit={handleSubmit}
              loading={loading}
            />
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7" ref={resultsRef}>
          {/* Loading — short, meaningful analysis state (spec §18) */}
          {loading && (
            <div className="bg-white border border-navy-100 rounded-xl p-10 shadow-sm flex flex-col items-center">
              <Loader2 className="w-9 h-9 text-medical-500 animate-spin mb-5" />
              <p className="text-sm font-bold text-navy-800 mb-4">
                Analyzing ICU requirements...
              </p>
              <ul className="space-y-2 w-full max-w-xs">
                {ANALYSIS_STEPS.map((step, i) => (
                  <li
                    key={step}
                    className="flex items-center gap-2 text-xs text-navy-500"
                    style={{
                      animation: "match-step-in 0.3s ease-out both",
                      animationDelay: `${i * 0.2}s`,
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-medical-400 shrink-0" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Results */}
          {!loading && results && prefs && (
            <div className="space-y-6">
              {/* Summary + Start New Search */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
                <RecommendationSummary
                  prefs={prefs}
                  onEdit={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                />
                <button
                  onClick={handleStartNew}
                  className="flex items-center justify-center gap-2 bg-white border-2 border-dashed border-navy-200 hover:border-medical-300 text-navy-600 hover:text-medical-600 font-bold text-sm px-4 rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  START NEW SEARCH
                </button>
              </div>

              {/* Results list */}
              <RecommendationResults
                results={results}
                prefs={prefs}
                comparedIds={comparedIds}
                onToggleCompare={handleToggleCompare}
                onRelaxArea={handleRelaxArea}
                onRelaxVentilator={handleRelaxVentilator}
              />

              {/* Compare section (existing comparison flow, spec §22) */}
              {comparedIds.length > 0 && (
                <div className="bg-white border border-navy-200 rounded-xl p-5 shadow-sm">
                  <button
                    onClick={() => {
                      if (!showComparison && comparedIds.length >= 2) {
                        reportDemoEvent("compare-opened");
                      }
                      setShowComparison(!showComparison);
                    }}
                    className="w-full flex items-center justify-between text-sm font-bold text-navy-900 cursor-pointer"
                    aria-expanded={showComparison}
                  >
                    <span>
                      Compare Hospitals ({comparedIds.length}/{MAX_COMPARE})
                    </span>
                    {showComparison ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {showComparison && (
                    <div className="mt-4">
                      <HospitalComparison
                        hospitals={comparisonHospitals}
                        scores={comparisonScores}
                        onRemove={handleRemoveCompare}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Initial state — before the first search (spec §19) */}
          {!loading && !results && (
            <div className="bg-white border-2 border-dashed border-navy-200 rounded-xl p-10 text-center">
              <Sparkles className="w-12 h-12 text-navy-200 mb-4 mx-auto" />
              <h3 className="text-lg font-bold text-navy-900 mb-2">
                Tell us what you need.
              </h3>
              <p className="text-sm text-navy-500 mb-6">
                We'll find the strongest available ICU options.
              </p>
              <ol className="text-xs text-navy-500 space-y-2 max-w-xs mx-auto text-left">
                {[
                  "Choose the ICU requirement",
                  "Say whether a ventilator is needed",
                  "Pick a preferred area and emergency priority",
                  "Get ranked hospitals with clear reasons",
                ].map((step, i) => (
                  <li key={step} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-medical-50 text-medical-600 font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
