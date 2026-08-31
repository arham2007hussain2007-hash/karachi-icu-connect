import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  ShieldCheck,
  Wind,
  Clock,
  ChevronRight,
} from "lucide-react";
import AvailabilityBadge from "./AvailabilityBadge";
import {
  getAvailabilityPercentage,
  getStatusColor,
  getAvailabilityStatus,
  formatLastUpdated,
} from "../utils/availability";

export default function HospitalCard({ hospital }) {
  const percentage = getAvailabilityPercentage(hospital);
  const status = getAvailabilityStatus(hospital);
  const colors = getStatusColor(status);

  return (
    <div className="bg-white border border-navy-100 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-navy-900 text-base leading-snug flex-1">
            {hospital.name}
          </h3>
          {hospital.verified && (
            <ShieldCheck
              className="w-5 h-5 text-medical-500 shrink-0"
              title="Verified"
            />
          )}
        </div>

        <div className="flex items-center gap-1.5 text-sm text-navy-500 mb-1">
          <MapPin className="w-3.5 h-3.5" />
          <span>{hospital.area}</span>
        </div>
        <p className="text-xs text-navy-400 mb-3">{hospital.address}</p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {hospital.icuTypes.map((type) => (
            <span
              key={type}
              className="bg-navy-50 text-navy-700 text-xs px-2 py-0.5 rounded"
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="px-5 pb-3 border-t border-navy-50 pt-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-navy-600">
            <span className="font-bold text-navy-900">
              {hospital.availableICUBeds}
            </span>{" "}
            / {hospital.totalICUBeds} beds{" "}
            <span className="text-navy-400">({percentage}%)</span>
          </div>
          <AvailabilityBadge hospital={hospital} />
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-navy-100 rounded-full h-2 mb-3">
          <div
            className={`${colors.progress} h-2 rounded-full transition-all`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between text-xs text-navy-400">
          <span className="flex items-center gap-1">
            <Wind className="w-3.5 h-3.5" />
            Ventilators: {hospital.availableVentilators}/{hospital.totalVentilators}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Updated {formatLastUpdated(hospital.lastUpdated)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="p-5 pt-3 border-t border-navy-100 flex gap-3 mt-auto">
        <Link
          to={`/hospital/${hospital.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 bg-medical-500 hover:bg-medical-600 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors no-underline"
        >
          View Details
          <ChevronRight className="w-4 h-4" />
        </Link>
        <a
          href={`tel:${hospital.phone}`}
          className="flex items-center justify-center gap-1.5 bg-navy-100 hover:bg-navy-200 text-navy-800 text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors no-underline"
        >
          <Phone className="w-4 h-4" />
          Call
        </a>
      </div>
    </div>
  );
}
