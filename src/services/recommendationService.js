/*
 * ============================================================
 *  RECOMMENDATION SERVICE
 *  The single gateway between the Smart Match UI and the
 *  recommendation engine.
 *
 *    SmartMatch UI  →  recommendationService  →  local scoring engine
 *
 *  THIS IS A MOCK SERVICE (development/demo only).
 *  It delegates to the deterministic local scoring engine
 *  (utils/recommendation.js) and simulates a short analysis delay so
 *  the UI can display a meaningful loading state. There is no real AI
 *  backend yet — results must NOT be presented as AI-generated.
 *
 *  When a real backend is connected, replace this module with an async
 *  implementation that calls the API and returns the same result shape.
 *  The Smart Match UI will not need to change.
 * ============================================================
 */

import { getRecommendations } from "../utils/recommendation";

// Simulated analysis time (ms) — brief, but long enough to show the
// analysis steps in the UI.
const SIMULATED_ANALYSIS_MS = 950;

const mockRecommendationService = {
  /**
   * Request ranked ICU recommendations for the given preferences.
   *
   * @param {Object}   prefs     - Smart Match form preferences
   * @param {Object[]} hospitals - live hospital list (from useHospitals)
   * @returns {Promise<Object>} result shape from utils/recommendation.js
   */
  async getRecommendations(prefs, hospitals) {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_ANALYSIS_MS));
    return getRecommendations(hospitals, prefs);
  },
};

export default mockRecommendationService;
