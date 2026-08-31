import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  XCircle,
} from "lucide-react";
import { getAreas, getICUTypes } from "../data/hospitals";

const areas = getAreas();
const icuTypes = getICUTypes();

const VENTILATOR_OPTIONS = ["Any", "Available", "Not Available"];
const AVAILABILITY_OPTIONS = ["All", "Available", "Limited", "Full"];

const DEFAULT_FILTERS = {
  search: "",
  area: "All Areas",
  icuType: "All ICU Types",
  ventilator: "Any",
  availability: "All",
};

export default function SearchPanel({
  onSearch,
  onClear,
  resultCount,
  compact = false,
}) {
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS });

  const handleChange = (field, value) => {
    const updated = { ...filters, [field]: value };
    setFilters(updated);
    if (onSearch) onSearch(updated);
  };

  const handleClear = () => {
    const reset = { ...DEFAULT_FILTERS };
    setFilters(reset);
    if (onSearch) onSearch(reset);
    if (onClear) onClear();
  };

  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.area !== "All Areas" ||
    filters.icuType !== "All ICU Types" ||
    filters.ventilator !== "Any" ||
    filters.availability !== "All";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(filters);
  };

  return (
    <div className="bg-white rounded-xl border border-navy-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-navy-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-emergency-400 rounded-full animate-pulse"></div>
          <h3 className="text-white font-semibold text-lg">
            Find an ICU in Karachi
          </h3>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-navy-300 hover:text-white text-sm transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6">
        {/* Search input — always visible */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-navy-700 mb-1.5">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
            <input
              type="text"
              placeholder="Search hospital name, area, or address..."
              value={filters.search}
              onChange={(e) => handleChange("search", e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-navy-200 rounded-lg text-base focus:ring-2 focus:ring-medical-400 focus:border-medical-400 outline-none"
            />
          </div>
        </div>

        {/* Filter dropdowns */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Area */}
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">
                Area
              </label>
              <select
                value={filters.area}
                onChange={(e) => handleChange("area", e.target.value)}
                className="w-full px-4 py-2.5 border border-navy-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-400 focus:border-medical-400 outline-none bg-white"
              >
                <option value="All Areas">All Areas</option>
                {areas.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {/* ICU Type */}
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">
                ICU Type
              </label>
              <select
                value={filters.icuType}
                onChange={(e) => handleChange("icuType", e.target.value)}
                className="w-full px-4 py-2.5 border border-navy-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-400 focus:border-medical-400 outline-none bg-white"
              >
                <option value="All ICU Types">All ICU Types</option>
                {icuTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Ventilator */}
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">
                Ventilator
              </label>
              <select
                value={filters.ventilator}
                onChange={(e) => handleChange("ventilator", e.target.value)}
                className="w-full px-4 py-2.5 border border-navy-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-400 focus:border-medical-400 outline-none bg-white"
              >
                {VENTILATOR_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">
                Availability
              </label>
              <select
                value={filters.availability}
                onChange={(e) => handleChange("availability", e.target.value)}
                className="w-full px-4 py-2.5 border border-navy-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-400 focus:border-medical-400 outline-none bg-white"
              >
                {AVAILABILITY_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Actions row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-emergency-500 hover:bg-emergency-600 text-white font-bold px-8 py-3 rounded-lg text-sm transition-colors"
          >
            <Search className="w-4 h-4" />
            SEARCH ICU
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1.5 text-navy-500 hover:text-emergency-600 text-sm font-medium transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Clear Filters
            </button>
          )}

          {typeof resultCount === "number" && (
            <span className="text-sm text-navy-500 ml-auto">
              <span className="font-bold text-navy-800">{resultCount}</span>{" "}
              {resultCount === 1 ? "hospital" : "hospitals"} found
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
