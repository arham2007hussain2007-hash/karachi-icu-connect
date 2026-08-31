import {
  BedDouble,
  Wind,
  MapPin,
  Siren,
  Pencil,
} from "lucide-react";

// Summary of the submitted Smart Match search (new 4-field prefs shape)
export default function RecommendationSummary({ prefs, onEdit }) {
  const rows = [
    { icon: BedDouble, label: "ICU", value: prefs.icuType },
    {
      icon: Wind,
      label: "Ventilator",
      value: prefs.ventilator === "Yes" ? "Required" : "Not required",
    },
    { icon: MapPin, label: "Area", value: prefs.area },
    { icon: Siren, label: "Priority", value: prefs.priority },
  ].filter(
    (r) =>
      r.value &&
      r.value !== "Any ICU" &&
      r.value !== "Any Area" &&
      r.value !== "Not required" &&
      r.value !== "Standard"
  );

  return (
    <div className="bg-navy-900 text-white rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold tracking-wide">YOUR SEARCH</h3>
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-1 text-xs text-medical-300 hover:text-medical-200 transition-colors cursor-pointer"
          >
            <Pencil className="w-3 h-3" />
            Edit Search
          </button>
        )}
      </div>

      {rows.length > 0 ? (
        <div className="space-y-2">
          {rows.map((r) => (
            <div
              key={r.label}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-navy-300 flex items-center gap-1.5">
                <r.icon className="w-3.5 h-3.5" />
                {r.label}
              </span>
              <span
                className={`font-medium flex items-center gap-1.5 ${
                  r.value === "Critical" ? "text-emergency-300" : ""
                }`}
              >
                {r.value === "Critical" && (
                  <Siren className="w-3.5 h-3.5" />
                )}
                {r.value}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-navy-300">
          No specific preferences selected — showing best overall matches.
        </p>
      )}
    </div>
  );
}
