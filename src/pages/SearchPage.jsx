import { useState } from "react";
import SearchPanel from "../components/SearchPanel";
import HospitalList from "../components/HospitalList";
import { useHospitals } from "../context/HospitalDataContext";
import { filterHospitals, sortHospitals } from "../utils/availability";
import { Shield, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function SearchPage() {
  const { hospitals } = useHospitals();
  const [filteredHospitals, setFilteredHospitals] = useState(hospitals);

  const handleSearch = (filters) => {
    const results = filterHospitals(hospitals, filters);
    const sorted = sortHospitals(results, "availability");
    setFilteredHospitals(sorted);
  };

  const handleClear = () => {
    setFilteredHospitals(hospitals);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-navy-900">Find ICU</h1>
        <p className="text-navy-500 mt-1">
          Search and filter hospitals by ICU availability across Karachi.
        </p>
      </div>

      {/* Search */}
      <SearchPanel
        onSearch={handleSearch}
        onClear={handleClear}
        resultCount={filteredHospitals.length}
      />

      {/* Disclaimer */}
      <div className="flex items-start gap-2 mt-5 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
        <Shield className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-700">
          <strong>DEMO DATA</strong> — ICU availability shown here is sample
          data for demonstration and is not real-time. Please call the hospital
          to confirm availability before traveling.
        </p>
      </div>

      {/* Smart Match CTA */}
      <div className="mt-4 mb-4 flex items-center justify-between bg-medical-50 border border-medical-200 rounded-lg px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-medical-500" />
          <p className="text-sm text-navy-700">
            <strong>Need help choosing?</strong> Try the Smart ICU Match.
          </p>
        </div>
        <Link
          to="/recommend"
          className="shrink-0 inline-flex items-center gap-1.5 bg-medical-500 hover:bg-medical-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors no-underline"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Smart ICU Match
        </Link>
      </div>

      {/* Results count */}
      <div className="mt-6 mb-4 flex items-center justify-between">
        <p className="text-sm text-navy-600">
          <span className="font-bold text-navy-900">
            {filteredHospitals.length}
          </span>{" "}
          {filteredHospitals.length === 1 ? "hospital" : "hospitals"} found
        </p>
      </div>

      {/* Results */}
      <HospitalList
        hospitals={filteredHospitals}
        onClearFilters={handleClear}
      />
    </div>
  );
}
