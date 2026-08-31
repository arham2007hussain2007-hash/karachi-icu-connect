import { Link } from "react-router-dom";
import { MapPin, Navigation, ExternalLink } from "lucide-react";

export default function LocationSection({ hospital }) {
  if (!hospital) return null;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${hospital.latitude},${hospital.longitude}`;

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-navy-900 mb-4 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-medical-500" />
        Location
      </h2>

      <div className="bg-white rounded-xl border border-navy-200 shadow-sm p-5 space-y-4">
        {/* Address */}
        <div>
          <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide mb-1">Address</p>
          <p className="text-sm text-navy-800">{hospital.address}</p>
        </div>

        {/* Area */}
        <div>
          <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide mb-1">Area</p>
          <p className="text-sm text-navy-800">{hospital.area}</p>
        </div>

        {/* Coordinates info */}
        <div>
          <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide mb-1">Location Data</p>
          <p className="text-xs text-navy-500">
            Coordinates available — hospital location is mapped for navigation purposes.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to={`/map?hospital=${hospital.id}`}
            className="inline-flex items-center gap-2 bg-medical-500 hover:bg-medical-600 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors no-underline"
          >
            <MapPin className="w-4 h-4" />
            View on Map
          </Link>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-navy-100 hover:bg-navy-200 text-navy-800 font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors no-underline"
          >
            <Navigation className="w-4 h-4" />
            Get Directions
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
