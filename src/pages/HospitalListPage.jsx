import { useState } from "react";
import { useHospitals } from "../context/HospitalDataContext";
import HospitalList from "../components/HospitalList";
import { sortHospitals } from "../utils/availability";
import { Shield, ArrowUpDown } from "lucide-react";

const SORT_OPTIONS = [
  { value: "availability", label: "Best Availability" },
  { value: "name", label: "Hospital Name" },
  { value: "area", label: "Area" },
];

export default function HospitalListPage() {
  const { hospitals } = useHospitals();
  const [sortBy, setSortBy] = useState("availability");
  const sorted = sortHospitals(hospitals, sortBy);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">Hospitals</h1>
          <p className="text-navy-500 mt-1">
            Browse all registered hospitals with ICU facilities in Karachi.
          </p>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <ArrowUpDown className="w-4 h-4 text-navy-400" />
          <label className="text-sm text-navy-500">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 border border-navy-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-400 focus:border-medical-400 outline-none bg-white"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 mb-6 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
        <Shield className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-700">
          <strong>DEMO DATA</strong> — ICU availability shown here is sample
          data for demonstration and is not real-time. Please call the hospital
          to confirm availability before traveling.
        </p>
      </div>

      {/* Count */}
      <p className="text-sm text-navy-600 mb-4">
        <span className="font-bold text-navy-900">{hospitals.length}</span>{" "}
        hospitals registered
      </p>

      <HospitalList hospitals={sorted} />
    </div>
  );
}
