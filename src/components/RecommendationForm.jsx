import { useMemo } from "react";
import {
  Sparkles,
  Siren,
  MapPin,
  BedDouble,
  Wind,
  AlertTriangle,
  Clock,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { useHospitals } from "../context/HospitalDataContext";
import { DEFAULT_SMART_MATCH_PREFS } from "../utils/recommendation";

// Emergency priority options — weighting rationale lives in
// utils/recommendation.js (PRIORITY_WEIGHTS).
const PRIORITY_OPTIONS = [
  {
    value: "Critical",
    icon: Siren,
    desc: "Life-threatening — ICU needed now",
  },
  {
    value: "Urgent",
    icon: AlertTriangle,
    desc: "Serious — ICU needed soon",
  },
  {
    value: "Standard",
    icon: Clock,
    desc: "Planned or less time-critical",
  },
];

/**
 * Smart Match input form (controlled).
 * Only ICU types and areas that actually exist in the live hospital
 * dataset are offered as options.
 */
export default function RecommendationForm({ prefs, onChange, onSubmit, loading = false }) {
  const { hospitals } = useHospitals();

  // Options derived from the LIVE dataset (not the static base list) so
  // they always reflect what hospitals actually provide.
  const icuTypeOptions = useMemo(() => {
    const types = new Set();
    hospitals.forEach((h) =>
      (h.icuTypes || []).forEach((t) => types.add(t))
    );
    return ["Any ICU", ...[...types].sort()];
  }, [hospitals]);

  const areaOptions = useMemo(() => {
    const areas = new Set(hospitals.map((h) => h.area));
    return ["Any Area", ...[...areas].sort()];
  }, [hospitals]);

  const update = (key, value) => onChange({ ...prefs, [key]: value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(prefs);
  };

  const handleReset = () => {
    onChange({ ...DEFAULT_SMART_MATCH_PREFS });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ICU requirement */}
      <fieldset>
        <legend className="text-xs font-semibold text-navy-600 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
          <BedDouble className="w-3.5 h-3.5" />
          ICU Requirement
        </legend>
        <select
          value={prefs.icuType}
          onChange={(e) => update("icuType", e.target.value)}
          className="w-full px-3 py-2.5 border border-navy-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-medical-400 outline-none"
          aria-label="Select ICU requirement"
        >
          {icuTypeOptions.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </fieldset>

      {/* Ventilator required */}
      <fieldset>
        <legend className="text-xs font-semibold text-navy-600 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
          <Wind className="w-3.5 h-3.5" />
          Is a ventilator required?
        </legend>
        <div className="flex gap-2">
          {["Yes", "No"].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => update("ventilator", opt)}
              className={`flex-1 py-2.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                prefs.ventilator === opt
                  ? "bg-medical-500 text-white border-medical-500"
                  : "bg-white text-navy-600 border-navy-200 hover:border-medical-300"
              }`}
              aria-pressed={prefs.ventilator === opt}
            >
              {opt}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Preferred area */}
      <fieldset>
        <legend className="text-xs font-semibold text-navy-600 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          Preferred Area
        </legend>
        <select
          value={prefs.area}
          onChange={(e) => update("area", e.target.value)}
          className="w-full px-3 py-2.5 border border-navy-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-medical-400 outline-none"
          aria-label="Select preferred area"
        >
          {areaOptions.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </fieldset>

      {/* Emergency priority */}
      <fieldset>
        <legend className="text-xs font-semibold text-navy-600 uppercase tracking-wide mb-1.5">
          Emergency Priority
        </legend>
        <div className="space-y-2">
          {PRIORITY_OPTIONS.map((opt) => {
            const active = prefs.priority === opt.value;
            const critical = opt.value === "Critical";
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => update("priority", opt.value)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                  active
                    ? critical
                      ? "border-emergency-400 bg-emergency-50"
                      : "border-medical-400 bg-medical-50"
                    : "border-navy-200 bg-white hover:border-medical-300"
                }`}
                aria-pressed={active}
              >
                <opt.icon
                  className={`w-4 h-4 shrink-0 ${
                    active
                      ? critical
                        ? "text-emergency-600"
                        : "text-medical-600"
                      : "text-navy-400"
                  }`}
                />
                <span>
                  <span
                    className={`block text-sm font-bold ${
                      active
                        ? critical
                          ? "text-emergency-700"
                          : "text-medical-700"
                        : "text-navy-700"
                    }`}
                  >
                    {opt.value}
                  </span>
                  <span className="block text-xs text-navy-500">
                    {opt.desc}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="w-full flex items-center justify-center gap-2 bg-medical-500 hover:bg-medical-600 disabled:bg-medical-300 text-white font-bold py-3.5 rounded-lg text-sm transition-colors"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            ANALYZING...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            FIND ICU MATCH
          </>
        )}
      </button>

      {/* Reset preferences */}
      <button
        type="button"
        onClick={handleReset}
        className="w-full flex items-center justify-center gap-1.5 text-xs text-navy-400 hover:text-navy-600 transition-colors py-1"
      >
        <RotateCcw className="w-3 h-3" />
        Reset preferences
      </button>
    </form>
  );
}
