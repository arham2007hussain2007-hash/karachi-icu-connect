// ── Demo Mode (Step 10 Parts 1–4) ──
// Centralized, backend-independent state for the guided demo + the
// new controlled demo scenarios (Part 4). The normal app is
// completely unaffected when Demo Mode is off — the overlay renders
// nothing, no routes change, and no data is touched.
//
// Scenario architecture: src/demo/demoScenarios.js is the single
// source of truth. The selected scenario drives the overlay's steps,
// the route listener, and the event→step map. Step advancement
// uses a monotonic "highest reached" rule so browser Back and
// flexible exploration are tolerated without breaking demo state.

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { useLocation } from "react-router-dom";
import { SCENARIOS } from "../demo/demoScenarios";

const DemoModeContext = createContext(null);

// Route → expected demo step (per-scenario, generic). Step 5
// (Compare) and scenario C's "update" step use events, not routes.
function matchedStepIndex(scenario, pathname) {
  if (!scenario) return -1;
  // Use findLastIndex so the listener advances to the MOST ADVANCED
  // matching step (e.g. on /staff in scenario C, it must reach step 1
  // "Update" not step 0 "Login"). With findIndex, overlapping
  // advanceOnRoutes between earlier and later steps would short-circuit
  // to the earlier step and block auto-advance.
  return scenario.steps.findLastIndex((step) =>
    (step.advanceOnRoutes || []).some(
      (r) =>
        r === pathname ||
        // Prefix match only for paths like "/hospital/" that end in "/"
        // AND have content beyond the bare root — otherwise the bare "/"
        // would match every pathname and prevent the listener from ever
        // advancing past step 1.
        (r.length > 1 && r.endsWith("/") && pathname.startsWith(r))
    )
  );
}

export function DemoModeProvider({ children }) {
  const [isActive, setIsActive] = useState(false);
  const [selectedScenarioId, setSelectedScenarioId] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentScenario = useMemo(
    () => SCENARIOS.find((s) => s.id === selectedScenarioId) || null,
    [selectedScenarioId]
  );
  const steps = currentScenario ? currentScenario.steps : [];
  const totalSteps = steps.length;

  // Centralized route-driven step advancement (per-scenario,
  // monotonic, change-driven). The ref makes the listener react
  // only to actual navigation events.
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);
  useEffect(() => {
    if (location.pathname === prevPathRef.current) return;
    prevPathRef.current = location.pathname;
    if (!isActive) return;
    if (!currentScenario) return;
    const idx = matchedStepIndex(currentScenario, location.pathname);
    if (idx >= 0) {
      setCurrentStep((s) => Math.max(s, idx + 1));
    }
  }, [location.pathname, isActive, currentScenario]);

  // Open the demo (e.g. from the Hero button). The overlay renders
  // the scenario selector until a scenario is chosen.
  const startDemo = useCallback(() => {
    setSelectedScenarioId(null);
    setCurrentStep(1);
    setIsCompleted(false);
    setIsActive(true);
  }, []);

  // Pick a scenario and start its guided tour from step 1.
  const startScenario = useCallback((scenarioId) => {
    setSelectedScenarioId(scenarioId);
    setCurrentStep(1);
    setIsCompleted(false);
    setIsActive(true);
  }, []);

  const exitDemo = useCallback(() => {
    setIsActive(false);
    setSelectedScenarioId(null);
    setCurrentStep(1);
    setIsCompleted(false);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, totalSteps));
  }, [totalSteps]);

  const prevStep = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 1));
  }, []);

  // Demo Reset / Restart scenario: clears only demo progress
  // (current step + completion). Keeps the active scenario and
  // never touches hospital data, the activity log, or auth.
  const resetDemo = useCallback(() => {
    setCurrentStep(1);
    setIsCompleted(false);
  }, []);

  // Mark the current scenario complete (shows the completion card).
  const completeScenario = useCallback(() => {
    setIsCompleted(true);
  }, []);

  // Return to the scenario selector (keeps the demo active).
  const clearScenario = useCallback(() => {
    setSelectedScenarioId(null);
    setCurrentStep(1);
    setIsCompleted(false);
  }, []);

  // Page events notify the demo of meaningful progress. No-op when
  // the demo isn't active or the current scenario doesn't map the
  // event. Pages can call it freely without coupling to demo state.
  const reportDemoEvent = useCallback(
    (eventType) => {
      if (!isActive) return;
      if (!currentScenario || !currentScenario.events) return;
      const target = currentScenario.events[eventType];
      if (typeof target === "number") {
        setCurrentStep((s) => Math.max(s, target));
      }
    },
    [isActive, currentScenario]
  );

  const goToStep = useCallback(
    (n) => setCurrentStep(Math.max(1, Math.min(n, totalSteps))),
    [totalSteps]
  );

  const value = useMemo(
    () => ({
      isActive,
      selectedScenarioId,
      isCompleted,
      currentStep,
      totalSteps,
      steps,
      currentScenario,
      scenarios: SCENARIOS,
      startDemo,
      startScenario,
      exitDemo,
      nextStep,
      prevStep,
      resetDemo,
      completeScenario,
      clearScenario,
      goToStep,
      reportDemoEvent,
    }),
    [
      isActive,
      selectedScenarioId,
      isCompleted,
      currentStep,
      totalSteps,
      steps,
      currentScenario,
      startDemo,
      startScenario,
      exitDemo,
      nextStep,
      prevStep,
      resetDemo,
      completeScenario,
      clearScenario,
      goToStep,
      reportDemoEvent,
    ]
  );

  return (
    <DemoModeContext.Provider value={value}>
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode() {
  const ctx = useContext(DemoModeContext);
  if (!ctx) {
    throw new Error("useDemoMode must be used within a DemoModeProvider");
  }
  return ctx;
}
