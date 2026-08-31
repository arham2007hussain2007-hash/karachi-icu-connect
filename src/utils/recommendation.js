// ─────────────────────────────────────────────────────────────────────
//  SMART MATCH RECOMMENDATION ENGINE — LOCAL & DETERMINISTIC (DEMO)
// ─────────────────────────────────────────────────────────────────────
//
//  This is the explainable, rule-based scoring engine behind Smart Match.
//  It is NOT a real AI model — it is a deterministic scoring system:
//  the same inputs and the same hospital data ALWAYS produce the same
//  ranking. It does not provide medical advice or guarantee availability.
//
//  SCORING MODEL (0–100 Smart Match Score)
//  Weights per emergency priority (each column sums to 100):
//
//    Factor            Critical  Urgent  Standard
//    ─────────────────────────────────────────────
//    Availability          40      35       30
//    ICU type match        25      25       20
//    Ventilator support    20      12       15
//    Area preference        5      20       20
//    Verification          10       8       15
//
//    Critical — availability > ICU type > ventilator > verification > area
//    Urgent   — availability > ICU type > area > ventilator > verification
//    Standard — balanced weights
//
//  HARD RULES that no amount of preference points can override:
//    1. A hospital with 0 available ICU beds is NEVER recommended as a
//       match. It is listed separately as FULL ("Currently Unavailable").
//    2. When a specific ICU type is required, only EXACT matches can be
//       Best Match / Strong Alternative. Partial matches (General ICU
//       fallback) fall to "Other Options".
//    3. When a ventilator is required, hospitals with 0 available
//       ventilators cannot be Best Match / Strong Alternative.
//    4. Area preference is capped (≤ 20 pts) so it can never outweigh
//       availability (≥ 30 pts) — emergency suitability comes first.
//
//  This module is consumed through services/recommendationService.js,
//  which is the swappable seam for a future real AI/API backend.
// ─────────────────────────────────────────────────────────────────────

// ── Safe number parsing (invalid/missing values count as 0) ──
const safeNum = (val) => {
  const n = Number(val);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

// ── Factor weights per emergency priority (see header table) ──
export const PRIORITY_WEIGHTS = {
  critical: { availability: 40, icuType: 25, ventilator: 20, verification: 10, area: 5 },
  urgent: { availability: 35, icuType: 25, ventilator: 12, area: 20, verification: 8 },
  standard: { availability: 30, icuType: 20, ventilator: 15, area: 20, verification: 15 },
};

// A scored result at or above this is presented as a "strong" match (0–100).
const STRONG_SCORE_THRESHOLD = 60;

// Credit kept when the requested ICU type is missing but the hospital runs
// a General ICU that can often still admit the patient (partial match).
const PARTIAL_ICU_CREDIT = 0.4;

// ── Default Smart Match form preferences (single source of truth) ──
export const DEFAULT_SMART_MATCH_PREFS = {
  icuType: "Any ICU",
  ventilator: "No",
  area: "Any Area",
  priority: "Standard",
};

// ── Normalize any incoming priority string to a known weight key ──
const normalizePriority = (priority) => {
  const key = String(priority || "").toLowerCase();
  return PRIORITY_WEIGHTS[key] ? key : "standard";
};

// ── Deterministic one-line "why we recommend this" summary ──
function buildWhySummary(ctx) {
  if (ctx.isFull) {
    return "Currently FULL — call the hospital to ask about waitlists, transfers, or the next update.";
  }
  const parts = [];
  if (ctx.icuMatch === "exact") parts.push(`strong ${ctx.icuType} match`);
  if (ctx.bedPct > 30) parts.push("current bed availability");
  if (ctx.needsVentilator && ctx.hasVentilator) parts.push("ventilator support");
  if (ctx.areaPreferred && ctx.areaMatched) parts.push("your preferred area");
  if (ctx.verified) parts.push("verified status");
  if (parts.length === 0) {
    return "Meets your requirements with some limitations — check the details below.";
  }
  return `Recommended for ${parts.slice(0, 3).join(" + ")}.`;
}

/**
 * Score a single hospital against Smart Match preferences.
 * Fully deterministic — no randomness, no time-dependence.
 *
 * @param {Object} hospital - hospital record (live data from useHospitals)
 * @param {Object} prefs    - { icuType, ventilator, area, priority }
 * @returns {Object} scored recommendation item
 */
export function scoreHospital(hospital, prefs = {}) {
  const weights = PRIORITY_WEIGHTS[normalizePriority(prefs.priority)];

  const totalBeds = safeNum(hospital.totalICUBeds);
  const availableBeds = safeNum(hospital.availableICUBeds);
  const availableVentilators = safeNum(hospital.availableVentilators);
  const bedPct =
    totalBeds > 0 ? Math.round((availableBeds / totalBeds) * 100) : 0;
  const isFull = availableBeds === 0;

  const needsVentilator = prefs.ventilator === "Yes";
  const wantsSpecificICU = Boolean(prefs.icuType) && prefs.icuType !== "Any ICU";
  const wantsSpecificArea = Boolean(prefs.area) && prefs.area !== "Any Area";

  const reasons = [];
  const warnings = [];
  const breakdown = {};

  // ── Factor 1: Availability (the strongest factor in every mode) ──
  breakdown.availability = isFull
    ? 0
    : Math.round((bedPct / 100) * weights.availability);
  if (isFull) {
    warnings.push("No ICU beds currently available (FULL)");
  } else {
    reasons.push(
      `${availableBeds} ICU bed${availableBeds === 1 ? "" : "s"} currently available (${bedPct}%)`
    );
  }

  // ── Factor 2: ICU type match (exact / partial / none / any) ──
  let icuMatch;
  if (!wantsSpecificICU) {
    icuMatch = "any";
    breakdown.icuType = weights.icuType; // neutral — every hospital has ICUs
  } else if ((hospital.icuTypes || []).includes(prefs.icuType)) {
    icuMatch = "exact";
    breakdown.icuType = weights.icuType;
    reasons.push(`${prefs.icuType} available at this hospital`);
  } else if ((hospital.icuTypes || []).includes("General ICU")) {
    icuMatch = "partial";
    breakdown.icuType = Math.round(weights.icuType * PARTIAL_ICU_CREDIT);
    warnings.push(`No ${prefs.icuType} — General ICU only (partial match)`);
  } else {
    icuMatch = "none";
    breakdown.icuType = 0;
    warnings.push(`No ${prefs.icuType} at this hospital`);
  }

  // ── Factor 3: Ventilator support (only scored when required) ──
  if (needsVentilator) {
    if (availableVentilators > 0) {
      breakdown.ventilator = weights.ventilator;
      reasons.push(
        `${availableVentilators} ventilator${
          availableVentilators === 1 ? "" : "s"
        } available`
      );
    } else {
      breakdown.ventilator = 0;
      warnings.push("No ventilator currently available");
    }
  } else {
    // Not required — never penalize ventilator availability (spec §6).
    breakdown.ventilator = weights.ventilator;
  }

  // ── Factor 4: Area preference (convenience, capped weight) ──
  const areaMatched = !wantsSpecificArea || hospital.area === prefs.area;
  if (!wantsSpecificArea) {
    breakdown.area = weights.area;
  } else if (areaMatched) {
    breakdown.area = weights.area;
    reasons.push(`Located in your preferred area (${prefs.area})`);
  } else {
    breakdown.area = 0;
  }

  // ── Factor 5: Verification ──
  if (hospital.verified) {
    breakdown.verification = weights.verification;
    reasons.push("Verified hospital");
  } else {
    breakdown.verification = 0;
  }

  const score = Math.max(
    0,
    Math.min(
      100,
      Object.values(breakdown).reduce((sum, pts) => sum + pts, 0)
    )
  );

  // Hard-rule eligibility for Best Match / Strong Alternative
  const eligibleForStrong =
    !isFull &&
    (!wantsSpecificICU || icuMatch === "exact") &&
    (!needsVentilator || availableVentilators > 0);

  const summary = buildWhySummary({
    isFull,
    bedPct,
    icuMatch,
    icuType: prefs.icuType,
    needsVentilator,
    hasVentilator: availableVentilators > 0,
    areaPreferred: wantsSpecificArea,
    areaMatched,
    verified: Boolean(hospital.verified),
  });

  return {
    hospital,
    score,
    matchPct: score, // alias kept for the comparison table
    breakdown,
    weights, // max points per factor (for the explainable score bars)
    reasons,
    warnings,
    summary,
    icuMatch,
    requestedICUType: wantsSpecificICU ? prefs.icuType : null,
    bedPct,
    isFull,
    eligibleForStrong,
  };
}

/**
 * Produce ranked, categorized Smart Match recommendations.
 *
 * Categories (spec §11):
 *   best               — the single highest-scoring suitable hospital
 *   strongAlternatives — other suitable hospitals (score ≥ threshold)
 *   otherOptions       — usable but limited hospitals
 *   unavailable        — hospitals with 0 available ICU beds (FULL)
 *
 * @param {Object[]} hospitals - live hospital list (useHospitals())
 * @param {Object}   prefs    - Smart Match preferences
 */
export function getRecommendations(hospitals, prefs = {}) {
  const list = Array.isArray(hospitals) ? hospitals : [];
  const scored = list.map((h) => scoreHospital(h, prefs));

  // Deterministic total order: score desc → availability % desc → name A–Z.
  const byRank = (a, b) =>
    b.score - a.score ||
    b.bedPct - a.bedPct ||
    a.hospital.name.localeCompare(b.hospital.name);

  const available = scored.filter((r) => !r.isFull).sort(byRank);
  const unavailable = scored.filter((r) => r.isFull).sort(byRank);

  // Eligible hospitals (passing the hard rules) always take the top
  // display ranks — a disqualified hospital can never outrank the
  // Best Match even with a higher raw score.
  const eligible = available.filter((r) => r.eligibleForStrong);
  const ineligible = available.filter((r) => !r.eligibleForStrong);
  const displayOrder = [...eligible, ...ineligible];

  displayOrder.forEach((r, i) => {
    r.rank = i + 1;
  });
  unavailable.forEach((r, i) => {
    r.rank = i + 1;
  });

  const best = eligible.length > 0 ? eligible[0] : null;
  const strongAlternatives = eligible.filter(
    (r) => r !== best && r.score >= STRONG_SCORE_THRESHOLD
  );

  // Other Options: eligible-but-weak plus hard-rule-disqualified hospitals
  const otherOptions = ineligible
    .concat(
      eligible.filter(
        (r) => r !== best && r.score < STRONG_SCORE_THRESHOLD
      )
    )
    .sort(byRank);

  const allFull = list.length > 0 && available.length === 0;

  return {
    best,
    strongAlternatives,
    otherOptions,
    unavailable,
    all: displayOrder, // ranked available hospitals (compare flow reads this)
    allFull,        // every hospital in the dataset is FULL
    noStrongMatch: !allFull && !best, // beds exist, but none qualify
    totalCount: list.length,
  };
}
