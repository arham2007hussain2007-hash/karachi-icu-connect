// ── Quick Network Insights (Admin Command Center, Step 9 Part 5) ──
// All insights are derived from the live hospital data (HospitalDataContext)
// using the centralized availability utilities — nothing is hardcoded.
// Ties are shown as explicit ties (never a single misleading winner), and
// an empty hospital list is handled safely.

import { useMemo } from "react";
import {
  Award,
  TrendingDown,
  BedDouble,
  AlertTriangle,
  Activity,
} from "lucide-react";
import {
  getAvailabilityPercentage,
  getHospitalsRequiringAttention,
} from "../utils/availability";

export default function NetworkInsights({ hospitals, stats }) {
  const insights = useMemo(() => {
    if (!hospitals || hospitals.length === 0) return null;

    // Most available: highest number of available ICU beds (ties collected)
    const maxBeds = Math.max(...hospitals.map((h) => h.availableICUBeds ?? 0));
    const mostAvailable = hospitals.filter(
      (h) => (h.availableICUBeds ?? 0) === maxBeds
    );

    // Lowest availability: smallest ICU availability percentage (ties collected)
    const percentages = hospitals.map((h) => getAvailabilityPercentage(h));
    const minPct = Math.min(...percentages);
    const lowest = hospitals.filter(
      (h) => getAvailabilityPercentage(h) === minPct
    );

    // Attention count reuses the centralized Part 3 rules — no duplicated logic
    const attentionCount = getHospitalsRequiringAttention(hospitals).length;

    return { maxBeds, mostAvailable, minPct, lowest, attentionCount };
  }, [hospitals]);

  if (!insights) {
    // Zero hospitals — handled safely, never divide/crash
    return (
      <div className="bg-white border border-navy-100 rounded-xl shadow-sm p-6 mb-8">
        <h3 className="font-bold text-navy-900 flex items-center gap-2 mb-2">
          <Activity className="w-5 h-5 text-medical-500" />
          Quick Network Insights
        </h3>
        <p className="text-sm text-navy-500">
          No hospital data available for insights yet.
        </p>
      </div>
    );
  }

  const names = (list) => list.map((h) => h.name).join(", ");

  const cards = [
    {
      key: "most-available",
      icon: Award,
      iconColor: "text-teal-600",
      bg: "bg-teal-50",
      label: "Most Available Hospital",
      value:
        insights.mostAvailable.length === 1
          ? insights.mostAvailable[0].name
          : `${insights.mostAvailable.length}-way tie`,
      detail:
        insights.mostAvailable.length === 1
          ? `${insights.maxBeds} available ICU beds`
          : `${names(insights.mostAvailable)} — each with ${insights.maxBeds} available ICU beds`,
    },
    {
      key: "lowest-pct",
      icon: TrendingDown,
      iconColor: "text-amber-600",
      bg: "bg-amber-50",
      label: "Lowest ICU Availability",
      value:
        insights.lowest.length === 1
          ? insights.lowest[0].name
          : `${insights.lowest.length}-way tie`,
      detail:
        insights.lowest.length === 1
          ? `${insights.minPct}% ICU availability`
          : `${names(insights.lowest)} — each at ${insights.minPct}% ICU availability`,
    },
    {
      key: "total-capacity",
      icon: BedDouble,
      iconColor: "text-medical-600",
      bg: "bg-medical-50",
      label: "Total Available ICU Capacity",
      value: `${stats.availableBeds} beds`,
      detail: `of ${stats.totalBeds} total ICU beds (${stats.overallAvailabilityPct}% across the network)`,
    },
    {
      key: "attention",
      icon: AlertTriangle,
      iconColor: "text-emergency-600",
      bg: "bg-emergency-50",
      label: "Hospitals Requiring Attention",
      value: `${insights.attentionCount}`,
      detail: "Full ICU, no ventilators, or outdated availability data",
    },
  ];

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h3 className="font-bold text-navy-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-medical-500" />
          Quick Network Insights
        </h3>
        <p className="text-xs text-navy-400 mt-0.5">
          Highlights calculated from the latest reported hospital data — demo
          data, not real-time monitoring.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.key}
              className="bg-white border border-navy-100 rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2.5">
                <div className={`${card.bg} p-2.5 rounded-lg shrink-0`}>
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
                <span className="text-xs font-bold text-navy-500 uppercase tracking-wider">
                  {card.label}
                </span>
              </div>
              <p className="text-lg font-bold text-navy-900 leading-snug break-words">
                {card.value}
              </p>
              <p className="text-xs text-navy-400 mt-1">{card.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
