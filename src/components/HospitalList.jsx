import HospitalCard from "./HospitalCard";
import { SearchX } from "lucide-react";

export default function HospitalList({
  hospitals,
  title,
  subtitle,
  onClearFilters,
}) {
  if (!hospitals || hospitals.length === 0) {
    return (
      <div className="text-center py-16">
        <SearchX className="w-12 h-12 text-navy-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-navy-900 mb-2">
          No Hospitals Found
        </h3>
        <p className="text-navy-500 text-sm mb-5 max-w-md mx-auto">
          Try changing your area, ICU type, or availability filters.
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="bg-medical-500 hover:bg-medical-600 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      {title && (
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-navy-900">
            {title}
          </h2>
          {subtitle && <p className="text-navy-500 text-sm mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {hospitals.map((hospital) => (
          <HospitalCard key={hospital.id} hospital={hospital} />
        ))}
      </div>
    </div>
  );
}
