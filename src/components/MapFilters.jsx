import { Search } from "lucide-react";
import { getAreas, getICUTypes } from "../data/hospitals";

const areas = ["All Karachi", ...getAreas()];
const icuTypes = ["All ICU Types", ...getICUTypes()];
const availabilityOpts = ["All", "Available", "Limited", "Full"];
const ventilatorOpts = ["Any", "Ventilator Available", "No Ventilator"];

export default function MapFilters({ filters, onChange }) {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
        <input
          type="text"
          placeholder="Search hospital or area..."
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-navy-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-400 focus:border-medical-400 outline-none"
        />
      </div>

      {/* Filter row — scrollable on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {/* Area */}
        <select
          value={filters.area}
          onChange={(e) => update("area", e.target.value)}
          className="shrink-0 px-3 py-2 border border-navy-200 rounded-lg text-xs font-medium bg-white focus:ring-2 focus:ring-medical-400 outline-none"
          aria-label="Filter by area"
        >
          {areas.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>

        {/* ICU Type */}
        <select
          value={filters.icuType}
          onChange={(e) => update("icuType", e.target.value)}
          className="shrink-0 px-3 py-2 border border-navy-200 rounded-lg text-xs font-medium bg-white focus:ring-2 focus:ring-medical-400 outline-none"
          aria-label="Filter by ICU type"
        >
          {icuTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {/* Availability */}
        <select
          value={filters.availability}
          onChange={(e) => update("availability", e.target.value)}
          className="shrink-0 px-3 py-2 border border-navy-200 rounded-lg text-xs font-medium bg-white focus:ring-2 focus:ring-medical-400 outline-none"
          aria-label="Filter by availability"
        >
          {availabilityOpts.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>

        {/* Ventilator */}
        <select
          value={filters.ventilator}
          onChange={(e) => update("ventilator", e.target.value)}
          className="shrink-0 px-3 py-2 border border-navy-200 rounded-lg text-xs font-medium bg-white focus:ring-2 focus:ring-medical-400 outline-none"
          aria-label="Filter by ventilator"
        >
          {ventilatorOpts.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
