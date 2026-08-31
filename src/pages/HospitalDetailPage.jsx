import { useParams, Link } from "react-router-dom";
import { useHospitals } from "../context/HospitalDataContext";
import AvailabilityBadge from "../components/AvailabilityBadge";
import LocationSection from "../components/LocationSection";
import {
  getAvailabilityPercentage,
  getOccupancyPercentage,
  getAvailabilityStatus,
  getStatusColor,
  formatLastUpdated,
} from "../utils/availability";
import {
  ArrowLeft,
  Phone,
  MapPin,
  Navigation,
  ShieldCheck,
  Clock,
  BedDouble,
  Wind,
  Stethoscope,
  Activity,
  Shield,
} from "lucide-react";

export default function HospitalDetailPage() {
  const { id } = useParams();
  const { getHospitalById } = useHospitals();
  const hospital = getHospitalById(id);

  if (!hospital) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-navy-900 mb-3">
          Hospital Not Found
        </h1>
        <p className="text-navy-500 mb-8">
          The hospital you are looking for does not exist or has been removed.
        </p>
        <Link
          to="/hospitals"
          className="inline-flex items-center gap-2 bg-medical-500 hover:bg-medical-600 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors no-underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Hospitals
        </Link>
      </div>
    );
  }

  const availabilityPct = getAvailabilityPercentage(hospital);
  const occupancyPct = getOccupancyPercentage(hospital);
  const status = getAvailabilityStatus(hospital);
  const colors = getStatusColor(status);
  const occupiedBeds = hospital.totalICUBeds - hospital.availableICUBeds;
  const unavailableVentilators = hospital.totalVentilators - hospital.availableVentilators;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.address)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back */}
      <Link
        to="/hospitals"
        className="inline-flex items-center gap-1.5 text-sm text-navy-500 hover:text-navy-700 mb-6 no-underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Hospitals
      </Link>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 mb-6 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
        <Shield className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-700">
          <strong>DEMO DATA</strong> — ICU availability shown here is sample
          data for demonstration and is not real-time. Please call the hospital
          to confirm availability before traveling.
        </p>
      </div>

      {/* Header */}
      <div className="bg-white border border-navy-100 rounded-xl p-6 md:p-8 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-navy-900">
                {hospital.name}
              </h1>
              {hospital.verified && (
                <ShieldCheck
                  className="w-6 h-6 text-medical-500"
                  title="Verified Hospital"
                />
              )}
            </div>
            <div className="flex items-center gap-2 text-navy-500 text-sm mb-1">
              <MapPin className="w-4 h-4" />
              <span>{hospital.area}</span>
            </div>
            <p className="text-sm text-navy-400">{hospital.address}</p>
          </div>
          <AvailabilityBadge hospital={hospital} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* ICU Availability */}
          <div className="bg-white border border-navy-100 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
              <BedDouble className="w-5 h-5 text-medical-500" />
              ICU Availability
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-navy-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-navy-900">
                  {hospital.totalICUBeds}
                </p>
                <p className="text-xs text-navy-500 mt-1">Total Beds</p>
              </div>
              <div className="bg-emergency-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-emergency-700">
                  {occupiedBeds}
                </p>
                <p className="text-xs text-navy-500 mt-1">Occupied</p>
              </div>
              <div className="bg-teal-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-teal-700">
                  {hospital.availableICUBeds}
                </p>
                <p className="text-xs text-navy-500 mt-1">Available</p>
              </div>
              <div className="bg-medical-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-medical-700">
                  {availabilityPct}%
                </p>
                <p className="text-xs text-navy-500 mt-1">Available</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center justify-between text-sm text-navy-600 mb-2">
              <span>Availability</span>
              <span className="font-bold">{availabilityPct}%</span>
            </div>
            <div className="w-full bg-navy-100 rounded-full h-3 mb-2">
              <div
                className={`${colors.progress} h-3 rounded-full transition-all`}
                style={{ width: `${availabilityPct}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-sm text-navy-600 mb-2 mt-4">
              <span>Occupancy</span>
              <span className="font-bold">{occupancyPct}%</span>
            </div>
            <div className="w-full bg-navy-100 rounded-full h-3">
              <div
                className="bg-navy-400 h-3 rounded-full transition-all"
                style={{ width: `${occupancyPct}%` }}
              ></div>
            </div>
          </div>

          {/* Ventilator */}
          <div className="bg-white border border-navy-100 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
              <Wind className="w-5 h-5 text-medical-500" />
              Ventilator Availability
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-navy-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-navy-900">
                  {hospital.totalVentilators}
                </p>
                <p className="text-xs text-navy-500 mt-1">Total</p>
              </div>
              <div className="bg-teal-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-teal-700">
                  {hospital.availableVentilators}
                </p>
                <p className="text-xs text-navy-500 mt-1">Available</p>
              </div>
              <div className="bg-emergency-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-emergency-700">
                  {unavailableVentilators}
                </p>
                <p className="text-xs text-navy-500 mt-1">Unavailable</p>
              </div>
            </div>
          </div>

          {/* Hospital Information */}
          <div className="bg-white border border-navy-100 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-medical-500" />
              Hospital Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-navy-400 uppercase tracking-wide mb-1">
                  Address
                </p>
                <p className="text-sm text-navy-800">{hospital.address}</p>
              </div>
              <div>
                <p className="text-xs text-navy-400 uppercase tracking-wide mb-1">
                  Phone
                </p>
                <a
                  href={`tel:${hospital.phone}`}
                  className="text-sm text-medical-600 hover:text-medical-700 font-medium no-underline"
                >
                  {hospital.phone}
                </a>
              </div>
              <div>
                <p className="text-xs text-navy-400 uppercase tracking-wide mb-1">
                  Specialties
                </p>
                <div className="flex flex-wrap gap-2">
                  {hospital.specialties.map((s) => (
                    <span
                      key={s}
                      className="bg-medical-50 text-medical-700 text-xs px-2.5 py-1 rounded-md"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-navy-400 uppercase tracking-wide mb-1">
                  ICU Types
                </p>
                <div className="flex flex-wrap gap-2">
                  {hospital.icuTypes.map((t) => (
                    <span
                      key={t}
                      className="bg-navy-50 text-navy-700 text-xs px-2.5 py-1 rounded-md"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-navy-400 pt-2 border-t border-navy-50">
                <Clock className="w-3.5 h-3.5" />
                Last updated: {formatLastUpdated(hospital.lastUpdated)}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Emergency Actions */}
          <div className="bg-white border border-navy-100 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emergency-500" />
              Emergency Actions
            </h2>
            <div className="space-y-3">
              <a
                href={`tel:${hospital.phone}`}
                className="flex items-center justify-center gap-2 w-full bg-emergency-500 hover:bg-emergency-600 text-white font-bold py-3.5 rounded-lg transition-colors no-underline text-sm"
              >
                <Phone className="w-5 h-5" />
                CALL HOSPITAL
              </a>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-medical-500 hover:bg-medical-600 text-white font-bold py-3.5 rounded-lg transition-colors no-underline text-sm"
              >
                <Navigation className="w-5 h-5" />
                GET DIRECTIONS
              </a>
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-navy-900 rounded-xl p-6 text-white">
            <h3 className="font-bold mb-3 text-sm">Quick Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-navy-300">Status</span>
                <AvailabilityBadge hospital={hospital} />
              </div>
              <div className="flex justify-between">
                <span className="text-navy-300">ICU Beds</span>
                <span className="font-semibold">
                  {hospital.availableICUBeds}/{hospital.totalICUBeds}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-300">Availability</span>
                <span className="font-semibold">{availabilityPct}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-300">Ventilators</span>
                <span className="font-semibold">
                  {hospital.availableVentilators}/{hospital.totalVentilators}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-300">Area</span>
                <span className="font-semibold">{hospital.area}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Section */}
      <LocationSection hospital={hospital} />
    </div>
  );
}
