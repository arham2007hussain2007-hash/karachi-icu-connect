import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Navigation,
  ShieldCheck,
  Wind,
  BedDouble,
  X,
} from "lucide-react";
import AvailabilityBadge from "./AvailabilityBadge";
import { getAvailabilityPercentage } from "../utils/availability";

export default function HospitalMapCard({ hospital, onClose }) {
  if (!hospital) return null;

  const pct = getAvailabilityPercentage(hospital);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${hospital.latitude},${hospital.longitude}`;

  return (
    <div className="bg-white border border-navy-200 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-navy-900 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-white font-bold text-sm leading-snug">
            {hospital.name}
          </h3>
          {hospital.verified && (
            <ShieldCheck className="w-4 h-4 text-medical-300 shrink-0" title="Verified" />
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-navy-400 hover:text-white transition-colors p-1"
            aria-label="Close hospital preview"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-5">
        {/* Area + Status */}
        <div className="flex items-center justify-between mb-3">
          <span className="flex items-center gap-1 text-sm text-navy-500">
            <MapPin className="w-3.5 h-3.5" />
            {hospital.area}
          </span>
          <AvailabilityBadge hospital={hospital} />
        </div>

        {/* Beds */}
        <div className="flex items-center gap-4 text-sm mb-3">
          <span className="flex items-center gap-1 text-navy-700">
            <BedDouble className="w-4 h-4 text-medical-500" />
            <strong>{hospital.availableICUBeds}</strong>/{hospital.totalICUBeds} beds ({pct}%)
          </span>
          <span className="flex items-center gap-1 text-navy-700">
            <Wind className="w-4 h-4 text-medical-500" />
            {hospital.availableVentilators} ventilators
          </span>
        </div>

        {/* ICU types */}
        <div className="flex flex-wrap gap-1 mb-4">
          {hospital.icuTypes.map((t) => (
            <span key={t} className="bg-navy-50 text-navy-600 text-[10px] px-2 py-0.5 rounded">
              {t}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/hospital/${hospital.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 bg-medical-500 hover:bg-medical-600 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors no-underline"
          >
            View Details
          </Link>
          <a
            href={`tel:${hospital.phone}`}
            className="flex items-center justify-center gap-1.5 bg-navy-100 hover:bg-navy-200 text-navy-800 text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors no-underline"
          >
            <Phone className="w-3.5 h-3.5" />
            Call
          </a>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 bg-navy-100 hover:bg-navy-200 text-navy-800 text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors no-underline"
          >
            <Navigation className="w-3.5 h-3.5" />
            Directions
          </a>
        </div>
      </div>
    </div>
  );
}
