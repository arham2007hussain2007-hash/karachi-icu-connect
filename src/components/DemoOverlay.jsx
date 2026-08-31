// ── Guided Demo overlay (Step 10 Parts 1–4) ──
// Non-intrusive bottom guide card with THREE render states:
//   1. Scenario selector (isActive && !selectedScenarioId)
//   2. Step guide        (isActive && selectedScenarioId && !isCompleted)
//   3. Completion card   (isActive && selectedScenarioId && isCompleted)
// Renders null when demo is off. Every state preserves the navy
// header (Sparkles + "Guided Demo" + pill + X) and the bottom Exit.

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  Phone,
  RotateCcw,
  Info,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useDemoMode } from "../context/DemoModeContext";

export default function DemoOverlay() {
  const {
    isActive,
    selectedScenarioId,
    isCompleted,
    currentStep,
    totalSteps,
    steps,
    currentScenario,
    scenarios,
    nextStep,
    prevStep,
    exitDemo,
    resetDemo,
    startScenario,
    completeScenario,
    clearScenario,
  } = useDemoMode();
  const navigate = useNavigate();

  // Keyboard shortcuts (only while the demo is active)
  useEffect(() => {
    if (!isActive) return;
    const onKey = (e) => {
      if (e.key === "Escape") exitDemo();
      else if (e.key === "ArrowRight") nextStep();
      else if (e.key === "ArrowLeft") prevStep();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isActive, exitDemo, nextStep, prevStep]);

  if (!isActive) return null;

  const isFirst = currentStep === 1;
  const isLast = currentStep === totalSteps;
  const step = steps[currentStep - 1];

  // ── Shared header pill text per state ──
  const pillText = !selectedScenarioId
    ? "Choose a scenario"
    : isCompleted
    ? "Scenario complete"
    : `Step ${currentStep} of ${totalSteps}`;

  return (
    <div
      role="region"
      aria-label="Guided demo"
      className="fixed inset-x-3 bottom-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:bottom-6 z-[60] sm:max-w-xl"
    >
      <div className="bg-white border-2 border-medical-500 rounded-2xl shadow-2xl shadow-navy-900/20 overflow-hidden">
        {/* ── Header strip ── */}
        <div className="bg-navy-900 px-4 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-white min-w-0">
            <Sparkles className="w-4 h-4 text-medical-400 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider truncate">
              Guided Demo
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="bg-medical-500/20 border border-medical-400/40 text-medical-200 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
              {pillText}
            </span>
            <button
              onClick={exitDemo}
              aria-label="Exit demo"
              className="p-1 rounded-md text-navy-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── STATE 1: Scenario selector ── */}
        {!selectedScenarioId && (
          <div className="px-4 pt-4 pb-3">
            <p className="text-[10px] font-bold text-navy-500 uppercase tracking-wider mb-2">
              Pick a guided demo scenario
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {scenarios.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => startScenario(s.id)}
                    className="text-left bg-navy-50 hover:bg-medical-50 border border-navy-100 hover:border-medical-300 rounded-xl p-3.5 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="bg-medical-100 text-medical-700 p-1.5 rounded-lg shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-navy-900 text-sm leading-tight">
                        {s.shortLabel}
                      </h4>
                    </div>
                    <p className="text-xs text-navy-500 leading-relaxed line-clamp-3">
                      {s.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-medical-600 mt-2 group-hover:text-medical-700">
                      Start <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STATE 2: Step guide ── */}
        {selectedScenarioId && !isCompleted && step && (
          <>
            {/* Progress dots */}
            <div
              className="px-4 pt-3 flex items-center gap-1.5"
              aria-hidden="true"
            >
              {steps.map((_, i) => {
                const idx = i + 1;
                const isCurrent = idx === currentStep;
                const isDone = idx < currentStep;
                return (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full ${
                      isCurrent
                        ? "bg-medical-500 w-6"
                        : isDone
                        ? "bg-teal-400 w-1.5"
                        : "bg-navy-200 w-1.5"
                    }`}
                  />
                );
              })}
            </div>

            {/* Step content */}
            <div
              className="px-4 pt-3 pb-4"
              aria-live="polite"
              aria-atomic="true"
            >
              <h3 className="text-lg font-bold text-navy-900">
                {step.title}
              </h3>
              <p className="text-sm text-navy-600 mt-1.5 leading-relaxed">
                {step.description}
              </p>
              {step.whyItMatters && (
                <div className="mt-3 flex items-start gap-2 bg-medical-50/70 border-l-4 border-medical-400 rounded-r-md px-2.5 py-2">
                  <Info className="w-3.5 h-3.5 text-medical-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-navy-700 leading-relaxed">
                    <span className="font-bold text-navy-800">
                      Why this matters:{" "}
                    </span>
                    {step.whyItMatters}
                  </p>
                </div>
              )}
            </div>

            {/* Primary area */}
            <div className="px-4 pb-3">
              {isLast ? (
                <div>
                  <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 mb-3">
                    <Phone className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-800">
                      <strong>Last step.</strong> Mark the scenario
                      complete to see the summary, or keep exploring the
                      current page.
                    </p>
                  </div>
                  <button
                    onClick={completeScenario}
                    className="w-full inline-flex items-center justify-center gap-2 bg-medical-500 hover:bg-medical-600 text-white font-bold text-sm px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Complete scenario
                  </button>
                  {step.recommendedAction?.route && (
                    <button
                      onClick={() => navigate(step.recommendedAction.route)}
                      className="w-full mt-2 inline-flex items-center justify-center gap-1 text-xs font-semibold text-navy-500 hover:text-medical-600 transition-colors cursor-pointer"
                    >
                      Or continue to: {step.recommendedAction.label}{" "}
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ) : step.recommendedAction ? (
                <div>
                  <p className="text-[10px] font-bold text-navy-500 uppercase tracking-wider mb-1.5">
                    Recommended action
                  </p>
                  <button
                    onClick={() => navigate(step.recommendedAction.route)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-medical-500 hover:bg-medical-600 text-white font-bold text-sm px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    {step.recommendedAction.label}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
                  <Phone className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-800">
                    Use the <strong>Call Hospital</strong> button on this
                    page to confirm availability. Please call to confirm —
                    Smart Match is decision support, not a booking system.
                  </p>
                </div>
              )}
            </div>

            {/* Secondary controls */}
            <div className="px-4 pb-3 flex items-center justify-between gap-2 flex-wrap">
              <button
                onClick={prevStep}
                disabled={isFirst}
                aria-label="Previous step"
                className="inline-flex items-center gap-1 text-xs font-semibold text-navy-500 hover:text-navy-800 disabled:opacity-40 disabled:cursor-not-allowed px-2 py-1.5 rounded-md transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
              {!isLast && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={nextStep}
                    aria-label="Continue"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-navy-500 hover:text-navy-800 px-2 py-1.5 rounded-md hover:bg-navy-50 transition-colors cursor-pointer"
                  >
                    Continue <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={resetDemo}
                    aria-label="Restart scenario"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-navy-500 hover:text-navy-800 px-2 py-1.5 rounded-md hover:bg-navy-50 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Restart
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── STATE 3: Completion card ── */}
        {selectedScenarioId && isCompleted && currentScenario && (
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-teal-100 text-teal-700 p-2 rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-navy-500 uppercase tracking-wider">
                  Demo scenario complete
                </p>
                <h3 className="text-base font-bold text-navy-900 leading-tight">
                  {currentScenario.title}
                </h3>
              </div>
            </div>
            <p className="text-xs text-navy-500 mt-2 mb-3">
              What this demonstrates:
            </p>
            <ul className="space-y-1.5 mb-4">
              {currentScenario.completion.demonstrated.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-navy-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={resetDemo}
                className="w-full inline-flex items-center justify-center gap-2 bg-medical-500 hover:bg-medical-600 text-white font-bold text-sm px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Restart scenario
              </button>
              <button
                onClick={clearScenario}
                className="w-full inline-flex items-center justify-center gap-2 bg-white border border-navy-200 hover:border-medical-400 hover:bg-medical-50 text-navy-700 hover:text-medical-700 font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                Choose another scenario
              </button>
            </div>
          </div>
        )}

        {/* ── Bottom Exit (every state) ── */}
        <div className="border-t border-navy-100 px-4 py-2 flex items-center justify-center gap-3">
          <button
            onClick={exitDemo}
            className="text-xs text-navy-400 hover:text-navy-600 font-semibold transition-colors cursor-pointer"
          >
            Exit demo
          </button>
          {selectedScenarioId && !isCompleted && (
            <>
              <span className="text-navy-200">·</span>
              <button
                onClick={clearScenario}
                className="text-xs text-navy-400 hover:text-navy-600 font-semibold transition-colors cursor-pointer"
              >
                Switch scenario
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
