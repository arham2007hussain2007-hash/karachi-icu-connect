// ── Live Demo Facts (Step 10 Part 3) ──
// Dynamic, live-data-driven facts. Uses the centralized
// HospitalDataContext + getPlatformStats so values stay accurate
// even if the demo dataset changes. No hardcoded counts.

import { useHospitals } from "../context/HospitalDataContext";
import { getPlatformStats } from "../data/hospitals";
import { Activity, Database } from "lucide-react";

export default function LiveDemoFacts() {
  const { hospitals } = useHospitals();
  const stats = getPlatformStats(hospitals);

  const facts = [
    {
      label: "Hospitals in demo dataset",
      value: stats.totalHospitals,
    },
    {
      label: "Total ICU beds (demo)",
      value: stats.totalBeds,
    },
    {
      label: "Currently available ICU beds",
      value: stats.availableBeds,
    },
    {
      label: "Total ventilators (demo)",
      value: stats.totalVentilators,
    },
    {
      label: "Currently available ventilators",
      value: stats.availableVentilators,
    },
    {
      label: "Areas covered",
      value: stats.areas ?? stats.areasCovered ?? "—",
    },
    {
      label: "Overall ICU availability",
      value:
        stats.totalBeds > 0
          ? `${Math.round((stats.availableBeds / stats.totalBeds) * 100)}%`
          : "0%",
    },
  ];

  return (
    <div className="bg-white border border-navy-100 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <Activity className="w-5 h-5 text-medical-500" />
        <h3 className="text-lg font-bold text-navy-900">Live Demo Facts</h3>
      </div>
      <p className="text-xs text-navy-400 mb-5 flex items-center gap-1.5">
        <Database className="w-3.5 h-3.5" />
        Derived from the current demo dataset — values update as data changes.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {facts.map((f) => (
          <div
            key={f.label}
            className="bg-navy-50 border border-navy-100 rounded-lg p-4"
          >
            <p className="text-[10px] font-bold text-navy-500 uppercase tracking-wider mb-1 leading-tight">
              {f.label}
            </p>
            <p className="text-2xl font-black text-navy-900 leading-tight">
              {f.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
