// Freshness badge — icon + label so freshness is never color-only.
// Freshness itself is computed by the centralized getFreshness() utility
// in utils/availability.js; this component is purely presentational.

import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";

const freshnessConfig = {
  FRESH: {
    label: "Fresh",
    icon: CheckCircle2,
    chip: "bg-teal-50 text-teal-700 border-teal-200",
    iconColor: "text-teal-600",
  },
  AGING: {
    label: "Aging",
    icon: Clock,
    chip: "bg-amber-50 text-amber-700 border-amber-200",
    iconColor: "text-amber-600",
  },
  STALE: {
    label: "Stale",
    icon: AlertTriangle,
    chip: "bg-emergency-50 text-emergency-700 border-emergency-200",
    iconColor: "text-emergency-600",
  },
};

export default function FreshnessBadge({ freshness }) {
  const cfg = freshnessConfig[freshness] || freshnessConfig.STALE;
  const Icon = cfg.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap ${cfg.chip}`}
    >
      <Icon className={`w-3 h-3 ${cfg.iconColor} shrink-0`} />
      {cfg.label}
    </span>
  );
}
