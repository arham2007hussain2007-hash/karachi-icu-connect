// Utility functions for ICU availability calculations
// These functions are the single source of truth for availability logic.

// ── Safely parse a number, returning 0 for invalid/missing values ──
const safeNum = (val) => {
  const n = Number(val);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

// ── Availability percentage (how many beds are free) ──
export const getAvailabilityPercentage = (hospital) => {
  if (!hospital) return 0;
  const total = safeNum(hospital.totalICUBeds);
  const available = safeNum(hospital.availableICUBeds);
  if (total === 0) return 0;
  return Math.round((available / total) * 100);
};

// ── Occupancy percentage (how many beds are occupied) ──
export const getOccupancyPercentage = (hospital) => {
  if (!hospital) return 0;
  const total = safeNum(hospital.totalICUBeds);
  const available = safeNum(hospital.availableICUBeds);
  if (total === 0) return 0;
  return Math.round(((total - available) / total) * 100);
};

// ── Status string ──
// AVAILABLE: more than 30% beds available
// LIMITED:   greater than 0% but 30% or less available
// FULL:      0 available beds
export const getAvailabilityStatus = (hospital) => {
  if (!hospital) return "FULL";
  const available = safeNum(hospital.availableICUBeds);
  const total = safeNum(hospital.totalICUBeds);
  if (total === 0 || available === 0) return "FULL";
  const pct = (available / total) * 100;
  if (pct > 30) return "AVAILABLE";
  return "LIMITED";
};

// ── Color classes for each status ──
export const getStatusColor = (status) => {
  switch (status) {
    case "AVAILABLE":
      return {
        bg: "bg-teal-50",
        text: "text-teal-800",
        border: "border-teal-300",
        badge: "bg-teal-500",
        progress: "bg-teal-500",
        ring: "ring-teal-400",
      };
    case "LIMITED":
      return {
        bg: "bg-amber-50",
        text: "text-amber-800",
        border: "border-amber-300",
        badge: "bg-amber-500",
        progress: "bg-amber-500",
        ring: "ring-amber-400",
      };
    case "FULL":
      return {
        bg: "bg-emergency-50",
        text: "text-emergency-800",
        border: "border-emergency-300",
        badge: "bg-emergency-500",
        progress: "bg-emergency-500",
        ring: "ring-emergency-400",
      };
    default:
      return {
        bg: "bg-navy-50",
        text: "text-navy-800",
        border: "border-navy-300",
        badge: "bg-navy-500",
        progress: "bg-navy-500",
        ring: "ring-navy-400",
      };
  }
};

// ── Master filter function ──
// filters: { search, area, icuType, ventilator, availability }
export const filterHospitals = (hospitals, filters = {}) => {
  if (!hospitals || !Array.isArray(hospitals)) return [];
  let results = [...hospitals];

  // Text search — name, area, address (case-insensitive, whitespace tolerant)
  if (filters.search && filters.search.trim()) {
    const q = filters.search.trim().toLowerCase();
    results = results.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.area.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q)
    );
  }

  // Area filter
  if (filters.area && filters.area !== "All Areas") {
    results = results.filter((h) => h.area === filters.area);
  }

  // ICU type filter
  if (filters.icuType && filters.icuType !== "All ICU Types") {
    results = results.filter((h) =>
      h.icuTypes ? h.icuTypes.includes(filters.icuType) : false
    );
  }

  // Ventilator filter
  if (filters.ventilator === "Available") {
    results = results.filter(
      (h) => safeNum(h.availableVentilators) > 0
    );
  } else if (filters.ventilator === "Not Available") {
    results = results.filter(
      (h) => safeNum(h.availableVentilators) === 0
    );
  }

  // Availability status filter
  if (filters.availability && filters.availability !== "All") {
    results = results.filter((h) => {
      const status = getAvailabilityStatus(h);
      return status === filters.availability.toUpperCase();
    });
  }

  return results;
};

// ── Sort hospitals ──
// sortBy: "availability" | "name" | "area"
export const sortHospitals = (hospitals, sortBy = "availability") => {
  const sorted = [...hospitals];
  switch (sortBy) {
    case "availability":
      return sorted.sort((a, b) => {
        const pctA = a.totalICUBeds ? a.availableICUBeds / a.totalICUBeds : 0;
        const pctB = b.totalICUBeds ? b.availableICUBeds / b.totalICUBeds : 0;
        return pctB - pctA;
      });
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "area":
      return sorted.sort((a, b) => a.area.localeCompare(b.area));
    default:
      return sorted;
  }
};

// ── Format lastUpdated for display ──
// Handles ISO timestamps written by hospitalDataService (e.g. after a staff
// update) as well as legacy relative strings ("25 minutes ago"), which are
// passed through unchanged.
export const formatLastUpdated = (value) => {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value; // legacy relative text
  const now = new Date();
  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  if (date.toDateString() === now.toDateString()) return `Today, ${time}`;
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${time}`;
  }
  return `${date.toLocaleDateString([], { month: "short", day: "numeric" })}, ${time}`;
};

// ── Convert a lastUpdated value to a comparable timestamp (ms) ──
// Handles ISO timestamps written by hospitalDataService as well as legacy
// relative strings ("25 minutes ago", "1.5 hours ago"). Unknown values
// rank as 0 (oldest). Used for recency sorting/monitoring.
export const lastUpdatedTimestamp = (value) => {
  if (!value) return 0;
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) return date.getTime();
  const match = /^([\d.]+)\s*(second|minute|hour|day)s?\s+ago$/i.exec(
    String(value).trim()
  );
  if (match) {
    const amount = parseFloat(match[1]);
    const unitMs = {
      second: 1000,
      minute: 60000,
      hour: 3600000,
      day: 86400000,
    }[match[2].toLowerCase()];
    return Date.now() - amount * unitMs;
  }
  return 0;
};

// ── Data freshness (centralized — single source of truth) ──
// DEMO THRESHOLDS (tune FRESHNESS_THRESHOLDS to change):
//   FRESH — updated within the last 60 minutes
//   AGING — updated 60 minutes to 3 hours ago
//   STALE — older than 3 hours, or unknown/missing lastUpdated
// Rationale: in an emergency-triage context availability older than 3
// hours cannot be trusted. The demo dataset spans 20 minutes to 6 hours
// old, so every category occurs naturally. This is "data freshness
// based on the latest available update" — NOT real-time monitoring.
export const FRESHNESS_THRESHOLDS = {
  freshMaxMs: 60 * 60 * 1000, // 1 hour
  agingMaxMs: 3 * 60 * 60 * 1000, // 3 hours
};

export const getFreshness = (value, now = Date.now()) => {
  const ts = lastUpdatedTimestamp(value);
  if (!ts) return "STALE"; // unknown/missing → may be outdated
  const age = now - ts;
  if (age <= FRESHNESS_THRESHOLDS.freshMaxMs) return "FRESH";
  if (age <= FRESHNESS_THRESHOLDS.agingMaxMs) return "AGING";
  return "STALE";
};

// ── Attention rules (centralized — computed from live data only) ──
// A hospital requires attention when the live data shows:
//   A. FULL ICU        → availableICUBeds is 0
//   B. NO VENTILATORS  → availableVentilators is 0
//   C. STALE DATA      → getFreshness() is "STALE"
// Severity uses binary weights (4 = no ICU beds, 2 = no ventilators,
// 1 = stale) so the most critical single issue always outranks any
// combination of lesser issues — simple, explainable, no random scores:
//   6 = full ICU + no ventilators   3 = no ventilators + stale
//   5 = full ICU + stale            2 = no ventilators only
//   4 = full ICU only               1 = stale only
export const getAttentionInfo = (hospital, now = Date.now()) => {
  const noBeds = safeNum(hospital?.availableICUBeds) === 0;
  const noVents = safeNum(hospital?.availableVentilators) === 0;
  const stale = getFreshness(hospital?.lastUpdated, now) === "STALE";
  const reasons = [];
  if (noBeds) reasons.push("No ICU beds currently available");
  if (noVents) reasons.push("No ventilators currently available");
  if (stale) reasons.push("Availability information may be outdated");
  return {
    reasons,
    severity: (noBeds ? 4 : 0) + (noVents ? 2 : 0) + (stale ? 1 : 0),
  };
};

// Severity → scan label (documented mapping of the bitmask above)
export const getAttentionSeverityLabel = (severity) => {
  if (severity >= 6) return "Critical";
  if (severity >= 4) return "High";
  if (severity >= 2) return "Medium";
  return "Low";
};

// Attention list: live hospitals → flagged entries sorted by severity
// (desc), then name (asc) for a deterministic order. Never mutates input.
export const getHospitalsRequiringAttention = (hospitals, now = Date.now()) =>
  (hospitals || [])
    .map((hospital) => ({ hospital, ...getAttentionInfo(hospital, now) }))
    .filter((entry) => entry.reasons.length > 0)
    .sort(
      (a, b) =>
        b.severity - a.severity ||
        a.hospital.name.localeCompare(b.hospital.name)
    );

// ── Mock update history for dashboards ──
export const getMockUpdateHistory = () => [
  { id: 1, action: "ICU beds updated", time: "10 minutes ago", user: "Dr. Ahmed" },
  { id: 2, action: "Ventilator count updated", time: "30 minutes ago", user: "Nurse Fatima" },
  { id: 3, action: "Availability status changed to LIMITED", time: "1 hour ago", user: "Dr. Khan" },
  { id: 4, action: "ICU beds updated", time: "2 hours ago", user: "Dr. Ahmed" },
  { id: 5, action: "Emergency admission recorded", time: "3 hours ago", user: "Nurse Zainab" },
];

export const getMockAdminActivity = () => [
  { id: 1, action: "Hospital 'South City Hospital' verified", time: "1 hour ago" },
  { id: 2, action: "New staff account created for 'Indus Hospital'", time: "2 hours ago" },
  { id: 3, action: "Hospital 'Abbasi Shaheed Hospital' flagged for review", time: "3 hours ago" },
  { id: 4, action: "Platform maintenance completed", time: "5 hours ago" },
  { id: 5, action: "New hospital 'Medicare Cardiac & General Hospital' registered", time: "1 day ago" },
  { id: 6, action: "User report resolved for 'National Medical Centre'", time: "1 day ago" },
];
