// ── Hospital Monitoring (Admin Command Center, Step 9 Part 2) ──
// Live, read-only monitoring of every hospital in the network.
// Data flow: live hospitals (HospitalDataContext) → filters → sorted
// derived results. The shared hospital array is NEVER mutated —
// filter() and the sort copy always operate on new arrays.

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Check,
  X,
  Wind,
  Clock,
  SlidersHorizontal,
  SearchX,
} from "lucide-react";
import AvailabilityBadge from "./AvailabilityBadge";
import FreshnessBadge from "./FreshnessBadge";
import { StatusBadge } from "./DashboardUI";
import {
  getAvailabilityStatus,
  getAvailabilityPercentage,
  formatLastUpdated,
  lastUpdatedTimestamp,
  getFreshness,
} from "../utils/availability";

// ── Sorting options (Step 9 Part 2 spec) ──
const SORT_OPTIONS = [
  { value: "name", label: "Hospital Name" },
  { value: "beds-desc", label: "Most Available ICU Beds" },
  { value: "beds-asc", label: "Least Available ICU Beds" },
  { value: "pct-desc", label: "Highest Availability Percentage" },
  { value: "pct-asc", label: "Lowest Availability Percentage" },
  { value: "updated-desc", label: "Most Recently Updated" },
  { value: "updated-asc", label: "Least Recently Updated" },
];

const AVAILABILITY_FILTERS = [
  { value: "All", label: "All" },
  { value: "AVAILABLE", label: "Available" },
  { value: "LIMITED", label: "Limited" },
  { value: "FULL", label: "Full" },
];

const VERIFICATION_FILTERS = ["All", "Verified", "Not Verified"];

const selectClass =
  "w-full bg-white border border-navy-200 rounded-lg px-3 py-2 text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-medical-400 cursor-pointer";

// Verification status comes from the Step 6 verification workflow state,
// with the hospital record itself as a fallback.
const verificationOf = (hospital, statuses) =>
  statuses[hospital.id] || (hospital.verified ? "VERIFIED" : "PENDING");

export default function HospitalMonitoring({ hospitals, statuses, onSetHospitalStatus }) {
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [areaFilter, setAreaFilter] = useState("All Areas");
  const [verificationFilter, setVerificationFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  // Areas derived from the live dataset — never hardcoded
  const areaOptions = useMemo(
    () =>
      [...new Set(hospitals.map((h) => h.area))].sort((a, b) =>
        a.localeCompare(b)
      ),
    [hospitals]
  );

  // live hospitals → filters → sorted derived results.
  // All filters must be satisfied together (AND), then sorting is applied
  // to a fresh copy so the shared hospital data remains unchanged.
  const monitoredHospitals = useMemo(() => {
    const filtered = hospitals.filter((h) => {
      if (
        availabilityFilter !== "All" &&
        getAvailabilityStatus(h) !== availabilityFilter
      ) {
        return false;
      }
      if (areaFilter !== "All Areas" && h.area !== areaFilter) {
        return false;
      }
      if (verificationFilter !== "All") {
        const verified = verificationOf(h, statuses) === "VERIFIED";
        if (verificationFilter === "Verified" && !verified) return false;
        if (verificationFilter === "Not Verified" && verified) return false;
      }
      return true;
    });

    const sorted = [...filtered]; // derived copy — original data untouched
    switch (sortBy) {
      case "beds-desc":
        sorted.sort((a, b) => (b.availableICUBeds ?? 0) - (a.availableICUBeds ?? 0));
        break;
      case "beds-asc":
        sorted.sort((a, b) => (a.availableICUBeds ?? 0) - (b.availableICUBeds ?? 0));
        break;
      case "pct-desc":
        sorted.sort(
          (a, b) => getAvailabilityPercentage(b) - getAvailabilityPercentage(a)
        );
        break;
      case "pct-asc":
        sorted.sort(
          (a, b) => getAvailabilityPercentage(a) - getAvailabilityPercentage(b)
        );
        break;
      case "updated-desc":
        sorted.sort(
          (a, b) =>
            lastUpdatedTimestamp(b.lastUpdated) - lastUpdatedTimestamp(a.lastUpdated)
        );
        break;
      case "updated-asc":
        sorted.sort(
          (a, b) =>
            lastUpdatedTimestamp(a.lastUpdated) - lastUpdatedTimestamp(b.lastUpdated)
        );
        break;
      default: // "name"
        sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sorted;
  }, [hospitals, statuses, availabilityFilter, areaFilter, verificationFilter, sortBy]);

  const hasActiveFilters =
    availabilityFilter !== "All" ||
    areaFilter !== "All Areas" ||
    verificationFilter !== "All";

  const clearFilters = () => {
    setAvailabilityFilter("All");
    setAreaFilter("All Areas");
    setVerificationFilter("All");
  };

  const pctColorClass = (pct) =>
    pct > 30 ? "text-teal-600" : pct > 0 ? "text-amber-600" : "text-emergency-600";
  const pctBarClass = (pct) =>
    pct > 30 ? "bg-teal-500" : pct > 0 ? "bg-amber-500" : "bg-emergency-500";

  return (
    <div>
      {/* Section heading */}
      <div className="mb-5">
        <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-medical-500" />
          Hospital Monitoring
        </h2>
        <p className="text-sm text-navy-500 mt-1">
          Read-only view of every hospital in the network — filter and sort to
          inspect specific facilities. Admins cannot edit availability data.
        </p>
      </div>

      {/* Filters & sorting */}
      <div className="bg-white border border-navy-100 rounded-xl shadow-sm p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <div>
            <label
              htmlFor="mon-availability"
              className="block text-xs font-semibold text-navy-600 mb-1"
            >
              Availability Status
            </label>
            <select
              id="mon-availability"
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className={selectClass}
            >
              {AVAILABILITY_FILTERS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="mon-area"
              className="block text-xs font-semibold text-navy-600 mb-1"
            >
              Area
            </label>
            <select
              id="mon-area"
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className={selectClass}
            >
              <option value="All Areas">All Areas</option>
              {areaOptions.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="mon-verification"
              className="block text-xs font-semibold text-navy-600 mb-1"
            >
              Verification Status
            </label>
            <select
              id="mon-verification"
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className={selectClass}
            >
              {VERIFICATION_FILTERS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="mon-sort"
              className="block text-xs font-semibold text-navy-600 mb-1"
            >
              Sort By
            </label>
            <select
              id="mon-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={selectClass}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results count + clear filters */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <p className="text-sm text-navy-500">
          Showing{" "}
          <span className="font-bold text-navy-900">
            {monitoredHospitals.length}
          </span>{" "}
          of {hospitals.length} hospitals
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs font-bold text-medical-600 hover:text-medical-700 bg-medical-50 hover:bg-medical-100 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        )}
      </div>

      {monitoredHospitals.length === 0 ? (
        // ── Empty state — never leave the monitoring section blank ──
        <div className="bg-white border border-navy-100 rounded-xl shadow-sm p-12 flex flex-col items-center text-center">
          <SearchX className="w-10 h-10 text-navy-300 mb-3" />
          <p className="text-sm font-bold text-navy-800">
            No hospitals match the current filters.
          </p>
          <p className="text-xs text-navy-400 mt-1 mb-5">
            Try changing or clearing the availability, area, or verification
            filters.
          </p>
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-2 bg-medical-500 hover:bg-medical-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          {/* ── Desktop / large screens: monitoring table ── */}
          <div className="hidden xl:block bg-white border border-navy-100 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy-50 border-b border-navy-100">
                  <th className="text-left px-5 py-3 font-semibold text-navy-700">
                    Hospital
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-navy-700">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-navy-700">
                    ICU Beds
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-navy-700">
                    Ventilators
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-navy-700">
                    Verification
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-navy-700">
                    Last Updated
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-navy-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {monitoredHospitals.map((h) => {
                  const pct = getAvailabilityPercentage(h);
                  return (
                    <tr
                      key={h.id}
                      className="border-b border-navy-50 last:border-b-0 hover:bg-navy-50/50"
                    >
                      <td className="px-5 py-3">
                        <p className="font-semibold text-navy-900">{h.name}</p>
                        <p className="text-xs text-navy-400 mt-0.5">{h.area}</p>
                      </td>
                      <td className="px-4 py-3">
                        <AvailabilityBadge hospital={h} />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-navy-800">
                          {h.availableICUBeds} / {h.totalICUBeds}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="w-12 bg-navy-100 rounded-full h-1.5 shrink-0">
                            <div
                              className={`h-1.5 rounded-full ${pctBarClass(pct)}`}
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                          <span
                            className={`text-xs font-bold ${pctColorClass(pct)}`}
                          >
                            {pct}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-navy-800 whitespace-nowrap">
                          <Wind className="w-3.5 h-3.5 text-navy-400" />
                          {h.availableVentilators} / {h.totalVentilators}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={verificationOf(h, statuses)} />
                      </td>
                      <td className="px-4 py-3 text-navy-500 whitespace-nowrap">
                        <div className="flex flex-col items-start gap-1">
                          <FreshnessBadge freshness={getFreshness(h.lastUpdated)} />
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-navy-300 shrink-0" />
                            {formatLastUpdated(h.lastUpdated)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/hospital/${h.id}`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-medical-600 hover:text-medical-700 bg-medical-50 hover:bg-medical-100 px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View Details
                          </Link>
                          <button
                            onClick={() => onSetHospitalStatus(h.id, "VERIFIED")}
                            title="Verify"
                            className="p-1.5 rounded-md bg-teal-50 hover:bg-teal-100 text-teal-600 transition-colors cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onSetHospitalStatus(h.id, "REJECTED")}
                            title="Reject"
                            className="p-1.5 rounded-md bg-emergency-50 hover:bg-emergency-100 text-emergency-600 transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Smaller screens: responsive monitoring cards ── */}
          <div className="xl:hidden space-y-3">
            {monitoredHospitals.map((h) => {
              const pct = getAvailabilityPercentage(h);
              return (
                <div
                  key={h.id}
                  className="bg-white border border-navy-100 rounded-xl shadow-sm p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-navy-900 text-sm leading-snug">
                        {h.name}
                      </p>
                      <p className="text-xs text-navy-400 mt-0.5">{h.area}</p>
                    </div>
                    <AvailabilityBadge hospital={h} />
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="bg-navy-50 rounded-lg px-2.5 py-2">
                      <p className="text-[10px] font-bold text-navy-400 uppercase tracking-wide">
                        ICU Beds
                      </p>
                      <p className="text-sm font-bold text-navy-900 mt-0.5">
                        {h.availableICUBeds} / {h.totalICUBeds}
                      </p>
                      <p className={`text-xs font-bold mt-0.5 ${pctColorClass(pct)}`}>
                        {pct}% free
                      </p>
                    </div>
                    <div className="bg-navy-50 rounded-lg px-2.5 py-2">
                      <p className="text-[10px] font-bold text-navy-400 uppercase tracking-wide">
                        Ventilators
                      </p>
                      <p className="text-sm font-bold text-navy-900 mt-0.5">
                        {h.availableVentilators} / {h.totalVentilators}
                      </p>
                      <p className="text-xs text-navy-400 mt-0.5">available</p>
                    </div>
                    <div className="bg-navy-50 rounded-lg px-2.5 py-2">
                      <p className="text-[10px] font-bold text-navy-400 uppercase tracking-wide">
                        Verification
                      </p>
                      <div className="mt-1">
                        <StatusBadge status={verificationOf(h, statuses)} />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-navy-50">
                    <span className="inline-flex items-center gap-1.5 text-xs text-navy-400">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      Updated {formatLastUpdated(h.lastUpdated)}
                    </span>
                    <FreshnessBadge freshness={getFreshness(h.lastUpdated)} />
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onSetHospitalStatus(h.id, "VERIFIED")}
                        title="Verify"
                        className="p-1.5 rounded-md bg-teal-50 hover:bg-teal-100 text-teal-600 transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onSetHospitalStatus(h.id, "REJECTED")}
                        title="Reject"
                        className="p-1.5 rounded-md bg-emergency-50 hover:bg-emergency-100 text-emergency-600 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        to={`/hospital/${h.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-medical-600 hover:text-medical-700 bg-medical-50 hover:bg-medical-100 px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
