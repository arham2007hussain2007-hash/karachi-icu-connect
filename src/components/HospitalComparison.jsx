import { Link } from "react-router-dom";
import {
  Phone,
  Navigation,
  ShieldCheck,
  X,
} from "lucide-react";
import { getAvailabilityPercentage } from "../utils/availability";

export default function HospitalComparison({ hospitals, scores, onRemove }) {
  if (!hospitals || hospitals.length === 0) return null;

  const fields = [
    { label: "Match Score", key: "matchPct", format: (h) => `${scores?.[h.id] ?? "—"}%` },
    { label: "Area", key: "area", format: (h) => h.area },
    {
      label: "Available ICU Beds",
      key: "beds",
      format: (h) => `${h.availableICUBeds} / ${h.totalICUBeds}`,
    },
    {
      label: "Availability %",
      key: "availPct",
      format: (h) => `${getAvailabilityPercentage(h)}%`,
    },
    {
      label: "Ventilators",
      key: "vents",
      format: (h) => `${h.availableVentilators} / ${h.totalVentilators}`,
    },
    {
      label: "ICU Types",
      key: "icuTypes",
      format: (h) => h.icuTypes.join(", "),
    },
    {
      label: "Specialties",
      key: "specialties",
      format: (h) => h.specialties.join(", "),
    },
    {
      label: "Verified",
      key: "verified",
      format: (h) =>
        h.verified ? "Yes" : "No",
    },
  ];

  return (
    <div className="bg-white border border-navy-200 rounded-xl shadow-sm overflow-hidden">
      <div className="bg-navy-900 px-5 py-3 flex items-center justify-between">
        <h3 className="text-white font-bold text-sm">
          Compare Hospitals ({hospitals.length})
        </h3>
      </div>

      {/* Scrollable table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-navy-100 bg-navy-50">
              <th className="text-left px-4 py-2.5 font-semibold text-navy-500 text-xs">
                Attribute
              </th>
              {hospitals.map((h) => (
                <th key={h.id} className="text-left px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-navy-800 text-xs leading-tight">
                      {h.name}
                    </span>
                    {onRemove && (
                      <button
                        onClick={() => onRemove(h.id)}
                        className="text-navy-400 hover:text-emergency-500 transition-colors cursor-pointer shrink-0"
                        aria-label={`Remove ${h.name} from comparison`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fields.map((field) => (
              <tr key={field.key} className="border-b border-navy-50">
                <td className="px-4 py-2.5 text-xs font-semibold text-navy-500 whitespace-nowrap">
                  {field.label}
                </td>
                {hospitals.map((h) => (
                  <td key={h.id} className="px-4 py-2.5 text-xs text-navy-700">
                    {field.key === "verified" ? (
                      <span className="flex items-center gap-1">
                        {h.verified ? (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5 text-medical-500" />
                            <span className="text-teal-600 font-medium">Verified</span>
                          </>
                        ) : (
                          <span className="text-navy-400">Not verified</span>
                        )}
                      </span>
                    ) : (
                      field.format(h)
                    )}
                  </td>
                ))}
              </tr>
            ))}

            {/* Actions row */}
            <tr className="bg-navy-50/50">
              <td className="px-4 py-3 text-xs font-semibold text-navy-500">
                Actions
              </td>
              {hospitals.map((h) => {
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${h.latitude},${h.longitude}`;
                return (
                  <td key={h.id} className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <Link
                        to={`/hospital/${h.id}`}
                        className="text-[10px] font-semibold text-medical-600 hover:text-medical-700 bg-medical-50 px-2 py-1 rounded no-underline"
                      >
                        View Details
                      </Link>
                      <a
                        href={`tel:${h.phone}`}
                        className="text-[10px] font-semibold text-emergency-600 hover:text-emergency-700 bg-emergency-50 px-2 py-1 rounded no-underline"
                      >
                        <Phone className="w-3 h-3 inline mr-0.5" />
                        Call
                      </a>
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-semibold text-navy-600 hover:text-navy-700 bg-navy-100 px-2 py-1 rounded no-underline"
                      >
                        <Navigation className="w-3 h-3 inline mr-0.5" />
                        Directions
                      </a>
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
