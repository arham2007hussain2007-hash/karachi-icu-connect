// ── Attention Required (Admin Command Center, Step 9 Part 3) ──
// Flags hospitals ONLY when live data indicates an issue: full ICU,
// no available ventilators, or stale availability information. No fake
// emergencies. Data flow: live hospitals (HospitalDataContext) →
// centralized attention utilities in utils/availability.js.

import { useMemo } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, CheckCircle2, Eye } from "lucide-react";
import AvailabilityBadge from "./AvailabilityBadge";
import {
  getHospitalsRequiringAttention,
  getAttentionSeverityLabel,
} from "../utils/availability";

// Severity scan label styling — text + tinted chip, never color-only
const severityChip = {
  Critical: "bg-emergency-50 text-emergency-700 border-emergency-200",
  High: "bg-amber-50 text-amber-700 border-amber-200",
  Medium: "bg-navy-50 text-navy-600 border-navy-200",
  Low: "bg-teal-50 text-teal-700 border-teal-200",
};

export default function AttentionRequired({ hospitals }) {
  const flagged = useMemo(
    () => getHospitalsRequiringAttention(hospitals),
    [hospitals]
  );

  return (
    <div
      className={`bg-white border rounded-xl shadow-sm mb-8 ${
        flagged.length > 0 ? "border-amber-300" : "border-teal-200"
      }`}
    >
      <div className="p-5 pb-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-bold text-navy-900 flex items-center gap-2">
            <AlertTriangle
              className={`w-5 h-5 ${
                flagged.length > 0 ? "text-amber-500" : "text-teal-500"
              }`}
            />
            Attention Required
          </h3>
          {flagged.length > 0 && (
            <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-300 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
              <AlertTriangle className="w-3.5 h-3.5" />
              {flagged.length} hospital{flagged.length === 1 ? "" : "s"} flagged
            </span>
          )}
        </div>
        <p className="text-xs text-navy-400 mt-1 mb-4">
          Flagged by the latest reported data — full ICU, no ventilators, or
          outdated availability. Data freshness based on the latest available
          update, not real-time monitoring.
        </p>
      </div>

      {flagged.length === 0 ? (
        // ── All-clear state — never leave the section empty ──
        <div className="px-5 pb-5 flex items-center gap-2 text-sm font-semibold text-teal-700">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          No hospitals currently require attention
        </div>
      ) : (
        <div className="px-5 pb-5 space-y-3">
          {flagged.map(({ hospital, reasons, severity }) => {
            const severityLabel = getAttentionSeverityLabel(severity);
            return (
              <div
                key={hospital.id}
                className="border border-navy-100 rounded-lg p-4 hover:bg-navy-50/40 transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-navy-900 text-sm">
                        {hospital.name}
                      </p>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${
                          severityChip[severityLabel]
                        }`}
                      >
                        {severityLabel}
                      </span>
                    </div>
                    <p className="text-xs text-navy-400 mt-0.5">
                      {hospital.area}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <AvailabilityBadge hospital={hospital} />
                    <Link
                      to={`/hospital/${hospital.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-medical-600 hover:text-medical-700 bg-medical-50 hover:bg-medical-100 px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Details
                    </Link>
                  </div>
                </div>
                <ul className="mt-2.5 space-y-1">
                  {reasons.map((reason) => (
                    <li
                      key={reason}
                      className="flex items-center gap-1.5 text-xs font-semibold text-navy-700"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
