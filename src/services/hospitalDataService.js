/*
 * ============================================================
 *  MOCK HOSPITAL DATA SERVICE — DEVELOPMENT/DEMO ONLY.
 *
 *  Availability updates from hospital staff are stored in
 *  localStorage and merged on top of the base dataset
 *  (data/hospitals.js). This is NOT a real data source.
 *
 *  The UI only consumes the interface below, so this mock can
 *  later be replaced with realHospitalDataService (REST API /
 *  database) without rebuilding any components.
 *
 *  Interface:
 *    getHospitals() → merged hospital list
 *    fetchHospitals() → Promise<merged hospital list> (async + validated)
 *    getHospitalById(id) → hospital | null
 *    updateHospitalAvailability(hospitalId, updates) → Promise<hospital>
 *      (records a REAL activity entry after a successful save)
 *    fetchActivityLog() → Promise<activity entries> (most recent first)
 *    resetAllOverrides() → clears local demo overrides + activity log
 * ============================================================
 */

import hospitals from "../data/hospitals";
import { getAvailabilityStatus } from "../utils/availability";

const STORAGE_KEY = "karachi_icu_hospital_overrides";
const ACTIVITY_KEY = "karachi_icu_activity_log";

// Configurable cap on stored activity — keep only a reasonable recent
// history (Step 9 Part 4). Tune this single constant to change it.
export const ACTIVITY_LOG_LIMIT = 50;

// Simulated latency for the async activity read so the Admin UI gets a
// real loading path (same pattern as fetchHospitals).
const SIMULATED_ACTIVITY_READ_MS = 250;

// Availability fields tracked for change detection, with admin-readable
// labels used in activity descriptions.
const TRACKED_FIELDS = [
  { key: "availableICUBeds", label: "Available ICU beds" },
  { key: "totalICUBeds", label: "Total ICU beds" },
  { key: "availableVentilators", label: "Available ventilators" },
  { key: "totalVentilators", label: "Total ventilators" },
];

// ── localStorage helpers ────────────────────────────────────
function readOverrides() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeOverrides(overrides) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    throw new Error("Could not save the update locally. Please try again.");
  }
}

// ── Activity log (Step 9 Part 4) ────────────────────────────
// REAL activity only: entries are generated inside
// updateHospitalAvailability AFTER a successful save by comparing the
// previous merged data with the saved data. Nothing is recorded for
// failed validation, failed saves, discarded changes, or saves with no
// meaningful change. All localStorage access stays in this service —
// UI components read through fetchActivityLog(). A future backend
// replaces the storage here without rewriting the Admin UI.

function readActivityLog() {
  const raw = localStorage.getItem(ACTIVITY_KEY);
  if (!raw) return [];
  const parsed = JSON.parse(raw); // throws on corrupt data → error state
  if (!Array.isArray(parsed)) {
    throw new Error("Activity log is corrupted.");
  }
  return parsed
    .filter(
      (entry) =>
        entry &&
        typeof entry === "object" &&
        entry.id &&
        entry.hospitalId &&
        entry.hospitalName &&
        entry.timestamp &&
        Array.isArray(entry.changes)
    )
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, ACTIVITY_LOG_LIMIT);
}

function writeActivityLog(entries) {
  localStorage.setItem(
    ACTIVITY_KEY,
    JSON.stringify(entries.slice(0, ACTIVITY_LOG_LIMIT))
  );
}

// Compare previous vs saved availability. Returns an activity entry, or
// null when nothing meaningful changed (no duplicate activity for no-op
// saves). Status transitions reuse the centralized getAvailabilityStatus.
function buildActivityEntry(previous, saved) {
  const changes = TRACKED_FIELDS.filter(
    ({ key }) => saved[key] !== previous[key]
  ).map(({ key, label }) => ({
    field: key,
    label,
    from: previous[key],
    to: saved[key],
  }));

  const statusFrom = getAvailabilityStatus(previous);
  const statusTo = getAvailabilityStatus(saved);
  const statusChange =
    statusFrom !== statusTo ? { from: statusFrom, to: statusTo } : null;

  if (changes.length === 0 && !statusChange) return null;

  // Short summary of what the update touched
  const touchedIcu = changes.some((c) => c.field.endsWith("ICUBeds"));
  const touchedVent = changes.some((c) => c.field.endsWith("Ventilators"));
  let summary;
  if (touchedIcu && touchedVent) summary = "updated ICU and ventilator availability";
  else if (touchedIcu) summary = "updated ICU availability";
  else if (touchedVent) summary = "updated ventilator availability";
  else summary = "reported an availability status change";

  return {
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    hospitalId: saved.id,
    hospitalName: saved.name,
    timestamp: new Date().toISOString(),
    summary,
    changes,
    statusChange,
  };
}

// Best-effort: a failure while writing the activity log must never fail
// an availability save that has already succeeded.
function recordActivity(previous, saved) {
  try {
    const entry = buildActivityEntry(previous, saved);
    if (!entry) return;
    let entries = [];
    try {
      entries = readActivityLog();
    } catch {
      entries = []; // corrupt log → start a fresh history
    }
    writeActivityLog([entry, ...entries]);
  } catch {
    // Activity recording is non-critical; ignore storage failures.
  }
}

// ── Merge base dataset with saved availability overrides ────
function getMergedHospitals() {
  const overrides = readOverrides();
  return hospitals.map((h) =>
    overrides[h.id] ? { ...h, ...overrides[h.id] } : { ...h }
  );
}

const mockHospitalDataService = {
  /** Full hospital list with locally saved availability updates applied. */
  getHospitals() {
    return getMergedHospitals();
  },

  getHospitalById(id) {
    return getMergedHospitals().find((h) => h.id === id) || null;
  },

  /**
   * Async fetch of the merged hospital list.
   *
   * Simulates a network round-trip so the data layer can surface real
   * loading and error states (see context/HospitalDataContext). A real
   * backend service replaces this with an HTTP call — same contract.
   */
  async fetchHospitals() {
    await new Promise((r) => setTimeout(r, 500));
    const list = getMergedHospitals();
    if (!Array.isArray(list) || list.length === 0) {
      throw new Error("No hospital data available.");
    }
    return list;
  },

  /**
   * Validate and persist an availability update for one hospital.
   * Sets lastUpdated to the current timestamp.
   *
   * updates: {
   *   totalICUBeds, availableICUBeds,
   *   totalVentilators, availableVentilators
   * }
   */
  async updateHospitalAvailability(hospitalId, updates) {
    // Simulated network latency so the UI can show a loading state
    await new Promise((r) => setTimeout(r, 600));

    const base = hospitals.find((h) => h.id === hospitalId);
    if (!base) throw new Error("Hospital not found.");

    // Merged state BEFORE this save — the baseline for change detection
    const previous = this.getHospitalById(hospitalId);

    const {
      totalICUBeds,
      availableICUBeds,
      totalVentilators,
      availableVentilators,
    } = updates;
    const values = {
      totalICUBeds,
      availableICUBeds,
      totalVentilators,
      availableVentilators,
    };

    // Defense-in-depth validation (the UI validates first)
    for (const [key, value] of Object.entries(values)) {
      if (!Number.isFinite(value) || value < 0 || !Number.isInteger(value)) {
        throw new Error(`Invalid value for ${key}. Please enter a valid whole number.`);
      }
    }
    if (availableICUBeds > totalICUBeds) {
      throw new Error("Available beds cannot exceed total beds.");
    }
    if (availableVentilators > totalVentilators) {
      throw new Error("Available ventilators cannot exceed total ventilators.");
    }

    const overrides = readOverrides();
    overrides[hospitalId] = {
      ...(overrides[hospitalId] || {}),
      ...values,
      lastUpdated: new Date().toISOString(),
    };
    writeOverrides(overrides);

    const saved = { ...base, ...overrides[hospitalId] };

    // Activity is recorded ONLY here, after a successful save — a failed
    // validation or storage write above throws before reaching this line.
    recordActivity(previous, saved);

    return saved;
  },

  /**
   * Recent REAL activity: successful availability updates recorded by
   * this service. Async + validated like fetchHospitals so the Admin UI
   * gets a real loading/error path. Most recent first.
   */
  async fetchActivityLog() {
    await new Promise((r) => setTimeout(r, SIMULATED_ACTIVITY_READ_MS));
    return readActivityLog();
  },

  /** Clear all local overrides + activity history (demo utility). */
  resetAllOverrides() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVITY_KEY);
  },
};

export default mockHospitalDataService;
