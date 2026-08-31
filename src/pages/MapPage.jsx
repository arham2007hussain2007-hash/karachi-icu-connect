import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  MapPin,
  Shield,
  Siren,
  ChevronDown,
  ChevronUp,
  Eye,
  Navigation,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import MapView from "../components/MapView";
import MapFilters from "../components/MapFilters";
import MapLegend from "../components/MapLegend";
import HospitalMapCard from "../components/HospitalMapCard";
import { useHospitals } from "../context/HospitalDataContext";
import { filterHospitals, sortHospitals } from "../utils/availability";
import AvailabilityBadge from "../components/AvailabilityBadge";

const DEFAULT_FILTERS = {
  search: "",
  area: "All Karachi",
  icuType: "All ICU Types",
  ventilator: "Any",
  availability: "All",
};

// Normalize "All Karachi" to "All Areas" for the shared filter util
function toSharedFilters(f) {
  return {
    ...f,
    area: f.area === "All Karachi" ? "All Areas" : f.area,
    ventilator:
      f.ventilator === "Ventilator Available"
        ? "Available"
        : f.ventilator === "No Ventilator"
        ? "Not Available"
        : f.ventilator,
  };
}

export default function MapPage() {
  const [searchParams] = useSearchParams();
  const { hospitals } = useHospitals();
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS });
  const [selectedId, setSelectedId] = useState(null);
  const [showList, setShowList] = useState(true);

  // Derive the selected hospital from live data so it always reflects
  // the latest availability values.
  const selected = hospitals.find((h) => h.id === selectedId) || null;

  // Auto-select hospital from URL param (e.g. /map?hospital=agh-khi-01)
  useEffect(() => {
    const hospitalId = searchParams.get("hospital");
    if (hospitalId && hospitals.some((h) => h.id === hospitalId)) {
      setSelectedId(hospitalId);
    }
  }, [searchParams, hospitals]);

  const filtered = useMemo(() => {
    const results = filterHospitals(hospitals, toSharedFilters(filters));
    return sortHospitals(results, "availability");
  }, [filters, hospitals]);

  const handleSelect = (hospital) => {
    setSelectedId(selectedId === hospital.id ? null : hospital.id);
  };

  const handleFindAvailable = () => {
    setFilters({
      ...DEFAULT_FILTERS,
      availability: "Available",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-navy-900 flex items-center gap-2">
            <MapPin className="w-7 h-7 text-medical-500" />
            Find ICU Near You
          </h1>
          <p className="text-navy-500 mt-1">
            Explore ICU hospitals across Karachi.
          </p>
        </div>
        <button
          onClick={handleFindAvailable}
          className="mt-3 md:mt-0 flex items-center gap-2 bg-emergency-500 hover:bg-emergency-600 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-colors"
        >
          <Siren className="w-4 h-4" />
          Find Available ICU
        </button>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 mb-5 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
        <Shield className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-700">
          <strong>DEMO DATA</strong> — ICU availability shown here is sample
          data for demonstration and is not real-time. Please call the hospital
          to confirm availability before traveling.
        </p>
      </div>

      {/* Filters */}
      <MapFilters filters={filters} onChange={setFilters} />

      {/* Smart Match CTA */}
      <div className="mt-3 flex items-center justify-between bg-medical-50 border border-medical-200 rounded-lg px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-medical-500" />
          <p className="text-xs text-navy-700">
            <strong>Looking for the best match?</strong> Try Smart ICU Match.
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
      <div className="mt-4 mb-3 flex items-center justify-between">
        <p className="text-sm text-navy-600">
          <span className="font-bold text-navy-900">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "hospital" : "hospitals"} on map
        </p>
        <MapLegend />
      </div>

      {/* Map + Selected Panel — desktop side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map area */}
        <div className="lg:col-span-2">
          <MapView
            hospitals={filtered}
            selectedId={selected?.id || null}
            onSelect={handleSelect}
            height={480}
          />
        </div>

        {/* Right panel — selected hospital or placeholder */}
        <div className="lg:col-span-1">
          {selected ? (
            <HospitalMapCard
              hospital={selected}
              onClose={() => setSelected(null)}
            />
          ) : (
            <div className="bg-white border border-navy-200 border-dashed rounded-xl p-8 text-center">
              <MapPin className="w-10 h-10 text-navy-300 mx-auto mb-3" />
              <p className="text-sm text-navy-500">
                Click a hospital marker on the map to view details.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Hospital List (collapsible) */}
      <div className="mt-6">
        <button
          onClick={() => setShowList(!showList)}
          className="w-full flex items-center justify-between bg-white border border-navy-200 rounded-xl px-5 py-3 text-sm font-semibold text-navy-800 hover:bg-navy-50 transition-colors"
          aria-expanded={showList}
        >
          <span>
            Hospital List ({filtered.length} hospitals)
          </span>
          {showList ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {showList && (
          <div className="mt-3 bg-white border border-navy-100 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-navy-50 border-b border-navy-100">
                    <th className="text-left px-5 py-2.5 font-semibold text-navy-700">Hospital</th>
                    <th className="text-left px-5 py-2.5 font-semibold text-navy-700">Area</th>
                    <th className="text-left px-5 py-2.5 font-semibold text-navy-700">Status</th>
                    <th className="text-left px-5 py-2.5 font-semibold text-navy-700">Beds</th>
                    <th className="text-left px-5 py-2.5 font-semibold text-navy-700">Location</th>
                    <th className="text-left px-5 py-2.5 font-semibold text-navy-700"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((h) => {
                    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${h.latitude},${h.longitude}`;
                    return (
                      <tr
                        key={h.id}
                        onClick={() => handleSelect(h)}
                        className={`border-b border-navy-50 cursor-pointer transition-colors ${
                          selected?.id === h.id
                            ? "bg-medical-50"
                            : "hover:bg-navy-50/50"
                        }`}
                      >
                        <td className="px-5 py-3 font-medium text-navy-900">{h.name}</td>
                        <td className="px-5 py-3 text-navy-500">{h.area}</td>
                        <td className="px-5 py-3">
                          <AvailabilityBadge hospital={h} />
                        </td>
                        <td className="px-5 py-3 text-navy-600">
                          {h.availableICUBeds}/{h.totalICUBeds}
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-xs text-navy-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            Location available
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelect(h);
                              }}
                              className="text-xs font-medium text-medical-600 hover:text-medical-700 px-2 py-1 rounded bg-medical-50 hover:bg-medical-100"
                              aria-label={`View ${h.name}`}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <a
                              href={mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs font-medium text-navy-600 hover:text-navy-700 px-2 py-1 rounded bg-navy-50 hover:bg-navy-100"
                              aria-label={`Get directions to ${h.name}`}
                            >
                              <Navigation className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
