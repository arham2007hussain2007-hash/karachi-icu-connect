import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Navigation,
  ShieldCheck,
  ShieldX,
  Wind,
  BedDouble,
  CheckCircle2,
  AlertTriangle,
  Square,
  Clock,
  Map as MapIcon,
} from "lucide-react";
import AvailabilityBadge from "./AvailabilityBadge";
import MatchScore from "./MatchScore";
import { formatLastUpdated } from "../utils/availability";

// ── ICU type match chip: exact / partial / none / any ──
function ICUMatchChip({ icuMatch, icuType }) {
  const label =
    icuMatch === "exact"
      ? `Exact match — ${icuType}`
      : icuMatch === "partial"
      ? `Partial — General ICU only`
      : icuMatch === "none"
      ? `No ${icuType}`
      : "Any ICU accepted";
  const styles =
    icuMatch === "exact"
      ? "bg-teal-50 text-teal-700 border-teal-200"
      : icuMatch === "partial"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : icuMatch === "none"
      ? "bg-emergency-50 text-emergency-700 border-emergency-200"
      : "bg-navy-50 text-navy-600 border-navy-200";
  return (
    <span
      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${styles}`}
    >
      {label}
    </span>
  );
}

// ── Explainable score factor bars (points earned / max per factor) ──
function ScoreFactors({ item }) {
  const { breakdown, weights } = item;
  const factors = [
    { key: "availability", label: "Availability" },
    { key: "icuType", label: "ICU type" },
    { key: "ventilator", label: "Ventilator" },
    { key: "area", label: "Area" },
    { key: "verification", label: "Verified" },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
      {factors.map((f) => {
        const earned = breakdown[f.key] || 0;
        const max = weights[f.key] || 0;
        const pct = max > 0 ? Math.round((earned / max) * 100) : 0;
        return (
          <div key={f.key} className="flex items-center gap-2">
            <span className="w-16 text-[10px] text-navy-500 shrink-0">
              {f.label}
            </span>
            <div className="flex-1 bg-navy-100 rounded-full h-1.5 min-w-0">
              <div
                className={`h-1.5 rounded-full ${
                  pct >= 60
                    ? "bg-teal-500"
                    : pct > 0
                    ? "bg-amber-500"
                    : "bg-emergency-300"
                }`}
                style={{ width: `${pct}%` }}
              ></div>
            </div>
            <span className="text-[10px] font-semibold text-navy-600 w-9 text-right shrink-0">
              {earned}/{max}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Explainable Smart Match result card.
 * `variant` = "best" | "strong" | "other" controls emphasis and the
 * emergency CTA layout (CALL HOSPITAL is primary for the best match).
 */
export default function RecommendationCard({
  item,
  variant = "other",
  isCompared,
  onToggleCompare,
}) {
  const { hospital, score, reasons, warnings, summary, icuMatch } = item;
  const isBest = variant === "best";
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${hospital.latitude},${hospital.longitude}`;

  return (
    <div
      className={`bg-white border rounded-xl shadow-sm overflow-hidden transition-all ${
        isBest
          ? "border-medical-300 ring-2 ring-medical-100"
          : variant === "strong"
          ? "border-teal-200"
          : "border-navy-100"
      }`}
    >
      {/* Top ribbon */}
      {isBest && (
        <div className="bg-medical-500 text-white text-center py-1.5 text-xs font-bold tracking-wide">
          BEST MATCH — RANK #1
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Smart Match Score */}
          <MatchScore score={score} label="SMART MATCH" />

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {!isBest && (
                <span className="text-xs font-bold text-navy-400 bg-navy-50 px-2 py-0.5 rounded">
                  #{item.rank}
                </span>
              )}
              <h3 className="font-bold text-navy-900 text-base leading-snug">
                {hospital.name}
              </h3>
              {hospital.verified ? (
                <ShieldCheck
                  className="w-4 h-4 text-medical-500 shrink-0"
                  title="Verified hospital"
                />
              ) : (
                <ShieldX
                  className="w-4 h-4 text-navy-300 shrink-0"
                  title="Not verified"
                />
              )}
            </div>

            <div className="flex items-center gap-3 text-sm text-navy-500 mb-2 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {hospital.area}
              </span>
              <AvailabilityBadge hospital={hospital} />
              <ICUMatchChip icuMatch={icuMatch} icuType={item.requestedICUType} />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-navy-600 mb-3">
              <span className="flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5 text-medical-500" />
                <strong>{hospital.availableICUBeds}</strong>/{hospital.totalICUBeds} beds
                <span className="text-navy-400">({item.bedPct}%)</span>
              </span>
              <span className="flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-medical-500" />
                {hospital.availableVentilators}/{hospital.totalVentilators} ventilators
              </span>
              <span className="flex items-center gap-1 text-navy-400">
                <Clock className="w-3.5 h-3.5" />
                Updated {formatLastUpdated(hospital.lastUpdated)}
              </span>
            </div>

            {/* ICU types */}
            <div className="flex flex-wrap gap-1">
              {hospital.icuTypes.map((t) => (
                <span
                  key={t}
                  className="bg-navy-50 text-navy-600 text-[10px] px-2 py-0.5 rounded"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Why this matches — generated from the actual scoring factors */}
        <div className="mt-4 pt-3 border-t border-navy-50">
          <p className="text-[10px] font-semibold text-navy-400 uppercase tracking-wide mb-1.5">
            Why this matches
          </p>
          <p className="text-xs text-navy-700 font-medium mb-2">{summary}</p>
          <ul className="space-y-1 mb-2">
            {reasons.map((r) => (
              <li
                key={r}
                className="flex items-start gap-1.5 text-xs text-navy-600"
              >
                <CheckCircle2 className="w-3 h-3 text-teal-500 shrink-0 mt-0.5" />
                {r}
              </li>
            ))}
            {warnings.map((w) => (
              <li
                key={w}
                className="flex items-start gap-1.5 text-xs text-amber-700"
              >
                <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                {w}
              </li>
            ))}
          </ul>

          {/* Explainable score factors */}
          <div className="mt-2 pt-2 border-t border-navy-50">
            <p className="text-[10px] font-semibold text-navy-400 uppercase tracking-wide mb-1.5">
              Smart Match score factors
            </p>
            <ScoreFactors item={item} />
          </div>
        </div>

        {/* Actions */}
        {isBest ? (
          <div className="mt-4 space-y-2">
            {/* Emergency CTA — CALL HOSPITAL is the primary action */}
            <a
              href={`tel:${hospital.phone}`}
              className="w-full flex items-center justify-center gap-2 bg-emergency-500 hover:bg-emergency-600 text-white font-bold py-3.5 rounded-lg text-sm transition-colors no-underline"
            >
              <Phone className="w-4 h-4" />
              CALL HOSPITAL
            </a>
            <div className="flex flex-wrap gap-2">
              <Link
                to={`/hospital/${hospital.id}`}
                className="flex-1 flex items-center justify-center gap-1.5 bg-medical-500 hover:bg-medical-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors no-underline"
              >
                View Details
              </Link>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 bg-navy-100 hover:bg-navy-200 text-navy-800 text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors no-underline"
              >
                <Navigation className="w-3.5 h-3.5" />
                Get Directions
              </a>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to={`/hospital/${hospital.id}`}
              className="flex items-center gap-1.5 bg-medical-500 hover:bg-medical-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors no-underline"
            >
              View Details
            </Link>
            <a
              href={`tel:${hospital.phone}`}
              className="flex items-center gap-1.5 bg-emergency-500 hover:bg-emergency-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors no-underline"
            >
              <Phone className="w-3.5 h-3.5" />
              Call Hospital
            </a>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-navy-100 hover:bg-navy-200 text-navy-800 text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors no-underline"
            >
              <Navigation className="w-3.5 h-3.5" />
              Directions
            </a>
          </div>
        )}

        {/* View on Map + Compare (shared actions) */}
        <div className="mt-2 flex flex-wrap gap-2">
          <Link
            to={`/map?hospital=${hospital.id}`}
            className="flex items-center gap-1.5 bg-white border border-navy-200 hover:border-medical-300 text-navy-600 text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors no-underline"
          >
            <MapIcon className="w-3.5 h-3.5" />
            View on Map
          </Link>
          <button
            onClick={() => onToggleCompare(hospital.id)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2.5 rounded-lg border transition-colors cursor-pointer ${
              isCompared
                ? "bg-medical-50 border-medical-300 text-medical-700"
                : "bg-white border-navy-200 text-navy-500 hover:border-medical-300"
            }`}
            aria-pressed={isCompared}
          >
            {isCompared ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <Square className="w-3.5 h-3.5" />
            )}
            {isCompared ? "Comparing" : "Add to Compare"}
          </button>
        </div>
      </div>
    </div>
  );
}
